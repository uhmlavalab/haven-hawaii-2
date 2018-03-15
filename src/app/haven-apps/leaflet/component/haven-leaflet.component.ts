import { Component, OnInit } from '@angular/core';
import { HavenAppInterface } from '../../shared/haven-app-interface';
import { HavenApp } from '../../shared/haven-app';
import { HavenWindow } from '../../../haven-window/shared/haven-window';

import * as L from 'leaflet';
import { GeoJsonObject } from 'geojson';

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

  mapState = {
    latitude: 21.480066,
    longitude: -157.96,
    zoom: 11,
  };

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

  constructor() { }

  ngOnInit() {
  }

  setMap(map: L.Map) {
    this.map = map;
    this.map.on('zoomend', () => this.zoomEnd());
    this.map.on('moveend', () => this.moveEnd());
    this.mapStateCheck();
    this.loaded = true;
  }

  zoomEnd() {
    this.mapState.zoom = this.map.getZoom();
  }

  moveEnd() {
    this.mapState.latitude = this.map.getCenter().lat;
    this.mapState.longitude = this.map.getCenter().lng;
  }

  resize() {
    if (this.loaded) {
      this.map.invalidateSize();
    }
  }

  mapStateCheck() {
    if (this.havenApp.appInfo.mapState === undefined) {
      this.havenApp.appInfo.mapState = this.mapState;
    } else {
      this.mapState = this.havenApp.appInfo.mapState;
    }
    this.options.zoom = this.mapState.zoom;
    this.options.center = L.latLng([this.mapState.latitude, this.mapState.longitude]);
  }

}
