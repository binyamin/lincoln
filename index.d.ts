export = run;
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
declare function run(srcUrl: string): Promise<{
    total: number;
    broken: broken_link[];
}>;
declare namespace run {
    export { broken_link };
}
type broken_link = {
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
