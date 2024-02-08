import * as tls from '../tls';

describe('getTLSInfo', () => {
  it('returns proper data for an SSL certificate', async () => {
    const result = await tls.getTLSInfo('example.com');

    // The issuer and subject MAY change. If so re-run test in debug mode and update
    expect(result).toEqual({
      issuer: {
        countryName: 'US',
        locality: undefined,
        organization: 'DigiCert Inc',
        stateOrProvince: undefined,
        commonName: 'DigiCert Global G2 TLS RSA SHA256 2020 CA1'
      },
      subject: {
        countryName: 'US',
        locality: 'Los Angeles',
        stateOrProvince: 'California',
        organization: 'Internet Corporation for Assigned Names and Numbers',
        commonName: 'www.example.org'
      },
      protocol: 'TLSv1.3',
      validFrom: expect.any(Date),
      validTo: expect.any(Date),
    });

    expect(result.validFrom.getTime()).toBeLessThan(Date.now());
    expect(result.validTo.getTime()).toBeGreaterThan(Date.now());
  });
});
