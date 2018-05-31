import { Injectable } from '@angular/core';
import { isUndefined } from 'util';
import { Subject } from 'rxjs/subject';

import { Globals } from '../../globals';

import { PortfolioService } from '../portfolios/portfolio.service';

import { HavenDialogService } from '@app/haven-shared';

import { LeafletAppInfo } from '@app/haven-features';

@Injectable()
export class LayersService {

  constructor(private portfolioService: PortfolioService, private dialogService: HavenDialogService) { }

  updateLayerColor(layerName: string, color: string): Promise<boolean> {
    const layerRef = this.portfolioService.getSelectedPortfolioRef().collection('layers').doc(layerName);
    return layerRef.update({ 'color': color }).then(() => Promise.resolve(true));
  }

  getLayerColor(portfolioName: string, layerName: string): Promise<string> {
    return this.portfolioService.getSelectedPortfolioRef().collection('layers').doc(layerName).get().then((docSnapshot) => {
      return Promise.resolve(docSnapshot.data()['color']);
    });
  }

  deleteLayer(layerName: string) {
    this.dialogService.openConfirmationMessage(`Are you sure you want to delete ${layerName}?`)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          const layerRef = this.portfolioService.getSelectedPortfolioRef().collection('layers').doc(layerName);
          layerRef.delete();
        }
      });
  }

  getSupplyOfProfiles(queryInfo: LeafletAppInfo, profiles: any[]): Promise<any> {
    const startDate = new Date(queryInfo.year, 0, 1);
    const endDate = new Date(queryInfo.year, 11, 31);
    return this.portfolioService.getCapacityCollection(queryInfo.portfolioName, queryInfo.scenarioName).where('year', '>=', 2000).where('year', '<=', 3000).get().then((capacitySnapshot) => {
      return this.portfolioService.getProfilesCollection(queryInfo.portfolioName).where('time', '>=', startDate).where('time', '<=', endDate).get().then((profileSnapshot) => {
        return this.portfolioService.getKeyCollection(queryInfo.portfolioName).get().then((keySnapshot) => {
          return this.processCapacityDocs(capacitySnapshot.docs).then((capacityData) => {
            return this.processKeyDocs(keySnapshot.docs, profiles).then((keyData) => {
              return this.processProfileDocs(profileSnapshot.docs).then((profileData) => {
                return this.createSupplyData(keyData, capacityData, profileData).then((processedData) => {
                  return this.formatProcessedData(processedData);
                });
              });
            });
          });
        });
      });
    });
  }

  private processKeyDocs(keyDocs: any[], profiles: any[]): Promise<Object> {
    return new Promise((complete) => {
      const keys = {};
      for (let i = 0; i < keyDocs.length; i++) {
        const doc = keyDocs[i].data();
        if (profiles.indexOf(doc['id']) !== -1) {
          keys[doc['id']] = doc;
        }
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

  private formatProcessedData(data: Object): Promise<number> {
    return new Promise((complete) => {
      let supplyAmount = 0;
      for (const datagroupName in data) {
        if (data.hasOwnProperty(datagroupName)) {
          const traces = [];
          for (const traceName in data[datagroupName]) {
            if (data[datagroupName].hasOwnProperty(traceName)) {
              const x = [];
              const y = [];
              for (const xVal in data[datagroupName][traceName]) {
                if (data[datagroupName][traceName].hasOwnProperty(xVal)) {
                  supplyAmount += data[datagroupName][traceName][xVal];
                }
              }
            }
          }
        }
      }
      return complete(supplyAmount);
    });
  }

}
