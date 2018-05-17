import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { PapaParseService } from 'ngx-papaparse';

import * as firebase from 'firebase';


import { NewPortfolioUploadService } from '../../../haven-sidebar/haven-sidebar-account/services/new-portfolio-upload.service';

@Component({
  selector: 'app-new-portfolio',
  templateUrl: './new-portfolio.component.html',
  styleUrls: ['./new-portfolio.component.css']
})
export class NewPortfolioComponent {

  title = 'New Portfolio Creation';

  keyToolTip = 'Station Key';
  capacityToolTip = 'Yearly Capactiy';
  loadToolTip = 'Hourly Load';
  supplyToolTip = 'Hourly Profiles';

  keyData = [];
  loadData = [];
  capData = [];
  profileData = [];
  keyIn = false;
  capIn = false;
  loadIn = false;
  profileIn = false;

  database: firebase.firestore.CollectionReference;
  public portfolioName = '';

  progressValue = 0;
  allFilesUploaded = false;

  numOfDocs = 0;
  numTotalDocs = 0;

  @ViewChild('keyInput') keyFileInput: ElementRef;
  @ViewChild('capInput') capFileInput: ElementRef;
  @ViewChild('loadInput') loadFileInput: ElementRef;
  @ViewChild('profileInput') profileFileInput: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<NewPortfolioComponent>,
    private papa: PapaParseService,
    private portUploadService: NewPortfolioUploadService,
    @Inject(MAT_DIALOG_DATA) public data: any, private afAuth: AngularFireAuth) {
    this.database = firebase.firestore().collection(`${this.afAuth.auth.currentUser.uid}`).doc('portfolios').collection('data');
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  onKeyInput(event) {
    const csv = this.keyFileInput.nativeElement.files[0];
    this.papa.parse(csv, {
      complete: (results) => {
        const columns = this.arrayToLowerCase(results.data[0]);
        let idIdx, staIdx, typeIdx, profIdx, renewIdx = -1;
        for (let i = 0; i < columns.length; i++) {
          switch (columns[i]) {
            case 'id':
              idIdx = i;
              break;
            case 'station name':
              staIdx = i;
              break;
            case 'fuel type':
              typeIdx = i;
              break;
            case 'profile':
              profIdx = i;
              break;
            case 'renewable':
              renewIdx = i;
              break;
          }
        }
        for (let i = 1; i < results.data.length; i++) {
          this.keyData.push(
            {
              'id': Number.parseInt(results.data[i][idIdx]),
              'station name': results.data[i][staIdx].toLowerCase(),
              'fuel type': results.data[i][typeIdx].toLowerCase(),
              'profile': results.data[i][profIdx].toLowerCase(),
              'renewable': (results.data[i][renewIdx] === 'TRUE' ? true : false),
            }
          );
        }
        this.keyIn = true;
        this.progressValue += 25;
      }
    });
  }

  onCapInput(event) {
    const csv = this.capFileInput.nativeElement.files[0];
    this.papa.parse(csv, {
      complete: (results) => {
        const columns = this.arrayToLowerCase(results.data[0]);
        let idIdx, yearIdx, capIdx = -1;
        for (let i = 0; i < columns.length; i++) {
          switch (columns[i]) {
            case 'id':
              idIdx = i;
              break;
            case 'year':
              yearIdx = i;
              break;
            case 'capacity':
              capIdx = i;
              break;
          }
        }
        for (let i = 1; i < results.data.length; i++) {
          this.capData.push(
            {
              'id': Number.parseInt(results.data[i][idIdx]),
              'year': Number.parseInt(results.data[i][yearIdx]),
              'capacity': Number.parseFloat(results.data[i][capIdx].replace(/,/g, '')),
            }
          );
        }
        this.capIn = true;
        this.progressValue += 25;
      }
    });
  }

  onLoadInput(event) {
    const csv = this.loadFileInput.nativeElement.files[0];
    this.papa.parse(csv, {
      complete: (results) => {
        const columns = this.arrayToLowerCase(results.data[0]);
        let timeIdx, loadIdx = -1;
        for (let i = 0; i < columns.length; i++) {
          switch (columns[i]) {
            case 'time':
              timeIdx = i;
              break;
            case 'load':
              loadIdx = i;
              break;
          }
        }
        for (let i = 1; i < results.data.length; i++) {
          this.loadData.push(
            {
              'time': new Date(results.data[i][timeIdx]),
              'load': Number.parseFloat(results.data[i][loadIdx].replace(/,/g, '')),
            }
          );
        }
        this.loadIn = true;
        this.progressValue += 25;
      }
    });
  }

  onProfileInput(event) {
    const csv = this.profileFileInput.nativeElement.files[0];
    this.papa.parse(csv, {
      complete: (results) => {
        const columns = this.arrayToLowerCase(results.data[0]);
        const indexs = {};
        for (let i = 0; i < columns.length; i++) {
          indexs[columns[i]] = i;
        }
        for (let i = 1; i < results.data.length; i++) {
          const row = {};
          for (let j = 0; j < columns.length; j++) {
            if (columns[j] === 'time') {
              row[columns[j]] = new Date(results.data[i][indexs[columns[j]]]);
            } else {
              row[columns[j]] = Number.parseFloat(results.data[i][indexs[columns[j]]].replace(/,/g, ''));
            }
          }
          this.profileData.push(row);
        }
        this.profileIn = true;
        this.progressValue += 25;
        if (this.progressValue === 100) {
          this.allFilesUploaded = true;
        }
      }
    });
  }

  uploadFiles() {
    const profile = this.profileFileInput.nativeElement.files[0];
    const load = this.loadFileInput.nativeElement.files[0];
    const cap = this.capFileInput.nativeElement.files[0];
    const key = this.keyFileInput.nativeElement.files[0];
    this.portUploadService.uploadCSVFiles(key, cap, load, profile, this.portfolioName);
    // if (this.portfolioName !== '') {
    //   this.numTotalDocs = this.keyData.length + this.capData.length + this.loadData.length + this.profileData.length;
    //   this.numOfDocs = 0;
    //   this.uploadKeyData(this.keyData);
    //   this.uploadCapacityData(this.capData);
    //   this.uploadLoadData(this.loadData);
    //   this.uploadProfileData(this.profileData);
    //   firebase.firestore().collection(`${this.afAuth.auth.currentUser.uid}`).doc('portfolios').collection('names').doc(this.portfolioName).set({ name: this.portfolioName }, { merge: true });
    // }
  }

  uploadKeyData(keyData: any) {
    if (keyData.length <= 0) { return; }
    const keyRef = this.database.doc(this.portfolioName).collection('key');
    const batch = firebase.firestore().batch();
    for (let i = 0; i < 500 && i < keyData.length; i++) {
      const eleRef = keyRef.doc(`${keyData[i]['id']} - ${keyData[i]['station name']}`);
      batch.set(eleRef, keyData[i], { merge: true });
    }
    batch.commit().then(() => {
      this.numOfDocs = this.numOfDocs + 500;
      console.log(((this.numOfDocs / this.numTotalDocs) * 100) + '%');
      this.uploadKeyData(keyData.slice(500, keyData.length));
    });
  }

  uploadCapacityData(capData: any) {
    if (capData.length <= 0) { return; }
    const capRef = this.database.doc(this.portfolioName).collection('capacity');
    const batch = firebase.firestore().batch();
    for (let i = 0; i < 500 && i < capData.length; i++) {
      const eleRef = capRef.doc(`${capData[i]['year']}`);
      batch.set(eleRef, { [capData[i].id]: capData[i].capacity, 'year': capData[i].year }, { merge: true });
    }
    batch.commit().then(() => {
      this.numOfDocs = this.numOfDocs + 500;
      console.log(((this.numOfDocs / this.numTotalDocs) * 100) + '%');
      this.uploadCapacityData(capData.slice(500, capData.length));
    });
  }

  uploadLoadData(loadData: any) {
    if (loadData.length <= 0) { return; }
    const loadRef = this.database.doc(this.portfolioName).collection('load');
    const batch = firebase.firestore().batch();
    for (let i = 0; i < 500 && i < loadData.length; i++) {
      const time = new Date(loadData[i].time);
      const hour = time.getHours();
      const monthYearDay = new Date(time.getFullYear(), time.getMonth(), time.getDate());
      const dateKey = monthYearDay.toDateString().split(' ').slice(1, 4).join(' ');
      const eleRef = loadRef.doc(dateKey);
      batch.set(eleRef, { [hour]: loadData[i].load, 'time': monthYearDay }, { merge: true });
    }
    batch.commit().then(() => {
      this.numOfDocs = this.numOfDocs + 500;
      console.log(((this.numOfDocs / this.numTotalDocs) * 100) + '%');
      this.uploadLoadData(loadData.slice(500, loadData.length));
    });
  }

  uploadProfileData(profileData: any) {
    if (profileData.length <= 0) { return; }
    const loadRef = this.database.doc(this.portfolioName).collection('profiles');
    const batch = firebase.firestore().batch();
    for (let i = 0; i < 500 && i < profileData.length; i++) {
      const time = new Date(profileData[i].time);
      const hour = time.getHours();
      const monthYearDay = new Date(time.getFullYear(), time.getMonth(), time.getDate());
      const dateKey = monthYearDay.toDateString().split(' ').slice(1, 4).join(' ');
      const eleRef = loadRef.doc(dateKey);
      const profiles = [];
      Object.keys(profileData[i]).forEach(key => {
        if (key !== 'time') {
          profiles.push({ [key]: profileData[i][key] });
        }
      });
      batch.set(eleRef, { [hour]: profiles, 'time': monthYearDay }, { merge: true });
    }
    batch.commit().then(() => {
      this.numOfDocs = this.numOfDocs + 500;
      console.log(((this.numOfDocs / this.numTotalDocs) * 100) + '%');
      this.uploadProfileData(profileData.slice(500, profileData.length));
    });
  }

  arrayToLowerCase(input) {
    return input.join('|').toLowerCase().split('|');
  }

}
