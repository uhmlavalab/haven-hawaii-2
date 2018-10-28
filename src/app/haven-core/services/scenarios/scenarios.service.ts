import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase';
import { map } from 'rxjs/operators';


@Injectable()
export class ScenariosService {

  private scenarios: Observable<any[]>;

  private selectedScenario: string;

  constructor() {

  }

  public loadScenario(scenarioName: String) {
    // TODO
  }

  public getScenariosList() {
    // TODO
  }

  public getScenarioRef() {
    // TODO
  }

  public getSelectedScenarioName() {
    return this.selectedScenario;
  }

  public getSessionsCollection() {
    // TODO
  }

}
