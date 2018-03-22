import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenMaterialModule } from '../../haven-material/haven-material.module';

import { HavenSidebarMapsComponent } from './component/haven-sidebar-maps.component';
import { HavenLayerFileDropDirective } from './directives/haven-layer-filedrop';

@NgModule({
  imports: [
    CommonModule,
    HavenMaterialModule
  ],
  declarations: [
    HavenSidebarMapsComponent,
    HavenLayerFileDropDirective,
  ],
  exports: [
    HavenSidebarMapsComponent,
  ],
  providers: [
  ]
})
export class HavenSidebarMapsModule { }
