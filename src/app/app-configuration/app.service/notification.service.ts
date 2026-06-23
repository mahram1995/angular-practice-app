import { Injectable } from "@angular/core"
import { MessageService } from "primeng/api";

@Injectable()
export class NotificationService {
    isAfRespose: boolean
    taskId: string
    constructor(private messageService: MessageService) {
        this.isAfRespose = false;
    }

    sendSuccess(msgKey: any, additional?: any) {
        let message: any = '';


        message = msgKey;

        // Handle different data types
        if (typeof message === 'string') {

            // Normal string
            this.messageService.add({
                severity: 'success',
                summary: 'Success !!',
                detail: message,
                styleClass: 'toast-success-style',
                icon: 'abc',
                sticky: true
            });

        } else if (Array.isArray(message)) {

            // String array
            const detail = this.isAfRespose
                ? `${message[1]} Task ID: ${this.taskId}`
                : message[0];

            this.messageService.add({
                severity: 'success',
                summary: 'Success !!',
                detail: this.transform(detail),
                styleClass: 'toast-success-style',
                icon: 'abc',
                sticky: true
            });

        } else if (message && typeof message === 'object') {

            // Object response
            const detail =
                message.message ||
                message.body?.message ||
                message.content?.message ||
                JSON.stringify(message);

            this.messageService.add({
                severity: 'success',
                summary: 'Success !!',
                detail: this.transform(detail),
                styleClass: 'toast-success-style',
                icon: 'abc',
                sticky: true
            });
        }
    }

    sendInfo(message: any) {

        this.messageService.add({ severity: 'info', summary: 'Info !!', detail: this.transform(message), styleClass: 'toast-info-style', icon: 'abc', sticky: true });
    }

    sendWarn(message: any) {

        this.messageService.add({ severity: 'warn', summary: 'Warn !!', detail: this.transform(message), styleClass: 'toast-warning-style', icon: 'abc', sticky: true });
    }

    sendError(message: any) {

        this.messageService.add({ severity: 'error', summary: 'Error !!', detail: this.transform(message), styleClass: 'toast-error-style', icon: 'abc', sticky: true });
    }

    transform(value: string | null | undefined, max = 40): string {
        if (!value) return '';
        let values = value.replace(/%35/g, '&');

        const words = values.split(' ');

        const lines: string[] = [];
        let line = '';

        for (const word of words) {
            // If adding this word would exceed the max length
            if ((line + ' ' + word).trim().length > max) {
                if (line) {
                    lines.push(line); // push current line
                    line = '';
                }

                // If word itself is longer than max, break it into chunks
                if (word.length > max) {
                    for (let i = 0; i < word.length; i += max) {
                        lines.push(word.substring(i, i + max));
                    }
                } else {
                    line = word;
                }
            } else {
                line = line ? line + ' ' + word : word;
            }
        }

        if (line) lines.push(line);

        return lines.join('\n');
    }



}