import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Subscribable } from '@shared/components/base';

import { AuthService } from '../../auth/auth.service';
import { BreakpointService } from '@shared/services/breakpoint.service';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';

interface MenuItem {
  text: string;
  icon: string;
  showWhenAuthenticated: boolean;
}

interface RoutedMenuItem extends MenuItem {
  routeLink: string;
  routeExact?: boolean;
}

interface MenuItems {
  navigationLinks: RoutedMenuItem[];
}

// TODO: Generalize menus so that menuItems it can be used as a single source of truth for both desktop and mobile sidenav.
const menuItems = {
  navigationLinks: [
    {
      text: 'Zgłoś interwencję',
      icon: 'notifications_active',
      routeLink: '/zglos-interwencje',
      showWhenAuthenticated: false,
    },
    {
      text: 'Interwencje',
      icon: 'list',
      routeLink: '/interwencje',
      showWhenAuthenticated: true,
      routeExact: true,
    },
    {
      text: 'Mapa',
      icon: 'map',
      routeLink: '/interwencje/mapa',
      showWhenAuthenticated: true,
    },
    {
      text: 'Zgłoś',
      icon: 'notifications_active',
      routeLink: '/interwencje/zglos',
      showWhenAuthenticated: true,
    },
  ],
};

@Component({
  selector: 'eko-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss'],
})
export class MobileNavComponent extends Subscribable implements AfterViewInit {
  menuItems: MenuItems = menuItems;
  mobileNavGtmContext: string;
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

  logIn() {
    this.authService.navigateToLoginPage();
    this.sidenav.close();
  }

  logOut() {
    this.authService.logOut();
    this.sidenav.close();
  }
}
