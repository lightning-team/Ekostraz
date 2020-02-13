import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { InterventionFormData } from '@shared/domain/intervention.model';
import { environment } from '@environment';

@Injectable()
export class InterventionFormService {
  private interventionsUrl = environment.APIUrl + 'interventions';

  constructor(private http: HttpClient) {}

  post(formData: InterventionFormData): Observable<any> {
    return this.http.post(this.interventionsUrl, formData);
  }
}
