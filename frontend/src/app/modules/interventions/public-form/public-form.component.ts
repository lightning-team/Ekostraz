import {Component} from '@angular/core';
import {FormContainer} from '@shared/base';

import {InterventionFormSubmitData} from '../types';
import {InterventionsService} from '../interventions.service';

@Component({
  selector: 'app-public-intervention-form',
  templateUrl: './public-form.component.html',
  styleUrls: ['./public-form.component.scss']
})
export class PublicFormComponent extends FormContainer<InterventionFormSubmitData> {
  constructor(interventionsService: InterventionsService) {
    super(interventionsService.postPrivateForm.bind(interventionsService));
  }
}
