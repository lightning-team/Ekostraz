import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EkoRoutePaths } from '@app/eko-route-paths';

import { HomePageComponent } from './pages/home/home-page.component';
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
    path: EkoRoutePaths.Login,
    component: LoginComponent,
    canActivate: [LoggedOutGuard],
  },
  {
    path: EkoRoutePaths.PublicForm,
    component: PublicFormComponent,
    canActivate: [LoggedOutGuard],
  },
  {
    path: EkoRoutePaths.Interventions,
    loadChildren: './modules/interventions/interventions.module#InterventionsModule',
    canLoad: [LoggedInGuard],
    canActivateChild: [LoggedInGuard],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  // NOTE: Remember to change GoogleTagManager history triggers if we decide to drop
  // the url 'useHash' strategy.
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
