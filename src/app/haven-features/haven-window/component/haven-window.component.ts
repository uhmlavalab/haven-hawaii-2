import { Component, AfterContentInit, Input, ViewChild, Renderer } from '@angular/core';

import { HavenWindowService } from '@app/haven-core';
import { Globals } from '@app/haven-core';

import { HavenWindow } from '../shared/haven-window';

@Component({
  selector: 'app-haven-window',
  templateUrl: './haven-window.component.html',
  styleUrls: ['./haven-window.component.css'],
  providers: []
})
export class HavenWindowComponent implements AfterContentInit {

  @ViewChild('windowDiv') windowDiv;
  @ViewChild('appRef') appRef;

  drawerOpen = false;

  havenWindow: HavenWindow;

  constructor(private havenWindowService: HavenWindowService, private _renderer: Renderer, private globals: Globals) { }

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
    this.havenWindowService.bringWindowForward(this.havenWindow.id);
  }

  removeWindow() {
    this.havenWindowService.removeWindow(this.havenWindow.id);
  }

  drawerToggle() {
    this.drawerOpen = !this.drawerOpen;
  }

}
