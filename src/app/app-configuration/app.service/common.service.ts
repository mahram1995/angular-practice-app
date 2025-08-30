
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationService } from './notification.service';


@Injectable({
    providedIn: 'root',
})
export class CommonService {

    constructor(
        private notificationService: NotificationService,

    ) {

    }

    isFormInvalid(form: any, required_field: any) {
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
            requiredErrorMessage = 'Following field should not be blank :\n----------------------------------------------\n' + requiredErrorMessage;
            this.notificationService.sendError(requiredErrorMessage);
        }
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

}