import { UrlSegment, Tree } from './segments';
import { BaseException } from 'angular2/src/facade/exceptions';
export class RouterUrlParser {
}
export class DefaultRouterUrlParser extends RouterUrlParser {
    parse(url) {
        if (url.length === 0) {
            throw new BaseException(`Invalid url '${url}'`);
        }
        return new Tree(this._parseNodes(url));
    }
    _parseNodes(url) {
        let index = url.indexOf("/", 1);
        let children;
        let currentUrl;
        if (index > -1) {
            children = this._parseNodes(url.substring(index + 1));
            currentUrl = url.substring(0, index);
        }
        else {
            children = [];
            currentUrl = url;
        }
        return [new UrlSegment(currentUrl, {}, "")].concat(children);
    }
}
