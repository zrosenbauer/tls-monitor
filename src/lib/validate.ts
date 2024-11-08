import type { Protocol, TLSInfo } from './tls';

interface ValidationInput {
  expirationDays: number;
  approvedProtocols: Protocol[];
  tlsInfo: TLSInfo;
}

interface ValidationResult {
  expired: boolean;
  expiresSoon: boolean;
  protocolNotApproved: boolean;
  errorMessage: string | null;
}

export function getDaysBetweenDates(date1: Date, date2: Date): number {
  const difference = date1.getTime() - date2.getTime();
  return Math.ceil(difference / (1000 * 60 * 60 * 24));
}

export function validate(input: ValidationInput): ValidationResult {
  const errors: string[] = [];
  let protocolNotApproved = false;
  let expired = false;
  let expiresSoon = false;

  if (
    !input.tlsInfo.protocol ||
    !input.approvedProtocols.includes(input.tlsInfo.protocol)
  ) {
    errors.push(`Invalid protocol: ${input.tlsInfo.protocol || 'unknown'}`);
    protocolNotApproved = true;
  }

  if (input.tlsInfo.validTo.getTime() <= Date.now()) {
    errors.push('Certificate has expired');
    expired = true;
  }

  if (
    !expired &&
    getDaysBetweenDates(input.tlsInfo.validTo, new Date()) <=
      input.expirationDays
  ) {
    errors.push(
      `Certificate will expire in less than ${input.expirationDays} days`
    );
    expiresSoon = true;
  }

  return {
    expired,
    expiresSoon,
    protocolNotApproved,
    errorMessage: errors.length
      ? `Issues found with certificate - ${errors.join(', ')}`
      : null
  };
}
