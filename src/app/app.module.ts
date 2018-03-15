import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { routes } from './app.routes';

import { AppComponent } from './app.component';

import { HavenFirebaseModule } from './haven-modules/haven-firebase.module';
import { HavenMaterialModule } from './haven-modules/haven-material.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard.service';
import { FlexLayoutModule } from '@angular/flex-layout';

import { HavenAppsModule } from './haven-apps/haven-apps.module';
import { HavenDialogModule } from './haven-dialog/haven-dialog.module';
import { HavenHomeModule } from './haven-home/haven-home.module';
import { HavenLoginModule } from './haven-login/haven-login.module';
import { HavenWindowModule } from './haven-window/haven-window.module';

import { Globals } from './globals';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    routes,
    FlexLayoutModule,
    HavenFirebaseModule,
    HavenMaterialModule,
    HavenHomeModule,
    HavenLoginModule,
    HavenAppsModule,
    HavenWindowModule,
    HavenDialogModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    Globals
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
