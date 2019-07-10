import {Component} from '@angular/core';
import {ComponentWithSubscriptions} from '@shared/base';

import { InterventionFormSubmitData } from '../types';
import { InterventionsService } from '../interventions.service';

@Component({
  selector: 'app-private-intervention-form',
  templateUrl: './private-form.component.html',
  styleUrls: ['./private-form.component.scss']
})
export class PrivateFormComponent extends ComponentWithSubscriptions {
  constructor(private interventionsService: InterventionsService) {
    super();
  }

  onSubmit(eventData: InterventionFormSubmitData) {
    const {formValue, interventionId} = eventData;
    this.subscriptions.add(
        this.interventionsService.postPrivateForm(formValue, interventionId)
    );
  }
}
