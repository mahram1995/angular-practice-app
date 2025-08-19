import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderOverlayService } from '../../app.service/loader.overlay.service';
import { NgxSpinnerService } from "ngx-spinner";



@Component({
    selector: 'task-processing-dialog',
    templateUrl: './task.processing.dialog.html',
    styleUrl: './task-processing-dialog.css'
})
export class TaskProcessingDialogComponent {

    show: boolean = false
    subscription: Subscription;

    constructor(
        private LoaderOverlayService: LoaderOverlayService,
        private spinner: NgxSpinnerService

    ) {
        this.subscription = this.LoaderOverlayService.showModal().subscribe(data => {
            if (data) {
                this.show = data.value
                if (this.show) {
                    this.spinner.show();
                } else {
                    this.spinner.hide();
                }

            }
        });
    }

    ngOnInit() {

    }



}
