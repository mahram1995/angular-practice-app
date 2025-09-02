import { Component, Inject, OnInit } from '@angular/core';
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
import { FieldAppearanceLogic, UDFDomain, UserDefinedFieldDomainData, UserDefinedFields } from '../service/udf.domain';
import { UDFService } from '../service/udf.service';

const DETAILS_UI = 'admin/user-details';
const CORRECTION_UI = 'admin/create-user';
@Component({
    selector: 'create-udf-form',
    templateUrl: './create-udf-form.html',

})
export class CreateUdfFormComponent extends FormBaseComponent implements OnInit {
    required_field: any = {
        userName: 'User Name',
        password: 'Password',
        email: 'Email',
        lastName: 'Last Name',
    };

    domainListRequiredFiled: any = {
        label: 'label',
        value: 'value',
        order: 'order',

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
    isEdit = false;

    submitted = false;

    header: string = 'Create New User';
    selectUserDefinedField: UserDefinedFields = new UserDefinedFields()
    selectedCustomer: any;
    udfData: UDFDomain;
    userDefinedFields: UserDefinedFields[];
    urlSearchMap: Map<string, any> = new Map();
    profileId: number;
    isServiceEndpoint: boolean = true;
    isFieldAppearnceLogic: boolean = false;
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
        private notificationService: NotificationService,
        private udfService: UDFService,
        protected override router: Router,
        private route: ActivatedRoute,
        private commonService: CommonService) {
        super(location);

    }
    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.profileId = params.udfProfileId;
            this.fetchUdfs(this.profileId);

        });
        this.prepareForm(new UserDefinedFields)
        this.prepareDomainListForm(new UserDefinedFieldDomainData);
        this.prapareFieldappearnceLogicListForm(new FieldAppearanceLogic);
        this.logicType = [
            { label: "Select a logic type", value: "" },
            { label: "EMPTY", value: "EMPTY" },
            { label: "NON_EMPTY", value: "NON_EMPTY" },
            { label: "EQUAL", value: "EQUAL" },
            { label: "NOT_EQUAL", value: "NOT_EQUAL" },
            { label: "LESS_THAN", value: "LESS_THAN" },
            { label: "GREATER_THAN", value: "GREATER_THAN" },
            { label: "LESS_THAN_OR_EQUAL", value: "LESS_THAN_OR_EQUAL" },
            { label: "GREATER_THAN_OR_EQUAL", value: "GREATER_THAN_OR_EQUAL" },
            { label: "IN", value: "IN" },
            { label: "BETWEEN", value: "BETWEEN" }
        ];
    }




    fetchUdfs(profileId: any) {
        this.urlSearchMap.set('id', profileId)
        this.udfService.getUdfById(this.urlSearchMap).subscribe(data => {
            this.udfData = data
            this.userDefinedFields = this.commonService.sortByKeyAsc(data.userDefinedFields, 'orderNo')
            this.createDependantDropdownList();
        })
    }

    onRowSelect(event: any) {
        this.type = event.data.dataType;
        this.isFieldAppearnceLogic = false;
        this.selectUserDefinedField = event.data;
        this.fieldAppLogicList = this.selectUserDefinedField.fieldAppearanceLogics
        this.userDefinedFieldDomainDataList = this.selectUserDefinedField.userDefinedFieldDomainDataList
        console.log(this.selectUserDefinedField);

        this.prepareForm(event.data)
        this.prepareDomainListForm(new UserDefinedFieldDomainData)
        this.prapareFieldappearnceLogicListForm(new FieldAppearanceLogic);

        if (this.type == 'DROP_DOWN') {
            this.udfForm.get('isServiceEndpoint')?.setValue(1);
        } else {
            this.isServiceEndpoint = true
            this.udfForm.get('isServiceEndpoint')?.setValue(0);

        }
    }

    onServiceEndpointCheck(event: any) {
        this.isServiceEndpoint = event.target.checked
        if (!this.isServiceEndpoint) {
            this.prepareDomainListForm(new UserDefinedFieldDomainData);
        }
    }

    onFieldApearnceCheck(event: any) {
        this.isFieldAppearnceLogic = event.target.checked
        if (!this.isFieldAppearnceLogic) {
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
        apperanceLogic.dependentFieldId = this.selectUserDefinedField.id
        apperanceLogic.userDefinedFieldId = this.selectUserDefinedField.id
        this.fieldAppLogicList.push(apperanceLogic)
        this.selectUserDefinedField.fieldAppearanceLogics = this.fieldAppLogicList
        console.log(this.selectUserDefinedField);

        this.prapareFieldappearnceLogicListForm(new FieldAppearanceLogic)
    }

    isInvalid(formName: any, controlName: string): boolean {
        const form = this[formName];
        const control = form?.get(controlName);

        // show error if (submitted) OR (touched), and control has errors
        return !!(control && control.errors && (control.touched || this.commonService.isSumbitted));
    }
    isRequired(formName: any, controlName: string): boolean {
        const form = this[formName];
        const control = form?.get(controlName);
        // show error if (submitted) OR (touched), and control has errors
        return !!(control && control.errors?.required && this.commonService.isSumbitted);
    }
    refresh() {

        this.fetchUdfs(this.profileId)
        this.prepareForm(new UserDefinedFields)
        this.prepareDomainListForm(new UserDefinedFieldDomainData);
        this.prapareFieldappearnceLogicListForm(new FieldAppearanceLogic);
    }
    prepareForm(data: UserDefinedFields) {
        this.udfForm = this.fb.group({
            id: [data.id],
            name: [data.name],
            styleClass: [data.styleClass],
            maximumLength: [data.maximumLength],
            minimumLength: [data.minimumLength],
            minimumDate: [data.minimumDate],
            miximumDate: [data.miximumDate],
            regularExpression: [data.regularExpression],
            dataType: [data.dataType], // you may need to cast/convert if it's actually Date
            singleData: [data.singleData],
            multipleSelection: [data.multipleSelection],
            mandatory: [data.mandatory],
            orderNo: [data.orderNo],
            userDefinedFieldDomainDataList: [data.userDefinedFieldDomainDataList],
            serviceEndpointName: [data.serviceEndpointName],
            isServiceEndpoint: [data.isServiceEndpoint],
            udfProfileId: [data.udfProfileId],
            label: [data.label],
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
            order: [data.order, Validators.required],
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
            this.udfForm.get('isServiceEndpoint')?.setValue(1);
        } else {
            this.udfForm.get('isServiceEndpoint')?.setValue(0);
        }
    }

    save() {
        const urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, DETAILS_UI, CORRECTION_UI);
        this.udfData.userDefinedFields = this.userDefinedFields

        console.log(this.udfData);

        let formData = this.udfForm.getRawValue()
        if (this.commonService.isFormInvalid(this.udfForm, this.required_field)) {
            return;
        }
        if (this.isEdit) {
            this.udfService.updateUdf(formData, urlSearchParams).subscribe(
                (response) => {
                    this.notificationService.sendSuccess(response.message);
                    this.prepareForm(new UserDefinedFields)
                    this.router.navigate([this.location.back()], {
                        queryParams: {
                            userName: formData.userName
                        }
                    })

                }
            )
        }

    }
    back() {

        this.location.back()
    }



}
