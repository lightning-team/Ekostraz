import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EditableFormContainer} from '@shared/base';

import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {Intervention, InterventionFormSubmitData} from '../types';
import {InterventionsService} from '../interventions.service';


@Component({
  selector: 'app-private-edit-intervention-form',
  templateUrl: './private-edit-form.component.html',
  styleUrls: ['./private-edit-form.component.scss']
})
export class PrivateEditFormComponent extends EditableFormContainer<InterventionFormSubmitData, Intervention> {
  intervention: Intervention | null = null;

  constructor(private activatedRoute: ActivatedRoute, private interventionsService: InterventionsService) {
    super(interventionsService.postPrivateForm.bind(interventionsService));
  }

  protected getInitialData$(): Observable<Intervention> {
    return this.interventionsService.getIntervention(this.activatedRoute.params).pipe(
        tap(intervention => this.setIntervention(intervention)),
    );
  }

  private setIntervention(intervention: Intervention) {
    this.intervention = intervention;
  }
}
