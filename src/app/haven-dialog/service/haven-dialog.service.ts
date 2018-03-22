import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { HavenDialogComponent } from '../component/haven-dialog.component';

@Injectable()
export class HavenDialogService {

  constructor(public dialog: MatDialog) { }

  openErrorDialog(message: string): HavenDialogComponent {
    const dialogRef = this.dialog.open(HavenDialogComponent, {
      width: '250px',
      data: { title: 'Error', message: message }
    });
    return dialogRef.componentInstance;
  }

  openMessageDialog(message: string): HavenDialogComponent {
    const dialogRef = this.dialog.open(HavenDialogComponent, {
      width: '250px',
      data: { title: 'Message', message: message }
    });
    return dialogRef.componentInstance;
  }

}
