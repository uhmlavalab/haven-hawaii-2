import { HavenLeafletComponent } from '../leaflet/component/haven-leaflet.component';
import { PlotlyScatterComponent } from '../plotly/components/plotly-scatter/plotly-scatter.component';

export class HavenAppList {

  public static apps = {
    'leaflet': HavenLeafletComponent,
    'plotly-scatter': PlotlyScatterComponent
  };
}
