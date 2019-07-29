import {Component} from '@angular/core';

import {FormContainer} from '@shared/base';
import {InterventionFormData} from '@interventionForm/types';

import {InterventionsService} from '../interventions.service';

@Component({
  selector: 'app-private-intervention-form',
  templateUrl: './private-form.component.html',
  styleUrls: ['./private-form.component.scss']
})
export class PrivateFormComponent extends FormContainer<InterventionFormData> {
  constructor(interventionsService: InterventionsService) {
    super(interventionsService.postPrivateForm.bind(interventionsService));
  }
}
