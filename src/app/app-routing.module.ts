import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './module/admin/login/login-form/login.form';
import { AppHomePageComponent } from './app-configuration/app-component/home-page/home.page';
import { AuthGuard } from './module/admin/login/service/auth.guard';
import { LoginGuard } from './module/admin/login/service/login.guard';
import { AdminHomeComponent } from './module/admin/admin.component';

const routes: Routes = [
  { path: 'login', component: LoginFormComponent, canActivate: [LoginGuard] },

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
