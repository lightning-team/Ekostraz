import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent } from './home-page/home-page.component';
import { LoggedOutGuard } from './modules/auth/guards/logged-out.guard';
import { LoggedInGuard } from './modules/auth/guards/logged-in.guard';
import { PublicFormComponent } from './modules/public-form/public-form/public-form.component';
import { LoginComponent } from './modules/auth/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'zaloguj',
    component: LoginComponent,
    canActivate: [LoggedOutGuard],
  },
  {
    path: 'zglos-interwencje',
    component: PublicFormComponent,
    canActivate: [LoggedOutGuard],
  },
  {
    path: 'interwencje',
    loadChildren: './modules/interventions/interventions.module#InterventionsModule',
    canLoad: [LoggedInGuard],
    canActivateChild: [LoggedInGuard],
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
