import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTable } from '@angular/material';

import { Intervention, SortDirection, InterventionsFilter } from '@shared/domain/intervention.model';
import { InterventionsDatasource } from './interventions.datasource';
import { InterventionsService } from '../../interventions.service';
import { tap, startWith, switchMap, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { ComponentWithSubscriptions } from '@shared/components/base';
import { EkoRoutePaths } from '../../../../eko-route-paths';

@Component({
  selector: 'eko-interventions-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent extends ComponentWithSubscriptions implements AfterViewInit, OnInit {
  displayedColumns = ['position', 'name', 'status', 'phone', 'date', 'description'];
  dataSource: InterventionsDatasource;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private router: Router, private interventionsService: InterventionsService) {
    super();
  }

  showDetails(intervention: Intervention) {
    this.router.navigate([EkoRoutePaths.Interventions, intervention.id]);
  }

  ngOnInit() {
    this.dataSource = new InterventionsDatasource(this.interventionsService);
  }

  ngAfterViewInit() {
    // TODO: Workaround for https://github.com/angular/components/issues/8057
    // Remove when fixed. Debounces original ngOnDestroy way after route animation finishes.
    const tableOnDestroy = this.table.ngOnDestroy.bind(this.table);
    this.table.ngOnDestroy = () => setTimeout(tableOnDestroy, 1000);
    this.subscriptions.add(this.subscribeToSortAndPageChanges());
  }

  private subscribeToSortAndPageChanges() {
    const sort$ = this.sort.sortChange.pipe(
      tap(() => (this.paginator.pageIndex = 0)),
      startWith({ active: 'date', direction: 'desc' }),
    );
    const page$ = this.paginator.page.pipe(
      startWith({
        length: 100,
        pageIndex: 1,
        pageSize: 10,
      }),
    );
    const toFilters = ([sort, pageEvent]): InterventionsFilter => ({
      page: pageEvent.pageIndex + 1, // API first page is 1, paginator 0
      pageSize: pageEvent.pageSize,
      sortDirection: sort.direction === 'asc' ? SortDirection.Ascending : SortDirection.Descending,
    });

    combineLatest([sort$, page$])
      .pipe(
        map(toFilters),
        switchMap(filters => this.dataSource.loadInterventions$(filters)),
      )
      .subscribe();
  }
}
