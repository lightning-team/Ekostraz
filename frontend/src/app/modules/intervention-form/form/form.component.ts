import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';
import { InterventionFormData } from '../types';
import { InterventionStatus } from '@shared/domain/intervention.status';
import { Option } from '../helpers/option';

export const InterventionStatusOptions = [
  Option.of(InterventionStatus.ToVerify, 'Do weryfikacji'),
  Option.of(InterventionStatus.ActionRequired, 'Do podjęcia'),
  Option.of(InterventionStatus.InProgress, 'W toku'),
  Option.of(InterventionStatus.Closed, 'Zamknięta'),
];

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
  @Input() intervention: InterventionFormData | null = null;
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
    const formGroupConfig = {
      id: [{ value: '0', hidden: true }],
      date: [{ value: '', disabled: true }],
      name: [''],
      description: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.email],
      status: ['', this.inPrivateMode ? [Validators.required] : []],
      address: this.formBuilder.group({
        street: ['', Validators.required],
        number: ['', Validators.required],
        city: ['', Validators.required],
      }),
    };

    return this.formBuilder.group(formGroupConfig);
  }

  private isFormValid(): boolean {
    return this.form.valid;
  }
}
