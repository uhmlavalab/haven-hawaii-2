import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenMaterialModule } from './haven-material.module';

import { HavenSidebarAccountComponent } from '../haven-sidebar/components/haven-sidebar-account/haven-sidebar-account.component';
import { HavenSidebarChartsComponent } from '../haven-sidebar/components/haven-sidebar-charts/haven-sidebar-charts.component';
import { HavenSidebarMapsComponent } from '../haven-sidebar/components/haven-sidebar-maps/haven-sidebar-maps.component';

import { HavenLayerFileDropDirective } from '../haven-sidebar/directives/haven-sidebar-charts/haven-layer-filedrop';
import { HavenLayerUploadService } from '../haven-sidebar/services/haven-sidebar-charts/haven-layer-upload.service';

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
