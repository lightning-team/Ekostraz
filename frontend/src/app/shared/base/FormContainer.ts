import {Subscription} from 'rxjs';
import {ComponentWithSubscriptions} from './ComponentWithSubscriptions';
import {LoadingComponent} from './LoadingComponent';
import {ChangeDetectorRef} from '@angular/core';

export declare interface SubmittableForm<SubmitDataType> {
    onSubmit(eventData: SubmitDataType);
}

export abstract class FormContainer<SubmitDataType> extends ComponentWithSubscriptions implements SubmittableForm<SubmitDataType> {
    protected constructor(private submitFormFunction: (eventData: SubmitDataType) => Subscription) {
        super();
    }

    onSubmit(eventData) {
        this.subscriptions.add(this.submitFormFunction(eventData));
    }
}

export abstract class EditableFormContainer<InitialData> extends LoadingComponent<InitialData>
                                                                         implements SubmittableForm<InitialData> {
    protected constructor(private submitFormFunction: (eventData: InitialData) => Subscription,
                          changeDetector: ChangeDetectorRef) {
        super(changeDetector);
    }

    onSubmit(eventData) {
        this.subscriptions.add(this.submitFormFunction(eventData));
    }
}
