import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase';

@Injectable()
export class PortfolioService {

  selectedPortfolio: string;
  portfolioDatabaseRef: firebase.firestore.DocumentReference;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
  }

  public loadPortfolio(name: string) {
    this.selectedPortfolio = name;
    this.portfolioDatabaseRef = firebase.firestore().collection(`${this.afAuth.auth.currentUser.uid}`).doc('portfolios').collection('data').doc(this.selectedPortfolio);
  }

  public getPortfolioDBRef() {
    return this.portfolioDatabaseRef;
  }

}
