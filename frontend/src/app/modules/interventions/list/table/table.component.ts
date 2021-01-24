import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTable } from '@angular/material';
import { debounceTime, ignoreElements, map, startWith, tap } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

import { ComponentWithSubscriptions } from '@shared/components/base';
import { Intervention, InterventionsFilter, SortDirection } from '@shared/domain/intervention.model';
import { InterventionsDatasource } from '../interventions.datasource';
import { EkoRoutePaths } from '../../../../eko-route-paths';

@Component({
  selector: 'eko-interventions-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent extends ComponentWithSubscriptions implements AfterViewInit {
  displayedColumns = ['id', 'name', 'status', 'phone', 'date', 'description'];

  @Output() filtersChange = new EventEmitter<InterventionsFilter>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private router: Router, public dataSource: InterventionsDatasource) {
    super();
  }

  showDetails(intervention: Intervention) {
    this.router.navigate([EkoRoutePaths.Interventions, intervention.id]);
  }

  ngAfterViewInit() {
    // TODO: Workaround for https://github.com/angular/components/issues/8057
    // Remove when fixed. Debounces original ngOnDestroy way after route animation finishes.
    const tableOnDestroy = this.table.ngOnDestroy.bind(this.table);
    this.table.ngOnDestroy = () => setTimeout(tableOnDestroy, 1000);
    this.subscriptions.add(this.sortAndPageChanges$().subscribe());
  }

  private sortAndPageChanges$(): Observable<never> {
    const sort$ = this.sort.sortChange.pipe(
      tap(() => (this.paginator.pageIndex = 0)),
      startWith({ active: 'date', direction: 'desc' }),
    );
    const page$ = this.paginator.page.pipe(
      startWith({
        length: 0,
        pageIndex: 0,
        pageSize: 10,
      }),
    );
    const toFilters = ([sort, pageEvent]): InterventionsFilter => ({
      page: pageEvent.pageIndex + 1, // API first page is 1, paginator 0
      pageSize: pageEvent.pageSize,
      sortDirection: sort.direction === 'asc' ? SortDirection.Ascending : SortDirection.Descending,
    });

    return combineLatest([sort$, page$]).pipe(
      debounceTime(400),
      map(toFilters),
      tap(filters => this.filtersChange.emit(filters)),
      ignoreElements(),
    );
  }
}
