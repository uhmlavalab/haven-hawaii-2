import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/haven-core';

import { HavenHomeComponent } from '@app/haven-pages';
import { HavenLoginComponent } from '@app/haven-pages';
import { HavenArComponent } from '@app/haven-pages';

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
    path: 'ar',
    component: HavenArComponent
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
