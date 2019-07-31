import {Component} from '@angular/core';

import {FormContainer} from '@shared/base';
import {InterventionFormData} from '@interventionForm/types';

import {InterventionsService} from '../interventions.service';

@Component({
  selector: 'app-private-intervention-form',
  templateUrl: './new-form.component.html',
  styleUrls: ['./new-form.component.scss']
})
export class NewFormComponent extends FormContainer<InterventionFormData> {
  constructor(interventionsService: InterventionsService) {
    super(interventionsService.postPrivateForm.bind(interventionsService));
  }
}
