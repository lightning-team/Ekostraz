import { environment } from '@environment';

export class InterventionsApiUrlsFactory {
  static interventions = environment.APIUrl + 'interventions/30/40';
  static intervention = (id: string) => `${InterventionsApiUrlsFactory.interventions}/${id}`;
  static comments = (interventionId: string) => `${InterventionsApiUrlsFactory.intervention(interventionId)}/comments`;
  static attachments = (interventionId: string) =>
    `${InterventionsApiUrlsFactory.intervention(interventionId)}/attachments`;
  static attachment = (interventionId: string, blobId: string) =>
    `${InterventionsApiUrlsFactory.attachments(interventionId)}/${blobId}`;
}
