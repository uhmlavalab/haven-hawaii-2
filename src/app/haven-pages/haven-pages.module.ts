import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenSharedModule } from '@app/haven-shared';
import { HavenFeaturesModule } from '@app/haven-features';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { HavenLoginComponent } from './haven-login/haven-login.component';
import { HavenHomeComponent } from './haven-home/haven-home.component';
import { HavenArComponent } from './haven-ar/haven-ar.component';

@NgModule({
  imports: [
    CommonModule,
    HavenSharedModule,
    HavenFeaturesModule,
    LeafletModule,
  ],
  declarations: [
    HavenLoginComponent,
    HavenHomeComponent,
    HavenArComponent,
  ],
  exports: [
    HavenLoginComponent,
    HavenHomeComponent,
  ],
})
export class HavenPagesModule { }
