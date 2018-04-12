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
  keyIn = false;
  capIn = false;
  loadIn = false;
  profileIn = false;

  progressValue = 0;
  allFilesUploaded = false;

  @ViewChild('keyInput') keyFileInput: ElementRef;

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
          let idIdx, staIdx, typeIdx, resIdx, renewIdx = -1;
          for (let i = 0; i < columns.length; i++) {
            switch (columns[i]) {
              case 'id':
                idIdx = i;
                break;
              case 'station':
                staIdx = i;
                break;
              case 'type':
                typeIdx = i;
                break;
              case 'resource':
                resIdx = i;
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
                'station': results.data[i][staIdx],
                'type': results.data[i][typeIdx],
                'resource': results.data[i][resIdx],
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
    this.capIn = true;
    this.progressValue += 25;
  }

  onLoadInput(event) {
    this.loadIn = true;
    this.progressValue += 25;
  }

  onProfileInput(event) {
    this.profileIn = true;
    this.progressValue += 25;
    if (this.progressValue === 100) {
      this.allFilesUploaded = true;
    }
  }

  arrayToLowerCase(input) {
    return input.join('|').toLowerCase().split('|');
  }

}
