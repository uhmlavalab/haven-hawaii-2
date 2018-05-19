import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';
import { GeoJsonObject } from 'geojson';

import { Subscription } from 'rxjs/Subscription';
import { isUndefined } from 'util';

import { HavenAppInterface } from '../../shared/haven-app-interface';
import { HavenApp } from '../../shared/haven-app';
import { HavenWindow } from '../../../haven-window/shared/haven-window';

import { LayerDownloadService } from '@app/haven-core';
import { LayerColorsService } from '@app/haven-core';
import { LayerStateService } from '@app/haven-core';

@Component({
  selector: 'app-haven-leaflet',
  templateUrl: './haven-leaflet.component.html',
  styleUrls: ['./haven-leaflet.component.css']
})
export class HavenLeafletComponent implements HavenAppInterface, OnInit {

  map: L.Map;
  loaded = false;

  havenWindow: HavenWindow;
  havenApp: HavenApp;

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

  constructor(private layerDownloadService: LayerDownloadService, private layerColorsService: LayerColorsService, private layerStateService: LayerStateService) { }

  ngOnInit() {
    this.havenApp.appInfo.layers.forEach(el => {
      this.layerDownloadService.getLayer(el.name).then((layer) => {
        if (layer) {
          const geojsonFeature: GeoJSON.FeatureCollection<any> = {
            'type': 'FeatureCollection',
            'features': []
          };
          const features = layer.features;
          features.forEach(element => {
            geojsonFeature.features.push(element);
          });
          const newLayer = L.geoJSON(geojsonFeature, {
            style: (feature) => ({
              color: this.layerColorsService.getLayerColor(el.name),
            }),
          });
          this.layersControl.overlays[el.name] = newLayer;
          this.colorSubs[el.name] = this.layerColorsService.layerColorsSub[el.name].subscribe((value) => {
            this.layersControl.overlays[el.name].setStyle({ color: value });
          });
        }
      });
    });
    this.mapStateSub = this.layerStateService.mapStateSubs[this.havenApp.appInfo.mapStateSync].subscribe((state) => {
      this.mapStateCheck(state);
    });
    this.loaded = true;
  }

  setMap(map: L.Map) {
    this.map = map;
    this.map.setView(this.havenApp.appInfo.center, this.havenApp.appInfo.zoom);

    const base = this.havenApp.appInfo.baseLayer.charAt(0).toUpperCase() + this.havenApp.appInfo.baseLayer.slice(1);
    this.map.removeLayer(this.options.layers[0]);
    this.map.addLayer(this.baseLayers[base]);

    this.map.on('zoomend', () => this.stateUpdate());
    this.map.on('moveend', () => this.stateUpdate());
  }

  stateUpdate() {
    const zoom = this.map.getZoom();
    const latitude = this.map.getCenter().lat;
    const longitude = this.map.getCenter().lng;
    if (this.havenApp.appInfo.mapStateSync !== 4) {
      this.layerStateService.setState(this.havenApp.appInfo.mapStateSync, zoom, L.latLng(latitude, longitude));
    }
  }

  mapStateCheck(state: Object) {
    if (!isUndefined(this.map)) {
      this.havenApp.appInfo.zoom = state['zoom'];
      this.havenApp.appInfo.center = state['center'];
      this.map.setView(this.havenApp.appInfo.center, this.havenApp.appInfo.zoom);
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
      this.map.invalidateSize();
    }
  }

}
