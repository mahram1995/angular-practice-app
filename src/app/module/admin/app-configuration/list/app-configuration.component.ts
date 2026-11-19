import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../../app-configuration/app.service/notification.service';
import { Configuration } from '../service/app-configuration.domain';
import { ConfiguraitonService } from '../service/app-configuration.service';
import { FormBaseComponent } from '../../../../app-configuration/app-component/base-component/form.base.component';
import { CommonService } from '../../../../app-configuration/app.service/common.service';

@Component({
    selector: 'app-configuration-list',
    templateUrl: './app-configuraiton.component.html',
})
export class AppConfiguraitonComponent extends FormBaseComponent implements OnInit {
    data: Configuration[];
    urlSearchMap: Map<string, any> = new Map();
    totalRecords: number = 0;
    configurationForm: FormGroup;
    totalPages: number;
    rowPerPage: number = 15
    pageNumber: number = 0;
    cols: any[] = []
    isVisibleSearchDialog: boolean = false
    isEdit = false;

    @ViewChild('dataTable') dt: Table | undefined;

    constructor(

        private notificationService: NotificationService,
        private configurationService: ConfiguraitonService,
        private formBuilder: FormBuilder,

        protected override commonService: CommonService,
        protected override router: Router,
        protected override location: Location,

    ) {
        super(location, commonService);
    }

    ngOnInit() {
        this.fetchConfiguraion(null)
        this.prepareConfigurationForm();

    }

    refresh() {
        this.dt?.reset();
        this.fetchConfiguraion(new Configuration)
    }

    prepareConfigurationForm(data: Configuration | null = null): void {
        const config = data ?? new Configuration();
        this.configurationForm = this.formBuilder.group({
            id: [config.id ?? ''],
            name: [{ value: config.name ?? '', disabled: this.isEdit }],
            description: [{ value: config.description ?? '', disabled: this.isEdit }],
            expectedValue: [{ value: config.expectedValue ?? '', disabled: this.isEdit }],
            actualValue: [config.actualValue ?? '', Validators.required],
            isVisible: [config.isVisible ?? ''],
            isChangeAble: [config.isChangeAble ?? ''],

        });
    }

    fetchConfiguraion(searchParam: any) {
        this.configurationService.getConfigurations(searchParam).subscribe(data => {
            this.data = data
            this.totalRecords = data.totalElements;
            this.totalPages = data.totalPages;
        })
    }

    updateConfiguration(): void {

        this.configurationForm.markAllAsTouched();

        if (this.configurationForm.invalid) {
            this.notificationService.sendError('Actual value is required.');
            return;
        }

        const formData = this.configurationForm.getRawValue();
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, null, null);

        if (this.isEdit) {
            this.configurationService.updateConfigurations(formData, urlSearchParams)
                .subscribe({
                    next: () => {
                        this.notificationService.sendSuccess('Configuration updated successfully.');
                        this.isVisibleSearchDialog = false;
                        this.refresh()
                        this.isEdit = false;
                    }
                });

        } else {
            this.configurationService.saveConfigurations(formData, urlSearchParams)
            .subscribe({
                next: () => {
                    this.notificationService.sendSuccess('Configuration save successfully.');
                    this.isVisibleSearchDialog = false;
                    this.refresh()
                }
            });
        }

    }

    onEdit(data: Configuration): void {
        this.isEdit = true;
        this.prepareConfigurationForm(data);
        this.isVisibleSearchDialog = true;
    }
    addNew() {
        this.isVisibleSearchDialog = true;
    }





    back() { this.location.back() }



}
