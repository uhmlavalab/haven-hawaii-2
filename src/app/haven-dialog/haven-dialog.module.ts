import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenMaterialModule } from '../haven-material/haven-material.module';
import { HavenDialogComponent } from './component/haven-dialog.component';
import { HavenDialogService } from './service/haven-dialog.service';

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
