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
import { UDFDomain, UserDefinedFields } from '../service/udf.domain';
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
    udfForm: FormGroup;
    message: string = '';
    isEdit = false;
    header: string = 'Create New User';
    selectedCustomer: any;
    data: UDFDomain;
    urlSearchMap: Map<string, any> = new Map();
    profileId: number;
    dataType = [
        { label: "CHAR", value: 'CHAR' },
        { label: "DATE", value: 'DATE' },
        { label: "NUMBER", value: 'NUMBER' },
        { label: "BOOLEAN", value: 'BOOLEAN' },
        { label: "DROP_DOWN", value_: 'DROP_DOWN' },

    ]

    constructor(private fb: FormBuilder,
        protected override location: Location,
        private notificationService: NotificationService,
        private approvalFlowService: ApprovalflowService,
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
    }




    fetchUdfs(profileId: any) {
        this.urlSearchMap.set('id', profileId)
        this.udfService.getUdfById(this.urlSearchMap).subscribe(data => {

            this.data = data
        })
    }

    onRowSelect(event: any) {
        console.log(event.data);
        this.prepareForm(event.data
        )
    }

    refresh() {

        this.fetchUdfs(this.profileId)
    }
    prepareForm(data: UserDefinedFields) {
        this.udfForm = this.fb.group({
            id: [data.id],
            name: [data.name],
            styleClass: [data.styleClass],
            maximumLength: [data.maximumLength],
            minimumLength: [data.minimumLength],
            regularExpression: [data.regularExpression],
            dataType: [data.dataType], // you may need to cast/convert if it's actually Date
            singleData: [data.singleData],
            multipleSelection: [data.multipleSelection],
            mandatory: [data.mandatory],
            order: [data.order],
            userDefinedFieldDomainDataList: [data.userDefinedFieldDomainDataList],
            serviceEndpoint: [data.serviceEndpoint],
            dataDetailsEndpoint: [data.dataDetailsEndpoint],
            userDefinedFieldProfileId: [data.userDefinedFieldProfileId],
            label: [data.label],
            conditionallyAppearance: [data.conditionallyAppearance],
            fieldAppearanceLogics: [data.fieldAppearanceLogics],
            fieldGroup: [data.fieldGroup],
            labelOfServiceEndpoint: [data.labelOfServiceEndpoint],
            valueOfServiceEndpoint: [data.valueOfServiceEndpoint],
            validationExpression: [data.validationExpression]
        });
    }

    save() {
        const urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, DETAILS_UI, CORRECTION_UI);

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
        } else {
            this.udfService.saveUdf(formData, urlSearchParams).subscribe(
                (response) => {
                    this.notificationService.sendSuccess(response.message);
                    this.prepareForm(new UserDefinedFields)
                    this.location.back()
                }
            )
        }

    }
    back() {

        this.location.back()
    }

}
