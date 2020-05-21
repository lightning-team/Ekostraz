import { Component, Input } from '@angular/core';

import { Intervention } from '@shared/domain/intervention.model';
import { InterventionStatus } from '@shared/domain/intervention.status';

@Component({
  selector: 'eko-intervention-details-basic',
  templateUrl: './details-basic.component.html',
  styleUrls: ['./details-basic.component.scss'],
})
export class DetailsBasicComponent {
  @Input() intervention: Intervention;

  iconByStatus = {
    [InterventionStatus.ToVerify]: 'not_listed_location',
    [InterventionStatus.ActionRequired]: 'notification_important',
    [InterventionStatus.InProgress]: 'directions_walk',
    [InterventionStatus.Closed]: 'done_all',
  };

  classByStatus = {
    [InterventionStatus.ToVerify]: 'info',
    [InterventionStatus.ActionRequired]: 'mat-warn',
    [InterventionStatus.InProgress]: 'in-progress',
    [InterventionStatus.Closed]: 'mat-primary',
  };
}
