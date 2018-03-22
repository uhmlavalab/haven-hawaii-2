import { Injectable } from '@angular/core';

import { isUndefined } from 'util';
import { Subject } from 'rxjs/subject';
import * as L from 'leaflet';

@Injectable()
export class MapStateService {

  mapState = {
    center: L.latLng([21.480066, -157.96]),
    zoom: 11,
  };

  lastUpdateId = 0;

  mapStateSub: Subject<object>;

  constructor() {
    this.mapStateSub = new Subject<object>();
    this.mapStateSub.next(this.mapState);
  }

  setState(zoom: number, center: L.LatLng) {
    if (zoom !== this.mapState.zoom ||
        !center.equals(this.mapState.center, 0.0005)) {
      this.mapState.center = center;
      this.mapState.zoom = zoom;
      this.mapStateSub.next(this.mapState);

    }
  }

}
