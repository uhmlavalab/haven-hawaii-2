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

  capacityTooltip = 'Capacity for locations by year';
  curtailmentTooltip = 'Amount of energy curtailed in instances where energy is curtailed';
  groupsTooltip = 'Groups of energy by type';
  powerTooltip = 'Energy for each location';

  resourcesTooltip = 'Hourly Load';
  storageTooltip = 'State of charge for the battery';
  storageCapactiyTooltip = 'Amount of energy the batteries can hold';
  summaryTooltip = 'Annual values for key parameters';

  public portfolioName = '';

  @ViewChild('capacityInput') capcityFile: ElementRef;
  @ViewChild('curtailmentInput') curtailmentFile: ElementRef;
  @ViewChild('groupsInput') groupsFile: ElementRef;
  @ViewChild('powerInput') powerFile: ElementRef;

  @ViewChild('resourcesInput') resourcesFile: ElementRef;
  @ViewChild('storageInput') storageFile: ElementRef;
  @ViewChild('storageCapacityInput') storageCapacityFile: ElementRef;
  @ViewChild('summaryInput') summaryFile: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<NewPortfolioComponent>,
    private portfolioUploadService: NewPortfolioUploadService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  uploadFiles() {
    if (this.portfolioName !== '') {
      this.portfolioUploadService.uploadNRELFiles(
        this.capcityFile.nativeElement.files[0],
        this.curtailmentFile.nativeElement.files[0],
        this.groupsFile.nativeElement.files[0],
        this.powerFile.nativeElement.files[0],
        this.resourcesFile.nativeElement.files[0],
        this.storageFile.nativeElement.files[0],
        this.storageCapacityFile.nativeElement.files[0],
        this.summaryFile.nativeElement.files[0],
        this.portfolioName);
      this.dialogRef.close();
    }
  }

}
