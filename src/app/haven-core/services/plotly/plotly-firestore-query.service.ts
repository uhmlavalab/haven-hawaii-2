import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase';
import 'rxjs/add/operator/take';

import { PortfolioService } from '../portfolios/portfolio.service';

@Injectable()
export class PlotlyFirestoreQueryService {

  constructor(private portfolioService: PortfolioService, private afs: AngularFirestore, private afAuth: AngularFireAuth) {}

  public getData(startDate: Date, endDate: Date, value: string): Promise<any> {
    if (value === 'load') {
      return this.getLoad(startDate, endDate, value);
    }
  }

  private getLoad(startDate: Date, endDate: Date, value: string): Promise<any> {
    return this.portfolioService.getDataRef()
      .collection('load')
        .where('time', '>=', startDate)
        .where('time', '<=', endDate)
      .get().then((response) => {
       return this.formatDataForScatter(response);
      });
  }

  private formatDataForScatter(dataSnapshot: firebase.firestore.QuerySnapshot): Promise<any> {
    const data = dataSnapshot.docs;
    const traces = [];
    for (let i = 0; i < data.length; i++) {
      const x = [];
      const y = [];
      for (const propertyName in data[i].data()) {
        if (data[i].data().hasOwnProperty(propertyName)) {
          if (propertyName !== 'time') {
            x.push(Number(propertyName));
            y.push(data[i].data()[propertyName]);
          }
        }
      }
      traces.push({ x, y, mode: 'lines', type: 'scatter', name: data[i].data()['time'].toLocaleDateString('en-US') });
    }
    return Promise.resolve(traces);
  }
}
