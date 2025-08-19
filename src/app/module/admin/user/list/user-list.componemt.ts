import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminService } from '../../service/admin.service';
import { UserRegistrationDTO } from '../../service/admin.domain';
import { Menu } from 'primeng/menu';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, FormGroup } from '@angular/forms';

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

    @ViewChild('dataTable') dt: Table | undefined;

    constructor(
        private location: Location,
        private router: Router,
        private adminService: AdminService,
        private formBuilder: FormBuilder,

    ) {

    }

    ngOnInit() {
        this.fetchUsers(null)
        this.prepareSearchForm()

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
        this.router.navigate(['home/user-details'], {
            queryParams: {
                userName: data.userName
            }
        })
    }

    onEdit(data) {
        this.router.navigate(['home/create-user'], {
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
        this.router.navigate(['home/create-user']);
    }

    search(searchMap: Map<string, any>) {
        this.dt?.reset();
        this.urlSearchMap.set('page', 0);
        if (searchMap != null) { this.urlSearchMap = searchMap; }
        for (const control in this.userSearchForm.controls) {
            this.urlSearchMap.delete(control);
            const formControlValue = (this.userSearchForm.get(control).value).toString().trim();
            if (formControlValue.length !== 0) {
                this.urlSearchMap.set(control, formControlValue);
            }
        }
        this.fetchUsers(this.urlSearchMap)
        this.prepareSearchForm()
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
        this.dt?.reset();
        this.setAsPage()
    }
    setAsPage() {
        this.urlSearchMap = new Map();
        this.urlSearchMap.set('asPage', true);
        this.urlSearchMap.set('size', this.rowPerPage);
        this.urlSearchMap.set('page', this.pageNumber);
        this.fetchUsers(this.urlSearchMap);
    }

    onLazyLoad(event: TableLazyLoadEvent) {
        this.rowPerPage = event.rows ?? this.rowPerPage;
        this.pageNumber = event.first / this.rowPerPage;

        if (this.urlSearchMap == null) {
            this.urlSearchMap = new Map();
        }
        this.urlSearchMap.set('asPage', true);
        this.urlSearchMap.set('page', this.pageNumber);  // 0-based index
        this.urlSearchMap.set('size', this.rowPerPage);

        this.adminService.fetchUsers(this.urlSearchMap).subscribe(data => {
            this.users = data.content;
            this.totalRecords = data.totalElements;   // use backend's totalElements
            this.totalPages = data.totalPages;
        });
    }


}
