import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenMaterialModule } from '../haven-modules/haven-material.module';

import { HavenWindowComponent } from '../haven-window/haven-window-component/haven-window.component';
import { HavenWindowFactoryComponent } from '../haven-window/haven-window-factory/haven-window-factory.component';

import { HavenWindowHostDirective } from '../haven-window/haven-window-host.directive';
import { HavenWindowDragDirective } from '../haven-window/haven-window-directives/haven-window-drag.directive';
import { HavenWindowResizeDirective } from '../haven-window/haven-window-directives/haven-window-resize.directive';

import { HavenWindowService } from '../haven-window/haven-window-service/haven-window.service';

@NgModule({
  imports: [
    CommonModule,
    HavenMaterialModule,
  ],
  declarations: [
    HavenWindowComponent,
    HavenWindowFactoryComponent,
    HavenWindowHostDirective,
    HavenWindowDragDirective,
    HavenWindowResizeDirective,
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
