import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NotificationService } from '../../../../app-configuration/app.service/notification.service';
import { CommonService } from '../../../../app-configuration/app.service/common.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { UDFDomain } from '../../udf/service/udf.domain';
import { UDFService } from '../../udf/service/udf.service';
import { JasperReportService } from '../service/JasperReportService';
import { FormBaseComponent } from '../../../../app-configuration/app-component/base-component/form.base.component';
import { DatabaseConfig, JasperReportScheduler, SCHEDULE_FREQUENCY_OPTIONS, ScheduleFrequency } from '../service/jaspser.report.domain';

const DETAILS_UI = 'admin/jasper-report-log';
const CORRECTION_UI = 'admin/jasepr-report-log';
@Component({
    selector: 'schedule-configuration',
    templateUrl: './schedule-configuration.component.html',
})
export class ScheduleConfigurationComponent extends FormBaseComponent implements OnInit {
    required_field: any = {
        dbName: 'Data Source Name',
        password: 'Password',
        url: 'Database URL',
        username: 'Username',
    };
    schedulerConfigList: JasperReportScheduler[] = [];
    urlSearchMap: Map<string, any> = new Map();
    totalRecords: number = 0;
    searchForm: FormGroup;
    schedulerConfigForm: FormGroup;
    totalPages: number;
    rowPerPage: number = 15
    pageNumber: number = 0;

    isVisibleSearchDialog: boolean = false
    displayNewScheduleDialog: boolean = false;

    reportFileName: string = '';
    selectedFile: File | null = null;
    scheduleFrequency = SCHEDULE_FREQUENCY_OPTIONS;

    isSaving = false;
    isEditMode = false;

    selectedSchedulerId?: number;

    weekDays = [
        { label: 'Monday', value: 1 },
        { label: 'Tuesday', value: 2 },
        { label: 'Wednesday', value: 3 },
        { label: 'Thursday', value: 4 },
        { label: 'Friday', value: 5 },
        { label: 'Saturday', value: 6 },
        { label: 'Sunday', value: 7 }
    ];

    monthDays = [
        ...Array.from({ length: 31 }, (_, i) => ({
            label: `Day ${i + 1}`,
            value: i + 1
        })),
        {
            label: 'Last day of month',
            value: -1
        }
    ];

    months = [
        { label: 'January', value: 1 },
        { label: 'February', value: 2 },
        { label: 'March', value: 3 },
        { label: 'April', value: 4 },
        { label: 'May', value: 5 },
        { label: 'June', value: 6 },
        { label: 'July', value: 7 },
        { label: 'August', value: 8 },
        { label: 'September', value: 9 },
        { label: 'October', value: 10 },
        { label: 'November', value: 11 },
        { label: 'December', value: 12 }
    ];

    reportFormatList = [
        { label: "PDF", value: 'pdf' },
        { label: "DOCS", value: 'docs' },
        { label: "XLS", value: 'xls' },
        { label: "XLSX", value: 'xlsx' },
        { label: "CSV", value: 'csv' },
        { label: "HTML", value: 'html' },

    ];

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
        this.fetchScheduleList(new Map())
        this.prepareSearchForm();
        this.prepareConfigurationForm(new JasperReportScheduler());
    }

    addDataSource() {
        this.isEditMode = false;
        this.selectedSchedulerId = undefined;

        this.prepareConfigurationForm();

        this.displayNewScheduleDialog = true;
    }

    prepareSearchForm() {
        this.searchForm = this.formBuilder.group({
            reportName: [''],
        });
    }

    isInvalidForm(controlName: string): boolean {
        const control = this.schedulerConfigForm?.get(controlName);

        return !!control && control.invalid && (control.touched || this.schedulerConfigForm.touched);
    }

    prepareConfigurationForm(data?: JasperReportScheduler) {

        this.schedulerConfigForm = this.formBuilder.group({
            id: [data?.id],

            // Report
            reportFileName: [data?.reportFileName ?? '', Validators.required],
            reportFormat: [data?.reportFormat ?? 'pdf', Validators.required],
            reportParameters: [data?.reportParameters ?? '', Validators.required],

            // Email
            emailAddressTo: [
                data?.emailAddressTo ?? '',
                [Validators.required, this.emailListValidator]
            ],
            emailAddressCc: [
                data?.emailAddressCc ?? '',
                [this.emailListValidator]
            ],
            isSendEmailSeparately: [data?.isSendEmailSeparately ?? false],
            emailSubject: [data?.emailSubject ?? ''],
            emailBody: [data?.emailBody ?? ''],
            emailSignature: [data?.emailSignature ?? ''],

            // Schedule
            scheduleTime: [data?.scheduleTime ?? '', Validators.required],
            scheduleFrequency: [data?.scheduleFrequency ?? 'DAILY', Validators.required],
            scheduleDate: [data?.scheduleDate ?? null],
            scheduleDay: [data?.scheduleDay ?? ''],
            scheduleMonth: [data?.scheduleMonth ?? null],
            scheduleWeekCycle: [data?.scheduleWeekCycle ?? null],

            // Validity
            startDate: [this.convertLocalDate(data?.startDate) ?? '', Validators.required],
            endDate: [this.convertLocalDate(data?.endDate) ?? ''],
            isActive: [data?.isActive ?? true]
        }, {
            validators: [this.dateRangeValidator]
        });

        this.applyFrequencyValidators();

        this.schedulerConfigForm.get('scheduleFrequency')?.valueChanges.subscribe(() => {
            this.applyFrequencyValidators();
        });
    }

    convertLocalDate(value: any): string | null {

        if (!value) {
            return null;
        }

        // Backend returns [year, month, day]
        if (Array.isArray(value)) {
            const year = value[0];
            const month = String(value[1]).padStart(2, '0');
            const day = String(value[2]).padStart(2, '0');

            return `${year}-${month}-${day}`;
        }

        // Already a string
        return value;
    }

    isWeekDaySelected(day: number): boolean {

        const selectedDays = this.schedulerConfigForm.get('scheduleDay')?.value;

        if (!selectedDays) {
            return false;
        }

        return selectedDays
            .split(',')
            .map((x: string) => Number(x))
            .includes(day);
    }

    toggleWeekDay(day: number, event: Event) {

        const checked = (event.target as HTMLInputElement).checked;

        let selectedDays: number[] = this.schedulerConfigForm
            .get('scheduleDay')?.value
            ? this.schedulerConfigForm.get('scheduleDay')?.value
                .split(',')
                .map((x: string) => Number(x))
            : [];

        if (checked) {
            if (!selectedDays.includes(day)) {
                selectedDays.push(day);
            }
        } else {
            selectedDays = selectedDays.filter((x: number) => x !== day);
        }

        selectedDays.sort((a, b) => a - b);

        this.schedulerConfigForm.get('scheduleDay')?.setValue(
            selectedDays.join(',')
        );

        this.schedulerConfigForm.get('scheduleDay')?.markAsTouched();
        this.schedulerConfigForm.get('scheduleDay')?.updateValueAndValidity();
    }

    applyFrequencyValidators() {

        const frequency = this.schedulerConfigForm.get('scheduleFrequency')?.value;

        const scheduleDate = this.schedulerConfigForm.get('scheduleDate');
        const scheduleDay = this.schedulerConfigForm.get('scheduleDay');
        const scheduleMonth = this.schedulerConfigForm.get('scheduleMonth');

        scheduleDate?.clearValidators();
        scheduleDay?.clearValidators();
        scheduleMonth?.clearValidators();

        switch (frequency) {

            case 'WEEKLY':
                scheduleDay?.setValidators(Validators.required);
                break;

            case 'MONTHLY':
                scheduleDate?.setValidators(Validators.required);
                break;

            case 'QUARTERLY':
            case 'HALF_YEARLY':
                scheduleMonth?.setValidators(Validators.required);
                scheduleDate?.setValidators(Validators.required);
                break;

            case 'YEARLY':
                scheduleMonth?.setValidators(Validators.required);
                scheduleDate?.setValidators(Validators.required);
                break;
        }

        scheduleDate?.updateValueAndValidity();
        scheduleDay?.updateValueAndValidity();
        scheduleMonth?.updateValueAndValidity();
    }
    dateRangeValidator(control: AbstractControl): ValidationErrors | null {

        const startDate = control.get('startDate')?.value;
        const endDate = control.get('endDate')?.value;

        if (startDate && endDate && endDate < startDate) {
            return { dateRange: true };
        }

        return null;
    }

    emailListValidator(control: AbstractControl): ValidationErrors | null {

        const value = control.value;

        if (!value || !value.trim()) {
            return null; // Required validator handles empty To field
        }

        const emails = value
            .split(/[;,]/)
            .map((email: string) => email.trim())
            .filter((email: string) => email !== '');

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const invalidEmail = emails.some((email: string) => !emailPattern.test(email));

        return invalidEmail ? { emailList: true } : null;
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


    fetchScheduleList(searchParam: any) {
        this.jasperReportService.getReportScsedule(searchParam).subscribe(data => {

            this.schedulerConfigList = data
            this.totalRecords = data.length;
        })
    }

    getScheduleDetails(data: JasperReportScheduler): string {
        switch (data.scheduleFrequency) {
            case ScheduleFrequency.DAILY:
                return 'Every day';

            case ScheduleFrequency.WEEKLY:
                return `Weekday(s): ${data.scheduleDay || '-'}`;

            case ScheduleFrequency.MONTHLY:
                return `Day ${data.scheduleDate} of every month`;

            case ScheduleFrequency.QUARTERLY:
                return `Every 3 months from month ${data.scheduleMonth}, day ${data.scheduleDate}`;

            case ScheduleFrequency.HALF_YEARLY:
                return `Every 6 months from month ${data.scheduleMonth}, day ${data.scheduleDate}`;

            case ScheduleFrequency.YEARLY:
                return `Month ${data.scheduleMonth}, day ${data.scheduleDate}`;

            default:
                return '-';
        }
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
        this.fetchScheduleList(this.urlSearchMap)
        this.prepareSearchForm()
    }



    back() { this.location.back() }

    refresh() {
        this.dt?.reset();
        this.setAsPage()
    }
    setAsPage() {

        this.fetchScheduleList(this.urlSearchMap);
    }




    editRow(data: JasperReportScheduler) {
        this.isEditMode = true;
        this.selectedSchedulerId = data.id;

        this.prepareConfigurationForm(data);

        this.displayNewScheduleDialog = true;
    }
    deleteRow(data) {

    }
    
    runNow(scheduleId: any) {
        this.urlSearchMap = new Map
        this.urlSearchMap.set('scheduleId', scheduleId)
        this.jasperReportService.checkSchedule(this.urlSearchMap).subscribe(data => {
            this.notificationService.sendSuccess(data);

        })
    }



    saveConfiguration(): void {

        if (this.schedulerConfigForm.invalid) {
            this.schedulerConfigForm.markAllAsTouched();
            return;
        }

        const formData = this.schedulerConfigForm.getRawValue();
        const frequency = formData.scheduleFrequency;

        const payload: JasperReportScheduler = {
            ...formData,

            // Schedule day only for weekly schedules
            scheduleDay: frequency === 'WEEKLY'
                ? formData.scheduleDay
                : null,

            // Schedule date only for monthly and onwards
            scheduleDate: ['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY']
                .includes(frequency)
                ? formData.scheduleDate
                : null,

            // Schedule month only for quarterly, half-yearly and yearly
            scheduleMonth: ['QUARTERLY', 'HALF_YEARLY', 'YEARLY']
                .includes(frequency)
                ? formData.scheduleMonth
                : null,

            // Weekly cycle only when applicable
            scheduleWeekCycle: frequency === 'WEEKLY'
                ? formData.scheduleWeekCycle
                : null,

            // Normalize empty end date
            endDate: formData.endDate || null
        };

        this.isSaving = true;
        let urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, DETAILS_UI, CORRECTION_UI);
        // Replace these API method names with your actual service methods.
        const request$ = this.isEditMode
            ? this.jasperReportService.updateScheduler(payload, urlSearchParams)
            : this.jasperReportService.createScheduler(payload, urlSearchParams);

        request$.subscribe({
            next: (response) => {
                this.isSaving = false;

                this.displayNewScheduleDialog = false;

                this.schedulerConfigForm.reset();

                // Reload scheduler list
                this.fetchScheduleList(null);

                this.notificationService.sendSuccess({
                    detail: this.isEditMode
                        ? 'Schedule updated successfully.'
                        : 'Schedule created successfully.'
                });
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
