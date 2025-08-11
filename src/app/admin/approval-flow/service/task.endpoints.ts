import { BASE_URL } from "../../../app.service/environment";
export const GET_TASKS = BASE_URL + 'admin/task/get-tasks';
export const GET_TASKS_INSTANCE_PAYLOAD = BASE_URL + 'admin/task/get-tasks-instance-payload/{taskId}';
export const VERIFY_OPERATION = BASE_URL + 'admin/task/verify-operation';
//export const VERIFY_OPERATION = BASE_URL + 'admin/task/verify-operation?taskId=34&actionName=APPROVE';