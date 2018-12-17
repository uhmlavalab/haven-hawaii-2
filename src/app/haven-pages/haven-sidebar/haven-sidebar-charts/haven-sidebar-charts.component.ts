import { Component, OnInit } from '@angular/core';

import { HavenWindowService, ScenariosService } from '@app/haven-core';

import { HavenWindow, HavenApp, HavenChartAppInfo } from '@app/haven-features';
import { HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';

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
  selectedScope = '';
  selectedValue = '';
  selectedChart = 'scatter';

  selShare: any;

  constructor(private windowService: HavenWindowService, public scenariosService: ScenariosService, private http: Http) { }

  ngOnInit() { }

  createChartWindow(data: any) {
    const appInfo = new HavenChartAppInfo(
      this.scenariosService.getSelectedScenarioName(),
      this.selShare.year,
      this.selectedValue,
      this.selectedScope,
      this.selectedChart,
      data
    );
    const title = `${this.selShare.year}`;
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
    var req = new XMLHttpRequest();
    req.onload = () => {
      const results = JSON.parse(req.responseText) as any;
      Object.keys(results).forEach(el1 => {
        const elData = [];
        Object.keys(results[el1]).forEach(el2 => {
          elData.push([el2, results[el1][el2]]);
        })
        results[el1] = elData;
      })
      console.log(results);
      this.createChartWindow(results);
    }
    req.onerror = () => {
      console.log('There was an error');
    }
    req.open('GET', `https://us-central1-haven-hawaii-2.cloudfunctions.net/capacityData`, true);
    req.send();
  }

  generationChart() {
    const req = new XMLHttpRequest();
    req.onload = () => {
      const data = {};
      const results = JSON.parse(req.responseText) as any;
      console.log(results);
      results.rows.forEach(el => {
        if (!data[el.technology]) {
          data[el.technology] = [];
        }
        data[el.technology].push([el['hour'], el['sum']]);
      })
      this.createChartWindow(data);
    }
    req.onerror = () => {
      console.log('There was an error');
    }
    req.open('GET', `https://us-central1-haven-hawaii-2.cloudfunctions.net/generationData?year=${this.selShare.year}&scenario=${this.scenariosService.getSelectScenarioId()}`, true);
    req.send();
  }

}
