import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HavenWindow } from '../../haven-window/shared/haven-window';
import { HavenApp } from '../shared/haven-app';

import { HavenChartAppInfo } from './shared/haven-chart-app-info';

@Component({
  selector: 'app-haven-chart',
  templateUrl: './haven-chart.component.html',
  styleUrls: ['./haven-chart.component.css']
})
export class HavenChartComponent implements OnInit {

  havenWindow: HavenWindow;
  havenApp: HavenApp;
  plotlyInfo: HavenChartAppInfo;

  testData = {
    Wind: [[0, 1], [1, 3], [2, 0], [3, 3]],
    Solar: [[0, 0], [1, 5], [2, 4], [3, 0]],
    Fossil: [[0, 4], [1, 3], [2, 4], [3, 3]],
  };

  typeOfCharts = [
    {
      toolTip: 'Line Chart',
      icon: 'show_chart',
      color: 'primary',
      disabled: false
    },
    {
      toolTip: 'Bar Chart',
      icon: 'insert_chart',
      color: 'warn',
      disabled: false
    },
    {
      toolTip: '3D Chart',
      icon: 'layers',
      color: 'accent',
      disabled: true
    },
    {
      toolTip: 'Heatmap Chart',
      icon: 'grid_on',
      color: 'warn',
      disabled: false
    },
  ];

  scopes = [
    {
      text: 'Monthly',
      color: 'primary'
    },
    {
      text: 'Weekly',
      color: 'warn'
    },
    {
      text: 'Daily',
      color: 'warn'
    }
  ];

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

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.createLineChart();
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

  changeScope(selectedScope: any) {
    this.scopes.forEach(el => {
      if (selectedScope.text === el.text) {
        el.color = 'primary';
      } else {
        el.color = 'warn';
      }
    });
  }

  changeChart(selectedChart: any) {
    this.typeOfCharts.forEach(el => {
      if (selectedChart.icon === el.icon) {
        el.color = 'primary';
      } else {
        el.color = 'warn';
      }
    });
    switch (selectedChart.icon) {
      case 'show_chart':
        this.createLineChart();
        break;
      case 'insert_chart':
        this.createBarChart();
        break;
      case 'grid_on':
        this.createHeatMap();
        break;
    }
  }

  createLineChart() {
    this.loaded = false;
    const traces = [];
    Object.keys(this.testData).forEach(el => {
      const trace = {
        name: el,
        mode: 'lines',
        type: 'scatter',
        x: [],
        y: []
      };
      this.testData[el].forEach(dataPoint => {
        trace.x.push(dataPoint[0]);
        trace.y.push(dataPoint[1]);
      });
      traces.push(trace);
    });
    this.loaded = true;
    this.changeDetector.detectChanges();
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
      hovermode: 'closest',
    };
    Plotly.newPlot(this.chartDiv.nativeElement, traces, layout);
  }

  createBarChart() {
    this.loaded = false;
    const traces = [];
    Object.keys(this.testData).forEach(el => {
      const trace = {
        name: el,
        type: 'bar',
        x: [],
        y: []
      };
      this.testData[el].forEach(dataPoint => {
        trace.x.push(dataPoint[0]);
        trace.y.push(dataPoint[1]);
      });
      traces.push(trace);
    });
    this.loaded = true;
    this.changeDetector.detectChanges();
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
      barmode: 'stack',
    };
    Plotly.newPlot(this.chartDiv.nativeElement, traces, layout);
  }

  createHeatMap() {
    this.loaded = false;
    const trace = [
      {
        z: [],
        x: null,
        y: [],
        type: 'heatmap'
      }
    ];
    Object.keys(this.testData).forEach(el => {
      const zVals = [];
      const xVals = [];
      this.testData[el].forEach(dataPoint => {
        xVals.push(dataPoint[0]);
        zVals.push(dataPoint[1]);
      });
      trace[0].y.push(el);
      trace[0].z.push(zVals);
      if (!trace[0].x) {
        trace[0].x = xVals;
      }
    });
    this.loaded = true;
    this.changeDetector.detectChanges();
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
      hovermode: 'closest',
    };
    Plotly.newPlot(this.chartDiv.nativeElement, trace, layout);
  }
}
