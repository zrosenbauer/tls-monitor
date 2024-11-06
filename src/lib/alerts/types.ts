import type { Protocol } from '../tls';

export interface AlertInput {
  domain: string;
  validTo: string;
  validFrom: string;
  protocol: Protocol;
  errorMessage: string;
}
