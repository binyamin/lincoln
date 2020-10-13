const url = require("url");
const lib = require("./lib");
const ora = require("ora");

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
    if(!srcUrl) throw "URL not provided!"
    srcUrl = prefixUrl(srcUrl);

    let broken = [],
    total = 0,
    pages = [];

    try {
        pages = await lib.getPages(url.resolve(srcUrl, "sitemap.xml"))
    } catch (error) {
        throw error;
    }

    if(pages.length === 0) {
        pages = [ srcUrl ];
    }

    console.log(`Checking ${pages.length} page(s) on ${srcUrl}`);
    const spinner = ora().start();

    for(const p of pages) {
        let pageBroken = [];

        // Set spinner
        spinner.text = url.parse(p).pathname;
        spinner.color = ["cyan", "magenta", "green", "yellow"][pages.findIndex(i => i === p) % 4];

        try {
            const links = await lib.crawlPage(p);

            for(let i = 0; i < links.length; i++) {
                const l = links[i];

                const response = await lib.checkStatus(l);

                if(response.ok === false) {
                    pageBroken.push({
                        url: l,
                        src: url.parse(p).pathname,
                        response_code: response.code,
                        msg: response.msg
                    })
                }
            }

            broken = broken.concat(pageBroken);
            total += links.length;
        } catch (error) {
            throw new Error(error);
        }
    }

    spinner.text = "All done!";

    if(broken.length > 0) {
        spinner.fail();
    } else {
        spinner.succeed();
    }

    return { total, broken }
}

module.exports = run;
