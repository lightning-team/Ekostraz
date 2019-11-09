import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material';

import { LoaderComponent } from './components/loader/loader.component';
import { GtmScriptComponent } from './google-tag-manager/gtm-script.component';
import { GtmContextDirective } from './google-tag-manager/gtm-context.directive';

@NgModule({
  declarations: [LoaderComponent, GtmScriptComponent, GtmContextDirective],
  imports: [MatProgressSpinnerModule, CommonModule],
  exports: [LoaderComponent, GtmScriptComponent, GtmContextDirective],
})
export class SharedModule {}
