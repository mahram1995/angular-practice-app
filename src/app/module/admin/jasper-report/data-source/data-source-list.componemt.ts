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
import { DatabaseConfig } from '../service/jaspser.report.domain';

const DETAILS_UI = 'admin/jasper-report-log';
const CORRECTION_UI = 'admin/jasepr-report-log';
@Component({
    selector: 'data-source-list',
    templateUrl: './data-source-list.component.html',
})
export class DataSourceListComponent extends FormBaseComponent implements OnInit {
    required_field: any = {
        userName: 'code',
        password: 'name',
        email: 'module',
    };
    dataSources: DatabaseConfig[] = [];
    urlSearchMap: Map<string, any> = new Map();
    totalRecords: number = 0;
    searchForm: FormGroup;
    dataSourceForm: FormGroup;
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
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,

        protected override commonService: CommonService,
        protected override router: Router,
        protected override location: Location,

    ) {
        super(location, commonService);
    }

    ngOnInit() {
        this.fetchDataSourceList(new Map())
        this.prepareSearchForm();
        this.prepareDatabaseForm(new DatabaseConfig());
    }

    addDataSource() {
        this.displayUploadDialog = true;
    }

    prepareSearchForm() {
        this.searchForm = this.formBuilder.group({
            reportName: [''],
        });
    }

    prepareDatabaseForm(data: DatabaseConfig) {
        this.dataSourceForm = this.formBuilder.group({
            id: [data.id],
            dbName: [data.dbName, Validators.required],
            url: [data.url, Validators.required],
            username: [data.username, Validators.required],
            password: [data.password, Validators.required],
            driverClass: ['oracle.jdbc.OracleDriver']
        });
    }


    fetchDataSourceList(searchParam: any) {
        this.jasperReportService.getDataSource(searchParam).subscribe(data => {

            this.dataSources = data
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
        this.fetchDataSourceList(this.urlSearchMap)
        this.prepareSearchForm()
    }




    onRowsChange(event: any) {
        this.rowPerPage = event.rows;
        this.fetchDataSourceList(null)
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

        this.fetchDataSourceList(this.urlSearchMap);
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

    editDataSource(data) {
        this.displayUploadDialog = true;
        this.prepareDatabaseForm(data);
    }

    testConnection(data) {
        let formData;
        if (data != null) {
            formData = data
        } else {
            formData = this.dataSourceForm.value

        }
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, DETAILS_UI, CORRECTION_UI, 'text');
        this.jasperReportService.testDataSourceConnection(formData, urlSearchParams)
            .subscribe((response) => {
                this.notificationService.sendSuccess('Data source connection test successful.', null);
            });
    }

    saveDataSource(): void {

        const formData = this.dataSourceForm.value

        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, DETAILS_UI, CORRECTION_UI, 'text');
        this.jasperReportService.saveDataSource(formData, urlSearchParams)
            .subscribe((response) => {
                this.notificationService.sendSuccess('Data source saved successfully.', null);
                this.fetchDataSourceList(this.urlSearchMap)
                this.prepareDatabaseForm(new DatabaseConfig())
                this.displayUploadDialog = false;
            }
            );
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
