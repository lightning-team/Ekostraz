import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSelectModule,
} from '@angular/material';

import { InterventionFormComponent } from './form/form.component';
import { SharedModule } from '@shared/shared.module';

const MATERIAL_IMPORTS = [
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatProgressSpinnerModule,
];

@NgModule({
  declarations: [InterventionFormComponent],
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_IMPORTS, SharedModule],
  exports: [InterventionFormComponent],
})
export class InterventionFormModule {}
