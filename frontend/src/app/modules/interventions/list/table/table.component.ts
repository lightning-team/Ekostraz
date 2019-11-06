import { Component, Input, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { Intervention, InterventionRouterState } from '../../types';

@Component({
  selector: 'app-interventions-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnChanges, AfterViewInit {
  displayedColumns = ['position', 'name', 'status', 'phone', 'date', 'description'];
  dataSource: MatTableDataSource<Intervention>;

  @Input() interventions: Intervention[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(private router: Router) {}

  ngOnChanges(changes: any) {
    this.checkInterventions(changes.interventions.currentValue, changes.interventions.previousValue);
  }

  private checkInterventions(currentInterventions?: Intervention[], previousInterventions?: Intervention[]) {
    if (currentInterventions !== previousInterventions) {
      this.dataSource = new MatTableDataSource<Intervention>(currentInterventions);
      this.dataSource.paginator = this.paginator;
    }
  }

  showDetails(intervention: Intervention) {
    this.router.navigate(['interwencje', intervention.id], {
      state: { intervention },
    } as InterventionRouterState);
  }

  ngAfterViewInit() {
    // TODO: Workaround for https://github.com/angular/components/issues/8057
    // Remove when fixed. Debounces original ngOnDestroy way after route animation finishes.
    const tableOnDestroy = this.table.ngOnDestroy.bind(this.table);
    this.table.ngOnDestroy = () => setTimeout(tableOnDestroy, 1000);
  }
}
