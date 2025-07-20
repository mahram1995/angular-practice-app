import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
import { UserRegistrationComponent } from './admin/user-registration/create.user.form';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';





@NgModule({
  declarations: [
    AppComponent,
    DynamicFormComponent,
    FloatingLabelDynamicFormComponent,
    AppHeaderComponent,
    AppHomePageComponent,
    LoginFormComponent,
    UserRegistrationComponent
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


  ],
  providers: [DynamicFormService,
    NotificationService,
    HttpService,
    LoaderOverlayService,
    LoginService,
    AuthService,
    BaseService,
    provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
