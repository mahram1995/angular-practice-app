import {
    AfterViewInit,
    ElementRef,
    Inject,
    Injector,
} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from './base.component';

import { Injectable } from '@angular/core';
import { CommonService } from '../../app.service/common.service';

@Injectable()
export class FormBaseComponent extends BaseComponent implements AfterViewInit {
    taskId: any;
    processId: string;
    command: string;
    showVerifierSelectionModal: Observable<boolean>;
    commandReference: string;
    key_B: number = 0;
    moduleName: string = '';
    _module_name: string = '';
    currentElementList: any[] = [];
    currentIndex: number = 0;
    observer: any;
    notificationMsg: string = '';
    notificationMsgWithParam: string = '';
    currentElementListSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    currentElementList$: Observable<any[]> = this.currentElementListSubject.asObservable();
    isBackToTaskList: boolean = true;
    parent!: ElementRef;

    constructor(
        protected location: Location,
        protected commonService: CommonService
    ) {
        super();
    }

    ngAfterViewInit(): void {
        this.commonService.focusFirstControl();
    }

    handleNavigation(): void {
        if (this.location) {
            this.location.back();
        }
    }

    updateCurrentList(): void {
        this.currentElementListSubject.next(this.currentElementList);
    }

    focusElement(tabIndex: any): void {
        setTimeout(() => {
            const element = document.querySelector(`[tabindex="${tabIndex}"]`) as HTMLElement;
            if (element) {
                element.focus();
            }
        }, 0);
    }

    protected fetchApprovalFlowTaskInstancePayload(): any {

    }

    protected getCurrentPath(): string {
        const fullPath = this.location.path();
        return fullPath.includes('?') ? fullPath.split('?')[0] : fullPath;
    }

    protected getQueryParamMapForApprovalFlow(
        verifier: string,
        taskId: number,
        detailsUI: string,
        correctionUI: string
    ): Map<string, any> {
        const params = new Map<string, any>();
        params.set('verifier', verifier != null ? verifier : null);
        params.set('taskId', taskId != null ? taskId : null);
        params.set('detailsUI', detailsUI != null ? detailsUI : null);
        params.set('correctionUI', correctionUI != null ? correctionUI : null);
        return params;
    }

    isValidPattern(formName: string, controlName: string): boolean {
        const form = this[formName];
        const control = form?.get(controlName);

        return !!(
            control &&
            control.errors?.['pattern'] &&
            !control.errors?.['required'] && // prevent overlap with required
            (control.touched || control.dirty)
        );
    }

    isRequired(formName: string, controlName: string): boolean {
        const control = this[formName]?.get(controlName);
        return !!(control && control.errors?.['required'] && (control.touched || control.dirty || this.commonService.isSumbitted));
    }

    isMinLength(formName: string, controlName: string): boolean {
        const control = this[formName]?.get(controlName);
        return !!(control && control.errors?.['minlength'] && (control.touched || control.dirty || this.commonService.isSumbitted));
    }

    isMaxLength(formName: string, controlName: string): boolean {
        const control = this[formName]?.get(controlName);
        return !!(control && control.errors?.['maxlength'] && (control.touched || control.dirty || this.commonService.isSumbitted));
    }

    isInvalid(formName: string, controlName: string): boolean {
        const control = this[formName]?.get(controlName);
        return !!(control && control.invalid && (control.touched || control.dirty || this.commonService.isSumbitted));
    }

    isMaxValue(formName: string, controlName: string): boolean {
        const control = this[formName]?.get(controlName);
        return !!(control && control.errors?.['max'] && (control.touched || control.dirty || this.commonService.isSumbitted));
    }

    isMinValue(formName: string, controlName: string): boolean {
        const control = this[formName]?.get(controlName);
        return !!(control && control.errors?.['min'] && (control.touched || control.dirty || this.commonService.isSumbitted));
    }






    protected getQueryParamMapForDetailAndCorrectionUI(
        map: Map<string, any>,
        detailsUI: string,
        correctionUI: string
    ): Map<string, any> {
        map.set('detailsUI', detailsUI);
        map.set('correctionUI', correctionUI);
        return map;
    }

    createUrlWithQueryParam(url: string, obj?: object): string {
        const query = this.convertQueryParam(obj);
        if (!query) return url;

        const hasQuestionMark = url.includes('?');
        const separator = hasQuestionMark ? (url.endsWith('?') || url.endsWith('&') ? '' : '&') : '?';

        return `${url}${separator}${query}`;
    }

    convertQueryParam(obj?: object): string {
        if (!obj) return '';
        return Object.entries(obj)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
    }

    gotoPendingTaskPage(router: Router): void {
        router.navigate(['/approvalflow/pending-task']);
    }

    getUserInfo(): any {
        const user = sessionStorage.getItem('user');
        if (!user) {
            console.warn('No user found in sessionStorage.');
            return null;
        }
        try {
            const userInfo = JSON.parse(user);
            return userInfo
        } catch (error) {
            console.error('Failed to parse user JSON:', error);
            return null;
        }
    }


}
