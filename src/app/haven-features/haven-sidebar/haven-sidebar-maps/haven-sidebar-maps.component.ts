
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { HavenWindowService, PortfolioService } from '@app/haven-core';
import { LayersService } from '@app/haven-core';

import { HavenWindow } from '../../haven-window/shared/haven-window';
import { HavenApp } from '../../haven-apps/shared/haven-app';

import { HavenNewLayerComponent } from '../../haven-new-layer/haven-new-layer.component';

import { LeafletAppInfo } from '../../haven-apps/leaflet/shared/leaflet-app-info';

@Component({
  selector: 'app-haven-sidebar-maps',
  templateUrl: './haven-sidebar-maps.component.html',
  styleUrls: ['./haven-sidebar-maps.component.css']
})
export class HavenSidebarMapsComponent {

  selectedMapStyle = 'street';
  mapStyles = [
    {
      name: 'street',
      url: './assets/mapthumbnails/street.png',
    },
    {
      name: 'satellite',
      url: './assets/mapthumbnails/satellite.png'
    },
    {
      name: 'terrain',
      url: './assets/mapthumbnails/terrain.png'
    }
  ];

  layerColors = {};

  selectedYear: number;
  selectedScenario = '';

  colorUpdateFinished = true;
  layerColorChangeName: string;
  constructor(public dialog: MatDialog, private windowService: HavenWindowService, public portfolioService: PortfolioService, public layerService: LayersService) {
  }

  openNewLayerDialog(): void {
    const dialogRef = this.dialog.open(HavenNewLayerComponent, { width: '450px' });
  }

  createMapWindow() {
    const title = `Map - ${this.selectedYear}`;
    const footer = `${this.portfolioService.getSelectedPortfolioName()} - ${this.selectedScenario}`;
    const havenWindow = new HavenWindow(title, footer, 100, 100, 400, 400, false);
    const appInfo = new LeafletAppInfo(
      this.portfolioService.getSelectedPortfolioName(),
      this.selectedScenario, this.selectedYear,
      21.480066,
      -157.96,
      11,
      this.selectedMapStyle);
    const newApp = new HavenApp('leaflet', appInfo);
    havenWindow.app = newApp;
    this.windowService.addWindow(havenWindow);
  }

  setMapStyle(styleName: string) {
    this.selectedMapStyle = styleName;
  }


  deleteLayer(layerName: string) {
    this.layerService.deleteLayer(layerName);
  }

  scenarioChange() {
    this.portfolioService.setScenario(this.selectedScenario);
  }

}
