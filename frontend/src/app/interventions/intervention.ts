import { InterventionStatus } from './intervention.status';

export class ServerIntervention {
    public Id: string;
    public CreationDate: string;
    public Description: string;
    public FullName: string;
    public PhoneNumber: string;
    public Email: string;
    public Address: string;
    public Status: InterventionStatus;
    public GeoLat: number;
    public GeoLng: number;

    constructor(data: any) {
        this.Id = data.Id || null;
        this.CreationDate = data.CreationDate || new Date().toISOString();
        this.Address = data.Address || '';
        this.Email = data.Email || '';
        this.FullName = data.FullName || 'Anonim';
        this.Description = data.Description || 'Default description';
        this.PhoneNumber = data.PhoneNumber || '';
        this.Status = data.Status || InterventionStatus.ToVerify;
        this.GeoLat = data.GeoLat || null;
        this.GeoLng = data.GeoLng || null;
    }
}

export class ClientIntervention {
    id: string;
    position: number;
    name: string;
    status: string;
    phone: string;
    date: string;
    description: string;
    geolat: number;
    geolng: number;

    constructor(data: ServerIntervention, index: number) {
        this.id = data.Id;
        this.position = index + 1;
        this.name = data.FullName;
        this.status = data.Status;
        this.phone = data.PhoneNumber;
        this.date = data.CreationDate;
        this.description = data.Description;
        this.geolat = data.GeoLat;
        this.geolng = data.GeoLng;
    }
}
