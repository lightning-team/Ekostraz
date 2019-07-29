import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
  MatCardModule,
  MatButtonModule,
  MatSnackBarModule,
  MatTableModule,
  MatIconModule,
  MatPaginatorModule,
  MatListModule,
  MatDialogModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { AgmCoreModule } from '@agm/core';

import { InterventionsRoutingModule } from './interventions-routing.module';
import { InterventionsListComponent } from './list/list.component';
import { InterventionDetailsComponent } from './details/details.component';
import { InterventionDetailsContainerComponent } from './details/details.container.component';
import { InterventionsService } from './interventions.service';
import { InterventionsTableComponent } from './list/table/table.component';
import { InterventionsMapComponent } from './list/map/map.component';
import { DeleteInterventionDialog } from './details/delete.dialog';
import { PrivateFormComponent } from './private-form/private-form.component';
import { PublicFormComponent } from './public-form/public-form.component';
import { PrivateEditFormComponent } from './private-edit-form/private-edit-form.component';
import {InterventionFormModule} from '@interventionForm/intervention-form.module';

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
    InterventionsListComponent,
    InterventionDetailsComponent,
    InterventionDetailsContainerComponent,
    InterventionsTableComponent,
    InterventionsMapComponent,
    DeleteInterventionDialog,
    PrivateFormComponent,
    PrivateEditFormComponent,
    PublicFormComponent,
  ],
  entryComponents: [
    DeleteInterventionDialog,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    InterventionsRoutingModule,
    InterventionFormModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBmQtE0I9s8Z8M8m73B0Er9LU9tJDt0n1s'
    }),
    ...MaterialImports,
  ],
  providers: [
    InterventionsService
  ]
})
export class InterventionsModule { }
