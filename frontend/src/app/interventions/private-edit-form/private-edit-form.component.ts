import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {Subscription, BehaviorSubject, Observable} from 'rxjs';
import {finalize, tap } from 'rxjs/operators';

import {ClientIntervention, InterventionFormSubmitData} from '../types';
import {InterventionsService} from '../interventions.service';

@Component({
  selector: 'app-private-edit-intervention-form',
  templateUrl: './private-edit-form.component.html',
  styleUrls: ['./private-edit-form.component.scss']
})
export class PrivateEditFormComponent implements OnInit, OnDestroy {
  private postSubscription: Subscription | null = null;
  intervention: ClientIntervention;

  loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  intervention$: Observable<ClientIntervention | null>;

  constructor(
      private activatedRoute: ActivatedRoute,
      private interventionsService: InterventionsService,
  ) {}

  ngOnInit() {
    this.intervention$ = this.interventionsService.getIntervention(this.activatedRoute.params).pipe(
        tap(val => this.updateIntervention(val)),
        finalize(() => this.finishLoading()),
    );
  }

  private finishLoading() {
    this.loading$.next(false);
    this.loading$.complete();
  }

  private updateIntervention(intervention: ClientIntervention|null) {
    this.intervention = intervention;
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
