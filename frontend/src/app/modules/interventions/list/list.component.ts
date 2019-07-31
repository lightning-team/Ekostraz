import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Intervention, InterventionListRouterState, ListIntervention} from '../types';
import {InterventionsService} from '../interventions.service';
import {Router} from '@angular/router';
import {LoadingComponent} from '@shared/base';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends LoadingComponent<Intervention[], ListIntervention[]> {
  protected mapInitialData = mapToTableData;

  constructor(private router: Router, private interventionsService: InterventionsService) {
    super();
  }

  getInitialData$(): Observable<Intervention[]> {
     return this.interventionsService.fetchInterventions();
  }

  showMap(interventions: Intervention[]) {
    this.router.navigate(
        ['interwencje', 'mapa'],
        { state: {interventions} } as InterventionListRouterState);
  }
}

function mapToTableData(interventions: Intervention[]): ListIntervention[] {
  return interventions.map((intervention, index) => ({...intervention, position: index + 1}));
}
