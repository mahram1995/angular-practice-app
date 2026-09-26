import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AppShareModule } from '../../../app-configuration/app-component/app-share-module/app-share-module';
import { CommandService } from '../command/service/comand.service';
import { UDFService } from '../udf/service/udf.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { JasperReportRouteModule } from './jasper-report.routes.module';
import { JasperReportListComponent } from './report-list/jasper-report-list.componemt';
import { JasperReportService } from './service/JasperReportService';


@NgModule({
    imports: [
        AppShareModule,
        CommonModule,
        JasperReportRouteModule,
        ProgressSpinnerModule,
        MultiSelectModule,
        ContextMenuModule,
                

    ],

    declarations: [
        JasperReportListComponent,

    ],

    providers: [
      JasperReportService
      
        
    ],

})
export class JasperReportModule { }