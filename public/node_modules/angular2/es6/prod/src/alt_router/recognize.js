import { RouteSegment, Tree } from './segments';
import { RoutesMetadata } from './metadata/metadata';
import { isPresent, stringify } from 'angular2/src/facade/lang';
import { PromiseWrapper } from 'angular2/src/facade/promise';
import { BaseException } from 'angular2/src/facade/exceptions';
import { reflector } from 'angular2/src/core/reflection/reflection';
export function recognize(componentResolver, type, url) {
    return _recognize(componentResolver, type, url, url.root)
        .then(nodes => new Tree(nodes));
}
function _recognize(componentResolver, type, url, current) {
    let metadata = _readMetadata(type); // should read from the factory instead
    let matched;
    try {
        matched = _match(metadata, url, current);
    }
    catch (e) {
        return PromiseWrapper.reject(e, null);
    }
    return componentResolver.resolveComponent(matched.route.component)
        .then(factory => {
        let segment = new RouteSegment(matched.consumedUrlSegments, matched.parameters, "", matched.route.component, factory);
        if (isPresent(matched.leftOver)) {
            return _recognize(componentResolver, matched.route.component, url, matched.leftOver)
                .then(children => [segment].concat(children));
        }
        else {
            return [segment];
        }
    });
}
function _match(metadata, url, current) {
    for (let r of metadata.routes) {
        let matchingResult = _matchWithParts(r, url, current);
        if (isPresent(matchingResult)) {
            return matchingResult;
        }
    }
    throw new BaseException("Cannot match any routes");
}
function _matchWithParts(route, url, current) {
    let parts = route.path.split("/");
    let parameters = {};
    let consumedUrlSegments = [];
    let u = current;
    for (let i = 0; i < parts.length; ++i) {
        consumedUrlSegments.push(u);
        let p = parts[i];
        if (p.startsWith(":")) {
            let segment = u.segment;
            parameters[p.substring(1)] = segment;
        }
        else if (p != u.segment) {
            return null;
        }
        u = url.firstChild(u);
    }
    return new _MatchingResult(route, consumedUrlSegments, parameters, u);
}
class _MatchingResult {
    constructor(route, consumedUrlSegments, parameters, leftOver) {
        this.route = route;
        this.consumedUrlSegments = consumedUrlSegments;
        this.parameters = parameters;
        this.leftOver = leftOver;
    }
}
function _readMetadata(componentType) {
    let metadata = reflector.annotations(componentType).filter(f => f instanceof RoutesMetadata);
    if (metadata.length === 0) {
        throw new BaseException(`Component '${stringify(componentType)}' does not have route configuration`);
    }
    return metadata[0];
}
