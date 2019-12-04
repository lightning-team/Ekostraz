import { Component } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { first, map, tap } from 'rxjs/operators';

import { InterventionFormData } from '@interventionForm/types';

import { Intervention } from '../types';
import { Observable } from 'rxjs';
import { InterventionFormContainer } from '@interventionForm/form-container/form-container-base';
import { InterventionFormService } from '@interventionForm/service/intervention-form.service';
import { SnackBarManager } from '@shared/services/snack-bar-manager';
import { InterventionsService } from '../interventions.service';

@Component({
  selector: 'app-edit-intervention-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
  providers: [InterventionFormService],
})
export class EditFormComponent extends InterventionFormContainer {
  intervention: InterventionFormData;
  loading$: Observable<InterventionFormData> = this.interventionsService
    .getIntervention(this.activatedRoute.params)
    .pipe(
      map(toFormData),
      tap(formData => {
        this.intervention = formData;
      }),
      first(),
    );

  constructor(
    private activatedRoute: ActivatedRoute,
    private interventionsService: InterventionsService,
    formService: InterventionFormService,
    snackbar: SnackBarManager,
  ) {
    super(formService, snackbar);
  }
}

const toFormData = (intervention: Intervention | null): InterventionFormData =>
  intervention
    ? ({
        id: intervention.id,
        date: formatDate(intervention.creationDate, 'medium', 'pl'),
        name: intervention.fullName,
        description: intervention.description,
        phone: intervention.phone,
        email: intervention.email,
        status: intervention.status,
        address: createAddress(intervention.address),
      } as InterventionFormData)
    : null;

const createAddress = (address: string) => {
  const addressParts = address.split(',').map(part => part.trim());
  return {
    street: addressParts[0] || '',
    number: addressParts[1] || '',
    city: addressParts[2] || '',
  };
};
