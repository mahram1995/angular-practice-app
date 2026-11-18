
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { NotificationService } from '../../../../app-configuration/app.service/notification.service';
import { CommonService } from '../../../../app-configuration/app.service/common.service';
import { JasperReportService } from '../service/JasperReportService';
import { FormBaseComponent } from '../../../../app-configuration/app-component/base-component/form.base.component';

interface JsonField {
    key: string;
    label: string;
    value: string;
    type: string;
}

@Component({
    selector: 'qr-code-verification',
    templateUrl: './qrcode-verification.component.html',
    styleUrls: ['./qrcode-verification.css']
})
export class QRCodeVerificationComponent extends FormBaseComponent implements OnInit {

    urlSearchMap: Map<string, any> = new Map();

    jsonData: any = null;

    fields: JsonField[] = [];

    filteredFields: JsonField[] = [];

    securityToken: string = '';
    securityTokenFromUrl: string =null;
    isPublicVerify=false;

    searchText: string = '';

    loading: boolean = false;

    verified: boolean = false;

    constructor(
        private jasperReportService: JasperReportService,
        private notificationService: NotificationService,
        private activatedRoute: ActivatedRoute,
        protected override commonService: CommonService,
        protected override router: Router,
        protected override location: Location,
    ) {
        super(location, commonService);
    }

    ngOnInit(): void {

        this.activatedRoute.paramMap.subscribe(params => {

            this.securityTokenFromUrl = params.get('securityToken') || '';

            if (this.securityTokenFromUrl) {
                this.isPublicVerify=true
                this.verifyQRCode(this.securityTokenFromUrl);
            }else{
                this.securityTokenFromUrl=null
            }
        });
    }

    verifyQRCode(securityToken: string): void {
        let token

        this.filteredFields=[]
        this.urlSearchMap.clear();
        if (securityToken != null) {
            token = this.securityTokenFromUrl
        } else {
            token = this.securityToken
        }

        this.jasperReportService.verifyQRCode(token)
            .subscribe({
                next: (data: any) => {
                    this.jsonData = data;
                    this.generateFields(data);
                    this.verified = this.fields.length > 0;
                    this.loading = false;
                }
            });
    }

    /**
     * Convert dynamic JSON into display fields
     */
    generateFields(data: any): void {

        if (!data) {
            this.fields = [];
            this.filteredFields = [];
            return;
        }

        // Handle both JSON object and array responses
        const jsonObject = Array.isArray(data) ? data[0] : data;

        if (!jsonObject || typeof jsonObject !== 'object') {
            this.fields = [];
            this.filteredFields = [];
            return;
        }

        this.fields = Object.entries(jsonObject).map(([key, value]) => {

            return {
                key: key,
                label: this.formatLabel(key),
                value: this.formatValue(value),
                type: this.getValueType(value)
            };

        });

        this.filteredFields = [...this.fields];

    }

    /**
     * CUSTOMER_CODE -> Customer Code
     */
    formatLabel(key: string): string {

        return key
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase());

    }

    /**
     * Convert values into displayable strings
     */
    formatValue(value: any): string {

        if (value === null || value === undefined || value === '') {
            return 'N/A';
        }

        if (typeof value === 'object') {
            return JSON.stringify(value);
        }

        return String(value);

    }

    getValueType(value: any): string {

        if (value === null || value === undefined) {
            return 'empty';
        }

        if (typeof value === 'number') {
            return 'number';
        }

        if (typeof value === 'boolean') {
            return 'boolean';
        }

        if (typeof value === 'object') {
            return 'object';
        }

        return 'text';

    }

    /**
     * Search customer information
     */
    searchFields(): void {

        const search = this.searchText.toLowerCase().trim();

        if (!search) {
            this.filteredFields = [...this.fields];
            return;
        }

        this.filteredFields = this.fields.filter(field =>
            field.label.toLowerCase().includes(search) ||
            field.value.toLowerCase().includes(search)
        );

    }

    /**
     * Copy individual value
     */
    copyValue(value: string): void {

        navigator.clipboard.writeText(value)
            .then(() => {
                this.notificationService.sendSuccess('Copied successfully.');
            })
            .catch(error => {
                console.error('Copy failed:', error);
            });

    }

    /**
     * Copy complete JSON
     */
    copyAll(): void {

        navigator.clipboard.writeText(
            JSON.stringify(this.jsonData, null, 2)
        ).then(() => {
            this.notificationService.sendSuccess('JSON copied successfully.');
        });

    }

    back(): void {
        this.location.back();
    }

    refresh(): void {

        if (this.securityToken) {
            this.verifyQRCode(this.securityToken);
        }

    }

}
