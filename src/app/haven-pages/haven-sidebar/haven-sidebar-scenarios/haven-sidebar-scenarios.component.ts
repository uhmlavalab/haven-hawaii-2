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

  selectedScenario: any;
  selectedSession: any;
  scenarios = [];

  constructor(private havenWindowService: HavenWindowService, public scenariosService: ScenariosService, public sessionsService: SessionsService, private dialogService: HavenDialogService, public dialog: MatDialog,  ) { 
    this.scenariosService.getScenariosList().then(scenarios => {
      this.scenarios = scenarios;

    });
  }

  loadScenario() {
    if (this.selectedScenario) {
      this.dialogService.openConfirmationMessage(`Are you sure you want to LOAD the ${this.selectedScenario.name} session?`)
        .afterClosed()
        .subscribe(result => {
          if (result) {
            console.log(this.selectedScenario);
            this.scenariosService.setScenario(this.selectedScenario);
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
