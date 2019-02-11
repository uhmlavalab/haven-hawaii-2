import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HavenWindow } from '../../haven-window/shared/haven-window';
import { HavenApp } from '../shared/haven-app';

import { HavenChartAppInfo } from './shared/haven-chart-app-info';

import { DatabaseSqlService } from '@app/haven-core';

@Component({
  selector: 'app-haven-chart',
  templateUrl: './haven-chart.component.html',
  styleUrls: ['./haven-chart.component.css']
})
export class HavenChartComponent implements OnInit {

  havenWindow: HavenWindow;
  havenApp: HavenApp;
  plotlyInfo: HavenChartAppInfo;

  rawData = {};
  formattedData = {};

  daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  typeOfCharts = [
    {
      toolTip: 'Line Chart',
      icon: 'show_chart',
      color: 'primary',
      value: 'line',
      disabled: false
    },
    {
      toolTip: 'Bar Chart',
      icon: 'insert_chart',
      color: 'warn',
      value: 'bar',
      disabled: false
    },
    {
      toolTip: 'Heatmap Chart',
      icon: 'grid_on',
      color: 'warn',
      value: 'heat',
      disabled: false
    },
    {
      toolTip: 'List',
      icon: 'format_list_numbered',
      color: 'accent',
      value: 'list',
      disabled: true
    },
  ];

  scales = [
    {
      text: 'Yearly Totals',
      value: 'years',
      color: 'primary',
      toolTip: '',
      disabled: false
    },
    {
      text: 'Monthly Totals',
      value: 'months',
      color: 'warn',
      toolTip: '',
      disabled: false
    },
    {
      text: 'Daily Averages',
      value: 'hours',
      color: 'warn',
      toolTip: '',
      disabled: false
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

  constructor(private changeDetector: ChangeDetectorRef, private dbSql: DatabaseSqlService) {

  }

  ngOnInit() {
    this.loaded = false;
    this.plotlyInfo = this.havenApp.appInfo;
    if (this.plotlyInfo.valueType == 'capacity') { this.scales[1].disabled = true; this.scales[2].disabled = true; }
    this.scales.forEach(el => { (el.value == this.plotlyInfo.scale) ? el.color = 'primary' : el.color = 'warn' })
    switch (this.plotlyInfo.valueType) {
      case 'capacity':
        this.dbSql.getCapactiyData(this.plotlyInfo.scenarioId).then((data) => {
          this.rawData = data;
          this.formattedData = data;
          this.loaded = true;
          this.changeChart(this.plotlyInfo.chartType);
        })
        break;
      case 'demand':
        this.dbSql.getDemandData(this.plotlyInfo.scenarioId, this.plotlyInfo.year, this.plotlyInfo.scale).then((data) => {
          this.rawData = data;
          this.formattedData = data;
          this.loaded = true;
          this.changeChart(this.plotlyInfo.chartType);
        })
        break;
      case 'generation':
        this.dbSql.getGenerationData(this.plotlyInfo.scenarioId, this.plotlyInfo.year, this.plotlyInfo.scale).then((data) => {
          this.rawData = data;
          this.formattedData = data;
          this.loaded = true;
          this.changeChart(this.plotlyInfo.chartType);
        })
        break;
      default:
        break;
    }
  }

  changeScale(scale: any) {
    if (this.plotlyInfo.valueType == 'capacity') return;
    this.loaded = false;
    this.plotlyInfo.scale = scale.value;
    this.scales.forEach(el => { (el.value == this.plotlyInfo.scale) ? el.color = 'primary' : el.color = 'warn' })
    switch (this.plotlyInfo.valueType) {
      case 'capacity':
        this.dbSql.getCapactiyData(this.plotlyInfo.scenarioId).then((data) => {
          this.rawData = data;
          this.formattedData = data;
          this.createLineChart();
        })
        break;
      case 'demand':
        this.dbSql.getDemandData(this.plotlyInfo.scenarioId, this.plotlyInfo.year, this.plotlyInfo.scale).then((data) => {
          this.rawData = data;
          this.formattedData = data;
          this.createLineChart();
        })
        break;
      case 'generation':
        this.dbSql.getGenerationData(this.plotlyInfo.scenarioId, this.plotlyInfo.year, this.plotlyInfo.scale).then((data) => {
          this.rawData = data;
          this.formattedData = data;
          this.createLineChart();
        })
        break;
      default:
        break;
    }
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

  changeChart(selectedChart: string) {
    this.typeOfCharts.forEach(el => {
      if (el.value === selectedChart) {
        el.color = 'primary';
      } else {
        el.color = 'warn';
      }
    });
    switch (selectedChart) {
      case 'line':
        this.createLineChart();
        break;
      case 'bar':
        this.createBarChart();
        break;
      case 'heat':
        this.createHeatMap();
        break;
    }
  }

  createLineChart() {
    this.loaded = false;
    const traces = [];
    Object.keys(this.formattedData).forEach(el => {
      const trace = {
        name: el,
        mode: 'lines',
        type: 'scatter',
        x: [],
        y: [],
      };
      if (this.plotlyInfo.valueType == 'generation') trace['stackgroup'] = 'one';
      this.formattedData[el].forEach(dataPoint => {
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
    Object.keys(this.formattedData).forEach(el => {
      const trace = {
        name: el,
        type: 'bar',
        x: [],
        y: []
      };
      this.formattedData[el].forEach(dataPoint => {
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
      barmode: 'stack'
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
    Object.keys(this.formattedData).forEach(el => {
      const zVals = [];
      const xVals = [];
      this.formattedData[el].forEach(dataPoint => {
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
