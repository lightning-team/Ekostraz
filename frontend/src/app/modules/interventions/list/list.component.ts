import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';
import { InterventionsDatasource } from './interventions.datasource';
import { EkoRoutePaths } from '../../../eko-route-paths';
import { InterventionsRoutePaths } from '../interventions-routing.module';

@Component({
  selector: 'eko-interventions-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [InterventionsDatasource],
})
export class ListComponent {
  interventionsListGtmContext: string;

  constructor(private router: Router, @Inject(GTM_CONTEXTS) gtmContexts) {
    this.interventionsListGtmContext = gtmContexts.interventionList;
  }

  showMap() {
    this.router.navigate([EkoRoutePaths.Interventions, InterventionsRoutePaths.Map]);
  }
}
