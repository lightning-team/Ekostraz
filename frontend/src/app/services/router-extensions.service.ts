import {Injectable} from '@angular/core';
import {
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    Router,
    RouterEvent, RoutesRecognized
} from '@angular/router';

import {merge, MonoTypeOperatorFunction, Observable} from 'rxjs';
import {filter, map, mapTo, pairwise} from 'rxjs/operators';


type RouterEventFilter =
    (eventConstructor: new (...args: any[]) => RouterEvent) => MonoTypeOperatorFunction<RouterEvent>;

const ofEventType: RouterEventFilter = (eventConstructor) => filter(event => event instanceof eventConstructor);


@Injectable({
    providedIn: 'root'
})
export class RouterExtensionsService {
    isRouteLoading$: Observable<boolean>;
    previousUrl = '';

    constructor(router: Router) {
        this.isRouteLoading$ = createRouteLoadingObservable(router);
        this.observeUrlChanges(router);
    }

    private observeUrlChanges(router: Router): void {
        router.events.pipe(
            ofEventType(RoutesRecognized),
            map(e => e.url),
            pairwise(),
        ).subscribe(urls => {
            this.previousUrl = urls[0];
        });
    }
}

function createRouteLoadingObservable(router: Router): Observable<boolean> {
    const navigationStartLoaderState$ = router.events.pipe(
        ofEventType(NavigationStart),
        mapTo(true),
    );
    const navigationFinishedLoaderState$ = merge(
        router.events.pipe(ofEventType(NavigationEnd)),
        router.events.pipe(ofEventType(NavigationError)),
        router.events.pipe(ofEventType(NavigationCancel)),
    ).pipe(mapTo(false));
    return merge(navigationStartLoaderState$, navigationFinishedLoaderState$);
}
