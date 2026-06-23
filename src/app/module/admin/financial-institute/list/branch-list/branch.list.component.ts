import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { NotificationService } from "../../../../../app-configuration/app.service/notification.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CommonService } from "../../../../../app-configuration/app.service/common.service";
import { Bank, Branch } from "../../service/bank.domain";
import { FinancialInstituteService } from "../../service/financial-institute.service";
import { Table, TableLazyLoadEvent } from "primeng/table";

@Component({
    selector: 'bank-branch-list',
    templateUrl: './branch.list.component.html',
})
export class BranchListComponent implements OnInit {
    branchList: Branch[];
    searchForm: FormGroup;

    totalRecords: number = 0;
    totalPages: number
    rowPerPage: number = 15
    pageNumber: number = 0;

    urlSearchMap: Map<string, any> = new Map();
    @ViewChild('dataTable') dataTable: Table | undefined;
    bankId: number;
    bankInfo: Bank;
    constructor(
        private location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private commonService: CommonService,
        private notificationService: NotificationService,
        private bankService: FinancialInstituteService,
        private formBuilder: FormBuilder,

    ) {

    }

    ngOnInit() {
        this.rowPerPage = this.commonService.getRowsPerPage(40)
        this.prepareSearchForm();
        this.route.queryParams.subscribe(params => {
            let command = params.commandName;

            this.bankId = params.bankId;

            if (this.bankId) {
                this.fetchBankByid(this.bankId)
            }
        });

    }

    prepareSearchForm() {
        this.searchForm = this.formBuilder.group({
            branchName: [''],
            branchId: [''],
        });
    }

    fetchBankByid(bankid: number) {
        this.bankService.getBankByBankId({ bankId: bankid }).subscribe(data => {
            this.bankInfo = data;
            this.urlSearchMap.set('bankId', bankid);
            this.urlSearchMap.set('asPage', false);
            this.fetchBranchs(this.urlSearchMap);
        })
    }

    search() {
        // Remove old search parameters
        for (const control in this.searchForm.controls) {
            this.urlSearchMap.delete(control);
            const value = this.searchForm.get(control)?.value
                ?.toString()
                .trim();
            if (value) {
                this.urlSearchMap.set(control, value);
            }
        }
        // Reset paginator to first page
        this.fetchBranchs(this.urlSearchMap);
        this.prepareSearchForm();
    }

    fetchBranchs(urlSearchMap) {
        this.bankService.getBranch(urlSearchMap).subscribe(data => {
            this.branchList = data;
            this.totalRecords = data.totalElements;
            this.totalPages = data.totalPages;
        })
    }

    onDetails(data: any) {
        this.router.navigate(['admin/financial-institute/branch-details'], {
            queryParams: {
                branch: data.id
            }
        })
    }
    onEditBank(bankInfo: any) {
        this.router.navigate(['admin/financial-institute/update-financial-institute'], {
            queryParams: {
                bankId: bankInfo.id
            }
        });
    }
    onEdit(data: any) {
        this.router.navigate(['admin/financial-institute/update-financial-institute'], {
            queryParams: {
                id: data.id
            }
        });
    }


    create() {
        this.router.navigate(['admin/financial-institute/create-financial-institute']);
    }

    refresh() {
        this.prepareSearchForm();   // Reset form values first
        this.urlSearchMap.clear();
        this.urlSearchMap.set('bankId', this.bankId);
        this.urlSearchMap.set('asPage', false);
        this.fetchBranchs(this.urlSearchMap); // Remove old search parameters
        this.dataTable?.reset();
    }

    back() { this.location.back() }


}