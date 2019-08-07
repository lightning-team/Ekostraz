import {ChangeDetectorRef, Component} from '@angular/core';
import {formatDate} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {EditableFormContainer} from '@shared/base';
import {InterventionFormData} from '@interventionForm/types';

import {Intervention} from '../types';
import {InterventionsService} from '../interventions.service';


@Component({
  selector: 'app-edit-intervention-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent extends EditableFormContainer<InterventionFormData> {
  constructor(private activatedRoute: ActivatedRoute,
              private interventionsService: InterventionsService,
              changeDetector: ChangeDetectorRef) {
    super(interventionsService.postPrivateForm.bind(interventionsService), changeDetector);
  }

  protected getInitialData$(): Observable<InterventionFormData> {
    return this.interventionsService.getIntervention(this.activatedRoute.params).pipe(
        map(intervention => transformToFormData(intervention)),
    );
  }
}

/** Transforms Intervention to form data */
function transformToFormData(interventionData: Intervention): InterventionFormData {
  return {
    id: interventionData.id,
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
