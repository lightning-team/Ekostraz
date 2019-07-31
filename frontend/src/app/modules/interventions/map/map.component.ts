import {Component} from '@angular/core';
import {LoadingComponent} from '@shared/base';

import {Intervention} from '../types';
import {InterventionsService} from '../interventions.service';

@Component({
  selector: 'app-interventions-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent extends LoadingComponent<Intervention[]> {
  constructor(private interventionsService: InterventionsService) {
    super();
  }

  getInitialData$() {
    return this.interventionsService.getInterventions();
  }
}
