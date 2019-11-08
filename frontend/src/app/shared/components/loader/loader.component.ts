import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Required } from '@shared/components/decorators';
import { fadeInOut } from '../../animations';

@Component({
  selector: 'app-loader',
  template: `
    <div class="app-loader-container" [@fadeInOut] *ngIf="loading$ | async">
      <mat-spinner [diameter]="40"></mat-spinner>
      <h3 *ngIf="!!loaderText" class="mat-h4">{{ loaderText }}</h3>
    </div>

    <!-- NOTE: We use ngClass below to make sure that content-wrapper is hidden in CSS
             before Angular animations get applied. This way we don't get any temporary glitches. -->
    <div
      class="content-wrapper"
      [ngClass]="hidden$ | async"
      [@fadeInOut]="hidden$ | async"
      *ngIf="renderContent$ | async"
    >
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
})
export class LoaderComponent implements OnInit {
  @Input() @Required() loading$: Observable<boolean>;
  @Input() loaderText = '';
  /** Flag deciding whether the content should be rendered before load finished, but hidden by CSS. */
  @Input() renderHiddenBeforeLoaded = false;

  renderContent$: Observable<boolean>;
  hidden$: Observable<string>;

  ngOnInit() {
    this.initDerivedTemplateObservables();
  }

  private initDerivedTemplateObservables() {
    const loadingHidden$ = combineLatest(this.loading$, of(this.renderHiddenBeforeLoaded));
    this.renderContent$ = loadingHidden$.pipe(map(([loading, renderHidden]) => !loading || renderHidden));
    this.hidden$ = loadingHidden$.pipe(map(([loading, renderHidden]) => (loading && renderHidden ? 'hidden' : '')));
  }
}
