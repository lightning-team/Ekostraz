import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientIntervention } from '../intervention';

@Component({
    selector: 'app-intervention-details-container',
    template: `
      <app-intervention-details [intervention]='intervention'></app-intervention-details>
    `,
})
export class InterventionDetailsContainerComponent implements OnInit {

    private intervention: ClientIntervention;

    constructor(private router: Router) {
        this.intervention = this.router.getCurrentNavigation().extras.state as ClientIntervention;
    }

    ngOnInit() {

    }
}
