import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';

import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { SharedModule } from '@shared/shared.module';

import { InterventionFormComponent } from './form/form.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { FileThumbComponent } from './file-uploader/file-thumb/file-thumb.component';

const MATERIAL_IMPORTS = [MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule];

@NgModule({
  imports: [ReactiveFormsModule, SharedModule, ...MATERIAL_IMPORTS, RecaptchaModule, RecaptchaFormsModule],
  declarations: [InterventionFormComponent, FileUploaderComponent, FileThumbComponent],
  exports: [InterventionFormComponent],
})
export class InterventionFormModule {}
