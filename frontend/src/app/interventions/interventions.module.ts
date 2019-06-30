import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTableModule,
  MatIconModule,
  MatPaginatorModule,
  MatListModule,
  MatDialogModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { AgmCoreModule } from '@agm/core';

import { InterventionsFormComponent } from './form/form.component';
import { InterventionsRoutingModule } from './interventions-routing.module';
import { InterventionsListComponent } from './list/list.component';
import { InterventionDetailsComponent } from './details/details.component';
import { InterventionDetailsContainerComponent } from './details/details.container.component';
import { InterventionsService } from './interventions.service';
import { InterventionsTableComponent } from './list/table/table.component';
import { InterventionsMapComponent } from './list/map/map.component';
import { DeleteInterventionDialog } from './details/delete.dialog';

@NgModule({
  declarations: [
    InterventionsFormComponent,
    InterventionsListComponent,
    InterventionDetailsComponent,
    InterventionDetailsContainerComponent,
    InterventionsTableComponent,
    InterventionsMapComponent,
    DeleteInterventionDialog,
  ],
  entryComponents: [
    DeleteInterventionDialog,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InterventionsRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBmQtE0I9s8Z8M8m73B0Er9LU9tJDt0n1s'
    }),
  ],
  providers: [
    InterventionsService
  ]
})
export class InterventionsModule { }
