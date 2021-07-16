import { InterventionStatus } from '@shared/domain/intervention.status';

export enum SortDirection {
  Ascending,
  Descending,
}

export interface InterventionFormData {
  id: string;
  /** Date in Date().toISOString() format */
  creationDate: string;
  fullName: string;
  description: string;
  phoneNumber: string;
  email: string;
  city: string;
  street: string;
  streetNumber: string;
  status: InterventionStatus;
}

export interface Comment {
  id: string;
  comment: string;
  createdDate: string;
}

export interface Attachment {
  id: string;
  name: string; // original file name
  size: number;
  type: string; // content type
}

export interface RawServerIntervention extends InterventionFormData {
  modificationDate: string;
  geoLat: number;
  geoLng: number;
  comments?: Comment[]; // Only for InterventionDetails
}

export interface Intervention extends RawServerIntervention {
  address: string;
  attachments?: Attachment[]; // Only for InterventionDetails
}

export interface InterventionListResponse {
  totalCount: number;
  results: Intervention[];
}

export interface ListIntervention extends Intervention {
  position: number; // list position
}

export interface InterventionsFilter {
  statuses?: InterventionStatus[];
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
}
