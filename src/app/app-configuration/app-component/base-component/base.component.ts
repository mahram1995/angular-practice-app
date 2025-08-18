import { FormGroup, FormArray } from '@angular/forms';
import { Injectable, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Injectable()
export class BaseComponent implements OnDestroy {
    subscribers: any[] = [];
    key_Back: number = 0;
    isFormDataChanged: boolean = false;
    approvalFlowRequired: boolean = false;

    constructor(protected router?: Router) { }

    hasOwnProperty = Object.prototype.hasOwnProperty;

    isFunction(value: any): boolean {
        return typeof value === 'function';
    }

    isArray(arr: any): boolean {
        return Array.isArray(arr);
    }

    isString(value: any): boolean {
        return typeof value === 'string';
    }

    isNumber(value: any): boolean {
        return typeof value === 'number' && isFinite(value);
    }

    isWindow(obj: any): boolean {
        return obj != null && obj === obj.window;
    }

    isBlankObject(value: any): boolean {
        return value !== null && typeof value === 'object' && !Object.getPrototypeOf(value);
    }

    isEmpty(obj: any): boolean {
        if (obj == null) return true;
        if (this.isArray(obj) || this.isString(obj)) return obj.length === 0;
        for (let key in obj) {
            if (this.hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    }

    ngOnDestroy(): void {
        this.subscribers.forEach(sub => sub.unsubscribe && sub.unsubscribe());
    }

    isApprovalFlowEnabled(notificationService: any): void {
        if (!this.approvalFlowRequired) {
            notificationService.sendWarning('Approval Flow is not enabled.');
        }
    }

    currentPath(location: Location, stripParams: boolean = false): string {
        const path = location.path();
        return stripParams ? path.split('?')[0] : path;
    }

    initEnterNavigation(tagName: string): void {
        const inputEls = document.querySelectorAll(tagName);
        inputEls.forEach((el, index) => {
            el.addEventListener('keydown', (event: any) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    const next = inputEls[index + 1] as HTMLElement;
                    if (next) next.focus();
                }
            });
        });
    }

    makeblob(dataURL: any): Blob {
        const parts = dataURL.split(',');
        const byteString = atob(parts[1]);
        const mimeString = parts[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    protected markFormGroupAsTouched(group: FormGroup | FormArray): void {
        Object.keys(group.controls).forEach((key) => {
            const control = group.get(key);
            if (control instanceof FormGroup || control instanceof FormArray) {
                this.markFormGroupAsTouched(control);
            } else {
                control?.markAsTouched();
            }
        });
    }

    protected markFormGroupAsUnTouched(group: FormGroup): void {
        Object.keys(group.controls).forEach(key => {
            const control = group.get(key);
            control?.markAsUntouched();
        });
    }

    protected checkIfFormDataChanged(formGroup: FormGroup): void {
        this.isFormDataChanged = formGroup.dirty;
    }

    protected binaryStringToBlob(binaryString: string): Blob {
        const byteNumbers = new Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            byteNumbers[i] = binaryString.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray]);
    }

    moduleRouter(path: any[], extras: any = {}): void {
        this.router?.navigate(path, extras);
    }

    numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        return charCode >= 48 && charCode <= 57;
    }

    getDateFormattedString(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    roundToNDecimal(num: number, toDecimalPoint: number = 2): number {
        const factor = Math.pow(10, toDecimalPoint);
        return Math.round(num * factor) / factor;
    }
}
