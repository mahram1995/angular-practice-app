import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';


@Component({
    selector: 'admin-home-page',
    templateUrl: './admin.home.page.html'
})
export class AdminHomePageComponent implements OnInit {



    @Input() root: boolean;

    @Input() visible: boolean;


    constructor(protected location: Location,
        protected router: Router,

    ) {

    }

    @Input('isApprovalView') isApprovalView: boolean;

    ngOnInit() {


    }


}


