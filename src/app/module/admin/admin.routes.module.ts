import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { AdminHomeComponent } from './admin.component';
import { UserListComponent } from './user/list/user-list.componemt';
import { UserRegistrationComponent } from './user/form/create-user.form.component';
import { ApprovalFlowTaskComponent } from '../../admin/approval-flow/form/my-task/my-task.componemt';
import { PendingTaskComponent } from '../../admin/approval-flow/form/pending-task/pending-task.componemt';
import { UserRegistrationViewComponent } from './user/view/create-user.view.component';
import { AdminHomePageComponent } from './admin-home-page/admin.home.page';
import { PanelMenuControlledDemo } from './panel-menu-demo/panel.menu.demo';
import { CommandListComponent } from './command/list/command-list.componemt';
import { CommandService } from './command/service/comand.service';
import { AuthGuard } from './login/service/auth.guard';




export const routes: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: AdminHomePageComponent },
      { path: 'user-list', component: UserListComponent, canActivate: [AuthGuard] },
      { path: 'create-user', component: UserRegistrationComponent, canActivate: [AuthGuard] },
      { path: 'my-task', component: ApprovalFlowTaskComponent, canActivate: [AuthGuard], },
      { path: 'pending-task', component: PendingTaskComponent, canActivate: [AuthGuard], },
      { path: 'user-details', component: UserRegistrationViewComponent, canActivate: [AuthGuard], },
      { path: 'demo-panel-manue', component: PanelMenuControlledDemo, canActivate: [AuthGuard], },
      { path: 'command', component: CommandListComponent, canActivate: [AuthGuard], },
    ]
  },

  //{ path: '', redirectTo: 'admin', pathMatch: 'full' }, // admin/

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CommandService]

})

export class AdminRoutesModule { }

