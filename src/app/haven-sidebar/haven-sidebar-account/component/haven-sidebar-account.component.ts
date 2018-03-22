import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-haven-sidebar-account',
  templateUrl: './haven-sidebar-account.component.html',
  styleUrls: ['./haven-sidebar-account.component.css']
})
export class HavenSidebarAccountComponent implements OnInit {

  portfolios = [
    { value: 'Hawaii-0', viewValue: 'Hawaii' },
    { value: 'Arizona-1', viewValue: 'Arizona' },
    { value: 'California-2', viewValue: 'California' }
  ];

  sessions = [
    { value: 'Session-0', viewValue: 'Session A' },
    { value: 'Session-1', viewValue: 'Session B' },
    { value: 'Session-2', viewValue: 'Session C' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
