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

  updateLayer(layerId: string, name: string, color: string, selectedProfiles: string[]) {
    this.portfolioService.getSelectedPortfolioRef().collection('layers').doc(layerId).update({
      'name': name,
      'color': color,
      'profiles': selectedProfiles,
    }).then(() => {
      console.log(`${layerId} Sucessfully Updated`);
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

}
