import { Component, OnInit } from '@angular/core';
import { HavenAppInterface } from '../../shared/haven-app-interface';
import { HavenApp } from '../../shared/haven-app';
import { HavenWindow } from '../../../haven-window/shared/haven-window';

import * as L from 'leaflet';
import { GeoJsonObject } from 'geojson';

import { AngularFireAuth } from 'angularfire2/auth';
import { LayerDownloadService } from '../services/layer-download.service';

import * as firebase from 'firebase';
import { AngularFireStorage } from 'angularfire2/storage';
import { LayerColorsService } from '../services/layer-colors.service';
import { MapStateService } from '../services/map-state.service';
import { Subscription } from 'rxjs/Subscription';
import { isUndefined } from 'util';

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

  mapStateSub = Subscription;

  layers = [];
  colorSubs = {};

  layersControl = {
    baseLayers: {
      'Street': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }),
      'Gray': L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}',
        {
          maxZoom: 18,
          attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }),
      'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 18,
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }),
      'Topographic': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        })
    },
    overlays: {
    }
  };

  options = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }),
    ],
    zoom: 11,
    center: L.latLng([21.480066, -157.96])
  };

  constructor(private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private layerDownloadService: LayerDownloadService,
    private layerColorsService: LayerColorsService,
    private mapStateService: MapStateService) {
    this.mapStateService.mapStateSub.subscribe((state) => {
      this.mapStateCheck(state);
    });

  }

  ngOnInit() {
    this.havenApp.appInfo.selectedLayers.forEach(el => {
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
    this.loaded = true;
  }

  setMap(map: L.Map) {
    this.map = map;
    this.map.on('zoomend', () => this.stateUpdate());
    this.map.on('moveend', () => this.stateUpdate());
  }

  stateUpdate() {
    const zoom = this.map.getZoom();
    const latitude = this.map.getCenter().lat;
    const longitude = this.map.getCenter().lng;
    this.mapStateService.setState(zoom, L.latLng(latitude, longitude));
  }

  mapStateCheck(state: Object) {
    if (!isUndefined(this.map)) {
      this.options.zoom = state['zoom'];
      this.options.center = state['center'];
      this.map.setView(this.options.center, this.options.zoom);
      console.log('state update');
    }
  }

  resize() {
    if (this.loaded) {
      this.map.invalidateSize();
    }
  }

}
