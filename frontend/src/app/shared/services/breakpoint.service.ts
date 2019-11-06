import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, of } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  isMobileView$: Observable<boolean> = this.breakPointObserver.observe(['(max-width: 700px)']).pipe(
    switchMap(state => of(state.matches)),
    shareReplay(1),
  );

  constructor(private breakPointObserver: BreakpointObserver) {}
}
