import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';
import { Intervention, InterventionFormData } from '@shared/domain/intervention.model';
import { InterventionStatusOptions } from '@shared/domain/intervention.status';

type InterventionFormGroupConfig = { [key in keyof InterventionFormData]: any };

/**
 * Main reusable form component to report and edit interventions.
 * It does not implement any API-related logic - only exposes form data through formSubmit event.
 */
@Component({
  selector: 'app-intervention-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterventionFormComponent implements OnInit {
  @Input() formTitle = 'Zgłoś interwencję';
  @Input() buttonText = 'Wyślij zgłoszenie';
  @Input() intervention: Intervention = null;
  @Input() inPrivateMode = false;

  @Output() formSubmit = new EventEmitter<InterventionFormData>();

  statusOptions = InterventionStatusOptions;
  form = this.buildForm();
  formGtmContext: string;

  constructor(private formBuilder: FormBuilder, @Inject(GTM_CONTEXTS) private gtmContexts) {}

  ngOnInit() {
    this.initGtmContext();
    this.maybePatchFormValue();
  }

  private maybePatchFormValue() {
    if (this.intervention) {
      this.form.patchValue(this.intervention);
    }
  }

  private initGtmContext() {
    this.formGtmContext = this.inPrivateMode
      ? this.gtmContexts.privateInterventionForm
      : this.gtmContexts.publicInterventionForm;
  }

  onSubmit(formValue: InterventionFormData) {
    if (this.isFormValid()) {
      this.formSubmit.emit(formValue);
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
    const formGroupConfig: InterventionFormGroupConfig = {
      id: [],
      creationDate: [{ value: '', disabled: true }],
      fullName: [''],
      description: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.email],
      status: ['', this.inPrivateMode ? [Validators.required] : []],
      street: ['', Validators.required],
      streetNumber: ['', Validators.required],
      city: ['', Validators.required],
    };

    return this.formBuilder.group(formGroupConfig);
  }

  private isFormValid(): boolean {
    return this.form.valid;
  }
}
