import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicFormComponent } from './dynamic-form/form/dynamic-form';
import { AppComponent } from './app.component';
import { FloatingLabelDynamicFormComponent } from './dynamic-form/floating-lable-form/floating-label-dynamic-form';
import { LoginFormComponent } from './login-logout/login-form/login.form';
import { AppHomePageComponent } from './login-logout/home-page/home.page';
import { AuthGuard } from './login-logout/service/auth.guard';

const routes: Routes = [

  { path: 'login', component: LoginFormComponent },
  //{ path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    component: AppHomePageComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dynamic-form', component: DynamicFormComponent },
      { path: 'floating-label-dynamic-form', component: FloatingLabelDynamicFormComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
