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

  scopes = [
    {value: 'annual', viewValue: 'Annual'},
    {value: 'monthly', viewValue: 'Monthly'},
    {value: 'daily', viewValue: 'Daily'},
    {value: 'hourly', viewValue: 'Hourly'}
  ];

  valueTypes = [
    {value: 'load', viewValue: 'Load'},
    {value: 'capacity', viewValue: 'Capacity'},
    {value: 'supply', viewValue: 'Supply'}
  ];

  selectedYear = 2030;
  selectedScope = 'hourly';
  selectedValue = 'load';

  constructor(private windowService: HavenWindowService, public portfolioService: PortfolioService) { }

  ngOnInit() {}

  createChartWindow() {
    const havenWindow = new HavenWindow('Plotly', '', 100, 100, 400, 400, false);
    const startDate = new Date(this.selectedYear, 0, 1);
    const endDate = new Date(this.selectedYear, 1, 1);
    const appInfo = new PlotlyAppInfo(startDate, endDate, this.selectedValue);
    const newApp = new HavenApp('plotly-scatter', appInfo);
    havenWindow.app = newApp;
    this.windowService.addWindow(havenWindow);
  }

}
