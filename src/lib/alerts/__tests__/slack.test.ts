import { describe, expect, it } from 'vitest';

import type { Protocol } from '../../tls';
import * as slack from '../slack';

const validTo = new Date().toISOString();
const validFrom = new Date().toISOString();

describe('buildMessage', () => {
  it('returns a built message', () => {
    expect(
      slack.buildMessage({
        domain: 'example.com',
        errorMessage: 'An error of some kind',
        validTo,
        validFrom,
        protocol: 'TLSv1.3' as Protocol
      })
    ).toEqual({
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
              text: `*Domain:*\n<example.com|example.com>`
            },
            {
              type: 'mrkdwn',
              text: `*Error:*\nAn error of some kind`
            }
          ]
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Valid To:*\n${validTo}`
            },
            {
              type: 'mrkdwn',
              text: `*Valid From:*\n${validFrom}`
            },
            {
              type: 'mrkdwn',
              text: `*Protocol:*\nTLSv1.3`
            }
          ]
        }
      ]
    });
  });
});
