import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material';

import { InterventionFormModule } from '@interventionForm/intervention-form.module';
import { PublicFormComponent } from './public-form/public-form.component';

@NgModule({
  declarations: [PublicFormComponent],
  imports: [CommonModule, InterventionFormModule, MatSnackBarModule],
  exports: [PublicFormComponent],
})
export class PublicFormModule {}
