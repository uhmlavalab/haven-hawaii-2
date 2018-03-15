import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenLeafletModule } from './leaflet/haven-leaflet.module';
import { HavenPlotlyModule } from './plotly/haven-plotly.module';

import { HavenAppsHostDirective } from './shared/haven-apps-host.directive';
import { HavenAppsFactoryComponent } from './factory/haven-apps-factory.component';

@NgModule({
  imports: [
    CommonModule,
    HavenLeafletModule,
    HavenPlotlyModule,
  ],
  declarations: [
    HavenAppsFactoryComponent,
    HavenAppsHostDirective,
  ],
  exports: [
    HavenLeafletModule,
    HavenPlotlyModule,
    HavenAppsHostDirective,
    HavenAppsFactoryComponent,
  ],
  providers: [],
})
export class HavenAppsModule { }
