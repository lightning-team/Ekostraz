import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {Router} from '@angular/router';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {LoadingComponent} from '@shared/base';
import {Intervention, InterventionListRouterState, ListIntervention} from '../types';
import {InterventionsService} from '../interventions.service';
import {GTM_CONTEXTS} from '../../shared/google-tag-manager/gtm-contexts';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends LoadingComponent<ListIntervention[]> {
  interventionsListGtmContext: string;

  constructor(private router: Router,
              private interventionsService: InterventionsService,
              @Inject(GTM_CONTEXTS) gtmContexts,
              changeDetector: ChangeDetectorRef) {
    super(changeDetector);
    this.interventionsListGtmContext = gtmContexts.interventionList;
  }

  getInitialData$(): Observable<ListIntervention[]> {
     return this.interventionsService.fetchInterventions().pipe(
         map(toTableData)
     );
  }

  showMap() {
    this.router.navigate(
        ['interwencje', 'mapa'],
        { state: {interventions: this.initialData} } as InterventionListRouterState);
  }
}

function toTableData(interventions: Intervention[]): ListIntervention[] {
  return interventions.map((intervention, index) => ({...intervention, position: index + 1}));
}
