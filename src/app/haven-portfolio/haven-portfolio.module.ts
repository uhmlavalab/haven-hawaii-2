import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HavenMaterialModule } from '../haven-material/haven-material.module';

import { NewPortfolioComponent } from './components/new-portfolio/new-portfolio.component';
import { LoadedPortfolioService } from './services/loaded-portfolio.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HavenMaterialModule,
  ],
  declarations: [
    NewPortfolioComponent
  ],
  exports: [
    NewPortfolioComponent
  ],
  entryComponents: [
    NewPortfolioComponent,
  ],
  providers: [
    LoadedPortfolioService
  ]
})
export class HavenPortfolioModule { }
