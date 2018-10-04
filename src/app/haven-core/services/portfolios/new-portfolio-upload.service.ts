import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { PapaParseService } from 'ngx-papaparse';
import { HavenDialogService } from '@app/haven-shared';

import { PortfolioService } from './portfolio.service';

import * as firebase from 'firebase';


@Injectable()
export class NewPortfolioUploadService {

  private totalBytes: number;
  private transferredBytes: number;
  private dialogRef: any;

  constructor(private afAuth: AngularFireAuth, private papa: PapaParseService, private portfolioService: PortfolioService, private dialogService: HavenDialogService) { }

  arrayToLowerCase(input) {
    return input.join('|').toLowerCase().split('|');
  }

  uploadNRELFiles(capacityFile: File, curtailmentFile: File, groupsFile: File, powerFile: File, resourcesFile: File, storageFile: File, storageCapacityFile: File, summaryFile: File, portfolioName: string) {
    this.totalBytes = capacityFile.size + curtailmentFile.size + groupsFile.size + powerFile.size + resourcesFile.size + storageFile.size + storageCapacityFile.size + summaryFile.size;
    this.transferredBytes = 0;
    this.dialogRef = this.dialogService.openMessageDialog(`Uploading 0%`);
    this.uploadFile(capacityFile, 'capacity', portfolioName);
    this.uploadFile(curtailmentFile, 'curtailment', portfolioName);
    this.uploadFile(groupsFile, 'groups', portfolioName);
    this.uploadFile(powerFile, 'power', portfolioName);
    this.uploadFile(resourcesFile, 'resources', portfolioName);
    this.uploadFile(storageFile, 'storage', portfolioName);
    this.uploadFile(storageCapacityFile, 'storageCapacity', portfolioName);
    this.uploadFile(summaryFile, 'summary', portfolioName);
  }

  uploadFile(csvFile: File, fileName: string, portfolioName: string) {
    const metadata = {
      contentType: '.csv'
    };
    let lastByte = 0;
    // Upload file and metadata to the object 'images/mountains.jpg'
    const uploadTask = firebase.storage().ref().child(`/${this.afAuth.auth.currentUser.uid}/${portfolioName}/data/` + fileName).put(csvFile, metadata);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot: any) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        this.transferredBytes += (snapshot.bytesTransferred - lastByte);
        lastByte = snapshot.bytesTransferred;
        const progress = (this.transferredBytes / this.totalBytes) * 100;
        this.dialogRef.componentInstance.updateMessage(`Uploading ${Math.trunc(progress)}%.`);

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
        const newLayerDocument = {
          'portfolioName': portfolioName,
        };
        firebase.firestore().collection(this.afAuth.auth.currentUser.uid).doc('data').collection('portfolios').doc(portfolioName).set({ name: portfolioName });
      });
  }

}
