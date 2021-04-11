export declare enum Protocol {
    SSLv3 = "SSLv3",
    TLSv1 = "TLSv1",
    TLSv1dot1 = "TLSv1.1",
    TLSv1dot2 = "TLSv1.2",
    TLSv1dot3 = "TLSv1.3"
}
interface SSLCertInfo {
    countryName?: string;
    locality?: string;
    stateOrProvince?: string;
    organization?: string;
    commonName: string;
}
export interface TLSInfo {
    issuer: SSLCertInfo;
    subject: SSLCertInfo;
    protocol: Protocol | null;
    validFrom: Date;
    validTo: Date;
}
export declare function getTLSInfo(url: string): Promise<TLSInfo>;
export {};
