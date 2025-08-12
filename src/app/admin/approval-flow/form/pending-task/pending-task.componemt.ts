import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApprovalflowService } from '../../service/approval-flow-service';
import { ApprovalFlowTask } from '../../service/task.domain';
import { FormBaseComponent } from '../../../base-component/form.base.component';

@Component({
    selector: 'approval-flow-task',
    templateUrl: './pending-task.component.html',
})
export class PendingTaskComponent extends FormBaseComponent implements OnInit {

    aprovalFlowTask: ApprovalFlowTask[];
    selectedNode: ApprovalFlowTask;
    urlSearchMap: Map<string, any> = new Map();
    cols: any[] = []

    constructor(
        private approvalFlowService: ApprovalflowService,
        protected override router: Router,
        protected override location: Location,

    ) {
        super(location);
    }

    ngOnInit() {
        this.fetchTask()

    }

    fetchTask() {
        this.urlSearchMap = new Map();
        this.urlSearchMap.set('module', 'ababil-admin');
        this.urlSearchMap.set('status', 'CORRECTION');
        this.urlSearchMap.set('maker', this.getUserInfo()?.userName);
        this.approvalFlowService.fetchApprovalflowTasks(this.urlSearchMap).subscribe(data => {
            this.aprovalFlowTask = data.content
        })
    }

    search() { }
    accept() { }
    reject() { }
    correction() { }
    back() { this.location.back() }
    refresh() { this.fetchTask() }

    taskDetails(data: ApprovalFlowTask) {
        this.taskId = data.taskId
        // this.router.navigate([data.taskDetailsUi, data.taskId]);
        this.router.navigate([data.taskCorrectionUi], {
            queryParams: {
                commandName: data.commandName,
                taskId: data.taskId
            }
        }).then(() => {
            window.history.replaceState({}, '', data.taskCorrectionUi + '?taskId=' + data.taskId); // Removes params from URL
        });
    }

    onRowSelect(event: any) {
        console.log(event);


    }

}
