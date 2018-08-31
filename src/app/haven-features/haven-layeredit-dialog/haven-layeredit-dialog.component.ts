import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { PortfolioService } from '@app/haven-core';
import { LayersService } from '@app/haven-core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-haven-layereedit-dialog',
  templateUrl: './haven-layerEdit-dialog.component.html',
  styleUrls: ['./haven-layerEdit-dialog.component.css']
})
export class HavenLayerEditDialogComponent  {

  layerName = '';
  selectedProfiles = [];
  layerColor = '#fe5217';

  keyList: Observable<any[]>;


  constructor(
    public dialogRef: MatDialogRef<HavenLayerEditDialogComponent>,
    public portfolioService: PortfolioService,
    public layersService: LayersService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.keyList = this.portfolioService.getKeyObservable();
      this.layerName = data.layerDoc.name;
      this.selectedProfiles = data.layerDoc.profiles;
      this.layerColor = data.layerDoc.color;
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  updateLayer() {
    this.layersService.updateLayer(this.data.layerDoc.id, this.layerName, this.layerColor, this.selectedProfiles);
    this.dialogRef.close();
  }

  changeColor(event) {
    this.layerColor = event.srcElement.value;
  }
}
