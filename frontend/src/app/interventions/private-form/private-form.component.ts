import {Component} from '@angular/core';
import {FormContainer} from '@shared/base';

import {InterventionFormSubmitData} from '../types';
import {InterventionsService} from '../interventions.service';

@Component({
  selector: 'app-private-intervention-form',
  templateUrl: './private-form.component.html',
  styleUrls: ['./private-form.component.scss']
})
export class PrivateFormComponent extends FormContainer<InterventionFormSubmitData> {
  constructor(interventionsService: InterventionsService) {
    super(interventionsService.postPrivateForm.bind(interventionsService));
  }
}
