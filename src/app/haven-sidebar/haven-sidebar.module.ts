import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenMaterialModule } from '../haven-modules/haven-material.module';

import { HavenSidebarAccountComponent } from './components/haven-sidebar-account/haven-sidebar-account.component';
import { HavenSidebarChartsComponent } from './components/haven-sidebar-charts/haven-sidebar-charts.component';
import { HavenSidebarMapsComponent } from './components/haven-sidebar-maps/haven-sidebar-maps.component';

import { HavenLayerFileDropDirective } from './directives/haven-sidebar-charts/haven-layer-filedrop';
import { HavenLayerUploadService } from './services/haven-sidebar-charts/haven-layer-upload.service';

@NgModule({
  imports: [
    CommonModule,
    HavenMaterialModule,
  ],
  declarations: [
    HavenSidebarAccountComponent,
    HavenSidebarChartsComponent,
    HavenSidebarMapsComponent,
    HavenLayerFileDropDirective,
  ],
  exports: [
    HavenSidebarAccountComponent,
    HavenSidebarChartsComponent,
    HavenSidebarMapsComponent,
  ],
  providers: [
    HavenLayerUploadService,
  ]
})
export class HavenSidebarModule { }
