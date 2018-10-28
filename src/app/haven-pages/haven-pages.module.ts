import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HavenSharedModule } from '@app/haven-shared';
import { HavenFeaturesModule } from '@app/haven-features';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { HavenLoginComponent } from './haven-login/haven-login.component';
import { HavenHomeComponent } from './haven-home/haven-home.component';

// Sidebar
import { HavenSidebarScenariosComponent } from './haven-sidebar/haven-sidebar-scenarios/haven-sidebar-scenarios.component';
import { HavenSidebarChartsComponent } from './haven-sidebar/haven-sidebar-charts/haven-sidebar-charts.component';
import { HavenSidebarMapsComponent } from './haven-sidebar/haven-sidebar-maps/haven-sidebar-maps.component';

@NgModule({
  imports: [
    CommonModule,
    HavenSharedModule,
    HavenFeaturesModule,
    LeafletModule,
  ],
  declarations: [
    // Pages
    HavenLoginComponent,
    HavenHomeComponent,

    // Sidebar
    HavenSidebarScenariosComponent,
    HavenSidebarChartsComponent,
    HavenSidebarMapsComponent,
  ],
  exports: [
    HavenLoginComponent,
    HavenHomeComponent,
  ],
})
export class HavenPagesModule { }
