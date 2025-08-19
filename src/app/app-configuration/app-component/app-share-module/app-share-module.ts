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


@NgModule({
    imports: [
        AppRoutingModule,
        CommonModule,
        BrowserAnimationsModule,
        BrowserModule,
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
        NgxSpinnerModule


    ],

    declarations: [
        AppTopbarComponent,
        TaskProcessingDialogComponent,
        AppRightMenuComponent,
        PanelMenuComponent,
        PasswordChangeComponent,
        BranchSwitchComponent,
        AppRightMenuComponent,



    ],
    exports: [
        AppTopbarComponent,
        TaskProcessingDialogComponent,
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
    ],

    providers: [

    ]
})
export class AppShareModule { }