
import { ChangeDetectorRef, Component, HostListener, Input, OnInit, } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ImportMenuList } from '../app-menu/import.menu';
import { ExportMenuList } from '../app-menu/export.menu';
import { AdminMenuList } from '../app-menu/admin.menu';
import { CashMenuList } from '../app-menu/cash.menu';

import { Location } from '@angular/common';

import { BudgetMenuList } from '../app-menu/budget.menu';
import { AuthService } from '../../module/admin/login/service/auth.service';
import { UserRegistrationDTO } from '../../module/admin/service/admin.domain';


@Component({
    selector: 'app-topbar',
    styleUrl: 'app.topbar.css',
    templateUrl: './app.topbar.html',

})

export class AppTopbarComponent implements OnInit {
    menuItem: any[]
    userInfo: any
    visibleChangePasswordForm: boolean = false
    isUserSessionTimeout: boolean = false
    visibleSwitchBranchForm: boolean = false
    visibleLogOutDialog: boolean = false
    moduleRouteLinkName: string;
    isShowRihgtMenu: boolean = false
    userName: string | null;
    subscription: Subscription;
    isLoggedIn: boolean = false;
    isHshowLoginPage: string = 'null';
    sidebarVisible: boolean = false;
    moduleName: string
    adminMenu: MenuItem[];
    cashMenu: MenuItem[];
    timedOut = false;
    userLoginData: any;
    idleState: string = 'Not Started'
    sessionOutTime: number = 1000 // second;

    @Input('module') module: string;
    @Input('isHomePage') isHomePage: boolean;

    constructor(
        private router: Router,
        private location: Location,
        private route: ActivatedRoute,
        private cd: ChangeDetectorRef,
        private authService: AuthService
    ) {

    }

    ngOnInit() {
        this.userInfo = this.authService.getUser()

        if (this.module == 'ababil-admin') {
            this.menuItem = AdminMenuList
            this.moduleName = 'Ababil Admin'
            this.moduleRouteLinkName = 'admin'
        } else if (this.module == 'ababil-cash') {
            this.menuItem = CashMenuList
            this.moduleName = 'Ababil Cash'
            this.moduleRouteLinkName = 'cash'
        } else if (this.module == 'ababil-tf-import') {
            this.menuItem = ImportMenuList
            this.moduleName = 'Ababil TF Import'
            this.moduleRouteLinkName = 'import'
        } else if (this.module == 'ababil-tf-export') {
            this.menuItem = ExportMenuList
            this.moduleName = 'Ababil TF Export'
            this.moduleRouteLinkName = 'export'
        } else if (this.module == 'personal-budget') {
            this.menuItem = BudgetMenuList
            this.moduleName = 'Personal Budget'
            this.moduleRouteLinkName = 'personal-budget'
        } else {
            this.menuItem = []
        }

        //this.adminMenu = this.moduleName == 'admin' ? AdminMenu : GeneralLedgerMenu
        this.isHshowLoginPage = this.authService.isLoggedIn() ? 'login' : 'logout';


    }


    logOut() {
        this.isUserSessionTimeout = false
        this.visibleLogOutDialog = false
        this.authService.logoutByUser('USER_LOGOUT')
    }


    getUserInfo() {
        if (typeof window !== 'undefined') {
            const user = this.authService.getUser();
            this.userInfo = user ? user : new UserRegistrationDTO();
        }
    }
    onModuleNameClick() {
        this.sidebarVisible = false;
        this.router.navigate([this.moduleRouteLinkName]);
    }

    onRightMenuClink(event: any) {

        //  this.commonServicce.navigate(this.moduleRouteLinkName + '/' + event.routerLink, event.routerName)

    }

    onPasswordChangeClick(event: any) {
        this.visibleChangePasswordForm = event
    }
    onSwitchBranchClick(event: any) {
        this.visibleSwitchBranchForm = event
    }


    changePassword() {

    }

    switchBranch() {

    }
    onLogoClick() {
        this.router.navigate(['home']);
    }

    onMenuListItemClick(event: any) {
        this.sidebarVisible = event
    }

    onLogin(event: any) {
        setTimeout(() => {
            this.getUserInfo();
            this.isLoggedIn = true
            //   this.setStates();
            this.router.navigate(['/home']);
        }, 1000)
    }
    showRightMenu() {
        this.isShowRihgtMenu = true
        document.getElementById('op')
    }

    sessionTimeoutLogout() {
        this.isUserSessionTimeout = false
        this.visibleLogOutDialog = false
        window.location.reload()

    }

}

