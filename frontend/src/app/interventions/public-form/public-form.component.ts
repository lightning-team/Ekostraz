import {Component} from '@angular/core';
import {InterventionFormSubmitData} from '../types';
import {InterventionsService} from '../interventions.service';
import {ComponentWithSubscriptions} from '@base';

@Component({
  selector: 'app-public-intervention-form',
  templateUrl: './public-form.component.html',
  styleUrls: ['./public-form.component.scss']
})
export class PublicFormComponent extends ComponentWithSubscriptions {
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
