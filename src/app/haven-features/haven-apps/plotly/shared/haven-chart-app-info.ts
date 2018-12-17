import { Type } from '@angular/core';

export class HavenChartAppInfo {
  scenarioName: string;
  year: number;
  valueName: string;
  scope: string;
  chartType: string;
  data: any;

  constructor(scenarioName: string, year: number, valueName: string, scope: string, chartType: string, data: any) {
    this.scenarioName = scenarioName;
    this.year = year;
    this.valueName = valueName;
    this.scope = scope;
    this.chartType = chartType;
    this.data = data;
  }

  getObject() {
    return {
      'scenarioName': this.scenarioName,
      'year': this.year,
      'valueName': this.valueName,
      'scope': this.scope,
      'chartType': this.chartType
    };
  }

}
