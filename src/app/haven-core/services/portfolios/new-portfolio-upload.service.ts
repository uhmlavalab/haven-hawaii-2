import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { PapaParseService } from 'ngx-papaparse';

import * as firebase from 'firebase';

@Injectable()
export class NewPortfolioUploadService {

  private numOfUploadedDocs = 0;
  private numTotalDocs = 0;

  constructor(private afAuth: AngularFireAuth, private papa: PapaParseService) {}

  uploadCSVFiles(keyCSV: any, capCSV: any, loadCSV: any, profileCSV: any, portfolioName: string, scenarioName: string) {
    this.processKeyCSV(keyCSV).then((keyData) => {
      this.processCapCSV(capCSV).then((capData) => {
        this.processLoadCSV(loadCSV).then((loadData) => {
          this.processProfileCSV(profileCSV).then((profileData) => {
            this.createREData(keyData, capData, loadData, profileData).then((reData) => {
              this.uploadFiles(keyData, capData, loadData, profileData, reData, portfolioName, scenarioName);
            });
          });
        });
      });
    });
  }

  uploadFiles(keyData: Object, capData: Object, loadData: Object, profileData: Object, reData: Object, portfolioName: string, scenarioName: string) {
    if (portfolioName !== '') {
      this.numTotalDocs = Object.keys(keyData).length + Object.keys(capData).length + Object.keys(loadData).length + Object.keys(profileData).length + Object.keys(reData).length;
      this.numOfUploadedDocs = 0;
      this.uploadData(keyData, 'key', portfolioName).then(() => {
        this.uploadData(capData, 'capacity', portfolioName, scenarioName).then(() => {
          this.uploadData(loadData, 'load', portfolioName).then(() => {
            this.uploadData(profileData, 'profile', portfolioName).then(() => {
              this.uploadData(reData, 'renewablePercent', portfolioName, scenarioName).then(() => {
                firebase.firestore().collection(this.afAuth.auth.currentUser.uid).doc('data').collection('portfolio_names').doc(portfolioName).set({
                  name: portfolioName,
                  uploadDate: Date.now(),
                });
                firebase.firestore().collection(this.afAuth.auth.currentUser.uid).doc('data').collection('portfolios').doc(portfolioName).collection('scenario_names').doc(scenarioName).set({
                  name: scenarioName,
                  uploadDate: Date.now(),
                });
               });
            });
          });
        });
      });
    }
  }

  uploadData(data: any, collectionName: string, portfolioName: string, scenarioName?: string): Promise<any> {
    if (Object.keys(data).length <= 0) {
      console.log(`${collectionName} - Finished Uploading`);
      return Promise.resolve(true);
    }
    let keyRef = firebase.firestore().collection(this.afAuth.auth.currentUser.uid).doc('data').collection('portfolios').doc(portfolioName).collection('portfolio_data').doc('data').collection(collectionName);
    if (scenarioName) {
      keyRef = firebase.firestore().collection(this.afAuth.auth.currentUser.uid).doc('data').collection('portfolios').doc(portfolioName).collection('scenarios').doc(scenarioName).collection(collectionName);
    }

    const batch = firebase.firestore().batch();
    let i = 0;
    while (i < 50 && Object.keys(data).length > 0) {
      const key = Object.keys(data)[0];
      const eleRef = keyRef.doc(key);
      batch.set(eleRef, data[key]);
      delete data[key];
      i++;
    }
    return batch.commit().then(() => {
      this.numOfUploadedDocs = this.numOfUploadedDocs + i;
      console.log(((this.numOfUploadedDocs / this.numTotalDocs) * 100) + '%');
      return this.uploadData(data, collectionName, portfolioName);
    });
  }

  processKeyCSV(keyCSV: any): Promise<Object> {
    return new Promise((complete) => {
      const keyData = {};
      this.papa.parse(keyCSV, {
        complete: (results) => {
          const columns = this.arrayToLowerCase(results.data[0]);
          const idIdx = columns.indexOf('id');
          const staIdx = columns.indexOf('station name');
          const typeIdx = columns.indexOf('fuel type');
          const profIdx = columns.indexOf('profile');
          const renewIdx = columns.indexOf('renewable');
          for (let i = 1; i < results.data.length; i++) {
            const id = Number.parseInt(results.data[i][idIdx]);
            const stationName = results.data[i][staIdx].toLowerCase();
            const fuelType = results.data[i][typeIdx].toLowerCase();
            const profile = results.data[i][profIdx].toLowerCase();
            const renewable = (results.data[i][renewIdx] === 'TRUE' ? true : false);
            const stationKey = `${id} - ${stationName}`;
            keyData[stationKey] = {
              'id': id,
              'station name': stationName,
              'fuel type': fuelType,
              'profile': profile,
              'renewable': renewable
            };
          }
          return complete(keyData);
        }
      });
    });
  }

  processCapCSV(capCSV: any): Promise<Object> {
    return new Promise((complete) => {
      const capData = {};
      this.papa.parse(capCSV, {
        complete: (results) => {
          const columns = this.arrayToLowerCase(results.data[0]);
          const idIdx = columns.indexOf('id');
          const yearIdx = columns.indexOf('year');
          const capIdx = columns.indexOf('capacity');
          for (let i = 1; i < results.data.length; i++) {
            const id = Number.parseInt(results.data[i][idIdx]);
            const year = Number.parseInt(results.data[i][yearIdx]);
            const capacity = Number.parseFloat(results.data[i][capIdx].replace(/,/g, ''));
            if (!capData.hasOwnProperty(year)) {
              capData[year] = {};
              capData[year]['year'] = year;
            }
            capData[year][id] = capacity;
          }
          return complete(capData);
        }
      });
    });
  }

  processLoadCSV(loadCSV: any): Promise<Object> {
    return new Promise((complete) => {
      const loadData = {};
      this.papa.parse(loadCSV, {
        complete: (results) => {
          const columns = this.arrayToLowerCase(results.data[0]);
          const timeIdx = columns.indexOf('time');
          const loadIdx = columns.indexOf('load');
          for (let i = 1; i < results.data.length; i++) {
            const time = new Date(results.data[i][timeIdx]);
            const load = Math.abs(Number.parseFloat(results.data[i][loadIdx].replace(/,/g, '')));
            const hour = time.getHours();
            const dateKey = new Date(time.getFullYear(), time.getMonth(), time.getDate()).toDateString().split(' ').slice(1, 4).join(' ');
            if (!loadData.hasOwnProperty(dateKey)) {
              loadData[dateKey] = {};
              loadData[dateKey]['time'] = time;
            }
            loadData[dateKey][hour] = load;
          }
          return complete(loadData);
        }
      });
    });
  }

  processProfileCSV(profileCSV: any): Promise<Object> {
    return new Promise((complete) => {
      const profileData = {};
      this.papa.parse(profileCSV, {
        complete: (results) => {
          const columns = this.arrayToLowerCase(results.data[0]);
          const indexs = {};
          for (let i = 0; i < columns.length; i++) {
            indexs[columns[i]] = i;
          }
          for (let i = 1; i < results.data.length; i++) {
            const row = {};
            const time = new Date(results.data[i][indexs['time']]);
            const hour = time.getHours();
            const dateKey = new Date(time.getFullYear(), time.getMonth(), time.getDate()).toDateString().split(' ').slice(1, 4).join(' ');
            if (!profileData.hasOwnProperty(dateKey)) {
              profileData[dateKey] = {};
              profileData[dateKey]['time'] = time;
            }
            if (!profileData[dateKey].hasOwnProperty(hour)) {
              profileData[dateKey][hour] = {};
            }
            for (let j = 0; j < columns.length; j++) {
              if (columns[j] !== 'time') {
                profileData[dateKey][hour][columns[j]] = Number.parseFloat(results.data[i][indexs[columns[j]]].replace(/,/g, ''));
              }
            }
          }
          return complete(profileData);
        }
      });
    });
  }

  createREData(keyData: Object, capData: Object, loadData: Object, profileData: Object): Promise<Object> {
    return new Promise((complete) => {

      // Create Renewable Key
      const renewableKey = {};
      Object.keys(keyData).forEach(station => {
        if (keyData[station]['renewable']) {
          const id = keyData[station]['id'];
          renewableKey[id] = {};
          renewableKey[id]['profile'] = keyData[station]['profile'];
          Object.keys(capData).forEach(capYear => {
            const stationCap = capData[capYear][id];
            renewableKey[id][capYear] = stationCap;
          });
        }
      });

      // Create Yearly Load Totals
      const yearlyLoad = {};
      Object.keys(loadData).forEach(day => {
        const year = loadData[day]['time'].getFullYear();
        if (!yearlyLoad.hasOwnProperty(year)) {
          yearlyLoad[year] = 0;
        }
        Object.keys(loadData[day]).forEach(hours => {
          if (hours !== 'time') {
            yearlyLoad[year] += loadData[day][hours];
          }
        });
      });

      // Create Yearly Renewable Supply Totals
      const renewableSupply = {};
      Object.keys(profileData).forEach(day => {
        const year = profileData[day]['time'].getFullYear();
        if (!renewableSupply.hasOwnProperty(year)) {
          renewableSupply[year] = 0;
        }
        Object.keys(profileData[day]).forEach(hour => {
          if (hour !== 'time') {
            const hourlyProfile = profileData[day][hour];
            Object.keys(renewableKey).forEach(renewableStation => {
              const stationProfile = renewableKey[renewableStation]['profile'];
              const capacityValue = renewableKey[renewableStation][year];
              const profileValue = hourlyProfile[stationProfile];
              const supplyValue = profileValue * capacityValue;
              if (!isNaN(supplyValue)) {
                renewableSupply[year] += supplyValue;
              }
            });
          }
        });
      });
      // Create RE Data
      const reData = {};
      Object.keys(renewableSupply).forEach(year => {
        if (yearlyLoad.hasOwnProperty(year)) {
          const renewTotal = renewableSupply[year];
          const loadTotal = yearlyLoad[year];
          reData[year] = {'re': renewTotal / loadTotal, 'year': year };
        }
      });
      return complete(reData);
    });
  }


  arrayToLowerCase(input) {
    return input.join('|').toLowerCase().split('|');
  }

}
