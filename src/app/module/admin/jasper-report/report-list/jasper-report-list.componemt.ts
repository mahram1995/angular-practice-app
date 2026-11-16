import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../../app-configuration/app.service/notification.service';
import { CommonService } from '../../../../app-configuration/app.service/common.service';
import JSZip from 'jszip';
import { UDFService } from '../../udf/service/udf.service';
import { JasperReportService } from '../service/JasperReportService';
import { FormBaseComponent } from '../../../../app-configuration/app-component/base-component/form.base.component';
import { DatabaseConfig } from '../service/jaspser.report.domain';

const DETAILS_UI = 'admin/jasper-report-log';
const CORRECTION_UI = 'admin/jasepr-report-log';
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
    jasperReport: any;
    urlSearchMap: Map<string, any> = new Map();
    totalRecords: number = 0;
    searchForm: FormGroup;
    udfForm: FormGroup;
    totalPages: number;
    rowPerPage: number = 15
    pageNumber: number = 0;
    cols: any[] = []
    selectedCustomer: any;
    dataSources: DatabaseConfig[] = [];

    isVisibleSearchDialog: boolean = false
    displayUploadDialog: boolean = false;

    reportFileName: string = '';
    selectedFile: File | null = null;
    dataSourceOptions: { label: string, value: string }[] = []
    reportHistoryLogList: any
    selectedDataSource: string = '';

    showReportHistoryContent = false
    selectedReprtFileName: any


    reportParameters: any[] = [];
    parameterForm: FormGroup;

    showParameterForm = false;
    constructor(

        private jasperReportService: JasperReportService,
        private udfService: UDFService,
        private formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private notificationService: NotificationService,
        protected override commonService: CommonService,
        protected override router: Router,
        protected override location: Location,

    ) {
        super(location, commonService);
    }

    ngOnInit() {
        this.fetchDataSourceList(new Map())
        this.fetchJasperReportList(new Map())
        this.prepareSearchForm();

    }


    fetchDataSourceList(searchParam: any) {
        this.jasperReportService.getDataSource(searchParam).subscribe(data => {

            this.dataSources = data;
            this.dataSourceOptions = data.map(item => ({
                label: item.dbName,
                value: String(item.id)
            }));

        })
    }

    fetchReportHistoryList(fileName: any) {
        this.urlSearchMap = new Map();
        this.urlSearchMap.set('reportFileName', fileName);
        this.jasperReportService.getReportHistoryList(this.urlSearchMap).subscribe(data => {
            this.reportHistoryLogList = data;
            this.showReportHistoryContent = true
        })
    }

    getDatasourceNameById(id: number | string): string {
        const datasource = this.dataSources.find(ds => Number(ds.id) === Number(id));

        return datasource ? datasource.dbName : '';
    }

    addReport() {
        this.displayUploadDialog = true;
    }

    prepareSearchForm() {
        this.searchForm = this.formBuilder.group({
            reportName: [''],
        });
    }


    fetchJasperReportList(serachParam: any) {
        this.udfService.getJapserReportList(this.urlSearchMap).subscribe(data => {
            this.jasperReport = data
            this.totalRecords = data.length;
        })
    }


    search(searchMap: Map<string, any>) {
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


    back() { this.location.back() }

    refresh() {
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



    saveReport1(): void {

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


    selectedFiles: File[] = [];

    onFilesSelected(event: Event): void {

        const input = event.target as HTMLInputElement;

        if (!input.files || input.files.length === 0) {
            return;
        }

        const allowedExtensions = ['jrxml', 'jasper', 'png','JPG','jpg','jpeg','gif','bmp','svg']; // Add more extensions as needed

        const files = Array.from(input.files);

        for (const file of files) {

            const extension = file.name.split('.').pop()?.toLowerCase();

            if (!extension || !allowedExtensions.includes(extension)) {
                this.notificationService.sendError(
                    `Invalid file format: ${file.name}`
                );
                continue;
            }

            // Avoid duplicate file names
            if (!this.selectedFiles.some(f => f.name === file.name)) {
                this.selectedFiles.push(file);
            }
        }

        // Allow selecting the same file again
        input.value = '';
    }

    removeFile(index: number): void {
        this.selectedFiles.splice(index, 1);
    }

    saveReport(): void {

        if (this.selectedFiles.length === 0) {
            this.notificationService.sendError('Please select files');
            return;
        }

        const formData = new FormData();

        formData.append('reportFileName', this.reportFileName);
        formData.append('dataSource', this.selectedDataSource);

        this.selectedFiles.forEach(file => {
            formData.append('files', file, file.name);
        });
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, DETAILS_UI, CORRECTION_UI);

        this.jasperReportService.saveJasperReport(formData, urlSearchParams)
            .subscribe(data => {
                this.notificationService.sendSuccess('Report saved successfully.', null);
                this.resetForm();
                this.refresh();
            })

    }

    changeDataSource(data: any): void {

        console.log('Change Data Source for report:', data);
    }

    showAuditData(data: any): void {
        this.selectedReprtFileName = data.reportFileName
        this.fetchReportHistoryList(data.reportFileName);
    }



    showData(data: any): void {

        this.urlSearchMap = new Map();
        this.urlSearchMap.set('reportId', data.id);
        this.urlSearchMap.set('responseType', 'blob');

        this.jasperReportService.getJasperReportContent(this.urlSearchMap)
            .subscribe({
                next: (response: Blob) => {
                    this.downloadFile(response, data.reportFileName);
                },
                error: (error) => {
                    console.error('Report download failed:', error);
                }
            });
    }

    showHistData(data: any): void {
        this.urlSearchMap = new Map();
        this.urlSearchMap.set('reportHistId', data.histId);
        this.urlSearchMap.set('responseType', 'blob');
        this.jasperReportService.getReportHistoryContent(this.urlSearchMap)
            .subscribe({
                next: (response: Blob) => {
                    this.downloadFile(response, this.selectedReprtFileName);
                },
                error: (error) => {
                    console.error('Report download failed:', error);
                }
            });
    }


    exportAllReports(): void {

        const confirmed = window.confirm(
            'Are you sure you want to download all reports?'
        );

        if (!confirmed) {
            return;
        }

        this.urlSearchMap = new Map();
        this.urlSearchMap.set('responseType', 'blob');

        this.jasperReportService.getJasperReportContent(this.urlSearchMap)
            .subscribe({
                next: (response: Blob) => {
                    this.downloadFile(response, 'reports.zip');
                },
                error: (error) => {
                    console.error('Reports download failed:', error);
                }
            });
    }


    private downloadFile(blob: Blob, fileName: string): void {

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();

        window.URL.revokeObjectURL(url);
    }



    resetForm(): void {
        this.reportFileName = '';
        this.selectedFiles = [];
        this.selectedDataSource = '';


        const fileInput = document.getElementById('reportFiles') as HTMLInputElement;

        if (fileInput) {
            fileInput.value = '';
        }
    }

    getParameterForm(data: any): void {
        this.urlSearchMap = new Map();
        this.urlSearchMap.set('reportId', data.id);
        this.urlSearchMap.set('responseType', 'blob');
        this.selectedReprtFileName = data.reportFileName

        this.jasperReportService.getJasperReportContent(this.urlSearchMap)
            .subscribe({
                next: async (response: Blob) => {

                    const arrayBuffer = await response.arrayBuffer();
                    const decoder = new TextDecoder('UTF-8');
                    const jrxmlContent = decoder.decode(arrayBuffer);

                    //console.log('Actual JRXML Content:', jrxmlContent);
                    // Extract parameters
                    this.extractParameters(jrxmlContent);
                },
                error: error => {
                    console.error('Report retrieval failed:', error);
                }
            });
    }

    extractParameters(jrxmlContent: string): void {

        const parser = new DOMParser();

        const xmlDoc = parser.parseFromString(
            jrxmlContent,
            'application/xml'
        );

        // Check XML parsing error
        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
            console.error('Invalid JRXML file');
            return;
        }

        const root = xmlDoc.documentElement;

        // Get only direct child parameter elements
        const parameterElements = Array.from(root.children).filter(element => element.localName === 'parameter');

        this.reportParameters = parameterElements.map(element => {
            const descriptionElement = Array.from(element.children)
                .find(child => child.localName === 'parameterDescription');
            const description = descriptionElement?.textContent?.trim();

            return {
                name: element.getAttribute('name'),
                dataType: this.getInputType(
                    element.getAttribute('class') || 'java.lang.String'
                ),
                description: description || null
            };
        });

        console.log(this.reportParameters);


        // Generate dynamic form controls
        const controls: { [key: string]: FormControl } = {};

        this.reportParameters.forEach(parameter => {
            controls[parameter.name] = new FormControl(null);
        });

        this.parameterForm = this.formBuilder.group(controls);

        this.showParameterForm = true;
    }

    getInputType(className: string): string {

        switch (className) {
            case 'java.lang.Integer':
            case 'java.lang.Long':
            case 'java.lang.Double':
            case 'java.lang.Float':
            case 'java.math.BigDecimal':
                return 'number';
            case 'java.util.Date':
            case 'java.sql.Date':
                return 'date';
            default:
                return 'text';
        }
    }

    isBooleanParameter(className: string): boolean {
        return className === 'java.lang.Boolean' ||
            className === 'boolean';
    }

    isJrxmlFile(fileName: string): boolean {
        const extension = fileName.split('.').pop()?.toLowerCase();
        return extension === 'jrxml';
    }

    runReport(): void {
        const parameterValues = this.parameterForm.getRawValue();
        // console.log('Parameters:', parameterValues);



        let result: { [key: string]: any } = {};
        Object.entries(parameterValues).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
                return; // Skip this key-value pair
            }

            let dataType = this.reportParameters.find(param => param.name === key)?.dataType;
            if (dataType === 'date' && value) {
                const date = new Date(value as string);
                result[key] = this.datePipe.transform(date, 'yyyy-MM-dd');
            }
            else { result[key] = value; }
        });

        let reportFileName = this.selectedReprtFileName
        const reportExtension = 'pdf'// data.reportExtension; // or 'html', 'txt'

        if (reportFileName === "") {
            this.notificationService.sendError('Report file name is not found, Please check the report file name or expresion')
            return;
        }


        let reportData = {
            //"jasperFileName": "CL4_XLSX_OLD.jrxml", //"CL1_TOPSHEET_OLD.jrxml"
            "jasperFileName": reportFileName,
            "reportName": reportFileName,
            "databaseId": 101,
            "reportFormat": reportExtension,
            "parameters": result
        }



        // const pdfWindow = reportExtension?.toLowerCase() === 'pdf'
        //     ? window.open('', '_blank')
        //     : null;

        const urlSearchParams = this.getQueryParamMapForApprovalFlow(
            null, this.taskId, null, null, 'blob'
        );

        this.udfService.runReport(reportData, urlSearchParams).subscribe({

            next: (blob: Blob) => {

                if (!blob || blob.size === 0) {
                    this.notificationService.sendError('Generated report is empty.');
                    return;
                }

                const extension = reportExtension?.toLowerCase();
                const objectUrl = URL.createObjectURL(
                    new Blob([blob], {
                        type: extension === 'pdf'
                            ? 'application/pdf'
                            : blob.type
                    })
                );

                const link = document.createElement('a');
                link.href = objectUrl;

                if (extension === 'pdf') {
                    link.target = '_blank';
                    link.rel = 'noopener';
                } else {
                    link.download = reportFileName;
                }

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
            }
        });
    }
}
