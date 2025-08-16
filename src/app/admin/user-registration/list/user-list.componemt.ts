import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminService } from '../../service/admin.service';
import { UserRegistrationDTO } from '../../service/admin.domain';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'approval-flow-task',
    templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
    users: UserRegistrationDTO[];
    urlSearchMap: Map<string, any> = new Map();
    cols: any[] = []
    items: MenuItem[] | undefined;
    selectedUser: any;
    @ViewChild('menu') menu!: Menu;

    constructor(
        private location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private adminService: AdminService

    ) {

    }

    ngOnInit() {
        this.fetchUsers()
        this.items = [{
            items: [
                {
                    label: 'Details',
                    icon: 'pi pi-details',
                    command: () => this.onDetails()
                },
                {
                    label: 'Edit',
                    icon: 'pi pi-edit',
                    command: () => this.onEdit()
                }
            ]
        }];

    }
    openRowMenu(event: Event, user: any) {
        this.selectedUser = user;
        this.menu.toggle(event);
    }

    onDetails() {
        this.router.navigate(['home/user-details'], {
            queryParams: {
                userName: this.selectedUser.userName

            }
        })
    }

    onEdit() {
        this.router.navigate(['home/create-user'], {
            queryParams: {
                userName: this.selectedUser.userName

            }
        })
    }

    fetchUsers() {
        let param = new Map();
        // param.set('userName', 'mahram');
        this.adminService.fetchUsers(param).subscribe(data => {
            this.users = data.content

        })
    }

    createUser() {
        this.router.navigate(['home/create-user']);
    }
    viewUserDetials() { }
    edit(data: any) { }
    search() { }
    back() { this.location.back() }
    refresh() { this.fetchUsers() }




}
