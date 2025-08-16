import { Component, Inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserRegistrationDTO } from '../../service/admin.domain';
import { FormBaseComponent } from '../../base-component/form.base.component';
import { ActivatedRoute } from '@angular/router';
import { ApprovalflowService } from '../../approval-flow/service/approval-flow-service';
import { AdminService } from '../../service/admin.service';

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
        private approvalFlowService: ApprovalflowService,
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

}
