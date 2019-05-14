import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ScenariosService, HavenWindowService, SessionsService } from '@app/haven-core';

import { HavenDialogService } from '@app/haven-shared';

@Component({
  selector: 'app-haven-sidebar-scenarios',
  templateUrl: './haven-sidebar-scenarios.component.html',
  styleUrls: ['./haven-sidebar-scenarios.component.css']
})
export class HavenSidebarScenariosComponent {

  selectedSession: any;

  constructor(private havenWindowService: HavenWindowService, public scenariosService: ScenariosService, public sessionsService: SessionsService, private dialogService: HavenDialogService, public dialog: MatDialog,  ) { 

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

  configureScenarios() {
    this.dialogService.openScenarioConfigDialog().afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  editScenarios() {
    this.dialogService.openScenarioEditDialog().afterClosed().subscribe(result => {
      console.log(result);
    });
  }

}
