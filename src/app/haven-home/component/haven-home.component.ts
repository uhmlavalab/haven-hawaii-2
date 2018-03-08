import { Component } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Globals } from '../../globals';

@Component({
  selector: 'app-haven-home',
  templateUrl: './haven-home.component.html',
  styleUrls: ['./haven-home.component.css']
})
export class HavenHomeComponent {

  title = 'HAVEN';

  selectedDrawer = 'account';

  accountColor = 'primary';
  chartColor = 'accent';
  mapColor = 'accent';

  mainHeight: SafeStyle;
  sidebarWidth: number;
  toolbarHeight: number;
  drawerOpen: boolean;

  constructor (private globals: Globals, private sanitizer: DomSanitizer) {
    this.sidebarWidth = globals.sidebarWidth;
    this.toolbarHeight = globals.toolbarHeight;
    this.drawerOpen = globals.drawerOpen;
    this.mainHeight = sanitizer.bypassSecurityTrustStyle('calc(100vh - ' + ( 2 * globals.toolbarHeight) + 'px' + ')');
  }

  drawerToggle() {
    this.globals.drawerOpen = !this.globals.drawerOpen;
    this.drawerOpen = this.globals.drawerOpen;
  }

  sidebarChange(selection: string) {
    this.selectedDrawer = selection;
    if (selection === 'account') {
      this.accountColor = 'primary';
      this.chartColor = 'accent';
      this.mapColor = 'accent';
    } else if (selection === 'chart') {
      this.accountColor = 'accent';
      this.chartColor = 'primary';
      this.mapColor = 'accent';
    } else if (selection === 'map') {
      this.accountColor = 'accent';
      this.chartColor = 'accent';
      this.mapColor = 'primary';
    }
  }

}

