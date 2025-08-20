
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


}