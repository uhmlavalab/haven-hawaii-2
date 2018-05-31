import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase';
import 'rxjs/add/operator/take';

import { PortfolioService } from '../portfolios/portfolio.service';
import { PlotlyAppInfo } from '@app/haven-features';

@Injectable()
export class PlotlyFirestoreQueryService {

  constructor(private portfolioService: PortfolioService, private afs: AngularFirestore, private afAuth: AngularFireAuth) { }

  public getData(queryInfo: PlotlyAppInfo): Promise<any[]> {
    switch (queryInfo.valueName) {
      case 'load':
        return this.getLoad(queryInfo);
      case 'capacity':
        return this.getCapacity(queryInfo);
      case 'supply':
        return this.getSupply(queryInfo);
    }
  }

  private getCapacity(queryInfo: PlotlyAppInfo): Promise<any> {
    return this.portfolioService.getCapacityCollection(queryInfo.portfolioName, queryInfo.scenarioName).where('year', '>=', 2000).where('year', '<=', 3000).get().then((capacitySnapshot) => {
      return this.portfolioService.getKeyCollection(queryInfo.portfolioName).get().then((keySnapshot) => {
        return this.processKeyDocs(keySnapshot.docs).then((keyData) => {
          return this.processCapacityDocs(capacitySnapshot.docs).then((capacityData) => {
            return this.createCapacityData(keyData, capacityData).then((processedData) => {
              return this.formatProcessedData(queryInfo, processedData);
            });
          });
        });
      });
    });
  }

  private getLoad(queryInfo: PlotlyAppInfo): Promise<any> {
    return this.portfolioService.getLoadCollection(queryInfo.portfolioName, queryInfo.loadName).where('time', '>=', queryInfo.startDate).where('time', '<=', queryInfo.endDate).get().then((loadSnapshot) => {
      return this.processLoadDocs(loadSnapshot.docs).then((loadData) => {
        return this.createLoadData(loadData).then((processedData) => {
          return this.formatProcessedData(queryInfo, processedData);
        });
      });
    });
  }

  private getSupply(queryInfo: PlotlyAppInfo): Promise<any> {
    return this.portfolioService.getCapacityCollection(queryInfo.portfolioName, queryInfo.scenarioName).where('year', '>=', 2000).where('year', '<=', 3000).get().then((capacitySnapshot) => {
      return this.portfolioService.getProfilesCollection(queryInfo.portfolioName).where('time', '>=', queryInfo.startDate).where('time', '<=', queryInfo.endDate).get().then((profileSnapshot) => {
        return this.portfolioService.getKeyCollection(queryInfo.portfolioName).get().then((keySnapshot) => {
          return this.processCapacityDocs(capacitySnapshot.docs).then((capacityData) => {
            return this.processKeyDocs(keySnapshot.docs).then((keyData) => {
              return this.processProfileDocs(profileSnapshot.docs).then((profileData) => {
                return this.createSupplyData(keyData, capacityData, profileData).then((processedData) => {
                  return this.formatProcessedData(queryInfo, processedData);
                });
              });
            });
          });
        });
      });
    });
  }

  private processKeyDocs(keyDocs: any[]): Promise<Object> {
    return new Promise((complete) => {
      const keys = {};
      for (let i = 0; i < keyDocs.length; i++) {
        const doc = keyDocs[i].data();
        keys[doc['id']] = doc;
      }
      return complete(keys);
    });
  }

  private processCapacityDocs(capacityDocs: any[]): Promise<Object> {
    return new Promise((complete) => {
      const capacity = {};
      for (let i = 0; i < capacityDocs.length; i++) {
        const doc = capacityDocs[i].data();
        capacity[doc['year']] = doc;
        delete capacity[doc['year']]['year'];
      }
      return complete(capacity);
    });
  }

  private processLoadDocs(loadDocs: any[]): Promise<Object> {
    return new Promise((complete) => {
      const loads = {};
      for (let i = 0; i < loadDocs.length; i++) {
        const doc = loadDocs[i].data();
        loads[doc['time']] = doc;
        delete loads[doc['time']]['time'];
      }
      return complete(loads);
    });
  }

  private processProfileDocs(profileDocs: any[]): Promise<Object> {
    return new Promise((complete) => {
      const profiles = {};
      for (let i = 0; i < profileDocs.length; i++) {
        const doc = profileDocs[i].data();
        profiles[doc['time']] = doc;
        delete profiles[doc['time']]['time'];
      }
      return complete(profiles);
    });
  }

  private createCapacityData(keyData: Object, capacityData: Object): Promise<Object> {
    return new Promise((complete) => {
      const processedCapacityData = {};
      for (const year in capacityData) {
        if (capacityData.hasOwnProperty(year)) {
          for (const station in capacityData[year]) {
            if (capacityData[year].hasOwnProperty(station)) {
              const fuelType = keyData[station]['fuel type'];
              const capacityValue = capacityData[year][station];
              if (!processedCapacityData.hasOwnProperty(fuelType)) {
                processedCapacityData[fuelType] = {};
              }
              if (!processedCapacityData[fuelType].hasOwnProperty(year)) {
                processedCapacityData[fuelType][year] = 0;
              }
              processedCapacityData[fuelType][year] += capacityValue;
            }
          }
        }
      }
      return complete({ 'Capacity': processedCapacityData });
    });
  }

  private createLoadData(loadData: Object): Promise<Object> {
    return new Promise((complete) => {
      const processedLoadData = {};
      for (const day in loadData) {
        if (loadData.hasOwnProperty(day)) {
          for (const hour in loadData[day]) {
            if (loadData[day].hasOwnProperty(hour)) {
              if (!processedLoadData.hasOwnProperty(day)) {
                processedLoadData[day] = {};
              }
              if (!processedLoadData[day].hasOwnProperty('load')) {
                processedLoadData[day]['load'] = {};
              }
              processedLoadData[day]['load'][hour] = loadData[day][hour];
            }
          }
        }
      }
      return complete(processedLoadData);
    });
  }

  private createSupplyData(keyData: Object, capacityData: Object, profileData: Object): Promise<Object> {
    return new Promise((complete) => {
      const processedSupplyData = {};
      for (const day in profileData) {
        if (profileData.hasOwnProperty(day)) {
          for (const hour in profileData[day]) {
            if (profileData[day].hasOwnProperty(hour)) {
              for (const station in keyData) {
                if (keyData.hasOwnProperty(station)) {
                  const fuelType = keyData[station]['fuel type'];
                  const profile = keyData[station]['profile'];
                  const id = keyData[station]['id'];
                  const hourProfiles = profileData[day][hour];
                  if (hourProfiles.hasOwnProperty(profile)) {
                    const year = new Date(day).getFullYear();
                    const capValue = capacityData[year][id];
                    const profileValue = hourProfiles[profile];
                    const supply = capValue * profileValue;
                    if (!processedSupplyData.hasOwnProperty(day)) {
                      processedSupplyData[day] = {};
                    }
                    if (!processedSupplyData[day].hasOwnProperty(fuelType)) {
                      processedSupplyData[day][fuelType] = {};
                    }
                    if (!processedSupplyData[day][fuelType].hasOwnProperty(hour)) {
                      processedSupplyData[day][fuelType][hour] = 0;
                    }
                    processedSupplyData[day][fuelType][hour] += supply;
                  }
                }
              }
            }
          }
        }
      }
      return complete(processedSupplyData);
    });
  }

  private formatProcessedData(queryInfo: PlotlyAppInfo, data: Object): Promise<Object> {
    switch (queryInfo.chartType) {
      case 'scatter':
        return this.formatDataForScatter(data);
      case 'bar':
        return this.formatDataforBar(data);
      case 'heatmap':
        return this.formatDataForHeatmap(data);
    }
  }

  private formatDataForScatter(data: Object): Promise<any[]> {
    return new Promise((complete) => {
      const dataList = [];
      for (const datagroupName in data) {
        if (data.hasOwnProperty(datagroupName)) {
          const traces = [];
          for (const traceName in data[datagroupName]) {
            if (data[datagroupName].hasOwnProperty(traceName)) {
              const x = [];
              const y = [];
              for (const xVal in data[datagroupName][traceName]) {
                if (data[datagroupName][traceName].hasOwnProperty(xVal)) {
                  x.push(Number(xVal));
                  y.push(data[datagroupName][traceName][xVal]);
                }
              }
              traces.push({ x, y, mode: 'lines', type: 'scatter', name: traceName });
            }
          }
          dataList.push({ 'name': datagroupName, 'traces': traces });
        }
      }
      return complete(dataList);
    });
  }

  private formatDataforBar(data: Object): Promise<any[]> {
    return new Promise((complete) => {
      const dataList = [];
      for (const datagroupName in data) {
        if (data.hasOwnProperty(datagroupName)) {
          const traces = [];
          for (const traceName in data[datagroupName]) {
            if (data[datagroupName].hasOwnProperty(traceName)) {
              const x = [];
              const y = [];
              for (const xVal in data[datagroupName][traceName]) {
                if (data[datagroupName][traceName].hasOwnProperty(xVal)) {
                  x.push(Number(xVal));
                  y.push(data[datagroupName][traceName][xVal]);
                }
              }
              traces.push({ x, y, type: 'bar', name: traceName });
            }
          }
          dataList.push({ 'name': datagroupName, 'traces': traces });
        }
      }
      return complete(dataList);
    });
  }

  private formatDataForHeatmap(data: Object): Promise<any[]> {
    return new Promise((complete) => {
      const dataList = [];
      for (const datagroupName in data) {
        if (data.hasOwnProperty(datagroupName)) {
          const z = [];
          const y = [];
          const x = [];
          for (const traceName in data[datagroupName]) {
            if (data[datagroupName].hasOwnProperty(traceName)) {
              y.push(traceName);
              const zTraceValues = [];
              for (const xVal in data[datagroupName][traceName]) {
                if (data[datagroupName][traceName].hasOwnProperty(xVal)) {
                  if (x.indexOf(xVal) === -1) { x.push(xVal); }
                  zTraceValues.push(data[datagroupName][traceName][xVal]);
                }
              }
              z.push(zTraceValues);
            }
          }
          dataList.push({ x, y, z, type: 'heatmap', 'name': datagroupName, 'colorscale': 'Portland', xgap: 1, ygap: 1 });
        }
      }
      return complete(dataList);
    });
  }

}
