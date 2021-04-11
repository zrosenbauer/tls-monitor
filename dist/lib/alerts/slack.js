"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = void 0;
const webhook_1 = require("@slack/webhook");
function buildMessage(input) {
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
async function send(webhookUrl, input) {
    const webhook = new webhook_1.IncomingWebhook(webhookUrl);
    await webhook.send(buildMessage(input));
}
exports.send = send;
//# sourceMappingURL=slack.js.map