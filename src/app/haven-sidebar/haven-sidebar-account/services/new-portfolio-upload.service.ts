import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { HavenDialogService } from '../../../haven-dialog/service/haven-dialog.service';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

import { Observable } from '@firebase/util';

@Injectable()
export class NewPortfolioUploadService {

  private wallReference: string;

  private supportedFileExtenstions = ['csv'];

  constructor(private http: Http, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private dialogService: HavenDialogService) { }

  uploadCSVFiles(key: File, capacity: File, load: File, profile: File, portfolioName: string) {
    this.uploadCSVFile(key, 'key.csv', portfolioName).then((response) => {
      this.uploadCSVFile(capacity, 'capacity.csv', portfolioName).then((capactiyResponse) => {
        this.uploadCSVFile(load, 'load.csv', portfolioName).then((loadResponse) => {
          this.uploadCSVFile(profile, 'profile.csv', portfolioName).then((profileResponse) => {
            this.intiateServerProcess(portfolioName);
          });
        });
      });
    });
  }

  uploadCSVFile(file: File, fileName: string, portfolioName: string): Promise<boolean> {
    const fileExtenstion = file.name.split('.').pop();
    let type: string;

    if (this.supportedFileExtenstions.indexOf(fileExtenstion) !== -1) {
      type = 'csv';
    } else {
      this.dialogService.openErrorDialog('Unsupported File Type Extension. Supported File Types: .csv');
      return Promise.resolve(false);
    }

    const metadata = {
      contentType: `${type}`
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const uploadTask = firebase.storage().ref().child(`/users/${this.afAuth.auth.currentUser.uid}/portfolios/${portfolioName}/data/` + fileName).put(file, metadata);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot: any) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

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
        return Promise.resolve(false);
      });
    return uploadTask.then(() => {
      return Promise.resolve(true);
    }, (error: any) => {
      return Promise.resolve(false);
    });

  }

  private intiateServerProcess(portfolioName: string) {
    const newPortfolio = `https://us-central1-haven-196001.cloudfunctions.net/app/processNewPortfolio`;
      const req = new XMLHttpRequest();
      req.onload = () => {
        console.log(req.responseText);
      };
      req.onerror = () => {
        console.log(req.responseText);
      };
      req.open('GET', newPortfolio, true);
      req.setRequestHeader('Authorization', this.afAuth.auth.currentUser.uid + ' ' + portfolioName);
      req.send();
  }

}
