import { IncomingWebhookSendArguments } from '@slack/webhook';
import { AlertInput } from './types';
export declare function buildMessage(input: AlertInput): IncomingWebhookSendArguments;
export declare function send(webhookUrl: string, input: AlertInput): Promise<void>;
