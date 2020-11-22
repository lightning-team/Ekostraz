import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ComponentWithSubscriptions } from '@shared/components/base';

import { AuthService } from '../../auth/auth.service';
import { BreakpointService } from '@shared/services/breakpoint.service';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';
import { AuthUrlsFactory } from '../../auth/auth-urls.factory';
import { EkoRoutePaths } from '../../../eko-route-paths';
import { InterventionsRoutePaths } from '../../interventions/interventions-routing.module';

interface MenuItem {
  text: string;
  title?: string;
  icon: string | null;
  showWhenAuthenticated: boolean;
}

interface RoutedMenuItem extends MenuItem {
  routeLink: string;
  routeExact?: boolean;
}

interface MenuItems {
  navigationLinks: RoutedMenuItem[];
  logIn: MenuItem;
  logOut: MenuItem;
}

// TODO: Generalize menus so that menuItems it can be used as a single source of truth for both desktop and mobile sidenav.
const menuItems = {
  navigationLinks: [
    {
      text: 'Zgłoś interwencję',
      icon: 'notifications_active',
      routeLink: `/${EkoRoutePaths.PublicForm}`,
      showWhenAuthenticated: false,
    },
    {
      text: 'Interwencje',
      icon: 'list',
      routeLink: `/${EkoRoutePaths.Interventions}`,
      showWhenAuthenticated: true,
      routeExact: true,
    },
    {
      text: 'Mapa',
      icon: 'map',
      routeLink: `/${EkoRoutePaths.Interventions}/${InterventionsRoutePaths.Map}`,
      showWhenAuthenticated: true,
    },
    {
      text: 'Zgłoś',
      icon: 'notifications_active',
      routeLink: `/${EkoRoutePaths.Interventions}/${InterventionsRoutePaths.Report}`,
      showWhenAuthenticated: true,
    },
  ],
  logIn: {
    text: 'Zaloguj',
    icon: 'account_circle',
    showWhenAuthenticated: false,
  },
  logOut: {
    text: 'Wyloguj',
    icon: 'exit_to_app',
    showWhenAuthenticated: true,
  },
};

@Component({
  selector: 'eko-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss'],
})
export class MobileNavComponent extends ComponentWithSubscriptions implements AfterViewInit {
  menuItems: MenuItems = menuItems;
  mobileNavGtmContext: string;
  logoutLink = AuthUrlsFactory.logoutUrl;
  loginLink = AuthUrlsFactory.googleLoginUrl();

  isLoggedIn$ = this.authService.isLoggedIn$;
  user$ = this.authService.user$;

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
}
