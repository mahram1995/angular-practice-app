import { Component, Input, TemplateRef, ViewChild } from '@angular/core';;
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApprovalFlowTask } from '../../service/task.domain';
import { ApprovalflowService } from '../../service/approval-flow-service';
import { NotificationService } from '../../../../app.service/notification.service';
import { AuthService } from '../../../../login-logout/service/auth.service';
import { HttpParams } from '@angular/common/http';


@Component({
    selector: 'approval-flow-task-button',
    templateUrl: './approvalflow-task-button.html',
})
export class ApprovalFlowViewButtonComponent {
    @Input() taskId: string;
    @Input() header: string;
    constructor(
        private approvalFlowService: ApprovalflowService,
        private notificationService: NotificationService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location

    ) {


    }

    ngOnInit() {

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
        const params = new Map<string, any>();
        params.set('taskId', this.taskId);
        params.set('actionName', 'DELEGATE');
        params.set('delegateUser', 'mahram');
        this.verifyOperation(params);
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



}
