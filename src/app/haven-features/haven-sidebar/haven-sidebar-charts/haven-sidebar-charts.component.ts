import { Component, OnInit } from '@angular/core';

import { HavenWindowService, PortfolioService } from '@app/haven-core';

import { HavenWindow } from '../../haven-window/shared/haven-window';
import { HavenApp } from '../../haven-apps/shared/haven-app';

import { PlotlyAppInfo } from '../../haven-apps/plotly/shared/plotly-app-info';

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

  constructor(private windowService: HavenWindowService, public portfolioService: PortfolioService) { }

  ngOnInit() {}

  createChartWindow() {
    const startDate = new Date(this.selectedYear, 0, 1);
    const endDate = new Date(this.selectedYear, 11, 31);
    const appInfo = new PlotlyAppInfo(
      this.portfolioService.getSelectedPortfolioName(),
      this.selectedScenario,
      this.selectedLoad,
      startDate,
      endDate,
      this.selectedValue,
      this.selectedScope,
      this.selectedChart
    );
    const title = `${this.selectedValue.charAt(0).toUpperCase() + this.selectedValue.slice(1)} - ${startDate.getFullYear()}`;
    const footer = `${this.portfolioService.getSelectedPortfolioName()} - ${this.selectedScenario} - ${this.selectedLoad} Load`;
    const havenWindow = new HavenWindow(title, footer, 100, 100, 400, 400, false);
    const newApp = new HavenApp(`plotly-${this.selectedChart}`, appInfo);
    havenWindow.app = newApp;
    this.windowService.addWindow(havenWindow);
  }

  setSelectedChart(value: any) {
    this.selectedChart = value;
  }

}
