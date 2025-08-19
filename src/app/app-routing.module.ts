import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicFormComponent } from './dynamic-form/form/dynamic-form';
import { AppComponent } from './app.component';
import { FloatingLabelDynamicFormComponent } from './dynamic-form/floating-lable-form/floating-label-dynamic-form';
import { LoginFormComponent } from './module/admin/login/login-form/login.form';
import { AppHomePageComponent } from './app-configuration/app-component/home-page/home.page';
import { AuthGuard } from './module/admin/login/service/auth.guard';
import { UserRegistrationComponent } from './module/admin/user/form/create-user.form.component';
import { ApprovalFlowTaskComponent } from './admin/approval-flow/form/my-task/my-task.componemt';
import { UserRegistrationViewComponent } from './module/admin/user/view/create-user.view.component';
import { PendingTaskComponent } from './admin/approval-flow/form/pending-task/pending-task.componemt';
import { UserListComponent } from './module/admin/user/list/user-list.componemt';
import { LoginGuard } from './module/admin/login/service/login.guard';
import { AdminHomeComponent } from './module/admin/admin.component';

const routes: Routes = [
  { path: 'login', component: LoginFormComponent, canActivate: [LoginGuard] },

  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: AppHomePageComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    component: AdminHomeComponent,
    data: { title: 'Ababil Admin', routeName: 'ababil-admin' },
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
