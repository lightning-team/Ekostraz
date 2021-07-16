import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  ViewRef,
} from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { fadeInOut } from '../../animations';

@Component({
  selector: 'eko-loader',
  template: `
    <div *ngIf="loading" class="eko-loader-container" [@fadeInOut]>
      <mat-spinner [diameter]="40"></mat-spinner>
      <h3 *ngIf="!!loaderText" class="mat-h4">{{ loaderText }}</h3>
    </div>

    <div
      class="content-wrapper"
      [ngClass]="loading && hiddenBeforeLoaded ? 'hidden' : ''"
      [@fadeInOut]="loading && hiddenBeforeLoaded ? 'hidden' : ''"
      *ngIf="!loading || hiddenBeforeLoaded || cover"
    >
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./loader.component.scss'],
  animations: [fadeInOut],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent implements OnInit, OnDestroy {
  /**
   * Observable to watch for to decide whether the loader should be shown/hidden.
   *
   * By default, the loader is NOT rendering the projected content until loading finishes.
   * Also, on subsequent loads it will remove the content from the DOM and then re-create it again.
   *
   * The flags 'hiddenBeforeLoaded' or 'cover' can change that behaviour.
   */
  @Input() loading$: Observable<any>;

  /** Optional text to display below the spinner */
  @Input() loaderText = '';

  /** Flag deciding whether the projected content should be rendered to the DOM immediately, but hidden by CSS. */
  @Input() hiddenBeforeLoaded = false;

  /**
   * Flag deciding whether the projected content should be rendered to the DOM immediately
   * and only covered on top by the loader with semi-transparent background.
   */
  @HostBinding('class.cover') @Input() cover = false;

  loading = true;

  private subscription = new Subscription();

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscribeToLoading$();
  }

  private subscribeToLoading$() {
    this.subscription.add(
      this.loading$
        .pipe(
          tap(data => (this.loading = !!data)),
          tap(() => this.changeDetector.detectChanges()),
          finalize(() => {
            this.loading = false;
            if (!(this.changeDetector as ViewRef).destroyed) {
              this.changeDetector.detectChanges();
            }
          }),
        )
        .subscribe(),
    );
  }

  ngOnDestroy() {
    this.changeDetector.detach();
    this.subscription.unsubscribe();
  }
}
