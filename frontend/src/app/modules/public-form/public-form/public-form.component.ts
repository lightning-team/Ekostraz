import { Component } from '@angular/core';

import { InterventionFormService } from '@interventionForm/service/intervention-form.service';
import { InterventionFormContainer } from '@interventionForm/form-container/form-container-base';

@Component({
  selector: 'app-public-intervention-form',
  templateUrl: './public-form.component.html',
  styleUrls: ['./public-form.component.scss'],
  providers: [InterventionFormService],
})
export class PublicFormComponent extends InterventionFormContainer {}
