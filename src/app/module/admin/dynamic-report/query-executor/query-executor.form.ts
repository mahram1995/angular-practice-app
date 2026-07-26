import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { PathParameters } from '../../../../app-configuration/app.service/base-service';
import { CommonService } from '../../../../app-configuration/app.service/common.service';
import { FormBaseComponent } from '../../../../app-configuration/app-component/base-component/form.base.component';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../app-configuration/app.service/notification.service';
import { UDFDomain, UserDefinedField, UserDefinedFieldDomainData } from '../../udf/service/udf.domain';
import { UDFService } from '../../udf/service/udf.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
    selector: 'query-executor-form',
    templateUrl: 'query-executor.form.html'
})
export class QueryExecutorFormComponent extends FormBaseComponent {
    title = 'agular dynamic form';
    reportUrl: string;
    form: FormGroup = this.fb.group({});
    urlSearchMap: Map<string, any> = new Map();
    formValue: any;
    fieldVisibility: { [key: string]: boolean } = {};
    fields: UserDefinedField[] = [];
    domainList: { label: string; value: any }[] = [];
    reportName: any;
    isShowParaForm: boolean = true
    isShowReport: boolean = false

   
    

    cols: any[] = [];
    tableData: any[] = [];

    isExporting = false;
    isExportPDF = false;

    udfProfileData: UDFDomain; // Paste your JSON here
    profileId: number

    selectedPdfColumns: any[] = [];

    rowPerPage = 0; // Default
    fontSize = 12; // Default
    selectedCell: { row: number; field: string } | null = null;






    constructor(private fb: FormBuilder,
        protected override location: Location,
        protected override commonService: CommonService,
        private notificationService: NotificationService,
        protected override router: Router,
        private datePipe: DatePipe,
        private udfService: UDFService,
        private route: ActivatedRoute,
    ) { super(location, commonService); }

    ngOnInit() {
        this.rowPerPage = this.commonService.getRowsPerPage(27)
        this.route.queryParams.subscribe(params => {
            this.profileId = params.udfProfileId;
        });
        this.form = this.fb.group({
            queryString: [null, Validators.required]
        });

    }

    selectCell(row: number, field: string) {
        this.selectedCell = { row, field };
    }

    isSelected(row: number, field: string): boolean {
        return this.selectedCell?.row === row &&
            this.selectedCell?.field === field;
    }
    exportPDF() {
        this.isExportPDF = true;
    }


   
    showParaForm() {
        if (this.isShowParaForm) {
            this.isShowParaForm = false
        } else {
            this.isShowParaForm = true
        }
    }

    back() {
        this.router.navigate(['admin/report-list'], {

        })
    }
    refresh() {
        this.form = this.fb.group({});
        this.fields = []
    }


    downloadedData() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        let data = this.form.value.queryString;

        let result: { [key: string]: any } = {};
       


        let params = {
            sql: data,
            params: {id:"abc"}

        }
        const urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, null, null);




        this.udfService.getReportData(params, urlSearchParams).subscribe(
            (response) => {
                this.isShowParaForm = false;
                this.isShowReport = true;
                console.log(response);

                this.tableData = response;

                if (response && response.length > 0) {
                    this.cols = Object.keys(response[0]).map(key => ({
                        field: key,
                        header: key.replace(/_/g, ' ')
                    }));
                    this.selectedPdfColumns = [...this.cols];
                }
            });

    }

    exportExcel() {
        this.isExporting = true
        setTimeout(() => {

            try {
                const workbook = XLSX.utils.book_new();

                const chunkSize = 300000; // 300k rows per sheet

                for (let i = 0; i < this.tableData.length; i += chunkSize) {

                    const chunk = this.tableData.slice(i, i + chunkSize);

                    const worksheet = XLSX.utils.json_to_sheet(chunk);

                    const sheetName = `Report_${Math.floor(i / chunkSize) + 1}`;

                    XLSX.utils.book_append_sheet(
                        workbook,
                        worksheet,
                        sheetName
                    );
                }

                XLSX.writeFile(
                    workbook,
                    'Budget_Report.xlsx',
                    {
                        compression: true
                    }
                );

            } finally {
                this.isExporting = false
            }

        }, 100);



    }




    exportPdfReport() {

        this.isExporting = true
        setTimeout(() => {

            try {

                const doc = new jsPDF('l', 'mm', 'a4');


                const headers = this.selectedPdfColumns.map(
                    c => c.header
                );


                const rows = this.tableData.map(row => {

                    return this.selectedPdfColumns.map(
                        c => row[c.field]
                    );

                });


                autoTable(doc, {

                    head: [headers],

                    body: rows,

                    styles: {
                        fontSize: 8
                    },

                    columnStyles:
                        this.selectedPdfColumns.reduce(
                            (obj, col, index) => {

                                obj[index] = {
                                    cellWidth:
                                        col.width ? col.width / 4 : 'auto'
                                };

                                return obj;

                            }, {}
                        )

                });


                doc.save('Report.pdf');

            } finally {
                this.isExporting = false
            }

        }, 100);



    }

    columnResize(event: any) {

        const column = event.element;

        const field = column.getAttribute('data-field');

        const col = this.cols.find(
            x => x.field === field
        );

        if (col) {
            col.width = column.offsetWidth;
        }
    }



}

