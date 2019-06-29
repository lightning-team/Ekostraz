import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterventionsRoutingModule } from './interventions-routing.module';
import { InterventionsFormComponent } from './form/form.component';

@NgModule({
  declarations: [InterventionsFormComponent],
  imports: [
    CommonModule,
    InterventionsRoutingModule
  ]
})
export class InterventionsModule { }
