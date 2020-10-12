#! /usr/bin/env node

const argv = require("minimist")(process.argv.slice(2));
const pkg = require("./package.json");

const lincoln = require("./index");

if (argv["v"] || argv["version"] ) {
    console.log(`v${pkg.version} (${pkg.license})`)
} else if(argv["h"] || argv["help"] || !argv._[0]) {
    console.log(`Usage: ${pkg.name} <url> - Checks the given url for broken links`);
} else {
    lincoln(argv._[0])
        .then(res => {
            if(res.broken.length > 0) {
                throw "Broken links found!"
            }
        })
        .catch(e => {
            console.error(new Error(e));
            process.exit(1);
        })
}
