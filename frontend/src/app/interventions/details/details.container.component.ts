import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientIntervention } from '../types';
import { InterventionsService } from '../interventions.service';
import { Observable } from 'rxjs';
import {take, tap} from 'rxjs/operators';

@Component({
    selector: 'app-intervention-details-container',
    template: `
      <app-intervention-details [intervention]='intervention$ | async'></app-intervention-details>
    `,
})
export class InterventionDetailsContainerComponent implements OnInit {
    intervention$: Observable<ClientIntervention>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private interventionsService: InterventionsService,
    ) {}

    ngOnInit() {
        this.intervention$ = this.interventionsService.getIntervention(this.activatedRoute.params).pipe(
            take(1)
        );
    }
}
