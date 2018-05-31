import { Type } from '@angular/core';
import { MapState} from '@app/haven-core';

export class LeafletAppInfo {

  portfolioName: string;
  scenarioName: string;
  year: number;

  mapState: MapState;
  baseLayer: string;

  constructor(portfolioName: string, scenarioName: string, year: number, lat: number, lng: number, zoom: number, baseLayer: string) {

    this.portfolioName = portfolioName;
    this.scenarioName = scenarioName;
    this.year = year;

    this.baseLayer = baseLayer;
    this.mapState = new MapState(lat, lng, zoom, 0);

  }

}
