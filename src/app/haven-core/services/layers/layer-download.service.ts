import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorage } from 'angularfire2/storage';
import * as firebase from 'firebase';
import { Observable } from '@firebase/util';

@Injectable()
export class LayerDownloadService {

  mapurl;
  layers = {};

  constructor(private afAuth: AngularFireAuth, private storage: AngularFireStorage) {}

  getLayer(name: string): Promise<any> {
    if (this.layers.hasOwnProperty(name)) {
      return Promise.resolve(this.layers[name]);
    } else {
      return this.downloadLayer(name).then((result) => {
        if (result) {
          return Promise.resolve(this.layers[name]);
        } else {
          return Promise.resolve(false);
        }
      });
    }
  }

  downloadLayer(name: string): Promise<boolean | void | any> {
    const storageURL = `/users/${this.afAuth.auth.currentUser.uid}/layers/${name}`;
    const ref = this.storage.ref(storageURL);
    return ref.getDownloadURL().toPromise().then((url) => {
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
            this.layers[name] =  data;
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
