import { NgModule } from '@angular/core';
import { AdminHomeComponent } from './admin.component';
import { AppShareModule } from '../../app-configuration/app-component/app-share-module/app-share-module';
import { CommonModule } from '@angular/common';
import { AdminRoutesModule } from './admin.routes.module';
import { AdminHomePageComponent } from './admin-home-page/admin.home.page';
import { UserRegistrationComponent } from './user/form/create-user.form.component';
import { ApprovalFlowTaskComponent } from '../../admin/approval-flow/form/my-task/my-task.componemt';
import { UserRegistrationViewComponent } from './user/view/create-user.view.component';
import { ApprovalFlowViewButtonComponent } from '../../admin/approval-flow/form/approvalflow-task-button/approvalflow-task-button';
import { PendingTaskComponent } from '../../admin/approval-flow/form/pending-task/pending-task.componemt';
import { UserListComponent } from './user/list/user-list.componemt';
import { PanelMenuControlledDemo } from './panel-menu-demo/panel.menu.demo';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CommandListComponent } from './command/list/command-list.componemt';
import { RouterStateSnapshot } from '@angular/router';
import { CreateUdfFormComponent } from './udf/form/create-udf-form';
import { UdfListComponent } from './udf/list/udf-list.componemt';

@NgModule({
    imports: [
        AppShareModule,
        CommonModule,
        AdminRoutesModule,
        PanelMenuModule

    ],

    declarations: [
        AdminHomeComponent,
        AdminHomePageComponent,
        UserRegistrationComponent,
        ApprovalFlowTaskComponent,
        UserRegistrationViewComponent,
        ApprovalFlowViewButtonComponent,
        PendingTaskComponent,
        UserListComponent,
        PanelMenuControlledDemo,
        CommandListComponent,
        CreateUdfFormComponent,
        UdfListComponent


    ],

    providers: [

    ],

})
export class AdminModule { }