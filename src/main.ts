import * as core from '@actions/core';

import * as alerts from './lib/alerts/main';
import { validate } from './lib/validate';
import * as tls from './lib/tls';

function getApprovedProtocols(approvedProtocols: string) {
  return approvedProtocols.split(',') as tls.Protocol[];
}

async function run() {
  const domain = core.getInput('domain');
  const expirationDays = core.getInput('expiration_days');
  const approvedProtocols = core.getInput('approved_protocols');
  const alertMethod = core.getInput('alert_method');
  const alertToken = core.getInput('alert_token');
  const isAlertEnabled = !!alertMethod;

  const result = await tls.getTLSInfo(domain);
  let errorMessage = '';

  if (isAlertEnabled) {
    const validationResults = validate({
      expirationDays: Number(expirationDays),
      approvedProtocols: getApprovedProtocols(approvedProtocols),
      tlsInfo: result
    });

    if (validationResults.errorMessage) {
      errorMessage = validationResults.errorMessage;
      await alerts.send(alertMethod as alerts.AlertMethod, alertToken, {
        domain,
        validTo: result.validTo.toISOString(),
        validFrom: result.validFrom.toISOString(),
        protocol: result.protocol as tls.Protocol,
        errorMessage
      });
    }
  }

  core.setOutput('protocol', result.protocol);
  core.setOutput('valid_to', result.validTo);
  core.setOutput('valid_from', result.validFrom);
  core.setOutput('error_message', errorMessage);
}

run();
