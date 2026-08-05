import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { PathParameters } from '../../../../app-configuration/app.service/base-service';
import { CommonService } from '../../../../app-configuration/app.service/common.service';
import { FormBaseComponent } from '../../../../app-configuration/app-component/base-component/form.base.component';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../app-configuration/app.service/notification.service';
import { UDFDomain, UserDefinedField, UserDefinedFieldDomainData } from '../../udf/service/udf.domain';
import { UDFService } from '../../udf/service/udf.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
    selector: 'generate-dynamic-report-ui',
    templateUrl: 'generate-dynamic-report-ui.form.html'
})
export class GenerateDynamicReportUiFormComponent extends FormBaseComponent {
    title = 'agular dynamic form';
    reportUrl: string;
    form: FormGroup = this.fb.group({});
    urlSearchMap: Map<string, any> = new Map();
    formValue: any;
    fieldVisibility: { [key: string]: boolean } = {};
    fields: UserDefinedField[] = [];
    domainList: { label: string; value: any }[] = [];
    reportName: any;
    isShowParaForm: boolean = true
    isShowReport: boolean = false
    yearList: { label: string; value: number }[] = [];
    monthList = [
        { label: "January", value: 1 },
        { label: "February", value: 2 },
        { label: "March", value: 3 },
        { label: "April", value: 4 },
        { label: "May", value: 5 },
        { label: "June", value: 6 },
        { label: "July", value: 7 },
        { label: "August", value: 8 },
        { label: "September", value: 9 },
        { label: "October", value: 10 },
        { label: "November", value: 11 },
        { label: "December", value: 12 }
    ];

    reportTypeList = [
        { label: "PDF", value: 'pdf' },
        { label: "DOCX", value: 'docx' },
        { label: "XLS", value: 'xls' },
        { label: "XLSX", value: 'xlsx' },
        { label: "CSV", value: 'csv' },
        { label: "HTML", value: 'html' },

    ];

    cols: any[] = [];
    tableData: any[] = [];

    isExporting = false;
    isExportPDF = false;

    udfProfileData: UDFDomain; // Paste your JSON here
    profileId: number

    selectedPdfColumns: any[] = [];

    rowPerPage = 0; // Default
    fontSize = 12; // Default
    selectedCell: { row: number; field: string } | null = null;






    constructor(private fb: FormBuilder,
        protected override location: Location,
        protected override commonService: CommonService,
        private notificationService: NotificationService,
        protected override router: Router,
        private datePipe: DatePipe,
        private udfService: UDFService,
        private route: ActivatedRoute,
    ) { super(location, commonService); }

    ngOnInit() {
        this.rowPerPage = this.commonService.getRowsPerPage(27)
        this.yearList = this.generateYearList(2000);
        this.route.queryParams.subscribe(params => {
            this.profileId = params.udfProfileId;
            this.fetchUdfs(this.profileId);

        });
        this.form = this.fb.group({
            reportExtension: ['pdf', Validators.required]
        });

    }

    selectCell(row: number, field: string) {
        this.selectedCell = { row, field };
    }

    isSelected(row: number, field: string): boolean {
        return this.selectedCell?.row === row &&
            this.selectedCell?.field === field;
    }
    exportPDF() {
        this.isExportPDF = true;
    }

    increaseFont() {
        if (this.fontSize < 24) {
            this.fontSize++;
        }
    }

    decreaseFont() {
        if (this.fontSize > 8) {
            this.fontSize--;
        }
    }


    generateYearList(startYear: number): { label: string; value: number }[] {
        const currentYear = new Date().getFullYear();
        const years: { label: string; value: number }[] = [];

        for (let year = startYear; year <= currentYear; year++) {
            years.push({ label: year.toString(), value: year });
        }

        // Sort descending
        return years.sort((a, b) => b.value - a.value);
    }


    fetchUdfs(profileId: any) {
        this.urlSearchMap = new Map
        this.urlSearchMap.set('id', profileId)
        this.udfService.getUdfById(this.urlSearchMap).subscribe(data => {
            this.udfProfileData = data
            this.fields = this.udfProfileData.userDefinedFields.sort((a, b) => a.orderNo - b.orderNo);
            this.reportName = this.udfProfileData.name

            this.setValidation();
            this.fields
                .filter(field => field.fieldAppearanceLogics?.length)
                .forEach(field => {
                    field.fieldAppearanceLogics.forEach(dependencyName => {
                        this.form.get(dependencyName.dependentFieldName)?.valueChanges.subscribe(() => {
                            this.loadDependentFieldOptions(field);
                        });
                    });
                });


            // Handle conditional logic
            this.setupConditionalFields();

        })
    }


    setValidation() {
        this.form.addControl('reportExtension', new FormControl('pdf', Validators.required));
        this.fields.forEach(field => {
            const validators = [];
            if (field.mandatory) {
                validators.push(Validators.required);
            }
            if (field.dataType == 'CHAR') {
                if (field.minimumLength) {
                    validators.push(Validators.minLength(+field.minimumLength));
                }
                if (field.maximumLength) {
                    validators.push(Validators.maxLength(+field.maximumLength));
                }
            }
            if (field.dataType == 'NUMBER') {
                // Use maximumLength / minimumLength for numeric value in NUMBER field
                if (field.minimumLength !== undefined && field.minimumLength !== null) {
                    validators.push(Validators.min(+field.minimumLength));
                }

                if (field.maximumLength !== undefined && field.maximumLength !== null) {
                    validators.push(Validators.max(+field.maximumLength));
                }
            }
            if (field.regularExpression) {
                validators.push(Validators.pattern(field.regularExpression));
            }

            this.form.addControl(field.name, new FormControl('', validators));


            if (field.dataType === 'DROP_DOWN') {
                if (field.isServiceEndpoint && field.fieldAppearanceLogics.length == 0) {
                    this.loadDropdownFromService(field); // Load dynamic options
                } else if (field.userDefinedFieldDomainDataList?.length) {
                    this.domainList = field.userDefinedFieldDomainDataList.map(d => ({
                        label: d.label,
                        value: d.value
                    }));
                }
            };

        });

    }

    setMinimumDateValidation(field) {
        const control = this.form.get(field.name);
        let dependentfield = this.fields.find(f => f.name === field.minimumLength)
        let formValue = this.form.value
        control.setValidators([
            (c) => {
                let minDate = this.datePipe.transform(formValue[field.minimumLength], 'dd-MM-yyyy')

                const value = c.value;

                if (minDate) {
                    return value && new Date(value) < new Date(formValue[field.minimumLength])
                        ? { minDate: { required: minDate, actual: value } }
                        : null;

                }
            }
        ]);
        control.updateValueAndValidity();

    }

    setMaximumDateValidation(field) {
        const control = this.form.get(field.name);
        let dependentFiled = this.fields.find(f => f.name === field.maximumLength)
        let formValue = this.form.value
        control.addValidators([
            (c) => {
                let maxDate = this.datePipe.transform(formValue[field.maximumLength], 'dd-MM-yyyy')

                const value = c.value;
                if (maxDate) {
                    return value && new Date(value) > new Date(formValue[field.maximumLength])
                        ? { maxDate: { required: maxDate, actual: value } }
                        : null;
                }
            }
        ]);
        control.updateValueAndValidity();

    }

    onDateSelect(event: any, field: any) {
        if (field.dataType === 'DATE') {
            // Example: ensure selected date >= minimumDate
            if (field.minimumLength) {
                this.setMinimumDateValidation(field)
            }

            if (field.maximumLength) {
                this.setMaximumDateValidation(field)
            }

        }


    }

    loadDependentFieldOptions(field: any) {
        let endpoint = field.serviceEndpoint;

        // Replace placeholders in the endpoint
        field.dependsOn.forEach(dep => {
            const selectedValue = this.form.get(dep)?.value;
            const placeholder = 'P' + dep.toUpperCase();
            endpoint = endpoint.replace(placeholder, selectedValue);
        });

        // Optional: Only call API if all dependencies have values
        const allDependenciesFilled = field.dependsOn.every(dep => !!this.form.get(dep)?.value);
        if (!allDependenciesFilled) return;

    }




    setupConditionalFields() {
        this.fields.forEach(field => {
            this.fieldVisibility[field.name] = true;

            const logicList = field.fieldAppearanceLogics;
            if (logicList.length > 0) {
                logicList.forEach(logic => {
                    const depFieldName = this.getFieldNameById(logic.dependentFieldId);
                    const depControl = this.form.get(depFieldName);

                    if (depControl) {
                        depControl.valueChanges.subscribe(() => {
                            const shouldShow = this.evaluateAllLogics(field.fieldAppearanceLogics);
                            this.fieldVisibility[field.name] = shouldShow;

                            if (shouldShow) {

                                this.form.get(field.name)?.enable();
                            } else {
                                this.form.get(field.name)?.disable();
                                this.form.get(field.name)?.reset();
                            }
                        }); // ✅ closes subscribe


                        // Evaluate once on init
                        const shouldShow = this.evaluateAllLogics(field.fieldAppearanceLogics);
                        this.fieldVisibility[field.name] = shouldShow;
                        if (!shouldShow) {
                            this.form.get(field.name)?.disable();
                        }
                    }
                });
            }
        });
    }

    getFieldNameById(id: number): string {
        const field = this.fields.find(f => f.id === id);
        return field?.name || '';
    }
    getFieldLabelNameByParamName(paramName: string): string {
        const field = this.fields.find(f => f.name === paramName);
        return field?.label || '';
    }
    getFieldIdByFiledName(name: string): number {
        const field = this.fields.find(f => f.name === name);
        return field?.id;
    }

    getUDFIdByDependedFiledId(dependentFieldId: number, selectOptionValue: any, fieldName: string) {
        this.fields.forEach(logic => {
            const data = logic.fieldAppearanceLogics.find(f => f.dependentFieldId === dependentFieldId)
            if (data) {
                let userDefinedFieldId = data.userDefinedFieldId
                let filed = this.fields.find(f => f.id === userDefinedFieldId)

                this.loadDependedDropdownFromService(filed, selectOptionValue, fieldName)
            }
        })
    }


    visibleFields(): any[] {
        return this.fields
            .filter(field => this.fieldVisibility[field.name])
            .sort((a, b) => a.orderNo - b.orderNo);
    }

    evaluateAllLogics(logics: any[]): boolean {
        return logics.every(logic => {
            const depFieldName = this.getFieldNameById(logic.dependentFieldId);
            const depValue = this.form.get(depFieldName)?.value;
            return this.evaluateLogic(depValue, logic);
        });
    }
    evaluateLogic(value: any, logic: any): boolean {
        switch (logic.logicType) {
            case 'EQUAL':
                return String(value).trim() === String(logic.value).trim();

            case 'NOT_EQUAL':
                return String(value).trim() !== String(logic.value).trim();

            case 'EMPTY':
                return value === null || value === undefined || String(value).trim() === '';

            case 'NON_EMPTY':
                return value !== null && value !== undefined && String(value).trim() !== '';

            case 'LESS_THAN':
                return value !== null && value !== '' && Number(value) < Number(logic.value);

            case 'GREATER_THAN':
                return value !== null && value !== '' && Number(value) > Number(logic.value);

            case 'LESS_THAN_OR_EQUAL':
                if (value === null || value === undefined || value === '') {
                    return false; // don't evaluate until there's a real value
                }
                return Number(value) <= Number(logic.value);

            case 'GREATER_THAN_OR_EQUAL':
                return Number(value) >= Number(logic.value);

            case 'BETWEEN': {
                if (!logic.value) return false;
                // format: "min,max" or "{min,max}"
                const parts = logic.value.replace(/[{}]/g, '').split(',');
                if (parts.length < 2) return false;

                const min = Number(parts[0].trim());
                const max = Number(parts[1].trim());

                return Number(value) >= min && Number(value) <= max;
            }

            case 'IN':
                if (!logic.value) return false;
                const trimmed = logic.value.replace(/[{}]/g, '');
                const rawList = trimmed.split(',');
                const allowedValues = rawList.map(v =>
                    v.trim().replace(/^['"]|['"]$/g, '')
                );
                return allowedValues.includes(String(value).trim());
            case 'NOT_IN': {
                if (!logic.value) return true;
                const trimmed = logic.value.replace(/[{}]/g, '');
                const rawList = trimmed.split(',');
                const disallowedValues = rawList.map(v =>
                    v.trim().replace(/^['"]|['"]$/g, '')
                );
                return !disallowedValues.includes(String(value).trim());
            }

            default:
                return false;
        }
    }


    showReport() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const raw = this.form.getRawValue();
        const fixed = {
            ...raw,
            myDate: raw.myDate ? raw.myDate.toISOString() : null
        };
        const filtered = Object.fromEntries(
            Object.entries(fixed).filter(([_, v]) => v !== null && v !== '')
        );

        this.formValue = JSON.stringify(filtered, null, 2);
        this.isShowParaForm = false


    }

    downloadedReport() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        let data = this.form.value;

        let result: { [key: string]: any } = {};
        Object.entries(data).forEach(([key, value]) => {
            let dataType = this.fields.find(f => f.name === key)?.dataType
            if (dataType === 'MONTH' && value) {
                const date = new Date(value as string);
                result[key] = date.getMonth() + 1;
            } else if (dataType === 'YEAR' && value) {
                const date = new Date(value as string);
                result[key] = date.getFullYear();
            } else if (dataType === 'DATE' && value) {
                const date = new Date(value as string);
                result[key] = this.datePipe.transform(date, 'yyyy-MM-dd');
            } else { result[key] = value; }
        });

        const queryString = (Object.entries(result) as [string, any][])
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join("&");

        let reportFileName = this.getReportFIleName(data)
        const reportExtension = data.reportExtension; // or 'html', 'txt'
        const parameter = queryString + '&j_username=jasperadmin&j_password=jasperadmin';

        if (reportFileName === "") {
            this.notificationService.sendError('Report file name is not found, Please check the report file name or expresion')
            return;
        }

        this.urlSearchMap = new Map()
        this.urlSearchMap.set('reportName', reportFileName)
        this.urlSearchMap.set('reportType', reportExtension)
        this.urlSearchMap.set('parameter', parameter)
        this.udfService.getReportFromJasperServer(this.urlSearchMap).subscribe(
            (blob: Blob) => {
                // Success → PDF (or other file)
                const file = new Blob([blob], { type: this.getMimeType(reportExtension) });

                // ✅ Only for XLS/XLSX → trigger download
                if (reportExtension.toLowerCase() === 'xls' || reportExtension.toLowerCase() === 'xlsx'
                    || reportExtension.toLowerCase() === 'docx' || reportExtension.toLowerCase() === 'csv') {
                    const fileName = reportFileName + '.' + reportExtension;
                    const url = window.URL.createObjectURL(file);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    return; // exit to avoid showing PDF preview
                }

                this.reportUrl = URL.createObjectURL(file);
                this.isShowReport = true;
                this.isShowParaForm = false;
            },
            (error: HttpErrorResponse) => {
                // Failure → Angular wraps it in HttpErrorResponse
                if (error.error instanceof Blob && error.error.type === 'text/plain') {
                    error.error.text().then((msg: string) => {
                        this.isShowReport = false;
                        this.isShowParaForm = true;
                        if (error.status == 500) {
                            this.notificationService.sendError('There has report design error')
                        } else {
                            this.notificationService.sendError(msg); // toast}
                        }

                    });
                } else {
                    // fallback
                    this.notificationService.sendError(
                        error.message || 'Unexpected error occurred'
                    );
                }
            }
        )

    }

    getReportFIleName(data: any) {
        let expression = this.udfProfileData.reportFileName; // could be a string or an expression

        let reportFileName: string;

        try {
            // Check if the expression contains ".equals" → treat as expression
            if (expression.includes('===')) {

                // Step 2: Replace 'data' with the object variable (here 'data' itself)
                const finalExpression = expression.replace(/\bdata\b/g, 'data');

                // Step 3: Evaluate safely
                reportFileName = Function('data', `return ${finalExpression}`)(data);
            } else {
                // User provided a single report name → use directly
                reportFileName = expression;
            }
        } catch (e) {
            console.error('Failed to evaluate expression', e);
            reportFileName = ''; // fallback
        }
        return reportFileName;
    }

    getMimeType(type: string): string {
        switch (type.toLowerCase()) {
            case "pdf": return "application/pdf";
            case "xls": return "application/vnd.ms-excel";
            case "xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "csv": return "text/csv";
            case "html": return "text/html";
            case "rtf": return "application/rtf";
            case "xml": return "application/xml";
            case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "odt": return "application/vnd.oasis.opendocument.text";
            case "pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            case "json": return "application/json";
            default: return "application/octet-stream";
        }
    }

    onSelectChange(event: DropdownChangeEvent, fieldName: string): void {
        const selectOptionValue = event.value

        let dependedFiledId = this.getFieldIdByFiledName(fieldName)
        this.getUDFIdByDependedFiledId(dependedFiledId, selectOptionValue, fieldName);



        // You can also trigger any dependent logic from here
    }

    loadDropdownFromService(field: UserDefinedField): void {

        const rawUrl = field.serviceEndpointName; ""
        this.udfService.getDataFromServiceEndPoint(rawUrl).subscribe({
            next: (response: any) => {
                let data = response;

                field.userDefinedFieldDomainDataList = data.map(item => ({
                    label: item[field.labelOfServiceEndpoint ? field.labelOfServiceEndpoint : 'name'],
                    value: item[field.valueOfServiceEndpoint ? field.valueOfServiceEndpoint : 'id']
                }));
            },
            error: err => {
                console.error(`Failed to load  ${field.label} using service endpoind ${field.serviceEndpointName}`, err);
                field.userDefinedFieldDomainDataList = [];
            }
        });
    }

    loadDependedDropdownFromService(field: UserDefinedField, selectOptionValue: any, fieldName: string): void {
        this.form.get(field.name)?.setValue(null);
        this.setupConditionalFields()
        let formValue = this.form.value;
        if (field.serviceEndpointName) {

            let url = this.getPathParameterValue(field.serviceEndpointName, formValue);
            let matches
            if (url) {
                matches = url.match(/{(.*?)}/g);
            }


            if (matches == null) {

                this.udfService.getDataFromServiceEndPoint(url).subscribe({
                    next: (response: any) => {
                        let data = response;

                        field.userDefinedFieldDomainDataList = data.map(item => ({
                            label: item[field.labelOfServiceEndpoint ? field.labelOfServiceEndpoint : 'name'],
                            value: item[field.valueOfServiceEndpoint ? field.valueOfServiceEndpoint : 'id']
                        }));
                        field.userDefinedFieldDomainDataList.unshift(new UserDefinedFieldDomainData(null, null, ' Select ' + field.label, null, null, null))
                    },
                    error: err => {
                        console.error(`Failed to load  ${field.label} using service endpoind ${field.serviceEndpointName}`, err);
                        field.userDefinedFieldDomainDataList = [];
                    }
                })

            }

        }


    }

    getPathParameterValue(url: string, parameters: PathParameters): string {
        let matches
        let fullURL = url;
        // Use regular expression to find all matches within curly braces
        if (fullURL) {
            matches = fullURL.match(/{(.*?)}/g);
        }

        // Check if there are matches and extract the content
        if (matches && matches.length > 0) {
            const params = matches.map(match => match.substring(1, match.length - 1));

            for (let index = 0; index < params.length; index++) {
                let param = params[index];
                if (parameters[param]) {
                    fullURL = fullURL.replace('{' + param + '}', parameters[param])
                } else {
                    // console.log(param + " not found.");
                    throw new Error(`Parameter ${param} was not provided`);
                }
            }
        } else {
            throw new Error(`Please provide paremeter name in the end of API within in curly braces.`);
        }
        return fullURL
    }

    replaceParamsFromObject(url: string, parameters: any): string {
        let fullURL = url;
        // Use regular expression to find all matches within curly braces
        const matches = fullURL.match(/{(.*?)}/g);
        // Check if there are matches and extract the content
        if (matches && matches.length > 0) {
            const params = matches.map(match => match.substring(1, match.length - 1));

            for (let index = 0; index < params.length; index++) {
                let param = params[index];
                if (parameters[param]) {
                    fullURL = fullURL.replace('{' + param + '}', parameters[param])
                } else {
                    // console.log(param + " not found.");
                    throw new Error(`Parameter ${param} was not provided`);
                }
            }
        } else {
            throw new Error(`Please provide paremeter name in the end of API within in curly braces.`);
        }
        return fullURL
    }
    showParaForm() {
        if (this.isShowParaForm) {
            this.isShowParaForm = false
        } else {
            this.isShowParaForm = true
        }
    }

    back() {
        this.router.navigate(['admin/report-list'], {

        })
    }
    refresh() {
        this.form = this.fb.group({});
        this.fields = []
        this.fetchUdfs(this.profileId)
    }


    downloadedData() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        let data = this.form.value;

        let result: { [key: string]: any } = {};
        Object.entries(data).forEach(([key, value]) => {
            let dataType = this.fields.find(f => f.name === key)?.dataType
            if (dataType === 'MONTH' && value) {
                const date = new Date(value as string);
                result[key] = date.getMonth() + 1;
            } else if (dataType === 'YEAR' && value) {
                const date = new Date(value as string);
                result[key] = date.getFullYear();
            } else if (dataType === 'DATE' && value) {
                const date = new Date(value as string);
                result[key] = this.datePipe.transform(date, 'yyyy-MM-dd');
            } else { result[key] = value; }
        });


        let params = {
            sql: 'select * from budget_transaction',
            params: result

        }
        const urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, null, null);




        this.udfService.getReportData(params, urlSearchParams).subscribe(
            (response) => {
                this.isShowParaForm = false;
                this.isShowReport = true;
                console.log(response);

                this.tableData = response;

                if (response && response.length > 0) {
                    this.cols = Object.keys(response[0]).map(key => ({
                        field: key,
                        header: key.replace(/_/g, ' ')
                    }));
                    this.selectedPdfColumns = [...this.cols];
                }
            });

    }

    exportExcel() {
        this.isExporting = true
        setTimeout(() => {

            try {
                const workbook = XLSX.utils.book_new();

                const chunkSize = 300000; // 300k rows per sheet

                for (let i = 0; i < this.tableData.length; i += chunkSize) {

                    const chunk = this.tableData.slice(i, i + chunkSize);

                    const worksheet = XLSX.utils.json_to_sheet(chunk);

                    const sheetName = `Report_${Math.floor(i / chunkSize) + 1}`;

                    XLSX.utils.book_append_sheet(
                        workbook,
                        worksheet,
                        sheetName
                    );
                }

                XLSX.writeFile(
                    workbook,
                    'Budget_Report.xlsx',
                    {
                        compression: true
                    }
                );

            } finally {
                this.isExporting = false
            }

        }, 100);



    }




    exportPdfReport() {

        this.isExporting = true
        setTimeout(() => {

            try {

                const doc = new jsPDF('l', 'mm', 'a4');


                const headers = this.selectedPdfColumns.map(
                    c => c.header
                );


                const rows = this.tableData.map(row => {

                    return this.selectedPdfColumns.map(
                        c => row[c.field]
                    );

                });


                autoTable(doc, {

                    head: [headers],

                    body: rows,

                    styles: {
                        fontSize: 8
                    },

                    columnStyles:
                        this.selectedPdfColumns.reduce(
                            (obj, col, index) => {

                                obj[index] = {
                                    cellWidth:
                                        col.width ? col.width / 4 : 'auto'
                                };

                                return obj;

                            }, {}
                        )

                });


                doc.save('Report.pdf');

            } finally {
                this.isExporting = false
            }

        }, 100);



    }

    columnResize(event: any) {

        const column = event.element;

        const field = column.getAttribute('data-field');

        const col = this.cols.find(
            x => x.field === field
        );

        if (col) {
            col.width = column.offsetWidth;
        }
    }



}

