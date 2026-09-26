import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../../app-configuration/app.service/notification.service';
import { CommonService } from '../../../../app-configuration/app.service/common.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { UDFDomain } from '../../udf/service/udf.domain';
import { UDFService } from '../../udf/service/udf.service';
import { JasperReportService } from '../service/JasperReportService';
import { FormBaseComponent } from '../../../../app-configuration/app-component/base-component/form.base.component';

const DETAILS_UI = 'admin/udf-details';
const CORRECTION_UI = 'admin/create-udf';
@Component({
    selector: 'jasper-report-list',
    templateUrl: './jasper-report-list.component.html',
})
export class JasperReportListComponent extends FormBaseComponent implements OnInit {
    required_field: any = {
        userName: 'code',
        password: 'name',
        email: 'module',
    };
    jasperReport: any ;
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
    displayUploadDialog: boolean = false;

    reportFileName: string = '';
    selectedFile: File | null = null;
    dataSourceOptions: { label: string, value: string }[] = [
        { label: 'Select Data Source', value: '' },
        { label: 'DataSource1', value: 'DataSource1' },
        { label: 'DataSource2', value: 'DataSource2' },
        { label: 'DataSource3', value: 'DataSource3' }
    ]
    selectedDataSource: string = '';

    @ViewChild('dataTable') dt: Table | undefined;
    @ViewChild('opUdfForm') overlayPanel!: OverlayPanel;
    constructor(

        private jasperReportService: JasperReportService,
        private udfService: UDFService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,

        protected override commonService: CommonService,
        protected override router: Router,
        protected override location: Location,

    ) {
        super(location, commonService);
    }

    ngOnInit() {
        this.fetchJasperReportList( new Map())
        this.prepareSearchForm();
    }

    addReport() {
        this.displayUploadDialog = true;
    }

    prepareSearchForm() {
        this.searchForm = this.formBuilder.group({
            reportName: [''],
        });
    }


    fetchJasperReportList(searchParam: any) {
        this.udfService.getJapserReportList(searchParam).subscribe(data => {
           
            this.jasperReport = data
            this.totalRecords = data.length;  
        })
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
        this.fetchJasperReportList(this.urlSearchMap)
        this.prepareSearchForm()
    }
    onRowsChange(event: any) {
        this.rowPerPage = event.rows;
        this.fetchJasperReportList(null)
    }

    onPageChange(event: any) {
        this.pageNumber = event.first / event.rows;
        const pageSize = event.rows;
    }
    onRowSelect(event: any) {
        console.log(event.data);
        // this.router.navigate(['admin/dynamic-report/view-report'], {
        //     queryParams: {
        //         udfProfileId: event.data.id
        //     }
        // })
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
        this.fetchJasperReportList(this.urlSearchMap);
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

        this.udfService.getJapserReportList(this.urlSearchMap).subscribe(data => {
            this.jasperReport = data.content;
            this.totalRecords = data.totalElements;   // use backend's totalElements
            this.totalPages = data.totalPages;
        });
    }


    onFileSelected(event: any): void {

        const file = event.target.files?.[0];

        if (file) {
            this.selectedFile = file;

            // Automatically set file name
            if (!this.reportFileName) {
                this.reportFileName = file.name;
            }
        }
    }

    saveReport(): void {

        if (!this.selectedFile) {
            alert('Please select a report file.');
            return;
        }

        if (!this.reportFileName) {
            alert('Please enter report file name.');
            return;
        }

        const formData = new FormData();

        formData.append('reportFileName', this.reportFileName);
        formData.append('reportFile', this.selectedFile);
        formData.append('dataSource', this.selectedDataSource);

     

        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, DETAILS_UI, CORRECTION_UI);
        this.jasperReportService.saveJasperReport(formData, urlSearchParams)
            .subscribe({
                next: (response) => {

                    console.log('Report saved:', response);

                    this.notificationService.sendSuccess('Report saved successfully.', null);

                    this.resetForm();
                    this.refresh();
                },

                error: (error) => {

                    console.error('Error saving report:', error);

                    this.notificationService.sendError('Failed to save report.');
                }
            });


    }

    resetForm(): void {

        this.reportFileName = '';
        this.selectedFile = null;

        const fileInput =
            document.getElementById('reportFile') as HTMLInputElement;

        if (fileInput) {
            fileInput.value = '';
        }
    }

}
