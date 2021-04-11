import { IncomingWebhook } from '@slack/webhook';

import { AlertInput } from './types';

function buildMessage (input: AlertInput) {
  return {
    icon_emoji: ':warning:',
    username: 'SSL/TLS Monitor',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'SSL/TLS Monitor Alert',
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Domain:*\n<${input.domain}|${input.domain}>`
          },
          {
            type: 'mrkdwn',
            text: `*Error:*\n${input.errorMessage}`
          }
        ]
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Valid To:*\n${input.validTo}`
          },
          {
            type: 'mrkdwn',
            text: `*Valid From:*\n${input.validFrom}`
          },
          {
            type: 'mrkdwn',
            text: `*Protocol:*\n${input.protocol}`
          }
        ]
      }
    ]
  };
}

export async function send (webhookUrl: string, input: AlertInput): Promise<void> {
  const webhook = new IncomingWebhook(webhookUrl);

  await webhook.send(
    buildMessage(input)
  );
}
