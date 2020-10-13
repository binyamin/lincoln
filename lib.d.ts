/**
 *
 * @param {string} page
 */
export function checkPageLinks(page: string): Promise<{
    broken: {
        url: string;
        src: any;
        response_code: any;
        msg: any;
    }[];
    total: number;
}>;
/**
 *
 * @param {string} srcUrl
 */
export function getPageList(srcUrl: string): Promise<string[]>;
