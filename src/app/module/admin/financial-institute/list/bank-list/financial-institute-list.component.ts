import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { NotificationService } from "../../../../../app-configuration/app.service/notification.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CommonService } from "../../../../../app-configuration/app.service/common.service";
import { FinancialInstituteService } from "../../service/financial-institute.service";
import { Bank } from "../../service/bank.domain";
import { Table, TableLazyLoadEvent } from "primeng/table";
import { OverlayPanel } from "primeng/overlaypanel";

@Component({
    selector: 'financial-institute-list',
    templateUrl: './financial-institute-list.component.html',
})
export class FinancialInstituteListComponent implements OnInit {

    bankList: Bank[];
    searchForm: FormGroup;
    selectedBank: Bank;

    totalRecords: number = 0;
    totalPages: number
    rowPerPage: number = 15
    pageNumber: number = 0;

    urlSearchMap: Map<string, any> = new Map();
    @ViewChild('dataTable') dataTable: Table | undefined;

    constructor(
        private location: Location,
        private router: Router,
        private commonService: CommonService,
        private formBuilder: FormBuilder,
        private bankService: FinancialInstituteService,

    ) {

    }

    ngOnInit() {
        this.rowPerPage = this.commonService.getRowsPerPage(31)
        this.prepareSearchForm();


    }

    prepareSearchForm() {
        this.searchForm = this.formBuilder.group({
            bankName: [''],
        });
    }

    showLookup(op: OverlayPanel, event: Event): void {
        op.toggle(event);


        this.commonService.focusFirstControl();

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
        this.dataTable?.reset();
        this.prepareSearchForm();
    }

    fetchBanks(urlSearchMap: any) {
        this.bankService.getBank(urlSearchMap).subscribe(data => {
            this.bankList = data.content
            this.totalRecords = data.totalElements;
            this.totalPages = data.totalPages;
        })
    }


    onLazyLoad(event: TableLazyLoadEvent) {
        this.pageNumber = event.first
            ? Math.floor(event.first / event.rows!)
            : 0;

        this.rowPerPage = event.rows ?? 15;

        this.urlSearchMap.set('page', this.pageNumber);
        this.urlSearchMap.set('size', this.rowPerPage);
        this.urlSearchMap.set('asPage', true);

        this.fetchBanks(this.urlSearchMap);
    }

    onDetails(data: any) {
        this.router.navigate(['admin/financial-institute/bank-details'], {
            queryParams: {
                bankId: data.id
            }
        })
    }

    onEdit(data: any) {
        this.router.navigate(['admin/financial-institute/update-financial-institute'], {
            queryParams: {
                id: data.id
            }
        });
    }

    onRowSelect(event: any) {

        this.router.navigate(['admin/financial-institute/bank-details'], {
            queryParams: {
                bankId: this.selectedBank.id
            }
        })
    }

    create() {
        this.router.navigate(['admin/financial-institute/create-financial-institute']);
    }

    refresh() {
        this.prepareSearchForm();   // Reset form values first
        this.urlSearchMap.clear();  // Remove old search parameters
        this.dataTable?.reset();
    }

    back() { this.location.back() }


}