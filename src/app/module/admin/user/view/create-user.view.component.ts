import { Component, Inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserRegistrationDTO } from '../../service/admin.domain';
import { FormBaseComponent } from '../../../../app-configuration/app-component/base-component/form.base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApprovalflowService } from '../../../../admin/approval-flow/service/approval-flow-service';
import { AdminService } from '../../service/admin.service';
import { NotificationService } from '../../../../app-configuration/app.service/notification.service';

@Component({
    selector: 'app-user-registration',
    templateUrl: './create-user-view.component.html',

})
export class UserRegistrationViewComponent extends FormBaseComponent implements OnInit {
    userInfo: UserRegistrationDTO = new UserRegistrationDTO();
    userName: any;
    header: string;
    message: string = '';
    constructor(
        protected override location: Location,
        protected override router: Router,
        private approvalFlowService: ApprovalflowService,
        private notificationService: NotificationService,
        private adminService: AdminService,
        private route: ActivatedRoute,) {
        super(location);

    }
    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            let command = params.commandName;
            this.taskId = params.taskId
            this.userName = params.userName;
            if (command == 'CREATE_NEW_USER') {
                this.header = 'Create new User'
            }
            if (this.taskId) {
                this.approvalFlowService.fetchApprovalFlowTaskInstancePayload({ taskId: this.taskId }).subscribe(data => {
                    this.userInfo = data
                })
            }
            if (this.userName) {
                this.getUser(this.userName)
            }
        });


    }

    getUser(userName) {
        let param = new Map();
        param.set('userName', userName);
        this.adminService.fetchUsers(param).subscribe(data => {
            this.userInfo = data.content[0]

        })
    }

    back() {
        this.location.back()
    }
    onEdit() {
        this.router.navigate(['admin/create-user'], {
            queryParams: {
                userName: this.userName

            }
        })
    }
    changePassword() {
        let userData = { ...this.userInfo }; // shallow copy
        userData.password = '@'
        this.updateUser(userData)
    }
    activeUser() {
        let userData = { ...this.userInfo }; // shallow copy
        userData.userStatus = 'ACTIVE'
        this.updateUser(userData)

    }
    lockUser() {
        let userData = { ...this.userInfo }; // shallow copy
        userData.userStatus = 'BLOCKED'
        this.updateUser(userData)
    }
    disable() {
        let userData = { ...this.userInfo }; // shallow copy
        userData.userStatus = 'DISABLE'
        this.updateUser(userData)
    }
    updateUser(data: any) {
        this.adminService.updateUser(data, null).subscribe(
            (response) => {
                this.getUser(data.userName)
                this.notificationService.sendSuccess(response.message);
            }
        )
    }

}
