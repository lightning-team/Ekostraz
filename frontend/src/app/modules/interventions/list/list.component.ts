import { Component, Inject } from '@angular/core';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';
import { InterventionsDatasource } from './interventions.datasource';
import { InterventionsFilter } from '@shared/domain/intervention.model';

@Component({
  selector: 'eko-interventions-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [InterventionsDatasource],
})
export class ListComponent {
  interventionsListGtmContext: string;
  showFilters = false;

  constructor(@Inject(GTM_CONTEXTS) gtmContexts, public dataSource: InterventionsDatasource) {
    this.interventionsListGtmContext = gtmContexts.interventionList;
  }

  filtersChanged(filters: InterventionsFilter) {
    const prevFilters = this.dataSource.filtersSubject.getValue();
    this.dataSource.filtersSubject.next({ ...prevFilters, ...filters });
  }
}
