import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../../app-configuration/app.service/notification.service';
import { UDFDomain } from '../service/udf.domain';
import { UDFService } from '../service/udf.service';
import { CommonService } from '../../../../app-configuration/app.service/common.service';
import { OverlayPanel } from 'primeng/overlaypanel';

const DETAILS_UI = 'admin/udf-details';
const CORRECTION_UI = 'admin/create-udf';
@Component({
    selector: 'udf-list',
    templateUrl: './udf-list.component.html',
})
export class UdfListComponent implements OnInit {
    required_field: any = {
        userName: 'code',
        password: 'name',
        email: 'module',
    };
    data: UDFDomain[];
    urlSearchMap: Map<string, any> = new Map();
    totalRecords: number = 0;
    searchForm: FormGroup;
    udfForm: FormGroup;
    totalPages: number;
    rowPerPage: number = 15
    pageNumber: number = 0;
    cols: any[] = []
    selectedCustomer: any;

    isVisibleSearchDialog: boolean = false

    @ViewChild('dataTable') dt: Table | undefined;
    @ViewChild('opUdfForm') overlayPanel!: OverlayPanel;
    constructor(
        private location: Location,
        private router: Router,
        private commonService: CommonService,
        private notificationService: NotificationService,
        private UDFService: UDFService,
        private formBuilder: FormBuilder,

    ) {

    }

    ngOnInit() {
        this.fetchUdfs(null)
        this.prepareSearchForm();
        this.prepareUdfForm();

    }

    prepareSearchForm() {
        this.searchForm = this.formBuilder.group({
            commandName: [''],
            moduleName: ['']
        });
    }

    prepareUdfForm() {
        this.udfForm = this.formBuilder.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            module: ['', Validators.required]
        });
    }


    fetchUdfs(searchParam: any) {
        this.UDFService.getUdf(searchParam).subscribe(data => {
            this.data = data.content
            this.totalRecords = data.totalElements;
            this.totalPages = data.totalPages;
        })
    }

    save() {
        const urlSearchParams = this.commonService.getQueryParamMapForApprovalFlow(null, null, DETAILS_UI, CORRECTION_UI);

        let formData = this.udfForm.getRawValue()
        if (this.commonService.isFormInvalid(this.udfForm, this.required_field)) {
            return;
        }
        this.UDFService.saveUdf(formData, urlSearchParams).subscribe(
            (response) => {
                this.notificationService.sendSuccess(response.message);
                this.prepareUdfForm();
                this.fetchUdfs(null);
                this.overlayPanel.hide()

            }
        )

    }
    search(searchMap: Map<string, any>) {
        this.dt?.reset();
        this.urlSearchMap.set('page', 0);
        if (searchMap != null) { this.urlSearchMap = searchMap; }
        for (const control in this.searchForm.controls) {
            this.urlSearchMap.delete(control);
            const formControlValue = (this.searchForm.get(control).value).toString().trim();
            if (formControlValue.length !== 0) {
                this.urlSearchMap.set(control, formControlValue);
            }
        }
        this.fetchUdfs(this.urlSearchMap)
        this.prepareSearchForm()
    }
    onRowsChange(event: any) {
        this.rowPerPage = event.rows;
        this.fetchUdfs(null)
    }

    onPageChange(event: any) {
        this.pageNumber = event.first / event.rows;
        const pageSize = event.rows;
    }
    onRowSelect(event: any) {
        console.log(event.data);
        this.router.navigate(['admin/create-udf'], {
            queryParams: {
                udfProfileId: event.data.id
            }
        })
    }


    back() { this.location.back() }

    refresh() {
        this.dt?.reset();
        this.setAsPage()
    }
    setAsPage() {
        this.urlSearchMap = new Map();
        this.urlSearchMap.set('asPage', true);
        this.urlSearchMap.set('size', this.rowPerPage);
        this.urlSearchMap.set('page', this.pageNumber);
        this.fetchUdfs(this.urlSearchMap);
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

        this.UDFService.getUdf(this.urlSearchMap).subscribe(data => {
            this.data = data.content;
            this.totalRecords = data.totalElements;   // use backend's totalElements
            this.totalPages = data.totalPages;
        });
    }


}
