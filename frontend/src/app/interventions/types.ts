import {InterventionStatus} from './intervention.status';

export interface FormInterventionData {
    date: string;
    name: string;
    description: string;
    phone: string;
    email: string;
    status: InterventionStatus;
    address: { number: string; city: string; street: string };
}

export class PostInterventionData {
    Id: string;
    /** Date in Date().toISOString() format */
    CreationDate: string;
    Description: string;
    FullName: string;
    PhoneNumber: string;
    Email: string;
    /** Address string formatted as: "{street}, {number}, {city}" */
    Address: string;
    Status: InterventionStatus;

    // TBD
    // GeoLat: number;
    // GeoLng: number;

    constructor(formData: FormInterventionData, id = null) {
        this.Id = id;
        this.CreationDate = formData.date || new Date().toISOString();
        this.Description = formData.description;
        this.FullName = formData.name;
        this.PhoneNumber = formData.phone;
        this.Email = formData.email;
        this.Address = PostInterventionData.getAddress(formData.address);
        this.Status = formData.status || InterventionStatus.ToVerify;
    }

    private static getAddress(address: {street: string, number: string, city: string}) {
        return`${address.street}, ${address.number}, ${address.city}`;
    }
}

export class ClientIntervention {
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
        this.status = rawIntervention.status as InterventionStatus || InterventionStatus.ToVerify;
        this.phone = rawIntervention.phoneNumber;
        this.email = rawIntervention.email;
        this.creationDate = rawIntervention.creationDate;
        this.description = rawIntervention.description;
        this.geoLat = rawIntervention.geoLat || null;
        this.geoLng = rawIntervention.geoLng || null;
    }
}

export interface ListIntervention extends ClientIntervention {
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
        intervention: ClientIntervention,
    };
}

export interface InterventionListRouterState {
    state: {
        interventions: ClientIntervention[],
    };
}
