import { Component, Inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserRegistrationDTO } from '../../service/admin.domain';
import { FormBaseComponent } from '../../base-component/form.base.component';
import { ActivatedRoute } from '@angular/router';
import { ApprovalflowService } from '../../approval-flow/service/approval-flow-service';

@Component({
    selector: 'app-user-registration',
    templateUrl: './create-user-view.component.html',

})
export class UserRegistrationViewComponent extends FormBaseComponent implements OnInit {
    userInfo: UserRegistrationDTO = new UserRegistrationDTO();
    header: string;
    message: string = '';
    constructor(
        protected override location: Location,
        private approvalFlowService: ApprovalflowService,
        private route: ActivatedRoute,) {
        super(location);

    }
    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            let command = params.commandName;
            this.taskId = params.taskId
            if (command == 'CREATE_NEW_USER') {
                this.header = 'Create new User'
            }
            if (this.taskId) {
                this.approvalFlowService.fetchApprovalFlowTaskInstancePayload({ taskId: this.taskId }).subscribe(data => {
                    this.userInfo = data
                })
            }
        });


    }

}
