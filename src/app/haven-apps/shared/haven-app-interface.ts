import { HavenWindow } from '../../haven-window/shared/haven-window';
import { HavenApp } from './haven-app';

export interface HavenAppInterface {
  havenWindow: HavenWindow;
  havenApp: HavenApp;
  resize();
}
