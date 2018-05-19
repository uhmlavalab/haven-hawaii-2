import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { HavenWindow } from '../shared/haven-window';

@Directive({
  selector: '[appHavenWindowDrag]'
})
export class HavenWindowDragDirective {

  @Input() windowDiv: any;
  @Input() havenWindow: HavenWindow;

  private dragbarSelected: boolean;

  private dragStartLeft: number;
  private dragStartTop: number;

  private startWindowLeft: number;
  private startWindowTop: number;

  constructor(private el: ElementRef) { }

  @HostListener('mousedown', ['$event']) onMouseDown(event) {
    this.dragStartLeft = event.clientX;
    this.dragStartTop =  event.clientY;
    this.startWindowLeft = this.havenWindow.position.left;
    this.startWindowTop = this.havenWindow.position.top;
    this.dragbarSelected = true;
  }

  @HostListener('document:mouseup', ['$event']) onMouseUp() {
    this.dragbarSelected = false;
  }

  @HostListener('document:mousemove', ['$event']) onMouseMove(event) {
    if (this.dragbarSelected === true) {
      this.havenWindow.position.left = Math.max(0, this.startWindowLeft + (event.clientX - this.dragStartLeft));
      this.havenWindow.position.top = Math.max(0, this.startWindowTop + (event.clientY - this.dragStartTop));
      this.windowDiv.style.left = this.havenWindow.position.left + 'px';
      this.windowDiv.style.top = this.havenWindow.position.top + 'px';
    }
  }

}
