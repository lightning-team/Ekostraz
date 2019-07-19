import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Observable, of} from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import {shareReplay, switchMap} from 'rxjs/operators';
import {MatSidenav} from '@angular/material';

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
      routeLink: '/interwencje/zglos-publiczny',
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
export class MobileNavComponent implements OnInit {
  isLoggedIn$ = this.authService.isLoggedIn$;
  menuItems: MenuItems = menuItems;

  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;

  constructor(private breakPointObserver: BreakpointObserver, private authService: AuthService) {}

  ngOnInit() {
    // TODO: Extract breakpoint to a common logic for both mobile and desktop menu.
    // TODO: Please refactor and clean-up
    this.breakPointObserver
        .observe(['(max-width: 700px)']).pipe(
            switchMap(state => of(state.matches)),
            shareReplay(1)
        ).subscribe(() => {
          if (this.sidenav.opened) {
              this.sidenav.close();
          }
        });
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
