import { InterventionStatus } from '@shared/intervention.status';

export interface InterventionFormData {
  id: string | null | undefined;
  date: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  status: InterventionStatus;
  address: { number: string; city: string; street: string };
}

export class InterventionPostData {
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

  constructor(formData: InterventionFormData) {
    this.Id = formData.id;
    this.CreationDate = formData.date || new Date().toISOString();
    this.Description = formData.description;
    this.FullName = formData.name;
    this.PhoneNumber = formData.phone;
    this.Email = formData.email;
    this.Address = InterventionPostData.getAddress(formData.address);
    this.Status = formData.status || InterventionStatus.ToVerify;
  }

  private static getAddress(address: { street: string; number: string; city: string }) {
    return `${address.street}, ${address.number}, ${address.city}`;
  }
}
