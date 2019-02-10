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
      disabled: false
    },
    {
      toolTip: 'Bar Chart',
      icon: 'insert_chart',
      color: 'warn',
      disabled: false
    },
    {
      toolTip: 'Heatmap Chart',
      icon: 'grid_on',
      color: 'warn',
      disabled: false
    },
    {
      toolTip: 'List',
      icon: 'format_list_numbered',
      color: 'accent',
      disabled: true
    },
  ];

  scopes = [
    {
      text: 'Yearly Total',
      color: 'primary',
      toolTip: '',
      disabled: false
    },
    {
      text: 'Monthly Total',
      color: 'warn',
      toolTip: '',
      disabled: false
    },
    {
      text: 'Daily Average',
      color: 'warn',
      toolTip: '',
      disabled: true
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
    switch (this.plotlyInfo.valueType) {
      case 'capacity':
        this.dbSql.getCapactiyData(this.plotlyInfo.scenarioId).then((data) => {
          console.log(this.plotlyInfo);
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

  monthlyFormat(data: any): any {
    const newData = {};
    console.log(data);
    Object.keys(data).forEach(el => {
      if (!newData[el]) newData[el] = [];
      data[el].forEach(el2 => {
        const month = new Date(el2[0]).getMonth();
        const value = Number(el2[1]);
        const found = newData[el].find(element => { return element[0] == month })
        if (!found) {
          newData[el].push([month, value]);
        } else {
          found[1] += value
        }
      })
      newData[el].sort((a, b) => (a[0] > b[0]) ? 1 : -1);
    });
    Object.keys(newData).forEach(el1 => newData[el1].forEach(el2 => el2[0] = this.monthsOfYear[el2[0]]));
    return newData;
  }

  weeklyFormat(data: any): any {
    const newData = {};
    Object.keys(data).forEach(el => {
      if (!newData[el]) newData[el] = [];
      data[el].forEach(el2 => {
        const dayOfWeek = new Date(el2[0]).getDay();
        const value = Number(el2[1]);
        const found = newData[el].find(element => { return element[0] == dayOfWeek })
        if (!found) {
          newData[el].push([dayOfWeek, value]);
        } else {
          found[1] += value
        }
      })
      newData[el].sort((a, b) => (a[0] > b[0]) ? 1 : -1);
    });
    Object.keys(newData).forEach(el1 => newData[el1].forEach(el2 => el2[0] = this.daysOfWeek[el2[0]]));
    return newData;
  }

  dailyFormat(data: any): any {
    const newData = {};
    Object.keys(data).forEach(el => {
      if (!newData[el]) newData[el] = [];
      data[el].forEach(el2 => {
        const hourOfDay = new Date(el2[0]).getUTCHours();
        const value = Number(el2[1]);
        const found = newData[el].find(element => { return element[0] == hourOfDay })
        if (!found) {
          newData[el].push([hourOfDay, value]);
        } else {
          found[1] += value
        }
      })
      newData[el].sort((a, b) => (a[0] > b[0]) ? 1 : -1);
    });
    return newData;
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
    this.loaded = false;
    this.scopes.forEach(el => {
      if (selectedScope.text === el.text) {
        el.color = 'primary';
      } else {
        el.color = 'warn';
      }
    });
    const currentChart = this.typeOfCharts.find(el => el.color == 'primary')
    console.log(selectedScope);
    switch (selectedScope.text) {
      case 'Monthly':
        this.loaded = false;
        this.formattedData = null;
        this.formattedData = this.monthlyFormat(this.rawData);
        this.changeChart(currentChart);
        break;
      case 'Weekly':
        this.loaded = false;
        this.formattedData = null;
        this.formattedData = this.weeklyFormat(this.rawData);
        this.changeChart(currentChart);
        break;
      case 'Daily':
        this.loaded = false;
        this.formattedData = null;
        this.formattedData = this.dailyFormat(this.rawData);
        this.changeChart(currentChart);
        break;
    }
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
    Object.keys(this.formattedData).forEach(el => {
      const trace = {
        name: el,
        mode: 'lines',
        type: 'scatter',
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
