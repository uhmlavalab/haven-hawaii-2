import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenMaterialModule } from '../../haven-material/haven-material.module';

import { HavenSidebarChartsComponent } from './component/haven-sidebar-charts.component';

@NgModule({
  imports: [
    CommonModule,
    HavenMaterialModule
  ],
  declarations: [
    HavenSidebarChartsComponent,
  ],
  exports: [
    HavenSidebarChartsComponent,
  ]
})
export class HavenSidebarChartsModule { }
