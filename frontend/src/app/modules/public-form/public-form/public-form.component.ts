import {Component} from '@angular/core';
import {FormContainer} from '@shared/base';

import {InterventionFormData} from '@interventionForm/types';
import {PublicFormService} from '../service/public-form.service';

@Component({
  selector: 'app-public-intervention-form',
  templateUrl: './public-form.component.html',
  styleUrls: ['./public-form.component.scss'],
  providers: [PublicFormService],
})
export class PublicFormComponent extends FormContainer<InterventionFormData> {
  constructor(formService: PublicFormService) {
    super(formService.postPublicForm.bind(formService));
  }
}
