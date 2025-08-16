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

import { LoginService } from './login-logout/service/login.service';
import { AuthService } from './login-logout/service/auth.service';
import { AppHeaderComponent } from './login-logout/header-page/header.page';
import { AppHomePageComponent } from './login-logout/home-page/home.page';
import { LoginFormComponent } from './login-logout/login-form/login.form';
import { DynamicFormComponent } from './dynamic-form/form/dynamic-form';
import { FloatingLabelDynamicFormComponent } from './dynamic-form/floating-lable-form/floating-label-dynamic-form';
import { UserRegistrationComponent } from './admin/user-registration/form/create-user.form.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonService } from './app-configuration/app.service/common.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AdminService } from './admin/service/admin.service';
import { ErrorInterceptor } from './app-configuration/app.service/http.error.hndller.service';
import { APPROVAL_FLOW_SERVICE } from './admin/approval-flow/service/approval-flow.token';
import { ApprovalflowService } from './admin/approval-flow/service/approval-flow-service';
import { BaseComponent } from './admin/base-component/base.component';
import { FormBaseComponent } from './admin/base-component/form.base.component';
import { TableModule } from 'primeng/table'; // <-- Import here
import { ApprovalFlowTaskComponent } from './admin/approval-flow/form/my-task/my-task.componemt';
import { UserRegistrationViewComponent } from './admin/user-registration/view/create-user.view.component';
import { ApprovalFlowViewButtonComponent } from './admin/approval-flow/form/approvalflow-task-button/approvalflow-task-button';
import { PendingTaskComponent } from './admin/approval-flow/form/pending-task/pending-task.componemt';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UserListComponent } from './admin/user-registration/list/user-list.componemt';
import { MenuModule } from 'primeng/menu';
import { SafeUrlPipe } from './app-configuration/app-security/safe-url.pipe';





@NgModule({
  declarations: [
    AppComponent,
    DynamicFormComponent,
    FloatingLabelDynamicFormComponent,
    AppHeaderComponent,
    AppHomePageComponent,
    LoginFormComponent,
    UserRegistrationComponent,
    ApprovalFlowTaskComponent,
    UserRegistrationViewComponent,
    ApprovalFlowViewButtonComponent,
    PendingTaskComponent,
    UserListComponent,
    SafeUrlPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    HttpClientModule,
    MatCardModule,
    BrowserAnimationsModule,
    ToastModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    MenuModule



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
  bootstrap: [AppComponent]
})
export class AppModule { }
