import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { routes } from './app.routes';

import { AppComponent } from './app.component';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard.service';

import { HavenAppsModule } from './haven-apps/haven-apps.module';
import { HavenDialogModule } from './haven-dialog/haven-dialog.module';
import { HavenFirebaseModule } from './haven-firebase/haven-firebase.module';
import { HavenHomeModule } from './haven-home/haven-home.module';
import { PapaParseModule } from 'ngx-papaparse';
import { HavenLoginModule } from './haven-login/haven-login.module';
import { HavenMaterialModule } from './haven-material/haven-material.module';
import { HavenSidebarModule } from './haven-sidebar/haven-sidebar.module';
import { HavenWindowModule } from './haven-window/haven-window.module';
import { HavenPortfolioModule } from './haven-portfolio/haven-portfolio.module';

import { Globals } from './globals';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    routes,
    HavenFirebaseModule,
    HavenMaterialModule,
    PapaParseModule,
    HavenHomeModule,
    HavenLoginModule,
    HavenAppsModule,
    HavenWindowModule,
    HavenDialogModule,
    HavenSidebarModule,
    HavenPortfolioModule,
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
