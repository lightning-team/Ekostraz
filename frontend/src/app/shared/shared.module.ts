import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material';

import { LoaderComponent } from './components/loader/loader.component';
import { GtmContextDirective } from './google-tag-manager/gtm-context.directive';

@NgModule({
  declarations: [LoaderComponent, GtmContextDirective],
  imports: [MatProgressSpinnerModule, CommonModule],
  exports: [LoaderComponent, GtmContextDirective],
})
export class SharedModule {}
