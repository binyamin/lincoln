#! /usr/bin/env node

import { parseArgs } from 'node:util';
import ora from 'ora';

import * as lib from './lib/index.js';
import pkg from './package.json' with { type: 'json' };

const args = parseArgs({
	allowPositionals: true,
	options: {
		version: {
			type: 'boolean',
			short: 'v',
		},
		help: {
			type: 'boolean',
			short: 'h',
		},
		allow: {
			type: 'string',
			short: 'a',
		}
	}
});

async function run(srcUrl, limit) {
	try {
		let broken = [],
			total = 0,
			pages = await lib.getPageList(srcUrl);

		console.log(`Checking ${pages.length} page(s) on ${srcUrl}`);
		const spinner = ora().start();

		for (const p of pages) {
			// Set spinner
			spinner.text = new URL(p).pathname;
			spinner.color = ['cyan', 'magenta', 'green', 'yellow'][pages.findIndex(i => i === p) % 4];

			const pageData = await lib.checkPageLinks(p);
			total += pageData.total;
			broken = broken.concat(pageData.broken);
		}

		spinner.text = 'All done!';

		if (broken.length > limit) {
			spinner.fail();
		} else {
			spinner.succeed();
		}
		return { broken, total }
	} catch (error) {
		throw error;
	}
}

if (args.values.version) {
	console.log(`v${pkg.version} (${pkg.license})`)
} else if (args.values.help || args.positionals.length === 0) {
	console.log(`Usage: lincoln <url> - Checks the given url for broken links
    -a,--allow=<n> - Pass with under n broken links`);
} else {
	// TODO: validate that "-a, --allow" is an integer
	const lim = parseInt(args.values.allow ?? '0') || 0;

	run(args.positionals[0], lim)
		.then(res => {
			if (res.broken.length > lim) {

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
