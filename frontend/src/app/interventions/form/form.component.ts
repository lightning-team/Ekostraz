import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ServerIntervention } from '../intervention';
import { InterventionsService } from '../interventions.service';
import { InterventionStatus } from '../intervention.status';
import { Subscription } from 'rxjs';

interface InterventionParams {
  interventionId: number;
}

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
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class InterventionsFormComponent implements OnInit, OnDestroy {
  private interventionId: number | null;
  private postSubscription: Subscription | null = null;

  interventionStatuses = interventionStatuses;
  inPrivateMode = false;
  interventionForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private interventionService: InterventionsService
  ) { }

  ngOnInit() {
    this.checkActivatedRoute();
    this.initializeForm();
  }

  private checkActivatedRoute() {
    this.activatedRoute.params.subscribe((params: InterventionParams) => {
      this.interventionId = params.interventionId || null;
      if (!!this.interventionId) {
        // TODO: Add authorization check whether a person is an Ekostraz worker
        // or just add a route guard to allow ekostraz workers only
        this.inPrivateMode = true;
      }
    });
  }

  private initializeForm() {
    const statusValidators = this.inPrivateMode ? [Validators.required] : [];

    this.interventionForm = this.formBuilder.group({
      date: [''],
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

  ngOnDestroy() {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }

  isInvalid(controlName: string) {
    return !this.interventionForm.get(controlName).valid
      && this.interventionForm.get(controlName).touched;
  }

  onSubmit(interventionFormValue: any) {
    if (!this.interventionForm.valid) return;

    this.postSubscription = this.interventionService.addPublicForm(this.toSeverData(interventionFormValue))
      .subscribe(
        (resp) => this.onPostSuccess(resp),
        (resp) => this.onPostError(resp),
        () => this.onComplete());
  }

  private toSeverData(interventionFormValue: any) {
    const addressString = `${interventionFormValue.address.street}, ` +
      `${interventionFormValue.address.number}, ${interventionFormValue.address.city}`;

    const transformedData = {
      Id: this.interventionId,
      CreationDate: interventionFormValue.date,
      Address: addressString,
      Email: interventionFormValue.email,
      FullName: interventionFormValue.name,
      PhoneNumber: interventionFormValue.phone,
      Status: interventionFormValue.status,
    };
    return new ServerIntervention(transformedData);
  }

  private onPostSuccess(response: any) {
    alert('Success: ' + JSON.stringify(response));
  }

  private onPostError(response: any) {
    alert('failure: ' + JSON.stringify(response));
  }

  private onComplete() {
    this.postSubscription = null;
  }
}
