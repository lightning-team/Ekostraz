import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material';

import { LoaderComponent } from './components/loader/loader.component';
import { GtmScriptComponent } from './google-tag-manager/gtm-script.component';
import { GtmContextDirective } from './google-tag-manager/gtm-context.directive';
import { InterventionStatusPipe } from './pipes/intervention-status.pipe';
import { FileUploaderComponent } from '@interventionForm/file-uploader/file-uploader.component';
import { FileThumbComponent } from '@interventionForm/file-uploader/file-thumb/file-thumb.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialog } from '@shared/components/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

const MATERIAL_IMPORTS = [MatIconModule, MatButtonModule, MatDialogModule];

@NgModule({
  declarations: [
    ConfirmationDialog,
    FileUploaderComponent,
    FileThumbComponent,
    GtmScriptComponent,
    GtmContextDirective,
    InterventionStatusPipe,
    LoaderComponent,
  ],
  entryComponents: [ConfirmationDialog],
  imports: [MatProgressSpinnerModule, CommonModule, ...MATERIAL_IMPORTS],
  exports: [GtmScriptComponent, GtmContextDirective, InterventionStatusPipe, LoaderComponent, FileUploaderComponent],
})
export class SharedModule {}
