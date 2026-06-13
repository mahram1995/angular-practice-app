import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { NotificationService } from "../../../../../app-configuration/app.service/notification.service";
import { FormBuilder } from "@angular/forms";
import { CommonService } from "../../../../../app-configuration/app.service/common.service";

@Component({
    selector: 'financial-institute-form',
    templateUrl: './bank.form.component.html',
})
export class FinancialInstituteFormComponent implements OnInit {

    constructor(
        private location: Location,
        private router: Router,
        private commonService: CommonService,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,

    ) {

    }

    ngOnInit() {

    }

    create() {

    }

    refresh() { }

    back() { this.location.back() }


}