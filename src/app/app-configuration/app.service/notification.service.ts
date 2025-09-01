import { Injectable } from "@angular/core"
import { MessageService } from "primeng/api";

@Injectable()
export class NotificationService {
    constructor(private messageService: MessageService,) {

    }

    sendSuccess(message: any) {

        this.messageService.add({ severity: 'success', summary: 'Success !!', detail: this.transform(message), styleClass: 'toast-success-style', icon: 'abc', sticky: true });
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

        const words = value.split(' ');
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