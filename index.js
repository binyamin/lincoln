const lib = require("./lib");

/**
 * @typedef BrokenLink
 * @property {String} url link which broke
 * @property {String} src page which contained the broken link
 * @property {Number} response_code HTTP code (1xx, 4xx, 5xx) or -1
 * @property {String} msg eg. Not found
 */

/**
 * Check a url for broken links
 * @param {String} srcUrl URL to check
 * @returns {Promise<{total: number, broken: BrokenLink[]}>}
 */
async function lincoln(srcUrl) {
    if(!srcUrl) throw new Error("URL not provided!");

    let broken = [],
    total = 0,
    pages = await lib.getPageList(srcUrl);

    try {
        for(const p of pages) {
            const pageData = await lib.checkPageLinks(p);
            total += pageData.total;
            broken = broken.concat(pageData.broken);
        }
    } catch (error) {
        throw error;
    }

    return { total, broken }
}

module.exports = lincoln;
