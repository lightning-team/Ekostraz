import {Injectable} from '@angular/core';
import {
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    Router,
    RouterEvent
} from '@angular/router';

import {merge, MonoTypeOperatorFunction, Observable} from 'rxjs';
import {filter, mapTo} from 'rxjs/operators';


type RouterEventFilter =
    (eventConstructor: new (...args: any[]) => RouterEvent) => MonoTypeOperatorFunction<RouterEvent>;

const ofEventType: RouterEventFilter = (eventConstructor) => filter(event => event instanceof eventConstructor);


@Injectable({
    providedIn: 'root'
})
export class RouterExtensionsService {
    isRouteLoading$: Observable<boolean>;

    constructor(router: Router) {
        this.isRouteLoading$ = createRouteLoadingObservable(router);
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
