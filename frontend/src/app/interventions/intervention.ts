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
        this.Id = data.id || null;
        this.CreationDate = data.creationDate || new Date().toISOString();
        this.Address = data.address || '';
        this.Email = data.email || '';
        this.FullName = data.fullName || 'Anonim';
        this.Description = data.description || 'Default description';
        this.PhoneNumber = data.phoneNumber || '';
        this.Status = data.status || InterventionStatus.ToVerify;
        this.GeoLat = data.geoLat || null;
        this.GeoLng = data.geoLng || null;
    }
}

export class ClientIntervention {
    id: string;
    position: number;
    address: string;
    name: string;
    status: string;
    phone: string;
    email: string;
    date: string;
    description: string;
    geolat: number;
    geolng: number;

    constructor(data: ServerIntervention, index: number = 0) {
        this.id = data.Id;
        this.position = index + 1;
        this.address = data.Address;
        this.name = data.FullName;
        this.status = data.Status;
        this.phone = data.PhoneNumber;
        this.email = data.Email;
        this.date = data.CreationDate;
        this.description = data.Description;
        this.geolat = data.GeoLat;
        this.geolng = data.GeoLng;
    }
}
