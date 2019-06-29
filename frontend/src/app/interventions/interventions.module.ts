import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterventionsRoutingModule } from './interventions-routing.module';
import { InterventionsFormComponent } from './form/form.component';
import { MatCardModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [InterventionsFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InterventionsRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule
  ]
})
export class InterventionsModule { }
