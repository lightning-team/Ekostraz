import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatCardModule,
  MatButtonModule,
  MatSnackBarModule,
  MatTableModule,
  MatIconModule,
  MatPaginatorModule,
  MatListModule,
  MatDialogModule,
  MatProgressSpinnerModule,
} from '@angular/material';

import { AgmCoreModule } from '@agm/core';

import { InterventionsRoutingModule } from './interventions-routing.module';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { DetailsContainerComponent } from './details/details.container.component';
import { InterventionsService } from './interventions.service';
import { TableComponent } from './list/table/table.component';
import { MapComponent } from './map/map.component';
import { DeleteDialog } from './details/delete.dialog';
import { NewFormComponent } from './new-form/new-form.component';
import { EditFormComponent } from './edit-form/edit-form.component';
import { InterventionFormModule } from '@interventionForm/intervention-form.module';
import { SharedModule } from '@shared/shared.module';

const MaterialImports = [
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatListModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTableModule,
];

@NgModule({
  declarations: [
    ListComponent,
    DetailsComponent,
    DetailsContainerComponent,
    TableComponent,
    MapComponent,
    DeleteDialog,
    NewFormComponent,
    EditFormComponent,
  ],
  entryComponents: [DeleteDialog],
  imports: [
    CommonModule,
    SharedModule,
    InterventionsRoutingModule,
    InterventionFormModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBmQtE0I9s8Z8M8m73B0Er9LU9tJDt0n1s',
    }),
    ...MaterialImports,
  ],
  providers: [InterventionsService],
})
export class InterventionsModule {}
