import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HavenAppInterface } from '../../../shared/haven-app-interface';
import { HavenWindow } from '../../../../haven-window/shared/haven-window';
import { HavenApp } from '../../../shared/haven-app';

import { PlotlyFirestoreQueryService } from '@app/haven-core';

import { PlotlyAppInfo } from '../../shared/plotly-app-info';

@Component({
  selector: 'app-plotly-heatmap',
  templateUrl: './plotly-heatmap.component.html',
  styleUrls: ['./plotly-heatmap.component.css']
})
export class PlotlyHeatmapComponent implements HavenAppInterface, OnInit, OnDestroy {

  havenWindow: HavenWindow;
  havenApp: HavenApp;
  plotlyInfo: PlotlyAppInfo;

  @ViewChild('chart') chartDiv: ElementRef;
  loaded = false;
  data: any;
  maxZ: number;
  minZ: number;
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
      let yValues = [];
      this.data.forEach(element => {
        element['z'].forEach(trace => {
          yValues.push(trace);
        });
      });
      yValues = yValues.reduce((a, b) => a.concat(b), []);
      this.maxZ = Math.max(...yValues);
      this.minZ = Math.min(...yValues);
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
        l: 70,
        r: 30,
        b: 20,
        t: 30,
        pad: 0
      },
      font: {
        family: 'Roboto, sans-serif',
      },
      yaxis: {
        tickangle: -45,
      },
      showlegend: true,
      title: this.toShortDate(this.data[this.selectedDataSlice]['name']),
      hovermode: 'closest',
    };
    const data = this.data[this.selectedDataSlice];
    data.zmax = this.maxZ;
    data.zmin = this.minZ;
    Plotly.newPlot(this.chartDiv.nativeElement, [data], layout);
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
