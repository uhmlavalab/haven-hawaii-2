import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { PapaParseModule } from 'ngx-papaparse';

import { Globals } from './globals';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../../environments/environment';

import { AuthGuard } from './services/auth/auth-guard.service';
import { AuthService } from './services/auth/auth.service';
import { ScenariosService } from './services/scenarios/scenarios.service';
import { SessionsService } from './services/sessions/sessions.service';
import { LayersService } from './services/layers/layers.service';
import { HavenWindowService } from './services/windows/haven-window.service';
import { DatabaseSqlService } from './services/database-sql/database-sql.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    PapaParseModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    ScenariosService,
    LayersService,
    SessionsService,
    HavenWindowService,
    DatabaseSqlService,
    Globals
  ]
})
export class HavenCoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: HavenCoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
