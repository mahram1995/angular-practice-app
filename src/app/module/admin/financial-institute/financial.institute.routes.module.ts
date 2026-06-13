import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { UDFService } from '../udf/service/udf.service';
import { CommandService } from '../command/service/comand.service';
import { FinancialInstituteListComponent } from './list/bank-list/financial-institute-list.component';
import { AuthGuard } from '../login/service/auth.guard';
import { FinancialInstituteFormComponent } from './from/bank/bank.form.component';






export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            { path: 'list', component: FinancialInstituteListComponent },
            { path: 'create-financial-institute', component: FinancialInstituteFormComponent },

            { path: '', redirectTo: "list", pathMatch: 'full' },
        ]
    },

    //{ path: '', redirectTo: 'admin', pathMatch: 'full' }, // admin/

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [CommandService, AuthGuard]

})

export class FinancialInstituteRouteModule { }

