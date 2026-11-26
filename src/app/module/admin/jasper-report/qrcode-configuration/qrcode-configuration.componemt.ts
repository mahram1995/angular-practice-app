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
    selector: 'qrcode-configuration',
    templateUrl: './qrcode-configuration.component.html',
})
export class QrcodeConfigurationComponent extends FormBaseComponent implements OnInit {
    required_field: any = {
        dbName: 'Data Source Name',
        password: 'Password',
        url: 'Database URL',
        username: 'Username',
    };
    jasperReport: any;
    allJasperOptions: { label: string, value: string }[] = []

    dataSources: DatabaseConfig[] = [];
    allJasperReportList: any
    urlSearchMap: Map<string, any> = new Map();
    totalRecords: number = 0;
    searchForm: FormGroup;
    qrcodeForm: FormGroup;
    udfForm: FormGroup;
    totalPages: number;
    rowPerPage: number = 15
    pageNumber: number = 0;


    isVisibleSearchDialog: boolean = false
    displayDialog: boolean = false;


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
        this.fetchDataSourceList(null)
        this.fetchJasperReportList(new Map())
        this.fetchAllJasperReportList(new Map())
        this.prepareSearchForm();
        this.prepareqrcodeForm(new DatabaseConfig());
    }

    addDataSource() {
        this.displayDialog = true;
    }

    fetchDataSourceList(searchParam: any) {
        this.jasperReportService.getDataSource(searchParam).subscribe(data => {
            this.dataSources = data;
        })
    }

    prepareSearchForm() {
        this.searchForm = this.formBuilder.group({
            reportName: [''],
        });
    }

    prepareqrcodeForm(data: any) {
        this.qrcodeForm = this.formBuilder.group({
            id: [data?.id?? ''],
            reportFileName: [data?.reportFileName?? ''],
            isQrcodeEnable: [data?.isQrcodeEnable?? 0],
            sqlQueryForQrCode: [data?.sqlQueryForQrCode?? '', Validators.required],
            maxQrcodeScanLimit: [data?.maxQrcodeScanLimit?? '',],
            daysOfQrCodeExpiry: [data?.daysOfQrCodeExpiry?? '',],
        });
    }


    fetchJasperReportList(searchParam: any) {
        this.urlSearchMap.set("isQrcodeEnable", true)
        this.jasperReportService.getJasperReports(this.urlSearchMap).subscribe(data => {
            this.jasperReport = data
            this.totalRecords = data.length;
        })
    }

    fetchAllJasperReportList(searchParam: any) {
        this.jasperReportService.getJasperReports(searchParam).subscribe(data => {
            this.allJasperReportList = data
            this.allJasperOptions = data.map(item => ({
                label: item.reportFileName,
                value: String(item.reportFileName)
            }));
        })
    }


    getDatasourceNameById(id: number | string): string {
        const datasource = this.dataSources.find(ds => Number(ds.id) === Number(id));

        return datasource ? datasource.dbName : '';
    }

    getReportIdByName(jasperFileName: string): number {
        const report = this.allJasperReportList.find(ds => ds.reportFileName === jasperFileName);

        return report ? report.id : null;
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





    back() { this.location.back() }

    refresh() {
        this.dt?.reset();
        this.setAsPage()
    }
    setAsPage() {

        this.fetchJasperReportList(this.urlSearchMap);
    }

    editDataSource(data) {
        this.displayDialog = true;
        this.prepareqrcodeForm(data);
    }


    saveQrcodeInfo(): void {

        const formData = this.qrcodeForm.value
        formData.id  = this.getReportIdByName(formData.reportFileName)
        

        if (this.commonService.isFormInvalid(this.qrcodeForm, this.required_field)) {
            return;
        }

        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, DETAILS_UI, CORRECTION_UI);
        this.jasperReportService.saveQrcodeConfiguraiton(formData, urlSearchParams)
            .subscribe((response) => {
                this.notificationService.sendSuccess('QR code fonciguration successfully. report file name is ', response.getReportFileName);
                this.fetchJasperReportList(this.urlSearchMap)
                this.prepareqrcodeForm(new DatabaseConfig())
                this.displayDialog = false;
            }
            );
    }

    resetForm(): void {

        const fileInput =
            document.getElementById('reportFile') as HTMLInputElement;

        if (fileInput) {
            fileInput.value = '';
        }
    }

}
