import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';

import { HavenWindowService, PortfolioService } from '@app/haven-core';
import { LayerColorsService } from '@app/haven-core';

import { HavenWindow } from '../../haven-window/shared/haven-window';
import { HavenApp } from '../../haven-apps/shared/haven-app';

import { LeafletAppInfo } from '../../haven-apps/leaflet/shared/leaflet-app-info';

@Component({
  selector: 'app-haven-sidebar-maps',
  templateUrl: './haven-sidebar-maps.component.html',
  styleUrls: ['./haven-sidebar-maps.component.css']
})
export class HavenSidebarMapsComponent implements OnInit {

  selectedMapStyle = 'street';
  mapStyles = [
    {
      name: 'street',
      url: './assets/mapthumbnails/street.png',
      div: ViewChild,
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

  layerSelected = {};
  layerColors = {};

  constructor(private windowService: HavenWindowService, public portfolioService: PortfolioService, public layerColorsService: LayerColorsService) {
    window.addEventListener('dragover', e => e.preventDefault(), false);
    window.addEventListener('drop', e => e.preventDefault(), false);
  }

  ngOnInit() {
  }

  createMapWindow() {
    const selectedLayers = [];
    for (const layerName in this.layerSelected) {
      if (this.layerSelected[layerName]) {
        selectedLayers.push({ name: layerName, color: this.layerColorsService.getLayerColor(layerName) });
      }
    }
    const havenWindow = new HavenWindow('Map', '', 100, 100, 400, 400, false);
    const appInfo = new LeafletAppInfo(21.480066,  -157.96, 11, this.selectedMapStyle, selectedLayers);
    const newApp = new HavenApp('leaflet', appInfo);
    havenWindow.app = newApp;
    this.windowService.addWindow(havenWindow);
  }

  setMapStyle(styleName: string) {
    this.selectedMapStyle = styleName;
  }

  toggleLayerCheck(name, event) {
    const value = !event.srcElement.childNodes[0].checked;
    this.layerSelected[name] = value;
  }

  colorCheck(layerName: string, event) {
    const color = event.srcElement.value;
    this.layerColorsService.setLayerColor(layerName, color);
  }

  deleteLayer() {
    // TODO
  }

}
