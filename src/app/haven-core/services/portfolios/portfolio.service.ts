import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { HavenWindowService } from '../windows/haven-window.service';

import * as firebase from 'firebase';

@Injectable()
export class PortfolioService {

  private selectedPortfolio: string;
  private selectedScenario: string;
  private dataRef: firebase.firestore.DocumentReference;
  private layersRef: firebase.firestore.CollectionReference;
  private sessionsRef: firebase.firestore.CollectionReference;

  private portfolioNamesCollection: AngularFirestoreCollection<any>;
  private portfolioNames: Observable<any[]>;

  private portfolioScenariosNamesCollection: AngularFirestoreCollection<any>;
  private scenarioNames: Observable<any[]>;

  private portfolioSessionsCollection: AngularFirestoreCollection<any>;
  private portfolioSessions: Observable<any[]>;

  private portfolioLayersCollection: AngularFirestoreCollection<any>;
  private portfolioLayers: Observable<any[]>;

  private scenarioREValuesRef: AngularFirestoreCollection<any>;
  private scenarioREValues: Observable<any[]>;


  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private windowService: HavenWindowService) {
    this.portfolioNamesCollection = this.afs.collection<any>(`${afAuth.auth.currentUser.uid}`).doc('data').collection('portfolio_names');
    this.portfolioNames = this.portfolioNamesCollection.valueChanges();
  }

  public loadPortfolio(portfolioName: string) {
    this.windowService.clearWindows();
    this.selectedPortfolio = portfolioName;
    this.dataRef = firebase.firestore().collection(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('portfolio_data').doc('data');
    this.layersRef = firebase.firestore().collection(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('layers');
    this.sessionsRef = firebase.firestore().collection(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('sessions');
    this.setScenariosListReference();
    this.setSessionListReference();
    this.setLayersListReference();
  }

  public getPortfolioNames(): Observable<any[]> {
    return this.portfolioNames;
  }

  public setScenario(scenarioName: string) {
    this.selectedScenario = scenarioName;
    this.setREValuesReference();
  }

  private setScenariosListReference() {
    this.portfolioScenariosNamesCollection = this.afs.collection<any>(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('scenario_names');
    this.scenarioNames = this.portfolioScenariosNamesCollection.valueChanges();
  }

  private setSessionListReference() {
    this.portfolioSessionsCollection = this.afs.collection<any>(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('sessions');
    this.portfolioSessions = this.portfolioSessionsCollection.valueChanges();
  }

  private setLayersListReference() {
    this.portfolioLayersCollection = this.afs.collection<any>(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('layers');
    this.portfolioLayers = this.portfolioLayersCollection.valueChanges();
  }

  private setREValuesReference() {
    this.scenarioREValuesRef = this.afs.collection<any>(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('scenarios').doc(this.selectedScenario).collection('renewablePercent');
    this.scenarioREValues = this.scenarioREValuesRef.valueChanges();
  }

  public getREValues(): Observable<any[]> {
    return this.scenarioREValues;
  }

  public getScenariosList() {
    return this.scenarioNames;
  }

  public getSessionList(): Observable<any[]> {
    return this.portfolioSessions;
  }

  public getLayersList(): Observable<any[]> {
    return this.portfolioLayers;
  }

  public getDataRef() {
    return this.dataRef;
  }

  public getLayersRef() {
    return this.layersRef;
  }

  public getSessionsRef() {
    return this.sessionsRef;
  }

  public getKeyObservable(): Observable<any[]> {
    if (this.selectedPortfolio) {
      const keyReference = this.afs.collection<any>(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('portfolio_data').doc('data').collection('key');
      return keyReference.valueChanges();
    }
  }

}
