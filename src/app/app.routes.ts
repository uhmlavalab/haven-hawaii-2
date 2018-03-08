import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HavenLoginComponent } from './haven-login/component/haven-login.component';
import { HavenHomeComponent } from './haven-home/component/haven-home.component';

import { AuthGuard } from './auth-guard.service';

const router: Routes = [
  {
    path: 'login',
    component: HavenLoginComponent
  },
  {
    path: 'home',
    component: HavenHomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: HavenLoginComponent
  },
  {
    path: '**',
    component: HavenLoginComponent
  }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
