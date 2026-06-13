import { Component, Input, TemplateRef, ViewChild } from '@angular/core';;
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApprovalFlowTask } from '../../service/task.domain';
import { ApprovalflowService } from '../../service/approval-flow-service';
import { NotificationService } from '../../../../app-configuration/app.service/notification.service';
import { AuthService } from '../../../../module/admin/login/service/auth.service';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../../module/admin/service/admin.service';


@Component({
    selector: 'approval-flow-task-button',
    templateUrl: './approvalflow-task-button.html',
})
export class ApprovalFlowViewButtonComponent {
    userDeligateForm: FormGroup
    isDeligate: boolean = false;
    userList: any[]
    deligateUser: any
    urlSearchMap: Map<string, any> = new Map();
    @Input() taskId: string;
    @Input() header: string;
    constructor(
        private approvalFlowService: ApprovalflowService,
        private notificationService: NotificationService,
        private authService: AuthService,
        private adminService: AdminService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location

    ) {


    }

    ngOnInit() {
        this.preareDeligateForm();
    }
    preareDeligateForm() {
        this.userDeligateForm = this.fb.group({
            deligateUser: [null, [Validators.required]]
        });
    }

    onAccept() {
        const params = new Map<string, any>();
        params.set('taskId', this.taskId);
        params.set('actionName', 'APPROVE');
        this.verifyOperation(params);
    }


    onReject() {
        const params = new Map<string, any>();
        params.set('taskId', this.taskId);
        params.set('actionName', 'REJECTION');
        this.verifyOperation(params);
    }
    onCorrection() {
        const params = new Map<string, any>();
        params.set('taskId', this.taskId);
        params.set('actionName', 'CORRECTION');
        this.verifyOperation(params);
    }
    onDelegation() {

        this.fetchUsers(null)
        this.isDeligate = true;

    }

    onSubmit() {

    }
    back() { this.location.back() }


    taskDetails(data: ApprovalFlowTask) {
        this.router.navigate([data.taskDetailsUi, data.taskId], { relativeTo: this.route });
    }

    verifyOperation(params: any) {
        this.approvalFlowService.verifyTask(params).subscribe(data => {
            this.notificationService.sendSuccess(data.message);
            this.back();
        });
    }

    fetchUsers(searchParam: any) {

        this.urlSearchMap = new Map();
        this.urlSearchMap.set('asPage', false);
        this.adminService.fetchUsers(searchParam).subscribe(data => {
            this.userList = data.map((user: any) => ({
                label: user.userName,
                value: user.userName
            }));
        })
    }
    submitDeligation() {
        let userName = this.userDeligateForm.get('deligateUser')?.value;
        const params = new Map<string, any>();
        params.set('taskId', this.taskId);
        params.set('actionName', 'DELEGATE');
        params.set('delegateUser', userName);

        this.verifyOperation(params);

    }

}
