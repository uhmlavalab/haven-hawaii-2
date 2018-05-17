import { Component, OnInit } from '@angular/core';

import { HavenWindowService } from '../../../haven-window/services/haven-window.service';
import { HavenWindow } from '../../../haven-window/shared/haven-window';
import { HavenApp } from '../../../haven-apps/shared/haven-app';

import { PlotlyAppInfo } from '../../../haven-apps/plotly/shared/plotly-app-info';

@Component({
  selector: 'app-haven-sidebar-charts',
  templateUrl: './haven-sidebar-charts.component.html',
  styleUrls: ['./haven-sidebar-charts.component.css']
})
export class HavenSidebarChartsComponent implements OnInit {

  reValue = 50;

  scenarios = [
    {value: 'Scenario-0', viewValue: 'Scenario A'},
    {value: 'Scenario-1', viewValue: 'Scenario B'},
    {value: 'Scenario-2', viewValue: 'Scenario C'}
  ];

  scopes = [
    {value: 'Annual-0', viewValue: 'Annual'},
    {value: 'Monthly-1', viewValue: 'Monthly'},
    {value: 'Daily-2', viewValue: 'Daily'}
  ];

  valueTypes = [
    {value: 'load-0', viewValue: 'Load'},
    {value: 'netload-1', viewValue: 'NetLoad'},
    {value: 'Supply-2', viewValue: 'Supply'}
  ];

  constructor(private windowService: HavenWindowService) { }

  ngOnInit() {
  }

  reSliderChange(event) {
    this.reValue = event.value;
  }

  createChartWindow() {
    const havenWindow = new HavenWindow('Plotly', '', 100, 100, 400, 400, false);
    const startDate = new Date(2022, 0, 1);
    const endDate = new Date(2022, 1, 1);
    const value = 'load';
    const appInfo = new PlotlyAppInfo(startDate, endDate, value);
    const newApp = new HavenApp('plotly-scatter', appInfo);
    havenWindow.app = newApp;
    this.windowService.addWindow(havenWindow);
  }

}
