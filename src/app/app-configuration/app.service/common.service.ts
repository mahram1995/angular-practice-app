
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationService } from './notification.service';
import { map, Observable, of, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class CommonService {
    static getClientIpAddress(): string | string[] {
        throw new Error('Method not implemented.');
    }
    private showProgressLoader = new Subject<any>();
    isSumbitted: boolean = false;
    public loaderVisble: boolean = false;
    public requestsPending: number = 0;


    constructor(
        // Don't call any service here. 
        private notificationService: NotificationService,
        private http: HttpClient

    ) {

    }

    isFormInvalid(form: any, required_field: any) {
        this.isSumbitted = true
        form.markAllAsTouched();

        let requiredErrorMessage: any
        for (const key in form.controls) {
            if (form.controls[key]) {
                if (form.controls[key].status === 'INVALID' && required_field[key]) {
                    if (requiredErrorMessage) {
                        requiredErrorMessage += ", \n" + required_field[key];
                    } else {
                        requiredErrorMessage = required_field[key];
                    }
                }
            }
        }
        if (requiredErrorMessage) {
            requiredErrorMessage = 'Following field should not be blank :\n ' + requiredErrorMessage;
            this.notificationService.sendError(requiredErrorMessage);
        }
        this.isSumbitted = false
        return form.invalid;
    }

    getQueryParamMapForApprovalFlow(
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

    sortByKeyDesc(array: any, key: string) {
        return array.sort(function (a: any, b: any) {
            var x = a[key]; var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        })
    }

    sortByKeyAsc(array: any, key: string) {
        return array.sort(function (a: any, b: any) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        })
    }


    getMaxValu(arr: any, key: any) {
        var max = 0;
        for (var i = 0; i < arr.length; i++) {
            if (max < arr[i][key])
                max = arr[i][key];
        }
        return max;
    }

    private clientIp: string | null = null;


    /** Called once to load and store the IP */
    loadClientIp(): Observable<string> {
        if (this.clientIp) {
            return of(this.clientIp); // ✅ already loaded
        }

        return this.http.get('https://api.ipify.org?format=json').pipe(
            map((res: any) => res.ip),
            tap(ip => this.clientIp = ip) // ✅ store the result
        );
    }

    /** Used later — returns cached IP (or null if not loaded yet) */
    getClientIp(): string | null {
        console.log(this.clientIp);

        return this.clientIp;
    }

    getRowsPerPage(
        rowHeight: number,
        reservedHeight: number = 250,
        minimumRows: number = 10
    ): number {

        return Math.max(
            Math.floor((window.innerHeight - reservedHeight) / rowHeight),
            minimumRows
        );
    }

    getScreenHeight( ): string {
        let reservedHeight: number = 120
        return (window.innerHeight - reservedHeight).toLocaleString()
    }


    focusFirstControl(): void {
        setTimeout(() => {
            const element = document.querySelector(
                'input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
            ) as HTMLElement;

            element?.focus();
        }, 100);
    }


}