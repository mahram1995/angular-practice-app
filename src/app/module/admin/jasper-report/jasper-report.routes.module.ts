import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { CommandService } from '../command/service/comand.service';
import { AuthGuard } from '../login/service/auth.guard';
import { JasperReportLogComponent } from './jasper-report-log/jasper-report-log.componemt';
import { JasperReportListComponent } from './report-list/jasper-report-list.componemt';
import { DataSourceListComponent } from './data-source/data-source-list.componemt';
import { QRCodeVerificationComponent } from './qrcode-verification/qrcode-verification.component';
import { ScheduleConfigurationComponent } from './schedule-configuration/schedule-configuration.componemt';
import { JasperReportScheduleLogComponent } from './schedule-log/report-schedule-log.componemt';






export const routes: Routes = [
    {
        path: '',
         canActivate: [AuthGuard],
        children: [
            { path: 'report-list', component: JasperReportListComponent, canActivate: [AuthGuard] },
            { path: 'data-source', component: DataSourceListComponent, canActivate: [AuthGuard] },
            { path: 'report-log', component: JasperReportLogComponent, canActivate: [AuthGuard] },
            { path: 'qrcode-configuration', component: JasperReportListComponent, canActivate: [AuthGuard] },
            { path: 'schedule-configuration', component: ScheduleConfigurationComponent, canActivate: [AuthGuard] },
            { path: 'schedule-log', component: JasperReportScheduleLogComponent, canActivate: [AuthGuard] },
            { path: 'qr-code-verification', component: QRCodeVerificationComponent, canActivate: [AuthGuard] },
            { path: '', redirectTo: "list", pathMatch: 'full' },
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [CommandService, AuthGuard]

})

export class JasperReportRouteModule { }

