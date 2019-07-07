import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {PostInterventionData, ClientIntervention, FormInterventionData, RawServerIntervention} from './types';
import { getFakeData } from '../fakedata';

const BASE_API_URL = 'https://devkodawanie.azurewebsites.net/api/';
const AddPublicFormUrl = BASE_API_URL + 'AddPublicForm';
const AddPrivateFormUrl = BASE_API_URL + 'PrivateForm';
const GetAllRequestsUrl = BASE_API_URL + 'GetAllRequestsFunction';
const DeleteRequestUrl = BASE_API_URL + 'DeleteRequestFunction';
const GetOneRequestsUrl = BASE_API_URL + 'GetOneRequestsFunction';


@Injectable()
export class InterventionsService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      // 'Authorization': 'my-auth-token'
    })
  };

  getInterventions(): Observable<ClientIntervention[]> {
    // return this.http.get<any>(GetAllRequestsUrl)
    //   .pipe(map(data => data.map(item => new PostInterventionData(item))));
    return of(getFakeData().map(item => new ClientIntervention(item)));
  }

  private postForm(formData: FormInterventionData, interventionId: string, APIUrl: string) {
    return this.http.post(APIUrl, new PostInterventionData(formData, interventionId), this.httpOptions);
  }

  postPublicForm(formData: FormInterventionData): Observable<any> {
    return this.postForm(formData, null, AddPublicFormUrl);
  }

  postPrivateForm(formData: FormInterventionData, id: string | null): Observable<any> {
    return this.postForm(formData, id, AddPrivateFormUrl);
  }

  delete(id: string, phone: string) {
    return this.http.post(DeleteRequestUrl, {partitionKey: id, rowKey: phone}, this.httpOptions);
  }

  getIntervention(id: string): Observable<ClientIntervention> {
    return this.http.post<RawServerIntervention>(GetOneRequestsUrl, { id }).pipe(
      map(rawIntervention => new ClientIntervention(rawIntervention))
    );
  }
}
