import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';

import {AuthService} from '../auth/auth.service';
import {Observable, of} from 'rxjs';
import {shareReplay, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isMobileView$: Observable<boolean>;
  isLoggedIn$ = this.authService.isLoggedIn$;
  @Output() sideNavToggle = new EventEmitter();

  constructor(private breakPointObserver: BreakpointObserver, private authService: AuthService) {}

  ngOnInit(): void {
    this.isMobileView$ = this.breakPointObserver
        .observe(['(max-width: 700px)']).pipe(
            switchMap(state => of(state.matches)),
            shareReplay(1)
        );
  }

  logIn() {
    this.authService.logIn();
  }

  logOut() {
    this.authService.logOut();
  }
}
