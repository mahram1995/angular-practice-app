import { NgModule } from '@angular/core';
import { AdminHomeComponent } from './admin.component';
import { AppShareModule } from '../../app-configuration/app-component/app-share-module/app-share-module';
import { CommonModule } from '@angular/common';
import { AdminRoutesModule } from './admin.module.routing';
import { AdminHomePageComponent } from './admin-home-page/admin.home.page';

@NgModule({
    imports: [
        AppShareModule,
        CommonModule,
        AdminRoutesModule

    ],

    declarations: [
        AdminHomeComponent,
        AdminHomePageComponent


    ],
    providers: [

    ],

})
export class AdminModule { }