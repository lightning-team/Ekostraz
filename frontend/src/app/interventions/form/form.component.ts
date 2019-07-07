import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClientIntervention, FormInterventionData} from '../types';
import {InterventionStatus} from '../intervention.status';
import {formatDate} from '@angular/common';


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
  selector: 'app-interventions-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterventionsFormComponent implements OnInit {
  /** Flag to decide whether the form should be in extended private mode for Ekostraż workers only */
  @Input() inPrivateMode = false;
  /** Flag which turns on edit mode related text and functions */
  @Input() inEditMode = false;
  /** Intervention data to fill the form with. Consumed only in edit mode. */
  @Input() intervention: ClientIntervention | null = null;

  /** Event emitted on form submit */
  @Output() formSubmit = new EventEmitter<FormInterventionData>();

  /** Intervention status value map used for select input generation */
  interventionStatuses = interventionStatuses;
  /** Main form component displayed on the screen */
  interventionForm = this.buildForm();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    if (this.inEditMode && this.intervention) {
      this.interventionForm.patchValue(transformToFormData(this.intervention));
    }
  }

  private buildForm(): FormGroup {
    const statusValidators = this.inPrivateMode ? [Validators.required] : [];

    return this.formBuilder.group({
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

  onSubmit(formValue: FormInterventionData) {
    if (!this.interventionForm.valid) return;
    this.formSubmit.emit(formValue);
  }

  isInvalid(controlName: string) {
    return !this.interventionForm.get(controlName).valid
           && this.interventionForm.get(controlName).touched;
  }
}

/** Transforms ClientIntervention to form data */
function transformToFormData(interventionData: ClientIntervention): FormInterventionData {
  return {
    date: formatDate(interventionData.creationDate, 'medium', 'pl'),
    name: interventionData.fullName,
    description: interventionData.description,
    phone: interventionData.phone,
    email: interventionData.email,
    status: interventionData.status,
    address: transformToFormAddress(interventionData.address),
  } as FormInterventionData;
}

function transformToFormAddress(address: string) {
  const addressParts = address.split(',').map(part => part.trim());
  return {
    street: addressParts[0] || '',
    number: addressParts[1] || '',
    city: addressParts[2] || '',
  };
}
