import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../module/admin/login/service/auth.service';
import { UserRegistrationDTO } from '../../module/admin/service/admin.domain';




@Component({
    selector: 'app-right-mune',
    templateUrl: './app.right.menu.html',
    styleUrl: 'app.right.menu.css',

})
export class AppRightMenuComponent implements OnInit {

    userName: string | null;
    userInfo: any;
    @Output('onRightMenuClink') onRightMenuClink = new EventEmitter<any>();
    @Output('onPasswordChangeClick') onPasswordChangeClick = new EventEmitter<any>();
    @Output('onBranchSwitchClick') onBranchSwitchClick = new EventEmitter<any>();

    constructor(
        private authService: AuthService,
        private router: Router) {
    }

    ngOnInit(): void {
        if (typeof window !== 'undefined' && localStorage.getItem('token') != null) {
            this.userName = sessionStorage.getItem('userName')
            this.getUserInfo()
        }
    }

    getUserInfo() {
        if (typeof window !== 'undefined') {
            const user = this.authService.getUser()
            this.userInfo = user !== null ? user : new UserRegistrationDTO();
        }
    }
    logOut() {
        this.authService.logoutByUser("USER_LOGOUT")
    }
    showPasswordChangeForm() {
        this.onPasswordChangeClick.emit(true)
    }
    onBranchSwitch() {
        this.onBranchSwitchClick.emit(true)
    }

    onRightMenuClick(routerLink: any, routerName: any) {
        this.onRightMenuClink.emit(
            {
                routerLink: routerLink,
                routerName: routerName
            }
        )
    }
}
