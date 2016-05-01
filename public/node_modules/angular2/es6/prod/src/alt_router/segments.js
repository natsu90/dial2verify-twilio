import { StringMapWrapper } from 'angular2/src/facade/collection';
import { isBlank } from 'angular2/src/facade/lang';
export class Tree {
    constructor(_nodes) {
        this._nodes = _nodes;
    }
    get root() { return this._nodes[0]; }
    parent(t) {
        let index = this._nodes.indexOf(t);
        return index > 0 ? this._nodes[index - 1] : null;
    }
    children(t) {
        let index = this._nodes.indexOf(t);
        return index > -1 && index < this._nodes.length - 1 ? [this._nodes[index + 1]] : [];
    }
    firstChild(t) {
        let index = this._nodes.indexOf(t);
        return index > -1 && index < this._nodes.length - 1 ? this._nodes[index + 1] : null;
    }
    pathToRoot(t) {
        let index = this._nodes.indexOf(t);
        return index > -1 ? this._nodes.slice(0, index + 1) : null;
    }
}
export class UrlSegment {
    constructor(segment, parameters, outlet) {
        this.segment = segment;
        this.parameters = parameters;
        this.outlet = outlet;
    }
}
export class RouteSegment {
    constructor(urlSegments, parameters, outlet, type, componentFactory) {
        this.urlSegments = urlSegments;
        this.outlet = outlet;
        this._type = type;
        this._componentFactory = componentFactory;
        this._parameters = parameters;
    }
    getParam(param) { return this._parameters[param]; }
    get type() { return this._type; }
}
export function equalSegments(a, b) {
    if (isBlank(a) && !isBlank(b))
        return false;
    if (!isBlank(a) && isBlank(b))
        return false;
    return a._type === b._type && StringMapWrapper.equals(a._parameters, b._parameters);
}
export function routeSegmentComponentFactory(a) {
    return a._componentFactory;
}
