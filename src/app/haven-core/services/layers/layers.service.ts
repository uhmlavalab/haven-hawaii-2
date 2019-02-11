import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';

import { ScenariosService } from '../scenarios/scenarios.service';

@Injectable()
export class LayersService {

  mapurl;
  layers = {};

  constructor(private afAuth: AngularFireAuth, private scenariosService: ScenariosService) {
  }

  public getLayers(scenarioName: string): Promise<any[]> {
    return new Promise((complete) => {
      const layernames = ['dod.json', 'existing_renewable.json', 'solar.json', 'agriculture.json'];
      const layers = [];
      const promises = [];
      layernames.forEach(layerName => {
        const promise = this.getLayer(scenarioName, layerName).then((result) => {
          layers.push(result);
        });
        promises.push(promise);
      });
      return Promise.all(promises).then(() => {
        return complete(layers);
      });
    });
  }

  private getLayer(scenarioName: string, layerName: string): Promise<any> {
    if (this.layers.hasOwnProperty(scenarioName)) {
      if (this.layers[scenarioName].hasOwnProperty(layerName)) {
        return Promise.resolve(this.layers[scenarioName][layerName]);
      } else {
        this.layers[scenarioName][layerName] = {};
        return this.downloadLayer(scenarioName, layerName).then((result) => {
          if (result) {
            return Promise.resolve(this.layers[scenarioName][layerName]);
          } else {
            return Promise.resolve(false);
          }
        });
      }
    } else {
      this.layers[scenarioName] = {};
      this.layers[scenarioName][layerName] = {};
      return this.downloadLayer(scenarioName, layerName).then((result) => {
        if (result) {
          return Promise.resolve(this.layers[scenarioName][layerName]);
        } else {
          return Promise.resolve(false);
        }
      });
    }
  }

  private downloadLayer(scenarioName: string, layerName: string): Promise<boolean | void | any> {
    const storageURL = `/mapdata/oahu_layers/${layerName}`;
    const ref = firebase.storage().ref(storageURL);
    return ref.getDownloadURL().then((url) => {
      return new Promise((resolve, reject) => {
        // Do the usual XHR stuff
        const req = new XMLHttpRequest();
        req.responseType = 'json';
        req.open('GET', url);
        req.onload = () => {
          // This is called even on 404 etc
          // so check the status
          if (req.status === 200) {
            // Resolve the promise with the response text
            const data = JSON.parse(JSON.stringify(req.response));
            const layer = { 'name': layerName, 'data': data };
            this.layers[scenarioName][layerName] = layer;
            resolve(true);
          } else {
            // Otherwise reject with the status text
            // which will hopefully be a meaningful error
            reject(false);
          }
        };

        // Handle network errors
        req.onerror = function () {
          reject(Error('Network Error'));
        };

        // Make the request
        req.send();
      });
    });
  }

}
