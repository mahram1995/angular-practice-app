import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { UserRegistrationDTO } from '../../service/admin.domain';
import { CommonService } from '../../../../app-configuration/app.service/common.service';
import { AdminService } from '../../service/admin.service';
import { NotificationService } from '../../../../app-configuration/app.service/notification.service';
import { FormBaseComponent } from '../../../../app-configuration/app-component/base-component/form.base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApprovalflowService } from '../../../../admin/approval-flow/service/approval-flow-service';
import { FieldAppearanceLogic, UDFDomain, UserDefinedFieldDomainData, UserDefinedField } from '../service/udf.domain';
import { UDFService } from '../service/udf.service';
import { Table } from 'primeng/table';

const DETAILS_UI = 'admin/udf-details';
const CORRECTION_UI = 'admin/create-udf';
@Component({
    selector: 'create-udf-form',
    templateUrl: './create-udf-form.html',

})
export class CreateUdfFormComponent extends FormBaseComponent implements OnInit {
    @ViewChild('dataTable') dataTable: Table;

    required_field: any = {
        name: 'Parameter Name',
        dataType: 'Data Type',
        orderNo: 'Order No',
        label: 'Label Name',
    };

    domainListRequiredFiled: any = {
        label: 'label',
        value: 'value',
        orderNo: 'order',

    };
    fieldAppLogicRequiredFiled: any = {
        logicType: 'Logic type',
        userDefinedFieldId: 'Dependet Field',
        paramKeyword: 'Param Kyword',

    };
    udfForm: FormGroup;
    domainListForm: FormGroup;
    fieldAppLogicForm: FormGroup;
    userDefinedFieldDomainDataList: UserDefinedFieldDomainData[] = [];
    fieldAppLogicList: FieldAppearanceLogic[] = [];
    message: string = '';

    submitted = false;

    header: string = 'Create New User';
    selectUserDefinedField: UserDefinedField
    selectedUdf: any;
    selectedDependentData: any;
    selectedDoaminData: any;
    udfData: UDFDomain;
    userDefinedFields: UserDefinedField[];
    urlSearchMap: Map<string, any> = new Map();
    profileId: number;
    isRowSelected: boolean = false;
    isServiceEndpoint: boolean = true;
    isFieldAppearanceLogic: boolean = false;
    dependentDataList: any[] = []
    type: string;
    dataType = [
        { label: "CHAR", value: 'CHAR' },
        { label: "DATE", value: 'DATE' },
        { label: "NUMBER", value: 'NUMBER' },
        { label: "BOOLEAN", value: 'BOOLEAN' },
        { label: "DROP_DOWN", value: 'DROP_DOWN' }
    ];

    logicType = []

    constructor(private fb: FormBuilder,
        protected override location: Location,
        protected override commonService: CommonService,
        private notificationService: NotificationService,
        private udfService: UDFService,
        protected override router: Router,
        private route: ActivatedRoute,) {
        super(location, commonService);

    }
    ngOnInit(): void {
        this.fieldAppLogicList = []
        this.route.queryParams.subscribe(params => {
            this.profileId = params.udfProfileId;
            this.fetchUdfs(this.profileId);

        });
        this.prepareForm(new UserDefinedField)
        this.prepareDomainListForm(new UserDefinedFieldDomainData);
        this.prapareFieldappearnceLogicListForm(new FieldAppearanceLogic);
        this.logicType = [
            { label: "Select a logic type", value: "" },
            { label: "EMPTY", value: "EMPTY" },
            { label: "NON_EMPTY", value: "NON_EMPTY" },
            { label: "EQUAL", value: "EQUAL" }, // number and char
            { label: "NOT_EQUAL", value: "NOT_EQUAL" }, // only for number
            { label: "LESS_THAN", value: "LESS_THAN" }, // only for number
            { label: "GREATER_THAN", value: "GREATER_THAN" }, // only for number
            { label: "LESS_THAN_OR_EQUAL", value: "LESS_THAN_OR_EQUAL" }, // only for number
            { label: "GREATER_THAN_OR_EQUAL", value: "GREATER_THAN_OR_EQUAL" }, // only for number
            { label: "IN", value: "IN" }, // number and char
            { label: "NOT_IN", value: "NOT_IN" }, // number and char
            { label: "BETWEEN", value: "BETWEEN" } // number and date
        ];
    }




    fetchUdfs(profileId: any) {
        this.userDefinedFields = []
        this.selectUserDefinedField = new UserDefinedField()
        this.urlSearchMap.set('id', profileId)
        this.udfService.getUdfById(this.urlSearchMap).subscribe(data => {
            this.udfData = data
            this.userDefinedFields = this.commonService.sortByKeyAsc(data.userDefinedFields, 'orderNo')
            this.createDependantDropdownList();
        })
    }

    onRowSelect(event: any) {
        this.fieldAppLogicList = []
        this.isRowSelected = true;
        this.type = event.data.dataType;

        this.selectUserDefinedField = event.data;

        this.preareFiledAppLogictList(this.selectUserDefinedField.fieldAppearanceLogics)
        this.userDefinedFieldDomainDataList = this.commonService.sortByKeyAsc(this.selectUserDefinedField.userDefinedFieldDomainDataList, 'orderNo')
        console.log(this.selectUserDefinedField);

        this.prepareForm(event.data)
        this.prepareDomainListForm(new UserDefinedFieldDomainData)
        this.prapareFieldappearnceLogicListForm(new FieldAppearanceLogic);

        this.isServiceEndpoint = this.selectUserDefinedField.isServiceEndpoint
        this.isFieldAppearanceLogic = this.selectUserDefinedField.isConditionallyAppearance;
    }

    preareFiledAppLogictList(data: any) {
        this.fieldAppLogicList = []
        data.forEach(logic => {
            logic.dependentFieldName = this.userDefinedFields.find(field => field.id == logic.dependentFieldId)?.label
            this.fieldAppLogicList.push(logic)
        });
    }

    onServiceEndpointCheck(event: any) {
        this.isServiceEndpoint = event.target.checked
        if (!this.isServiceEndpoint) {
            const control = this.udfForm.get('serviceEndpointName');
            if (control) {
                control.clearValidators(); // removes all validators, including required
                control.updateValueAndValidity(); // re-checks validation
            }

            this.prepareDomainListForm(new UserDefinedFieldDomainData);
        } else {
            this.udfForm.get('serviceEndpointName')?.setValidators([Validators.required]);
            this.udfForm?.updateValueAndValidity();
        }
    }

    onFieldApearnceCheck(event: any) {
        this.isFieldAppearanceLogic = event.target.checked
        if (!this.isFieldAppearanceLogic) {
            this.prapareFieldappearnceLogicListForm(new FieldAppearanceLogic);
        }
    }


    createDependantDropdownList() {
        this.dependentDataList = []
        this.userDefinedFields.forEach(field => {
            this.dependentDataList.push({
                value: field.id,
                label: field.name
            });
        });
    }

    addDomain() {
        if (!Array.isArray(this.userDefinedFieldDomainDataList)) {
            this.userDefinedFieldDomainDataList = [];
        }
        let customDomainData = new UserDefinedFieldDomainData();

        if (this.commonService.isFormInvalid(this.domainListForm, this.domainListRequiredFiled)) {
            return;
        }
        customDomainData = this.domainListForm.value;
        customDomainData.userDefinedFieldId = this.selectUserDefinedField.id
        this.userDefinedFieldDomainDataList.push(customDomainData)

        this.selectUserDefinedField.userDefinedFieldDomainDataList = this.userDefinedFieldDomainDataList
        this.prepareDomainListForm(new UserDefinedFieldDomainData)
    }

    addAppearanceLogic() {
        let apperanceLogic = new FieldAppearanceLogic();


        if (this.commonService.isFormInvalid(this.fieldAppLogicForm, this.fieldAppLogicRequiredFiled)) {
            return;
        }
        apperanceLogic = this.fieldAppLogicForm.value;
        console.log(apperanceLogic);
        apperanceLogic.userDefinedFieldId = this.selectUserDefinedField.id
        apperanceLogic.dependentFieldName = this.userDefinedFields.find(field => field.id == apperanceLogic.dependentFieldId)?.label
        this.fieldAppLogicList.push(apperanceLogic)
        this.selectUserDefinedField.fieldAppearanceLogics = this.fieldAppLogicList


        this.prapareFieldappearnceLogicListForm(new FieldAppearanceLogic)
    }

    deleteAppearanceLogic(item: FieldAppearanceLogic) {
        // remove from the local list
        this.fieldAppLogicList = this.fieldAppLogicList.filter(f => f.id !== item.id);

    }
    deleteUserDefinedFiled(data: any) {
        this.udfService.deleteUserDifinedFieldById({ id: data.id }).subscribe(data => {
            this.refresh()
            this.notificationService.sendSuccess(data.message);

        })
    }

    refresh() {
        this.fieldAppLogicList = []
        this.userDefinedFieldDomainDataList = []
        this.dataTable.reset();
        this.selectedUdf = null
        this.isServiceEndpoint = true
        this.isRowSelected = false
        this.isFieldAppearanceLogic = false
        this.fetchUdfs(this.profileId)
        this.prepareForm(new UserDefinedField)
        this.prepareDomainListForm(new UserDefinedFieldDomainData);
        this.prapareFieldappearnceLogicListForm(new FieldAppearanceLogic);
    }
    prepareForm(data: UserDefinedField) {
        this.udfForm = this.fb.group({
            id: [data.id],
            name: [data.name, [Validators.required, Validators.pattern(/^[A-Za-z0-9_]+$/)]],
            styleClass: [data.styleClass],
            maximumLength: [data.maximumLength],
            minimumLength: [data.minimumLength],
            minimumDate: [data.minimumDate],
            miximumDate: [data.miximumDate],
            regularExpression: [data.regularExpression],
            dataType: [data.dataType, Validators.required], // you may need to cast/convert if it's actually Date
            singleData: [data.singleData],
            multipleSelection: [data.multipleSelection],
            mandatory: [data.mandatory],
            orderNo: [data.orderNo, Validators.required],
            userDefinedFieldDomainDataList: [data.userDefinedFieldDomainDataList],
            serviceEndpointName: [data.serviceEndpointName],
            isServiceEndpoint: [data.isServiceEndpoint],
            udfProfileId: [data.udfProfileId],
            label: [data.label, Validators.required],
            isConditionallyAppearance: [data.isConditionallyAppearance],
            fieldGroup: [data.fieldGroup],
            labelOfServiceEndpoint: [data.labelOfServiceEndpoint],
            valueOfServiceEndpoint: [data.valueOfServiceEndpoint],
            validationExpression: [data.validationExpression]
        });
    }

    prepareDomainListForm(data: UserDefinedFieldDomainData) {
        this.domainListForm = this.fb.group({
            id: [data.id],
            value: [data.value, Validators.required],
            label: [data.label, Validators.required],
            orderNo: [data.orderNo, Validators.required],
            dependentData: [data.dependentData],
            userDefinedFieldId: [data.userDefinedFieldId],

        });
    }

    prapareFieldappearnceLogicListForm(data: FieldAppearanceLogic) {
        this.fieldAppLogicForm = this.fb.group({
            id: [data.id],
            logicType: [data.logicType, Validators.required],
            dependentFieldId: [data.dependentFieldId, Validators.required],
            dependentFieldName: [data.dependentFieldId],
            paramKeyword: [data.paramKeyword],
            userDefinedFieldId: [data.userDefinedFieldId],
            value: [data.value],

        });
    }

    onDataTypeSeclect(event) {
        this.type = event.value
        if (event.value == 'DROP_DOWN') {
            this.udfForm.get('serviceEndpointName')?.setValidators([Validators.required]);
            this.udfForm.get('isServiceEndpoint')?.setValue(1);
            this.udfForm?.updateValueAndValidity();
        }
        if (this.type == 'CHAR') {

            this.udfForm.get('minimumLength')?.setValidators([Validators.required]);
            this.udfForm.get('maximumLength')?.setValidators([Validators.required]);
            this.udfForm?.updateValueAndValidity();

        }
    }
    addNew() {

        this.refresh()
    }

    save() {
        let isListDataFound = true

        const urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, DETAILS_UI, CORRECTION_UI);
        if (!this.isServiceEndpoint && this.type == 'DROPDOWN' && this.userDefinedFieldDomainDataList.length == 0) {
            this.notificationService.sendError('Please add Domain data')
            isListDataFound = false
        }
        if (this.isFieldAppearanceLogic && this.fieldAppLogicList.length == 0) {
            this.notificationService.sendError('Please add appearance logic data')
            isListDataFound = false
        }
        if (this.commonService.isFormInvalid(this.udfForm, this.required_field)) {
            return;
        }
        if (!isListDataFound) {
            return
        }



        let formData = new UserDefinedField()
        formData = this.udfForm.getRawValue()
        formData.udfProfileId = this.udfData.id
        formData.styleClass = 'col-md-6'
        formData.fieldAppearanceLogics = this.fieldAppLogicList
        formData.userDefinedFieldDomainDataList = this.userDefinedFieldDomainDataList

        if (this.isRowSelected) {
            this.udfService.updateUdf(formData, urlSearchParams).subscribe(
                (response) => {
                    this.notificationService.sendSuccess(response.message);
                    this.isServiceEndpoint = true;
                    this.isRowSelected = false
                    this.isFieldAppearanceLogic = false
                    this.refresh()

                }
            )
        } else {
            this.udfService.saveUdf(formData, urlSearchParams).subscribe(
                (response) => {
                    this.notificationService.sendSuccess(response.message);
                    this.isServiceEndpoint = true;
                    this.isRowSelected = false
                    this.isFieldAppearanceLogic = false
                    this.refresh()

                }
            )
        }




    }
    back() {

        this.location.back()
    }



}
