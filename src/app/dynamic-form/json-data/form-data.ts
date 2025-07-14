export let UDFFormData = {
    "id": 102634,
    "name": "Import Bill Outstanding",
    "code": "102634",
    "userDefinedFields": [
        {
            "id": 3001217003693,
            "name": "PEDATE",
            "styleClass": "col-md-4",
            "maximumLength": 0,
            "minimumLength": 0,
            "regularExpression": null,
            "dataType": "DATE",
            "singleData": false,
            "multipleSelection": false,
            "mandatory": true,
            "order": 12,
            "userDefinedFieldDomainDataList": [],
            "serviceEndpoint": null,
            "dataDetailsEndpoint": null,
            "userDefinedFieldProfileId": 102634,
            "label": "To Date",
            "conditionallyAppearance": true,
            "fieldAppearanceLogics": [
                {
                    "id": 1742,
                    "dependentFieldId": 3001217003694,
                    "userDefinedFieldId": 3001217003693,
                    "logicType": "EQUAL",
                    "value": "OUTSTANDING",
                    "paramKeyword": null
                }
            ],
            "fieldGroup": "Miscellaneous",
            "labelOfServiceEndpoint": null,
            "valueOfServiceEndpoint": null,
            "validationExpression": null
        },
        {
            "id": 30012170037000,
            "name": "PRODUCT_ONE_TWO",
            "styleClass": "col-md-4",
            "maximumLength": 0,
            "minimumLength": 0,
            "regularExpression": null,
            "dataType": "DATE",
            "singleData": false,
            "multipleSelection": false,
            "mandatory": true,
            "order": 25,
            "userDefinedFieldDomainDataList": [],
            "serviceEndpoint": null,
            "dataDetailsEndpoint": null,
            "userDefinedFieldProfileId": 102631,
            "label": "Proudct One and Two",
            "conditionallyAppearance": true,
            "fieldAppearanceLogics": [
                {
                    "id": 1774,
                    "dependentFieldId": 30012170037001,
                    "userDefinedFieldId": 30012170037000,
                    "logicType": "IN",
                    "value": "1,2",
                    "paramKeyword": null
                },
                {
                    "id": 1742,
                    "dependentFieldId": 3001217003694,
                    "userDefinedFieldId": 30012170037000,
                    "logicType": "EQUAL",
                    "value": "OUTSTANDING",
                    "paramKeyword": null
                }
            ],
            "fieldGroup": "Miscellaneous",
            "labelOfServiceEndpoint": null,
            "valueOfServiceEndpoint": null,
            "validationExpression": null
        },
        {
            "id": 30012170037002,
            "name": "PRODUCT_AB_XX",
            "styleClass": "col-md-4",
            "maximumLength": 0,
            "minimumLength": 0,
            "regularExpression": null,
            "dataType": "DATE",
            "singleData": false,
            "multipleSelection": false,
            "mandatory": true,
            "order": 26,
            "userDefinedFieldDomainDataList": [],
            "serviceEndpoint": null,
            "dataDetailsEndpoint": null,
            "userDefinedFieldProfileId": 102631,
            "label": "Proudct AB and XX",
            "conditionallyAppearance": true,
            "fieldAppearanceLogics": [
                {
                    "id": 1780,
                    "dependentFieldId": 30012170037001,
                    "userDefinedFieldId": 30012170037002,
                    "logicType": "IN",
                    "value": "{'AB','XX'}",
                    "paramKeyword": null
                },
                {
                    "id": 1781,
                    "dependentFieldId": 3001217003694,
                    "userDefinedFieldId": 30012170037002,
                    "logicType": "EQUAL",
                    "value": "OVERDUE",
                    "paramKeyword": null
                }
            ],
            "fieldGroup": "Miscellaneous",
            "labelOfServiceEndpoint": null,
            "valueOfServiceEndpoint": null,
            "validationExpression": null
        },

        {
            "id": 3001217003694,
            "name": "REPORT_TYPE",
            "styleClass": "col-md-4",
            "maximumLength": 0,
            "minimumLength": 0,
            "regularExpression": null,
            "dataType": "DROP_DOWN",
            "singleData": false,
            "multipleSelection": false,
            "mandatory": true,
            "order": 8,
            "userDefinedFieldDomainDataList": [
                {
                    "id": 10168204377,
                    "value": "OUTSTANDING",
                    "label": "Outstanding",
                    "order": 1,
                    "dependentData": null
                },
                {
                    "id": 10168204378,
                    "value": "OVERDUE",
                    "label": "Overdue",
                    "order": 2,
                    "dependentData": null
                }

            ],
            "serviceEndpoint": null,
            "dataDetailsEndpoint": null,
            "userDefinedFieldProfileId": 102634,
            "label": "Report Type",
            "conditionallyAppearance": false,
            "fieldAppearanceLogics": [],
            "fieldGroup": "Miscellaneous",
            "labelOfServiceEndpoint": null,
            "valueOfServiceEndpoint": null,
            "validationExpression": null
        },
        {
            "id": 30012170037001,
            "name": "PRODUCT_NUMBER",
            "styleClass": "col-md-4",
            "maximumLength": 0,
            "minimumLength": 0,
            "regularExpression": null,
            "dataType": "DROP_DOWN",
            "singleData": false,
            "multipleSelection": false,
            "mandatory": false,
            "order": 18,
            "userDefinedFieldDomainDataList": [
                {
                    "id": 10168204371,
                    "value": "1",
                    "label": "1",
                    "order": 1,
                    "dependentData": null
                },
                {
                    "id": 10168204374,
                    "value": "2",
                    "label": "2",
                    "order": 2,
                    "dependentData": null
                },
                {
                    "id": 10168204372,
                    "value": "AB",
                    "label": "AB",
                    "order": 2,
                    "dependentData": null
                },
                {
                    "id": 10168204373,
                    "value": "XX",
                    "label": "XX",
                    "order": 3,
                    "dependentData": null
                }


            ],
            "serviceEndpoint": null,
            "dataDetailsEndpoint": null,
            "userDefinedFieldProfileId": 102634,
            "label": "Product Number",
            "conditionallyAppearance": false,
            "fieldAppearanceLogics": [],
            "fieldGroup": "Miscellaneous",
            "labelOfServiceEndpoint": null,
            "valueOfServiceEndpoint": null,
            "validationExpression": null
        },
        {
            "id": 3001217003702,
            "name": "PDATE_TYPE",
            "styleClass": "col-md-4",
            "maximumLength": 0,
            "minimumLength": 0,
            "regularExpression": null,
            "dataType": "DROP_DOWN",
            "singleData": false,
            "multipleSelection": false,
            "mandatory": true,
            "order": 9,
            "userDefinedFieldDomainDataList": [
                {
                    "id": 10168204379,
                    "value": "BETWEEN_MATURITY_DATE",
                    "label": "Between Maturity Date ",
                    "order": 2,
                    "dependentData": "OUTSTANDING"
                },
                {
                    "id": 10168204380,
                    "value": "BETWEEN_ISSUE_DATE",
                    "label": "Between Issue Date",
                    "order": 1,
                    "dependentData": "OUTSTANDING"
                }
            ],
            "serviceEndpoint": null,
            "dataDetailsEndpoint": null,
            "userDefinedFieldProfileId": 102634,
            "label": "Date Type ",
            "conditionallyAppearance": true,
            "fieldAppearanceLogics": [
                {
                    "id": 1740,
                    "dependentFieldId": 3001217003694,
                    "userDefinedFieldId": 3001217003702,
                    "logicType": "EQUAL",
                    "value": "OUTSTANDING",
                    "paramKeyword": null
                }
            ],
            "fieldGroup": "Miscellaneous",
            "labelOfServiceEndpoint": null,
            "valueOfServiceEndpoint": null,
            "validationExpression": null
        },
        {
            "id": 3001217003695,
            "name": "PLC_ID",
            "styleClass": "col-md-4",
            "maximumLength": 5,
            "minimumLength": 5,
            "regularExpression": null,
            "dataType": "DROP_DOWN",
            "singleData": false,
            "multipleSelection": false,
            "mandatory": false,
            "order": 5,
            "userDefinedFieldDomainDataList": [],
            "serviceEndpoint": "admin/customer/searchCustomer?page=false&cusId={PCUSTOMER_ID}&branchId={PBRANCH_ID}",
            "dataDetailsEndpoint": null,
            "userDefinedFieldProfileId": 102634,
            "label": "LC Number",
            "conditionallyAppearance": true,
            "fieldAppearanceLogics": [
                {
                    "id": 1745,
                    "dependentFieldId": 3001217003699,
                    "userDefinedFieldId": 3001217003695,
                    "logicType": "NON_EMPTY",
                    "value": null,
                    "paramKeyword": "PCUSTOMER_ID"
                },
                {
                    "id": 1746,
                    "dependentFieldId": 3001217003698,
                    "userDefinedFieldId": 3001217003695,
                    "logicType": "NON_EMPTY",
                    "value": null,
                    "paramKeyword": "PBRANCH_ID"
                }
            ],
            "fieldGroup": "Miscellaneous",
            "labelOfServiceEndpoint": "cusName",
            "valueOfServiceEndpoint": "cusId",
            "validationExpression": null
        },
        {
            "id": 3001217003696,
            "name": "PBILL_NUMBER",
            "styleClass": "col-md-4",
            "maximumLength": 50,
            "minimumLength": 1,
            "regularExpression": null,
            "dataType": "CHAR",
            "singleData": false,
            "multipleSelection": false,
            "mandatory": false,
            "order": 6,
            "userDefinedFieldDomainDataList": [],
            "serviceEndpoint": null,
            "dataDetailsEndpoint": null,
            "userDefinedFieldProfileId": 102634,
            "label": "Bill Number",
            "conditionallyAppearance": false,
            "fieldAppearanceLogics": [],
            "fieldGroup": "Miscellaneous",
            "labelOfServiceEndpoint": null,
            "valueOfServiceEndpoint": null,
            "validationExpression": null
        },
        {
            "id": 3001217003697,
            "name": "POWN_BRANCH",
            "styleClass": "col-md-4",
            "maximumLength": 0,
            "minimumLength": 0,
            "regularExpression": null,
            "dataType": "DROP_DOWN",
            "singleData": false,
            "multipleSelection": false,
            "mandatory": true,
            "order": 2,
            "userDefinedFieldDomainDataList": [
                {
                    "id": 10168204374,
                    "value": "0",
                    "label": "Own",
                    "order": 1,
                    "dependentData": null
                },
                {
                    "id": 10168204375,
                    "value": "1",
                    "label": "Other",
                    "order": 2,
                    "dependentData": null
                },
                {
                    "id": 10168204376,
                    "value": "2",
                    "label": "All",
                    "order": 3,
                    "dependentData": null
                }
            ],
            "serviceEndpoint": null,
            "dataDetailsEndpoint": null,
            "userDefinedFieldProfileId": 102634,
            "label": "Customer Branch",
            "conditionallyAppearance": false,
            "fieldAppearanceLogics": [],
            "fieldGroup": "Miscellaneous",
            "labelOfServiceEndpoint": null,
            "valueOfServiceEndpoint": null,
            "validationExpression": null
        },
        {
            "id": 3001217003698,
            "name": "PBRANCH_ID",
            "styleClass": "col-md-4",
            "maximumLength": 0,
            "minimumLength": 0,
            "regularExpression": null,
            "dataType": "DROP_DOWN",
            "singleData": false,
            "multipleSelection": false,
            "mandatory": true,
            "order": 1,
            "userDefinedFieldDomainDataList": [],
            "serviceEndpoint": "admin/branch/get-branch?asPage=false",
            "dataDetailsEndpoint": null,
            "userDefinedFieldProfileId": 102634,
            "label": "Branch No.",
            "conditionallyAppearance": false,
            "fieldAppearanceLogics": [],
            "fieldGroup": "Miscellaneous",
            "labelOfServiceEndpoint": "name",
            "valueOfServiceEndpoint": "branchId",
            "validationExpression": null
        },
        {
            "id": 3001217003699,
            "name": "PCUSTOMER_ID",
            "styleClass": "col-md-4",
            "maximumLength": 0,
            "minimumLength": 0,
            "regularExpression": null,
            "dataType": "DROP_DOWN",
            "singleData": false,
            "multipleSelection": false,
            "mandatory": false,
            "order": 3,
            "userDefinedFieldDomainDataList": [],
            "serviceEndpoint": "admin/customer/searchCustomer?page=false&branchId={PBRANCH_ID}",
            "dataDetailsEndpoint": null,
            "userDefinedFieldProfileId": 102634,
            "label": "Customer",
            "conditionallyAppearance": true,
            "fieldAppearanceLogics": [
                {
                    "id": 1744,
                    "dependentFieldId": 3001217003698,
                    "userDefinedFieldId": 3001217003699,
                    "logicType": "NON_EMPTY",
                    "value": null,
                    "paramKeyword": "PBRANCH_ID"
                }
            ],
            "fieldGroup": "Miscellaneous",
            "labelOfServiceEndpoint": "cusName",
            "valueOfServiceEndpoint": "cusId",
            "validationExpression": null
        },
        {
            "id": 3001217003700,
            "name": "PDATE_AS_ON",
            "styleClass": "col-md-4",
            "maximumLength": 0,
            "minimumLength": 0,
            "regularExpression": null,
            "dataType": "DATE",
            "singleData": false,
            "multipleSelection": false,
            "mandatory": true,
            "order": 11,
            "userDefinedFieldDomainDataList": [],
            "serviceEndpoint": null,
            "dataDetailsEndpoint": null,
            "userDefinedFieldProfileId": 102634,
            "label": "Date As on",
            "conditionallyAppearance": true,
            "fieldAppearanceLogics": [
                {
                    "id": 1741,
                    "dependentFieldId": 3001217003694,
                    "userDefinedFieldId": 3001217003700,
                    "logicType": "EQUAL",
                    "value": "OVERDUE",
                    "paramKeyword": null
                }
            ],
            "fieldGroup": "Miscellaneous",
            "labelOfServiceEndpoint": null,
            "valueOfServiceEndpoint": null,
            "validationExpression": null
        },
        {
            "id": 3001217003701,
            "name": "PPRODUCT_ID",
            "styleClass": "col-md-4",
            "maximumLength": 0,
            "minimumLength": 0,
            "regularExpression": null,
            "dataType": "DROP_DOWN",
            "singleData": false,
            "multipleSelection": false,
            "mandatory": false,
            "order": 4,
            "userDefinedFieldDomainDataList": [],
            "serviceEndpoint": "/ababil-tf-admin/product/all?asPage=false",
            "dataDetailsEndpoint": null,
            "userDefinedFieldProfileId": 102634,
            "label": "Product",
            "conditionallyAppearance": false,
            "fieldAppearanceLogics": [],
            "fieldGroup": "Miscellaneous",
            "labelOfServiceEndpoint": "productName",
            "valueOfServiceEndpoint": "productId",
            "validationExpression": null
        },
        {
            "id": 3001217003703,
            "name": "PSDATE",
            "styleClass": "col-md-4",
            "maximumLength": 0,
            "minimumLength": 0,
            "regularExpression": null,
            "dataType": "DATE",
            "singleData": false,
            "multipleSelection": false,
            "mandatory": true,
            "order": 10,
            "userDefinedFieldDomainDataList": [],
            "serviceEndpoint": null,
            "dataDetailsEndpoint": null,
            "userDefinedFieldProfileId": 102634,
            "label": "From Date",
            "conditionallyAppearance": true,
            "fieldAppearanceLogics": [
                {
                    "id": 1743,
                    "dependentFieldId": 3001217003694,
                    "userDefinedFieldId": 3001217003703,
                    "logicType": "EQUAL",
                    "value": "OUTSTANDING",
                    "paramKeyword": null
                }
            ],
            "fieldGroup": "Miscellaneous",
            "labelOfServiceEndpoint": null,
            "valueOfServiceEndpoint": null,
            "validationExpression": null
        }
    ]
}