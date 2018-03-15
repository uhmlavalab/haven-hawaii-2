import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { HavenWindowService } from '../../../haven-window/services/haven-window.service';
import { HavenWindow } from '../../../haven-window/shared/haven-window';
import { HavenApp } from '../../../haven-apps/shared/haven-app';

@Component({
  selector: 'app-haven-sidebar-maps',
  templateUrl: './haven-sidebar-maps.component.html',
  styleUrls: ['./haven-sidebar-maps.component.css']
})
export class HavenSidebarMapsComponent implements OnInit {
  items: Observable<any[]>;

  constructor(db: AngularFirestore, private windowService: HavenWindowService) {

    this.items = db.collection('storage').valueChanges();

    window.addEventListener('dragover', e => e.preventDefault(), false);
    window.addEventListener('drop', e => e.preventDefault(), false);


  }

  ngOnInit() {
  }

  createMapWindow() {
    const havenWindow = new HavenWindow('test', 'test', 100, 100, 400, 400);
    const newApp = new HavenApp('leaflet');
    newApp.appName = 'leaflet';
    havenWindow.app = newApp;
    this.windowService.addWindow(havenWindow);
  }

}
