import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { routes } from './app.routes';

import { AppComponent } from './app.component';

// Core and Shared
import { HavenCoreModule } from '@app/haven-core';
import { HavenSharedModule } from '@app/haven-shared';

// Pages and Features
import { HavenPagesModule } from '@app/haven-pages';
import { HavenFeaturesModule } from '@app/haven-features';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    routes,

    HavenCoreModule,
    HavenSharedModule,
    HavenPagesModule,
    HavenFeaturesModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
