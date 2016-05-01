import { ComponentFactory } from 'angular2/core';
import { Type } from 'angular2/src/facade/lang';
export declare class Tree<T> {
    private _nodes;
    constructor(_nodes: T[]);
    root: T;
    parent(t: T): T;
    children(t: T): T[];
    firstChild(t: T): T;
    pathToRoot(t: T): T[];
}
export declare class UrlSegment {
    segment: string;
    parameters: {
        [key: string]: string;
    };
    outlet: string;
    constructor(segment: string, parameters: {
        [key: string]: string;
    }, outlet: string);
}
export declare class RouteSegment {
    urlSegments: UrlSegment[];
    outlet: string;
    constructor(urlSegments: UrlSegment[], parameters: {
        [key: string]: string;
    }, outlet: string, type: Type, componentFactory: ComponentFactory);
    getParam(param: string): string;
    type: Type;
}
export declare function equalSegments(a: RouteSegment, b: RouteSegment): boolean;
export declare function routeSegmentComponentFactory(a: RouteSegment): ComponentFactory;
