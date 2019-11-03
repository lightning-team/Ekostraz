import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {LoadingComponent} from '@shared/base';

import {Subject} from 'rxjs';
import {take} from 'rxjs/operators';

import {Intervention} from '../types';
import {InterventionsService} from '../interventions.service';
import {GTM_CONTEXTS} from '../../shared/google-tag-manager/gtm-contexts';

@Component({
  selector: 'app-interventions-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent extends LoadingComponent<Intervention[]> {
  tilesLoadedSubject = new Subject();
  afterDataLoaded$ = this.tilesLoadedSubject.asObservable().pipe(take(1));
  interventionMap: string;

  constructor(
      private interventionsService: InterventionsService,
      changeDetector: ChangeDetectorRef,
      @Inject(GTM_CONTEXTS) gtmContexts,
  ) {
    super(changeDetector);
    this.interventionMap = gtmContexts.interventionMap;
  }

  getInitialData$() {
    return this.interventionsService.getInterventions();
  }

  onTilesLoaded() {
    this.tilesLoadedSubject.next();
  }
}
