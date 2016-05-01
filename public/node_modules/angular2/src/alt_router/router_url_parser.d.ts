import { UrlSegment, Tree } from './segments';
export declare abstract class RouterUrlParser {
    abstract parse(url: string): Tree<UrlSegment>;
}
export declare class DefaultRouterUrlParser extends RouterUrlParser {
    parse(url: string): Tree<UrlSegment>;
    private _parseNodes(url);
}
