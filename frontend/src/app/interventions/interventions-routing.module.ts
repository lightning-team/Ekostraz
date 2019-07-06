import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterventionsFormComponent } from './form/form.component';
import { InterventionsListComponent } from './list/list.component';
import { InterventionDetailsContainerComponent } from './details/details.container.component';
import { InterventionsMapComponent } from './list/map/map.component';
import { LoggedInMemberGuard } from '../auth/guards/logged-in-member.guard';

const routes: Routes = [{
  path: '',
  component: InterventionsListComponent,
  canActivate: [LoggedInMemberGuard],
}, {
  path: 'zglos',
  component: InterventionsFormComponent,
}, {
  path: 'mapa',
  component: InterventionsMapComponent,
  canActivate: [LoggedInMemberGuard],
}, {
  path: ':interventionId',
  component: InterventionDetailsContainerComponent,
  canActivate: [LoggedInMemberGuard],
}, {
  path: ':interventionId/edytuj',
  component: InterventionsFormComponent,
  canActivate: [LoggedInMemberGuard],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterventionsRoutingModule { }
