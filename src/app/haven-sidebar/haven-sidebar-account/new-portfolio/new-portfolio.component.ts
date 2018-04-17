import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { PapaParseService } from 'ngx-papaparse';


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

  progressValue = 0;
  allFilesUploaded = false;

  @ViewChild('keyInput') keyFileInput: ElementRef;
  @ViewChild('capInput') capFileInput: ElementRef;
  @ViewChild('loadInput') loadFileInput: ElementRef;
  @ViewChild('profileInput') profileFileInput: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<NewPortfolioComponent>,
    private papa: PapaParseService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCloseClick(): void {
    this.dialogRef.close({ cat: 'biscuit', dog: 'clyde' });
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
        console.log(this.keyData);
        this.keyIn = true;
        this.progressValue += 25;
      }
    });
  }

  onCapInput(event) {
    const csv = this.capFileInput.nativeElement.files[0];
    this.papa.parse(csv, {
      complete: (results) => {
        console.log(results);
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
              'capacity': Number.parseFloat(results.data[i][capIdx]),
            }
          );
        }
        console.log(this.capData);
        this.keyIn = true;
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
              'load': Number.parseFloat(results.data[i][loadIdx]),
            }
          );
        }
        console.log(this.loadData);
        this.keyIn = true;
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
              row[columns[j]] = Number.parseFloat(results.data[i][indexs[columns[j]]]);
            }
          }
          this.profileData.push(row);
        }
        console.log(this.profileData);
        this.keyIn = true;
        this.progressValue += 25;
        if (this.progressValue === 100) {
          this.allFilesUploaded = true;
        }
      }
    });
  }

  arrayToLowerCase(input) {
    return input.join('|').toLowerCase().split('|');
  }

}
