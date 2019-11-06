import { InterventionStatus } from '@shared/intervention.status';

export class Intervention {
  id: string;
  /** Address string formatted as: "{street}, {number}, {city}" */
  address: string;
  fullName: string;
  status: InterventionStatus;
  phone: string;
  email: string;
  /** Date in Date().toISOString() format */
  creationDate: string;
  description: string;

  /** Map coordinates */
  geoLat: number;
  geoLng: number;

  constructor(rawIntervention: RawServerIntervention) {
    this.id = rawIntervention.id;
    this.address = rawIntervention.address;
    this.fullName = rawIntervention.fullName;
    // TODO: Fix statuses either on backend or here
    this.status = (rawIntervention.status as InterventionStatus) || InterventionStatus.ToVerify;
    this.phone = rawIntervention.phoneNumber;
    this.email = rawIntervention.email;
    this.creationDate = rawIntervention.creationDate;
    this.description = rawIntervention.description;
    this.geoLat = rawIntervention.geoLat || null;
    this.geoLng = rawIntervention.geoLng || null;
  }
}

export interface ListIntervention extends Intervention {
  /** List position */
  position: number;
}

export interface RawServerIntervention {
  id: string;
  /** Date in Date().toISOString() format */
  creationDate: string;
  address: string;
  email: string;
  fullName: string;
  description: string;
  phoneNumber: string;
  status: string; // TODO: Check raw status.
  geoLat: number | null;
  geoLng: number | null;
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
