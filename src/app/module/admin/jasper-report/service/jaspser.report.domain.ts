export class JasperReportAuditDomain {
  id: number | null;
  reportFileName: string;
  dataSource: string;
  reportName: string;
  reportFormat: string;
  status: string;
  reportData: any;
  error: string | null;
  parameter: string | null;
  entryUser: string;
  entryDate: Date | string | null;
  startTime: Date | string | null;
  endTime: Date | string | null;
  durationInms: number;
  terminal: string;
  userClient: string;
}