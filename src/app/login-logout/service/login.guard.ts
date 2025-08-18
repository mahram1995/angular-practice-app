// login.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/home']);
            return false;
        }
        return true;
    }


}
