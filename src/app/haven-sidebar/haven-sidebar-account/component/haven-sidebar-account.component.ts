import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewPortfolioComponent } from '../new-portfolio/new-portfolio.component';
@Component({
  selector: 'app-haven-sidebar-account',
  templateUrl: './haven-sidebar-account.component.html',
  styleUrls: ['./haven-sidebar-account.component.css']
})
export class HavenSidebarAccountComponent {

  portfolios = [
    { value: 'Hawaii-0', viewValue: 'Hawaii' },
    { value: 'Arizona-1', viewValue: 'Arizona' },
    { value: 'California-2', viewValue: 'California' }
  ];

  sessions = [
    { value: 'Session-0', viewValue: 'Session A' },
    { value: 'Session-1', viewValue: 'Session B' },
    { value: 'Session-2', viewValue: 'Session C' }
  ];

  newPortfolioData: any;

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewPortfolioComponent, { width: '372px' });

    dialogRef.afterClosed().subscribe(result => {
      this.newPortfolioData = result;
    });
  }


}
