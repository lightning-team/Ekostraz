import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '@shared/base';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { InterventionsService } from '../interventions.service';
import { Intervention } from '../types';

@Component({
  selector: 'app-intervention-details-container',
  template: `
    <app-loader [loading$]="loading$">
      <app-intervention-details [intervention]="initialData"></app-intervention-details>
    </app-loader>
  `,
})
export class DetailsContainerComponent extends LoadingComponent<Intervention> {
  constructor(
    private interventionsService: InterventionsService,
    private activatedRoute: ActivatedRoute,
    changeDetector: ChangeDetectorRef,
  ) {
    super(changeDetector);
  }

  getInitialData$(): Observable<Intervention> {
    return this.interventionsService.getIntervention(this.activatedRoute.params).pipe(take(1));
  }
}
