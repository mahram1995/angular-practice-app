import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NotificationService } from '../app.service/notification.service';


@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

    constructor(private notificationService: NotificationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap((event) => {
                if (event instanceof HttpResponse) {
                    const body = event.body.content;

                    // ✅ If backend sends a "code" field, handle it globally
                    if (body?.code) {
                        switch (body.code) {
                            case 1001:
                                this.notificationService.isAfRespose = true
                                this.notificationService.taskId = body.taskId
                                break;

                            // You can define other global codes here

                        }
                    }
                }
            })
        );
    }
}
