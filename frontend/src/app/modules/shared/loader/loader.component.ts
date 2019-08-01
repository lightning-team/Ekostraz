import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {Observable} from 'rxjs';

import {Required} from '@shared/decorators';
import {fadeInOut} from '../animations';

@Component({
    selector: 'app-loader',
    template: `
        <div class="app-spinner-container" [@fadeInOut]
             *ngIf="loading$ | async; else content">
            <mat-spinner [diameter]="40"></mat-spinner>
        </div>
        <ng-template #content>
        <!-- Animations does not seem to work directly on ng-content nor ng-template -->
            <div class='animation-wrapper' [@fadeInOut]>
                <ng-content></ng-content>
            </div>
        </ng-template>
    `,
    styleUrls: ['./loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInOut],
})
export class LoaderComponent {
    @Input() @Required() loading$: Observable<boolean>;
}

