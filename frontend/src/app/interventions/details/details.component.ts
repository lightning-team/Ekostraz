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
}
