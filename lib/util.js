// Utility functions

/**
 * Add 'https://' to url, if necessary
 * @param {string} baseUrl
 */

function prefixUrl(baseUrl) {
	if ((/^https?:\/\//).test(baseUrl) === false)
		baseUrl = 'https://' + baseUrl;
	return baseUrl;
}

/**
 * Resolves a target URL relative to a base URL in a manner similar to that of a web browser resolving an anchor tag.
 * @param {string|URL} from
 * @param {string|URL} to
 * @returns string
 */
function resolveURL(from, to) {
	const resolvedUrl = new URL(to, new URL(from, 'resolve://'));
	if (resolvedUrl.protocol === 'resolve:') {
		// `from` is a relative URL.
		const { pathname, search, hash } = resolvedUrl;
		return pathname + search + hash;
	}
	return resolvedUrl.toString();
}

/**
 * resolve relative urls, if necessary
 * @param {string} srcUrl
 * @param {string} baseUrl
 */
function resolveRelativeUrl(srcUrl, baseUrl) {
	if ((/^https?:\/\//).test(srcUrl))
		srcUrl = resolveURL(baseUrl, srcUrl);
	return srcUrl;
}

const ignoredProtocols = [
	// Source: https://github.com/deptagency/octopus/blob/master/lib/app.js
	'javascript:',
	'mailto:',
	'telnet:',
	'file:',
	'news:',
	'tel:',
	'ftp:',
	'#',
	'about:'
];

module.exports = {
	resolveRelativeUrl,
	prefixUrl,
	ignoredProtocols
}
