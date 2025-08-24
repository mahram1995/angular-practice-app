import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { DynamicFormService } from './dynamic-form/service/dynamic.form.service';
import { NotificationService } from './app-configuration/app.service/notification.service';
import { HttpService } from './app-configuration/app.service/http.service';
import { LoaderOverlayService } from './app-configuration/app.service/loader.overlay.service';
import { BaseService } from './app-configuration/app.service/base-service';

import { LoginService } from './module/admin/login/service/login.service';
import { AuthService } from './module/admin/login/service/auth.service';
import { AppHomePageComponent } from './app-configuration/app-component/home-page/home.page';
import { LoginFormComponent } from './module/admin/login/login-form/login.form';
import { DynamicFormComponent } from './dynamic-form/form/dynamic-form';
import { FloatingLabelDynamicFormComponent } from './dynamic-form/floating-lable-form/floating-label-dynamic-form';
import { UserRegistrationComponent } from './module/admin/user/form/create-user.form.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonService } from './app-configuration/app.service/common.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AdminService } from './module/admin/service/admin.service';
import { ErrorInterceptor } from './app-configuration/app.service/http.error.hndller.service';
import { APPROVAL_FLOW_SERVICE } from './admin/approval-flow/service/approval-flow.token';
import { ApprovalflowService } from './admin/approval-flow/service/approval-flow-service';
import { TableModule } from 'primeng/table'; // <-- Import here
import { ApprovalFlowTaskComponent } from './admin/approval-flow/form/my-task/my-task.componemt';
import { UserRegistrationViewComponent } from './module/admin/user/view/create-user.view.component';
import { ApprovalFlowViewButtonComponent } from './admin/approval-flow/form/approvalflow-task-button/approvalflow-task-button';
import { PendingTaskComponent } from './admin/approval-flow/form/pending-task/pending-task.componemt';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UserListComponent } from './module/admin/user/list/user-list.componemt';
import { MenuModule } from 'primeng/menu';
import { SafeUrlPipe } from './app-configuration/app-security/safe-url.pipe';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SidebarModule } from 'primeng/sidebar';
import { AppHeaderComponent } from './app-configuration/header-page/header.page';
import { AdminModule } from './module/admin/admin.module';
import { AppShareModule } from './app-configuration/app-component/app-share-module/app-share-module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';





@NgModule({
  declarations: [
    AppComponent,
    DynamicFormComponent,
    FloatingLabelDynamicFormComponent,
    AppHomePageComponent,
    LoginFormComponent,
    SafeUrlPipe,
    AppHeaderComponent,


  ],
  imports: [
    AppShareModule,
    AppRoutingModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    HttpClientModule,
    MatCardModule,
    ToastModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    MenuModule,
    OverlayPanelModule,
    SidebarModule





  ],
  providers: [DynamicFormService,
    NotificationService,
    HttpService,
    LoaderOverlayService,
    LoginService,
    AuthService,
    CommonService,
    BaseService,
    MessageService,
    NotificationService,
    ApprovalflowService,

    AdminService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: APPROVAL_FLOW_SERVICE,
      useClass: ApprovalflowService
    },
    provideAnimationsAsync()],
  exports: [RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
