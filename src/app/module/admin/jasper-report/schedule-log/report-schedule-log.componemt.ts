import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../../app-configuration/app.service/notification.service';
import { CommonService } from '../../../../app-configuration/app.service/common.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { JasperReportService } from '../service/JasperReportService';
import { FormBaseComponent } from '../../../../app-configuration/app-component/base-component/form.base.component';
import { DatabaseConfig, JasperReportScheduleExecution } from '../service/jaspser.report.domain';

@Component({
    selector: 'report-schedule-log',
    templateUrl: './report-schedule-log.component.html',
})
export class JasperReportScheduleLogComponent extends FormBaseComponent implements OnInit {

    schedulerLogs: JasperReportScheduleExecution[] = [];
    urlSearchMap: Map<string, any> = new Map();
    totalRecords: number = 0;
    searchForm: FormGroup;
    totalPages: number;
    rowPerPage: number = 15
    pageNumber: number = 0;


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
        this.fetchExecutionLogList(new Map())
        this.prepareSearchForm();
    }

      convertDateTime(value: number[] | null): Date | null {
        if (!value || value.length < 5) {
            return null;
        }

        return new Date(
            value[0],
            value[1] - 1,
            value[2],
            value[3],
            value[4],
            value[5] || 0
        );
    }

    prepareSearchForm() {
        this.searchForm = this.formBuilder.group({
            reportName: [''],
        });
    }



    fetchExecutionLogList(searchParam: any) {
        this.jasperReportService.fetchExecutionLogs(searchParam).subscribe(data => {
            this.schedulerLogs = data
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
        this.fetchExecutionLogList(this.urlSearchMap)
        this.prepareSearchForm()
    }




    back() { this.location.back() }

    refresh() {
        this.dt?.reset();
        this.setAsPage()
    }
    setAsPage() {

        this.fetchExecutionLogList(this.urlSearchMap);
    }


}
