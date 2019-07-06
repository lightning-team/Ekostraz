import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutUsComponent } from './about-us/about-us.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginFormComponent } from './auth/login-form/login-form.component';
import { LoggedOutGuard } from './auth/guards/logged-out.guard';
import { LoggedInUserGuard } from './auth/guards/logged-in-user.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'o-nas',
    component: AboutUsComponent,
  },
  {
    path: 'zaloguj',
    component: LoginFormComponent,
    canActivate: [LoggedOutGuard]
  },
  {
    path: 'interwencje',
    loadChildren: './interventions/interventions.module#InterventionsModule',
    canLoad: [LoggedInUserGuard],
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
