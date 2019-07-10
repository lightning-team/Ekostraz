import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClientIntervention, InterventionFormData, InterventionFormSubmitData} from '../types';
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
  /** Flag to decide whether the form should be in extended private mode for Ekostraż workers only. */
  @Input() inPrivateMode = false;
  @Input() formTitle = 'Zgłoś interwencję';
  @Input() buttonText = 'Wyślij zgłoszenie';
  /** Intervention data to fill the form with. */
  @Input() intervention: ClientIntervention | null = null;

  /** Event emitted on form submit */
  @Output() formSubmit = new EventEmitter<InterventionFormSubmitData>();

  /** Intervention status value map used for select input generation */
  interventionStatuses = interventionStatuses;
  /** Main form component displayed on the screen */
  interventionForm = this.buildForm();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    if (this.intervention) {
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

  onSubmit(formValue: InterventionFormData) {
    if (!this.interventionForm.valid) return;
    const interventionId = this.intervention ? this.intervention.id : null;
    this.formSubmit.emit( {formValue, interventionId});
  }

  isInvalid(controlName: string) {
    return !this.interventionForm.get(controlName).valid
           && this.interventionForm.get(controlName).touched;
  }
}

/** Transforms ClientIntervention to form data */
function transformToFormData(interventionData: ClientIntervention): InterventionFormData {
  return {
    date: formatDate(interventionData.creationDate, 'medium', 'pl'),
    name: interventionData.fullName,
    description: interventionData.description,
    phone: interventionData.phone,
    email: interventionData.email,
    status: interventionData.status,
    address: transformToFormAddress(interventionData.address),
  } as InterventionFormData;
}

function transformToFormAddress(address: string) {
  const addressParts = address.split(',').map(part => part.trim());
  return {
    street: addressParts[0] || '',
    number: addressParts[1] || '',
    city: addressParts[2] || '',
  };
}
