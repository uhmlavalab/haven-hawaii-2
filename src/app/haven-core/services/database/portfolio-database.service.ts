import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorage } from 'angularfire2/storage';

import * as taffy from 'taffy';
import { PapaParseService } from 'ngx-papaparse';

import { PlotlyAppInfo } from '@app/haven-features';

import { HavenDialogService } from '@app/haven-shared';



@Injectable()
export class PortfolioDatabaseService {

  private portfolioDB = {
    'capacity': new taffy(),
    'curtailment': new taffy(),
    'groups': new taffy(),
    'power': new taffy(),
    'resources': new taffy(),
    'storage': new taffy(),
    'storageCapacity': new taffy(),
    'summary': new taffy(),
  };

  dialogRef: any;
  progressAmount: number;

  constructor(private papa: PapaParseService, private afAuth: AngularFireAuth, private storage: AngularFireStorage, private dialogService: HavenDialogService) { }

  public loadPortfolioDatabase(portfolioName: string) {
    this.progressAmount = 5;
    this.dialogRef = this.dialogService.openLoadingDialog(`Loading '${portfolioName}':  ${this.progressAmount.toFixed(0)}%`);
    this.dialogRef.componentInstance.updateValue(this.progressAmount);
    this.loadDBFile('capacity', portfolioName).then(() => {
      this.loadDBFile('curtailment', portfolioName).then(() => {
        this.loadDBFile('groups', portfolioName).then(() => {
          this.loadDBFile('power', portfolioName).then(() => {
            this.loadDBFile('resources', portfolioName).then(() => {
              this.loadDBFile('storage', portfolioName).then(() => {
                this.loadDBFile('storageCapacity', portfolioName).then(() => {
                  this.loadDBFile('summary', portfolioName);
                });
              });
            });
          });
        });
      });
    });
  }

  private loadDBFile(fileName: string, portfolioName: string): Promise<any> {
    const storageURL = `/${this.afAuth.auth.currentUser.uid}/${portfolioName}/data/${fileName}`;
    const ref = this.storage.ref(storageURL);
    return ref.getDownloadURL().toPromise().then((url) => {
      return new Promise((resolve, reject) => {
        // Do the usual XHR stuff
        const req = new XMLHttpRequest();
        req.responseType = 'text';
        req.open('GET', url);
        req.onload = () => {
          // This is called even on 404 etc
          // so check the status
          if (req.status === 200) {
            this.papa.parse(req.response, {
              complete: (results) => {
                const key = results.data[0];
                const progressPart = 12.5 / (results.data.length + 1);
                for (let i = 1; i < results.data.length; i++) {
                  const newEntry = {};
                  for (let j = 0; j < results.data[i].length; j++) {
                    if (key[j] === 'Time') {
                      newEntry[key[j]] = new Date(results.data[i][j]).getTime();
                    } else if (key[j] === 'Year') {
                      newEntry[key[j]] = Number(results.data[i][j]);
                    } else {
                      newEntry[key[j]] = results.data[i][j];
                    }
                  }
                  if (Object.keys(newEntry).length === key.length) {
                    this.portfolioDB[fileName].insert(newEntry);
                  }
                  this.progressAmount += progressPart;
                }
                this.dialogRef.componentInstance.updateValue(this.progressAmount.toFixed(0));
                this.dialogRef.componentInstance.updateMessage(`Loading '${portfolioName}':  ${this.progressAmount.toFixed(0)}%`);

              }
            });
          } else {
            // Otherwise reject with the status text
            // which will hopefully be a meaningful error
            reject(false);
          }

          return resolve();
        };

        // Handle network errors
        req.onerror = function () {
          reject(Error('Network Error'));
        };

        // Make the request
        req.send();
      });
    });

  }

  public getPlotlyData(appInfo: PlotlyAppInfo): Promise<any> {
    return new Promise((resolve) => {
      const startDate = new Date(2030, 0, 1);
      const endDate = new Date(2030, 0, 2);
      switch (appInfo.valueName) {
        case 'capacity':
          return resolve(this.getYearlyData('capacity', 'Capacity', 1000, 3000));
        case 'summary':
          return resolve(this.getYearlyData('summary', 'Value', 1000, 3000));
        case 'storageCapacity':
          return resolve(this.getYearlyData('storageCapacity', 'Capacity', 1000, 3000));
        case 'curtailment':
          return resolve(this.getHourlyData('curtailment', 'Curtailment', startDate, endDate));
        case 'resources':
          return resolve(this.getHourlyData('resources', 'Resources', startDate, endDate));
        case 'power':
          return resolve(this.getHourlyData('power', 'Power', startDate, endDate));
        default:
          alert('Error');
      }
    });
  }

  private getYearlyData(databaseName: string, valueName: string, startYear: number, endYear: number): Promise<any> {
    const data = {};
    const results = this.portfolioDB[databaseName]({ Year: { lte: endYear } }, { Year: { gte: startYear } }).order('Year').each((record => {
      if (!(record['Technology'] in data)) {
        data[record['Technology']] = {};
      }
      if (!(record['Year'] in data[record['Technology']])) {
        data[record['Technology']][record['Year']] = 0;
      }
      data[record['Technology']][record['Year']] += Number(record[valueName]);

    }));
    console.log(data);
    return Promise.resolve(data);
  }

  private getHourlyData(databaseName: string, valueName: string, startDay: Date, endDate: Date): Promise<any> {
    const data = {};
    const results = this.portfolioDB[databaseName]({ Time: { lte: endDate.getTime() } }, { Time: { gte: startDay.getTime() } }).order('Time').each((record => {
      if (!(record['Technology'] in data)) {
        data[record['Technology']] = {};
      }
      const time = this.plotlyHourDate(record['Time']);
      if (!(time in data[record['Technology']])) {
        data[record['Technology']][time] = 0;
      }
      data[record['Technology']][time] += Number(record[valueName]);

    }));
    console.log(data);
    return Promise.resolve(data);
  }

  private plotlyHourDate(utcTime: string): string {
    const date = new Date(utcTime);
    let dateString = '';
    dateString += date.getFullYear() + '-';
    dateString += date.getMonth() + '-';
    dateString += date.getDate() + ' ';
    dateString += date.getHours();
    return dateString;
  }

}
