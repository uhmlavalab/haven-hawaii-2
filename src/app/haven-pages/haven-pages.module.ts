import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenSharedModule } from '@app/haven-shared';
import { HavenFeaturesModule } from '@app/haven-features';

import { HavenLoginComponent } from './haven-login/haven-login.component';
import { HavenHomeComponent } from './haven-home/haven-home.component';

@NgModule({
  imports: [
    CommonModule,
    HavenSharedModule,
    HavenFeaturesModule,
  ],
  declarations: [
    HavenLoginComponent,
    HavenHomeComponent,
  ],
  exports: [
    HavenLoginComponent,
    HavenHomeComponent,
  ],
})
export class HavenPagesModule { }
