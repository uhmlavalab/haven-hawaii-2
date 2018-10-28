import { Component, OnInit } from '@angular/core';

import { HavenWindowService, ScenariosService } from '@app/haven-core';

import { HavenWindow, HavenApp, HavenChartAppInfo } from '@app/haven-features';

@Component({
  selector: 'app-haven-sidebar-charts',
  templateUrl: './haven-sidebar-charts.component.html',
  styleUrls: ['./haven-sidebar-charts.component.css']
})
export class HavenSidebarChartsComponent implements OnInit {

  valueTypes = [
    {value: 'capacity', viewValue: 'Capacity'},
    {value: 'summary', viewValue: 'Summary'},
    {value: 'storageCapacity', viewValue: 'Storage Capacity'},
    {value: 'curtailment', viewValue: 'Curtailment'},
    {value: 'resources', viewValue: 'Resources'},
    {value: 'power', viewValue: 'Power'},  ];

  scopes = [
    {value: 'monthly', viewValue: 'Monthly'},
    {value: 'daily', viewValue: 'Daily'},
  ];

  selectedYear: number;
  selectedScenario = '';
  selectedLoad = '';
  selectedScope = '';
  selectedValue = '';
  selectedChart = 'scatter';

  constructor(private windowService: HavenWindowService, public scenariosService: ScenariosService) { }

  ngOnInit() {}

  createChartWindow() {
    const startDate = new Date(this.selectedYear, 0, 1);
    const endDate = new Date(this.selectedYear, 11, 31);
    const appInfo = new HavenChartAppInfo(
      this.scenariosService.getSelectedScenarioName(),
      startDate,
      endDate,
      this.selectedValue,
      this.selectedScope,
      this.selectedChart
    );
    const title = `${this.selectedValue.charAt(0).toUpperCase() + this.selectedValue.slice(1)} - ${startDate.getFullYear()}`;
    const footer = `${this.scenariosService.getSelectedScenarioName()} - ${this.selectedScenario} - ${this.selectedLoad} Load`;
    const havenWindow = new HavenWindow(title, footer, 100, 100, 400, 400, false);
    const newApp = new HavenApp(`plotly-chart`, appInfo);
    havenWindow.app = newApp;
    this.windowService.addWindow(havenWindow);
  }

  setSelectedChart(value: any) {
    this.selectedChart = value;
  }

}
