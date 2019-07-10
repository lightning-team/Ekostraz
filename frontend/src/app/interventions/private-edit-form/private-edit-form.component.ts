import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {BehaviorSubject} from 'rxjs';
import {finalize, switchMapTo, take, tap} from 'rxjs/operators';

import {ClientIntervention, InterventionFormSubmitData} from '../types';
import {InterventionsService} from '../interventions.service';
import {ComponentWithSubscriptions} from '@base';

@Component({
  selector: 'app-private-edit-intervention-form',
  templateUrl: './private-edit-form.component.html',
  styleUrls: ['./private-edit-form.component.scss']
})
export class PrivateEditFormComponent extends ComponentWithSubscriptions implements OnInit {
  intervention: ClientIntervention | null = null;
  loading$: BehaviorSubject<boolean | null> = new BehaviorSubject(true);

  constructor(
      private activatedRoute: ActivatedRoute,
      private interventionsService: InterventionsService,
  ) {
    super();
  }

  ngOnInit() {
    const intervention$ = this.interventionsService.getIntervention(this.activatedRoute.params).pipe(
        tap(intervention => this.setIntervention(intervention)),
    );

    const loadDataSubscription = this.loading$.pipe(
        take(1),
        switchMapTo(intervention$),
        finalize(() => this.finishLoading()),
    ).subscribe();

    this.subscriptions.add(loadDataSubscription);
  }

  private setIntervention(intervention: ClientIntervention) {
    this.intervention = intervention;
  }

  private finishLoading() {
    this.loading$.next(false);
    this.loading$.complete();
  }

  onSubmit(eventData: InterventionFormSubmitData) {
    const {formValue, interventionId} = eventData;
    this.subscriptions.add(
        this.interventionsService.postPrivateForm(formValue, interventionId)
    );
  }
}
