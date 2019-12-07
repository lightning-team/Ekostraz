import { InterventionStatus } from '@shared/domain/intervention.status';

export interface InterventionFormData {
  id: string | null;
  date: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  status: InterventionStatus;
  address: { number: string; city: string; street: string };
}

export class InterventionPostData {
  id: string;
  description: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string; /** Address string formatted as: "{street}, {number}, {city}" */
  status: InterventionStatus;

  constructor(formData: InterventionFormData) {
    this.id = formData.id;
    this.description = formData.description;
    this.fullName = formData.name;
    this.phoneNumber = formData.phone;
    this.email = formData.email;
    this.address = InterventionPostData.convertFormAddress(formData.address);
    this.status = formData.status;
  }

  private static convertFormAddress(address: { street: string; number: string; city: string }) {
    return `${address.street}, ${address.number}, ${address.city}`;
  }
}
