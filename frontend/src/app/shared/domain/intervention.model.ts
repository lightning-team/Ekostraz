import { InterventionStatus } from '@shared/domain/intervention.status';

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

export interface RawServerIntervention extends InterventionFormData {
  modificationDate: string;
  geoLat: number;
  geoLng: number;
}

export interface Intervention extends RawServerIntervention {
  address: string;
}

export interface ListIntervention extends Intervention {
  position: number; // list position
}

export interface InterventionRouterState {
  state: {
    intervention: Intervention;
  };
}

export interface InterventionListRouterState {
  state: {
    interventions: Intervention[];
  };
}
