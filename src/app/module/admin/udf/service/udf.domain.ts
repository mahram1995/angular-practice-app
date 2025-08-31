export class UDFDomain {
    id: number;
    name: String;
    code: number;
    module: string;
    userDefinedFields: UserDefinedFields[]
}

export class UserDefinedFields {

    id: string;
    name: string;
    styleClass: string;
    maximumLength: number;
    minimumLength: number;
    minimumDate: string;
    miximumDate: string;
    regularExpression: string;
    dataType: string;
    singleData: boolean;
    multipleSelection: boolean;
    mandatory: boolean;
    orderNo: number;
    userDefinedFieldDomainDataList: UserDefinedFieldDomainDataList[];
    serviceEndpoint: string;
    dataDetailsEndpoint: string;
    userDefinedFieldProfileId: 102631;
    label: string;
    conditionallyAppearance: boolean;
    fieldAppearanceLogics: FieldAppearanceLogics[];
    fieldGroup: string;
    labelOfServiceEndpoint: string;
    valueOfServiceEndpoint: string;
    validationExpression: string;
}
export class UserDefinedFieldDomainDataList {
    id: number;
    value: string;
    label: string;
    order: number;
    dependentData: string;
}

export class FieldAppearanceLogics {
    id: number;
    dependentFieldId: number;
    userDefinedFieldId: number;
    userDefinedFieldName: number;
    logicType: string;
    value: string;
    paramKeyword: string
}

