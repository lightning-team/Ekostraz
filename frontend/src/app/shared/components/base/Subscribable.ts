import { OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

export abstract class Subscribable implements OnDestroy {
  private destroySubject = new Subject();

  protected subscriptions: Subscription = new Subscription();
  protected destroy$ = this.destroySubject.asObservable();

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.destroySubject.next();
  }
}
