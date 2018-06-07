import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ComponentRef } from '@angular/core';

import { HavenWindowService } from '@app/haven-core';

import { HavenWindow } from '../../haven-window/shared/haven-window';

import { HavenAppsHostDirective } from '../shared/haven-apps-host.directive';
import { HavenAppList } from '../shared/haven-app-list';

@Component({
  selector: 'app-haven-apps-factory',
  templateUrl: './haven-apps-factory.component.html',
  styleUrls: ['./haven-apps-factory.component.css']
})
export class HavenAppsFactoryComponent implements OnInit {

  @ViewChild(HavenAppsHostDirective) havenAppsHost: HavenAppsHostDirective;
  @Input()windowId: number;
  componentRef: ComponentRef<any>;

  constructor(private havenWindowService: HavenWindowService, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.havenWindowService.getWindow(this.windowId).then(havenWindow => {
      this.addApp(havenWindow);
    });
  }

  addApp(havenWindow: HavenWindow) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(HavenAppList.apps[havenWindow.app.appName]);
    const viewContainerRef = this.havenAppsHost.viewContainerRef;
    this.componentRef = viewContainerRef.createComponent(componentFactory);
    (this.componentRef.instance).havenApp = havenWindow.app;
    (this.componentRef.instance).havenWindow = havenWindow;
  }

  resize() {
    (this.componentRef.instance).resize();
  }

}
