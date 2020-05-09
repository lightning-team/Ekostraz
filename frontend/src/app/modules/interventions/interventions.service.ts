import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { forkJoin, Observable} from 'rxjs';
import { map } from 'rxjs/operators';

import { SnackBarManager } from '@shared/services/snack-bar-manager';
import { Attachment, Intervention, InterventionsFilter, RawServerIntervention } from '@shared/domain/intervention.model';
import { InterventionsApiUrlsFactory } from '@shared/interventions-api-urls.factory';

@Injectable()
export class InterventionsService {
  constructor(private http: HttpClient, private snackBar: SnackBarManager) {}

  getInterventions(params: InterventionsFilter = {}): Observable<Intervention[]> {
    return this.fetchInterventions(params);
  }

  private fetchInterventions(params: InterventionsFilter): Observable<Intervention[]> {
    return this.http.get<any>(InterventionsApiUrlsFactory.interventions, {
      params: params as HttpParams,
    }).pipe(
      map(data => data.map(toIntervention)),
      this.snackBar.failurePipe(),
    );
  }

  getIntervention(id: string): Observable<Intervention> {
    return forkJoin([
      this.http.get<RawServerIntervention>(InterventionsApiUrlsFactory.intervention(id)).pipe(map(toIntervention)),
      this.http.get<Attachment[]>(InterventionsApiUrlsFactory.attachments(id)),
    ]).pipe(map(toInterventionWithAttachments), this.snackBar.failurePipe());
  }

  submitComment(comment: string, id: string): Observable<any> {
    return this.http
      .post(InterventionsApiUrlsFactory.comments(id), {
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

const toInterventionWithAttachments = ([intervention, attachments]: [Intervention, Attachment[]]): Intervention => {
  intervention.attachments = attachments || [];
  return intervention;
};
