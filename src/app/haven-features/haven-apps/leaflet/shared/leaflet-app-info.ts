import { Type, Input } from '@angular/core';
import * as LeafletGlobals from './leaflet-globals';

export class LeafletAppInfo {

  scenarioName: string;
  scenarioId: number;
  year: number;
  baseLayerName: string;
  lat: number;
  lng: number;
  zoom: number;

  constructor(scenarioName: string, scenarioId: number, year: number, baseLayerName: string, lat: number, lng: number, zoom: number) {
    this.scenarioName = scenarioName;
    this.scenarioId = scenarioId;
    this.year = year;
    this.baseLayerName = baseLayerName;
    this.lat = lat;
    this.lng = lng;
    this.zoom = zoom;
  }

  public getDatabaseObject() {
    return {
      'scenarioName': this.scenarioName,
      'year': this.year,
      'baseLayer': this.baseLayerName,
      'lat': this.lat,
      'lng': this.lng,
      'zoom': this.zoom,
    };
  }

}
