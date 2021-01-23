import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ComponentWithSubscriptions } from '@shared/components/base';
import { InterventionStatus, InterventionStatusOptions } from '@shared/domain/intervention.status';
import { InterventionsFilter } from '@shared/domain/intervention.model';

import { fabButtonAnimation, filtersCardAnimation, fadeInOut } from './map-filter.animations';

@Component({
  selector: 'eko-map-filters',
  templateUrl: './map-filter.component.html',
  styleUrls: ['./map-filter.component.scss'],
  animations: [fabButtonAnimation, filtersCardAnimation, fadeInOut],
})
export class MapFilterComponent extends ComponentWithSubscriptions implements OnInit {
  @Output() filtersChange = new EventEmitter<InterventionsFilter>();
  statusOptions = InterventionStatusOptions;
  form = new FormGroup({
    statuses: new FormControl(InterventionStatus.ActionRequired),
  });
  filtersVisible = false;

  constructor() {
    super();
  }

  toggleFiltersVisibility = () => {
    this.filtersVisible = !this.filtersVisible;
  };

  ngOnInit() {
    this.subscriptions.add(
      this.form.valueChanges.subscribe(values => {
        this.filtersChange.emit(values);
      }),
    );
  }
}
