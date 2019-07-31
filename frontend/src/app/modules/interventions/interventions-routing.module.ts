import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailsContainerComponent } from './details/details.container.component';
import { MapComponent } from './map/map.component';
import { LoggedInMemberGuard } from '../auth/guards/logged-in-member.guard';
import { NewFormComponent } from './new-form/new-form.component';
import { EditFormComponent } from './edit-form/edit-form.component';

const routes: Routes = [{
  path: '',
  component: ListComponent,
  canActivate: [LoggedInMemberGuard],
}, {
  path: 'zglos',
  component: NewFormComponent,
}, {
  path: 'mapa',
  component: MapComponent,
  canActivate: [LoggedInMemberGuard],
}, {
  path: ':interventionId',
  component: DetailsContainerComponent,
  canActivate: [LoggedInMemberGuard],
}, {
  path: ':interventionId/edytuj',
  component: EditFormComponent,
  canActivate: [LoggedInMemberGuard],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterventionsRoutingModule { }
