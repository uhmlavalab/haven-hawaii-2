import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HavenAppInterface } from '../../../shared/haven-app-interface';
import { HavenWindow } from '../../../../haven-window/shared/haven-window';
import { HavenApp } from '../../../shared/haven-app';

import { PlotlyFirestoreQueryService } from '@app/haven-core';

import { PlotlyAppInfo } from '../../shared/plotly-app-info';

@Component({
  selector: 'app-plotly-scatter',
  templateUrl: './plotly-scatter.component.html',
  styleUrls: ['./plotly-scatter.component.css']
})
export class PlotlyScatterComponent implements HavenAppInterface, OnInit {

  havenWindow: HavenWindow;
  havenApp: HavenApp;
  plotlyInfo: PlotlyAppInfo;

  @ViewChild('chart') chartDiv: ElementRef;
  loaded = false;

  constructor(private firestoreQueryService: PlotlyFirestoreQueryService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.plotlyInfo = this.havenApp.appInfo;
    this.firestoreQueryService.getData(this.plotlyInfo).then((data) => {
      console.log(data);
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
        title: data[0]['name']
      };
      Plotly.newPlot(this.chartDiv.nativeElement, data[0]['traces'], layout);
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
