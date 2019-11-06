import { Component, Inject, Renderer2, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { environment } from '@environment';
import { RouterExtensionsService } from '@shared/services/router-extensions.service';
import { renderGTMInitScript } from './modules/shared/google-tag-manager/gtm-script';
import { routeFader } from './routeFader.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeFader],
})
export class AppComponent {
  isRouteLoading$: Observable<boolean>;

  @ViewChild('sidenav', { static: true }) sidenav;

  constructor(routerExtensions: RouterExtensionsService, renderer2: Renderer2, @Inject(DOCUMENT) document) {
    this.isRouteLoading$ = routerExtensions.isRouteLoading$;

    if (environment.useGoogleTagManager) {
      renderGTMInitScript(renderer2, document.body);
    }
  }
}
