import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }
    // this interceptor autometicaly logout the token is expire is track in service.
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Token expired or unauthorized
                    this.logoutUser(); // Log out from frontend
                }
                return throwError(() => error);
            })
        );
    }

    logoutUser() {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        const username = user?.username;

        sessionStorage.removeItem('user'); // Remove token/session

        if (username) {
            // 🔥 Call Spring Boot logout endpoint
            fetch(`/admin/auth/logout?username=${username}`, { method: 'POST' });
        }

        this.router.navigate(['/login']); // Redirect to login
    }
}
