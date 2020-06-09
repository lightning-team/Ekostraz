import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTable } from '@angular/material';

import { Intervention, SortDirection, InterventionsFilter } from '@shared/domain/intervention.model';
import { InterventionsDatasource } from './interventions.datasource';
import { InterventionsService } from '../../interventions.service';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';

const defaultSearchParams: InterventionsFilter = {
  pageSize: 10,
  page: 1,
  sortBy: 'creationDate',
  sortDirection: SortDirection.Descending,
};

@Component({
  selector: 'app-interventions-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterViewInit, OnInit {
  displayedColumns = ['position', 'name', 'status', 'phone', 'date', 'description'];
  dataSource: InterventionsDatasource;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private router: Router, private interventionsService: InterventionsService) {}

  showDetails(intervention: Intervention) {
    this.router.navigate(['interwencje', intervention.id]);
  }

  ngOnInit() {
    this.dataSource = new InterventionsDatasource(this.interventionsService);
    this.dataSource.loadInterventions(defaultSearchParams);
  }

  ngAfterViewInit() {
    // TODO: Workaround for https://github.com/angular/components/issues/8057
    // Remove when fixed. Debounces original ngOnDestroy way after route animation finishes.
    const tableOnDestroy = this.table.ngOnDestroy.bind(this.table);
    this.table.ngOnDestroy = () => setTimeout(tableOnDestroy, 1000);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    // this.paginator.page.pipe(tap(() => this.loadInterventionsPage())).subscribe();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadInterventionsPage()))
      .subscribe();
  }

  loadInterventionsPage() {
    // API first page is 1, paginator 0
    const page = this.paginator.pageIndex + 1;
    this.dataSource.loadInterventions({
      page,
      pageSize: this.paginator.pageSize,
      sortDirection: this.sort.direction === 'asc' ? SortDirection.Ascending : SortDirection.Descending,
    });
  }
}
