import { Component, Input, ViewChild, OnChanges } from '@angular/core';
import { Intervention, InterventionRouterState } from '../../types';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-interventions-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnChanges {
  displayedColumns = ['position', 'name', 'status', 'phone', 'date', 'description'];
  dataSource: MatTableDataSource<Intervention>;

  @Input() interventions: Intervention[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

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
    this.router.navigate(
        ['interwencje', intervention.id],
        { state: {intervention}} as InterventionRouterState);
  }
}
