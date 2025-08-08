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

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private messageService: NotificationService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                // Global error handling logic here
                let errorMsg = 'An unexpected error occurred';

                if (error.error instanceof ErrorEvent) {
                    // Client-side error
                    errorMsg = `Client Error: ${error.error.message}`;
                } else {
                    // Server-side error
                    switch (error.status) {
                        case 0:
                            errorMsg = 'Server not reachable.\n' + error.url;
                            break;
                        case 400:
                            errorMsg = error.error.message || 'Bad Request';
                            break;
                        case 401:
                            errorMsg = 'Unauthorized. Please login again.';
                            this.router.navigate(['/login']);
                            break;
                        case 403:
                            errorMsg = 'Forbidden.';
                            break;
                        case 404:
                            errorMsg = 'Resource not found.';
                            break;
                        case 500:
                            errorMsg = 'An unexpected server error occurred. Please try again later.';
                            if (error.error?.error) {
                                errorMsg += ` Details: ${error.error.error}`;
                            }
                            break
                    }
                }

                // Optional: show toast message
                this.messageService.sendError(errorMsg)

                return throwError(() => error);

            })
        );
    }


}
