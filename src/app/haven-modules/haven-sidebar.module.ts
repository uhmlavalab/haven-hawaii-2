import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenMaterialModule } from './haven-material.module';

import { HavenSidebarAccountComponent } from '../haven-sidebar/components/haven-sidebar-account/haven-sidebar-account.component';
import { HavenSidebarChartsComponent } from '../haven-sidebar/components/haven-sidebar-charts/haven-sidebar-charts.component';
import { HavenSidebarMapsComponent } from '../haven-sidebar/components/haven-sidebar-maps/haven-sidebar-maps.component';

@NgModule({
  imports: [
    CommonModule,
    HavenMaterialModule,
  ],
  declarations: [
    HavenSidebarAccountComponent,
    HavenSidebarChartsComponent,
    HavenSidebarMapsComponent,
  ],
  exports: [
    HavenSidebarAccountComponent,
    HavenSidebarChartsComponent,
    HavenSidebarMapsComponent,
  ]
})
export class HavenSidebarModule { }
