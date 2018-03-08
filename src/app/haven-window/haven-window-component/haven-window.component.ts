import { Component, AfterContentInit, Input, ViewChild, Renderer } from '@angular/core';

import { HavenWindowService } from '../haven-window-service/haven-window.service';
import { HavenWindow } from '../haven-window';

import { Globals } from '../../globals';

@Component({
  selector: 'app-haven-window',
  templateUrl: './haven-window.component.html',
  styleUrls: ['./haven-window.component.css'],
  providers: []
})
export class HavenWindowComponent implements AfterContentInit {

  @ViewChild('windowDiv') windowDiv;
  @ViewChild('titleDiv') titleDiv;
  @ViewChild('appRef') appRef;

  havenWindow = new HavenWindow();

  mouseWindowLeft: number;
  mouseWindowTop: number;

  dragbarSelected = false;
  resizeSelected = false;

  resizeStartLeft: number;
  resizeStartTop: number;
  resizeStartWidth: number;
  resizeStartHeight: number;

  windowLock = false;

   drawerOpen = false;

  constructor(private havenWindowService: HavenWindowService, private _renderer: Renderer, private globals: Globals) { }

  ngAfterContentInit() {
    this.havenWindow.size.width = 400;
    this.havenWindow.size.height = 400;
    this.havenWindow.position.top = 400;
    this.havenWindow.position.left = 400;
    this.havenWindow.footer = 'This is the footer';
    this.havenWindow.header = 'This is the header';
    this.windowDiv.nativeElement.style.width = this.havenWindow.size.width + 'px';
    this.windowDiv.nativeElement.style.height = this.havenWindow.size.height + 'px';
    this.windowDiv.nativeElement.style.left = this.havenWindow.position.left + 'px';
    this.windowDiv.nativeElement.style.top = this.havenWindow.position.top + 'px';
    this.havenWindowService.WindowZUpdate.subscribe(windows => this.windowDiv.nativeElement.style.zIndex = windows[this.havenWindow.id]);
    this.bringForward();
  }

  public removeWindow() {
    this.havenWindowService.removeWindow(this.havenWindow.id);
  }

  maximize() {
    if (!this.havenWindow.maximized) {
      this.havenWindow.savePosition.left = this.havenWindow.position.left;
      this.havenWindow.savePosition.top = this.havenWindow.position.top;
      this.havenWindow.saveSize.height = this.havenWindow.size.height;
      this.havenWindow.saveSize.width = this.havenWindow.size.width;

      this.havenWindow.position.left = 0;
      this.havenWindow.position.top = 30;

      this.windowDiv.nativeElement.style.left = 0 + 'px';
      this.windowDiv.nativeElement.style.top = 30 + 'px';
      this.windowDiv.nativeElement.style.width = window.innerWidth + 'px';
      this.windowDiv.nativeElement.style.height = window.innerHeight - 60 + 'px';
      this._renderer.setElementStyle(this.windowDiv.nativeElement, 'background-color', 'rgba(255, 255, 255,' + 1.0 + ')');
      this.havenWindow.maximized = true;
      this.appRef.resize();

    } else {
      this.windowDiv.nativeElement.style.left = this.havenWindow.savePosition.left + 'px';
      this.windowDiv.nativeElement.style.top = this.havenWindow.savePosition.top + 'px';
      this.windowDiv.nativeElement.style.width = this.havenWindow.saveSize.width + 'px';
      this.windowDiv.nativeElement.style.height = this.havenWindow.saveSize.height + 'px';

      this.havenWindow.position.left = this.havenWindow.savePosition.left;
      this.havenWindow.position.top = this.havenWindow.savePosition.top;

      this.havenWindow.maximized = false;
      this.appRef.resize();
    }
  }


  dragbarClick(event) {
    this.dragbarSelected = true;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    this.windowDiv.left = parseInt(this.windowDiv.nativeElement.getBoundingClientRect().left, 10);
    this.windowDiv.top = parseInt(this.windowDiv.nativeElement.getBoundingClientRect().top, 10);
    this.mouseWindowLeft = mouseX - this.windowDiv.left;
    this.mouseWindowTop = mouseY - this.windowDiv.top;
    this.bringForward();
  }

  dragbarRelease(event) {
    this.dragbarSelected = false;
  }

  dragbarMove(event) {
    if (this.dragbarSelected === true) {
      const offsetTop = this.globals.toolbarHeight;
      let offsetLeft = 0;
      if (this.globals.drawerOpen) {
        offsetLeft = this.globals.sidebarWidth;
      }
      this.havenWindow.position.left = Math.max(0 + offsetLeft, event.clientX - this.mouseWindowLeft);
      this.havenWindow.position.top = Math.max(offsetTop, event.clientY - this.mouseWindowTop);
      this.windowDiv.nativeElement.style.left = (this.havenWindow.position.left - offsetLeft) + 'px';
      this.windowDiv.nativeElement.style.top = (this.havenWindow.position.top - offsetTop) + 'px';
      window.getSelection().removeAllRanges();
    }
  }

  resizeClick(event) {
    this.resizeSelected = true;
    this.resizeStartWidth = this.havenWindow.size.width;
    this.resizeStartHeight = this.havenWindow.size.height;
    this.resizeStartLeft = event.clientX;
    this.resizeStartTop = event.clientY;
    this.bringForward();
  }

  resizeRelease(event) {
    this.resizeSelected = false;
  }

  resizeMove(event) {
    if (this.resizeSelected === true) {
      this.havenWindow.size.width = this.resizeStartWidth + (event.clientX - this.resizeStartLeft);
      this.havenWindow.size.height = this.resizeStartHeight + (event.clientY - this.resizeStartTop);
      this.windowDiv.nativeElement.style.width = this.havenWindow.size.width + 'px';
      this.windowDiv.nativeElement.style.height = this.havenWindow.size.height + 'px';
      window.getSelection().removeAllRanges();
      // this.appRef.resize();
    }
  }

  bringForward() {
    this.havenWindowService.bringWindowForward(this.havenWindow.id);
  }

  drawerToggle() {
    this.drawerOpen = !this.drawerOpen;
  }

}
