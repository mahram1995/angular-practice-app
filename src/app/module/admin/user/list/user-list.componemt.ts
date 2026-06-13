import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminService } from '../../service/admin.service';
import { UserRegistrationDTO } from '../../service/admin.domain';
import { Menu } from 'primeng/menu';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from '../../../../app-configuration/app.service/common.service';

@Component({
    selector: 'approval-flow-task',
    templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
    users: UserRegistrationDTO[];
    urlSearchMap: Map<string, any> = new Map();
    totalRecords: number = 0;
    userSearchForm: FormGroup;
    totalPages: number;
    rowPerPage: number = 15
    pageNumber: number = 0;
    cols: any[] = []
    isVisibleSearchDialog: boolean = false
    isSearch: boolean

    @ViewChild('dataTable') dt: Table | undefined;

    constructor(
        private location: Location,
        private router: Router,
        private adminService: AdminService,
        private formBuilder: FormBuilder,
        private commonService: CommonService

    ) {

    }

    ngOnInit() {
        //  this.fetchUsers(null)
        this.prepareSearchForm()
        this.rowPerPage = this.commonService.getRowsPerPage(31)

    }

    prepareSearchForm() {
        this.userSearchForm = this.formBuilder.group({
            userName: [''],
            userBranchId: [''],
            email: [''],
            userStatus: [''],
        });
    }


    onDetails(data: any) {
        this.router.navigate(['admin/user-details'], {
            queryParams: {
                userName: data.userName
            }
        })
    }

    onEdit(data) {
        this.router.navigate(['admin/update-user'], {
            queryParams: {
                userName: data.userName
            }
        })
    }

    fetchUsers(searchParam: any) {
        this.adminService.fetchUsers(searchParam).subscribe(data => {
            this.users = data.content
            this.totalRecords = data.totalElements;
            this.totalPages = data.totalPages;
        })
    }

    createUser() {
        this.router.navigate(['admin/create-user']);
    }


    search() {
        // Remove old search parameters
        for (const control in this.userSearchForm.controls) {
            this.urlSearchMap.delete(control);

            const value = this.userSearchForm.get(control)?.value
                ?.toString()
                .trim();

            if (value) {
                this.urlSearchMap.set(control, value);
            }
        }

        // Reset paginator to first page
        this.dt?.reset();

        this.prepareSearchForm();

    }

    onRowsChange(event: any) {
        this.rowPerPage = event.rows;
        this.fetchUsers(null)
    }

    onPageChange(event: any) {
        this.pageNumber = event.first / event.rows;
        const pageSize = event.rows;
    }


    back() { this.location.back() }

    refresh() {
        this.prepareSearchForm();   // Reset form values first
        this.urlSearchMap.clear();  // Remove old search parameters

        this.dt?.reset();           // Triggers onLazyLoad()
    }


    onLazyLoad(event: TableLazyLoadEvent) {
        this.pageNumber = event.first
            ? Math.floor(event.first / event.rows!)
            : 0;

        this.rowPerPage = event.rows ?? 15;

        this.urlSearchMap.set('page', this.pageNumber);
        this.urlSearchMap.set('size', this.rowPerPage);
        this.urlSearchMap.set('asPage', true);

        this.fetchUsers(this.urlSearchMap);
    }


}
