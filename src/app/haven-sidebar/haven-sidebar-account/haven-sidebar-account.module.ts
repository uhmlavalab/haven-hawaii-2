import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenMaterialModule } from '../../haven-material/haven-material.module';

import { HavenSidebarAccountComponent } from './component/haven-sidebar-account.component';

@NgModule({
  imports: [
    CommonModule,
    HavenMaterialModule
  ],
  declarations: [
    HavenSidebarAccountComponent,
  ],
  exports: [
    HavenSidebarAccountComponent,
  ]
})
export class HavenSidebarAccountModule { }
