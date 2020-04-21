import { Component, Inject } from '@angular/core';

import { forkJoin, Subject } from 'rxjs';
import { first, tap } from 'rxjs/operators';

import { Intervention, InterventionsFilter } from '@shared/domain/intervention.model';
import { InterventionsService } from '../interventions.service';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';
import { InterventionStatus } from '@shared/domain/intervention.status';

@Component({
  selector: 'app-interventions-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  tilesLoadedSubject = new Subject();
  interventions: Intervention[];
  interventionMapGtmContext: string;
  loading$ = forkJoin(
    this.tilesLoadedSubject.asObservable().pipe(first()),
    this.interventionsService
      .getInterventions({ status: InterventionStatus.ActionRequired })
      .pipe(tap(data => (this.interventions = data))),
  );

  constructor(private interventionsService: InterventionsService, @Inject(GTM_CONTEXTS) gtmContexts) {
    this.interventionMapGtmContext = gtmContexts.interventionMap;
  }

  handleFiltersChange(event: InterventionsFilter) {
    this.interventionsService.getInterventions(event).subscribe(x => (this.interventions = x));
  }

  onTilesLoaded() {
    this.tilesLoadedSubject.next();
  }
}
