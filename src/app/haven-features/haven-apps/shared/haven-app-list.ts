import { HavenLeafletComponent } from '../leaflet/component/haven-leaflet.component';
import { PlotlyScatterComponent } from '../plotly/components/plotly-scatter/plotly-scatter.component';
import { PlotlyBarComponent } from '../plotly/components/plotly-bar/plotly-bar.component';
import { PlotlyHeatmapComponent } from '../plotly/components/plotly-heatmap/plotly-heatmap.component';
import { PlotlySurfaceComponent } from '../plotly/components/plotly-surface/plotly-surface.component';

export class HavenAppList {

  public static apps = {
    'leaflet': HavenLeafletComponent,
    'plotly-scatter': PlotlyScatterComponent,
    'plotly-bar': PlotlyBarComponent,
    'plotly-heatmap': PlotlyHeatmapComponent,
    'plotly-surface': PlotlySurfaceComponent
  };
}
