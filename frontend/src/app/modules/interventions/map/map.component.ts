import {ChangeDetectorRef, Component} from '@angular/core';
import {LoadingComponent} from '@shared/base';

import {Subject} from 'rxjs';
import {take} from 'rxjs/operators';

import {Intervention} from '../types';
import {InterventionsService} from '../interventions.service';

@Component({
  selector: 'app-interventions-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent extends LoadingComponent<Intervention[]> {
  tilesLoadedSubject = new Subject();
  afterDataLoaded$ = this.tilesLoadedSubject.asObservable().pipe(take(1));

  constructor(private interventionsService: InterventionsService, changeDetector: ChangeDetectorRef) {
    super(changeDetector);
  }

  getInitialData$() {
    return this.interventionsService.getInterventions();
  }

  onTilesLoaded() {
    this.tilesLoadedSubject.next();
  }
}
