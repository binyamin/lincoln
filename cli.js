#! /usr/bin/env node

const argv = require("minimist")(process.argv.slice(2));
const ora = require("ora");
const url = require("url");

const lib = require("./lib");
const pkg = require("./package.json");

async function run(srcUrl, limit) {
    try {
        let broken = [],
        total = 0,
        pages = await lib.getPageList(srcUrl);

        console.log(`Checking ${pages.length} page(s) on ${srcUrl}`);
        const spinner = ora().start();

        for(const p of pages) {
            // Set spinner
            spinner.text = url.parse(p).pathname;
            spinner.color = ["cyan", "magenta", "green", "yellow"][pages.findIndex(i => i === p) % 4];

            const pageData = await lib.checkPageLinks(p);
            total += pageData.total;
            broken = broken.concat(pageData.broken);
        }

        spinner.text = "All done!";

        if(broken.length > limit) {
            spinner.fail();
        } else {
            spinner.succeed();
        }
        return {broken, total}
    } catch (error) {
        throw error;
    }
}

if (argv["v"] || argv["version"] ) {
    console.log(`v${pkg.version} (${pkg.license})`)
} else if(argv["h"] || argv["help"] || !argv._[0]) {
    console.log(`Usage: lincoln <url> - Checks the given url for broken links
    -a,--allow=<n> - Pass with under n broken links`);
} else {
    let lim = 0;

    if(typeof argv["allow"] === "number") {
        lim = argv["allow"];
    }

    if(typeof argv["a"] === "number") {
        lim = argv["a"];
    }

    run(argv._[0], lim)
        .then(res => {
            if(res.broken.length > lim) {

                res.broken.forEach(l => {
                    console.log(`- [${l.response_code}] ${l.url} (${l.src})`);
                })

                throw new Error(`${res.broken.length} of ${res.total} links broken`);
            } else {
                console.log(`${res.broken.length} of ${res.total} links broken`)
            }
        })
        .catch(e => {
            console.error(e);
            process.exit(1);
        })
}
