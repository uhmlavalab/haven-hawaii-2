import { Type } from '@angular/core';

export class HavenChartAppInfo {
  scenarioName: string;
  scenarioId: number;
  year: number;
  valueType: string;
  chartType: string;
  scale: string;


  constructor(scenarioName: string, scenarioId: number, year: number, valueName: string, scale: string, chartType: string) {
    this.scenarioName = scenarioName;
    this.scenarioId = scenarioId;
    this.year = year;
    this.valueType = valueName;
    this.chartType = chartType;
    this.scale = scale;
  }

  getObject() {
    return {
      'scenarioName': this.scenarioName,
      'scenarioId': this.scenarioId,
      'year': this.year,
      'valueName': this.valueType,
      'scale': this.scale,
      'chartType': this.chartType
    };
  }

}
