import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@environment';
import { RouterExtensionsService } from '@shared/services/router-extensions.service';

import { routeFader } from './routeFader.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeFader],
})
export class AppComponent {
  useGoogleTagManager = environment.useGoogleTagManager;
  tagManagerId = environment.tagManagerId;

  isRouteLoading$: Observable<boolean>;

  @ViewChild('sidenav', { static: true }) sidenav;

  constructor(routerExtensions: RouterExtensionsService) {
    this.isRouteLoading$ = routerExtensions.isRouteLoading$;
  }
}
