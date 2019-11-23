import { Component } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { first, map, tap } from 'rxjs/operators';

import { FormContainer } from '@shared/components/base';
import { InterventionFormData } from '@interventionForm/types';

import { Intervention } from '../types';
import { InterventionsService } from '../interventions.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-intervention-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
})
export class EditFormComponent extends FormContainer<InterventionFormData> {
  intervention: InterventionFormData;
  loading$: Observable<InterventionFormData> = this.interventionsService
    .getIntervention(this.activatedRoute.params)
    .pipe(
      first(),
      map(toFormData),
      tap(formData => {
        this.intervention = formData;
      }),
    );

  constructor(
    private activatedRoute: ActivatedRoute,
    private formService: InterventionsService,
    private interventionsService: InterventionsService,
  ) {
    super((formData: InterventionFormData) => this.formService.postPrivateForm(formData));
  }
}

const toFormData = (intervention: Intervention): InterventionFormData =>
  ({
    id: intervention.id,
    date: formatDate(intervention.creationDate, 'medium', 'pl'),
    name: intervention.fullName,
    description: intervention.description,
    phone: intervention.phone,
    email: intervention.email,
    status: intervention.status,
    address: createAddress(intervention.address),
  } as InterventionFormData);

const createAddress = (address: string) => {
  const addressParts = address.split(',').map(part => part.trim());
  return {
    street: addressParts[0] || '',
    number: addressParts[1] || '',
    city: addressParts[2] || '',
  };
};
