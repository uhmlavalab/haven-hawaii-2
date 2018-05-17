import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HavenMaterialModule } from '../../haven-material/haven-material.module';

import { HavenSidebarAccountComponent } from './component/haven-sidebar-account.component';

import { NewPortfolioUploadService } from './services/new-portfolio-upload.service';

@NgModule({
  imports: [
    CommonModule,
    HavenMaterialModule,
    FormsModule,
  ],
  declarations: [
    HavenSidebarAccountComponent,
  ],
  exports: [
    HavenSidebarAccountComponent,
  ],
  providers: [
    NewPortfolioUploadService
  ]
})
export class HavenSidebarAccountModule { }
