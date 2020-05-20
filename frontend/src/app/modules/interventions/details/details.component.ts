import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Intervention } from '@shared/domain/intervention.model';
import { ComponentWithSubscriptions } from '@shared/components/base';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';

@Component({
  selector: 'eko-intervention-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent extends ComponentWithSubscriptions {
  @Input() intervention: Intervention;
  @Input() embedded?: boolean;

  interventionDetailsGtmContext: string;

  constructor(private router: Router, @Inject(GTM_CONTEXTS) gtmContexts) {
    super();
    this.interventionDetailsGtmContext = gtmContexts.interventionDetails;
  }

  navigateToEditView() {
    this.router.navigate(['interwencje', this.intervention.id, 'edytuj']);
  }
}
