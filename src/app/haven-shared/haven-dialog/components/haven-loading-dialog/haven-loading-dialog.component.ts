import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-haven-dialog',
  templateUrl: './haven-loading-dialog.component.html',
  styleUrls: ['./haven-loading-dialog.component.css']
})
export class HavenLoadingDialogComponent {

  value = 0;

  constructor(
    public dialogRef: MatDialogRef<HavenLoadingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  public updateMessage(message: string) {
    this.data.message = message;
  }

  public updateValue(value: number) {
    this.value = value;
  }

}
