import { Injectable } from "@angular/core"
import { MessageService } from "primeng/api";

@Injectable()
export class NotificationService {
    constructor(private messageService: MessageService,) {

    }

    sendSuccess(message: any) {

        this.messageService.add({ severity: 'success', summary: 'Success !!', detail: message, styleClass: 'toast-success-style', icon: 'abc', sticky: true });
    }

    sendInfo(message: any) {

        this.messageService.add({ severity: 'info', summary: 'Info !!', detail: message, styleClass: 'toast-info-style', icon: 'abc', sticky: true });
    }

    sendWarn(message: any) {

        this.messageService.add({ severity: 'warn', summary: 'Warn !!', detail: message, styleClass: 'toast-warning-style', icon: 'abc', sticky: true });
    }

    sendError(message: any) {

        this.messageService.add({ severity: 'error', summary: 'Error !!', detail: message, styleClass: 'toast-error-style', icon: 'abc', sticky: true });
    }



}