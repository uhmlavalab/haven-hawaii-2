import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HavenSharedModule } from '@app/haven-shared';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

// Apps
import { HavenAppsFactoryComponent } from './haven-apps/factory/haven-apps-factory.component';
import { HavenAppsHostDirective } from './haven-apps/shared/haven-apps-host.directive';
import { HavenLeafletComponent } from './haven-apps/leaflet/component/haven-leaflet.component';
import { HavenChartComponent } from './haven-apps/plotly/haven-chart.component';

// Windows
import { HavenWindowComponent } from './haven-window/component/haven-window.component';
import { HavenWindowFactoryComponent } from './haven-window/factory/haven-window-factory.component';
import { HavenWindowBringforwardDirective } from './haven-window/directives/haven-window-bringforward.directive';
import { HavenWindowDragDirective } from './haven-window/directives/haven-window-drag.directive';
import { HavenWindowHostDirective } from './haven-window/directives/haven-window-host.directive';
import { HavenWindowMaximizeDirective } from './haven-window/directives/haven-window-maximize.directive';
import { HavenWindowResizeDirective } from './haven-window/directives/haven-window-resize.directive';


@NgModule({
  imports: [
    CommonModule,
    HavenSharedModule,
    LeafletModule
  ],
  declarations: [
    // Apps
    HavenAppsFactoryComponent,
    HavenLeafletComponent,
    HavenChartComponent,
    HavenAppsHostDirective,

    // Window
    HavenWindowComponent,
    HavenWindowFactoryComponent,
    HavenWindowBringforwardDirective,
    HavenWindowDragDirective,
    HavenWindowHostDirective,
    HavenWindowMaximizeDirective,
    HavenWindowResizeDirective,


  ],
  exports: [
    // Apps
    HavenAppsFactoryComponent,
    HavenLeafletComponent,
    HavenChartComponent,

    // Window
    HavenWindowFactoryComponent,
    HavenWindowComponent
  ],
  entryComponents: [
    // Apps
    HavenLeafletComponent,
    HavenChartComponent,

    // Window
    HavenWindowComponent,

  ]
})
export class HavenFeaturesModule { }
