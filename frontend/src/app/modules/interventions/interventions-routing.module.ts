import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterventionsListComponent } from './list/list.component';
import { InterventionDetailsContainerComponent } from './details/details.container.component';
import { InterventionsMapComponent } from './list/map/map.component';
import { LoggedInMemberGuard } from '../auth/guards/logged-in-member.guard';
import {PrivateFormComponent} from './private-form/private-form.component';
import {PrivateEditFormComponent} from './private-edit-form/private-edit-form.component';

const routes: Routes = [{
  path: '',
  component: InterventionsListComponent,
  canActivate: [LoggedInMemberGuard],
}, {
  path: 'zglos',
  component: PrivateFormComponent,
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
  component: PrivateEditFormComponent,
  canActivate: [LoggedInMemberGuard],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterventionsRoutingModule { }
