import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './module/admin/login/login-form/login.form';
import { AppHomePageComponent } from './app-configuration/app-component/home-page/home.page';
import { AuthGuard } from './module/admin/login/service/auth.guard';
import { LoginGuard } from './module/admin/login/service/login.guard';
import { AdminHomeComponent } from './module/admin/admin.component';
import { FloatingLabelDynamicFormComponent } from './dynamic-form/floating-lable-form/floating-label-dynamic-form';

const routes: Routes = [
  { path: 'login', component: LoginFormComponent, canActivate: [LoginGuard] },

  { path: 'home', component: AppHomePageComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../app/module/admin/admin.module').then(m => m.AdminModule)
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
