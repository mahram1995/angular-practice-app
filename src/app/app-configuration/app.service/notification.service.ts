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

    transform(value: string | null | undefined, max = 32): string {
        if (!value) return '';

        const words = value.split(/\s+/); // split normal text by spaces
        const lines: string[] = [];
        let line = '';

        for (const w of words) {
            if (w.length > max) {
                // word itself is longer than max → force break every max chars
                if (line) {
                    lines.push(line);
                    line = '';
                }
                for (let i = 0; i < w.length; i += max) {
                    lines.push(w.slice(i, i + max));
                }
            } else if (line.length === 0) {
                line = w;
            } else if ((line.length + 1 + w.length) <= max) {
                line += ' ' + w;
            } else {
                lines.push(line);
                line = w;
            }
        }

        if (line) lines.push(line);

        return lines.join('\n');
    }


}