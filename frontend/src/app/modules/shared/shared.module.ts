import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material';

import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [LoaderComponent],
  imports: [
      MatProgressSpinnerModule,
      CommonModule
  ],
  exports: [LoaderComponent]
})
export class SharedModule { }
