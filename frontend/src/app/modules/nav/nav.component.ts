import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';

import {AuthService} from '../auth/auth.service';
import {BreakpointService} from '../../services/breakpoint.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isMobileView$: Observable<boolean>;
  isLoggedIn$ = this.authService.isLoggedIn$;
  @Output() sideNavToggle = new EventEmitter();

  constructor(private breakpointService: BreakpointService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isMobileView$ = this.breakpointService.isMobileView$;
  }

  logIn() {
    this.authService.logIn();
  }

  logOut() {
    this.authService.logOut();
  }
}
