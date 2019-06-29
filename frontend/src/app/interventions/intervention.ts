export class Intervention {
    constructor(data: any) {
        this.CreationDate = data.CreationDate || new Date().toUTCString();
        this.Adress = data.Adress || "";
        this.Email = data.Email || "";
        this.FullName = data.FullName || "Anonim";
        this.PhoneNumber = data.PhoneNumber || "";
        this.Status = data.Status || InterventionStatus.ToVerify
    }

    public Id: string;

        public CreationDate: Date

        public FullName: string 

        public PhoneNumber: number

        public Email: string 

        public Adress: string

        public Status: InterventionStatus  
}