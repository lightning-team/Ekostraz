import { Component } from '@angular/core';

import { InterventionFormService } from '@interventionForm/service/intervention-form.service';
import { InterventionFormContainer } from '@interventionForm/form-container/form-container-base';

@Component({
  selector: 'eko-private-intervention-form',
  templateUrl: './new-form.component.html',
  styleUrls: ['./new-form.component.scss'],
  providers: [InterventionFormService],
})
export class NewFormComponent extends InterventionFormContainer {
  submitSuccessRedirectUrl = '/interwencje';
}
