import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {ComponentWithSubscriptions} from '@shared/base';

import {AuthService} from '../../auth/auth.service';
import {BreakpointService} from '../../../services/breakpoint.service';

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
      icon: null,
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
      text: 'Zgłoś',
      icon: 'notifications_active',
      routeLink: '/interwencje/zglos',
      showWhenAuthenticated: true,
    },
    {
      text: 'Mapa',
      icon: 'map',
      routeLink: '/interwencje/mapa',
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
  isLoggedIn$ = this.authService.isLoggedIn$;
  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;

  constructor(private authService: AuthService, private breakpointService: BreakpointService) {
    super();
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
    this.authService.logIn();
    this.sidenav.close();
  }

  logOut() {
    this.authService.logOut();
    this.sidenav.close();
  }
}
