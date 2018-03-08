import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenMaterialModule } from '../haven-modules/haven-material.module';
import { HavenDialogComponent } from '../haven-dialog/component/haven-dialog.component';
import { HavenDialogService } from '../haven-dialog/service/haven-dialog.service';

@NgModule({
  imports: [
    CommonModule,
    HavenMaterialModule
  ],
  declarations: [
    HavenDialogComponent
  ],
  exports: [
    HavenDialogComponent
  ],
  entryComponents: [
    HavenDialogComponent
  ],
  providers: [
    HavenDialogService
  ]
})
export class HavenDialogModule { }
