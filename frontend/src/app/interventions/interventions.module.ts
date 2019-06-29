import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterventionsRoutingModule } from './interventions-routing.module';
import { InterventionsFormComponent } from './form/form.component';
import {
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { InterventionsListComponent } from './list/list.component';
import { InterventionDetailsComponent } from './details/details.component';
import { HttpClientModule } from '@angular/common/http';
import { InterventionsService } from './interventions.service';

@NgModule({
  declarations: [
    InterventionsFormComponent,
    InterventionsListComponent,
    InterventionDetailsComponent,
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
    HttpClientModule,
  ],
  providers: [
    InterventionsService
  ]
})
export class InterventionsModule { }
