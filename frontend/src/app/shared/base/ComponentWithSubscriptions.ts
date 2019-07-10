import {OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

export abstract class ComponentWithSubscriptions implements OnDestroy {
    protected subscriptions: Subscription = new Subscription();

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
