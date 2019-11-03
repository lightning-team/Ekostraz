import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {ComponentWithSubscriptions} from '@shared/base';

import {AuthService} from '../../auth/auth.service';
import {BreakpointService} from '../../../shared/services/breakpoint.service';
import {GTM_CONTEXTS} from '../../shared/google-tag-manager/gtm-contexts';

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
  selector: 'app-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss']
})
export class MobileNavComponent extends ComponentWithSubscriptions implements OnInit {
  menuItems: MenuItems = menuItems;
  mobileNavGtmContext: string;
  isLoggedIn$ = this.authService.isLoggedIn$;
  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;

  constructor(
      private authService: AuthService,
      private breakpointService: BreakpointService,
      @Inject(GTM_CONTEXTS) gtmContexts,
  ) {
    super();
    this.mobileNavGtmContext = gtmContexts.mobileNav;
  }

  ngOnInit() {
    this.subscriptions.add(
        this.breakpointService.isMobileView$.subscribe(() => {
          if (this.sidenav.opened) this.sidenav.close();
        })
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
