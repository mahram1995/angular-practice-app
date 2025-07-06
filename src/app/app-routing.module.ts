import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicFormComponent } from './dynamic-form/form/dynamic-form';
import { AppComponent } from './app.component';
import { FloatingLabelDynamicFormComponent } from './dynamic-form/floating-lable-form/floating-label-dynamic-form';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'dynamic-form', component: DynamicFormComponent, title: 'dynamic form component' }
  ,
  { path: 'floating-label-dynamic-form', component: FloatingLabelDynamicFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
