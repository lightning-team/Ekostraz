import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Subscribable } from '@shared/components/base';

import { AuthService } from '../../auth/auth.service';
import { BreakpointService } from '@shared/services/breakpoint.service';
import { MenuItems, menuItems } from '../menu-items-common';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';
import { EkoRoutePaths } from '@app/eko-route-paths';

@Component({
  selector: 'eko-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss'],
})
export class MobileNavComponent extends Subscribable implements AfterViewInit {
  menuItems: MenuItems = menuItems;
  mobileNavGtmContext: string;
  ekoRoutePaths = EkoRoutePaths;
  isLoggedIn$ = this.authService.isLoggedIn$;
  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;

  constructor(
    private authService: AuthService,
    private breakpointService: BreakpointService,
    @Inject(GTM_CONTEXTS) gtmContexts,
  ) {
    super();
    this.mobileNavGtmContext = gtmContexts.mobileNav;
  }

  ngAfterViewInit() {
    this.subscriptions.add(
      this.breakpointService.isMobileView$.subscribe(() => {
        if (this.sidenav.opened) this.sidenav.close();
      }),
    );
  }

  toggle() {
    this.sidenav.toggle();
  }

  logOut() {
    this.authService.logOut();
    this.sidenav.close();
  }
}
