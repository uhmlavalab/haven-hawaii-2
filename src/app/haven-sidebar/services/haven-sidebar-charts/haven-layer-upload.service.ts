import { Injectable } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions } from '@angular/http';

import * as firebase from 'firebase';

@Injectable()
export class HavenLayerUploadService {

  private wallReference: string;

  private supportedLayerExtensions = ['json', 'geojson', 'topojson'];

  constructor(private http: Http) { }

  uploadFile(file: File) {

    const extension = file.name.split('.').pop();
    let type: string;

    if (this.supportedLayerExtensions.indexOf(extension) !== -1) {
      type = '.json';
    } else {
      console.log('unsupported file extension');
      return;
    }

    const metadata = {
      contentType: `${type}/${extension}`
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const uploadTask = firebase.storage().ref().child('test' + file.name).put(file, metadata);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot: any) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
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
        const db = firebase.firestore();
        db.collection('storage').add({
          name: file.name,

        })
          .then(function (docRef) {
            console.log('Document written with ID: ', docRef.id);
          })
          .catch(function (error) {
            console.error('Error adding document: ', error);
          });
      });
  }

  getData(fileUrl: string, fileType: string, fileName: string) {
    if (fileType === 'image') {
      return {
        fileUrl: fileUrl,
        fileName: fileName,
        appType: fileType,
      };
    } else if (fileType === 'video') {
      return {
        fileUrl: fileUrl,
        fileName: fileName,
        appType: fileType,
        paused: true,
        currentTime: 0.0,
      };
    }
  }

}
