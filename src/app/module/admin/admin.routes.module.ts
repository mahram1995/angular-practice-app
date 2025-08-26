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




export const routes: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
    children: [
      { path: '', component: AdminHomePageComponent },
      { path: 'user-list', component: UserListComponent },
      { path: 'create-user', component: UserRegistrationComponent },
      { path: 'my-task', component: ApprovalFlowTaskComponent },
      { path: 'pending-task', component: PendingTaskComponent },
      { path: 'user-details', component: UserRegistrationViewComponent },
      { path: 'demo-panel-manue', component: PanelMenuControlledDemo },
    ]
  },

  //{ path: '', redirectTo: 'admin', pathMatch: 'full' }, // admin/

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})

export class AdminRoutesModule { }

