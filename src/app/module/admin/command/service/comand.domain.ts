export class Command {
    commandCode: string;
    commandName: string;
    moduleName: string;
    activityName: string;
    isVisibleInUI: boolean;
    isApprovalFlowRequired: boolean;
    approvalFlowLayer: string;
    approvalFlowProfile: string;
    startExecutionTime: string;  // ISO date string from backend
    endExecutionTime: string;    // ISO date string from backend
}