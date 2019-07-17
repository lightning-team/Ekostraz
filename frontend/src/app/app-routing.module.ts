import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent } from './home-page/home-page.component';
import { LoginFormComponent } from './modules/auth/login-form/login-form.component';
import { LoggedOutGuard } from './modules/auth/guards/logged-out.guard';
import { LoggedInUserGuard } from './modules/auth/guards/logged-in-user.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'zaloguj',
    component: LoginFormComponent,
    canActivate: [LoggedOutGuard]
  },
  {
    path: 'interwencje',
    loadChildren: './modules/interventions/interventions.module#InterventionsModule',
    // TODO: Temporary disable until public form is moved out of the Interventions module
    // canLoad: [LoggedInUserGuard],
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
