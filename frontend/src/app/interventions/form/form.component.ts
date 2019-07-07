import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClientIntervention} from '../intervention';
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

@Component({
  selector: 'app-interventions-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterventionsFormComponent implements OnInit {
  @Input() inPrivateMode = false;
  @Input() intervention: ClientIntervention | null = null;
  @Output() formSubmit = new EventEmitter<any>();

  inEditMode = false;
  interventionStatuses = interventionStatuses;
  interventionForm = this.buildForm();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.inEditMode = !!this.intervention;
    if (this.intervention) {
      this.interventionForm.patchValue(getFormDataFrom(this.intervention));
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

  onSubmit(formValue: any) {
    if (!this.interventionForm.valid) {
      return;
    } else {
      this.formSubmit.emit(formValue);
    }
  }

  isInvalid(controlName: string) {
    return !this.interventionForm.get(controlName).valid
      && this.interventionForm.get(controlName).touched;
  }
}

function getFormDataFrom(interventionData: ClientIntervention) {
  return {
    date: formatDate(interventionData.date, 'medium', 'pl'),
    name: interventionData.name,
    description: interventionData.description,
    phone: interventionData.phone,
    email: interventionData.email,
    status: interventionData.status,
    address: getFormAddress(interventionData.address),
  };
}

function getFormAddress(address: string) {
  const split = address.split(',');
  return {
    street: split[0],
    number: split[1],
    city: split[2],
  };
}
