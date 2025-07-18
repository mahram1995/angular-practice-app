import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UDFFormData } from '../json-data/form-data';

@Component({
    selector: 'dynamic-form',
    templateUrl: 'dynamic-form.html',
})
export class DynamicFormComponent {
    title = 'agular dynamic form';

    form: FormGroup = this.fb.group({});
    fieldVisibility: { [key: string]: boolean } = {};
    fields: any[] = [];
    reportName: any;

    jsonData = UDFFormData; // Paste your JSON here

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        this.fields = this.jsonData.userDefinedFields.sort((a, b) => a.order - b.order);
        this.reportName = this.jsonData.name

        this.fields.forEach(field => {
            const validators = [];
            if (field.mandatory) {
                validators.push(Validators.required);
            }
            if (field.minimumLength > 0) {
                validators.push(Validators.minLength(field.minimumLength));
            }
            if (field.maximumLength > 0) {
                validators.push(Validators.maxLength(field.maximumLength));
            }
            if (field.regularExpression) {
                validators.push(Validators.pattern(field.regularExpression));
            }

            this.form.addControl(field.name, new FormControl('', validators));
        });

        // Handle conditional logic
        this.setupConditionalFields();
    }

    setupConditionalFields() {
        this.fields.forEach(field => {
            this.fieldVisibility[field.name] = true;

            const logicList = field.fieldAppearanceLogics || [];
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
                        });

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

    evaluateLogic(value: any, logic: any): boolean {
        switch (logic.logicType) {
            case 'EQUAL':
                return value === logic.value;
            case 'NON_EMPTY':
                return value !== null && value !== undefined && value !== '';
            case 'IN':
                if (!logic.value) return false;

                // Step 1: Remove curly braces
                const trimmed = logic.value.replace(/[{}]/g, '');

                // Step 2: Split by commas
                const rawList = trimmed.split(',');

                // Step 3: Clean each item (remove quotes and trim)
                const allowedValues = rawList.map(v =>
                    v.trim().replace(/^['"]|['"]$/g, '')
                );

                // Step 4: Check if fieldValue is in the cleaned list
                return allowedValues.includes(String(value));
            default:
                return false;
        }
    }
    visibleFields(): any[] {
        return this.fields
            .filter(field => this.fieldVisibility[field.name])
            .sort((a, b) => a.order - b.order);
    }

    evaluateAllLogics(logics: any[]): boolean {
        return logics.every(logic => {
            const depFieldName = this.getFieldNameById(logic.dependentFieldId);
            const depValue = this.form.get(depFieldName)?.value;
            return this.evaluateLogic(depValue, logic);
        });
    }

    submitForm() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            // Show message for each required hidden field
            this.fields.forEach(field => {
                const control = this.form.get(field.name);
                if (!this.fieldVisibility[field.name] && field.mandatory) {
                    console.warn(`${field.label} is required but currently hidden.`);
                    // or use a toast/snackbar to show warning
                }
            });
            return;
        }
        console.log("Form Submitted", this.form.value);
    }
}

