// report.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JasperService {
  private apiUrl = 'http://localhost:5050/api/reports/dynamic-db';

  private springBootBaseUrl = 'http://localhost:5050'; // Your Spring Boot server
  private proxyEndpoint = '/api/reports/generate-with-dynamic-db';

  constructor(private http: HttpClient) { }
  downloadReport(reportName: string, reportType: string = 'pdf', params?: any) {
    const headers = new HttpHeaders({ Accept: 'application/pdf' });
    let url = `${this.apiUrl}?reportName=${reportName}&reportType=${reportType}`;

    if (params) {
      const query = Object.entries(params)
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join(',');
      url += `&parameter=${query}`;
    }

    return this.http.post(url, {}, { headers, responseType: 'blob' });
  }

  // Method 1: Using Spring Boot proxy
  generateReportWithDynamicDB(dbConfig: any, reportParams: any = {}): Observable<Blob> {
    const url = this.springBootBaseUrl + this.proxyEndpoint;

    // Combine all parameters
    let params = new HttpParams();

    // Add database configuration
    const dbParams = {
      'db_host': dbConfig.host,
      'db_port': dbConfig.port,
      'db_service_name': dbConfig.serviceName,
      'db_username': dbConfig.username,
      'db_password': dbConfig.password,
      'db_schema': dbConfig.schema
    };

    Object.keys(dbParams).forEach(key => {
      if (dbParams[key]) {
        params = params.set(key, dbParams[key]);
      }
    });

    // Add report parameters
    Object.keys(reportParams).forEach(key => {
      if (reportParams[key]) {
        params = params.set(key, reportParams[key]);
      }
    });

    return this.http.get(url, {
      params: params,
      responseType: 'blob'
    });
  }

  // Method 2: Using explicit endpoint
  generateReportWithExplicitParams(dbConfig: any, reportParams: any = {}): Observable<Blob> {
    const url = `${this.springBootBaseUrl}/api/reports/generate-with-db`;

    let params = new HttpParams()
      .set('db_host', dbConfig.host)
      .set('db_port', dbConfig.port)
      .set('db_service_name', dbConfig.serviceName)
      .set('db_username', dbConfig.username)
      .set('db_password', dbConfig.password)
      .set('db_schema', dbConfig.schema);

    // Add optional report parameters
    if (reportParams.startDate) {
      params = params.set('startDate', reportParams.startDate);
    }
    if (reportParams.endDate) {
      params = params.set('endDate', reportParams.endDate);
    }
    if (reportParams.department) {
      params = params.set('department', reportParams.department);
    }
    if (reportParams.reportType) {
      params = params.set('reportType', reportParams.reportType);
    }

    return this.http.get(url, {
      params: params,
      responseType: 'blob'
    });
  }

  // Utility method to download the blob
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }


}