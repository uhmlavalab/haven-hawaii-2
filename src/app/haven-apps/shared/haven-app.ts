import { Type } from '@angular/core';

export class HavenApp {
  appName: string;
  appInfo: any;
  constructor(appName: string) {
    this.appName = appName;
    this.appInfo = {};
  }

}
