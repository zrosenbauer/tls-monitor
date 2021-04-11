import { PeerCertificate, TLSSocket, Certificate } from 'tls';
import https from 'https';
import * as _ from 'lodash';

export enum Protocol {
  SSLv3 = 'SSLv3',
  TLSv1 = 'TLSv1',
  TLSv1dot1 = 'TLSv1.1',
  TLSv1dot2 = 'TLSv1.2',
  TLSv1dot3 = 'TLSv1.3',
}

interface HttpsInfoOption {
  timeout: number;
  port: number;
  protocol: string;
  detailed: boolean;
}

interface HttpsInfo {
  certificate: PeerCertificate;
  protocol: Protocol | null;
}

function getHttpsInfo (
  url: string,
  options: HttpsInfoOption = {
    timeout: 0,
    port: 443,
    protocol: 'https:',
    detailed: false
  }
): Promise<HttpsInfo> {
  return new Promise((resolve, reject) => {
    const req = https.get({
      hostname: url,
      agent: false,
      rejectUnauthorized: false,
      ciphers: 'ALL',
      port: options.port,
      protocol: options.protocol
    }, (res) => {
      const certificate = (res.socket as TLSSocket).getPeerCertificate(options.detailed);
      const protocol = (res.socket as TLSSocket).getProtocol() as Protocol;

      if (_.isEmpty(certificate) || _.isNil(certificate)) {
        reject(new Error('The URL did not provide a certificate'));
      } else {
        resolve({
          certificate,
          protocol
        });
      }
    });

    if (options.timeout) {
      req.setTimeout(options.timeout, function () {
        reject(new Error('Request timed out'));
        req.destroy();
      });
    }

    req.on('error', function (e) {
      reject(e);
    });

    req.end();
  });
}

interface SSLCertInfo {
  countryName?: string;
  locality?: string;
  stateOrProvince?: string;
  organization?: string;
  commonName: string;
}

function transformCertInfo (sslCertInfo: Certificate): SSLCertInfo {
  return {
    countryName: sslCertInfo.C,
    locality: sslCertInfo.L,
    stateOrProvince: sslCertInfo.ST,
    organization: sslCertInfo.O,
    commonName: sslCertInfo.CN
  };
}

function toDate (dateString: string): Date {
  return new Date(dateString);
}

// Public Interface
// ----------

export interface TLSInfo {
  issuer: SSLCertInfo;
  subject: SSLCertInfo;
  protocol: Protocol | null;
  validFrom: Date;
  validTo: Date;
}

export async function getTLSInfo (url: string): Promise<TLSInfo> {
  const result = await getHttpsInfo(url);
  const validFrom = toDate(result.certificate.valid_from);
  const validTo = toDate(result.certificate.valid_to);

  return {
    issuer: transformCertInfo(result.certificate.issuer),
    subject: transformCertInfo(result.certificate.subject),
    protocol: result.protocol,
    validFrom: validFrom,
    validTo: validTo
  };
}
