import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EditableFormContainer} from '@shared/base';

import {Observable} from 'rxjs';

import {Intervention, InterventionFormSubmitData} from '../types';
import {InterventionsService} from '../interventions.service';


@Component({
  selector: 'app-private-edit-intervention-form',
  templateUrl: './private-edit-form.component.html',
  styleUrls: ['./private-edit-form.component.scss']
})
export class PrivateEditFormComponent extends EditableFormContainer<InterventionFormSubmitData, Intervention> {
  constructor(private activatedRoute: ActivatedRoute, private interventionsService: InterventionsService) {
    super(interventionsService.postPrivateForm.bind(interventionsService));
  }

  protected getInitialData$(): Observable<Intervention> {
    return this.interventionsService.getIntervention(this.activatedRoute.params);
  }
}
