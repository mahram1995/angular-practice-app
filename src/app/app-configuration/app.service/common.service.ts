
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationService } from './notification.service';


@Injectable({
    providedIn: 'root',
})
export class CommonService {

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,

    ) {

    }

    navigate(routerLink: string, routerName: any) {
        if (typeof window !== 'undefined' && localStorage.getItem('token') != null) {
            var moduleName = ((routerLink.replace(/\//g, " ")).trim()).split(" ")[0];
            // if (routerName == "cash-deposit") {
            //   this.router.navigate([routerLink]);
            // } else {
            //   this.router.navigate(["/" + moduleName + "/access-denied"]);
            // }

            this.router.navigate([routerLink], { relativeTo: this.route });

        } else {
            this.router.navigate(['/login'], { relativeTo: this.route });
        }

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