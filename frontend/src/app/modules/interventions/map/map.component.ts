import {ChangeDetectorRef, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {AgmMap, GoogleMapsAPIWrapper} from '@agm/core';
import {LoadingComponent} from '@shared/base';

import {Observable, of, Subject} from 'rxjs';
import {switchMapTo, take, tap} from 'rxjs/operators';

import {Intervention} from '../types';
import {InterventionsService} from '../interventions.service';

@Component({
  selector: 'app-interventions-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent extends LoadingComponent<Intervention[]> {
  private mapReadySubject = new Subject();
  // TODO: This is a work-around for missing GoogleMaps API 'tilesloaded' event.
  // Remove when AgmMaps exposes 'tilesloaded' event in its component API.
  afterDataLoaded$ = this.waitForMapTilesLoaded();

  @ViewChild(AgmMap, {static: false, read: ViewContainerRef}) agmMap: ViewContainerRef;

  constructor(private interventionsService: InterventionsService, private changeDetector: ChangeDetectorRef) {
    super();
  }

  getInitialData$() {
    return this.interventionsService.getInterventions();
  }

  private waitForMapTilesLoaded(): Observable<any> {
    return of(null).pipe(
        // ViewChild agmMap will be initialized only after change detection run.
        tap(() => this.changeDetector.detectChanges()),
        tap(() => this.attachTilesLoadedListener()),
        switchMapTo(this.mapReadySubject.asObservable()),
    );
  }

  private attachTilesLoadedListener() {
    const mapsAPIWrapper = this.agmMap.injector.get(GoogleMapsAPIWrapper);
    const tilesloaded$ = mapsAPIWrapper.subscribeToMapEvent('tilesloaded');
    tilesloaded$.pipe(
        take(1),
        tap(this.hideLoader.bind(this))
    ).subscribe();
  }

  private hideLoader() {
    if (!this.mapReadySubject.isStopped) {
      this.mapReadySubject.complete();
    }
  }
}
