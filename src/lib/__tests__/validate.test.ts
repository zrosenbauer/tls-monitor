import { describe, it, expect } from 'vitest';

import { validate } from '../validate';
import { Protocol, TLSInfo } from '../tls';

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

const exampleInput = {
  expirationDays: 7,
  approvedProtocols: [Protocol.TLSv1dot2, Protocol.TLSv1dot3],
  tlsInfo: {
    validFrom: new Date(Date.now() - (ONE_DAY_MS * 300)),
    validTo: new Date(Date.now() + (ONE_DAY_MS * 30)),
    protocol: Protocol.TLSv1dot3
  } as TLSInfo
};

describe('validate', () => {
  it('returns errorMessage for non-approved Protocol', () => {
    expect(validate({
      ...exampleInput,
      tlsInfo: {
        ...exampleInput.tlsInfo,
        protocol: Protocol.TLSv1dot1
      }
    })).toEqual({
      expired: false,
      expiresSoon: false,
      protocolNotApproved: true,
      errorMessage: 'Issues found with certificate - Invalid protocol: TLSv1.1'
    });
  });

  it('returns errorMessage for missing Protocol', () => {
    expect(validate({
      ...exampleInput,
      tlsInfo: {
        ...exampleInput.tlsInfo,
        protocol: null
      }
    })).toEqual({
      expired: false,
      expiresSoon: false,
      protocolNotApproved: true,
      errorMessage: 'Issues found with certificate - Invalid protocol: unknown'
    });
  });

  it('returns errorMessage expired certificate', () => {
    expect(validate({
      ...exampleInput,
      tlsInfo: {
        ...exampleInput.tlsInfo,
        validTo: new Date(Date.now() - (ONE_DAY_MS * 3))
      }
    })).toEqual({
      expired: true,
      expiresSoon: false,
      protocolNotApproved: false,
      errorMessage: 'Issues found with certificate - Certificate has expired'
    });
  });

  it('returns errorMessage for soon to expire certificate', () => {
    expect(validate({
      ...exampleInput,
      expirationDays: 40
    })).toEqual({
      expired: false,
      expiresSoon: true,
      protocolNotApproved: false,
      errorMessage: 'Issues found with certificate - Certificate will expire in less than 40 days'
    });
  });

  it('returns multiple errorMessages if applicable', () => {
    expect(validate({
      ...exampleInput,
      expirationDays: 40,
      tlsInfo: {
        ...exampleInput.tlsInfo,
        protocol: null
      }
    })).toEqual({
      expired: false,
      expiresSoon: true,
      protocolNotApproved: true,
      errorMessage: 'Issues found with certificate - Invalid protocol: unknown, Certificate will expire in less than 40 days'
    });
  });
});
