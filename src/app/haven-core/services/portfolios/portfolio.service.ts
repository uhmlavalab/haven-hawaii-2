import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireStorage } from 'angularfire2/storage';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';

import { PortfolioDatabaseService } from '../database/portfolio-database.service';


@Injectable()
export class PortfolioService {

  public selectedPortfolio: string;

  private portfolioRef: firebase.firestore.DocumentReference;

  private portfolioNamesCollection: AngularFirestoreCollection<any>;
  private portfolioNames: Observable<any[]>;

  private sessionNamesCollection: AngularFirestoreCollection<any>;
  private sessionsNames: Observable<any[]>;

  private portfolioLayersCollection: AngularFirestoreCollection<any>;
  private portfolioLayers: Observable<any[]>;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private storage: AngularFireStorage, private portfolioDatabaseService: PortfolioDatabaseService) {
    this.portfolioNamesCollection = this.afs.collection<any>(`${afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios');
    this.portfolioNames = this.portfolioNamesCollection.valueChanges();
    this.setSessionsListReference();
  }

  public getSessionsList(): Observable<any[]> {
    return this.sessionsNames;
  }

  public getSessionsCollection(): firebase.firestore.CollectionReference {
    return firebase.firestore().collection(this.afAuth.auth.currentUser.uid).doc('data').collection('sessions');
  }

  public setPortfolio(portfolioName: string) {
    this.selectedPortfolio = portfolioName;
    this.portfolioRef = firebase.firestore().collection(this.afAuth.auth.currentUser.uid).doc('data').collection('portfolios').doc(this.selectedPortfolio);
    this.portfolioDatabaseService.loadPortfolioDatabase(this.selectedPortfolio);
  }

  public getSelectedPortfolioName(): string {
    return this.selectedPortfolio;
  }

  public getSelectedPortfolioRef(): firebase.firestore.DocumentReference {
    return this.portfolioRef;
  }

  public getPortfolioRef(portfolioName: string): firebase.firestore.DocumentReference {
    return firebase.firestore().collection(this.afAuth.auth.currentUser.uid).doc('data').collection('portfolios').doc(portfolioName);
  }

  public getPortfolioNames(): Observable<any[]> {
    return this.portfolioNames;
  }

  public deletePortfolio(portfolioName: string) {
  }

  private setLayersListReference() {
    this.portfolioLayersCollection = this.afs.collection<any>(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('layers');
    this.portfolioLayers = this.portfolioLayersCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  public getLayersList(): Observable<any[]> {
    return this.portfolioLayers;
  }

  private setSessionsListReference() {
    this.sessionNamesCollection = this.afs.collection<any>(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('sessions');
    this.sessionsNames = this.sessionNamesCollection.valueChanges();
  }

}


// firebase.firestore().collection(this.afAuth.auth.currentUser.uid).doc('data').collection('portfolios').doc('PSIP_Test').collection('portfolio_data').doc('data').collection('profile').get().then((querySnapshot) => {
//   const docIds = [];
//   querySnapshot.forEach((doc) => {
//     docIds.push(doc.id);
//   });
//   function deleteDoc(docIdList: any[], userid: string): Promise<any> {
//     return firebase.firestore().collection(userid).doc('data').collection('portfolios').doc('PSIP').collection('portfolio_data').doc('data').collection('profile').doc(docIdList[0]).delete().then(() => {
//       console.log(docIdList[0] + ' Deleted');
//       return deleteDoc(docIdList.slice(1), userid);
//     });
//   }
//   return deleteDoc(docIds, this.afAuth.auth.currentUser.uid);
// });
