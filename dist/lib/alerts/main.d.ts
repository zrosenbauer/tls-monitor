import { AlertInput } from './types';
export type AlertMethod = 'slack';
export declare function send(alertMethod: AlertMethod, alertToken: string, alertInput: AlertInput): Promise<void>;
