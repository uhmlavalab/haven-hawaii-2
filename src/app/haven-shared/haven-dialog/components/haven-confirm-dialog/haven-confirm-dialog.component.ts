import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-haven-confirm-dialog',
  templateUrl: './haven-confirm-dialog.component.html',
  styleUrls: ['./haven-confirm-dialog.component.css']
})
export class HavenConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<HavenConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onConfirmClick() {
    this.dialogRef.close(true);
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }

}
