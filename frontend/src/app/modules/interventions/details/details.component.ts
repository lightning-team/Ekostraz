import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Intervention, InterventionRouterState } from '../types';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialog } from './delete.dialog';
import { InterventionsService } from '../interventions.service';
import { ComponentWithSubscriptions } from '@shared/base';

@Component({
  selector: 'app-intervention-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent extends ComponentWithSubscriptions {
  @Input() intervention: Intervention;
  @Input() embedded?: boolean;

  constructor(private router: Router, private dialog: MatDialog, private interventionService: InterventionsService) {
    super();
  }

  showDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteDialog);
    const dialogCloseSubscription = dialogRef.afterClosed().subscribe(result => this.onDialogClose(result));
    this.subscriptions.add(dialogCloseSubscription);
  }

  private onDialogClose(shouldDelete: boolean) {
    if (shouldDelete) this.deleteIntervention();
  }

  private deleteIntervention() {
    this.subscriptions.add(
        this.interventionService.delete(this.intervention.id, this.intervention.phone)
            .subscribe(() => this.router.navigate(['interwencje']))
    );
  }

  navigateToEditView() {
    this.router.navigate(
          ['interwencje', this.intervention.id, 'edytuj'],
          {state: {intervention: this.intervention}} as InterventionRouterState
        );
  }
}
