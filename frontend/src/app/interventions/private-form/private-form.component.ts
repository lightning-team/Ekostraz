import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';

import { of, Observable, Subscription } from 'rxjs';
import {take, map, switchMap} from 'rxjs/operators';

import {ClientIntervention, ServerIntervention} from '../intervention';
import {InterventionsService} from '../interventions.service';

@Component({
  selector: 'app-private-intervention-form',
  templateUrl: './private-form.component.html',
  styleUrls: ['./private-form.component.scss']
})
export class PrivateFormComponent implements OnInit, OnDestroy {
  private interventionId: string | null;
  private postSubscription: Subscription | null = null;

  intervention$: Observable<ClientIntervention>;

  constructor(
      private snackBar: MatSnackBar,
      private router: Router,
      private interventionService: InterventionsService,
      private activatedRoute: ActivatedRoute,
  ) {
    const currentNavigation = this.router.getCurrentNavigation();
    this.intervention$ = currentNavigation ? of(currentNavigation.extras.state as ClientIntervention) : null;
  }

  ngOnInit() {
    if (!this.intervention$) {
      this.intervention$ = this.getIntervention();
    }
  }

  ngOnDestroy() {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }

  onSubmit(formValue: any) {
    this.postSubscription = this.interventionService.addPublicForm(this.toServerData(formValue))
        .subscribe(
            (resp) => this.onPostSuccess(resp),
            (resp) => this.onPostError(resp),
            () => this.onComplete());
  }

  private toServerData(interventionFormValue: any) {
    const addressString = `${interventionFormValue.address.street}, ` +
        `${interventionFormValue.address.number}, ${interventionFormValue.address.city}`;

    const transformedData = {
      id: this.interventionId,
      creationDate: interventionFormValue.date,
      address: addressString,
      email: interventionFormValue.email,
      fullName: interventionFormValue.name,
      phoneNumber: interventionFormValue.phone,
      status: interventionFormValue.status,
      description: interventionFormValue.description
    };
    return new ServerIntervention(transformedData);
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

  private getIntervention() {
    return this.activatedRoute.params.pipe(
        take(1),
        map(params => params.interventionId || null),
        switchMap(interventionId => interventionId ?
                this.interventionService.getIntervention(this.interventionId) :
                of(null)
        )
    );
  }
}


