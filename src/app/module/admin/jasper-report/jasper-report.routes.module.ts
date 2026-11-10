import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { CommandService } from '../command/service/comand.service';
import { AuthGuard } from '../login/service/auth.guard';
import { JasperReportLogComponent } from './jasper-report-log/jasper-report-log.componemt';
import { JasperReportListComponent } from './report-list/jasper-report-list.componemt';






export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            { path: 'report-list', component: JasperReportListComponent },
             { path: 'report-log', component: JasperReportLogComponent },
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

