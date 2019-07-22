import {Component, ViewChild} from '@angular/core';
import {
  NavigationCancel, NavigationEnd, NavigationError, NavigationStart,
  Router, RouterEvent
} from '@angular/router';

import {merge, MonoTypeOperatorFunction, Observable} from 'rxjs';
import {filter, mapTo} from 'rxjs/operators';

import {routeFader} from './animations/routeFader';

type RouterEventFilter = (eventConstructor: new (...args: any[]) => RouterEvent) => MonoTypeOperatorFunction<RouterEvent>;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeFader]
})
export class AppComponent {
  title = 'ekostraz';
  isRouteLoading$: Observable<boolean>;

  @ViewChild('sidenav', {static: true}) sidenav;

  constructor(router: Router) {
    this.isRouteLoading$ = this.createRouteLoadingObservable(router);
  }

  private createRouteLoadingObservable(router: Router): Observable<boolean> {
    const ofEventType: RouterEventFilter =
        (eventConstructor) => filter(event => event instanceof eventConstructor);

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
}
