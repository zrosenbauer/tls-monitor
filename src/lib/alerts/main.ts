import { AlertInput } from './types';
import * as slack from './slack';

export type AlertMethod = 'slack';

export async function send (alertMethod: AlertMethod, alertToken: string, alertInput: AlertInput): Promise<void> {
  if (alertMethod === 'slack') {
    await slack.send(alertToken, alertInput);
  } else {
    throw new Error(`Alert method, ${alertMethod} is not supported`);
  }
}
