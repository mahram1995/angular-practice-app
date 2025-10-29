import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class JasperService {
  constructor(private http: HttpClient) {}

  private authHeader(username: string, password: string) {
    const token = btoa(`${username}:${password}`);
    return { Authorization: `Basic ${token}` };
  }

  async createReportExecution(serverUrl: string, username: string, password: string, reportUnitUri: string, outputFormat: string, dataSource: any, parameters: any) {
    //const url = this.normalize(serverUrl) + '/jasperserver/rest_v2/reportExecutions';
    const url = this.normalize(serverUrl || '') + '/jasperserver/rest_v2/reportExecutions';

    const body: any = { reportUnitUri, outputFormat };

    if (dataSource) body.dataSource = dataSource;

    if (parameters && Object.keys(parameters).length) {
      body.parameters = { reportParameter: [] };
      for (const k of Object.keys(parameters)) {
        body.parameters.reportParameter.push({ name: k, value: parameters[k] });
      }
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...this.authHeader(username, password),
    });

    const res: any = await this.http.post(url, body, { headers }).toPromise();
    return res;
  }

  async waitForExport(serverUrl: string, username: string, password: string, requestId: string, timeoutMs = 120000) {
    const start = Date.now();
    const headers = new HttpHeaders(this.authHeader(username, password));
    const base = this.normalize(serverUrl) + `/jasperserver/rest_v2/reportExecutions/${requestId}/exports`;

    while (true) {
      const res: any = await this.http.get(base, { headers }).toPromise();
      if (Array.isArray(res) && res.length) {
        return res[0];
      }
      if (Date.now() - start > timeoutMs) throw new Error('Export timed out');
      await this.delay(1000);
    }
  }

  async downloadExport(serverUrl: string, username: string, password: string, requestId: string, exportId: string) {
    const url = this.normalize(serverUrl) +
      `/jasperserver/rest_v2/reportExecutions/${requestId}/exports/${exportId}/outputResource`;

    const headers = new HttpHeaders(this.authHeader(username, password));
    const blob = await this.http.get(url, { headers, responseType: 'blob' as 'json' }).toPromise();
    return blob as Blob;
  }

  normalize(url: string) {
    return url.replace(/\/+$/, '');
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
