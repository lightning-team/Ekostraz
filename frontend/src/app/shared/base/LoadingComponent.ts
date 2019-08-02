import {OnInit} from '@angular/core';
import {BehaviorSubject, EMPTY, Observable} from 'rxjs';
import {finalize, switchMapTo, take, tap} from 'rxjs/operators';
import {ComponentWithSubscriptions} from './ComponentWithSubscriptions';


export abstract class LoadingComponent<ViewData> extends ComponentWithSubscriptions implements OnInit {
    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    initialData: ViewData | null = null;

    /**
     * Override with custom observable or add pipe actions, if you want some effects to happen before
     * the loader is hidden, but after initial data has already been loaded.
     * Defaults to an empty observable that completes immediately.
     */
    protected afterDataLoaded$: Observable<any> = EMPTY;

    ngOnInit() {
        this.startDataLoading();
    }

    private startDataLoading() {
        const initialData$ = this.getInitialData$();
        this.subscriptions.add(
            this.loading$.pipe(
                take(1),
                switchMapTo(initialData$),
                tap(data => this.setInitialData(data)),
                switchMapTo(this.afterDataLoaded$),
                finalize(() => this.finishLoading()),
            ).subscribe()
        );
    }

    protected abstract getInitialData$(): Observable<ViewData>;

    private setInitialData(data: ViewData) {
        this.initialData = data;
    }

    private finishLoading() {
        this.loading$.next(false);
        this.loading$.complete();
    }
}
