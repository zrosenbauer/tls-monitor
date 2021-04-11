"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTLSInfo = exports.Protocol = void 0;
const https_1 = __importDefault(require("https"));
const _ = __importStar(require("lodash"));
var Protocol;
(function (Protocol) {
    Protocol["SSLv3"] = "SSLv3";
    Protocol["TLSv1"] = "TLSv1";
    Protocol["TLSv1dot1"] = "TLSv1.1";
    Protocol["TLSv1dot2"] = "TLSv1.2";
    Protocol["TLSv1dot3"] = "TLSv1.3";
})(Protocol = exports.Protocol || (exports.Protocol = {}));
function getHttpsInfo(url, options = {
    timeout: 0,
    port: 443,
    protocol: 'https:',
    detailed: false
}) {
    return new Promise((resolve, reject) => {
        const req = https_1.default.get({
            hostname: url,
            agent: false,
            rejectUnauthorized: false,
            ciphers: 'ALL',
            port: options.port,
            protocol: options.protocol
        }, (res) => {
            const certificate = res.socket.getPeerCertificate(options.detailed);
            const protocol = res.socket.getProtocol();
            if (_.isEmpty(certificate) || _.isNil(certificate)) {
                reject(new Error('The URL did not provide a certificate'));
            }
            else {
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
function transformCertInfo(sslCertInfo) {
    return {
        countryName: sslCertInfo.C,
        locality: sslCertInfo.L,
        stateOrProvince: sslCertInfo.ST,
        organization: sslCertInfo.O,
        commonName: sslCertInfo.CN
    };
}
function toDate(dateString) {
    return new Date(dateString);
}
async function getTLSInfo(url) {
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
exports.getTLSInfo = getTLSInfo;
//# sourceMappingURL=tls.js.map