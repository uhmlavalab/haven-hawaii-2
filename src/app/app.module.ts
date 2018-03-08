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

import { HavenLoginModule } from './haven-modules/haven-login.module';
import { HavenWindowModule } from './haven-modules/haven-window.module';
import { HavenHomeModule } from './haven-modules/haven-home.module';
import { HavenDialogModule } from './haven-modules/haven-dialog.module';

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
