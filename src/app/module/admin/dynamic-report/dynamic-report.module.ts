import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';
import { FormsModule } from '@angular/forms';
import { AppShareModule } from '../../../app-configuration/app-component/app-share-module/app-share-module';
import { DynamicReportRouteModule, } from './dynamic-report.routes.module';
import { CommandService } from '../command/service/comand.service';
import { UDFService } from '../udf/service/udf.service';
import { GenerateDynamicReportUiFormComponent } from './generate-report-ui/generate-dynamic-report-ui.form';
import { DynamicReportListComponent } from './report-list/dynamic-report-list.componemt';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MultiSelectModule } from 'primeng/multiselect';
import { QueryExecutorFormComponent } from './query-executor/query-executor.form';



@NgModule({
    imports: [
        AppShareModule,
        CommonModule,
        DynamicReportRouteModule,
        ProgressSpinnerModule,
        MultiSelectModule


    ],

    declarations: [
     
    GenerateDynamicReportUiFormComponent,
    DynamicReportListComponent,
    QueryExecutorFormComponent
   
    ],

    providers: [
        DatePipe, CommandService, UDFService
    ],

})
export class DynamicReportModule { }