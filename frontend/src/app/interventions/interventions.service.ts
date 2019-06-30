import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddPublicFormUrl, AddPrivateFormUrl, GetAllRequestsUrl, DeleteRequestUrl, GetOneRequestsUrl } from './api.configuration';
import { ServerIntervention, ClientIntervention } from './intervention';
import { getFakeData } from '../fakedata';

@Injectable()
export class InterventionsService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      // 'Authorization': 'my-auth-token'
    })
  };

  getInterventions(page = 1): Observable<ServerIntervention[]> {
    return this.http.get<any>(GetAllRequestsUrl)
      .pipe(map(data => data.map(item => new ServerIntervention(item))));
  }

  addPublicForm(data: ServerIntervention): Observable<ServerIntervention> {
    return this.http.post<ServerIntervention>(AddPublicFormUrl, data, this.httpOptions);
  }

  addPrivateForm(data: ServerIntervention): Observable<ServerIntervention> {
    return this.http.post<ServerIntervention>(AddPrivateFormUrl, data, this.httpOptions);
  }

  deleteRequest(partitionKey: string, rowKey: string) {
    let data = {
      partitionKey: partitionKey,
      rowKey: rowKey
    }
    return this.http.post(DeleteRequestUrl, data, this.httpOptions);
  }

  getIntervention(id: string) {
    return this.http.post<ClientIntervention>(GetOneRequestsUrl, { id }).pipe(
      map(rawIntervention => new ClientIntervention(new ServerIntervention(rawIntervention)))
    );
  }
}
