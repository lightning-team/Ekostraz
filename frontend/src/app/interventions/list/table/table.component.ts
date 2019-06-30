import { Component, Input, OnInit, ViewChild, OnChanges } from '@angular/core';
import { ClientIntervention } from '../../intervention';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-interventions-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class InterventionsTableComponent implements OnChanges {
  displayedColumns = ['position', 'name', 'status', 'phone', 'date', 'description'];
  dataSource: MatTableDataSource<ClientIntervention>;

  @Input() interventions: ClientIntervention[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private router: Router,
  ) { }

  ngOnChanges(changes: any) {
    if (changes.interventions.currentValue !== changes.interventions.previousValue) {
      this.dataSource = new MatTableDataSource<ClientIntervention>(changes.interventions.currentValue);
      this.dataSource.paginator = this.paginator;
    }
  }

  showDetails(intervention: ClientIntervention) {
    this.router.navigate(['interventions', intervention.id], { state: intervention });
  }
}
