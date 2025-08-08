// approval-flow.token.ts
import { InjectionToken } from '@angular/core';
import { ApprovalflowServiceInterface } from './approval.flow.service.Interface';

export const APPROVAL_FLOW_SERVICE = new InjectionToken<ApprovalflowServiceInterface>('APPROVAL_FLOW_SERVICE');
