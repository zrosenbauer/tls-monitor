import { AlertInput } from './types';
export declare type AlertMethod = 'slack';
export declare function send(alertMethod: AlertMethod, alertToken: string, alertInput: AlertInput): Promise<void>;
