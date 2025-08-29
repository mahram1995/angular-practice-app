import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if (this.authService.isLoggedIn()) {
            // Save attempted URL for redirect after login
            sessionStorage.setItem('returnUrl', state.url);
            return true;
        }
        // Save attempted URL for redirect after login
        sessionStorage.setItem('returnUrl', state.url);
        this.router.navigate(['/login']);
        return false;
    }

}
