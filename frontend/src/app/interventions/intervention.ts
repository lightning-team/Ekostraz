import { InterventionStatus } from './intervention.status';

export class ServerIntervention {
    public Id: string;
    public CreationDate: Date;
    public Description: string;
    public FullName: string;
    public PhoneNumber: number;
    public Email: string;
    public Address: string;
    public Status: InterventionStatus;

    constructor(data: any) {
        this.Id = data.Id || null;
        this.CreationDate = data.CreationDate || new Date().toISOString();
        this.Address = data.Address || '';
        this.Email = data.Email || '';
        this.FullName = data.FullName || 'Anonim';
        this.Description = data.Description || 'Default description';
        this.PhoneNumber = data.PhoneNumber || '';
        this.Status = data.Status || InterventionStatus.ToVerify;
    }
}