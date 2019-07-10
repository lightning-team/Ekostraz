import { Component, OnInit } from '@angular/core';
import { Observable} from 'rxjs';
import { Intervention, InterventionListRouterState, ListIntervention } from '../types';
import { InterventionsService } from '../interventions.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class InterventionsListComponent implements OnInit {
  interventions$: Observable<ListIntervention[]>;

  constructor(
    private router: Router,
    private interventionsService: InterventionsService,
  ) {}

  ngOnInit() {
    this.interventions$ = this.interventionsService.fetchInterventions().pipe(
        map(interventions => interventions.map(mapToTableData)),
    );
  }

  showMap(interventions: Intervention[]) {
    this.router.navigate(
        ['interwencje', 'mapa'],
        { state: {interventions} } as InterventionListRouterState);
  }
}

function mapToTableData(intervention: Intervention, index: number): ListIntervention {
  return {...intervention, position: index + 1};
}
