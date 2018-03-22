import { Injectable } from '@angular/core';
import { Colors } from './colors';
import { isUndefined } from 'util';
import { Subject } from 'rxjs/subject';

@Injectable()
export class LayerColorsService {

  layerColorsSub = {};
  layerColors = {};

  colorIndex = 0;

  constructor() {}

  public getLayerColor(layerName: string): string {
    if (isUndefined(this.layerColors[layerName])) {
      const randColor = Colors[this.colorIndex];
      this.colorIndex = (this.colorIndex + 1) % Colors.length;
      this.layerColors[layerName] = randColor;
      this.layerColorsSub[layerName] = new Subject<string>();
      this.layerColorsSub[layerName].next(randColor);
      return randColor;
    } else {
      return this.layerColors[layerName];
    }
  }

  public setLayerColor(layerName: string, color: string) {
    this.layerColors[layerName] = color;
    this.layerColorsSub[layerName].next(color);
  }

}
