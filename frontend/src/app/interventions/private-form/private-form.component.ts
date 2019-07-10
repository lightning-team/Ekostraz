import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import {ClientIntervention, InterventionFormSubmitData} from '../types';
import {InterventionsService} from '../interventions.service';

@Component({
  selector: 'app-private-intervention-form',
  templateUrl: './private-form.component.html',
  styleUrls: ['./private-form.component.scss']
})
export class PrivateFormComponent implements OnInit, OnDestroy {
  private postSubscription: Subscription | null = null;

  intervention$: Observable<ClientIntervention>;

  constructor(
      private activatedRoute: ActivatedRoute,
      private interventionsService: InterventionsService,
  ) {}

  ngOnInit() {
    this.intervention$ = this.interventionsService.getIntervention(this.activatedRoute.params).pipe(
        take(1)
    );
  }

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
