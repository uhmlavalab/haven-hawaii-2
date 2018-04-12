import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenMaterialModule } from '../../haven-material/haven-material.module';

import { HavenSidebarAccountComponent } from './component/haven-sidebar-account.component';
import { NewPortfolioComponent } from './new-portfolio/new-portfolio.component';

@NgModule({
  imports: [
    CommonModule,
    HavenMaterialModule
  ],
  declarations: [
    HavenSidebarAccountComponent,
    NewPortfolioComponent,
  ],
  exports: [
    HavenSidebarAccountComponent,
  ],
  entryComponents: [
    NewPortfolioComponent,
  ]
})
export class HavenSidebarAccountModule { }
