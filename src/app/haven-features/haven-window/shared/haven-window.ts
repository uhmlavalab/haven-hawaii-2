import { HavenApp } from '../../haven-apps/shared/haven-app';

export class HavenWindow {

  id: number;
  header: string;
  footer: string;

  position: Position;
  size: Size;
  savePosition: Position;
  saveSize: Size;
  maximized: boolean;
  sidebar: boolean;

  app: HavenApp;

  constructor(header: string, footer: string, left: number, top: number, width: number, height: number, sidebar: boolean) {
    this.header = header;
    this.footer = footer;
    this.position = new Position(left, top);
    this.size = new Size(width, height);
    this.savePosition = new Position(left, top);
    this.saveSize = new Size(width, height);
    this.sidebar = sidebar;
    this.maximized = false;
  }

  getObject() {
    return {
      'id': this.id,
      'header': this.header,
      'footer': this.footer,
      'position': { 'left': this.position.left, 'top': this.position.top },
      'size': { 'width': this.size.width, 'height': this.size.height },
      'maximized': false,
      'sidebar': this.sidebar,
      'app': this.app.getObject()
    };
  }

}

class Position {
  left: number;
  top: number;
  constructor(left: number, top: number) {
    this.left = left;
    this.top = top;
  }
}

class Size {
  width: number;
  height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
