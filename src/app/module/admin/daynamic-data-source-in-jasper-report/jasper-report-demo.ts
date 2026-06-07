// report-generator.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JasperService } from './jasper-report-service';
import { DatabaseConfig } from './dynamic.domain';


@Component({
  selector: 'app-report-generator',
  templateUrl: './jasper-report-demo.html',
  styleUrls: ['./report-generator.component.css']
})
export class JasperReportComponent {
  dbConfigForm: FormGroup;
  reportParamsForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private reportService: JasperService
  ) {
    this.initializeForms();
  }

  private initializeForms(): void {
    // Database Configuration Form
    this.dbConfigForm = this.fb.group({
      host: ['localhost', [Validators.required]],
      port: ['1521', [Validators.required]],
      serviceName: ['ORCL', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      schema: ['MYSCHEMA', [Validators.required]]
    });

    // Report Parameters Form
    this.reportParamsForm = this.fb.group({
      startDate: ['2024-01-01'],
      endDate: ['2024-12-31'],
      PACCOUNT_NO: ['2024-12-31'],
      department: [''],
      reportType: ['summary']
    });
  }
  // Method 1: Specific report with DB config
  generateReport(): void {
    this.reportService.downloadReport('ACCOUNT_BALANCE_REPORT', 'pdf', {
      startDate: '2023-01-01',
      endDate: '2024-01-01',
      PACCOUNT_NO: '01710279904'
    }).subscribe({
      next: (blob) => {
        const fileURL = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = 'ACCOUNT_BALANCE_REPORT.pdf';
        a.click();
        URL.revokeObjectURL(fileURL);
      },
      error: (err) => console.error('Error downloading report:', err)
    });

  }

  // Method 1: Generate report with direct Jasper Server call
  generateReportDirect(): void {
    if (this.dbConfigForm.invalid) {
      this.errorMessage = 'Please fill all required database fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const dbConfig: DatabaseConfig = this.dbConfigForm.value;
    const reportParams = this.reportParamsForm.value;

    this.reportService.generateReportWithDynamicDB(dbConfig, reportParams)
      .subscribe({
        next: (pdfBlob) => {
          this.reportService.downloadBlob(pdfBlob, 'dynamic_report.pdf');
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Report generation failed:', error);
          this.errorMessage = 'Failed to generate report. Please check your database configuration.';
          this.isLoading = false;
        }
      });
  }

  // Method 2: Generate report via Spring Boot proxy
  generateReportViaProxy(): void {
    if (this.dbConfigForm.invalid) {
      this.errorMessage = 'Please fill all required database fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const reportRequest = {
      dbConfig: this.dbConfigForm.value,
      reportParameters: this.reportParamsForm.value
    };

  }

  // Load predefined database configurations
  loadPredefinedConfig(configName: string): void {
    const configs: { [key: string]: DatabaseConfig } = {
      production: {
        host: 'prod-db-server',
        port: '1521',
        serviceName: 'PRODDB',
        username: 'report_user',
        password: 'report_pass',
        schema: 'REPORT_SCHEMA'
      },
      development: {
        host: 'localhost',
        port: '1521',
        serviceName: 'xe',
        username: 'hims',
        password: 'root',
        schema: 'hims'
      },
      test: {
        host: 'test-db-server',
        port: '1521',
        serviceName: 'TESTDB',
        username: 'test_user',
        password: 'test_pass',
        schema: 'TEST_SCHEMA'
      }
    };

    if (configs[configName]) {
      this.dbConfigForm.patchValue(configs[configName]);
    }
  }
}