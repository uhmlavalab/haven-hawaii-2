import { Directive, ElementRef, HostListener, Input } from '@angular/core';

import { HavenWindow } from '../shared/haven-window';

@Directive({
  selector: '[appHavenWindowResize]'
})
export class HavenWindowResizeDirective {

  @Input() windowDiv: any;
  @Input() havenWindow: HavenWindow;
  @Input() appRef: any;

  private resizeSelected: boolean;

  private resizeStartLeft: number;
  private resizeStartTop: number;

  private startWindowWidth: number;
  private startWindowHeight: number;

  constructor(private el: ElementRef) { }

  @HostListener('mousedown', ['$event']) onMouseDown(event) {
    this.resizeStartLeft = event.clientX;
    this.resizeStartTop =  event.clientY;
    this.startWindowWidth = this.havenWindow.size.width;
    this.startWindowHeight = this.havenWindow.size.height;
    this.resizeSelected = true;
  }

  @HostListener('document:mouseup', ['$event']) onMouseUp() {
    this.resizeSelected = false;
  }

  @HostListener('document:mousemove', ['$event']) onMouseMove(event) {
    if (this.resizeSelected === true) {
      this.havenWindow.size.width = Math.max(200, this.startWindowWidth + (event.clientX - this.resizeStartLeft));
      this.havenWindow.size.height = Math.max(200, this.startWindowHeight + (event.clientY - this.resizeStartTop));
      this.windowDiv.style.width = this.havenWindow.size.width + 'px';
      this.windowDiv.style.height = this.havenWindow.size.height + 'px';
      this.appRef.resize();
    }
  }

}
