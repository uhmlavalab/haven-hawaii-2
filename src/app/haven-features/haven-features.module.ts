import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HavenSharedModule } from '@app/haven-shared';

// Apps
import { HavenAppsFactoryComponent } from './haven-apps/factory/haven-apps-factory.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HavenLeafletComponent } from './haven-apps/leaflet/component/haven-leaflet.component';
import { PlotlyScatterComponent } from './haven-apps/plotly/components/plotly-scatter/plotly-scatter.component';
import { PlotlyBarComponent } from './haven-apps/plotly/components/plotly-bar/plotly-bar.component';
import { PlotlyHeatmapComponent } from './haven-apps/plotly/components/plotly-heatmap/plotly-heatmap.component';
import { PlotlySurfaceComponent } from './haven-apps/plotly/components/plotly-surface/plotly-surface.component';
import { HavenAppsHostDirective } from './haven-apps/shared/haven-apps-host.directive';

// Sidebar
import { HavenSidebarAccountComponent } from './haven-sidebar/haven-sidebar-account/haven-sidebar-account.component';
import { HavenSidebarChartsComponent } from './haven-sidebar/haven-sidebar-charts/haven-sidebar-charts.component';
import { HavenSidebarMapsComponent } from './haven-sidebar/haven-sidebar-maps/haven-sidebar-maps.component';

// Windows
import { HavenWindowComponent } from './haven-window/component/haven-window.component';
import { HavenWindowFactoryComponent } from './haven-window/factory/haven-window-factory.component';
import { HavenWindowBringforwardDirective } from './haven-window/directives/haven-window-bringforward.directive';
import { HavenWindowDragDirective } from './haven-window/directives/haven-window-drag.directive';
import { HavenWindowHostDirective } from './haven-window/directives/haven-window-host.directive';
import { HavenWindowMaximizeDirective } from './haven-window/directives/haven-window-maximize.directive';
import { HavenWindowResizeDirective } from './haven-window/directives/haven-window-resize.directive';

// MISC
import { NewPortfolioComponent } from './haven-new-portfolio/new-portfolio.component';
import { HavenNewLayerComponent } from './haven-new-layer/haven-new-layer.component';

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
    PlotlyScatterComponent,
    PlotlyBarComponent,
    PlotlyHeatmapComponent,
    HavenAppsHostDirective,

    // Sidebar
    HavenSidebarAccountComponent,
    HavenSidebarChartsComponent,
    HavenSidebarMapsComponent,

    // Window
    HavenWindowComponent,
    HavenWindowFactoryComponent,
    HavenWindowBringforwardDirective,
    HavenWindowDragDirective,
    HavenWindowHostDirective,
    HavenWindowMaximizeDirective,
    HavenWindowResizeDirective,

    // Misc
    NewPortfolioComponent,
    HavenNewLayerComponent,
    PlotlyBarComponent,
    PlotlySurfaceComponent,

  ],
  exports: [
    // Apps
    HavenAppsFactoryComponent,
    HavenLeafletComponent,
    PlotlyScatterComponent,
    PlotlyBarComponent,
    PlotlyHeatmapComponent,
    PlotlySurfaceComponent,

    // Sidebar
    HavenSidebarAccountComponent,
    HavenSidebarChartsComponent,
    HavenSidebarMapsComponent,

    // Window
    HavenWindowFactoryComponent,
    HavenWindowComponent
  ],
  entryComponents: [
    // Apps
    HavenLeafletComponent,
    PlotlyScatterComponent,
    PlotlyBarComponent,
    PlotlyHeatmapComponent,
    PlotlySurfaceComponent,

    // Window
    HavenWindowComponent,

    // MISC
    NewPortfolioComponent,
    HavenNewLayerComponent,
  ]
})
export class HavenFeaturesModule { }
