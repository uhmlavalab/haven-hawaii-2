import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

  reSliderChange(event) {
    this.reValue = event.value;
  }

}
