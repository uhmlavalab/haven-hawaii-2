import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { ScenariosService, HavenWindowService, SessionsService } from '@app/haven-core';
import { map } from 'rxjs/operators';

import * as firebase from 'firebase'
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
  selector: 'app-haven-scenario-config',
  templateUrl: './haven-scenario-config.component.html',
  styleUrls: ['./haven-scenario-config.component.css']
})
export class HavenScenarioConfigComponent {
  scenarios = [];

  myScenarios = [];
  myScenarios_Ids = [];
  loaded = false;

  availScenario: AvailableScenario[] = [];

  availableScenariosColumns = ['id', 'name', 'description', 'location', 'sublocation', 'edit'];
  availableScenariosSource = new MatTableDataSource(AVAILABLE_SCENARIOS);

  applyAvailableScenarioFiltr(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.availableScenariosSource.filter = filterValue;
  }

  constructor(public dialogRef: MatDialogRef<HavenScenarioConfigComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private scenariosService: ScenariosService, private afs: AngularFirestore, private auth: AngularFireAuth, private changeDetect: ChangeDetectorRef) {
    AVAILABLE_SCENARIOS.length = 0;
    firebase.firestore().collection(`${auth.auth.currentUser.uid}/data/scenarios`).get().then((querySnapshot) => {
      this.myScenarios = [];
      this.myScenarios_Ids = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.firestore_id = doc.id;
        this.myScenarios_Ids.push(data.id);
        this.myScenarios.push(data);
      });
      this.scenariosService.getScenariosList().then(scenarios => {
        scenarios.forEach(el => {
          AVAILABLE_SCENARIOS.push(el as AvailableScenario)
          this.changeDetect.detectChanges();
        })
        this.availableScenariosSource = new MatTableDataSource(AVAILABLE_SCENARIOS);
        this.loaded = true;
      });
    }).catch(function (error) {
      console.log("Error getting documents: ", error);
    });
  }

  addScenario(scenario) {
    firebase.firestore().collection(`${this.auth.auth.currentUser.uid}/data/scenarios`).add(
      {
        id: scenario.id as Number,
        location: scenario.location as String,
        sublocation: scenario.sublocation as String,
        creationtime: new Date(1000 * (Math.round(new Date(scenario.creationtime).getTime() / 1000) - (new Date().getTimezoneOffset() * 60))),
        starttime: new Date(scenario.starttime),
        endtime: new Date(scenario.endtime),
        description: scenario.description as String,
      }
    );
  }

  removeScenario(scenario) {
    console.log(scenario)
  }

  onCloseClick() {
    this.dialogRef.close(false);
  }

}
export interface AvailableScenario {
  name: string;
  id: number;
  description: string;
  location: string;
  sublocation: string;
}

const AVAILABLE_SCENARIOS: AvailableScenario[] = [];
