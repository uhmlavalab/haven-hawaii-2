import { Type } from '@angular/core';

export class HavenChartAppInfo {
  scenarioName: string;
  startDate: Date;
  endDate: Date;
  valueName: string;
  scope: string;
  chartType: string;

  constructor(scenarioName: string, startDate: Date, endDate: Date, valueName: string, scope: string, chartType: string) {
    this.scenarioName = scenarioName;
    this.startDate = startDate;
    this.endDate = endDate;
    this.valueName = valueName;
    this.scope = scope;
    this.chartType = chartType;
  }

  getObject() {
    return {
      'scenarioName': this.scenarioName,
      'startDate': this.startDate,
      'endDate': this.endDate,
      'valueName': this.valueName,
      'scope': this.scope,
      'chartType': this.chartType
    };
  }

}
