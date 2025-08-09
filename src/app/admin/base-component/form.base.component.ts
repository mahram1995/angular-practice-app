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
import { ApprovalflowServiceInterface } from '../approval-flow/service/approval.flow.service.Interface';

import { Injectable } from '@angular/core';
import { APPROVAL_FLOW_SERVICE } from '../approval-flow/service/approval-flow.token';

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
    ) {
        super();
    }

    ngAfterViewInit(): void {
        // Optional lifecycle hook
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
        map: Map<string, any> = new Map<string, any>(),
        verifier: string,
        detailsUI: string,
        correctionUI: string
    ): Map<string, any> {
        map.set('verifier', verifier);
        map.set('detailsUI', detailsUI);
        map.set('correctionUI', correctionUI);
        return map;
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
