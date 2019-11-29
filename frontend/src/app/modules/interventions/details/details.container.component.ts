import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { first, tap } from 'rxjs/operators';

import { InterventionsService } from '../interventions.service';
import { Intervention } from '../types';

@Component({
  selector: 'app-intervention-details-container',
  template: `
    <app-loader [loading$]="intervention$">
      <app-intervention-details [intervention]="intervention"></app-intervention-details>
    </app-loader>
  `,
})
export class DetailsContainerComponent {
  intervention: Intervention;
  intervention$ = this.interventionsService.getIntervention(this.activatedRoute.params).pipe(
    tap(data => {
      this.intervention = data;
    }),
    first(),
  );

  constructor(private interventionsService: InterventionsService, private activatedRoute: ActivatedRoute) {}
}
