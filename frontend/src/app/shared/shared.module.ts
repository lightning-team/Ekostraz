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

const MATERIAL_IMPORTS = [MatIconModule, MatButtonModule];

@NgModule({
  declarations: [
    GtmScriptComponent,
    GtmContextDirective,
    InterventionStatusPipe,
    LoaderComponent,
    FileUploaderComponent,
    FileThumbComponent,
  ],
  imports: [MatProgressSpinnerModule, CommonModule, ...MATERIAL_IMPORTS],
  exports: [GtmScriptComponent, GtmContextDirective, InterventionStatusPipe, LoaderComponent, FileUploaderComponent],
})
export class SharedModule {}
