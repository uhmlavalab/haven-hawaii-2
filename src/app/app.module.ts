import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { FirebaseModuleModule } from './firebase-module/firebase-module.module';

@NgModule({
  imports: [
    BrowserModule,
    FirebaseModuleModule,
  ],
  providers: [],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
