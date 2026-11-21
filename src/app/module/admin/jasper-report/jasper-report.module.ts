import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AppShareModule } from '../../../app-configuration/app-component/app-share-module/app-share-module';
import { CommandService } from '../command/service/comand.service';
import { UDFService } from '../udf/service/udf.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { JasperReportRouteModule } from './jasper-report.routes.module';
import { JasperReportService } from './service/JasperReportService';
import { JasperReportListComponent } from './report-list/jasper-report-list.componemt';
import { JasperReportLogComponent } from './jasper-report-log/jasper-report-log.componemt';
import { DataSourceListComponent } from './data-source/data-source-list.componemt';
import { QRCodeVerificationComponent } from './qrcode-verification/qrcode-verification.component';
import { ScheduleConfigurationComponent } from './schedule-configuration/schedule-configuration.componemt';
import { JasperReportScheduleLogComponent } from './schedule-log/report-schedule-log.componemt';


@NgModule({
    imports: [
    AppShareModule,
    CommonModule,
    JasperReportRouteModule,
    ProgressSpinnerModule,
    MultiSelectModule,
    ContextMenuModule
],

    declarations: [
        JasperReportListComponent,
        JasperReportLogComponent,
        DataSourceListComponent,
        QRCodeVerificationComponent,
        ScheduleConfigurationComponent,
        JasperReportScheduleLogComponent
        

    ],

    providers: [
      JasperReportService      
        
    ],

})
export class JasperReportModule { }