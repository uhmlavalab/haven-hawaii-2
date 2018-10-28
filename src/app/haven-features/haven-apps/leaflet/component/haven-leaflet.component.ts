import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';

import { isUndefined } from 'util';

import { HavenAppInterface } from '../../shared/haven-app-interface';
import { HavenApp } from '../../shared/haven-app';
import { HavenWindow } from '../../../haven-window/shared/haven-window';
import { LeafletAppInfo } from '../shared/leaflet-app-info';
import * as LeafletGlobals from '../shared/leaflet-globals';

@Component({
  selector: 'app-haven-leaflet',
  templateUrl: './haven-leaflet.component.html',
  styleUrls: ['./haven-leaflet.component.css']
})
export class HavenLeafletComponent implements HavenAppInterface, OnInit {

  havenWindow: HavenWindow;
  havenApp: HavenApp;

  leafletMap: L.Map;
  layerColorInfo = {};
  loaded = false;

  layersControl = {
    baseLayers: LeafletGlobals.BaseLayers,
    overlays: {}
  };

  options = {
    layers: [
      LeafletGlobals.BaseLayers.Street
    ],
    zoom: LeafletGlobals.Locations.Oahu.zoom,
    center: LeafletGlobals.Locations.Oahu.center
  };

  super() {

  }
  constructor () {

  }

  ngOnInit() {
    this.options.zoom = this.havenApp.appInfo.zoom;
    this.options.center = L.latLng(this.havenApp.appInfo.lat, this.havenApp.appInfo.lng);
    this.loaded = true;
  }

  setMap(leafletMap: L.Map) {
    this.leafletMap = leafletMap;
    this.leafletMap.setView(this.options.center, this.options.zoom);
    this.leafletMap.addLayer(LeafletGlobals.BaseLayers.Satellite);

    this.leafletMap.on('zoomend', () => {
      this.havenApp.appInfo.zoom = this.leafletMap.getZoom();
    });
    this.leafletMap.on('moveend', () => {
      this.havenApp.appInfo.lat = this.leafletMap.getCenter().lat;
      this.havenApp.appInfo.lng = this.leafletMap.getCenter().lng;
    });
  }

  resize() {
    if (this.loaded) {
      this.leafletMap.invalidateSize();
    }
  }


  // updateSupplyLayerColor(layerName: string, supplyAmount: number) {
  //   let supply = supplyAmount;
  //   const colorSelected = this.layerColorInfo[layerName]['color'];
  //   const colorShaded = this.lightenColor(colorSelected);
  //   const organizedByMWac = [];
  //   Object.keys(this.layersControl.overlays[layerName]['_layers']).forEach(layer => {
  //     const layerProperties = this.layersControl.overlays[layerName]['_layers'][layer]['feature']['properties'];
  //     const MWac = layerProperties['capacity'];
  //     const cf = layerProperties['cf'];
  //     const total = MWac * cf * 8760;
  //     organizedByMWac.push({ 'total': total, 'layer': layer });

  //   });
  //   console.log(colorSelected, layerName, supplyAmount);
  //   organizedByMWac.sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
  //   organizedByMWac.forEach(element => {
  //     if (supply > 0) {
  //       this.layersControl.overlays[layerName]['_layers'][element.layer]['options']['color'] = colorSelected;
  //       this.layersControl.overlays[layerName]['_layers'][element.layer]['options']['weight'] = 1;
  //       supply -= element.total;
  //     } else {
  //       this.layersControl.overlays[layerName]['_layers'][element.layer]['options']['color'] = colorShaded;
  //       this.layersControl.overlays[layerName]['_layers'][element.layer]['options']['weight'] = 1;
  //     }
  //   });
  //   this.loaded = true;
  // }




}
