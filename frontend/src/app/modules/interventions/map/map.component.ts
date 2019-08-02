import {Component} from '@angular/core';
import {LoadingComponent} from '@shared/base';

import {Intervention} from '../types';
import {InterventionsService} from '../interventions.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-interventions-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent extends LoadingComponent<Intervention[]> {
  private mapReadySubject = new Subject();
  afterDataLoaded$ = this.mapReadySubject.asObservable();

  constructor(private interventionsService: InterventionsService) {
    super();
  }

  getInitialData$() {
    return this.interventionsService.getInterventions();
  }

  onMapIdle() {
    this.hideLoaderOnFirstIdle();
  }

  private hideLoaderOnFirstIdle() {
    if (!this.mapReadySubject.isStopped) {
      this.mapReadySubject.complete();
    }
  }
}
