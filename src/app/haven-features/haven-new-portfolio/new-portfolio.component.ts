import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { NewPortfolioUploadService } from '@app/haven-core';

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

  keyCSV: any;
  capCSV: any;
  loadCSV: any;
  profileCSV: any;
  keyIn = false;
  capIn = false;
  loadIn = false;
  profileIn = false;
  progressValue = 0;
  allFilesUploaded = false;

  public portfolioName = '';
  @ViewChild('keyInput') keyFileInput: ElementRef;
  @ViewChild('capInput') capFileInput: ElementRef;
  @ViewChild('loadInput') loadFileInput: ElementRef;
  @ViewChild('profileInput') profileFileInput: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<NewPortfolioComponent>,
    private portfolioUploadService: NewPortfolioUploadService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  onKeyInput(event) {
    this.keyCSV = this.keyFileInput.nativeElement.files[0];
    if (this.keyCSV) {
      this.progressValue += 25;
      this.keyIn = true;
    }
  }
  onCapInput(event) {
    this.capCSV = this.capFileInput.nativeElement.files[0];
    if (this.capCSV) {
      this.progressValue += 25;
      this.capIn = true;
    }
  }
  onLoadInput(event) {
    this.loadCSV = this.loadFileInput.nativeElement.files[0];
    if (this.loadCSV) {
      this.progressValue += 25;
      this.loadIn = true;
    }

  }
  onProfileInput(event) {
    this.profileCSV = this.profileFileInput.nativeElement.files[0];
    if (this.profileCSV) {
      this.progressValue += 25;
      this.profileIn = true;
      if (this.keyIn && this.capIn && this.loadIn && this.profileIn) {
        this.allFilesUploaded = true;
      }
    }
  }

  uploadFiles() {
    if (this.portfolioName !== '' && this.allFilesUploaded) {
      this.portfolioUploadService.uploadCSVFiles(this.keyCSV, this.capCSV, this.loadCSV, this.profileCSV, this.portfolioName);
    }
  }

}
