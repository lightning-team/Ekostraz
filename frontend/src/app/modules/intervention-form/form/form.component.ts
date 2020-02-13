import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';
import { InterventionStatus } from '@shared/domain/intervention.status';
import { Option } from '../helpers/option';
import { Intervention, InterventionFormData } from '@shared/domain/intervention.model';

export const InterventionStatusOptions = [
  Option.of(InterventionStatus.ToVerify, 'Do weryfikacji'),
  Option.of(InterventionStatus.ActionRequired, 'Do podjęcia'),
  Option.of(InterventionStatus.InProgress, 'W toku'),
  Option.of(InterventionStatus.Closed, 'Zamknięta'),
];

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

  isControlInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return !control.valid && control.touched;
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
