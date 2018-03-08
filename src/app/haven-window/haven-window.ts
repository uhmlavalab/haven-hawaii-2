export class HavenWindow {

  id: number;
  header: string;
  footer: string;
  maximized: boolean;

  position = new Position();
  size = new Size();
  savePosition = new Position();
  saveSize = new Size();

}

class Position {
  left: number;
  top: number;
}

class Size {
  width: number;
  height: number;
}
