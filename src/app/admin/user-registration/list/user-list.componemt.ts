import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminService } from '../../service/admin.service';
import { UserRegistrationDTO } from '../../service/admin.domain';
import { Menu } from 'primeng/menu';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
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
    cols: any[] = []
    isVisibleSearchDialog: boolean = false

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
            branchId: [''],
            email: [''],
            userStatus: [''],
        });
    }
 

    onDetails(data:any) {
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
        if (searchParam) {
            this.urlSearchMap = searchParam
        } else {
            this.urlSearchMap = new Map();
        }

        this.urlSearchMap.set('asPage', true);
        this.urlSearchMap.set('size', 15);
        this.adminService.fetchUsers(this.urlSearchMap).subscribe(data => {
            this.users = data.content
            this.totalRecords = data.totalElements;
            this.totalPages = data.totalPages;
        })
    }

    createUser() {
        this.router.navigate(['home/create-user']);
    }
  
    search() {
        this.urlSearchMap = new Map()
        for (const control in this.userSearchForm.controls) {
            this.urlSearchMap.delete(control);
            const formControlValue = (this.userSearchForm.get(control).value).toString().trim();
            if (formControlValue.length !== 0) {
                this.urlSearchMap.set(control, formControlValue);
            }
        }
        this.fetchUsers(this.urlSearchMap)
        this.prepareSearchForm()
        console.log(this.userSearchForm.value);
    }

    back() { this.location.back() }

    refresh() { this.fetchUsers(null) }

    onLazyLoad(event: TableLazyLoadEvent) {
        this.urlSearchMap.set('asPage', true);
        this.urlSearchMap.set('page', event.first / 15);
        this.adminService.fetchUsers(this.urlSearchMap).subscribe(data => {
            this.users = data.content;
            this.totalRecords = data.totalElements;
            this.totalPages = data.totalPages;
        });
    }



}
