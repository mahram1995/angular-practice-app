import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { DynamicFormService } from './dynamic-form/service/dynamic.form.service';
import { NotificationService } from './app.service/notification.service';
import { HttpService } from './app.service/http.service';
import { LoaderOverlayService } from './app.service/loader.overlay.service';
import { BaseService } from './app.service/base-service';

import { LoginService } from './login-logout/service/login.service';
import { AuthService } from './login-logout/service/auth.service';
import { AppHeaderComponent } from './login-logout/header-page/header.page';
import { AppHomePageComponent } from './login-logout/home-page/home.page';
import { LoginFormComponent } from './login-logout/login-form/login.form';
import { DynamicFormComponent } from './dynamic-form/form/dynamic-form';
import { FloatingLabelDynamicFormComponent } from './dynamic-form/floating-lable-form/floating-label-dynamic-form';
import { UserRegistrationComponent } from './admin/user-registration/create-user.form.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonService } from './app.service/common.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AdminService } from './admin/service/admin.service';
import { ErrorInterceptor } from './app.service/http.error.hndller.service';
import { SafeUrlPipe } from './security/safe-url.pipe';
import { APPROVAL_FLOW_SERVICE } from './admin/approval-flow/service/approval-flow.token';
import { ApprovalflowService } from './admin/approval-flow/service/approval-flow-service';
import { BaseComponent } from './admin/base-component/base.component';
import { FormBaseComponent } from './admin/base-component/form.base.component';
import { TableModule } from 'primeng/table'; // <-- Import here
import { ApprovalFlowTaskComponent } from './admin/approval-flow/form/my-task/my-task.componemt';





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
    TableModule


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
