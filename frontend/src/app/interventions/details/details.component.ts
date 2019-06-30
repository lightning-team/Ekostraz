import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ClientIntervention } from '../intervention';
import { MatDialog } from '@angular/material/dialog';
import { DeleteInterventionDialog } from './delete.dialog';

@Component({
  selector: 'app-intervention-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class InterventionDetailsComponent {
  @Input() intervention: ClientIntervention;
  @Input() miniVersion?: boolean;

  constructor(private router: Router, private dialog: MatDialog) { }

  showDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteInterventionDialog);
    dialogRef.afterClosed().subscribe(result => this.onDialogClose(result));
  }

  private onDialogClose(result: boolean) {
    if (!!result) {
      // TODO: Connect delete action from the service
    }
  }

  navigateToEditView() {
    this.router.navigate(['interventions', this.intervention.id, 'edit'], { state: this.intervention });
  }
}
