import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ClientIntervention } from '../intervention';

@Component({
  selector: 'app-intervention-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class InterventionDetailsComponent {
  @Input() intervention: ClientIntervention;
  @Input() miniVersion?: boolean;

  constructor(private router: Router) { }

  showDeleteDialog() {

  }

  navigateToEditView() {
    this.router.navigate(['interventions', this.intervention.id, 'edit'], { state: this.intervention });
  }
}
