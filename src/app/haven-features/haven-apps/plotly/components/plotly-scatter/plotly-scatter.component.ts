import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HavenAppInterface } from '../../../shared/haven-app-interface';
import { HavenWindow } from '../../../../haven-window/shared/haven-window';
import { HavenApp } from '../../../shared/haven-app';

import { PlotlyFirestoreQueryService } from '@app/haven-core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-plotly-scatter',
  templateUrl: './plotly-scatter.component.html',
  styleUrls: ['./plotly-scatter.component.css']
})
export class PlotlyScatterComponent implements HavenAppInterface, OnInit {

  havenWindow: HavenWindow;
  havenApp: HavenApp;
  loadSub: Subscription;

  @ViewChild('chart') chartDiv: ElementRef;
  loaded = false;

  constructor(private firestoreQueryService: PlotlyFirestoreQueryService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.firestoreQueryService.getData(
        this.havenApp.appInfo.startDate,
        this.havenApp.appInfo.endDate,
        this.havenApp.appInfo.value).then((data) => {
          this.loaded = true;
          this.changeDetector.detectChanges();
          const layout = {
            height: this.chartDiv.nativeElement.getBoundingClientRect().height,
            width: this.chartDiv.nativeElement.getBoundingClientRect().width,
            margin: {
              t: 50,
              l: 55,
              r: 20,
              b: 50,
            },
            font: {
              family: 'Roboto, sans-serif',
            },
            hovermode: 'closest',
          };
          Plotly.newPlot(this.chartDiv.nativeElement, data, layout);
        });
  }

  resize() {
    if (this.loaded) {
      const update = {
        height: this.chartDiv.nativeElement.getBoundingClientRect().height,
        width: this.chartDiv.nativeElement.getBoundingClientRect().width
      };
      Plotly.relayout(this.chartDiv.nativeElement, update);
    }
  }

}
