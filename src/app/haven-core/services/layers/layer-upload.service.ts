import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from '@angular/http';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import { PortfolioService } from '../portfolios/portfolio.service';
import { HavenDialogService } from '@app/haven-shared';

@Injectable()
export class LayerUploadService {

  private supportedLayerExtensions = ['json', 'geojson', 'topojson'];

  constructor(private http: Http, private afAuth: AngularFireAuth, private portfolioService: PortfolioService,  private dialogService: HavenDialogService) { }

  uploadLayer(layerFile: File, layerName: string, layerColor: string, selectedProfiles: string[]) {
    this.loadLayerLocally(layerFile).then((layer) => {
      this.checkLayerFileForCorrectProperties(layer).then((propResults) => {
        if (!propResults) {
          this.dialogService.openErrorDialog('Layer file is incorrectly formatted. Requires format: { type: \'FeatureCollection\', features: [] }');
          return;
        }
        if (selectedProfiles.length > 0) {
          this.checkLayerFilePropertiesMWCF(layer).then((mwcfResults) => {
            if (!mwcfResults) {
              this.dialogService.openErrorDialog('Features in layer file do not include properties \'cf\' or \'MWac\'.');
            }
          });
        }
        this.uploadFile(layerFile, layerName, layerColor, selectedProfiles);
      });
    });
  }

  loadLayerLocally(layerFile: File): Promise<any> {
    return new Promise((complete) => {
      const fr = new FileReader();
      fr.onload = (e: any) => {
        const lines = e.target.result;
        const featureCollection = JSON.parse(lines);
        return complete(featureCollection);
      };
      const layer = fr.readAsText(layerFile);
    });
  }

  checkLayerFileForCorrectProperties(layer: any): Promise<any> {
    return new Promise((complete) => {
      if (!layer.hasOwnProperty('type')) {
        return complete(false);
      }
      if (layer['type'] !== 'FeatureCollection') {
        return complete(false);
      }
      if (!layer.hasOwnProperty('features')) {
        return complete(false);
      }
      return complete(true);
    });
  }

  checkLayerFilePropertiesMWCF(layer: any): Promise<any> {
    return new Promise((complete) => {
      layer['features'].forEach(feature => {
        if (!feature['properties'].hasOwnProperty('MWac') || !feature['properties'].hasOwnProperty('cf')) {
          return complete(false);
        }
        if (isNaN(feature['properties']['MWac']) || isNaN(feature['properties']['cf'])) {
          return complete(false);
        }
      });
      return complete(true);
    });
  }

  uploadFile(layerFile: File, layerName: string, layerColor: string, selectedProfiles?: string[]) {

    const type = '.json';

    const metadata = {
      contentType: `${type}`
    };

    const dialogRef = this.dialogService.openMessageDialog(`${layerName} uploading 0%.`);

    // Upload file and metadata to the object 'images/mountains.jpg'
    const uploadTask = firebase.storage().ref().child(`/${this.afAuth.auth.currentUser.uid}/${this.portfolioService.getSelectedPortfolioName()}/layers/` + layerName).put(layerFile, metadata);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot: any) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        dialogRef.componentInstance.updateMessage(`${layerName} uploading ${Math.trunc(progress)}%.`);

        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            break;
        }
      }, (error: any) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, () => {
        // Upload completed successfully, now we can get the download URL
        const downloadURL = uploadTask.snapshot.downloadURL;
        const layersCollectionRef = this.portfolioService.getSelectedPortfolioRef().collection('layers');
        const newLayerDocument = {
          'name': layerName,
          'url': downloadURL,
          'profiles': selectedProfiles,
          'color': layerColor,
        };
        layersCollectionRef.add(newLayerDocument).then(() => {
          dialogRef.componentInstance.updateMessage(`${layerName} Uploaded Successfully`);
        });
      });
  }

}
