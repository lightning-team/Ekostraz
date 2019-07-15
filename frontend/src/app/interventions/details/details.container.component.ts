import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LoadingComponent} from '@shared/base';

import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';

import {InterventionsService} from '../interventions.service';
import {Intervention} from '../types';

@Component({
    selector: 'app-intervention-details-container',
    template: `
        <mat-spinner [diameter]="40" *ngIf="loading$ | async; else details"></mat-spinner>
        <ng-template #details>
            <app-intervention-details [intervention]='initialData'></app-intervention-details>
        </ng-template>
    `,
})
export class InterventionDetailsContainerComponent extends LoadingComponent<Intervention> {
    constructor(
        private interventionsService: InterventionsService,
        private activatedRoute: ActivatedRoute,
    ) {
        super();
    }

    getInitialData$(): Observable<Intervention> {
        return this.interventionsService.getIntervention(this.activatedRoute.params).pipe(
            take(1)
        );
    }
}
