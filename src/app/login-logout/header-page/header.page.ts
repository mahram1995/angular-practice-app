import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './header.page.html',

})
export class AppHeaderComponent implements OnInit {
    title = 'angular-practice-app';
    // isLogin: boolean

    constructor(private authServiec: AuthService) {

    }
    ngOnInit(): void {
        // this.isLogin = this.authServiec.isLogin()


    }

}
