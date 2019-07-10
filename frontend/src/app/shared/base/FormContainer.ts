import {ComponentWithSubscriptions} from './ComponentWithSubscriptions';
import {Subscription} from 'rxjs';

export declare interface SubmittableForm<T> {
    onSubmit(eventData: T);
}

export abstract class FormContainer<T> extends ComponentWithSubscriptions implements SubmittableForm<T> {
    protected constructor(private submitFormFunction: (T) => Subscription) {
        super();
    }

    onSubmit(eventData) {
        this.subscriptions.add(this.submitFormFunction(eventData));
    }
}
