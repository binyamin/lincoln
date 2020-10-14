// Utility functions

const url = require("url");

/**
 * Add "https://" to url, if necessary
 * @param {string} baseUrl
 */

function prefixUrl(baseUrl) {
    if((/^https?:\/\//).test(baseUrl) === false)
        baseUrl = "https://" + baseUrl;
    return baseUrl;
}

/**
 * resolve relative urls, if necessary
 * @param {string} srcUrl
 * @param {string} baseUrl
 */
function resolveRelativeUrl(srcUrl, baseUrl) {
    if((/^https?:\/\//).test(srcUrl))
        srcUrl = url.resolve(baseUrl, srcUrl);
    return srcUrl;
}

const ignoredProtocols = [
    // Source: https://github.com/deptagency/octopus/blob/master/lib/app.js
    "javascript:",
    "mailto:",
    "telnet:",
    "file:",
    "news:",
    "tel:",
    "ftp:",
    "#",
    "about:"
];

module.exports = {
    resolveRelativeUrl,
    prefixUrl,
    ignoredProtocols
}
