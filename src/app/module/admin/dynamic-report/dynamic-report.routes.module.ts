import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { CommandService } from '../command/service/comand.service';
import { AuthGuard } from '../login/service/auth.guard';
import { DynamicReportListComponent } from './report-list/dynamic-report-list.componemt';
import { GenerateDynamicReportUiFormComponent } from './generate-report-ui/generate-dynamic-report-ui.form';
import { QueryExecutorFormComponent } from './query-executor/query-executor.form';







export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            { path: 'list', component: DynamicReportListComponent },
            { path: 'view-report', component: GenerateDynamicReportUiFormComponent },
            { path: 'query-executor', component: QueryExecutorFormComponent },


            { path: '', redirectTo: "list", pathMatch: 'full' },
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [CommandService, AuthGuard]

})

export class DynamicReportRouteModule { }

