import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-haven-savesession-dialog',
  templateUrl: './haven-savesession-dialog.component.html',
  styleUrls: ['./haven-savesession-dialog.component.css']
})
export class HavenSavesessionDialogComponent  {

  sessionName: string;

  constructor(
    public dialogRef: MatDialogRef<HavenSavesessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  public saveSession() {
    this.dialogRef.close(this.sessionName);
  }

}
