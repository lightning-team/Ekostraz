import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';

import { InterventionStatusOptions } from '@shared/domain/intervention.status';
import { ComponentWithSubscriptions } from '@shared/components/base';
import { InterventionsFilter } from '@shared/domain/intervention.model';

@Component({
  selector: 'eko-interventions-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent extends ComponentWithSubscriptions implements OnInit, OnDestroy {
  @Input() filtersState: InterventionsFilter;
  @Output() filtersChange = new EventEmitter<InterventionsFilter>();

  form: FormGroup;
  statusOptions = InterventionStatusOptions;
  isEmpty = true;

  ngOnInit() {
    this.form = new FormGroup({
      statuses: new FormControl(this.filtersState.statuses || []),
    });
    this.isEmpty = !this.filtersState.statuses || !this.filtersState.statuses.length;

    this.subscriptions.add(
      this.form.valueChanges
        .pipe(
          debounceTime(400),
          tap(val => {
            this.isEmpty = !(val.statuses && val.statuses.length);
            this.filtersChange.emit(val);
          }),
        )
        .subscribe(),
    );
  }

  clearForm() {
    this.form.setValue({ statuses: [] });
  }
}
