import { Component, OnInit } from '@angular/core';

import { HavenWindowService, ScenariosService } from '@app/haven-core';

import { HavenWindow, HavenApp, HavenChartAppInfo } from '@app/haven-features';
import { HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';

/*

battery
fossil
bio
demand
dgpv
pv
offshore wind
onshore wind 

*/

@Component({
  selector: 'app-haven-sidebar-charts',
  templateUrl: './haven-sidebar-charts.component.html',
  styleUrls: ['./haven-sidebar-charts.component.css']
})
export class HavenSidebarChartsComponent implements OnInit {

  valueTypes = [
    { value: 'capacity', viewValue: 'Capacity' },
    { value: 'summary', viewValue: 'Summary' },
    { value: 'storageCapacity', viewValue: 'Storage Capacity' },
    { value: 'curtailment', viewValue: 'Curtailment' },
    { value: 'resources', viewValue: 'Resources' },
    { value: 'power', viewValue: 'Power' },];

  scopes = [
    { value: 'monthly', viewValue: 'Monthly' },
    { value: 'daily', viewValue: 'Daily' },
  ];

  selectedYear: number;
  selectedScenario = '';
  selectedLoad = '';
  selectedScale = '';
  selectedValue = '';
  selectedChart = 'scatter';

  selShare: any;

  constructor(private windowService: HavenWindowService, public scenariosService: ScenariosService, private http: Http) { }

  ngOnInit() { }

  createChartWindow() {
    const appInfo = new HavenChartAppInfo(
      this.scenariosService.getSelectedScenarioName(),
      this.scenariosService.getSelectScenarioId(),
      this.selShare.year,
      this.selectedValue,
      this.selectedScale,
      this.selectedChart
    );
    const title = `${this.selectedValue.toLocaleUpperCase()}`;
    const footer = `${this.scenariosService.getSelectedScenarioName()}`;
    const havenWindow = new HavenWindow(title, footer, 100, 100, 400, 400, false);
    const newApp = new HavenApp(`plotly-chart`, appInfo);
    havenWindow.app = newApp;
    this.windowService.addWindow(havenWindow);
  }

  setSelectedChart(value: any) {
    this.selectedChart = value;
  }

  capacityChart() {
    this.selectedValue = 'capacity';
    this.createChartWindow();
  }

  generationChart() {
    this.selectedValue = 'generation';
    this.selectedScale = 'months';
    this.createChartWindow();
  }

  demandChart() {
    this.selectedValue = 'demand';
    this.selectedScale = 'months';
    this.createChartWindow();
  }

}
