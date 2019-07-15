import {OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {finalize, switchMapTo, take, tap, map} from 'rxjs/operators';
import {ComponentWithSubscriptions} from './ComponentWithSubscriptions';

const identity = <T>(item: T) => item;

export abstract class LoadingComponent<APIData, ViewData = APIData> extends ComponentWithSubscriptions implements OnInit {
    loading$: BehaviorSubject<boolean | null> = new BehaviorSubject(true);
    initialData: ViewData|APIData|null = null;

    protected mapInitialData: (data: APIData) => ViewData|APIData = identity;

    ngOnInit() {
        const initialData$ = this.getInitialData$();
        const loadDataSubscription = this.loading$.pipe(
            take(1),
            switchMapTo(initialData$),
            map(data => this.mapInitialData(data)),
            tap(data => this.setInitialData(data)),
            finalize(() => this.finishLoading()),
        ).subscribe();
        this.subscriptions.add(loadDataSubscription);
    }

    protected abstract getInitialData$(): Observable<APIData>;

    private setInitialData(data: ViewData|APIData) {
        this.initialData = data;
    }

    private finishLoading() {
        this.loading$.next(false);
        this.loading$.complete();
    }
}
