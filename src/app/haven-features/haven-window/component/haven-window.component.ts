import { Component, AfterContentInit, ViewChild, Renderer } from '@angular/core';

import { HavenWindowService, ScenariosService } from '@app/haven-core';
import { Globals } from '@app/haven-core';

import { HavenWindow } from '../shared/haven-window';
import { viewClassName } from '@angular/compiler';
import { MatToolbar } from '@angular/material';

@Component({
  selector: 'app-haven-window',
  templateUrl: './haven-window.component.html',
  styleUrls: ['./haven-window.component.css'],
  providers: []
})
export class HavenWindowComponent implements AfterContentInit {

  @ViewChild('windowDiv') windowDiv;
  @ViewChild('windowHeader') windowHeader: MatToolbar
  @ViewChild('windowFooter') windowFooter: MatToolbar
  @ViewChild('appRef') appRef;

  drawerOpen = false;

  havenWindow: HavenWindow;

  constructor(private havenWindowService: HavenWindowService, private scenariosService: ScenariosService, private _renderer: Renderer, private globals: Globals) {
   

  }

  ngAfterContentInit() {
    this.setWindowInitialSettings();
    this.havenWindowService.WindowZUpdate.subscribe(windows => {
      this.windowDiv.nativeElement.style.zIndex = windows[this.havenWindow.id];
    });

  }

  setWindowInitialSettings() {
    this.windowDiv.nativeElement.style.width = this.havenWindow.size.width + 'px';
    this.windowDiv.nativeElement.style.height = this.havenWindow.size.height + 'px';
    this.windowDiv.nativeElement.style.left = this.havenWindow.position.left + 'px';
    this.windowDiv.nativeElement.style.top = this.havenWindow.position.top + 'px';
    this.windowDiv.nativeElement.style.zIndex = 100;
    this.scenariosService.getScenarioColor(this.havenWindow.app.appInfo.scenarioId).then(color => {
      this.windowHeader._elementRef.nativeElement.style.backgroundColor = color;
      this.windowFooter._elementRef.nativeElement.style.backgroundColor = color;
    })
    this.havenWindowService.bringWindowForward(this.havenWindow.id);
  }

  removeWindow() {
    this.havenWindowService.removeWindow(this.havenWindow.id);
  }

  drawerToggle() {
    this.drawerOpen = !this.drawerOpen;
  }

}
