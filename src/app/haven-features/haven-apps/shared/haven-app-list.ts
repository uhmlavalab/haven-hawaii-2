import { HavenLeafletComponent } from '../leaflet/component/haven-leaflet.component';
import { HavenChartComponent } from '../plotly/haven-chart.component';

export class HavenAppList {

  public static apps = {
    'leaflet': HavenLeafletComponent,
    'plotly-chart': HavenChartComponent
  };
}
