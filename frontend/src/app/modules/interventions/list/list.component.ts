import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {LoadingComponent} from '@shared/base';
import {Intervention, InterventionListRouterState, ListIntervention} from '../types';
import {InterventionsService} from '../interventions.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends LoadingComponent<ListIntervention[]> {
  constructor(private router: Router,
              private interventionsService: InterventionsService,
              changeDetector: ChangeDetectorRef) {
    super(changeDetector);
  }

  getInitialData$(): Observable<ListIntervention[]> {
     return this.interventionsService.fetchInterventions().pipe(
         map(interventions => mapToTableData(interventions))
     );
  }

  showMap() {
    this.router.navigate(
        ['interwencje', 'mapa'],
        { state: {interventions: this.initialData} } as InterventionListRouterState);
  }
}

function mapToTableData(interventions: Intervention[]): ListIntervention[] {
  return interventions.map((intervention, index) => ({...intervention, position: index + 1}));
}
