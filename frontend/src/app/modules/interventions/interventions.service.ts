import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environment';
import { SnackBarManager } from '@shared/services/snack-bar-manager';
import { Intervention, InterventionsFilter, RawServerIntervention } from '@shared/domain/intervention.model';

@Injectable()
export class InterventionsService {
  private interventionsUrl = environment.APIUrl + 'interventions';

  constructor(private http: HttpClient, private snackBar: SnackBarManager) {}

  getInterventions(params: InterventionsFilter = {}): Observable<Intervention[]> {
    return this.fetchInterventions(params);
  }

  private fetchInterventions(params: InterventionsFilter): Observable<Intervention[]> {
    return this.http
      .get<any>(this.interventionsUrl, {
        params: params as HttpParams,
      })
      .pipe(
        map(data => data.map(toIntervention)),
        this.snackBar.failurePipe(),
      );
  }

  getIntervention(id: string): Observable<Intervention> {
    return this.http
      .get<RawServerIntervention>(`${this.interventionsUrl}/${id}`)
      .pipe(map(toIntervention), this.snackBar.failurePipe());
  }

  submitComment(comment: string, id: string): Observable<any> {
    return this.http
      .post(`${this.interventionsUrl}/${id}/comments`, {
        comment,
      })
      .pipe(
        this.snackBar.successFailurePipe({
          successMsg: 'Komentarz dodany',
          errorMsg: 'Błąd przy dodawaniu komentarza',
        }),
      );
  }
}

const toIntervention = (rawIntervention: RawServerIntervention): Intervention => ({
  ...rawIntervention,
  address: `${rawIntervention.street}, ${rawIntervention.streetNumber}, ${rawIntervention.city}`,
});
