import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { environment } from '@environment';

import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';
import { Intervention, InterventionFormData } from '@shared/domain/intervention.model';
import { InterventionStatus, InterventionStatusOptions } from '@shared/domain/intervention.status';
import { InterventionFormSubmitData } from '@interventionForm/form-container/form-container-base';
import { FileUploaderComponent } from '@interventionForm/file-uploader/file-uploader.component';

type InterventionFormGroupConfig = { [key in keyof InterventionFormData]: any };

/**
 * Main reusable form component to report and edit interventions.
 * It does not implement any API-related logic - only exposes form data through formSubmit event.
 */
@Component({
  selector: 'eko-intervention-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterventionFormComponent implements OnInit {
  @Input() formTitle = 'Zgłoś interwencję';
  @Input() buttonText = 'Wyślij zgłoszenie';
  @Input() intervention: Intervention = null;
  @Input() inPrivateMode = false;
  @Input() submitInProgress = false;
  @Input() errors: string[];

  @Output() formSubmit = new EventEmitter<InterventionFormSubmitData>();

  @ViewChild(FileUploaderComponent, { static: true }) fileUploader;

  statusOptions = InterventionStatusOptions;
  form = this.buildForm();
  formGtmContext: string;
  captchaSiteKey: string = environment.captchaSiteKey;

  constructor(private formBuilder: FormBuilder, @Inject(GTM_CONTEXTS) private gtmContexts) {}

  ngOnInit() {
    this.initGtmContext();
    this.maybePatchFormValue();
  }

  private maybePatchFormValue() {
    if (this.intervention) {
      this.form.patchValue({
        ...this.intervention,
        creationDate: formatDate(this.intervention.creationDate, 'medium', 'pl'),
      });
    }
  }

  private initGtmContext() {
    this.formGtmContext = this.inPrivateMode
      ? this.gtmContexts.privateInterventionForm
      : this.gtmContexts.publicInterventionForm;
  }

  onSubmit(formData: InterventionFormData) {
    if (this.isFormValid()) {
      this.formSubmit.emit({ formData, attachments: this.fileUploader.files });
    }
  }

  hasRequiredError(controlName: string) {
    return this.controlHasError(controlName, 'required');
  }

  hasPatternError(controlName: string) {
    this.controlHasError(controlName, 'pattern');
  }

  private controlHasError(controlName: string, errorKey: string) {
    const control = this.form.get(controlName);
    return control.touched && control.errors && control.errors[errorKey];
  }

  private buildForm(): FormGroup {
    const additionalPublicInputs = !this.inPrivateMode
      ? {
          captcha: ['', Validators.required],
        }
      : {};

    const formGroupConfig: InterventionFormGroupConfig = {
      id: [],
      creationDate: [{ value: '', disabled: true }],
      fullName: [''],
      description: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.email],
      status: [InterventionStatus.ToVerify, this.inPrivateMode ? [Validators.required] : []],
      street: ['', Validators.required],
      streetNumber: ['', Validators.required],
      city: ['', Validators.required],
      ...additionalPublicInputs,
    };

    return this.formBuilder.group(formGroupConfig);
  }

  private isFormValid(): boolean {
    return this.form.valid;
  }
}
