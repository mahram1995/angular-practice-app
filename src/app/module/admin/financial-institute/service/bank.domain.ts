
export class BankInformation {
    bank: Bank
    headers: Headers
}

export class Bank {
    id: number;
    isActive: boolean;
    financialInstitutionType: string;
    bankCode: string;
    bankName: string;
    bankSortName: string;
    ownerType: string;
    website: string;
    swiftCode: string;
    centralBankCode: string;
    addressLine1: string;
    addressLine2: string;
    districtCode: string;
    divisionCode: string;
    upozilaCode: string;
    countryCode: string;
    postCode: string;
    houseNo: string;
    roadNo: string;
    villageName: string;
    state: string;
    cityName: string;
    postOffice: string;
    zipCode: string;
    ownBank: boolean;
}


export let OnerType = [
    { label: 'Select a owner type', value: null },
    { label: 'PRIVATE', value: 1 },
    { label: 'PUBLIC', value: 2 }
];

export let InstitutionType = [
    { label: 'Select a institution type', value: null },
    { label: 'Bank', value: 'Bank' },
    { label: 'Financial Institution', value: "Financial Institution" }
];
export let OnwrshipType = [
    { label: 'Select a Ownership type', value: null },
    { label: 'Government', value: 'Government' },
    { label: 'Private', value: 'Private' },
    { label: 'Government and Private', value: 'Government and Private' }
];

export let Countries = [
    { label: 'Select a Country', value: null },
    { label: 'Bangladesh', value: 'Bangladesh' },
    { label: 'India', value: 'India' },
    { label: 'Pakistan', value: 'Pakistan' }
];

export class Branch {
    id: number;
    adCode!: string;
    address!: string;
    addressLine!: string;
    bankId!: number;
    branchId!: number;
    countryCode!: string;
    districtCode!: string;
    divisionCode!: string;
    email!: string;
    houseNo!: string;
    isActive!: boolean;
    isHeadOffice!: boolean;
    isOnline!: boolean;
    mobileNumber!: string;
    name!: string;
    phoneNumber!: string;
    postCode!: string;
    roadNo!: string;
    routingNumber!: string;
    status!: string;
    swiftCode!: string;
    upazillaCode!: string;
    villageName!: string;

    constructor(init?: Partial<Branch>) {
        Object.assign(this, init);
    }
}


