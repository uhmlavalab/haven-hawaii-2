import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
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
export class PlotlyScatterComponent implements HavenAppInterface, OnInit, OnDestroy {

  havenWindow: HavenWindow;
  havenApp: HavenApp;
  plotlyInfo: PlotlyAppInfo;

  @ViewChild('chart') chartDiv: ElementRef;
  loaded = false;
  data: any;
  maxY: number;
  minY: number;
  numberOfData: number;
  selectedDataSlice: number;
  paused = false;
  intervalPlayer: any;
  title: string;

  constructor(private firestoreQueryService: PlotlyFirestoreQueryService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.plotlyInfo = this.havenApp.appInfo;
    this.firestoreQueryService.getData(this.plotlyInfo).then((data) => {
      this.data = data;
      this.plotlyInfo.valueName = this.plotlyInfo.valueName.charAt(0).toUpperCase() + this.plotlyInfo.valueName.slice(1);
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
      this.selectedDataSlice = 0;
      this.plotData();
    });
  }

  plotData(event?: any) {
    if (event) {
      this.selectedDataSlice = event.value;
    }
    const layout = {
      height: this.chartDiv.nativeElement.getBoundingClientRect().height,
      width: this.chartDiv.nativeElement.getBoundingClientRect().width,
      margin: {
        t: 35,
        l: 55,
        r: 20,
        b: 50,
      },
      font: {
        family: 'Roboto, sans-serif',
      },
      xaxis: {
        title: 'Time',
        showgrid: false,
        zeroline: false
      },
      yaxis: {
        title: this.plotlyInfo.valueName,
        range: [this.minY, this.maxY],
        showline: false
      },
      title: this.toShortDate(this.data[this.selectedDataSlice]['name']),
      hovermode: 'closest',
    };
    Plotly.newPlot(this.chartDiv.nativeElement, this.data[this.selectedDataSlice]['traces'], layout);
  }

  toShortDate(inputDate: string): string {
    const date = new Date(inputDate);
    return `${date.getMonth() + 1} / ${date.getDate()} / ${date.getFullYear()}`;
  }

  playPause() {
    this.paused = !this.paused;
    if (this.paused) {
      this.intervalPlayer = setInterval(() => {
        this.playThroughData();
      }, 250);
    } else {
      clearInterval(this.intervalPlayer);
    }
  }

  playThroughData() {
    this.selectedDataSlice++;
    if (this.selectedDataSlice > this.numberOfData) { this.selectedDataSlice = 0; }
    this.plotData();
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

  ngOnDestroy() {
    clearInterval(this.intervalPlayer);
  }

}
