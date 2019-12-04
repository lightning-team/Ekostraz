import { OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { SnackBarManager, SnackBarPipeConfig } from '@shared/services/snack-bar-manager';
import { InterventionFormData } from '@interventionForm/types';
import { FormMessages } from '@interventionForm/form-messages';

import { InterventionFormService } from '@interventionForm/service/intervention-form.service';

export interface SubmittableForm<SubmitDataType> {
  onSubmit(eventData: SubmitDataType);
}

export abstract class InterventionFormContainer implements OnDestroy, SubmittableForm<InterventionFormData> {
  protected subscriptions: Subscription = new Subscription();
  protected snackbarConfig: SnackBarPipeConfig = {
    successMsg: FormMessages.PostSuccess,
    errorMsg: FormMessages.PostFailed,
  };

  protected submitFormFn = (data: InterventionFormData): Observable<InterventionFormData> =>
    this.formService.post(data);

  constructor(protected formService: InterventionFormService, private snackbar: SnackBarManager) {}

  onSubmit(eventData: InterventionFormData) {
    this.subscriptions.add(
      this.submitFormFn(eventData)
        .pipe(this.snackbar.successFailurePipe(this.snackbarConfig))
        .subscribe(),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
