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
 * @param {String} baseUrl
 */
export function getPages(baseUrl: string): Promise<any>;
