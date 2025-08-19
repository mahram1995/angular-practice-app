import { NgModule } from '@angular/core';
import { AdminHomeComponent } from './admin.component';
import { AppShareModule } from '../../app-configuration/app-component/app-share-module/app-share-module';

@NgModule({
    imports: [
        AppShareModule

    ],

    declarations: [
        AdminHomeComponent,


    ],
    providers: [

    ],

})
export class AdminModule { }