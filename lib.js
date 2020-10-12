const axios = require("axios").default;
const {parseStringPromise} = require("xml2js");
const url = require("url");
const {JSDOM} = require("jsdom");

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

function prefixRelativeUrls(srcUrl, baseUrl) {
    if(srcUrl.startsWith("/"))
        srcUrl = url.resolve(baseUrl, srcUrl);
    return srcUrl;
}

/**
 *
 * @param {String} baseUrl
 */
async function getPages(baseUrl) {
    try {
        const res = await axios.get(baseUrl);

        const parsedXml = await parseStringPromise(res.data);
        const pages = parsedXml.urlset.url.map(e => e.loc[0]);

        return pages;

    } catch (error) {
        if(error.response && error.response.status === 404) return [];
        throw error;
    }
}

/**
 *
 * @param {String} referenceUrl
 */
async function crawlPage(referenceUrl) {
    const {data: html} = await axios.get(referenceUrl);

    const dom = new JSDOM(html);

    const outboundLinks = (
        [...dom.window.document.querySelectorAll("a[href]")]
            .filter(a => ignoredProtocols.filter(i => a.href.startsWith(i)).length === 0)
            .map(a => prefixRelativeUrls(a.href, referenceUrl))
    );
    return outboundLinks;
}

/**
 *
 * @param {String} srcUrl
 */
async function checkStatus(srcUrl) {
    try {
        const res = await axios.get(srcUrl);

        return {
            code: res.status,
            msg: res.statusText,
            ok: true
        }
    } catch (error) {
        return {
            code: error.response ? error.response.status : -1,
            msg: error.response ? error.response.statusText : error.message,
            ok: false
        }
    }
}

module.exports = {
    checkStatus,
    crawlPage,
    getPages
}
