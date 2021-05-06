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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const alerts = __importStar(require("./lib/alerts/main"));
const validate_1 = require("./lib/validate");
const tls = __importStar(require("./lib/tls"));
function getApprovedProtocols(approvedProtocols) {
    return approvedProtocols.split(',');
}
async function run() {
    const domain = core.getInput('domain');
    const expirationDays = core.getInput('expiration_days');
    const approvedProtocols = core.getInput('approved_protocols');
    const alertMethod = core.getInput('alert_method');
    const alertToken = core.getInput('alert_token');
    const isAlertEnabled = !!alertMethod;
    let errorMessage = '';
    let result;
    try {
        result = await tls.getTLSInfo(domain);
    }
    catch (err) {
        errorMessage = err.message || `Unable to get TLS Info for domain ${domain}`;
    }
    if (isAlertEnabled) {
        if (result) {
            const validationResults = validate_1.validate({
                expirationDays: Number(expirationDays),
                approvedProtocols: getApprovedProtocols(approvedProtocols),
                tlsInfo: result
            });
            if (validationResults.errorMessage) {
                errorMessage = validationResults.errorMessage;
            }
        }
        if (errorMessage) {
            await alerts.send(alertMethod, alertToken, {
                domain,
                validTo: (result === null || result === void 0 ? void 0 : result.validTo.toISOString()) || 'unknown',
                validFrom: (result === null || result === void 0 ? void 0 : result.validFrom.toISOString()) || 'unknown',
                protocol: (result === null || result === void 0 ? void 0 : result.protocol) || 'unknown',
                errorMessage
            });
        }
    }
    core.setOutput('protocol', (result === null || result === void 0 ? void 0 : result.protocol) || 'unknown');
    core.setOutput('valid_to', (result === null || result === void 0 ? void 0 : result.validTo) || 'unknown');
    core.setOutput('valid_from', (result === null || result === void 0 ? void 0 : result.validFrom) || 'unknown');
    core.setOutput('error_message', errorMessage);
}
run();
//# sourceMappingURL=main.js.map