import {AfterViewInit, ChangeDetectorRef, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {concatMapTo, filter, finalize, switchMapTo, take, tap} from 'rxjs/operators';
import {ComponentWithSubscriptions} from './ComponentWithSubscriptions';


export abstract class LoadingComponent<ViewData> extends ComponentWithSubscriptions implements OnInit, AfterViewInit {
    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    initialData: ViewData|null;
    private viewInitSubject: BehaviorSubject<any> = new BehaviorSubject(false);

    /**
     * Override with custom observable, if you want some effects to happen before
     * the loader is hidden, but after initial data has already been loaded.
     * Defaults to an empty observable that completes immediately.
     */
    protected afterDataLoaded$: Observable<any> = of(null);

    protected constructor(private changeDetector: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        this.startDataLoading();
    }

    ngAfterViewInit() {
        this.viewInitSubject.next(true);
    }

    private startDataLoading() {
        const initialData$ = this.getInitialData$().pipe(
            tap(data => this.setInitialData(data)),
            take(1));
        this.subscriptions.add(
            this.loading$.pipe(
                take(1),
                switchMapTo(initialData$),
                concatMapTo(this.getViewInitFinished$()),
                concatMapTo(this.afterDataLoaded$),
                finalize(() => this.finishLoading()),
            ).subscribe()
        );
    }

    private getViewInitFinished$() {
        return this.viewInitSubject.asObservable().pipe(
            filter(finished => finished),
            // Detect changes after view init, so that any ViewChild/ContentChild references
            // get resolved.
            tap(() => this.changeDetector.detectChanges()),
            take(1),
        );
    }

    protected abstract getInitialData$(): Observable<ViewData>;

    private setInitialData(data: ViewData) {
        this.initialData = data || null;
    }

    private finishLoading() {
        this.loading$.next(false);
        this.loading$.complete();
        // Detect changes after loading finished to prevent Angular change detection exception.
        this.changeDetector.detectChanges();
    }
}
