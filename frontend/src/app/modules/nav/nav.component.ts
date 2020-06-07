import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { BreakpointService } from '@shared/services/breakpoint.service';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'eko-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  desktopNavGtmContext: string;
  hamburgerMenuButtonGtmContext: string;

  isMobileView$: Observable<boolean>;
  isLoggedIn$ = this.authService.isLoggedIn$;
  user$ = this.authService.user$;

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
}
