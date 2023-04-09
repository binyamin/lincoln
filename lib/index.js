const url = require('node:url');

const axios = require('axios').default;
const { parseStringPromise } = require('xml2js');
const { JSDOM } = require('jsdom');

const util = require('./util');

/**
 *
 * @param {String} baseUrl
 * @returns {Promise<string[]>}
 */

async function getPages(baseUrl) {
	try {
		const res = await axios.get(baseUrl);
		const parsedXml = await parseStringPromise(res.data);
		const pages = parsedXml.urlset.url.map(e => e.loc[0]);

		return pages;

	} catch (error) {
		if (error.response && error.response.status === 404) return [];
		throw new Error(error.message);
	}
}

/**
 *
 * @param {String} referenceUrl
 * @returns {Promise<string[]>}
 */
async function crawlPage(referenceUrl) {
	const { data: html } = await axios.get(referenceUrl);

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

/**
 *
 * @param {string} srcUrl
 */
async function getPageList(srcUrl) {
	srcUrl = util.prefixUrl(srcUrl);

	let pages;

	try {
		pages = await getPages(url.resolve(srcUrl, 'sitemap.xml'))
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
async function checkPageLinks(page) {
	try {
		let pageBroken = [];

		const links = await crawlPage(page);

		for (let i = 0; i < links.length; i++) {
			const l = links[i];

			const response = await checkStatus(l);

			if (response.ok === false) {
				pageBroken.push({
					url: l,
					src: url.parse(page).pathname,
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
module.exports = {
	checkPageLinks,
	getPageList
}
