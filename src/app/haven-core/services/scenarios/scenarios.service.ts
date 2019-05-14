import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase';
import { map } from 'rxjs/operators';

import { HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';

import { AngularFireAuth } from 'angularfire2/auth';

/*
254441
E4572E
F3A712
313E50
21295C
*/

@Injectable()
export class ScenariosService {

  private selectedScenario: any;

  private scenarioShares = [];

  constructor(private auth: AngularFireAuth) { }

  public getScenariosList(): Promise<any> {
    return new Promise(function (resolve) {
      var req = new XMLHttpRequest();
      req.onload = () => {
        const results = JSON.parse(req.responseText) as any;
        return resolve(results.scenarios);
      }
      req.onerror = () => {
        console.log('There was an error');
      }
      req.open('GET', `https://us-central1-haven-hawaii-2.cloudfunctions.net/scenariosList`, true);
      req.send();
    })
  }


  public setScenario(scenario: any): Promise<any> {
    this.selectedScenario = scenario;
    return this.getSharesList().then(shares => {
      this.scenarioShares = shares;
      this.scenarioShares.sort((a, b) => (a.year > b.year) ? 1 : -1);
      this.scenarioShares.forEach(element => { element.percent = Number(element.percent * 100).toFixed(2); });
    });
  }

  private getSharesList(): Promise<any> {
    return new Promise((resolve) => {
      var req = new XMLHttpRequest();
      req.onload = () => {
        const results = JSON.parse(req.responseText) as any;
        return resolve(results.shares);
      }
      req.onerror = () => {
        console.log('There was an error');
      }
      req.open('GET', `https://us-central1-haven-hawaii-2.cloudfunctions.net/sharesList?scenario=${this.selectedScenario.id}`, true);
      req.send();
    })
  }

  public getSelectedScenarioName() {
    return this.selectedScenario.name;
  }

  public getSelectScenarioId() {
    return this.selectedScenario.id;
  }

  public getScenarioSharesList() {
    return this.scenarioShares;
  }

  public getScenarioColor(scenarioId: number): Promise<any> {
    return new Promise((resolve) => {
      let value = null;
      firebase.firestore().collection(`${this.auth.auth.currentUser.uid}/data/scenarios`).where("id", "==", scenarioId).get().then(data => {
        data.forEach(el => {
          value = el.data().color;
        })
        return resolve(value);
      })
    });
  }


}
