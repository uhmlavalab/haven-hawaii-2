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
  data: any;
  maxY: number;
  minY: number;
  numberOfData: number;

  constructor(private firestoreQueryService: PlotlyFirestoreQueryService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.plotlyInfo = this.havenApp.appInfo;
    this.firestoreQueryService.getData(this.plotlyInfo).then((data) => {
      this.data = data;
      let yValues = [];
      this.data.forEach(element => {
        element['traces'].forEach(trace => {
          yValues.push(trace['y']);
        });
      });
      yValues = yValues.reduce((a, b) => a.concat(b), []);
      this.maxY = Math.max(...yValues);
      this.minY = Math.min(...yValues);
      const pad = (this.maxY - this.minY) * 0.05;
      this.maxY += pad;
      this.minY -= pad;
      this.numberOfData = data.length - 1;
      this.loaded = true;
      this.changeDetector.detectChanges();
      this.plotData(0);
    });
  }

  plotData(index: any) {
    let idx = index;
    if (isNaN(index)) {
      idx = index.value;
    }
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
      title: this.data[idx]['name'],
      yaxis: {range: [this.minY, this.maxY]}
    };
    Plotly.newPlot(this.chartDiv.nativeElement, this.data[idx]['traces'], layout);
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
