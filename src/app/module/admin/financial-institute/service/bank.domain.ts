
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
    ownBank: boolean;
}


export let OnerType = [
    { label: 'Select a owner type', value: null },
    { label: 'PRIVATE', value: 1 },
    { label: 'PUBLIC', value: 2 }
];

export let InstitutionType = [
    { label: 'Bank', value: 'Bank' },
    { label: 'Financial Institution', value: "Financial Institution" }
];
export let OnwrshipType = [
    { label: 'Government', value: 'Government' },
    { label: 'Private', value: 'Private' },
    { label: 'Government and Private', value: 'Government and Private' }
];


