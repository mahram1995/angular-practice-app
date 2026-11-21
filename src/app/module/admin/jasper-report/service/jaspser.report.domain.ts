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
};

export class DatabaseConfig {
    id: number | null;
    dbName: string;
    url: string;
    username: string;
    password: string;
    driverClass: string;
}

export class JasperReportScheduler {
  id?: number;

  // Report
  reportFileName: string;
  reportFormat: string;
  reportParameters?: Record<string, any>;

  // Email
  emailAddressTo: string;
  emailAddressCc?: string;
  isSendEmailSeparately: boolean;
  emailSubject?: string;
  emailBody?: string;
  emailSignature?: string;

  // Schedule
  scheduleTime: string;
  scheduleFrequency: ScheduleFrequency;
  scheduleDate?: number;
  scheduleDay?: string;
  scheduleMonth?: number;
  scheduleWeekCycle?: number;

  // Validity
  startDate: string;
  endDate?: string;
  isActive: boolean;
}
export enum ScheduleFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  HALF_YEARLY = 'HALF_YEARLY',
  YEARLY = 'YEARLY'
}

export const SCHEDULE_FREQUENCY_OPTIONS = [
  { label: 'Daily', value: ScheduleFrequency.DAILY },
  { label: 'Weekly', value: ScheduleFrequency.WEEKLY },
  { label: 'Monthly', value: ScheduleFrequency.MONTHLY },
  { label: 'Quarterly', value: ScheduleFrequency.QUARTERLY },
  { label: 'Half Yearly', value: ScheduleFrequency.HALF_YEARLY },
  { label: 'Yearly', value: ScheduleFrequency.YEARLY }
];

export class JasperReportScheduleExecution {
    id: number;
    schedulerId: number;
    reportFileName: string;
    executionStartTime: string;
    executionEndTime: string;
    executionDurationMs: number;
    executionStatus: string;
    errorMessage: string;
    emailSent: boolean;
    emailSentTo: string;
    reportFormat: string;
}