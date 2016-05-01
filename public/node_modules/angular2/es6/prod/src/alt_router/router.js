import { provide, ReflectiveInjector } from 'angular2/core';
import { isBlank, isPresent } from 'angular2/src/facade/lang';
import { recognize } from './recognize';
import { equalSegments, routeSegmentComponentFactory, RouteSegment } from './segments';
import { hasLifecycleHook } from './lifecycle_reflector';
export class RouterOutletMap {
    constructor() {
        /** @internal */
        this._outlets = {};
    }
    registerOutlet(name, outlet) { this._outlets[name] = outlet; }
}
export class Router {
    constructor(_componentType, _componentResolver, _urlParser, _routerOutletMap) {
        this._componentType = _componentType;
        this._componentResolver = _componentResolver;
        this._urlParser = _urlParser;
        this._routerOutletMap = _routerOutletMap;
    }
    navigateByUrl(url) {
        let urlSegmentTree = this._urlParser.parse(url.substring(1));
        return recognize(this._componentResolver, this._componentType, urlSegmentTree)
            .then(currTree => {
            let prevRoot = isPresent(this.prevTree) ? this.prevTree.root : null;
            _loadSegments(currTree, currTree.root, this.prevTree, prevRoot, this, this._routerOutletMap);
            this.prevTree = currTree;
        });
    }
}
function _loadSegments(currTree, curr, prevTree, prev, router, parentOutletMap) {
    let outlet = parentOutletMap._outlets[curr.outlet];
    let outletMap;
    if (equalSegments(curr, prev)) {
        outletMap = outlet.outletMap;
    }
    else {
        outletMap = new RouterOutletMap();
        let resolved = ReflectiveInjector.resolve([provide(RouterOutletMap, { useValue: outletMap }), provide(RouteSegment, { useValue: curr })]);
        let ref = outlet.load(routeSegmentComponentFactory(curr), resolved, outletMap);
        if (hasLifecycleHook("routerOnActivate", ref.instance)) {
            ref.instance.routerOnActivate(curr, prev, currTree, prevTree);
        }
    }
    if (isPresent(currTree.firstChild(curr))) {
        let cc = currTree.firstChild(curr);
        let pc = isBlank(prevTree) ? null : prevTree.firstChild(prev);
        _loadSegments(currTree, cc, prevTree, pc, router, outletMap);
    }
}
