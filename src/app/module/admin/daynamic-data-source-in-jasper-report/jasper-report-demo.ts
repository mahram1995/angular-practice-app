// File: jasper-report.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JasperService } from './jasper-report-service';


@Component({
  selector: 'app-jasper-report',
  templateUrl: './jasper-report-demo.html',
 
})
export class JasperReportComponent {
  form: FormGroup;
  running = false;
  message = '';

  constructor(private fb: FormBuilder, private jasper: JasperService) {
    this.form = this.fb.group({
      serverUrl: ['', [Validators.required]],
      username: ['jasperadmin', [Validators.required]],
      password: ['jasperadmin', [Validators.required]],
      reportUnitUri: ['/AbabilNG/RPT_EXPORT', [Validators.required]],
      outputFormat: ['pdf', [Validators.required]],
      useRepositoryDatasource: [true],
      repositoryDatasourceUri: ['/ababil_ng/DEVDB'],
      jdbcUrl: ['jdbc:oracle:thin:@192.168.1.197:1521:devdbng'],
      jdbcUsername: ['ababil_ng2'],
      jdbcPassword: ['a'],
      jdbcDriver: ['oracle.jdbc.driver.OracleDriver'],
      parameters: ['{"YEAR":2025, "REGION":"EAST"}']
    });
  }

  async run() {
    if (this.form.invalid) return;
    this.running = true;
    this.message = 'Starting report...';

    const v = this.form.value;

    const dataSource = v.useRepositoryDatasource
      ? { uri: v.repositoryDatasourceUri }
      : {
          dataSourceType: 'jdbcDataSource',
          connectionUrl: v.jdbcUrl,
          username: v.jdbcUsername,
          password: v.jdbcPassword,
          driverClass: v.jdbcDriver
        };

    let paramsObj = {};
    try {
      paramsObj = v.parameters ? JSON.parse(v.parameters) : {};
    } catch (e) {
      this.message = 'Invalid JSON in parameters';
      this.running = false;
      return;
    }

    try {
      const exec = await this.jasper.createReportExecution(v.serverUrl, v.username, v.password, v.reportUnitUri, v.outputFormat, dataSource, paramsObj);
      this.message = 'Report execution created, polling exports...';
      const exportEntry = await this.jasper.waitForExport(v.serverUrl, v.username, v.password, exec.requestId);
      this.message = 'Downloading...';
      const blob = await this.jasper.downloadExport(v.serverUrl, v.username, v.password, exec.requestId, exportEntry.id);

      // Trigger download in browser
      const filename = `${this.sanitizeFilename(v.reportUnitUri)}.${v.outputFormat}`;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      this.message = 'Download started';
    } catch (err: any) {
      console.error(err);
      this.message = err?.message || 'Error executing report';
    } finally {
      this.running = false;
    }
  }

  sanitizeFilename(uri: string) {
    return uri.replace(/[^a-z0-9]/gi, '_').replace(/^_+/, '');
  }
}


