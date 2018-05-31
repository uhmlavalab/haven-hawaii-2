import { HavenLeafletComponent } from '../leaflet/component/haven-leaflet.component';
import { PlotlyScatterComponent } from '../plotly/components/plotly-scatter/plotly-scatter.component';
import { PlotlyBarComponent } from '@app/haven-features/haven-apps/plotly/components/plotly-bar/plotly-bar.component';
import { PlotlyHeatmapComponent } from '@app/haven-features/haven-apps/plotly/components/plotly-heatmap/plotly-heatmap.component';

export class HavenAppList {

  public static apps = {
    'leaflet': HavenLeafletComponent,
    'plotly-scatter': PlotlyScatterComponent,
    'plotly-bar': PlotlyBarComponent,
    'plotly-heatmap': PlotlyHeatmapComponent
  };
}
