import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Intervention } from '@shared/domain/intervention.model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialog } from './delete.dialog';
import { ComponentWithSubscriptions } from '@shared/components/base';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';
import { InterventionsApiUrlsFactory } from '@shared/interventions-api-urls.factory';

@Component({
  selector: 'app-intervention-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent extends ComponentWithSubscriptions {
  @Input() intervention: Intervention;
  @Input() embedded?: boolean;
  interventionDetailsGtmContext: string;

  constructor(private router: Router, private dialog: MatDialog, @Inject(GTM_CONTEXTS) gtmContexts) {
    super();
    this.interventionDetailsGtmContext = gtmContexts.interventionDetails;
  }

  createFileUrl(blobId: string): string {
    return InterventionsApiUrlsFactory.attachment(this.intervention.id, blobId);
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
