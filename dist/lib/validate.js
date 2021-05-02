"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.getDaysBetweenDates = void 0;
function getDaysBetweenDates(date1, date2) {
    const difference = date1.getTime() - date2.getTime();
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
}
exports.getDaysBetweenDates = getDaysBetweenDates;
function validate(input) {
    const errors = [];
    let protocolNotApproved = false;
    let expired = false;
    let expiresSoon = false;
    if (!input.tlsInfo.protocol || !input.approvedProtocols.includes(input.tlsInfo.protocol)) {
        errors.push(`Invalid protocol: ${input.tlsInfo.protocol || 'unknown'}`);
        protocolNotApproved = true;
    }
    if (input.tlsInfo.validTo.getTime() <= Date.now()) {
        errors.push('Certificate has expired');
        expired = true;
    }
    if (!expired && getDaysBetweenDates(input.tlsInfo.validTo, new Date()) <= input.expirationDays) {
        errors.push(`Certificate will expire in less than ${input.expirationDays} days`);
        expiresSoon = true;
    }
    return {
        expired,
        expiresSoon,
        protocolNotApproved,
        errorMessage: errors.length ? `Issues found with certificate - ${errors.join(', ')}` : null
    };
}
exports.validate = validate;
//# sourceMappingURL=validate.js.map