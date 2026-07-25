import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../../../app-routing.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TableModule } from "primeng/table";
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MatCardModule } from '@angular/material/card';
import { AppTopbarComponent } from '../../app-topbar/app.topbar';
import { TaskProcessingDialogComponent } from '../loader/task.processing.dialog';
import { AppRightMenuComponent } from '../../app-right-menu/app.right.menu';
import { PanelMenuComponent } from '../../app-panel-manu/app.panel.menu';
import { PasswordChangeComponent } from '../password-change/password.change.component';
import { BranchSwitchComponent } from '../branch-switch/branch.change.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { RouterModule } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { SafeUrlPipe } from '../../app-security/safe-url.pipe';
import { ApprovalFlowTaskComponent } from '../../../admin/approval-flow/form/my-task/my-task.componemt';
import { ApprovalFlowViewButtonComponent } from '../../../admin/approval-flow/form/approvalflow-task-button/approvalflow-task-button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';



@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        PanelMenuModule,
        MenuModule,
        SidebarModule,
        OverlayPanelModule,
        DialogModule,
        DropdownModule,
        TableModule,
        MatCardModule,
        TreeModule,
        NgxSpinnerModule,
        CalendarModule


    ],

    declarations: [
        AppTopbarComponent,
        TaskProcessingDialogComponent,
        AppRightMenuComponent,
        PanelMenuComponent,
        PasswordChangeComponent,
        BranchSwitchComponent,
        AppRightMenuComponent,
        SafeUrlPipe,
        ApprovalFlowViewButtonComponent



    ],
    exports: [
        AppTopbarComponent,
        RouterModule,
        TaskProcessingDialogComponent,
        SafeUrlPipe,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        ButtonModule,
        PanelMenuModule,
        MenuModule,
        SidebarModule,
        OverlayPanelModule,
        DialogModule,
        DropdownModule,
        CommonModule,
        TreeModule,
        MatCardModule,
        TableModule,
        CalendarModule,
        ApprovalFlowViewButtonComponent,
        InputIconModule,
        IconFieldModule
    ],

    providers: [

    ]
})
export class AppShareModule { }