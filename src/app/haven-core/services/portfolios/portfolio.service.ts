import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { HavenWindowService } from '../windows/haven-window.service';

import * as firebase from 'firebase';

@Injectable()
export class PortfolioService {

  public selectedPortfolio: string;
  private selectedScenario: string;
  private selectedLoad: string;

  private portfolioRef: firebase.firestore.DocumentReference;

  private portfolioNamesCollection: AngularFirestoreCollection<any>;
  private portfolioNames: Observable<any[]>;


  private scenarioNamesCollection: AngularFirestoreCollection<any>;
  private scenarioNames: Observable<any[]>;

  private loadNamesCollection: AngularFirestoreCollection<any>;
  private loadNames: Observable<any[]>;

  private sessionNamesCollection: AngularFirestoreCollection<any>;
  private scenssionsNames: Observable<any[]>;

  private portfolioLayersCollection: AngularFirestoreCollection<any>;
  private portfolioLayers: Observable<any[]>;

  private scenarioREValuesRef: AngularFirestoreCollection<any>;
  private scenarioREValues: Observable<any[]>;


  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.portfolioNamesCollection = this.afs.collection<any>(`${afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios');
    this.portfolioNames = this.portfolioNamesCollection.valueChanges();
  }

  public setPortfolio(portfolioName: string) {
    this.selectedPortfolio = portfolioName;

    this.portfolioRef = firebase.firestore().collection(this.afAuth.auth.currentUser.uid).doc('data').collection('portfolios').doc(this.selectedPortfolio);

    this.selectedScenario = null;
    this.selectedLoad = null;
    this.scenarioREValues = null;
    this.scenarioREValuesRef = null;
    this.setScenariosListReference();
    this.setLoadsListReference();
    this.setSessionsListReference();
    this.setLayersListReference();
  }

  public setScenario(scenarioName: string) {
    this.selectedScenario = scenarioName;
    this.setREValuesReference();
  }

  public setLoad(loadName: string) {
    this.selectedLoad = loadName;
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

  public getREValues(): Observable<any[]> {
    return this.scenarioREValues;
  }

  public getScenariosList() {
    return this.scenarioNames;
  }

  public getSessionsList(): Observable<any[]> {
    return this.scenssionsNames;
  }

  public getLayersList(): Observable<any[]> {
    return this.portfolioLayers;
  }

  public getLoadsList(): Observable<any[]> {
    return this.loadNames;
  }

  public getKeyCollection(portfolioName: string): firebase.firestore.CollectionReference {
    return firebase.firestore().collection(this.afAuth.auth.currentUser.uid).doc('data').collection('portfolios').doc(portfolioName).collection('key');
  }

  public getProfilesCollection(portfolioName: string): firebase.firestore.CollectionReference {
    return firebase.firestore().collection(this.afAuth.auth.currentUser.uid).doc('data').collection('portfolios').doc(portfolioName).collection('profile');
  }

  public getCapacityCollection(portfolioName: string, scenarioName: string): firebase.firestore.CollectionReference {
    return firebase.firestore().collection(this.afAuth.auth.currentUser.uid).doc('data').collection('portfolios').doc(portfolioName).collection('scenarios').doc(scenarioName).collection('capacity');
  }

  public getLoadCollection(portfolioName: string, loadName: string): firebase.firestore.CollectionReference {
    return firebase.firestore().collection(this.afAuth.auth.currentUser.uid).doc('data').collection('portfolios').doc(portfolioName).collection('loads').doc(loadName).collection('load');
  }

  private setScenariosListReference() {
    this.scenarioNamesCollection = this.afs.collection<any>(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('scenarios');
    this.scenarioNames = this.scenarioNamesCollection.valueChanges();
  }

  private setLoadsListReference() {
    this.loadNamesCollection = this.afs.collection<any>(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('loads');
    this.loadNames = this.loadNamesCollection.valueChanges();
  }

  private setLayersListReference() {
    this.portfolioLayersCollection = this.afs.collection<any>(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('layers');
    this.portfolioLayers = this.portfolioLayersCollection.valueChanges();
  }

  private setSessionsListReference() {
    this.portfolioLayersCollection = this.afs.collection<any>(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('sessions');
    this.portfolioLayers = this.portfolioLayersCollection.valueChanges();
  }

  private setREValuesReference() {
    this.scenarioREValuesRef = this.afs.collection<any>(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('scenarios').doc(this.selectedScenario).collection('renewablePercent');
    this.scenarioREValues = this.scenarioREValuesRef.valueChanges();
  }

  public getKeyObservable(): Observable<any[]> {
    if (this.selectedPortfolio) {
      const keyReference = this.afs.collection<any>(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('key', ref => ref.orderBy('id', 'asc'));
      return keyReference.valueChanges();
    }
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
