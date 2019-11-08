import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { BreakpointService } from '@shared/services/breakpoint.service';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  desktopNavGtmContext: string;
  hamburgerMenuButtonGtmContext: string;

  isMobileView$: Observable<boolean>;
  isLoggedIn$ = this.authService.isLoggedIn$;

  @Output() sideNavToggle = new EventEmitter();

  constructor(
    private breakpointService: BreakpointService,
    private authService: AuthService,
    @Inject(GTM_CONTEXTS) gtmContexts,
  ) {
    this.desktopNavGtmContext = gtmContexts.desktopNav;
    this.hamburgerMenuButtonGtmContext = gtmContexts.hamburgerMenuButton;
  }

  ngOnInit(): void {
    this.isMobileView$ = this.breakpointService.isMobileView$;
  }

  logIn() {
    this.authService.navigateToLoginPage();
  }

  logOut() {
    this.authService.logOut();
  }
}
