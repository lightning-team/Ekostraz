import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { first, tap } from 'rxjs/operators';

import { Intervention } from '@shared/domain/intervention.model';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';

import { InterventionsService } from '../interventions.service';

@Component({
  selector: 'eko-intervention-details-container',
  template: `
    <eko-loader [loading$]="intervention$">
      <eko-intervention-details [intervention]="intervention" [withGtmContext]="gtmContexts.interventionDetails">
      </eko-intervention-details>
    </eko-loader>
  `,
})
export class DetailsContainerComponent {
  intervention: Intervention;
  intervention$ = this.interventionsService.getIntervention(this.activatedRoute.snapshot.params.interventionId).pipe(
    tap(data => {
      this.intervention = data;
    }),
    first(),
  );

  constructor(
    private interventionsService: InterventionsService,
    private activatedRoute: ActivatedRoute,
    @Inject(GTM_CONTEXTS) public gtmContexts,
  ) {}
}
