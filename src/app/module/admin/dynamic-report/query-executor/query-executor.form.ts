import { Component, ElementRef, HostListener, VERSION, ViewChild } from '@angular/core';
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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CONDITIONAL_CLAUSE, FUNCTION_NAMES, LOGICAL_OPERATORS } from '../textarea-highlight/domain';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';





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
    tableFontSize = 12; // Default
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
    pageHeight: string
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
    endSelectedIndex: any = null;
    isDragging = false;
    isDraggSelection: boolean = false

    selectedCells = new Set<string>();
    previousCols = [];
    LogicalOperators = LOGICAL_OPERATORS;
    ConditionalClause = CONDITIONAL_CLAUSE;
    functionNames = FUNCTION_NAMES;
    dataBaseObjectsList: any[] = [];

    queryString: string = 'select * from budget_transaction'
    highlightedText: SafeHtml = '';

    @ViewChild('backdrop') backdrop!: ElementRef<HTMLDivElement>;


    pageSize = 100;
    page = 0;
    totalRecords = 0;
    totalPages = 0;

    rowHeight = 10;

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
        this.previousCols = [...this.cols];
        this.rowPerPage = this.commonService.getRowsPerPage(17)
        this.pageHeight = this.commonService.getScreenHeight()
        this.route.queryParams.subscribe(params => {
            this.profileId = params.udfProfileId;
        });
        this.form = this.fb.group({
            //queryString: ["select *  from inv_accounts where customer_id=80750", Validators.required]
            queryString: ["select *  from budget_transaction fetch first 500 row only ", Validators.required]
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



    // Sync scrolling between the invisible textarea and the colored backdrop
    handleScroll(event: Event) {
        const textarea = event.target as HTMLTextAreaElement;
        if (this.backdrop) {
            this.backdrop.nativeElement.scrollTop = textarea.scrollTop;
            this.backdrop.nativeElement.scrollLeft = textarea.scrollLeft;
        }
    }

    increaseFontSize() {
        if (this.tableFontSize < 24) {
            this.tableFontSize += 1;
        }
    }


    decreaseFontSize() {
        if (this.tableFontSize > 8) {
            this.tableFontSize -= 1;
        }
    }

    startSelection(event: any, row: number, col: number) {
        if (event.shiftKey) {
            //  this.selectionStart = { row, col };
        } else if (!event.ctrlKey) {
            this.selectedCells.clear()
            this.selectedRowIndex = null;
            this.selectedColIndex = null;
            this.isDragging = true;
            this.isDraggSelection = true;
            this.selectionStart = { row, col };
            this.selectionEnd = { row, col };
            this.selectedCells.add(`${row}-${col}`);
        }

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

    dragSelection(event: any, row: number, col: number) {
        if (!event.ctrlKey) {
            if (!this.isDragging) {
                return;
            }
            this.selectionEnd = { row, col };
            this.endSelectedIndex = `${row}-${col}`

        }
    }

    @HostListener('document:mouseup')
    stopSelection() {
        if (this.isDragging) {
            this.selectedCells.add(this.endSelectedIndex)
        }
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
        if (this.selectObjectType == 'VIEW' || this.selectObjectType == 'TABLE') {
            let queryString = `SELECT DBMS_METADATA.GET_DDL('${this.selectObjectType}', '${this.selectedObjectName}') AS SCRIPT FROM DUAL`;
            this.downloadedData(queryString)
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
            this.queryString = 'select * from ' + name
            // call aip for getting data
            this.downloadedData(this.queryString + ' fetch first 500 row only')
        }

        this.sidebarVisible = false



    }



    loadObjectDetials(objectName, ObjectType) {

    }

    sumSelectedColumn() {

        let sumAmount: number = 0

        const cells = Array.from(this.selectedCells);

        const firstTwo = cells.slice(0, 2);
        const remainingSelectedCells = cells.slice(2);


        let startRowIndex = this.selectionStart.row
        let endRowIndex = this.selectionEnd.row
        let startColIndex = this.selectionStart.col
        let endColIndex = this.selectionEnd.col
        // sum if select muliple cell of a specific colum by drag
        if (cells.length >= 2) {
            // dragg selection and  Ctrl + Click selection
            if (this.isDraggSelection) {
                sumAmount += this.sumRangeValue(firstTwo)
                sumAmount += this.sumDifferentSlectedCellValue(remainingSelectedCells)
            } else {
                // Ctrl + Click selection
                sumAmount += this.sumDifferentSlectedCellValue(cells)
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
                    sumAmount += value;
                }

            });
        }


        const formattedSum = sumAmount.toLocaleString('en-BD', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        this.countMessage = 'Summation is : ' + formattedSum;

        this.showCountDialog = true;
    }

    sumRangeValue(range: any) {
        let sumAmount: number = 0
        const [startKey, endKey] = range;

        const [startRow, startCol] = startKey.split('-').map(Number);
        const [endRow, endCol] = endKey.split('-').map(Number);

        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);

        const minCol = Math.min(startCol, endCol);
        const maxCol = Math.max(startCol, endCol);

        for (let r = minRow; r <= maxRow; r++) {

            const row = this.filteredTableData[r];

            for (let c = minCol; c <= maxCol; c++) {

                const field = this.visibleColumns[c].field;

                const value = Number(row[field]);

                if (!isNaN(value)) {
                    sumAmount += value;
                }
            }
        }
        return sumAmount;
    }

    sumDifferentSlectedCellValue(cells: any) {
        let sumAmount: number = 0
        for (const key of cells) {
            const [rowIndex, colIndex] = key.split('-').map(Number);
            const row = this.filteredTableData[rowIndex];
            const field = this.visibleColumns[colIndex].field;
            const value = Number(row[field]);
            if (!isNaN(value)) {
                sumAmount += value;
            }
        }

        return sumAmount;
    }

    sqlFormatar() {
        this.queryString = format(this.queryString, {
            language: 'plsql'
        });

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

        this.selectedRows = [...this.filteredTableData];

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

        this.visibleColumns = this.allColumns.filter(
            col => col.visible
        );

        //update Select All checkbox status
        this.selectAllColumns =
            this.allColumns.every(col => col.visibleColumns);

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
            const sampleValue = this.filteredTableData.find(
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
                        ...this.filteredTableData.map(row =>
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
        this.selectAllColumn();
        this.filteredTableData = [...this.tableData];

    }

    selectAllColumn() {
        this.allColumns.forEach(col => {
            col.visible = true;
        });
        this.visibleColumns = this.allColumns.filter(
            col => col.visible
        );

        //update Select All checkbox status
        this.selectAllColumns =
            this.allColumns.every(col => col.visibleColumns);
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
        this.filteredTableData.sort((a, b) => {

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
        this.filteredTableData.sort((a, b) => {

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


    onCellClick(event: MouseEvent, row: any, col: any, rowIndex: number, colIndex: number) {
        event.preventDefault();
        const key = `${rowIndex}-${colIndex}`;

        if (event.ctrlKey) {
            if (this.selectedCells.has(key)) {
                this.selectedCells.delete(key);
            } else {
                this.selectedCells.add(key);
            }
        } else if (event.shiftKey) {
            this.isDraggSelection = true;
            this.selectionEnd = { row: rowIndex, col: colIndex }
            if (this.selectedCells.has(key)) {
                this.selectedCells.delete(key);
            } else {
                const arr = Array.from(this.selectedCells);

                if (arr.length >= 2) {
                    this.selectedCells.delete(arr[1]); // Delete the second item
                }
                this.selectedCells.add(key);
            }
        } else {
            this.selectedCells.clear();
            this.selectedCells.add(key);
            this.selectionStart = { row: rowIndex, col: colIndex };
            this.isDraggSelection = false;
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
                    this.selectedCells.clear()
                    this.selectionStart = {};
                    this.selectionEnd = {};
                    this.selectedColIndex--;
                }
                break;

            case 'ArrowRight':
                if (this.selectedColIndex < this.cols.length - 1) {
                    this.selectedCells.clear()
                    this.selectionStart = {};
                    this.selectionEnd = {};
                    this.selectedColIndex++;
                }
                break;

            case 'ArrowUp':
                if (this.selectedRowIndex > 0) {
                    this.selectedCells.clear()
                    this.selectionStart = {};
                    this.selectionEnd = {};
                    this.selectedRowIndex--;
                }
                break;

            case 'ArrowDown':
                if (this.selectedRowIndex < this.filteredTableData.length - 1) {
                    this.selectedCells.clear()
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
                this.dataBaseObjectsList = [
                    ...new Set(response.map((item: any) => item.OBJECT_NAME))
                ];

                this.objectTypes = [...new Set(
                    response.map(x => x.OBJECT_TYPE)
                )].sort();
            });

    }

    get totalScrollHeight(): number {
        return this.totalRecords * this.rowHeight;
    }

    scrollUp(): void {

        const element = this.getScrollElement();

        element?.scrollBy({
            top: -200,
            behavior: 'smooth'
        });
    }

    scrollDown(): void {
        const element = this.getScrollElement();

        if (!element) {
            return;
        }

        element.scrollBy({
            top: 200,
            behavior: 'smooth'
        });

        // Wait for smooth scrolling to finish
        setTimeout(() => {
            this.checkLastRow(element);
        }, 300);
    }

    private checkLastRow(element: HTMLElement): void {

        const reachedBottom =
            element.scrollTop + element.clientHeight >=
            element.scrollHeight - 5;

        console.log('scrollTop:', element.scrollTop);
        console.log('clientHeight:', element.clientHeight);
        console.log('scrollHeight:', element.scrollHeight);
        console.log('Reached last row:', reachedBottom);


        if (reachedBottom) {
            this.page += 1
            if (this.page >= this.totalPages) {
                this.notificationService.sendInfo('No more records')
                return;
            }
            this.downloadedReportData(true)
        }
    }

    private getScrollElement(): HTMLElement | null {

        const tableElement = this.dataTable.el.nativeElement;

        return tableElement.querySelector(
            '.p-datatable-wrapper'
        ) as HTMLElement;
    }

    downloadedReportData(isloadingNextPage: boolean) {
        if (!isloadingNextPage) {
            this.page = 0
            this.selectedRows = [];
            this.selectedCell = null;
            this.filteredTableData = []
        }

        if (this.queryString == null) {

            return this.notificationService.sendInfo('please add query');
        }

        if (this.isWantToGetScript) {
            this.isShowReport = true;
            this.isShowParaForm = false;
            return;
        }

        let params = {
            sql: this.queryString,
            params: { id: "abc" },
            page: this.page,
            size: this.pageSize,
            asPage: 1 //true

        }
        const urlSearchParams = this.getQueryParamMapForApprovalFlow(null, this.taskId, null, null);
        this.udfService.executeQueryWithDataType(params, urlSearchParams).subscribe(
            (response: any) => {
                this.isShowParaForm = false;
                this.isShowReport = true;
                this.isTableData = true
                this.totalRecords = response.totalRows
                this.totalPages = response.totalPages

                // console.log(response);
                let rows = response.rows;

                // Add temporary unique key for PrimeNG row selection
                this.tableData = rows.map((row: any, index: number) => ({
                    __rowId: index,
                    ...row
                }));

                this.filteredTableData = [...this.filteredTableData, ...this.tableData];

                if (this.tableData && this.tableData.length > 0) {
                    this.cols = response.columns.map((column: any) => ({

                        field: column.name,
                        header: this.toHeaderCase(column.name),
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

    downloadedExcelData(): Observable<any[]> | undefined {

        if (this.queryString == null || this.queryString.trim() === '') {
            this.notificationService.sendInfo('Please add query');
            return undefined;
        }

        const params = {
            sql: this.queryString,
            params: {
                id: 'abc'
            },
            page: 0,
            size: 0,
            asPage: 0 //false
        };

        const urlSearchParams =
            this.getQueryParamMapForApprovalFlow(
                null,
                this.taskId,
                null,
                null
            );

        return this.udfService
            .executeQueryWithDataType(
                params,
                urlSearchParams
            )
            .pipe(
                map((response: any) => {

                    const rows = response?.rows ?? [];

                    const tableData = rows.map(
                        (row: any, index: number) => ({
                            __rowId: index,
                            ...row
                        })
                    );

                    return tableData;
                })
            );
    }
    toHeaderCase(text: string): string {
        return text
            .toLowerCase()
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    downloadedData(query: string) {




        let params = {
            sql: query,
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
                    this.queryString = response.rows[0].SCRIPT;
                }
                else if ((this.selectObjectType == 'TABLE' || this.selectObjectType == 'VIEW') && this.isWantToGetScript == true) {
                    this.queryString = response.rows[0].SCRIPT;;
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

        this.isExporting = true;

        setTimeout(() => {

            try {

                const workbook = XLSX.utils.book_new();

                const chunkSize = 300000;

                // Visible column fields
                const fields = this.visibleColumns.map(col => col.field);

                // Excel headers
                const headers = this.visibleColumns.map(col => col.header);


                this.downloadedExcelData()?.subscribe({
                    next: (tableData: any[]) => {

                        for (let i = 0; i < tableData.length; i += chunkSize) {

                            const chunk = tableData.slice(i, i + chunkSize);

                            // Keep only visible columns
                            const exportData = chunk.map(row => {

                                const obj: any = {};

                                fields.forEach(field => {
                                    obj[field] = row[field];
                                });

                                return obj;
                            });

                            const worksheet = XLSX.utils.json_to_sheet(exportData, {
                                header: fields
                            });

                            // Replace field names with display headers
                            XLSX.utils.sheet_add_aoa(
                                worksheet,
                                [headers],
                                { origin: 'A1' }
                            );

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
                    },

                    error: (error) => {
                        console.error('Error loading Excel data:', error);
                        this.notificationService.sendError(
                            'Failed to load data'
                        );
                    }
                });






            } finally {

                this.isExporting = false;

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


                const rows = this.filteredTableData.map(row => {

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



    handleKeyDown(event: KeyboardEvent) {

        if (event.ctrlKey && event.key === 'c') {

            event.preventDefault();

            this.copySelectedCells();

        }
    }

    copySelectedCells() {

        if (this.selectedCells.size === 0) {
            return;
        }

        const cells = Array.from(this.selectedCells)
            .map(key => {
                const [row, col] = key.split('-').map(Number);
                return { row, col };
            });

        let copyText = '';

        // Single cell
        if (cells.length === 1) {

            const cell = cells[0];
            const field = this.visibleColumns[cell.col].field;

            copyText = this.filteredTableData[cell.row][field] ?? '';

            this.copyToClipboard2(copyText);
            return;
        }

        // Exactly two cells -> treat as a drag range
        if (cells.length === 2) {

            const start = cells[0];
            const end = cells[1];

            const minRow = Math.min(start.row, end.row);
            const maxRow = Math.max(start.row, end.row);

            const minCol = Math.min(start.col, end.col);
            const maxCol = Math.max(start.col, end.col);

            const rows: string[] = [];

            for (let r = minRow; r <= maxRow; r++) {

                const values: string[] = [];

                for (let c = minCol; c <= maxCol; c++) {

                    const field = this.visibleColumns[c].field;

                    values.push(this.filteredTableData[r]?.[field] ?? '');
                }

                rows.push(values.join('\t'));
            }

            copyText = rows.join('\n');

            this.copyToClipboard2(copyText);
            return;
        }

        // Ctrl+Click selection (3 or more individual cells)
        const rowMap = new Map<number, { col: number, value: any }[]>();

        cells.forEach(cell => {

            const field = this.visibleColumns[cell.col].field;
            const value = this.filteredTableData[cell.row]?.[field] ?? '';

            if (!rowMap.has(cell.row)) {
                rowMap.set(cell.row, []);
            }

            rowMap.get(cell.row)!.push({ col: cell.col, value });

        });

        copyText = Array.from(rowMap.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([_, cols]) =>
                cols
                    .sort((a, b) => a.col - b.col)
                    .map(c => c.value)
                    .join('\t')
            )
            .join('\n');

        this.copyToClipboard2(copyText);
    }

    copySelectedCellsWithHeader() {

        if (this.selectedCells.size === 0) {
            return;
        }

        const cells = Array.from(this.selectedCells)
            .map(key => {
                const [row, col] = key.split('-').map(Number);
                return { row, col };
            });

        let copyText = '';

        // -------------------------
        // Single Cell
        // -------------------------
        if (cells.length === 1) {

            const cell = cells[0];
            const column = this.visibleColumns[cell.col];

            copyText += column.header + '\n';
            copyText += this.filteredTableData[cell.row][column.field] ?? '';

            this.copyToClipboard2(copyText);
            return;
        }

        // -------------------------
        // Range Selection
        // -------------------------
        if (cells.length === 2) {

            const start = cells[0];
            const end = cells[1];

            const minRow = Math.min(start.row, end.row);
            const maxRow = Math.max(start.row, end.row);

            const minCol = Math.min(start.col, end.col);
            const maxCol = Math.max(start.col, end.col);

            // Header
            const headers: string[] = [];

            for (let c = minCol; c <= maxCol; c++) {
                headers.push(this.visibleColumns[c].header);
            }

            copyText += headers.join('\t') + '\n';

            // Data
            for (let r = minRow; r <= maxRow; r++) {

                const values: string[] = [];

                for (let c = minCol; c <= maxCol; c++) {

                    const field = this.visibleColumns[c].field;

                    values.push(this.filteredTableData[r]?.[field] ?? '');
                }

                copyText += values.join('\t');

                if (r < maxRow) {
                    copyText += '\n';
                }
            }

            this.copyToClipboard2(copyText);
            return;
        }

        // -------------------------
        // Ctrl + Click
        // -------------------------

        const rowMap = new Map<number, Map<number, any>>();
        const colSet = new Set<number>();

        cells.forEach(cell => {

            colSet.add(cell.col);

            if (!rowMap.has(cell.row)) {
                rowMap.set(cell.row, new Map());
            }

            const field = this.visibleColumns[cell.col].field;

            rowMap.get(cell.row)!.set(
                cell.col,
                this.filteredTableData[cell.row]?.[field] ?? ''
            );

        });

        const cols = [...colSet].sort((a, b) => a - b);

        // Header
        copyText += cols
            .map(c => this.visibleColumns[c].header)
            .join('\t');

        copyText += '\n';

        // Data
        Array.from(rowMap.keys())
            .sort((a, b) => a - b)
            .forEach(row => {

                const values = cols.map(col =>
                    rowMap.get(row)?.get(col) ?? ''
                );

                copyText += values.join('\t') + '\n';

            });

        this.copyToClipboard2(copyText.trimEnd());
    }

    copyToClipboard2(text: string) {

        if (navigator.clipboard) {

            navigator.clipboard.writeText(text)
                .then(() => {
                    // console.log('Copied:', text);
                });

        } else {

            const textarea = document.createElement('textarea');

            textarea.value = text;

            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';

            document.body.appendChild(textarea);

            textarea.focus();
            textarea.select();

            document.execCommand('copy');

            document.body.removeChild(textarea);

            // console.log('Copied:', text);
        }
    }





}

