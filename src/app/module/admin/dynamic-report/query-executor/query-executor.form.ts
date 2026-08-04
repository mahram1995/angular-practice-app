import { Component, HostListener, ViewChild } from '@angular/core';
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
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ViewEncapsulation } from '@angular/core';
import { format } from 'sql-formatter';





@Component({
    selector: 'query-executor-form',
    templateUrl: 'query-executor.form.html',
    styleUrls: ['./query-executor.css'],
    encapsulation: ViewEncapsulation.None

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
    isTableData: boolean = true
    sidebarVisible: boolean = false;
    selectedObjectName: any = null;
    selectObjectType: any;
    isWantToGetScript: boolean = false

    databaseObjects: any[] = [];
    sortingMode: string = 'ascending';


    cols: any[] = [];
    visibleColumns: any[] = [];
    columnDialog: boolean = false
    tableData: any[] = [];

    isExporting = false;
    isExportPDF = false;

    udfProfileData: UDFDomain; // Paste your JSON here
    profileId: number

    selectedPdfColumns: any[] = [];
    selectedRow: any;
    rowPerPage = 0; // Default
    fontSize = 12; // Default
    selectedCell: any

    @ViewChild('dataTable') dataTable!: Table;

    menuItems: MenuItem[] = [];
    selectedRows: any[] = [];

    showCountDialog = false;
    countMessage = '';
    insertTableName = 'PLESE_REPLACE_YOUR_TABLE';

    selectedRowIndex = null;
    selectedColIndex = null;



    filteredTableData: any[] = [];
    pageHeight: number
    showFIlterRow: boolean = false;

    allColumns: any[] = [];
    selectAllColumns = true;
    selectedColumns: any[] = [];

    objectTypes: string[] = [];
    selectedObjectType!: string;

    filteredObjects: any[] = []; F
    searchObjectText = "";

    selectionStart: any = null;
    selectionEnd: any = null;
    isDragging = false;

    selectedCells = new Set<string>();

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
        this.loadDatabaseObjects();

        this.rowPerPage = this.commonService.getRowsPerPage(17)
        this.pageHeight = this.commonService.getScreenHeight()
        this.route.queryParams.subscribe(params => {
            this.profileId = params.udfProfileId;
        });
        this.form = this.fb.group({
            //queryString: ["select *  from inv_accounts where customer_id=80750", Validators.required]
            queryString: ["select *  from budget_transaction ", Validators.required]
        });

        this.menuItems = [
            {
                label: 'Select All Rows',
                icon: 'pi pi-check-square',
                command: () => this.selectAllRows()
            },
            {
                label: 'Unselect All Rows',
                icon: 'pi pi-times-circle',
                command: () => this.unselectAllRows()
            },
            {
                label: 'Hide Column',
                icon: 'pi pi-eye-slash',
                command: () => this.hideSelectedColumn()
            },
            {
                label: 'Show All Columns',
                icon: 'pi pi-eye',
                command: () => this.showAllColumns()
            },
            {
                label: 'Refresh',
                icon: 'pi pi-refresh',
                command: () => this.refreshReport()
            },
            {
                label: 'Remove Filter',
                icon: 'pi pi-refresh',
                command: () => this.removeFilter()
            },
            {
                label: 'Copy Selected Cell Value',
                icon: 'pi pi-copy',
                command: () => this.copyCell()
            },
            {
                label: 'Copy Selected Row Value',
                icon: 'pi pi-clone',
                command: () => this.copyRow()
            },
            {
                label: 'Filter by this value',
                icon: 'pi pi-filter',
                command: () => this.filterBySelectedValue()
            },
            {
                label: 'Count Total Rows Number',
                icon: 'pi pi-calculator',
                command: () => this.countRow()
            },

            {
                label: 'Export Selected Row',
                icon: 'pi pi-file-excel',
                command: () => this.exportSelectedRowsToExcel()
            },
            {
                label: 'Sort Ascending',
                icon: 'pi pi-sort-amount-up',
                command: () => this.sortAscending()
            },

            {
                label: 'Sort Descending',
                icon: 'pi pi-sort-amount-down',
                command: () => this.sortDescending()
            },
            {
                label: 'Create Table Script',
                icon: 'pi pi-table',
                command: () => this.createTableScript()
            },
            {
                label: 'Create Insert Script',
                icon: 'pi pi-database',
                command: () => this.createInsertScript()
            }
        ];

    }

    startSelection(row: number, col: number) {
        this.selectedRowIndex = null;
        this.selectedColIndex = null;
        this.isDragging = true;
        this.selectionStart = { row, col };
        this.selectionEnd = { row, col };
    }

    startSelection2(event: MouseEvent) {

        const cell = (event.target as HTMLElement)
            .closest('td');

        if (!cell) return;

        event.preventDefault(); // important

        this.isDragging = true;

        this.selectedCells.clear();

        const row = cell.getAttribute('data-row');
        const col = cell.getAttribute('data-col');

        this.selectedCells.add(`${row}-${col}`);
    }

    selectCell2(event: MouseEvent) {

        if (!this.isDragging) return;

        const cell = (event.target as HTMLElement)
            .closest('td');

        if (!cell) return;

        const row = cell.getAttribute('data-row');
        const col = cell.getAttribute('data-col');

        this.selectedCells.add(`${row}-${col}`);
    }

    endSelection() {
        this.isDragging = false;
    }


    dragSelection(row: number, col: number) {
        if (!this.isDragging) {
            return;
        }
        this.selectedCells = new Set<string>();
        this.selectionEnd = { row, col };

    }

    @HostListener('document:mouseup')
    stopSelection() {
        this.isDragging = false;
    }

    onRightMenuClick() {
        this.sidebarVisible = true
    }

    onObjectTypeChange() {

        this.filteredObjects = this.databaseObjects.filter(
            x => x.OBJECT_TYPE === this.selectedObjectType
        );

    }

    filterList() {

        this.filteredObjects = this.databaseObjects.filter(x =>

            x.OBJECT_TYPE === this.selectedObjectType
            &&
            x.OBJECT_NAME.toLowerCase()
                .includes(this.searchObjectText.toLowerCase())

        );

    }

    getObjectScript() {
        this.isWantToGetScript = true
        this.isShowReport = false
        this.isShowParaForm = true
        let query: string
        if (this.selectObjectType == 'VIEW' || this.selectObjectType == 'TABLE') {
            query = `SELECT DBMS_METADATA.GET_DDL('${this.selectObjectType}', '${this.selectedObjectName}') AS SCRIPT FROM DUAL`;
            this.downloadedData(query)
        }
    }

    selectObject(object: any) {
        let query: string
        let name = object.OBJECT_NAME;
        let objectType = object.OBJECT_TYPE;
        this.selectObjectType = object.OBJECT_TYPE;
        this.selectedObjectName = object.OBJECT_NAME;




        if (objectType == 'FUNCTION' || objectType == 'PROCEDURE') {
            this.isTableData = false
            this.isShowParaForm = true
            this.allColumns = []
            query = `SELECT DBMS_METADATA.GET_DDL('${objectType}', '${name}') AS SCRIPT FROM DUAL`;
            this.downloadedData(query)
        }

        if (objectType == 'PACKAGE' || objectType == 'PACKAGE_BODY') {
            this.isTableData = false
            this.isShowParaForm = true
            this.allColumns = []
            query = `SELECT DBMS_METADATA.GET_DDL('${objectType}', '${name}') AS SCRIPT FROM DUAL`;
            this.downloadedData(query)
        }

        else if (objectType == 'TABLE' || objectType == 'VIEW') {
            this.isTableData = true
            query = 'select * from ' + name
            // set the value in text area
            this.form.get('queryString')?.setValue(
                format(query)
            );

            // call aip for getting data
            this.downloadedData(query + ' fetch first 50000 row only')
        }

        this.sidebarVisible = false



    }



    loadObjectDetials(objectName, ObjectType) {

    }

    sumSelectedColumn() {
        let soumAmount: number = 0
        console.log(this.selectedCells);

        let startRowIndex = this.selectionStart.row
        let endRowIndex = this.selectionEnd.row
        let startColIndex = this.selectionStart.col
        let endColIndex = this.selectionEnd.col
        // sum if select muliple row of a specific colum
        if ((startColIndex == endColIndex) && (startRowIndex != endRowIndex)) {
            for (let i = startRowIndex; i <= endRowIndex; i++) {

                const row = this.filteredTableData[i];

                const columnField = this.cols[this.selectionStart.col].field;

                const value = Number(row[columnField]);

                if (!isNaN(value)) {
                    soumAmount += value;
                }
            }

        } else if (this.selectedCells.size > 1) {
            for (const key of this.selectedCells) {

                const [rowIndex, colIndex] = key.split('-').map(Number);

                const row = this.filteredTableData[rowIndex];
                const field = this.cols[colIndex].field;

                const value = Number(row[field]);

                if (!isNaN(value)) {
                    soumAmount += value;
                }
            }

        } else { // sum selected colum value 
            if (this.selectedCell.column.sqlType !== 'NUMBER') {

                this.countMessage = 'Please select a numeric column.';
                this.showCountDialog = true;
                return;
            }

            if (!this.selectedCell) {

                this.countMessage = 'Please select a cell first.';
                this.showCountDialog = true;
                return;
            }

            const field = this.selectedCell.column.field;



            this.filteredTableData.forEach(row => {

                const value = Number(row[field]);

                if (!isNaN(value)) {
                    soumAmount += value;
                }

            });
        }




        const formattedSum = soumAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        this.countMessage = 'Summaiton : ' + formattedSum;

        this.showCountDialog = true;
    }

    sqlFormatar() {
        const sql = this.form.get('queryString')?.value;

        this.form.get('queryString')?.setValue(
            format(sql)
        );
    }

    toggleAllColumns() {
        this.allColumns.forEach(col => {
            col.visible = this.selectAllColumns;
        });

        this.columnChange();
    }



    @HostListener('window:resize')
    onResize() {
        this.commonService.getScreenHeight()
    }

    selectAllRows() {

        this.selectedRows = [...this.tableData];

    }
    unselectAllRows() {

        this.selectedRows = [];

    }

    hideSelectedColumn() {
        if (!this.selectedCell) {
            return;
        }
        const col = this.allColumns.find(
            x => x.field === this.selectedCell.column.field
        );
        if (col) {
            col.visible = false;
            this.columnChange();
        }
    }

    showAllColumns() {

        this.allColumns.forEach(col => col.visible = true);

        this.columnChange();

    }

    showFilterRow() {
        if (this.showFIlterRow == false) {
            this.showFIlterRow = true;
        } else {
            this.showFIlterRow = false;
        }

    }

    createTableScript() {

        if (!this.visibleColumns || this.visibleColumns.length === 0) {

            this.countMessage = 'No columns available.';
            this.showCountDialog = true;
            return;
        }


        let script = `CREATE TABLE ${this.insertTableName} (\n`;


        const columns = this.visibleColumns.map(col => {

            const field = col.field;

            // Find sample value from data
            const sampleValue = this.tableData.find(
                row => row[field] !== null && row[field] !== undefined
            )?.[field];


            let dataType = 'VARCHAR2(255)';


            if (typeof sampleValue === 'number') {

                dataType = 'NUMBER';

            }
            else if (sampleValue instanceof Date) {

                dataType = 'DATE';

            }
            else if (typeof sampleValue === 'string') {


                // Date string detection
                if (!isNaN(Date.parse(sampleValue))) {
                    dataType = 'DATE';
                }
                else {

                    const maxLength = Math.max(
                        ...this.tableData.map(row =>
                            row[field]
                                ? String(row[field]).length
                                : 0
                        )
                    );


                    if (maxLength <= 50) {
                        dataType = 'VARCHAR2(50)';
                    }
                    else if (maxLength <= 200) {
                        dataType = 'VARCHAR2(250)';
                    }
                    else {
                        dataType = 'CLOB';
                    }

                }

            }


            return `    ${field} ${dataType}`;

        });


        script += columns.join(',\n');

        script += '\n);';


        this.copyToClipboard(script);


        this.countMessage = 'Create table script copied to clipboard.';


    }



    createInsertScript() {

        if (!this.selectedRows || this.selectedRows.length === 0) {

            this.countMessage = 'Please select at least one row.';
            this.showCountDialog = true;
            return;
        }

        const columns = this.visibleColumns.map(col => col.field);

        let script = '';

        this.selectedRows.forEach(row => {

            const values = this.visibleColumns.map(col => {

                const value = row[col.field];

                if (value === null || value === undefined || value === '') {
                    return 'NULL';
                }

                switch (col.sqlType?.toUpperCase()) {

                    case 'NUMBER':
                    case 'INTEGER':
                    case 'DECIMAL':
                        return value;

                    case 'DATE':
                        // Assuming value is dd-MM-yyyy
                        return `TO_DATE('${value}','DD-MM-YYYY')`;

                    case 'TIMESTAMP':
                        // Assuming value is dd-MM-yyyy HH:mm:ss
                        return `TO_TIMESTAMP('${value}','DD-MM-YYYY HH24:MI:SS')`;

                    default:
                        return `'${String(value).replace(/'/g, "''")}'`;
                }

            });

            script += `INSERT INTO ${this.insertTableName} (${columns.join(', ')})\n`;
            script += `VALUES (${values.join(', ')});\n\n`;

        });

        this.copyToClipboard(script);

        this.countMessage = 'Insert script copied to clipboard.';
        this.showCountDialog = true;

    }

    removeFilter() {
        this.selectedRows = [];
        this.selectedCell = null;
        this.dataTable.clear();
        this.filteredTableData = [...this.tableData];

    }
    refreshReport() {
        this.selectedRows = [];
        this.selectedCell = null;
        this.dataTable.clear();
        this.downloadedData(null);

    }
    filterBySelectedValue() {

        if (!this.selectedCell) {
            return;
        }

        const field = this.selectedCell.column.field;
        const value = this.selectedCell.value;


        this.dataTable.filter(
            value,
            field,
            'equals'
        );

    }

    columnSorting() {
        if (this.sortingMode == 'descending') {
            return this.sortDescending()
        } {
            return this.sortAscending()
        }

    }

    sortAscending() {

        if (!this.selectedCell) {
            return;
        }

        const field = this.selectedCell.column.field;
        this.sortingMode = 'descending'
        this.tableData.sort((a, b) => {

            const valueA = a[field];
            const valueB = b[field];

            return this.compare(valueA, valueB);

        });

    }

    compare(a: any, b: any): number {

        if (a == null) return -1;
        if (b == null) return 1;


        // Number sorting
        if (!isNaN(a) && !isNaN(b)) {
            return Number(a) - Number(b);
        }


        // Date sorting
        const dateA = Date.parse(a);
        const dateB = Date.parse(b);

        if (!isNaN(dateA) && !isNaN(dateB)) {
            return dateA - dateB;
        }


        // String sorting
        return String(a).localeCompare(String(b));

    }



    sortDescending() {

        if (!this.selectedCell) {
            return;
        }

        const field = this.selectedCell.column.field;
        this.sortingMode = 'ascending'
        this.tableData.sort((a, b) => {

            const valueA = a[field];
            const valueB = b[field];

            return this.compare(valueB, valueA);

        });

    }


    selectCell(rowIndex: number,
        colIndex: number,
        rowData: any,
        col: any) {

        this.selectedRowIndex = rowIndex;
        this.selectedColIndex = colIndex;
        this.selectedCell = {
            row: rowData,
            column: col
        };
    }


    onCellClick(event: MouseEvent, row: any, col: any, rowIndex: any, colIndex: any) {
        event.preventDefault();
        const key = `${rowIndex}-${colIndex}`;

        if (event.ctrlKey) {

            if (this.selectedCells.has(key)) {
                this.selectedCells.delete(key);
            } else {
                this.selectedCells.add(key);
            }
            console.log(this.selectedCells);
        } else {
            this.selectedCells.clear();
            this.selectedCells.add(key);
            this.selectedRowIndex = rowIndex;
            this.selectedColIndex = colIndex;
            this.selectedCell = {
                row: row,
                column: col,
                value: row[col.field]
            };
        }




    }

    copyCell() {
        if (!this.selectedCell) {
            return;
        }


        const text = String(this.selectedCell.value ?? '');

        if (navigator.clipboard) {

            navigator.clipboard.writeText(text)
                .then(() => {
                    // console.log('Copied:', text);
                })
                .catch(err => {
                    console.error('Clipboard error:', err);
                    this.fallbackCopy(text);
                });

        } else {
            this.fallbackCopy(text);
        }

    }

    fallbackCopy(text: string) {

        // const textarea = document.createElement('textarea');

        // textarea.value = text;
        // textarea.style.position = 'fixed';
        // textarea.style.left = '-9999px';
        // textarea.style.top = '0';

        // document.body.appendChild(textarea);

        // textarea.focus();
        // textarea.select();

        // const success = document.execCommand('copy');

        // document.body.removeChild(textarea);
        const textarea = document.createElement('textarea');

        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        document.execCommand('copy');

        document.body.removeChild(textarea);
    }

    copyRow() {
        // user for copy as a JSON 
        // -------------------------------------------
        // navigator.clipboard.writeText(
        //     JSON.stringify(this.selectedCell.row, null, 2)
        // );

        // use for select a single row in single line
        // const headers = this.cols.map(c => c.header).join('\t');
        // const values = this.cols
        //     .map(c => this.selectedCell.row[c.field] ?? '')
        //     .join('\t');

        // navigator.clipboard.writeText(headers + '\n' + values);



        if (!this.selectedRows?.length) {
            return;
        }

        const exportCols = this.visibleColumns;   // <-- don't filter

        const header = exportCols
            .map(c => c.header)
            .join('\t');

        const rows = this.selectedRows.map(row =>
            exportCols
                .map(c => row[c.field] ?? '')
                .join('\t')
        );

        const text = header + '\r\n' + rows.join('\r\n');

        // console.log(text);

        this.copyToClipboard(text);
    }

    copyToClipboard(text: string) {
        if (navigator.clipboard && window.isSecureContext) {

            navigator.clipboard.writeText(text)
                .then(() => console.log('Copied'))
                .catch(() => this.fallbackCopy(text));

        } else {
            this.fallbackCopy(text);
        }
    }

    onFilter(event: any) {

        this.filteredTableData = event.filteredValue
            ? event.filteredValue
            : this.tableData;

    }


    countRow() {
        const count = this.filteredTableData.length;

        this.countMessage = `Total Rows: ${count}`;

        this.showCountDialog = true;

    }

    columnChange() {
        this.visibleColumns = this.allColumns.filter(
            col => col.visible
        );

        //update Select All checkbox status
        this.selectAllColumns =
            this.allColumns.every(col => col.visibleColumns);
    }




    exportSelectedRowsToExcel() {

        if (!this.selectedRows || this.selectedRows.length === 0) {
            this.countMessage = 'Please select at least one row.';
            this.showCountDialog = true;
            return;
        }

        // Remove internal row id column
        const exportData = this.selectedRows.map(row => {

            const data: any = {};

            this.cols.forEach(col => {
                data[col.header] = row[col.field];
            });

            return data;
        });


        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(exportData);


        // Create workbook
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            'Selected Rows'
        );


        // Export
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });


        const blob = new Blob(
            [excelBuffer],
            {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        );


        saveAs(
            blob,
            'Selected_Report.xlsx'
        );
    }


    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {

        const target = event.target as HTMLElement;

        // Don't handle arrow keys while typing
        if (
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target.isContentEditable
        ) {
            return;
        }

        switch (event.key) {

            case 'ArrowLeft':
                if (this.selectedColIndex > 0) {
                    this.selectionStart = {};
                    this.selectionEnd = {};
                    this.selectedColIndex--;
                }
                break;

            case 'ArrowRight':
                if (this.selectedColIndex < this.cols.length - 1) {
                    this.selectionStart = {};
                    this.selectionEnd = {};
                    this.selectedColIndex++;
                }
                break;

            case 'ArrowUp':
                if (this.selectedRowIndex > 0) {
                    this.selectionStart = {};
                    this.selectionEnd = {};
                    this.selectedRowIndex--;
                }
                break;

            case 'ArrowDown':
                if (this.selectedRowIndex < this.tableData.length - 1) {
                    this.selectionStart = {};
                    this.selectionEnd = {};
                    this.selectedRowIndex++;
                }
                break;

            default:
                return;
        }

        event.preventDefault();
        this.updateSelection();
    }

    updateSelection() {

        setTimeout(() => {

            document
                .getElementById(
                    `cell-${this.selectedRowIndex}-${this.selectedColIndex}`
                )
                ?.scrollIntoView({
                    block: 'nearest',
                    inline: 'nearest'
                });

        });

    }

    isRangeSelected(row: number, col: number): boolean {

        if (!this.selectionStart || !this.selectionEnd) {
            return false;
        }

        const minRow = Math.min(this.selectionStart.row, this.selectionEnd.row);
        const maxRow = Math.max(this.selectionStart.row, this.selectionEnd.row);

        const minCol = Math.min(this.selectionStart.col, this.selectionEnd.col);
        const maxCol = Math.max(this.selectionStart.col, this.selectionEnd.col);

        return row >= minRow &&
            row <= maxRow &&
            col >= minCol &&
            col <= maxCol;
    }

    isCellSelected(row: number, col: number) {
        // console.log(this.selectedCells);


        return this.selectedCells.has(`${row}-${col}`);


    }




    isSelected(row: number, field: string): boolean {
        return this.selectedCell?.row === row && this.selectedCell?.field === field;
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





    loadDatabaseObjects() {

        const params = {
            sql: `
            SELECT OBJECT_NAME, OBJECT_TYPE
            FROM USER_OBJECTS
            WHERE OBJECT_TYPE IN
            (
                'TABLE',
                'VIEW',
                'FUNCTION',
                'PROCEDURE',
                'PACKAGE',
                'PACKAGE BODY',
                'SEQUENCE',
                'SYNONYM'
            )
            ORDER BY OBJECT_TYPE, OBJECT_NAME
        `,
            params: {}
        };

        const urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, null, null);

        this.udfService.getReportData(params, urlSearchParams)
            .subscribe((response: any[]) => {

                this.databaseObjects = response
                this.objectTypes = [...new Set(
                    response.map(x => x.OBJECT_TYPE)
                )].sort();
            });

    }

    downloadedReportData() {
        let queryString: string

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        queryString = this.form.value.queryString;

        let params = {
            sql: queryString,
            params: { id: "abc" }

        }
        const urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, null, null);
        this.udfService.executeQueryWithDataType(params, urlSearchParams).subscribe(
            (response: any) => {
                this.isShowParaForm = false;
                this.isShowReport = true;
                this.isTableData = true

                // console.log(response);
                let rows = response.rows;

                // Add temporary unique key for PrimeNG row selection
                this.tableData = rows.map((row: any, index: number) => ({
                    __rowId: index,
                    ...row
                }));

                this.filteredTableData = [...this.tableData];

                if (this.tableData && this.tableData.length > 0) {
                    this.cols = response.columns.map((column: any) => ({

                        field: column.name,
                        header: column.name.replace(/_/g, ' '),
                        sqlType: column.sqlType,
                        jdbcType: column.jdbcType,
                        align: this.getAlignment(column.sqlType)

                    }));

                    this.selectedPdfColumns = [...this.cols];
                }


                this.selectedColumns = [...this.selectedPdfColumns];
                this.allColumns = this.selectedColumns.map(col => ({
                    ...col,
                    visible: true
                }));

                this.visibleColumns = [...this.allColumns];

            });
    }

    downloadedData(query: string) {
        let queryString: string

        if (!query) {
            if (this.form.invalid) {
                this.form.markAllAsTouched();
                return;
            }
            queryString = this.form.value.queryString;
        }
        else {
            queryString = query
        }


        let result: { [key: string]: any } = {};



        let params = {
            sql: queryString,
            params: { id: "abc" }

        }
        const urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, null, null);





        this.udfService.executeQueryWithDataType(params, urlSearchParams).subscribe(
            (response: any) => {

                if ((this.selectObjectType == 'TABLE' || this.selectObjectType == 'VIEW') && this.isWantToGetScript == false) {
                    this.isShowParaForm = false;
                    this.isShowReport = true;
                    this.isTableData = true

                    // console.log(response);
                    let rows = response.rows;

                    // Add temporary unique key for PrimeNG row selection
                    this.tableData = rows.map((row: any, index: number) => ({
                        __rowId: index,
                        ...row
                    }));

                    this.filteredTableData = [...this.tableData];

                    if (this.tableData && this.tableData.length > 0) {
                        this.cols = response.columns.map((column: any) => ({

                            field: column.name,
                            header: column.name.replace(/_/g, ' '),
                            sqlType: column.sqlType,
                            jdbcType: column.jdbcType,
                            align: this.getAlignment(column.sqlType)

                        }));

                        this.selectedPdfColumns = [...this.cols];
                    }


                    this.selectedColumns = [...this.selectedPdfColumns];
                    this.allColumns = this.selectedColumns.map(col => ({
                        ...col,
                        visible: true
                    }));

                    this.visibleColumns = [...this.allColumns];
                    // console.log(this.visibleColumns);
                } else if (this.selectObjectType == 'FUNCTION' || this.selectObjectType == 'PROCEDURE' || this.selectObjectType == 'PACKAGE' || this.selectObjectType == 'PACKAGE_BODY') {
                    this.form.get('queryString')?.setValue(response.rows[0].SCRIPT);
                }
                else if ((this.selectObjectType == 'TABLE' || this.selectObjectType == 'VIEW') && this.isWantToGetScript == true) {
                    this.form.get('queryString')?.setValue(response.rows[0].SCRIPT);
                    this.isWantToGetScript = false
                }

            });


    }

    getAlignment(sqlType: string): string {

        switch (sqlType?.toUpperCase()) {

            case 'NUMBER':
                return 'right';

            case 'DATE':
                return 'center';

            case 'TIMESTAMP':
                return 'center';

            default:
                return 'left';
        }

    }

    formatCellValue(value: any, sqlType: string): any {
        // console.log(value, sqlType);

        if (value == null) {
            return '';
        }
        switch (sqlType?.toUpperCase()) {

            case 'DATE':
                return this.datePipe.transform(
                    value,
                    'dd-MMM-yyyy'
                );

            case 'TIMESTAMP':
                return this.datePipe.transform(
                    value,
                    'dd-MMM-yyyy HH:mm:ss'
                );

            default:
                return value;
        }
    }

    onColumnChange() {

        this.selectedColumns = this.allColumns.filter(column =>
            this.selectedColumns.some(
                selected => selected.field === column.field
            )
        );

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

