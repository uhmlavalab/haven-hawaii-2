import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenMaterialModule } from '../haven-material/haven-material.module';
import { HavenAppsModule } from '../haven-apps/haven-apps.module';

import { HavenWindowComponent } from './component/haven-window.component';

import { HavenWindowFactoryComponent } from './factory/haven-window-factory.component';
import { HavenWindowHostDirective } from './directives/haven-window-host.directive';

import { HavenWindowDragDirective } from './directives/haven-window-drag.directive';
import { HavenWindowResizeDirective } from './directives/haven-window-resize.directive';
import { HavenWindowMaximizeDirective } from './directives/haven-window-maximize.directive';
import { HavenWindowBringforwardDirective } from './directives/haven-window-bringforward.directive';

import { HavenWindowService } from './services/haven-window.service';

@NgModule({
  imports: [
    CommonModule,
    HavenMaterialModule,
    HavenAppsModule
  ],
  declarations: [
    HavenWindowComponent,
    HavenWindowFactoryComponent,
    HavenWindowHostDirective,
    HavenWindowDragDirective,
    HavenWindowResizeDirective,
    HavenWindowMaximizeDirective,
    HavenWindowBringforwardDirective
  ],
  exports: [
    HavenWindowFactoryComponent,
    HavenWindowComponent,
  ],
  providers: [
    HavenWindowService,
  ],
  entryComponents: [
    HavenWindowComponent
  ]
})
export class HavenWindowModule { }
