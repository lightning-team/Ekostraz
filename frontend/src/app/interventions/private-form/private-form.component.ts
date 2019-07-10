import {Component, OnDestroy} from '@angular/core';

import { Subscription } from 'rxjs';

import { InterventionFormSubmitData } from '../types';
import { InterventionsService } from '../interventions.service';

@Component({
  selector: 'app-private-intervention-form',
  templateUrl: './private-form.component.html',
  styleUrls: ['./private-form.component.scss']
})
export class PrivateFormComponent implements OnDestroy {
  private postSubscription: Subscription | null = null;

  constructor(private interventionsService: InterventionsService) {}

  ngOnDestroy() {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
      this.postSubscription = null;
    }
  }

  onSubmit(eventData: InterventionFormSubmitData) {
    const {formValue, interventionId} = eventData;
    this.postSubscription = this.interventionsService.postPrivateForm(formValue, interventionId);
  }
}
