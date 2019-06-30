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
  MatListModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { InterventionsListComponent } from './list/list.component';
import { InterventionDetailsComponent } from './details/details.component';
import { HttpClientModule } from '@angular/common/http';
import { InterventionsService } from './interventions.service';
import { InterventionsTableComponent } from './list/table/table.component';

@NgModule({
  declarations: [
    InterventionsFormComponent,
    InterventionsListComponent,
    InterventionDetailsComponent,
    InterventionsTableComponent,
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
    HttpClientModule,
  ],
  providers: [
    InterventionsService
  ]
})
export class InterventionsModule { }
