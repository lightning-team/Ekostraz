import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTooltipModule,
} from '@angular/material';

import { ConfirmationDialog } from './components/confirmation-dialog.component';
import { LoaderComponent } from './components/loader/loader.component';

import { GtmScriptComponent } from './google-tag-manager/gtm-script.component';
import { GtmContextDirective } from './google-tag-manager/gtm-context.directive';

import { InterventionStatusPipe } from './pipes/intervention-status.pipe';

const MATERIAL_IMPORTS = [
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTooltipModule,
];

@NgModule({
  declarations: [ConfirmationDialog, GtmScriptComponent, GtmContextDirective, InterventionStatusPipe, LoaderComponent],
  entryComponents: [ConfirmationDialog],
  imports: [CommonModule, ...MATERIAL_IMPORTS],
  exports: [
    GtmScriptComponent,
    GtmContextDirective,
    InterventionStatusPipe,
    LoaderComponent,
    CommonModule,
    ...MATERIAL_IMPORTS,
  ],
})
export class SharedModule {}
