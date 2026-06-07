// database-config.model.ts
export interface DatabaseConfig {
    host: string;
    port: string;
    serviceName: string; // or databaseName for Oracle
    username: string;
    password: string;
    schema: string;
}

export interface ReportRequest {
    dbConfig: DatabaseConfig;
    reportParameters?: { [key: string]: any };
}