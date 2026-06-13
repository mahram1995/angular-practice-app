import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { NotificationService } from "../../../../../app-configuration/app.service/notification.service";
import { FormBuilder } from "@angular/forms";
import { CommonService } from "../../../../../app-configuration/app.service/common.service";
import { FinancialInstituteService } from "../../service/financial-institute.service";
import { Bank } from "../../service/bank.domain";
import { TableLazyLoadEvent } from "primeng/table";

@Component({
    selector: 'financial-institute-list',
    templateUrl: './financial-institute-list.component.html',
})
export class FinancialInstituteListComponent implements OnInit {

    bankList: Bank[];

    totalRecords: number = 0;
    totalPages: number
    rowPerPage: number = 15
    pageNumber: number = 0;

    urlSearchMap: Map<string, any> = new Map();

    constructor(
        private location: Location,
        private router: Router,
        private commonService: CommonService,
        private bankService: FinancialInstituteService,

    ) {

    }

    ngOnInit() {
        this.rowPerPage = this.commonService.getRowsPerPage(32)

        this.fetchBanks(null)


    }

    fetchBanks(searchParam: any) {

        this.urlSearchMap.set('asPage', true);
        this.urlSearchMap.set('page', this.pageNumber);  // 0-based index
        this.urlSearchMap.set('size', this.rowPerPage);
        this.bankService.getBank(this.urlSearchMap).subscribe(data => {
            this.bankList = data.content
            this.totalRecords = data.totalElements;
            this.totalPages = data.totalPages;
        })
    }

    onLazyLoad(event: TableLazyLoadEvent) {
        this.rowPerPage = event.rows ?? this.rowPerPage;
        this.pageNumber = event.first / this.rowPerPage;

        if (this.urlSearchMap == null) {
            this.urlSearchMap = new Map();
        }
        this.urlSearchMap.set('asPage', true);
        this.urlSearchMap.set('page', this.pageNumber);  // 0-based index
        this.urlSearchMap.set('size', this.rowPerPage);

        this.bankService.getBank(this.urlSearchMap).subscribe(data => {
            this.bankList = data.content;
            this.totalRecords = data.totalElements;   // use backend's totalElements
            this.totalPages = data.totalPages;
        });
    }

    onDetails(data: any) { }
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

    refresh() { this.fetchBanks(null) }

    back() { this.location.back() }


}