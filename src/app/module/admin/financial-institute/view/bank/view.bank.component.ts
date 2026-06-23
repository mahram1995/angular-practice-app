import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { NotificationService } from "../../../../../app-configuration/app.service/notification.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CommonService } from "../../../../../app-configuration/app.service/common.service";
import { Bank, Branch } from "../../service/bank.domain";
import { FinancialInstituteService } from "../../service/financial-institute.service";
import { Table, TableLazyLoadEvent } from "primeng/table";
import { FormBaseComponent } from "../../../../../app-configuration/app-component/base-component/form.base.component";
import { ApprovalflowService } from "../../../../../admin/approval-flow/service/approval-flow-service";

@Component({
    selector: 'bank-view',
    templateUrl: './view.bank.component.html',
})
export class BankViewComponent extends FormBaseComponent implements OnInit {
    searchForm: FormGroup;
    header: string = 'Create Financial Institute : ';
    bankInfo: Bank;

    urlSearchMap: Map<string, any> = new Map();
    @ViewChild('dataTable') dataTable: Table | undefined;
    bankId: number;
    constructor(
        protected override location: Location,
        protected override commonService: CommonService,
        protected override router: Router,
        private approvalFlowService: ApprovalflowService,

        private notificationService: NotificationService,
        private bankService: FinancialInstituteService,
        private route: ActivatedRoute,) {
        super(location, commonService);

    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let command = params.commandName;
            this.taskId = params.taskId
            if (command == 'UpdateBankCommand') {
                this.header = 'Update Financial Institute :'
            }
            if (this.taskId) {
                this.approvalFlowService.fetchApprovalFlowTaskInstancePayload({ taskId: this.taskId }).subscribe(data => {
                    this.bankInfo = data.payload
                })
            }

        });

    }


    fetchBankByid(bankid: number) {
        this.bankService.getBankByBankId({ bankId: bankid }).subscribe(data => {
            this.bankInfo = data;
            this.urlSearchMap.set('bankId', bankid);
            this.urlSearchMap.set('asPage', false);
        })
    }


    back() { this.location.back() }


}