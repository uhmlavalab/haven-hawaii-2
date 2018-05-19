import { Type } from '@angular/core';
import * as L from 'leaflet';

export class LeafletAppInfo {
  center: L.LatLng;
  zoom: number;
  baseLayer: string;
  layers: any[];

  mapStateSync: number;

  constructor(lat: number, lng: number, zoom: number, baseLayer: string, layers: any[]) {
    this.center = new L.LatLng(lat, lng);
    this.zoom = zoom;
    this.baseLayer = baseLayer;
    this.layers = layers;
    this.mapStateSync = 0;
  }

}
