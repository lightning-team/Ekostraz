import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddPublicFormUrl, AddPrivateFormUrl, GetAllRequestsUrl } from './api.configuration'
import { Intervention } from './intervention';

@Injectable()
export class InterventionsService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      // 'Authorization': 'my-auth-token'
    })
  };

  getInterventions(): Observable<Intervention[]> {
    return this.http.get<any>(GetAllRequestsUrl)
      .pipe(map(data => data.map(item => new Intervention(item))));
  }

  addPublicForm(data: Intervention): Observable<Intervention> {
    return this.http.post<Intervention>(AddPublicFormUrl, data, this.httpOptions);
  }

  addPrivateForm(data: Intervention): Observable<Intervention> {
    return this.http.post<Intervention>(AddPrivateFormUrl, data, this.httpOptions);
  }
}
