import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { InterventionStatus } from '@shared/intervention.status';
import { InterventionFormData } from '../types';
import { GTM_CONTEXTS } from '../../shared/google-tag-manager/gtm-contexts';

const interventionStatuses = [
  {
    value: InterventionStatus.ToVerify,
    viewValue: 'Do weryfikacji',
  },
  {
    value: InterventionStatus.ActionRequired,
    viewValue: 'Do podjęcia',
  },
  {
    value: InterventionStatus.InProgress,
    viewValue: 'W toku',
  },
  {
    value: InterventionStatus.Closed,
    viewValue: 'Zamknięta',
  },
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
  /** Flag to decide whether the form should be in extended private mode for Ekostraż workers only. */
  @Input() inPrivateMode = false;
  @Input() formTitle = 'Zgłoś interwencję';
  @Input() buttonText = 'Wyślij zgłoszenie';
  /** Intervention data to fill the form with. */
  @Input() intervention: InterventionFormData | null = null;
  @Output() formSubmit = new EventEmitter<InterventionFormData>();
  interventionStatuses = interventionStatuses;
  interventionForm = this.buildForm();
  interventionFormGtmContext: string;

  constructor(private formBuilder: FormBuilder, @Inject(GTM_CONTEXTS) private gtmContexts) {}

  ngOnInit() {
    this.initGtmContext();
    this.maybePatchFormValue();
  }

  private maybePatchFormValue() {
    if (this.intervention) {
      this.interventionForm.patchValue(this.intervention);
    }
  }

  private initGtmContext() {
    this.interventionFormGtmContext = this.inPrivateMode
      ? this.gtmContexts.privateInterventionForm
      : this.gtmContexts.publicInterventionForm;
  }

  private buildForm(): FormGroup {
    const statusValidators = this.inPrivateMode ? [Validators.required] : [];

    return this.formBuilder.group({
      id: [{ value: '0', hidden: true }],
      date: [{ value: '', disabled: true }],
      name: [''],
      description: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.email],
      status: ['', ...statusValidators],
      address: this.formBuilder.group({
        street: ['', Validators.required],
        number: ['', Validators.required],
        city: ['', Validators.required],
      }),
    });
  }

  onSubmit(formValue: InterventionFormData) {
    if (!this.isFormValid()) return;
    this.formSubmit.emit(formValue);
  }

  isControlInvalid(controlName: string) {
    return !this.interventionForm.get(controlName).valid && this.interventionForm.get(controlName).touched;
  }

  private isFormValid(): boolean {
    return this.interventionForm.valid;
  }
}
