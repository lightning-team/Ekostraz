import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Observable} from 'rxjs';

import {Required} from '@shared/decorators';

@Component({
    selector: 'app-loader',
    template: `
        <div class="app-spinner-container" *ngIf="loading$ | async; else content">
            <mat-spinner [diameter]="40"></mat-spinner>
        </div>
        <ng-template #content>
            <ng-content ></ng-content>
        </ng-template>
    `,
    styleUrls: ['./loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
    @Input() @Required() loading$: Observable<boolean>;
}

