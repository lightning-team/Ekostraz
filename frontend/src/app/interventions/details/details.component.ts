import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ClientIntervention } from '../intervention';
import { MatDialog } from '@angular/material/dialog';
import { DeleteInterventionDialog } from './delete.dialog';
import { InterventionsService } from '../interventions.service'

@Component({
  selector: 'app-intervention-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class InterventionDetailsComponent {
  @Input() intervention: ClientIntervention;
  @Input() miniVersion?: boolean;

  constructor(private router: Router, private dialog: MatDialog, private interventionService: InterventionsService) { }

  showDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteInterventionDialog);
    dialogRef.afterClosed().subscribe(result => this.onDialogClose(result));
  }

  private onDialogClose(result: boolean) {
    if (!!result) {
      this.interventionService.deleteRequest(this.intervention.id, this.intervention.phone).subscribe();
    }
  }

  navigateToEditView() {
    this.router.navigate(['interventions', this.intervention.id, 'edit'], { state: this.intervention });
  }
}
