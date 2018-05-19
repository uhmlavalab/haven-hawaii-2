import { Type } from '@angular/core';
import * as L from 'leaflet';

export class PlotlyAppInfo {
  startDate: Date;
  endDate: Date;
  value: string;

  constructor(startDate: Date, endDate: Date, value: string) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.value = value;
  }

}
