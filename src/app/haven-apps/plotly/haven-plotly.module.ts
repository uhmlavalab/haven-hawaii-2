import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlotlyScatterComponent } from './components/plotly-scatter/plotly-scatter.component';

import { PlotlyFirestoreQueryService } from './services/plotly-firestore-query.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PlotlyScatterComponent
  ],
  entryComponents: [
    PlotlyScatterComponent
  ],
  providers: [
    PlotlyFirestoreQueryService
  ]
})
export class HavenPlotlyModule { }
