import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';

import { of, Observable, Subscription } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

import {ClientIntervention, FormInterventionData, PostInterventionData} from '../types';
import {InterventionsService} from '../interventions.service';

@Component({
  selector: 'app-private-intervention-form',
  templateUrl: './private-form.component.html',
  styleUrls: ['./private-form.component.scss']
})
export class PrivateFormComponent implements OnInit, OnDestroy {
  private interventionId: string | null;
  private postSubscription: Subscription | null = null;

  routeState$: Observable<ClientIntervention | undefined>;
  intervention$: Observable<ClientIntervention>;

  constructor(
      private snackBar: MatSnackBar,
      private router: Router,
      private interventionService: InterventionsService,
      private activatedRoute: ActivatedRoute,
  ) {
    this.routeState$ = of(this.router.getCurrentNavigation().extras.state as ClientIntervention | undefined);
  }

  ngOnInit() {
    this.intervention$ = this.routeState$.pipe(
        switchMap(routeState => routeState ? of(routeState) : this.getIntervention()),
    );
  }

  ngOnDestroy() {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }

  private getIntervention() {
    return this.activatedRoute.params.pipe(
        map(params => params.interventionId || null),
        tap(interventionId => (this.interventionId = interventionId)),
        switchMap(interventionId => interventionId ?
            this.interventionService.getIntervention(interventionId as string) :
            of(null)
        )
    );
  }

  onSubmit(formValue: FormInterventionData) {
    this.postSubscription = this.interventionService.postPrivateForm(formValue, this.interventionId)
        .subscribe(
            (resp) => this.onPostSuccess(resp),
            (resp) => this.onPostError(resp),
            () => this.onComplete());
  }

  private onPostSuccess(response: any) {
    const snackBarRef = this.openSnackBar('Twoje zgłoszenie zostało przyjęte!', 'OK!');
    snackBarRef.afterDismissed().subscribe(() => {
      this.router.navigateByUrl('');
    });
  }

  private onPostError(response: any) {
    this.openSnackBar('Niestety, nie udało się przyjąć Twojego zgłoszenia!', 'Zamknij');
  }

  private onComplete() {
    this.postSubscription = null;
  }

  private openSnackBar(message: string, action: string) {
    return this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
    });
  }
}


