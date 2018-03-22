import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from '@angular/http';

import { HavenDialogService } from '../../../haven-dialog/service/haven-dialog.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable()
export class LayerUploadService {

  private wallReference: string;

  private supportedLayerExtensions = ['json', 'geojson', 'topojson'];

  constructor(private http: Http, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private dialogService: HavenDialogService) { }

  uploadFile(file: File) {

    const extension = file.name.split('.').pop();
    let type: string;

    if (this.supportedLayerExtensions.indexOf(extension) !== -1) {
      type = '.json';
    } else {
      this.dialogService.openErrorDialog('Unsupported File Type Extension. Supported File Types: .json .geojson .topojson');
      return;
    }

    const metadata = {
      contentType: `${type}/${extension}`
    };

    const dialogRef = this.dialogService.openMessageDialog(`${file.name} uploading 0%.`);

    // Upload file and metadata to the object 'images/mountains.jpg'
    const uploadTask = firebase.storage().ref().child(`/users/${this.afAuth.auth.currentUser.uid}/layers/` + file.name).put(file, metadata);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot: any) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        dialogRef.updateMessage(`${file.name} uploading ${Math.trunc(progress)}%.`);

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
        this.db.database.ref(`/users/${this.afAuth.auth.currentUser.uid}/layers/`).orderByChild('name').equalTo(file.name).limitToFirst(1).once('value').then((snapshot) => {
          // No Such Value in database
          if (snapshot.val() === null) {
            this.db.list(`/users/${this.afAuth.auth.currentUser.uid}/layers/`).push({ name: file.name, url: downloadURL }).then(value => {
              dialogRef.updateMessage(`${file.name} upload complete.`);
            });
          } else {
            // Update
            const key = Object.keys(snapshot.val())[0];
            this.db.database.ref(`/users/${this.afAuth.auth.currentUser.uid}/layers/${key}/`).set({ name: file.name, url: downloadURL }).then(value => {
              dialogRef.updateMessage(`${file.name} upload complete.`);
            });
          }
        });
      });
  }

}
