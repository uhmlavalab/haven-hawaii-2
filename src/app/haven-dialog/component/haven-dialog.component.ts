import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-haven-dialog',
  templateUrl: './haven-dialog.component.html',
  styleUrls: ['./haven-dialog.component.css']
})
export class HavenDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<HavenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  public updateMessage(message: string) {
    this.data.message = message;
  }

}
