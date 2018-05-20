import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


import { NewPortfolioComponent } from '../../haven-new-portfolio/new-portfolio.component';
import { PortfolioService } from '@app/haven-core';

import { HavenDialogService } from '@app/haven-shared';


@Component({
  selector: 'app-haven-sidebar-account',
  templateUrl: './haven-sidebar-account.component.html',
  styleUrls: ['./haven-sidebar-account.component.css']
})
export class HavenSidebarAccountComponent {

  selectedPortfolio: any;
  selectedSession: any;

  constructor(public dialog: MatDialog, public portfolioService: PortfolioService, private dialogService: HavenDialogService ) { }

  openNewPortfolioDialog(): void {
    const dialogRef = this.dialog.open(NewPortfolioComponent, { width: '372px' });
  }

  loadPortfolio() {
    this.portfolioService.loadPortfolio(this.selectedPortfolio);
  }

  deletePortfolio() {
    if (this.selectedPortfolio) {
      this.dialogService.openConfirmationMessage(`Are you sure you want to delete the ${this.selectedPortfolio} portfolio?`)
        .afterClosed()
        .subscribe(result => {
          if (result) {
            // TODO Delete Portfolio
          }
      });
    }
  }

  loadSession() {
    // TODO
  }

  saveSession() {
    // TODO
  }

  deleteSession() {
    if (this.selectedSession) {
      this.dialogService.openConfirmationMessage(`Are you sure you want to delete the ${this.selectedSession} session?`)
        .afterClosed()
        .subscribe(result => {
          if (result) {
            // TODO Delete Session
          }
      });
    }
  }

}
