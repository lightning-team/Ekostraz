import { Subscription } from 'rxjs';
import { ComponentWithSubscriptions } from './ComponentWithSubscriptions';

export declare interface SubmittableForm<SubmitDataType> {
  onSubmit(eventData: SubmitDataType);
}

export abstract class FormContainer<SubmitDataType> extends ComponentWithSubscriptions
  implements SubmittableForm<SubmitDataType> {
  protected constructor(private submitFormFunction: (eventData: SubmitDataType) => Subscription) {
    super();
  }

  onSubmit(eventData) {
    this.subscriptions.add(this.submitFormFunction(eventData));
  }
}
