import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenMaterialModule } from '../haven-material/haven-material.module';

import { HavenSidebarAccountModule } from './haven-sidebar-account/haven-sidebar-account.module';
import { HavenSidebarChartsModule } from './haven-sidebar-charts/haven-sidebar-charts.module';
import { HavenSidebarMapsModule } from './haven-sidebar-maps/haven-sidebar-maps.module';

@NgModule({
  imports: [
    CommonModule,
    HavenMaterialModule,
    HavenSidebarAccountModule,
    HavenSidebarChartsModule,
    HavenSidebarMapsModule
  ],
  declarations: [
  ],
  exports: [
    HavenSidebarAccountModule,
    HavenSidebarChartsModule,
    HavenSidebarMapsModule
  ],
  providers: [
  ]
})
export class HavenSidebarModule { }
