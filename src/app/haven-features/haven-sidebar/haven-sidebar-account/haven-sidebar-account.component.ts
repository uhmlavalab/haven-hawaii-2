import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


import { NewPortfolioComponent } from '../../haven-new-portfolio/new-portfolio.component';
import { PortfolioService, HavenWindowService } from '@app/haven-core';

import { HavenDialogService } from '@app/haven-shared';


@Component({
  selector: 'app-haven-sidebar-account',
  templateUrl: './haven-sidebar-account.component.html',
  styleUrls: ['./haven-sidebar-account.component.css']
})
export class HavenSidebarAccountComponent {

  selectedPortfolio: any;
  selectedSession: any;
  sessionTimeStamp: any;

  constructor(public dialog: MatDialog, private havenWindowService: HavenWindowService, public portfolioService: PortfolioService, private dialogService: HavenDialogService ) { }

  openNewPortfolioDialog(): void {
    const dialogRef = this.dialog.open(NewPortfolioComponent, { width: '372px' });
  }

  loadPortfolio() {
    this.portfolioService.setPortfolio(this.selectedPortfolio);
  }

  deletePortfolio() {
    if (this.selectedPortfolio) {
      this.dialogService.openConfirmationMessage(`Are you sure you want to DELETE the ${this.selectedPortfolio} portfolio?`)
        .afterClosed()
        .subscribe(result => {
          if (result) {
            this.portfolioService.deletePortfolio(this.selectedPortfolio);
          }
      });
    }
  }

  loadSession() {
    if (this.selectedSession) {
      this.dialogService.openConfirmationMessage(`Are you sure you want to LOAD the ${this.selectedSession.sessionName} session?`)
        .afterClosed()
        .subscribe(result => {
          if (result) {
            this.havenWindowService.loadWindowSession(this.selectedSession.timestamp);
          }
      });
    }
  }

  saveSession() {
    this.dialogService.openSaveSessionDialog()
    .afterClosed()
    .subscribe(result => {
      if (result) {
        this.havenWindowService.saveWindowSession(result);
      }
  });
  }

  deleteSession() {
    if (this.selectedSession) {
      this.dialogService.openConfirmationMessage(`Are you sure you want to DELETE the ${this.selectedSession.sessionName} session?`)
        .afterClosed()
        .subscribe(result => {
          if (result) {
            this.havenWindowService.deleteWindowSession(this.selectedSession.timestamp);
          }
      });
    }
  }

}
