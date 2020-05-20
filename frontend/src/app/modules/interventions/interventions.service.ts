import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { forkJoin, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { SnackBarManager } from '@shared/services/snack-bar-manager';
import {
  Attachment,
  Intervention,
  InterventionsFilter,
  RawServerIntervention,
} from '@shared/domain/intervention.model';
import { InterventionsApiUrlsFactory } from '@shared/interventions-api-urls.factory';

@Injectable()
export class InterventionsService {
  constructor(private http: HttpClient, private snackBar: SnackBarManager) {}

  getInterventions(params: InterventionsFilter = {}): Observable<Intervention[]> {
    return this.fetchInterventions(params);
  }

  private fetchInterventions(params: InterventionsFilter): Observable<Intervention[]> {
    return this.http
      .get<any>(InterventionsApiUrlsFactory.interventions, {
        params: params as HttpParams,
      })
      .pipe(
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

  /**
   * Programmatically downloads and opens save dialog for the attachment.
   *
   * This is needed because simply clicking on anchor tag by the user is not enough and will reject with 401 unauthorized.
   * We need to send x-functions-key in request's header - it is added automatically by HttpInterceptor.
   */
  downloadAttachment(interventionId: string, file: Attachment): Observable<Blob> {
    return this.http
      .get(InterventionsApiUrlsFactory.attachment(interventionId, file.id), { responseType: 'blob' })
      .pipe(tap(blob => saveBlobToDisk(blob, file.name)));
  }

  deleteAttachment(interventionId: string, file: Attachment): Observable<any> {
    return this.http.delete(InterventionsApiUrlsFactory.attachment(interventionId, file.id)).pipe(
      this.snackBar.successFailurePipe({
        successMsg: 'Plik usunięto',
        errorMsg: 'Błąd przy usuwaniu pliku',
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

const saveBlobToDisk = (blob: Blob, name: string) => {
  const dataUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = name;
  a.click();
  URL.revokeObjectURL(dataUrl);
};
