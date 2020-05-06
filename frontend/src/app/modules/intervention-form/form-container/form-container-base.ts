import { OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { finalize, switchMapTo, tap } from 'rxjs/operators';

import { SnackBarManager, SnackBarPipeConfig } from '@shared/services/snack-bar-manager';
import { FormMessages } from '@interventionForm/form-messages';

import { InterventionFormData } from '@shared/domain/intervention.model';
import { InterventionFormService } from '@interventionForm/service/intervention-form.service';

export interface SubmittableForm<SubmitDataType> {
  onSubmit(eventData: SubmitDataType);
}

export abstract class InterventionFormContainer implements OnDestroy, SubmittableForm<InterventionFormData> {
  public submitInProgress = false;

  protected submitSuccessRedirectUrl = '';
  protected subscriptions: Subscription = new Subscription();
  protected snackbarConfig: SnackBarPipeConfig = {
    successMsg: FormMessages.PostSuccess,
    errorMsg: FormMessages.PostFailed,
  };

  protected submitFormFn = (data: InterventionFormData): Observable<InterventionFormData> =>
    this.formService.post(data);

  constructor(
    protected formService: InterventionFormService,
    private snackbar: SnackBarManager,
    private router: Router,
  ) {}

  onSubmit(eventData: InterventionFormData) {
    this.subscriptions.add(
      of({})
        .pipe(
          tap(() => (this.submitInProgress = true)),
          switchMapTo(this.submitFormFn(eventData)),
          tap(() => this.router.navigateByUrl(this.submitSuccessRedirectUrl)),
          this.snackbar.successFailurePipe(this.snackbarConfig),
          finalize(() => (this.submitInProgress = false)),
        )
        .subscribe(),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
