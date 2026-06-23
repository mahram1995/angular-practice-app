import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { FinancialInstituteService } from "../../service/financial-institute.service";


@Component({
    selector: 'branch-details',
    templateUrl: './branch-details.component.html',
})
export class BranchDetailsComponent implements OnInit {

    branchInfo: any
    branchId: number;

    urlSearchMap: Map<string, any> = new Map();

    constructor(
        private location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private bankService: FinancialInstituteService,

    ) {

    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let command = params.commandName;

            this.branchId = params.branchId;

            if (this.branchId) {
                this.fetchBranch(this.branchId)
            }
        });
    }




    fetchBranch(branchId: number) {
        this.bankService.getBranchById({ branchId: branchId }).subscribe(data => {
            this.branchInfo = data;
        })
    }


    create() {
        this.router.navigate(['admin/financial-institute/create-financial-institute']);
    }

    refresh() {
        this.urlSearchMap.clear();  // Remove old search parameters
    }

    back() { this.location.back() }


}