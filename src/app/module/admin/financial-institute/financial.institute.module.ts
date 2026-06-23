import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';
import { FormsModule } from '@angular/forms';
import { FinancialInstituteListComponent } from './list/bank-list/financial-institute-list.component';
import { AppShareModule } from '../../../app-configuration/app-component/app-share-module/app-share-module';
import { FinancialInstituteRouteModule } from './financial.institute.routes.module';
import { CommandService } from '../command/service/comand.service';
import { FinancialInstituteFormComponent } from './from/bank/bank.form.component';
import { BranchListComponent } from './list/branch-list/branch.list.component';
import { BranchFormComponent } from './from/branch/branch.form.component';
import { FinancialInstituteService } from './service/financial-institute.service';
import { BranchDetailsComponent } from './view/branch/branch-details.component';
import { BankViewComponent } from './view/bank/view.bank.component';

@NgModule({
    imports: [
        AppShareModule,
        CommonModule,
        FinancialInstituteRouteModule,


    ],

    declarations: [
        FinancialInstituteListComponent,
        FinancialInstituteFormComponent,
        BranchListComponent,
        BranchFormComponent,
        BranchDetailsComponent,
        BankViewComponent,



    ],

    providers: [
        DatePipe, CommandService, FinancialInstituteService
    ],

})
export class FinancialInstituteModule { }