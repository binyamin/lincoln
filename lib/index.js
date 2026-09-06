import { parseStringPromise } from 'xml2js';
import { JSDOM } from 'jsdom';

import * as util from './util.js';

/**
 *
 * @param {String} baseUrl
 * @returns {Promise<string[]>}
 */

async function getPages(baseUrl) {
	const res = await fetch(baseUrl);
	if (res.status === 404) return [];

	const data = await res.text();
	const parsedXml = await parseStringPromise(data);
	const pages = parsedXml.urlset.url.map(e => e.loc[0]);

	return pages;
}

/**
 *
 * @param {String} referenceUrl
 * @returns {Promise<string[]>}
 */
async function crawlPage(referenceUrl) {
	const res = await fetch(referenceUrl);
	const html = await res.text();

	const dom = new JSDOM(html);

	const outboundLinks = (
		[...dom.window.document.querySelectorAll('a[href]')]
			.filter(a => util.ignoredProtocols.filter(i => a.href.startsWith(i)).length === 0)
			.map(a => util.resolveRelativeUrl(a.href, referenceUrl))
	)
	return outboundLinks;
}

/**
 *
 * @param {String} srcUrl
 */
async function checkStatus(srcUrl) {
	try {
		const res = await fetch(srcUrl);

		if (res.ok) {
			return {
				code: res.status,
				msg: res.statusText,
				ok: true
			}
		} else {
			return {
				code: res.status,
				msg: res.statusText,
				ok: false
			}
		}
	} catch (e) {
		return {
			code: -1,
			msg: e.message ?? e,
			ok: false,
		}
	}
}

/**
 *
 * @param {string} srcUrl
 */
export async function getPageList(srcUrl) {
	srcUrl = util.prefixUrl(srcUrl);

	let pages;

	try {
		pages = await getPages(new URL('sitemap.xml', srcUrl));
	} catch (error) {
		throw error;
	}

	if (!pages.length) {
		pages = [srcUrl];
	}

	return pages;
}

/**
 *
 * @param {string} page
 */
export async function checkPageLinks(page) {
	try {
		let pageBroken = [];

		const links = await crawlPage(page);

		for (let i = 0; i < links.length; i++) {
			const l = links[i];

			const response = await checkStatus(l);

			if (response.ok === false) {
				pageBroken.push({
					url: l,
					src: new URL(page).pathname,
					response_code: response.code,
					msg: response.msg
				})
			}
		}

		return {
			broken: pageBroken,
			total: links.length
		}
	} catch (error) {
		throw new Error(error);
	}
}
