import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailsContainerComponent } from './details/details.container.component';
import { MapComponent } from './map/map.component';
import { NewFormComponent } from './new-form/new-form.component';
import { EditFormComponent } from './edit-form/edit-form.component';

const routes: Routes = [{
  path: '',
  component: ListComponent,
}, {
  path: 'zglos',
  component: NewFormComponent,
}, {
  path: 'mapa',
  component: MapComponent,
}, {
  path: ':interventionId',
  component: DetailsContainerComponent,
}, {
  path: ':interventionId/edytuj',
  component: EditFormComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterventionsRoutingModule { }
