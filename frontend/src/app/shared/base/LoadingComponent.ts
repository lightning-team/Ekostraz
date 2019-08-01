import {OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {finalize, switchMapTo, take, tap} from 'rxjs/operators';
import {ComponentWithSubscriptions} from './ComponentWithSubscriptions';


export abstract class LoadingComponent<ViewData> extends ComponentWithSubscriptions implements OnInit {
    loading$: BehaviorSubject<boolean | null> = new BehaviorSubject(true);
    initialData: ViewData|null = null;

    ngOnInit() {
        const initialData$ = this.getInitialData$();
        const loadDataSubscription = this.loading$.pipe(
            take(1),
            switchMapTo(initialData$),
            tap(data => this.setInitialData(data)),
            finalize(() => this.finishLoading()),
        ).subscribe();
        this.subscriptions.add(loadDataSubscription);
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
