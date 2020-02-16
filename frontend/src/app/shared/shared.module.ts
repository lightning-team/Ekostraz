import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material';

import { LoaderComponent } from './components/loader/loader.component';
import { GtmScriptComponent } from './google-tag-manager/gtm-script.component';
import { GtmContextDirective } from './google-tag-manager/gtm-context.directive';
import { InterventionStatusPipe } from './pipes/intervention-status.pipe';

@NgModule({
  declarations: [GtmScriptComponent, GtmContextDirective, InterventionStatusPipe, LoaderComponent],
  imports: [MatProgressSpinnerModule, CommonModule],
  exports: [GtmScriptComponent, GtmContextDirective, InterventionStatusPipe, LoaderComponent],
})
export class SharedModule {}
