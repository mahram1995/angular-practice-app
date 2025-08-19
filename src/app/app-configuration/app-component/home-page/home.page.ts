import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../module/admin/login/service/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home-page',
    templateUrl: './home.page.html',
})
export class AppHomePageComponent implements OnInit {
    title = 'Ababil';
    isLoggedIn: boolean = false
    isHomePage: boolean = false
    constructor(private authService: AuthService, private router: Router) { }
    ngOnInit(): void {
        if (this.authService.isLoggedIn()) {
            this.isLoggedIn = true
        }
    }



    onApplicationClick(data: any) {
        // this.router.navigate([data]);
        const url = this.router.serializeUrl(this.router.createUrlTree([data]));

        //window.open(url, '_blank');
        window.open(url, '_self');
    }

}
