import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {Observable} from 'rxjs';

import {Required} from '@shared/decorators';
import {fadeInOut} from '../animations';

@Component({
    selector: 'app-loader',
    template: `
        <div class="app-loader-container"
             [@fadeInOut]
             *ngIf="loading$ | async">
            <mat-spinner [diameter]="40"></mat-spinner>
            <h3 *ngIf="!!loaderText" class="mat-h4">{{loaderText}}</h3>
        </div>
        <div class='content-wrapper'
             [@fadeInOut]="(loading$ | async) && renderHiddenBeforeLoaded ? 'hidden' : ''"
             *ngIf="(loading$ | async) === false || renderHiddenBeforeLoaded">
            <ng-content></ng-content>
        </div>
    `,
    styleUrls: ['./loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInOut],
})
export class LoaderComponent {
    @Input() @Required() loading$: Observable<boolean>;
    @Input() loaderText = '';
    /** Flag deciding whether the content should be rendered before load finished, but hidden by CSS. */
    @Input() renderHiddenBeforeLoaded = false;
}

