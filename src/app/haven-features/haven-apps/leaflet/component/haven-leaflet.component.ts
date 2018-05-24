import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';
import { GeoJsonObject } from 'geojson';

import { Subscription } from 'rxjs/Subscription';
import { isUndefined } from 'util';

import { HavenAppInterface } from '../../shared/haven-app-interface';
import { HavenApp } from '../../shared/haven-app';
import { HavenWindow } from '../../../haven-window/shared/haven-window';

import { LayerDownloadService } from '@app/haven-core';
import { LayersService, PortfolioService } from '@app/haven-core';
import { LeafletMapStateService } from '@app/haven-core';
import { LeafletAppInfo } from '../shared/leaflet-app-info';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-haven-leaflet',
  templateUrl: './haven-leaflet.component.html',
  styleUrls: ['./haven-leaflet.component.css']
})
export class HavenLeafletComponent implements HavenAppInterface, OnInit {

  leafletMap: L.Map;
  loaded = false;

  havenWindow: HavenWindow;
  havenApp: HavenApp;
  leafletAppInfo: LeafletAppInfo;

  mapStateSub: Subscription;

  layers = [];
  colorSubs = {};

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

  layerColorInfo = {};

  constructor(private layerDownloadService: LayerDownloadService, private layerService: LayersService, private layerStateService: LeafletMapStateService, private portfolioService: PortfolioService) { }

  ngOnInit() {
    this.leafletAppInfo = this.havenApp.appInfo;
    this.portfolioService.getPortfolioRef().collection('layers')
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const name = doc.data()['name'];
          const color = doc.data()['color'];
          this.layerColorInfo[name] = color;
          if (this.layersControl.overlays.hasOwnProperty(name)) {
            this.layersControl.overlays[name].setStyle({ color: color });
          }
        });
      });
    this.layerDownloadService.getLayers(this.leafletAppInfo.portfolioName).then((layers) => {
      layers.forEach(layer => {
        if (layer) {
          const geojsonFeature: GeoJSON.FeatureCollection<any> = layer.data;
          const newLayer = L.geoJSON(layer.data, {
            style: (feature) => ({
              color: this.layerColorInfo[layer.name]
            }),
          });
          this.layersControl.overlays[layer.name] = newLayer;
        }
      });
      this.mapStateSub = this.layerStateService.mapStateSubs[this.havenApp.appInfo.mapStateSync].subscribe((state) => {
        this.mapStateCheck(state);
      });
      this.loaded = true;
    });

  }

  setMap(leafletMap: L.Map) {
    this.leafletMap = leafletMap;
    this.leafletMap.setView(this.havenApp.appInfo.center, this.havenApp.appInfo.zoom);

    const base = this.havenApp.appInfo.baseLayer.charAt(0).toUpperCase() + this.havenApp.appInfo.baseLayer.slice(1);
    this.leafletMap.removeLayer(this.options.layers[0]);
    this.leafletMap.addLayer(this.baseLayers[base]);

    this.leafletMap.on('zoomend', () => this.stateUpdate());
    this.leafletMap.on('moveend', () => this.stateUpdate());
  }

  stateUpdate() {
    const zoom = this.leafletMap.getZoom();
    const latitude = this.leafletMap.getCenter().lat;
    const longitude = this.leafletMap.getCenter().lng;
    if (this.havenApp.appInfo.mapStateSync !== 4) {
      this.layerStateService.setState(this.havenApp.appInfo.mapStateSync, zoom, L.latLng(latitude, longitude));
    }
  }

  mapStateCheck(state: Object) {
    if (!isUndefined(this.leafletMap)) {
      this.havenApp.appInfo.zoom = state['zoom'];
      this.havenApp.appInfo.center = state['center'];
      this.leafletMap.setView(this.havenApp.appInfo.center, this.havenApp.appInfo.zoom);
    }
  }

  mapStateSyncInc() {
    this.havenApp.appInfo.mapStateSync++;
    this.havenApp.appInfo.mapStateSync = this.havenApp.appInfo.mapStateSync % 5;
    this.mapStateSub.unsubscribe();
    if (this.havenApp.appInfo.mapStateSync !== 4) {
      this.mapStateSub = this.layerStateService.mapStateSubs[this.havenApp.appInfo.mapStateSync].subscribe((state) => {
        this.mapStateCheck(state);
      });
    }
  }

  resize() {
    if (this.loaded) {
      this.leafletMap.invalidateSize();
    }
  }

}
