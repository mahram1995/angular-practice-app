import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BaseService, PathParameters } from '../../../../app-configuration/app.service/base-service';
import { BaseComponent } from '../../../../app-configuration/app-component/base-component/base.component';
import { CommonService } from '../../../../app-configuration/app.service/common.service';
import { FormBaseComponent } from '../../../../app-configuration/app-component/base-component/form.base.component';
import { UDFService } from '../service/udf.service';
import { UDFDomain, UserDefinedField, UserDefinedFieldDomainData } from '../service/udf.domain';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDefinedFields } from '../../../../dynamic-form/json-data/domain';
import { filter } from 'rxjs';
import { NotificationService } from '../../../../app-configuration/app.service/notification.service';



@Component({
    selector: 'generate-report-ui',
    templateUrl: 'generate-report-ui.form.html',
})
export class GenerateReportUiFormComponent extends FormBaseComponent {
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
    reportTypeList = [
        { label: "PDF", value: 'pdf' },
        { label: "DOCX", value: 'docx' },
        { label: "XLS", value: 'xls' },
        { label: "XLSX", value: 'xlsx' },
        { label: "CSV", value: 'csv' },
        { label: "HTML", value: 'html' },

    ];

    udfProfileData: UDFDomain; // Paste your JSON here
    profileId: number

    constructor(private fb: FormBuilder,
        protected override location: Location,
        protected override commonService: CommonService,
        private notificationService: NotificationService,
        protected override router: Router,
        private udfService: UDFService,
        private route: ActivatedRoute,
    ) { super(location, commonService); }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.profileId = params.udfProfileId;
            this.fetchUdfs(this.profileId);

        });
        this.form = this.fb.group({
            reportExtension: ['pdf', Validators.required]
        });

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
                if (field.minimumLength > 0) {
                    validators.push(Validators.minLength(field.minimumLength));
                }
                if (field.maximumLength > 0) {
                    validators.push(Validators.maxLength(field.maximumLength));
                }
            }
            if (field.dataType == 'NUMBER') {
                // Use maximumLength / minimumLength for numeric value in NUMBER field
                if (field.minimumLength !== undefined && field.minimumLength !== null) {
                    validators.push(Validators.min(field.minimumLength));
                }

                if (field.maximumLength !== undefined && field.maximumLength !== null) {
                    validators.push(Validators.max(field.maximumLength));
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

        const queryString = (Object.entries(this.form.value) as [string, any][])
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join("&");

        let data = this.form.value;
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
                    const fileName = this.udfProfileData.reportFileName + '.' + reportExtension;
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
                    label: item[field.labelOfServiceEndpoint || 'label'],
                    value: item[field.valueOfServiceEndpoint || 'value']
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
                            label: item[field.labelOfServiceEndpoint],
                            value: item[field.valueOfServiceEndpoint]
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
}

