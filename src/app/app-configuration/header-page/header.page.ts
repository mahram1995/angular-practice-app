import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../module/admin/login/service/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './header.page.html',

})
export class AppHeaderComponent implements OnInit {
    title = 'angular-practice-app';
    userName: string
    isLogin: boolean

    constructor(private authServiec: AuthService) {

    }
    ngOnInit(): void {

        this.authServiec.getUserObservable().subscribe(user => {
            this.userName = user.userName;
        });

    }

    logout() {
        this.authServiec.logoutByUser('USER_LOGOUT');
    }

}
