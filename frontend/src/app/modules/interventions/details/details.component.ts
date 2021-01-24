import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Intervention } from '@shared/domain/intervention.model';
import { EkoRoutePaths } from '../../../eko-route-paths';
import { InterventionsRoutePaths } from '../route-paths';

@Component({
  selector: 'eko-intervention-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  @Input() intervention: Intervention;

  constructor(private router: Router) {}

  navigateToEditView() {
    this.router.navigate([EkoRoutePaths.Interventions, this.intervention.id, InterventionsRoutePaths.Edit]);
  }
}
