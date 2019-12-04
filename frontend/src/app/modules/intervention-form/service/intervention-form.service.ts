import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { InterventionFormData, InterventionPostData } from '@interventionForm/types';
import { environment } from '@environment';

const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    // TODO: We need to find a way to securely pass access token for Azure Functions
    'x-functions-key': 'for-local-development-paste-your-secret-token-here',
  }),
};

@Injectable()
export class InterventionFormService {
  private interventionsUrl = environment.APIUrl + 'interventions';

  constructor(private http: HttpClient) {}

  post(formData: InterventionFormData): Observable<any> {
    return this.http.post(this.interventionsUrl, new InterventionPostData(formData), HTTP_OPTIONS);
  }
}
