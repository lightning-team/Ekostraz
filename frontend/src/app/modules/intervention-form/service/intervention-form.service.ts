import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { from, Observable } from 'rxjs';

import { InterventionFormData } from '@shared/domain/intervention.model';
import { InterventionsApiUrlsFactory } from '@shared/interventions-api-urls.factory';
import { map, mergeAll } from 'rxjs/operators';

const MAX_CONCURRENT_UPLOADS = 3;

@Injectable()
export class InterventionFormService {
  constructor(private http: HttpClient) {}

  post(formData: InterventionFormData): Observable<any> {
    return this.http.post(InterventionsApiUrlsFactory.interventions, formData);
  }

  update(formData: InterventionFormData): Observable<any> {
    return this.http.put(InterventionsApiUrlsFactory.intervention(formData.id), formData);
  }

  /**
   * Concurrent attachments upload method.
   */
  uploadAttachments(interventionId: string, attachments: File[]): Observable<any> {
    return from(attachments).pipe(
      map(attachment =>
        this.http.post(
          InterventionsApiUrlsFactory.attachments(interventionId),
          attachment,
          contentDispositionHeader(attachment.name),
        ),
      ),
      mergeAll(MAX_CONCURRENT_UPLOADS),
    );
  }
}

const contentDispositionHeader = (filename: string) => ({
  headers: { 'Content-Disposition': `attachment; filename="${filename}"` },
});
