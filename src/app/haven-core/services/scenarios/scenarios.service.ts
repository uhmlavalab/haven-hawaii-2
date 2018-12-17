import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase';
import { map } from 'rxjs/operators';

import { HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';


@Injectable()
export class ScenariosService {

  private selectedScenario: any;

  private scenarioShares = [];

  constructor() {}

  public getScenariosList(): Promise<any> {
    return new Promise(function(resolve) {
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


  public setScenario(scenario: any) {
    this.selectedScenario = scenario;
    this.getSharesList().then(shares => {
      this.scenarioShares = shares;
      this.scenarioShares.sort((a,b) => (a.year > b.year) ? 1 : -1);
      this.scenarioShares.forEach(element => { element.percent = Number(element.percent * 100).toFixed(2); });
    });
  }

  private getSharesList(): Promise<any>  {
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

}
