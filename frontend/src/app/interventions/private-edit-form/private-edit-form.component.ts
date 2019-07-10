import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {Subscription, BehaviorSubject} from 'rxjs';
import {finalize, switchMapTo, take, tap} from 'rxjs/operators';

import {ClientIntervention, InterventionFormSubmitData} from '../types';
import {InterventionsService} from '../interventions.service';

@Component({
  selector: 'app-private-edit-intervention-form',
  templateUrl: './private-edit-form.component.html',
  styleUrls: ['./private-edit-form.component.scss']
})
export class PrivateEditFormComponent implements OnInit, OnDestroy {
  private postSubscription: Subscription | null = null;
  intervention: ClientIntervention | null = null;
  loading$: BehaviorSubject<boolean | null> = new BehaviorSubject(true);

  constructor(
      private activatedRoute: ActivatedRoute,
      private interventionsService: InterventionsService,
  ) {}

  ngOnInit() {
    const intervention$ = this.interventionsService.getIntervention(this.activatedRoute.params).pipe(
        tap(intervention => this.setIntervention(intervention)),
    );

    this.loading$.pipe(
        take(1),
        switchMapTo(intervention$),
        finalize(() => this.finishLoading()),
    ).subscribe();
  }

  private setIntervention(intervention: ClientIntervention) {
    this.intervention = intervention;
  }

  private finishLoading() {
    this.loading$.next(false);
    this.loading$.complete();
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
