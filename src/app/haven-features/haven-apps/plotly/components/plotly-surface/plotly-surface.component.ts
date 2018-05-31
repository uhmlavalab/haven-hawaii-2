import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HavenAppInterface } from '../../../shared/haven-app-interface';
import { HavenWindow } from '../../../../haven-window/shared/haven-window';
import { HavenApp } from '../../../shared/haven-app';

import { PlotlyFirestoreQueryService } from '@app/haven-core';

import { PlotlyAppInfo } from '../../shared/plotly-app-info';
@Component({
  selector: 'app-plotly-surface',
  templateUrl: './plotly-surface.component.html',
  styleUrls: ['./plotly-surface.component.css']
})
export class PlotlySurfaceComponent implements HavenAppInterface, OnInit, OnDestroy {

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
      this.plotlyInfo.valueName = this.plotlyInfo.valueName.charAt(0).toUpperCase() + this.plotlyInfo.valueName.slice(1);
      this.data = data;
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
      scene: {
        xaxis: {
          title: this.data['xTitle'],
        },
        yaxis: {
          title: this.data['yTitle'],
          // tickvals: this.yTickValues,
          // ticktext: this.yticktext,
        },
        zaxis: {
          title: this.plotlyInfo.valueName
        },
      },
      margin: {
        l: 20,
        r: 30,
        b: 10,
        t: 20,
        pad: 0
      },
      font: {
        family: 'Roboto, sans-serif',
      },
      title: false,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    };
    Plotly.newPlot(this.chartDiv.nativeElement, [this.data['surfaceData']], layout);
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
