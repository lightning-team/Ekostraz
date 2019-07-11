import {OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {finalize, switchMapTo, take} from 'rxjs/operators';
import {ComponentWithSubscriptions} from './ComponentWithSubscriptions';

export abstract class LoadingComponent<InitialData> extends ComponentWithSubscriptions implements OnInit {
    loading$: BehaviorSubject<boolean | null> = new BehaviorSubject(true);

    ngOnInit() {
        const initialData$ = this.getInitialData$();
        const loadDataSubscription = this.loading$.pipe(
            take(1),
            switchMapTo(initialData$),
            finalize(() => this.finishLoading()),
        ).subscribe();
        this.subscriptions.add(loadDataSubscription);
    }

    protected abstract getInitialData$(): Observable<InitialData>;

    private finishLoading() {
        this.loading$.next(false);
        this.loading$.complete();
    }
}
