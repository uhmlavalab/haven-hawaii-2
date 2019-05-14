
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { HavenWindowService, ScenariosService, LayersService } from '@app/haven-core';

import { HavenWindow, LeafletAppInfo } from '@app/haven-features';
import { HavenApp } from '@app/haven-features';

@Component({
  selector: 'app-haven-sidebar-maps',
  templateUrl: './haven-sidebar-maps.component.html',
  styleUrls: ['./haven-sidebar-maps.component.css']
})
export class HavenSidebarMapsComponent {
  selectedScenario = '';
  scenarios = [];

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

  selShare: any;

  colorUpdateFinished = true;
  layerColorChangeName: string;
  constructor(public dialog: MatDialog, private windowService: HavenWindowService, public layersService: LayersService, public scenariosService: ScenariosService, public layerService: LayersService) {
    this.scenariosService.getScenariosList().then(scenarios => {
      this.scenarios = scenarios;
    });
  }

  createMapWindow() {
    const title = `Map - ${this.scenariosService.getSelectedScenarioName()} - ${this.selShare.year}`;
    const footer = ``;
    const havenWindow = new HavenWindow(title, footer, 100, 100, 400, 400, false);
    const appInfo = new LeafletAppInfo(
      this.scenariosService.getSelectedScenarioName(),
      this.scenariosService.getSelectScenarioId(),
      this.selShare.year,
      this.selectedMapStyle,
      21.480066,
      -157.96,
      11);
    const newApp = new HavenApp('leaflet', appInfo);
    havenWindow.app = newApp;
    this.windowService.addWindow(havenWindow);
  }

  setMapStyle(styleName: string) {
    this.selectedMapStyle = styleName;
  }

  setScenario() {
    this.scenariosService.setScenario(this.selectedScenario);
  }

}
