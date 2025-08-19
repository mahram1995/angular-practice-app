import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { Title } from "@angular/platform-browser";

@Component({
    selector: 'admin-module',
    templateUrl: './admin.component.html',
})
export class AdminHomeComponent implements OnInit {


    constructor(protected location: Location,
        protected router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private titleService:Title
    ) {
         this.titleService.setTitle('Ababil Admin')
    }
    ngOnInit() { 
    }

}