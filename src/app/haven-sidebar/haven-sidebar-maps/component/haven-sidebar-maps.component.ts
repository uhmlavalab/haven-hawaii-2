import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';

import { HavenWindowService } from '../../../haven-window/services/haven-window.service';
import { LayerColorsService } from '../../../haven-apps/leaflet/services/layer-colors.service';
import { HavenWindow } from '../../../haven-window/shared/haven-window';
import { HavenApp } from '../../../haven-apps/shared/haven-app';

@Component({
  selector: 'app-haven-sidebar-maps',
  templateUrl: './haven-sidebar-maps.component.html',
  styleUrls: ['./haven-sidebar-maps.component.css']
})
export class HavenSidebarMapsComponent implements OnInit {
  items: Observable<any[]>;

  layersRef: AngularFireList<any>;
  layers: Observable<any[]>;

  layerSelected = {};
  layerColors = {};

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private windowService: HavenWindowService, public layerColorsService: LayerColorsService, private afStorage: AngularFireStorage) {

    this.layersRef = db.list(`/users/${this.afAuth.auth.currentUser.uid}/layers`);
    this.layers = this.layersRef.snapshotChanges().map(changes => {
      for (const layer in this.layerSelected ) {
        if (this.layerSelected.hasOwnProperty(layer)) {
          this.layerSelected[layer] = false;
        }
      }
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

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
    const havenWindow = new HavenWindow('test', 'test', 100, 100, 400, 400);
    const newApp = new HavenApp('leaflet');
    newApp.appName = 'leaflet';
    newApp.appInfo = {};
    newApp.appInfo.selectedLayers = selectedLayers;
    havenWindow.app = newApp;
    this.windowService.addWindow(havenWindow);
  }

  toggleLayerCheck(name, event) {
    const value = !event.srcElement.childNodes[0].checked;
    this.layerSelected[name] = value;
  }

  colorCheck(layerName: string, event) {
    const color = event.srcElement.value;
    this.layerColorsService.setLayerColor(layerName, color);
  }

  deleteLayer(layerKey: string, layerName: string) {
    this.db.list(`/users/${this.afAuth.auth.currentUser.uid}/layers/${layerKey}`).remove();
    this.afStorage.storage.ref(`/users/${this.afAuth.auth.currentUser.uid}/layers/${layerName}`).delete();
  }
}
