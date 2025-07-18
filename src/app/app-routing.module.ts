import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicFormComponent } from './dynamic-form/form/dynamic-form';
import { AppComponent } from './app.component';
import { FloatingLabelDynamicFormComponent } from './dynamic-form/floating-lable-form/floating-label-dynamic-form';
import { LoginFormComponent } from './login-logout/login-form/login.form';
import { AppHomePageComponent } from './login-logout/home-page/home.page';

const routes: Routes = [

  { path: 'login', component: LoginFormComponent },
  { path: '', component: AppComponent },
  { path: 'dynamic-form', component: DynamicFormComponent, title: 'dynamic form component' }
  ,
  { path: 'floating-label-dynamic-form', component: FloatingLabelDynamicFormComponent },
  { path: 'home', component: AppHomePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
