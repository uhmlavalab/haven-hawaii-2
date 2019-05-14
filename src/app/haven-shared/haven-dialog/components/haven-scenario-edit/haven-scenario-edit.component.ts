import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { ScenariosService, HavenWindowService, SessionsService } from '@app/haven-core';
import { map } from 'rxjs/operators';

import * as firebase from 'firebase'
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-haven-scenario-edit',
  templateUrl: './haven-scenario-edit.component.html',
  styleUrls: ['./haven-scenario-edit.component.css']
})
export class HavenScenarioEditComponent {
  scenarios = [];

  myScenarios = [];
  myScenarios_Ids = [];
  loaded = false;

  constructor(public dialogRef: MatDialogRef<HavenScenarioEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private scenariosService: ScenariosService, private afs: AngularFirestore, private auth: AngularFireAuth, private changeDetect: ChangeDetectorRef) {

    firebase.firestore().collection(`${auth.auth.currentUser.uid}/data/scenarios`).get().then((querySnapshot) => {
      this.myScenarios = [];
      this.myScenarios_Ids = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.firestore_id = doc.id;
        this.myScenarios_Ids.push(data.id);
        this.myScenarios.push(data);
      });

      this.loaded = true;

    }).catch(function (error) {
      console.log("Error getting documents: ", error);
    });
  }

  onColorChange(event, docId) {
    console.log(docId, event.target.value);
    firebase.firestore().collection(`${this.auth.auth.currentUser.uid}/data/scenarios`).doc(docId).update({
      color: event.target.value
    })
      .then(function () {
        console.log("Document successfully updated!");
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  }

  onCloseClick() {
    this.dialogRef.close(false);
  }

}