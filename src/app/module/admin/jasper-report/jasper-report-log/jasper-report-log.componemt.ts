import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../../app-configuration/app.service/notification.service';
import { CommonService } from '../../../../app-configuration/app.service/common.service';

import { UDFService } from '../../udf/service/udf.service';
import { JasperReportService } from '../service/JasperReportService';
import { FormBaseComponent } from '../../../../app-configuration/app-component/base-component/form.base.component';
import { JasperReportAuditDomain } from '../service/jaspser.report.domain';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'jasper-report-log',
    templateUrl: './jasper-report-log.component.html',
})
export class JasperReportLogComponent extends FormBaseComponent implements OnInit {
  
    jasperReportAuditLogs: JasperReportAuditDomain[] = [];
    urlSearchMap: Map<string, any> = new Map();
    totalRecords: number = 0;
    searchForm: FormGroup;
    totalPages: number;
    rowPerPage: number = 15
    pageNumber: number = 0;
   


    reportFileName: string = '';
    selectedFile: File | null = null;
    reportStatus: { label: string, value: string }[] = [
        { label: 'Select Status', value: ''},
        { label: 'SUCCESS', value: 'SUCCESS' },
        { label: 'PROCESSING', value: 'PROCESSING'},
        { label: 'NOT-SUCCESS', value: 'NOT-SUCCESS'},
        { label: 'TIMEOUT', value: 'TIMEOUT'}
    ]
    selectedDataSource: string = '';


    constructor(

        private jasperReportService: JasperReportService,
        private udfService: UDFService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private datePipe: DatePipe,
        protected override commonService: CommonService,
        protected override router: Router,
        protected override location: Location,

    ) {
        super(location, commonService);
    }

    ngOnInit() {
        this.fetchJasperReportLog(new Map())
        this.prepareSearchForm();
    }

    prepareSearchForm() {
        this.searchForm = this.formBuilder.group({
            status: [''],
            entryUser: [''],
            fromDate: [''],
            toDate: [''],
            reportName: [''],
        });
    }


    fetchJasperReportLog(searchParam: any) {
        if (searchParam != null) {
            this.urlSearchMap = searchParam;
        }
        this.urlSearchMap.set('asList', false);
        this.jasperReportService.getJasperReportsAuditLog(this.urlSearchMap).subscribe(data => {

            this.jasperReportAuditLogs = data
            this.totalRecords = data.length;
        })
    }



    downloadReport(data: any) {

        const reportFormat = data.reportFormat?.toLowerCase() || '';
        let reportName = (data.reportFileName || 'report').replace(/\.jrxml$/i, '');

        // Generate custom filename
        let fileName;
        if (data.status == 'SUCCESS') {
            fileName = reportName + '.' + reportFormat;

        } else if (data.status == 'NOT-SUCCESS') {
            fileName = reportName + '_error.txt';

        } else{
            fileName = reportName + '_time_out.txt';
        }


        this.urlSearchMap = new Map();
        this.urlSearchMap.set('auditLogId', data.id);
        this.urlSearchMap.set('responseType', 'blob');
        if (data.status == 'SUCCESS') {
            this.jasperReportService.getJasperReportData(this.urlSearchMap).subscribe({

                next: (response: HttpResponse<Blob>) => {

                    const blob = response.body;
                    if (!blob || blob.size === 0) {

                        this.notificationService.sendError(
                            'Report data not found.'
                        );
                        return;
                    }

                    const fileURL = window.URL.createObjectURL(blob);

                    const link = document.createElement('a');

                    link.href = fileURL;
                    link.download = fileName;

                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    // Release memory
                    setTimeout(() => {
                        window.URL.revokeObjectURL(fileURL);
                    }, 60000);
                }
            })
        }
        else {
            this.jasperReportService.getJasperReportError(this.urlSearchMap).subscribe({
                next: (response: HttpResponse<Blob>) => {
                    const blob = response.body;
                    if (!blob || blob.size === 0) {
                        this.notificationService.sendError(
                            'Report data not found.'
                        );
                        return;
                    }

                    const fileURL = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');

                    link.href = fileURL;
                    link.download = fileName;

                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    // Release memory
                    setTimeout(() => {
                        window.URL.revokeObjectURL(fileURL);
                    }, 60000);
                }
            })

        };
    }


    search(searchMap: Map<string, any>) {
        this.jasperReportAuditLogs = []
        if (searchMap != null) { this.urlSearchMap = searchMap; }
        for (const control in this.searchForm.controls) {
            this.urlSearchMap.delete(control);
            const formControlValue = (this.searchForm.get(control).value).toString().trim();
            if (formControlValue.length !== 0) {
                if (control === 'fromDate' || control === 'toDate') {
                    const date = new Date(formControlValue as string);
                    const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
                    this.urlSearchMap.set(control, formattedDate);
                } else {
                    this.urlSearchMap.set(control, formControlValue);
                }
            }
        }
        this.fetchJasperReportLog(this.urlSearchMap)
        this.prepareSearchForm()
    }
  

    onPageChange(event: any) {
        this.pageNumber = event.first / event.rows;
        const pageSize = event.rows;
    }



    back() { this.location.back() }

    refresh() {
        this.jasperReportAuditLogs = [];
        this.setAsPage()
    }

    setAsPage() {
        this.urlSearchMap = new Map();
        this.urlSearchMap.set('asList', false);
        this.urlSearchMap.set('size', this.rowPerPage);
        this.urlSearchMap.set('page', this.pageNumber);
        this.fetchJasperReportLog(this.urlSearchMap);
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
            this.jasperReportAuditLogs = data.content;
            this.totalRecords = data.totalElements;   // use backend's totalElements
            this.totalPages = data.totalPages;
        });
    }


}
