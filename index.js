const url = require("url");
const lib = require("./lib");
require('draftlog').into(console)

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
 * @returns {{total: Number, broken: broken_link[]}}
 */
async function run(srcUrl) {
    if(!srcUrl) throw new Error("URL not provided!")

    let broken = [],
    total = 0,
    pages = [];

    pages = await lib.getPages(url.resolve(srcUrl, "sitemap.xml"))

    if(pages.length === 0) {
        pages = await lib.getPages(srcUrl);
    }
    console.log(`Checking ${pages.length} page(s)`);


    for(const p of pages) {
        let draft = console.draft();
        draft(`- ${p}`)

        let pageBroken = [];

        const links = await lib.crawlPage(p);


        for(let i = 0; i < links.length; i++) {
            const l = links[i];
            draft(`- ${p} ${".".repeat(i+1)}`);

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

        draft(`- ${p} (${pageBroken.length}/${links.length})`)

        broken = broken.concat(pageBroken);
        total += links.length;

        for(const b of pageBroken) {
            console.log(`  - ${b.url} (${b.response_code})`)
        }
    }

    console.log(`${broken.length} broken out of ${total}`);
    return { total, broken }
}

module.exports = run;
