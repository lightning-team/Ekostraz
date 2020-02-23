import { Component, OnInit, Input } from '@angular/core';
import { Comment } from '@shared/domain/intervention.model';
import { InterventionsService } from '../../interventions.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ComponentWithSubscriptions } from '@shared/components/base';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent extends ComponentWithSubscriptions {
  @Input() comments: Comment[];
  @Input() interventionId: string;

  form = new FormGroup({
    comment: new FormControl('', Validators.required),
  });

  constructor(private interventionService: InterventionsService) {
    super();
  }

  addComment() {
    const { comment } = this.form.value;

    this.subscriptions.add(
      this.interventionService.submitComment(comment, this.interventionId).subscribe(newComment => {
        this.comments.push(newComment);
        this.form.reset();
      }),
    );
  }
}
