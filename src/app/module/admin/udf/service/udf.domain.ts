export class UDFDomain {
    id: number;
    name: String;
    code: number;
    module: string;
    userDefinedFields: UserDefinedField[]
}

export class UserDefinedField {

    id: number;
    name: string;
    label: string;
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
    userDefinedFieldDomainDataList: UserDefinedFieldDomainData[];
    serviceEndpointName: string;
    isServiceEndpoint: boolean;
    udfProfileId: number;
    isConditionallyAppearance: boolean;
    fieldAppearanceLogics: FieldAppearanceLogic[];
    fieldGroup: string;
    labelOfServiceEndpoint: string;
    valueOfServiceEndpoint: string;
    validationExpression: string;
}
export class UserDefinedFieldDomainData {
    id: number;
    value: string;
    label: string;
    orderNo: number;
    userDefinedFieldId: number;
    dependentData: string;
}

export class FieldAppearanceLogic {
    id: number;
    dependentFieldId: number;
    userDefinedFieldId: number;
    userDefinedFieldName: number;
    logicType: string;
    value: string;
    paramKeyword: string
}

