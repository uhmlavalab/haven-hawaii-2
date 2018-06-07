import { Injectable } from '@angular/core';
import { HavenWindow } from '../../../haven-features/haven-window/shared/haven-window';
import { PlotlyAppInfo } from '../../../haven-features/haven-apps/plotly/shared/plotly-app-info';
import { LeafletAppInfo } from '../../../haven-features/haven-apps/leaflet/shared/leaflet-app-info';
import { HavenApp } from '../../../haven-features/haven-apps/shared/haven-app';
import { MapState} from '../leaflet/leaflet-map-state.service';


import * as firebase from 'firebase';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { PortfolioService } from '../portfolios/portfolio.service';

@Injectable()
export class HavenWindowService {

  private windows: HavenWindow[] = [];
  private windowsZIndex = {};

  WindowZUpdate = new Subject<Object>();
  HavenWindowAdd = new Subject<HavenWindow>();
  HavenWindowRemove = new Subject<HavenWindow>();

  numberOfWindows = 0;

  constructor(private portfolioService: PortfolioService) {

  }

  getWindows(): Promise<HavenWindow[]> {
    return Promise.resolve(this.windows);
  }

  removeWindow(wId) {
    for (let i = this.windows.length - 1; i >= 0; i--) {
      if (this.windows[i].id === wId) {
        this.HavenWindowRemove.next(this.windows[i]);
        this.windows.splice(i, 1);
        this.removeZWindow(wId);
      }
    }
  }

  addWindow(win: HavenWindow) {
    win.id = this.numberOfWindows;
    this.numberOfWindows++;
    this.windows.push(win);
    this.HavenWindowAdd.next(win);
    this.addZWindow(win.id);
    return win.id;
  }

  setWindows(Windows: any[]) {
    this.clearWindows();
    Windows.forEach(el => {
      this.addWindow(el);
      el.app.appInfo.winId = el.id;
    });
  }

  getWindow(wId: number): Promise<HavenWindow> {
    for (let i = this.windows.length - 1; i >= 0; i--) {
      if (this.windows[i].id === wId) { return Promise.resolve(this.windows[i]); }
    }
  }

  clearWindows() {
    for (let i = 0; i < this.windows.length; i++) {
      this.HavenWindowRemove.next(this.windows[i]);
      this.removeZWindow(this.windows[i].id);
    }
    this.windows.length = 0;
  }

  bringWindowForward(windowId: number) {
    const winZ = this.windowsZIndex[windowId];
    for (const winId in this.windowsZIndex) {
      if (this.windowsZIndex[winId] > winZ) {
        this.windowsZIndex[winId]--;
      }
    }
    this.windowsZIndex[windowId] = this.windows.length;
    this.WindowZUpdate.next(this.windowsZIndex);
  }

  addZWindow(windowId: number) {
    this.windowsZIndex[windowId] = this.windows.length;
    this.WindowZUpdate.next(this.windowsZIndex);
  }

  removeZWindow(windowId: number) {
    const winZ = this.windowsZIndex[windowId];
    delete this.windowsZIndex[windowId];
    for (const winId in this.windowsZIndex) {
      if (this.windowsZIndex[winId] > winZ) {
        this.windowsZIndex[winId]--;
      }
    }
    this.WindowZUpdate.next(this.windowsZIndex);
  }

  saveWindowSession(sessionName: string) {
    console.log('Save this', sessionName);
    this.portfolioService.getSessionsCollection().add({ 'sessionName': sessionName, timestamp: firebase.firestore.FieldValue.serverTimestamp() }).then((value) => {
      const windowsCollection = this.portfolioService.getSessionsCollection().doc(value.id).collection('windows');
      const batch = firebase.firestore().batch();
      this.windows.forEach(window => {
        const windowKey = windowsCollection.doc();
        batch.set(windowKey, window.getObject());
      });
      batch.commit().then(() => {
        console.log(sessionName, 'Session Saved Successfully');
      });
    });

  }

  deleteWindowSession(timestamp: Date) {
    this.portfolioService.getSessionsCollection().where('timestamp', '==', timestamp).limit(1).get().then((value) => {
      const sessionId = value.docs[0].id;
      this.portfolioService.getSessionsCollection().doc(sessionId).collection('windows').get().then((windows) => {
        windows.forEach(window => {
          this.portfolioService.getSessionsCollection().doc(sessionId).collection('windows').doc(window.id).delete();
        });
        this.portfolioService.getSessionsCollection().doc(sessionId).delete();
      });
    });
  }

  loadWindowSession(timestamp: Date) {
    this.clearWindows();
    this.portfolioService.getSessionsCollection().where('timestamp', '==', timestamp).limit(1).get().then((value) => {
      const sessionId = value.docs[0].id;
      this.portfolioService.getSessionsCollection().doc(sessionId).collection('windows').get().then((windows) => {
        windows.forEach(window => {
          const leafletNames = ['leaflet'];
          const plotlyNames = ['plotly-scatter', 'plotly-bar', 'plotly-heatmap', 'plotly-surface'];
          const windowData = window.data();
          const appData = windowData.app;
          if (plotlyNames.indexOf(appData.appName) !== -1) {
            const newWindow = new HavenWindow(windowData.header, windowData.footer, windowData.position.left, windowData.position.top, windowData.size.width, windowData.size.height, windowData.sidebar);
            const appInfo = this.newPlotlyApp(appData.appInfo);
            const app = new HavenApp(appData.appName, appInfo);
            newWindow.app = app;
            this.addWindow(newWindow);
          } else if (leafletNames.indexOf(appData.appName) !== -1) {
            const newWindow = new HavenWindow(windowData.header, windowData.footer, windowData.position.left, windowData.position.top, windowData.size.width, windowData.size.height, windowData.sidebar);
            const appInfo = this.newLeafletApp(appData.appInfo);
            const app = new HavenApp(appData.appName, appInfo);
            newWindow.app = app;
            this.addWindow(newWindow);
          }

        });
      });
    });
  }

  newPlotlyApp(appInfo: PlotlyAppInfo): PlotlyAppInfo {
    return new PlotlyAppInfo(
      appInfo.portfolioName,
      appInfo.scenarioName,
      appInfo.loadName,
      appInfo.startDate,
      appInfo.endDate,
      appInfo.valueName,
      appInfo.scope,
      appInfo.chartType);
  }

  newLeafletApp(appInfo: LeafletAppInfo): LeafletAppInfo {
    return new LeafletAppInfo(
      appInfo.portfolioName,
      appInfo.scenarioName,
      appInfo.year,
      appInfo.mapState['lat'],
      appInfo.mapState['lng'],
      appInfo.mapState.zoom,
      appInfo.baseLayer);
  }
}
