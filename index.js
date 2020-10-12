const url = require("url");
const lib = require("./lib");

function prefixUrl(baseUrl) {
    if((/^https?:\/\//).test(baseUrl) === false)
        baseUrl = "https://" + baseUrl;
    return baseUrl;
}

/**
 * @typedef broken_link
 * @property {String} url link which broke
 * @property {String} src page which contained the broken link
 * @property {Number} response_code HTTP code (1xx, 4xx, 5xx) or -1
 * @property {String} msg eg. Not found
 */
/**
 * Check a url for broken links
 * @param {String} srcUrl URL to check
 * @returns {Promise<{ total: Number, broken: broken_link[] }>}
 */
async function run(srcUrl) {
    try {
        if(!srcUrl) throw "URL not provided!"
        srcUrl = prefixUrl(srcUrl);

        let broken = [],
        total = 0,
        pages = [];

        pages = await lib.getPages(url.resolve(srcUrl, "sitemap.xml"))

        if(pages.length === 0) {
            pages = [ srcUrl ];
        }
        console.log(`Checking ${pages.length} page(s)`);


        for(const p of pages) {

            let pageBroken = [];

            const links = await lib.crawlPage(p);


            for(let i = 0; i < links.length; i++) {
                const l = links[i];

                const response = await lib.checkStatus(l);

                if(response.ok === false) {
                    pageBroken.push({
                        url: l,
                        src: p,
                        response_code: response.code,
                        msg: response.msg
                    })
                }
            }

            console.log(`${p} (${pageBroken.length}/${links.length})`)

            broken = broken.concat(pageBroken);
            total += links.length;

            for(const b of pageBroken) {
                console.log(`- ${b.url} (${b.response_code})`)
            }
        }

        console.log(`${broken.length} broken out of ${total}`);
        return { total, broken }
    } catch (error) {
        throw error;
    }
}

module.exports = run;
