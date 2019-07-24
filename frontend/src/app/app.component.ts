import {Component, ViewChild} from '@angular/core';

import {Observable} from 'rxjs';

import {RouterExtensionsService} from './services/router-extensions.service';
import {routeFader} from '@shared/animations/routeFader';


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

  constructor(routerExtensions: RouterExtensionsService) {
    this.isRouteLoading$ = routerExtensions.isRouteLoading$;
  }
}
