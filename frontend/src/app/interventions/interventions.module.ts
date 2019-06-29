import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterventionsRoutingModule } from './interventions-routing.module';
import { InterventionsFormComponent } from './form/form.component';
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
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { InterventionsListComponent } from './list/list.component';
import { InterventionDetailsComponent } from './details/details.component';
import { HttpClientModule } from '@angular/common/http';
import { InterventionsService } from './interventions.service';
import { InterventionsTableComponent } from './list/table/table.component';
import { InterventionsMapComponent } from './list/map/map.component';

@NgModule({
  declarations: [
    InterventionsFormComponent,
    InterventionsListComponent,
    InterventionDetailsComponent,
    InterventionsTableComponent,
    InterventionsMapComponent,
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
    HttpClientModule,
  ],
  providers: [
    InterventionsService
  ]
})
export class InterventionsModule { }
