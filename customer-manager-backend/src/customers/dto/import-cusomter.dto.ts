export class ImportCustomerDto {
    fullName: string;
    phoneNumber: string;
    status: string;
    callCountNumber: number;
    totalOrder: number;
    lastConnected: string;
    group: string;
    source: string;
    street?: string;
    userInCharge: string;
}