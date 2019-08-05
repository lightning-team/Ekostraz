import {ChangeDetectionStrategy, Component, Input, OnDestroy} from '@angular/core';

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

        <!-- NOTE: We use ngClass below to make sure that content-wrapper is hidden in CSS
             before Angular animations get applied. This way we don't get any temporary glitches. -->
        <!-- TODO: Clean up common logic from the template -->
        <div class='content-wrapper'
             [ngClass]="(loading$ | async) && renderHiddenBeforeLoaded ? 'hidden' : ''"
             [@fadeInOut]="(loading$ | async) && renderHiddenBeforeLoaded ? 'hidden' : ''"
             *ngIf="(loading$ | async) === false || renderHiddenBeforeLoaded">
            <ng-content></ng-content>
        </div>
    `,
    styleUrls: ['./loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInOut],
})
export class LoaderComponent implements OnDestroy {
    @Input() @Required() loading$: Observable<boolean>;
    @Input() loaderText = '';
    /** Flag deciding whether the content should be rendered before load finished, but hidden by CSS. */
    @Input() renderHiddenBeforeLoaded = false;

    ngOnDestroy() {
        // Angular will reuse this component instance, however the templates
        // that call this instance may vary per view basis. Some templates might be missing
        // the required properties. Setting those props as undefined in onDestroy ensures that
        // the error will be thrown when required property is missing.
        // See the internals of Required decorator for a deeper understanding.
        this.loading$ = undefined;
    }
}

