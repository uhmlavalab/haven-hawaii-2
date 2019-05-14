import { Component, OnInit } from '@angular/core';

import { HavenWindowService, ScenariosService } from '@app/haven-core';

import { HavenWindow, HavenApp, HavenChartAppInfo } from '@app/haven-features';


@Component({
  selector: 'app-haven-sidebar-charts',
  templateUrl: './haven-sidebar-charts.component.html',
  styleUrls: ['./haven-sidebar-charts.component.css']
})
export class HavenSidebarChartsComponent implements OnInit {

  scopes = [
    { value: 'years', viewValue: 'Yearly Total' },
    { value: 'months', viewValue: 'Monthly Totals' },
    { value: 'hours', viewValue: 'Daily Averages'}

  ];

  scenarios = [];

  selectedScenario = '';
  selectedYear: number;
  selectedLoad = '';
  selectedScale = '';
  selectedValue = '';
  selectedChart = 'line';
  selShare: any;

  constructor(private windowService: HavenWindowService, public scenariosService: ScenariosService) { }

  ngOnInit() { 
    this.scenariosService.getScenariosList().then(scenarios => {
      this.scenarios = scenarios;
    });
  }

  createChartWindow() {
    const appInfo = new HavenChartAppInfo(
      this.scenariosService.getSelectedScenarioName(),
      this.scenariosService.getSelectScenarioId(),
      this.selShare.year,
      this.selectedValue,
      this.selectedScale,
      this.selectedChart
    );
    const title = `${this.scenariosService.getSelectedScenarioName()} - ${this.selectedValue.toLocaleUpperCase()} - ${this.selShare.year}`;
    const footer = ``;
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
    this.selectedScale = 'years';
    this.createChartWindow();
  }

  generationChart() {
    this.selectedValue = 'generation';
    this.selectedScale = 'hours';
    this.createChartWindow();
  }

  demandChart() {
    this.selectedValue = 'demand';
    this.selectedScale = 'hours';
    this.createChartWindow();
  }

  setScenario() {
    this.scenariosService.setScenario(this.selectedScenario);
  }

}
