import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';

import { Intervention } from '@shared/domain/intervention.model';
import { InterventionFormContainer } from '@interventionForm/form-container/form-container-base';
import { InterventionFormService } from '@interventionForm/service/intervention-form.service';
import { SnackBarManager } from '@shared/services/snack-bar-manager';
import { InterventionsService } from '../interventions.service';

@Component({
  selector: 'app-edit-intervention-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
  providers: [InterventionFormService],
})
export class EditFormComponent extends InterventionFormContainer {
  private interventionId = this.activatedRoute.snapshot.params.interventionId;

  intervention: Intervention;
  submitSuccessRedirectUrl = '/interwencje/' + this.interventionId;

  loading$: Observable<Intervention> = this.interventionsService.getIntervention(this.interventionId).pipe(
    map(intervention => intervention || null),
    tap(formData => {
      this.intervention = formData;
    }),
    first(),
  );

  submitFormFn = formData => this.formService.update(formData);

  constructor(
    private activatedRoute: ActivatedRoute,
    private interventionsService: InterventionsService,
    router: Router,
    formService: InterventionFormService,
    snackbar: SnackBarManager,
  ) {
    super(formService, snackbar, router);
  }
}
