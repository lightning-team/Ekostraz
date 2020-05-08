import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Attachment, Intervention } from '@shared/domain/intervention.model';
import { ComponentWithSubscriptions } from '@shared/components/base';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';
import { DeleteDialog } from './delete.dialog';

@Component({
  selector: 'eko-intervention-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent extends ComponentWithSubscriptions {
  @Input() intervention: Intervention;
  @Input() embedded?: boolean;
  @Output() fileDownload = new EventEmitter<Attachment>();

  interventionDetailsGtmContext: string;

  constructor(private router: Router, private dialog: MatDialog, @Inject(GTM_CONTEXTS) gtmContexts) {
    super();
    this.interventionDetailsGtmContext = gtmContexts.interventionDetails;
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
    // TODO: Delete disabled until confirmed
    this.subscriptions
      .add
      // this.interventionService
      //   .delete(this.intervention.id, this.intervention.phone)
      //   .subscribe(() => this.router.navigate(['interwencje'])),
      ();
  }

  navigateToEditView() {
    this.router.navigate(['interwencje', this.intervention.id, 'edytuj']);
  }
}
