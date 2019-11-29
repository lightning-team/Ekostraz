import { Component, Inject } from '@angular/core';

import { Subject } from 'rxjs';
import { first, switchMapTo, tap } from 'rxjs/operators';

import { Intervention } from '../types';
import { InterventionsService } from '../interventions.service';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';

@Component({
  selector: 'app-interventions-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  tilesLoadedSubject = new Subject();
  interventions: Intervention[];
  interventionMapGtmContext: string;

  loading$ = this.interventionsService.getInterventions().pipe(
    tap(data => {
      this.interventions = data;
    }),
    switchMapTo(this.tilesLoadedSubject.asObservable().pipe(first())),
  );

  constructor(private interventionsService: InterventionsService, @Inject(GTM_CONTEXTS) gtmContexts) {
    this.interventionMapGtmContext = gtmContexts.interventionMap;
  }

  onTilesLoaded() {
    this.tilesLoadedSubject.next();
  }
}
