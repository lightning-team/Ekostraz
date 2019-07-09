import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { PostInterventionData, ClientIntervention, FormInterventionData, RawServerIntervention } from './types';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { map } from 'rxjs/operators';
import { getFakeData } from '../fakedata';

const BASE_API_URL = 'https://devkodawanie.azurewebsites.net/api/';
const AddPublicFormUrl = BASE_API_URL + 'AddPublicForm';
const AddPrivateFormUrl = BASE_API_URL + 'PrivateForm';
const GetAllRequestsUrl = BASE_API_URL + 'GetAllRequestsFunction';
const DeleteRequestUrl = BASE_API_URL + 'DeleteRequestFunction';
const GetOneRequestsUrl = BASE_API_URL + 'GetOneRequestsFunction';


@Injectable()
export class InterventionsService {

  constructor(
      private http: HttpClient,
      private router: Router,
      private snackBar: MatSnackBar,
  ) { }

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

  private postForm(formData: FormInterventionData, interventionId: string, APIUrl: string): Subscription {
    return this.http.post(APIUrl, new PostInterventionData(formData, interventionId), this.httpOptions)
        .subscribe({
          next: this.onPostSuccess.bind(this),
          error: this.onPostError.bind(this)
        });
  }

  postPublicForm(formData: FormInterventionData): Subscription {
    return this.postForm(formData, null, AddPublicFormUrl);
  }

  postPrivateForm(formData: FormInterventionData, id: string | null): Subscription {
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

  private onPostSuccess(response: any) {
    const snackBarRef = this.openSnackBar('Twoje zgłoszenie zostało przyjęte!', 'OK!');
    snackBarRef.afterDismissed().subscribe(() => {
      this.router.navigateByUrl('');
    });
  }

  private onPostError(response: any) {
    this.openSnackBar('Niestety, nie udało się przyjąć Twojego zgłoszenia!', 'Zamknij');
  }

  private openSnackBar(message: string, action: string) {
    return this.snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
    });
  }
}
