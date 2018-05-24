import { Injectable } from '@angular/core';

import { isUndefined } from 'util';
import { Subject } from 'rxjs/subject';
import * as L from 'leaflet';

@Injectable()
export class LeafletMapStateService {

  mapStates = [];
  mapStateSubs = [new Subject<object>(), new Subject<object>(), new Subject<object>(), new Subject<object>()];

  constructor() {

    for (let i = 0; i < 4; i++) {
      this.mapStates.push({
        center: L.latLng([21.480066, -157.96]),
        zoom: 11,
      });
    }

    let index = 0;
    this.mapStateSubs.forEach(sub => {
      sub = new Subject<object>();
      sub.next(this.mapStates[index]);
      index++;
    });

  }

  setState(index: number, zoom: number, center: L.LatLng) {
    if (zoom !== this.mapStates[index].zoom || !center.equals(this.mapStates[index].center, 0.0005)) {
      this.mapStates[index].center = center;
      this.mapStates[index].zoom = zoom;
      this.mapStateSubs[index].next(this.mapStates[index]);
    }
  }

}
