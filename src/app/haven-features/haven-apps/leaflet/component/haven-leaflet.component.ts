import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import * as L from 'leaflet';
import { GeoJsonObject } from 'geojson';

import { isUndefined } from 'util';

import { HavenAppInterface } from '../../shared/haven-app-interface';
import { HavenApp } from '../../shared/haven-app';
import { HavenWindow } from '../../../haven-window/shared/haven-window';
import { LeafletAppInfo } from '../shared/leaflet-app-info';

import { PortfolioService, LayersService, LayerDownloadService, LeafletMapStateService, MapState } from '@app/haven-core';

@Component({
  selector: 'app-haven-leaflet',
  templateUrl: './haven-leaflet.component.html',
  styleUrls: ['./haven-leaflet.component.css']
})
export class HavenLeafletComponent implements HavenAppInterface, OnInit {

  havenWindow: HavenWindow;
  havenApp: HavenApp;
  leafletAppInfo: LeafletAppInfo;

  leafletMap: L.Map;
  mapLocationSub: Subscription;
  mapZoomSub: Subscription;
  layerColorInfo = {};
  loaded = false;

  ignoreMoveUpdate = false;
  ignoreZoomUpdate = false;

  baseLayers = {
    'Street': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }),
    'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }),
    'Terrain': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      })
  };

  layersControl = {
    baseLayers: this.baseLayers,
    overlays: {}
  };

  options = {
    layers: [
      this.baseLayers.Street
    ],
    zoom: 11,
    center: L.latLng([21.480066, -157.96])
  };


  constructor(private portfolioService: PortfolioService, private layerService: LayersService, private layerDownloadService: LayerDownloadService, private mapStateService: LeafletMapStateService) { }

  ngOnInit() {
    this.leafletAppInfo = this.havenApp.appInfo;
    this.options.zoom = this.leafletAppInfo.mapState.zoom;
    this.options.center = L.latLng(this.leafletAppInfo.mapState.latitude, this.leafletAppInfo.mapState.longitude);

    this.portfolioService.getPortfolioRef(this.leafletAppInfo.portfolioName).collection('layers').onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const name = doc.data()['name'];
        const color = doc.data()['color'];
        const profiles = doc.data()['profiles'];
        this.layerColorInfo[name] = {color: color, profiles: profiles };
        if (this.layersControl.overlays.hasOwnProperty(name)) {
          this.layersControl.overlays[name].setStyle({ color: color });
        }
      });
    });

    this.layerDownloadService.getLayers(this.leafletAppInfo.portfolioName).then((layers) => {
      let waitForLayerColors = false;
      layers.forEach(layer => {
        if (layer) {
          const geojsonFeature: GeoJSON.FeatureCollection<any> = layer.data;
          if (this.layerColorInfo[layer.name]['profiles'].length > 0) {
            waitForLayerColors = true;
            this.layerService.getSupplyOfProfiles(this.leafletAppInfo, this.layerColorInfo[layer.name]['profiles']).then((supplyAmount) => {
              this.layerColorInfo[layer.name]['supplyAmount'] = supplyAmount;
              this.updateSupplyLayerColor(layer.name, supplyAmount);
            });
          }
          const newLayer = L.geoJSON(layer.data, {
            style: (feature) => ({
              color: this.layerColorInfo[layer.name]['color']
            }),
          });
          this.layersControl.overlays[layer.name] = newLayer;
        }
      });
      if (!waitForLayerColors) {
        this.loaded = true;
      }

    });

    this.mapLocationSub = this.mapStateService.mapMoveSub.subscribe((stateUpdate) => {
      this.mapMoveCheck(stateUpdate['state'], stateUpdate['windowId'], true);
    });
    this.mapZoomSub = this.mapStateService.mapZoomSub.subscribe((stateUpdate) => {
      this.mapZoomCheck(stateUpdate['state'], stateUpdate['windowId'], true);
    });
  }


  setMap(leafletMap: L.Map) {
    this.leafletMap = leafletMap;
    this.leafletMap.setView(this.options.center, this.options.zoom);

    const base = this.havenApp.appInfo.baseLayer.charAt(0).toUpperCase() + this.havenApp.appInfo.baseLayer.slice(1);
    this.leafletMap.removeLayer(this.options.layers[0]);
    this.leafletMap.addLayer(this.baseLayers[base]);

    this.leafletMap.on('zoomend', (e) => this.mapZoomCheck(this.leafletAppInfo.mapState, this.havenWindow.id, false));
    this.leafletMap.on('moveend', (e) => this.mapMoveCheck(this.leafletAppInfo.mapState, this.havenWindow.id, false));
  }


  mapMoveCheck(mapState: MapState, windowId: number, fromSub: boolean) {
    if (!isUndefined(this.leafletMap)) {
      if (!this.ignoreMoveUpdate) {
        if (fromSub) {
          if (windowId !== this.havenWindow.id) {
            if (mapState.mapStateId === this.leafletAppInfo.mapState.mapStateId) {
              // from sub, different window, same id
              this.leafletAppInfo.mapState.latitude = mapState.latitude;
              this.leafletAppInfo.mapState.longitude = mapState.longitude;
              this.leafletMap.flyTo(L.latLng(this.leafletAppInfo.mapState.latitude, this.leafletAppInfo.mapState.longitude));
              this.ignoreMoveUpdate = true;
            }
          }
        } else {
          // NOT from sub, same window
          const center = this.leafletMap.getCenter();
          this.leafletAppInfo.mapState.latitude = center.lat;
          this.leafletAppInfo.mapState.longitude = center.lng;
          this.mapStateService.setLoacation(this.leafletAppInfo.mapState, this.havenWindow.id);
        }
      } else {
        this.ignoreMoveUpdate = false;
      }
    }
  }

  updateSupplyLayerColor(layerName: string, supplyAmount: number) {
    let supply = supplyAmount;
    const colorShaded = this.layerColorInfo[layerName]['color'];
    const organizedByMWac = [];
    Object.keys(this.layersControl.overlays[layerName]['_layers']).forEach(layer => {
      const layerProperties = this.layersControl.overlays[layerName]['_layers'][layer]['feature']['properties'];
      const MWac = layerProperties['capacity'];
      const cf = layerProperties['cf'];
      const total = MWac * cf * 8760;
      organizedByMWac.push({'total': total, 'layer': layer });

    });
    organizedByMWac.sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
    organizedByMWac.forEach(element => {
      if (supply > 0) {
        this.layersControl.overlays[layerName]['_layers'][element.layer]['options']['color'] = colorShaded;
        supply -= element.total;
      } else {
        this.layersControl.overlays[layerName]['_layers'][element.layer]['options']['color'] = '#FFFFFF';
      }
    });
    this.loaded = true;
  }

  mapZoomCheck(mapState: MapState, windowId: number, fromSub: boolean) {
    if (!isUndefined(this.leafletMap)) {
      if (!this.ignoreZoomUpdate) {
        if (fromSub) {
          if (windowId !== this.havenWindow.id) {
            if (mapState.mapStateId === this.leafletAppInfo.mapState.mapStateId) {
              // from sub, different window, same id
              this.leafletAppInfo.mapState.zoom = mapState.zoom;
              this.leafletMap.setZoom(this.leafletAppInfo.mapState.zoom);
              this.ignoreMoveUpdate = true;
            }
          }
        } else {
          // NOT from sub, same window
          const zoom = this.leafletMap.getZoom();
          this.leafletAppInfo.mapState.zoom = zoom;
          this.mapStateService.setZoom(this.leafletAppInfo.mapState, this.havenWindow.id);
        }
      } else {
        this.ignoreZoomUpdate = false;
      }
    }
  }

  mapStateSyncInc() {
    this.leafletAppInfo.mapState.mapStateId++;
    this.leafletAppInfo.mapState.mapStateId = this.leafletAppInfo.mapState.mapStateId % 5;
  }

  resize() {
    if (this.loaded) {
      this.leafletMap.invalidateSize();
    }
  }

}
