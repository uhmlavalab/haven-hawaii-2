import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

import { Subject } from 'rxjs/subject';
import { snapshotChanges } from '../../../../../node_modules/angularfire2/database';
@Injectable()
export class LeafletArService {

  arSub = new Subject<any>();

  constructor(private afAuth: AngularFireAuth) {
    this.arSub.next(null);
    firebase.database().ref(`users/${this.afAuth.auth.currentUser.uid}/ar`).on('value', snapshot => {
      this.arSub.next(snapshot.val());
    });
  }

  public uploadARData(baselayer: string, portfolio: string, scenario: string, year: number, layers: any) {
    firebase.database().ref(`users/${this.afAuth.auth.currentUser.uid}/ar`).set({
      'baselayer': baselayer,
      'portfolio': portfolio,
      'scenario': scenario,
      'year': year,
      'layers': layers
    });
  }

}
