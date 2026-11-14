// src/app/interceptors/error.interceptor.ts

import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { MessageService } from 'primeng/api'; // Optional: for showing toast
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { AuthService } from '../../module/admin/login/service/auth.service';

@Injectable()
@Injectable()
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private messageService: NotificationService,
        private router: Router,
        private authService: AuthService
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {

                let errorMsg = 'An unexpected error occurred';

                console.log('HTTP Error:', error);

                if (error.error instanceof ErrorEvent) {

                    // Client-side error
                    errorMsg = `Client Error: ${error.error.message}`;

                } else {

                    // Server-side error
                    switch (error.status) {

                        case 0:
                            errorMsg = 'Server not reachable.';
                            break;

                        case 400:
                            errorMsg = this.getErrorMessage(error);
                            break;

                        case 401:
                            errorMsg = this.getErrorMessage(error);

                            this.authService.logoutByUser(null);
                            this.router.navigate(['/login']);
                            break;

                        case 403:
                            errorMsg = this.getErrorMessage(error) || 'Forbidden.';
                            break;

                        case 404:
                            errorMsg = this.getErrorMessage(error) || 'Resource not found';
                            break;

                        case 500:
                            errorMsg = this.getErrorMessage(error) ||
                                'An unexpected server error occurred.';
                            break;

                        default:
                            errorMsg = this.getErrorMessage(error);
                            break;
                    }
                }

                // Display only the actual error message
                this.messageService.sendError(errorMsg);

                return throwError(() => error);
            })
        );
    }

    /**
     * Extract error message from JSON object or JSON string.
     */
    private getErrorMessage(error: HttpErrorResponse): string {

        const errorBody = error.error;

        // Backend returns JSON object
        if (typeof errorBody === 'object' && errorBody !== null) {
            return errorBody.message || error.message ||
                'An unexpected error occurred';
        }

        // Backend returns JSON string (responseType: 'text')
        if (typeof errorBody === 'string') {

            try {
                const parsedError = JSON.parse(errorBody);

                return parsedError.message ||
                    errorBody ||
                    'An unexpected error occurred';

            } catch {
                return errorBody || error.message ||
                    'An unexpected error occurred';
            }
        }

        return error.message || 'An unexpected error occurred';
    }
}
