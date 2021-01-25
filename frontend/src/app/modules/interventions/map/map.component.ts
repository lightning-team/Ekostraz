import { Component, Inject } from '@angular/core';

import { forkJoin, Subject } from 'rxjs';
import { first, tap } from 'rxjs/operators';

import { InterventionStatus } from '@shared/domain/intervention.status';
import { Intervention, InterventionsFilter } from '@shared/domain/intervention.model';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';

import { EkoRoutePaths } from '@app/eko-route-paths';
import { InterventionsService } from '../interventions.service';

const WROCLAW_COORDINATES = {
  lat: 51.107885,
  lng: 17.038538,
};

@Component({
  selector: 'app-interventions-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  tilesLoadedSubject = new Subject();
  interventions: Intervention[];
  interventionMapGtmContext: string;
  center = WROCLAW_COORDINATES;
  interventionsRoute = '/' + EkoRoutePaths.Interventions;

  loading$ = forkJoin(
    this.tilesLoadedSubject.asObservable().pipe(first()),
    this.interventionsService
      .getInterventions({ statuses: [InterventionStatus.ActionRequired] })
      .pipe(tap(({ results }) => (this.interventions = results))),
  );

  constructor(private interventionsService: InterventionsService, @Inject(GTM_CONTEXTS) gtmContexts) {
    this.interventionMapGtmContext = gtmContexts.interventionMap;
  }

  handleFiltersChange(event: InterventionsFilter) {
    this.interventionsService.getInterventions(event).subscribe(({ results }) => (this.interventions = results));
  }

  onTilesLoaded() {
    this.tilesLoadedSubject.next();
  }
}
