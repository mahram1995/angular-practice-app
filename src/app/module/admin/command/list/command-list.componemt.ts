import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Command } from '../service/comand.domain';
import { CommandService } from '../service/comand.service';
import { NotificationService } from '../../../../app-configuration/app.service/notification.service';

@Component({
    selector: 'approval-flow-task',
    templateUrl: './command-list.component.html',
})
export class CommandListComponent implements OnInit {
    data: Command[];
    urlSearchMap: Map<string, any> = new Map();
    totalRecords: number = 0;
    searchForm: FormGroup;
    totalPages: number;
    rowPerPage: number = 15
    pageNumber: number = 0;
    cols: any[] = []
    isVisibleSearchDialog: boolean = false

    @ViewChild('dataTable') dt: Table | undefined;

    constructor(
        private location: Location,
        private router: Router,
        private notificationService: NotificationService,
        private commandService: CommandService,
        private formBuilder: FormBuilder,

    ) {

    }

    ngOnInit() {
        this.fetchCommands(null)
        this.prepareSearchForm()

    }

    prepareSearchForm() {
        this.searchForm = this.formBuilder.group({
            commandName: [''],
            moduleName: ['']
        });
    }


    fetchCommands(searchParam: any) {
        this.commandService.getCommands(searchParam).subscribe(data => {
            this.data = data.content
            this.totalRecords = data.totalElements;
            this.totalPages = data.totalPages;
        })
    }

    saveData() {
        console.log(this.data);

        this.commandService.updateCommand(this.data, this.urlSearchMap).subscribe(data => {
            this.notificationService.sendSuccess(data.message)
        });
    }

    search(searchMap: Map<string, any>) {
        this.dt?.reset();
        this.urlSearchMap.set('page', 0);
        if (searchMap != null) { this.urlSearchMap = searchMap; }
        for (const control in this.searchForm.controls) {
            this.urlSearchMap.delete(control);
            const formControlValue = (this.searchForm.get(control).value).toString().trim();
            if (formControlValue.length !== 0) {
                this.urlSearchMap.set(control, formControlValue);
            }
        }
        this.fetchCommands(this.urlSearchMap)
        this.prepareSearchForm()
    }
    onRowsChange(event: any) {
        this.rowPerPage = event.rows;
        this.fetchCommands(null)
    }

    onPageChange(event: any) {
        this.pageNumber = event.first / event.rows;
        const pageSize = event.rows;
    }

    onRowEditSave(event: any) {
        const updatedRow = event.data;  // <-- this is the modified object
        console.log('Row saved:', updatedRow);


    }

    back() { this.location.back() }

    refresh() {
        this.dt?.reset();
        this.setAsPage()
    }
    setAsPage() {
        this.urlSearchMap = new Map();
        this.urlSearchMap.set('asPage', true);
        this.urlSearchMap.set('size', this.rowPerPage);
        this.urlSearchMap.set('page', this.pageNumber);
        this.fetchCommands(this.urlSearchMap);
    }

    onLazyLoad(event: TableLazyLoadEvent) {
        this.rowPerPage = event.rows ?? this.rowPerPage;
        this.pageNumber = event.first / this.rowPerPage;

        if (this.urlSearchMap == null) {
            this.urlSearchMap = new Map();
        }
        this.urlSearchMap.set('asPage', true);
        this.urlSearchMap.set('page', this.pageNumber);  // 0-based index
        this.urlSearchMap.set('size', this.rowPerPage);

        this.commandService.getCommands(this.urlSearchMap).subscribe(data => {
            this.data = data.content;
            this.totalRecords = data.totalElements;   // use backend's totalElements
            this.totalPages = data.totalPages;
        });
    }


}
