import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddPublicFormUrl, AddPrivateFormUrl, GetAllRequestsUrl } from './api.configuration'
import { ServerIntervention } from './intervention';

@Injectable()
export class InterventionsService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      // 'Authorization': 'my-auth-token'
    })
  };

  getInterventions(): Observable<ServerIntervention[]> {
    return this.http.get<any>(GetAllRequestsUrl)
      .pipe(map(data => data.map(item => new ServerIntervention(item))));
  }

  addPublicForm(data: ServerIntervention): Observable<ServerIntervention> {
    return this.http.post<ServerIntervention>(AddPublicFormUrl, data, this.httpOptions);
  }

  addPrivateForm(data: ServerIntervention): Observable<ServerIntervention> {
    return this.http.post<ServerIntervention>(AddPrivateFormUrl, data, this.httpOptions);
  }
}
