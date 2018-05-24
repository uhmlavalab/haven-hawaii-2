import { Type } from '@angular/core';
import * as L from 'leaflet';

export class LeafletAppInfo {
  center: L.LatLng;
  zoom: number;
  baseLayer: string;

  mapStateSync: number;

  portfolioName: string;
  scenarioName: string;
  year: number;

  constructor(portfolioName: string, scenarioName: string, year: number, lat: number, lng: number, zoom: number, baseLayer: string) {
    this.center = new L.LatLng(lat, lng);
    this.zoom = zoom;
    this.baseLayer = baseLayer;
    this.mapStateSync = 0;

    this.portfolioName = portfolioName;
    this.scenarioName = scenarioName;
    this.year = year;
  }

}
