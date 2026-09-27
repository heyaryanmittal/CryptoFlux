/**
 * Utility functions for formatting numbers, currency, percentages, and compact values.
 * Built following YAGNI principles for clean, maintainable usage across CryptoFlux.
 */

/**
 * Format a number as compact currency ($1.5B, $20M, $100K).
 * @param {number|null|undefined} num 
 * @returns {string}
 */
export const formatCompactNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return 'N/A';
    if (num >= 1e12) return '$' + (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
    return '$' + Number(num).toLocaleString();
};

/**
 * Format a number as full USD currency ($1,234.56).
 * @param {number|null|undefined} amount 
 * @param {number} minimumFractionDigits 
 * @param {number} maximumFractionDigits 
 * @returns {string}
 */
export const formatCurrency = (amount, minimumFractionDigits = 2, maximumFractionDigits = 2) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
    return '$' + Number(amount).toLocaleString(undefined, {
        minimumFractionDigits,
        maximumFractionDigits
    });
};

/**
 * Format 24h percentage change to 2 decimal places (+2.45% or 2.45%).
 * @param {number|null|undefined} percent 
 * @returns {string}
 */
export const formatPercentage = (percent) => {
    if (percent === null || percent === undefined || isNaN(percent)) return '0.00%';
    return `${Math.abs(percent).toFixed(2)}%`;
};
