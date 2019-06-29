import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterventionsFormComponent } from './form/form.component';
import { InterventionsListComponent } from './list/list.component';
import { InterventionDetailsComponent } from './details/details.component';
import { InterventionsMapComponent } from './list/map/map.component';

const routes: Routes = [{
  path: '',
  component: InterventionsListComponent,
}, {
  path: 'new',
  component: InterventionsFormComponent,
}, {
  path: 'map',
  component: InterventionsMapComponent,
}, {
  path: ':interventionId',
  component: InterventionDetailsComponent,
}, {
  path: ':interventionId/edit',
  component: InterventionsFormComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterventionsRoutingModule { }
