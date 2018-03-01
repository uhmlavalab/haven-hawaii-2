import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { HavenFirebaseModule } from './shared-modules/haven-firebase.module';
import { HavenMaterialModule } from './shared-modules/haven-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    BrowserModule,
    FlexLayoutModule,
    HavenFirebaseModule,
    HavenMaterialModule,
  ],
  providers: [],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
