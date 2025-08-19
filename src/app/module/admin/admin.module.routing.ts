import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { AdminHomeComponent } from './admin.component';




export const routes: Routes = [
  {
    path: 'admin',
    component: AdminHomeComponent,
    children: [
      { path: '', component: AdminHomeComponent },

    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]

})

export class AdminRoutesModule { }

