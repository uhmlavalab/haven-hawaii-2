import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { PortfolioService } from '@app/haven-core';
import { LayerUploadService } from '@app/haven-core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-haven-new-layer',
  templateUrl: './haven-new-layer.component.html',
  styleUrls: ['./haven-new-layer.component.css']
})
export class HavenNewLayerComponent {

  layerName = '';
  layerFile: any;
  selectedProfiles = [];
  layerColor = '#fe5217';

  keyList: Observable<any[]>;

  @ViewChild('layerInput') layerFileInput: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<HavenNewLayerComponent>,
    public portfolioService: PortfolioService,
    private layerUploadService: LayerUploadService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.keyList = new Observable<any[]>();
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  onLayerInput(event) {
    this.layerFile = this.layerFileInput.nativeElement.files[0];
  }

  uploadLayer() {
    this.layerUploadService.uploadLayer(this.layerFile, this.layerName, this.layerColor, this.selectedProfiles);
    this.dialogRef.close();
  }

  changeColor(event) {
    this.layerColor = event.srcElement.value;
  }

}
