import { Component } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Globals } from '@app/haven-core';

@Component({
  selector: 'app-haven-home',
  templateUrl: './haven-home.component.html',
  styleUrls: ['./haven-home.component.css']
})
export class HavenHomeComponent {

  title = 'HAVEN';

  selectedDrawer = 'scenario';

  scenarioColor = 'primary';
  chartColor = 'warn';
  mapColor = 'warn';

  mainHeight: SafeStyle;
  sidebarWidth: number;
  toolbarHeight: number;
  drawerOpen: boolean;

  constructor(private globals: Globals, private sanitizer: DomSanitizer) {
    this.sidebarWidth = globals.sidebarWidth;
    this.toolbarHeight = globals.toolbarHeight;
    this.drawerOpen = globals.drawerOpen;
    this.mainHeight = sanitizer.bypassSecurityTrustStyle('calc(100vh - ' + (2 * globals.toolbarHeight) + 'px' + ')');
  }

  drawerToggle() {
    this.globals.drawerOpen = !this.globals.drawerOpen;
    this.drawerOpen = this.globals.drawerOpen;
  }

  sidebarChange(selection: string) {
    this.selectedDrawer = selection;
    if (selection === 'scenario') {
      this.scenarioColor = 'primary';
      this.chartColor = 'warn';
      this.mapColor = 'warn';
    } else if (selection === 'chart') {
      this.scenarioColor = 'warn';
      this.chartColor = 'primary';
      this.mapColor = 'warn';
    } else if (selection === 'map') {
      this.scenarioColor = 'warn';
      this.chartColor = 'warn';
      this.mapColor = 'primary';
    }
  }

}

