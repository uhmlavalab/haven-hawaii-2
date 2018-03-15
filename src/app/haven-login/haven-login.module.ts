import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HavenLoginComponent } from './component/haven-login.component';

import { HavenMaterialModule } from '../haven-modules/haven-material.module';

@NgModule({
  imports: [
    CommonModule,
    HavenMaterialModule,
    FormsModule,
  ],
  declarations: [
    HavenLoginComponent,
  ],
  exports: [
    HavenLoginComponent,
  ]
})
export class HavenLoginModule { }
