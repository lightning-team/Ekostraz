import {ChangeDetectorRef, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {AgmMap, GoogleMapsAPIWrapper} from '@agm/core';
import {LoadingComponent} from '@shared/base';

import {Observable} from 'rxjs';
import {exhaustMap, take} from 'rxjs/operators';

import {Intervention} from '../types';
import {InterventionsService} from '../interventions.service';

@Component({
  selector: 'app-interventions-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent extends LoadingComponent<Intervention[]> {
  afterDataLoaded$ = this.waitForMapTilesLoaded();

  @ViewChild(AgmMap, {static: false, read: ViewContainerRef}) agmMap: ViewContainerRef;

  constructor(private interventionsService: InterventionsService, changeDetector: ChangeDetectorRef) {
    super(changeDetector);
  }

  getInitialData$() {
    return this.interventionsService.getInterventions();
  }

  private waitForMapTilesLoaded(): Observable<any> {
    return this.afterDataLoaded$.pipe(
        exhaustMap(() => this.attachTilesLoadedListener()),
        take(1)
    );
  }

  /**
   * TODO: This is a work-around for missing GoogleMaps API 'tilesloaded' event.
   * Remove when AgmMaps exposes 'tilesloaded' event in its component API.
   */
  private attachTilesLoadedListener() {
    const mapsAPIWrapper = this.agmMap.injector.get(GoogleMapsAPIWrapper);
    const tilesloaded$ = mapsAPIWrapper.subscribeToMapEvent('tilesloaded');
    return tilesloaded$.pipe(take(1));
  }
}
