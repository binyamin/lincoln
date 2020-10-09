/**
 *
 * @param {String} srcUrl
 */
export function checkStatus(srcUrl: string): Promise<{
    code: any;
    msg: any;
    ok: boolean;
}>;
/**
 *
 * @param {String} referenceUrl
 */
export function crawlPage(referenceUrl: string): Promise<any[]>;
/**
 *
 * @param {String} baseurl
 */
export function getPages(baseurl: string): Promise<any>;
