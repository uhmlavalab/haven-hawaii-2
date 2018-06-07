import { Type } from '@angular/core';
import { MapState} from '../../../../haven-core/services/leaflet/leaflet-map-state.service';

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

  getObject() {
    return {
      'portfolioName': this.portfolioName,
      'scenarioName': this.scenarioName,
      'year': this.year,
      'baseLayer': this.baseLayer,
      'mapState': {
        'lat': this.mapState.latitude,
        'lng': this.mapState.longitude,
        'zoom': this.mapState.zoom,
        'mapStateId': this.mapState.mapStateId
      }
    };
  }

}
