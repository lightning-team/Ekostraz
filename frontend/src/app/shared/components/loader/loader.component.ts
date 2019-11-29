import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { fadeInOut } from '../../animations';

@Component({
  selector: 'app-loader',
  template: `
    <div class="app-loader-container" [@fadeInOut] *ngIf="loading">
      <mat-spinner [diameter]="40"></mat-spinner>
      <h3 *ngIf="!!loaderText" class="mat-h4">{{ loaderText }}</h3>
    </div>

    <div
      class="content-wrapper"
      [ngClass]="loading && hiddenBeforeLoaded ? 'hidden' : ''"
      [@fadeInOut]="loading && hiddenBeforeLoaded ? 'hidden' : ''"
      *ngIf="!loading || hiddenBeforeLoaded"
    >
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./loader.component.scss'],
  animations: [fadeInOut],
})
export class LoaderComponent implements OnInit, OnDestroy {
  @Input() loading$: Observable<any>;
  @Input() loaderText = '';
  /** Flag deciding whether the content should be rendered before load finished, but hidden by CSS. */
  @Input() hiddenBeforeLoaded = false;
  loading = true;

  private subscription = new Subscription();

  ngOnInit() {
    this.subscribeToLoading$();
  }

  private subscribeToLoading$() {
    this.subscription.add(
      this.loading$
        .pipe(
          finalize(() => {
            this.loading = false;
          }),
        )
        .subscribe(),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
