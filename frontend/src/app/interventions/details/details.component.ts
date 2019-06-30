import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientIntervention } from '../intervention';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class InterventionDetailsComponent implements OnInit {

  private intervention: ClientIntervention;

  constructor(private router: Router) {
    // console.log(this.router.getCurrentNavigation().extras.state);
    this.intervention = this.router.getCurrentNavigation().extras.state as ClientIntervention;
  }

  ngOnInit() {

  }

}
