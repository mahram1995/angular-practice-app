import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { NotificationService } from "../../../../../app-configuration/app.service/notification.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "../../../../../app-configuration/app.service/common.service";
import { Bank, Countries, InstitutionType, OnwrshipType } from "../../service/bank.domain";
import { SelectItem } from "primeng/api";
import { BaseComponent } from "../../../../../app-configuration/app-component/base-component/base.component";
import { FormBaseComponent } from "../../../../../app-configuration/app-component/base-component/form.base.component";
import { FinancialInstituteService } from "../../service/financial-institute.service";
import { ApprovalflowService } from "../../../../../admin/approval-flow/service/approval-flow-service";

export const CREATE_SUCCESS_MESSAGE: string[] = ['Bank created successfully.', 'Bank Created Successfully send for approval.'];
export const UPDATE_SUCCESS_MESSAGE: string[] = ['Bank update successfully.', 'Bank Update Successfully send for approval.'];
const DETAILS_UI = 'admin/financial-institute/view-bank';
const CORRECTION_UI = 'admin/financial-institute/create-financial-institute';
@Component({
    selector: 'financial-institute-form',
    templateUrl: './bank.form.component.html',
})
export class FinancialInstituteFormComponent extends FormBaseComponent implements OnInit {

    bankInfo: Bank
    pageHeader = "Create Financial Institution"
    bankForm: FormGroup
    bank: Bank;
    bankId: number;
    isBank: boolean = false;
    isBangladesh: boolean = false;
    institutionType: SelectItem[] = InstitutionType
    ownershipType: SelectItem[] = OnwrshipType
    countryList: SelectItem[] = Countries;
    divisionList: SelectItem[] = [];
    districtList: SelectItem[] = [];
    upozilaList: SelectItem[] = [];
    postCodeList: SelectItem[] = [];

    urlSearchMap: Map<string, any> = new Map();

    isEdit: boolean = false;

    required_field: any = {
        bankCode: 'Bank Code',
        bankName: 'Bank Name',
        countryCode: 'Country',

        financialInstitutionType: 'Financial Institution Type',
        addressLine1: 'Address Line 1',
    };
    constructor(
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,
        private bankService: FinancialInstituteService,
        private approvalFlowService: ApprovalflowService,
        private route: ActivatedRoute,
        protected override commonService: CommonService,
        protected override router: Router,
        protected override location: Location,

    ) {
        super(location, commonService);

    }

    ngOnInit() {
        this.preparedBankForm(new Bank());
        this.route.queryParams.subscribe(params => {
            let command = params.commandName;

            this.bankId = params.bankId;
            this.taskId = params.taskId;

            if (this.taskId) {
                this.approvalFlowService.fetchApprovalFlowTaskInstancePayload({ taskId: this.taskId }).subscribe(data => {
                    this.preparedBankForm(data.payload);
                    if (command == 'UpdateBankCommand') {
                        this.pageHeader = 'Correction of financial institute modification :'
                        this.isEdit = true;
                    } else {
                        this.pageHeader = 'Correction of financial institute creation :'
                    }

                    if (data.payload.financialInstitutionType === 'Bank') {
                        this.isBank = true;
                    }
                    if (data.payload.countryCode === 'Bangladesh') {
                        this.isBangladesh = true;
                    }
                })
            }

            if (this.bankId) {
                this.fetchBankByid(this.bankId)
            }
        });

    }
    fetchBankByid(bankid: number) {
        this.bankService.getBankByBankId({ bankId: bankid }).subscribe(data => {
            this.preparedBankForm(data);
            this.isEdit = true;
            if (data.financialInstitutionType === 'Bank') {
                this.isBank = true;
            }
            if (data.countryCode === 'Bangladesh') {
                this.isBangladesh = true;
            }
            this.pageHeader = "Update Financial Institution"
        })
    }



    preparedBankForm(data: Bank) {

        this.bankForm = this.formBuilder.group({
            isActive: [data.isActive],
            id: [data.id ? data.id : 0],
            bankCode: [data.bankCode, Validators.required],
            ownBank: [data.ownBank],
            bankName: [data.bankName, Validators.required],
            swiftCode: [data.swiftCode],
            bankSortName: [data.bankSortName],
            website: [data.website],
            ownerType: [data.ownerType],
            upozilaCode: [data.upozilaCode],
            financialInstitutionType: [data.financialInstitutionType, Validators.required],
            centralBankCode: [data.centralBankCode],
            addressLine1: [data.addressLine1, Validators.required],
            addressLine2: [data.addressLine2],
            districtCode: [data.districtCode],
            divisionCode: [data.divisionCode],
            countryCode: [data.countryCode, Validators.required],
            postCode: [data.postCode],
            houseNo: [data.houseNo],
            roadNo: [data.roadNo],
            villageName: [data.villageName],
            state: [data.state],
            cityName: [data.cityName],
            postOffice: [data.postOffice],
            zipCode: [data.zipCode],

        });
    }

    onFinancialInstitutionTypeChange(event: any) {
        if (event.value === 'Bank') {
            this.isBank = true;
        } else {
            this.isBank = false;
        }
    }
    onCountryChange(event: any) {
        if (event.value === 'Bangladesh') {
            this.isBangladesh = true;
        } else {
            this.isBangladesh = false;
        }
    }



    create() {

        let formData = this.bankForm.getRawValue()
        if (this.commonService.isFormInvalid(this.bankForm, this.required_field)) {
            return;
        }
        if (this.isEdit) {
            let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, DETAILS_UI, CORRECTION_UI);
            this.bankService.updateBank(formData, urlSearchParams).subscribe(
                (response) => {
                    this.notificationService.sendSuccess(UPDATE_SUCCESS_MESSAGE, null);
                    this.preparedBankForm(new Bank())
                    this.location.back()

                }
            )
        } else {
            let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, DETAILS_UI, CORRECTION_UI);
            this.bankService.saveBank(formData, urlSearchParams).subscribe(
                (response) => {
                    this.notificationService.sendSuccess(CREATE_SUCCESS_MESSAGE, null);
                    this.preparedBankForm(new Bank())
                    this.location.back()
                }
            )
        }


    }

    refresh() { }

    back() { this.location.back() }


}