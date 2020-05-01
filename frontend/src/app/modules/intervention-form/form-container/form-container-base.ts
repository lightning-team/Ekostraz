import { OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { concatMap, finalize, last, pluck, switchMapTo, tap } from 'rxjs/operators';

import { SnackBarManager, SnackBarPipeConfig } from '@shared/services/snack-bar-manager';
import { FormMessages } from '@interventionForm/form-messages';

import { InterventionFormData } from '@shared/domain/intervention.model';
import { InterventionFormService } from '@interventionForm/service/intervention-form.service';

export interface SubmittableForm<SubmitDataType> {
  onSubmit(eventData: SubmitDataType);
}

export interface InterventionFormSubmitData {
  formData: InterventionFormData;
  attachments: File[];
}

export abstract class InterventionFormContainer implements OnDestroy, SubmittableForm<InterventionFormSubmitData> {
  public submitInProgress = false;

  protected submitSuccessRedirectUrl = '';
  protected subscriptions: Subscription = new Subscription();
  protected snackbarConfig: SnackBarPipeConfig = {
    successMsg: FormMessages.PostSuccess,
    errorMsg: FormMessages.PostFailed,
  };

  protected submitFormFn = (data: InterventionFormData): Observable<{ id: string }> => this.formService.post(data);

  constructor(
    protected formService: InterventionFormService,
    private snackbar: SnackBarManager,
    private router: Router,
  ) {}

  onSubmit({ formData, attachments }) {
    this.subscriptions.add(
      of({})
        .pipe(
          tap(() => (this.submitInProgress = true)),
          switchMapTo(this.submitFormFn(formData).pipe(pluck('id'))),
          concatMap((id: string) =>
            this.formService.uploadAttachments(id, attachments).pipe(
              // TODO: Add error handling and partial progress info for each file upload request
              last(),
            ),
          ),
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
