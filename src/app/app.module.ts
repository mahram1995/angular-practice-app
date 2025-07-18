import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynamicFormComponent } from './dynamic-form/form/dynamic-form';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FloatingLabelDynamicFormComponent } from './dynamic-form/floating-lable-form/floating-label-dynamic-form';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DynamicFormService } from './dynamic-form/service/dynamic.form.service';
import { NotificationService } from './app.service/notification.service';
import { HttpService } from './app.service/http.service';
import { LoaderOverlayService } from './app.service/loader.overlay.service';
import { BaseService } from './app.service/base-service';




@NgModule({
  declarations: [
    AppComponent,
    DynamicFormComponent,
    FloatingLabelDynamicFormComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    DropdownModule,
    HttpClientModule


  ],
  providers: [DynamicFormService, NotificationService, HttpService, LoaderOverlayService, BaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
