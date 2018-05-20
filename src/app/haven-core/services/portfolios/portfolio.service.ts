import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { HavenWindowService } from '../windows/haven-window.service';

import * as firebase from 'firebase';

@Injectable()
export class PortfolioService {

  private selectedPortfolio: string;
  private dataRef: firebase.firestore.DocumentReference;
  private layersRef: firebase.firestore.CollectionReference;
  private sessionsRef: firebase.firestore.CollectionReference;

  private portfolioNamesCollection: AngularFirestoreCollection<any>;
  private portfolioNames: Observable<any[]>;

  private portfolioSessionsCollection: AngularFirestoreCollection<any>;
  private portfolioSessions: Observable<any[]>;

  private portfolioLayersCollection: AngularFirestoreCollection<any>;
  private portfolioLayers: Observable<any[]>;

  private portfolioREValueCollection: AngularFirestoreCollection<any>;
  private portfolioREValues: Observable<any[]>;


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
    this.setSessionReference();
    this.setREValuesReference();
    this.setLayersReference();
  }

  public getPortfolioNames(): Observable<any[]> {
    return this.portfolioNames;
  }

  private setSessionReference() {
    this.portfolioSessionsCollection = this.afs.collection<any>(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('sessions');
    this.portfolioSessions = this.portfolioSessionsCollection.valueChanges();
  }

  public getSessionList(): Observable<any[]> {
    return this.portfolioSessions;
  }

  private setLayersReference() {
    this.portfolioLayersCollection = this.afs.collection<any>(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('layers');
    this.portfolioLayers = this.portfolioLayersCollection.valueChanges();
  }

  public getLayersList(): Observable<any[]> {
    return this.portfolioLayers;
  }

  private setREValuesReference() {
    this.portfolioREValueCollection = this.afs.collection<any>(`${this.afAuth.auth.currentUser.uid}`).doc('data').collection('portfolios').doc(this.selectedPortfolio).collection('portfolio_data').doc('data').collection('renewablePercent');
    this.portfolioREValues = this.portfolioREValueCollection.valueChanges();
  }

  public getREValues(): Observable<any[]> {
    return this.portfolioREValues;
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

}
