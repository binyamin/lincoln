export = lincoln;
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
declare function lincoln(srcUrl: string): Promise<{
    total: number;
    broken: BrokenLink[];
}>;
declare namespace lincoln {
    export { BrokenLink };
}
type BrokenLink = {
    /**
     * link which broke
     */
    url: string;
    /**
     * page which contained the broken link
     */
    src: string;
    /**
     * HTTP code (1xx, 4xx, 5xx) or -1
     */
    response_code: number;
    /**
     * eg. Not found
     */
    msg: string;
};
