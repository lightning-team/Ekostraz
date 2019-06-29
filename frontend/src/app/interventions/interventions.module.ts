import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterventionsRoutingModule } from './interventions-routing.module';
import { InterventionsFormComponent } from './form/form.component';
import { MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InterventionsService } from './interventions.service';

@NgModule({
  declarations: [InterventionsFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InterventionsRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatButtonModule
  ], 
  providers: [
    InterventionsService
  ]
})
export class InterventionsModule { }
