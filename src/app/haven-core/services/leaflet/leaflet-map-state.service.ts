import { Injectable } from '@angular/core';

import { isUndefined } from 'util';
import { Subject } from 'rxjs/subject';
import * as L from 'leaflet';

@Injectable()
export class LeafletMapStateService {

  mapMoveSub = new Subject<any>();
  mapZoomSub = new Subject<any>();

  constructor() {  }

  setLoacation(mapState: MapState, windowId: number) {
    this.mapMoveSub.next({ 'state': mapState, 'windowId':  windowId });
  }

  setZoom(mapState: MapState, windowId: number) {
    this.mapZoomSub.next({ 'state': mapState, 'windowId':  windowId });
  }

}

export class MapState {
  latitude: number;
  longitude: number;
  zoom: number;
  mapStateId: number;

  constructor(latitude: number, longitude: number, zoom: number, mapStateId: number) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoom = zoom;
    this.mapStateId = mapStateId;
  }
}
