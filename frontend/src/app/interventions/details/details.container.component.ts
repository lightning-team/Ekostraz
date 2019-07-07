import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientIntervention } from '../types';
import { InterventionsService } from '../interventions.service';

@Component({
    selector: 'app-intervention-details-container',
    template: `
      <app-intervention-details [intervention]='intervention'></app-intervention-details>
    `,
})
export class InterventionDetailsContainerComponent implements OnInit {

    private intervention: ClientIntervention;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private interventionsService: InterventionsService,
    ) {
        this.intervention = this.router.getCurrentNavigation().extras.state as ClientIntervention;
    }

    ngOnInit() {
        if (this.intervention) return;
        this.fetchIntervention();
    }

    private fetchIntervention() {
        this.activatedRoute.params.subscribe(params => {
            if (!params.interventionId) return;
            this.interventionsService.getIntervention(params.interventionId as string)
                .subscribe(intervention => {
                    this.intervention = intervention;
                });
        });
    }
}
