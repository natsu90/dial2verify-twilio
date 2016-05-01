import { ComponentResolver } from 'angular2/core';
import { RouterOutlet } from './directives/router_outlet';
import { Type } from 'angular2/src/facade/lang';
import { RouterUrlParser } from './router_url_parser';
export declare class RouterOutletMap {
    registerOutlet(name: string, outlet: RouterOutlet): void;
}
export declare class Router {
    private _componentType;
    private _componentResolver;
    private _urlParser;
    private _routerOutletMap;
    private prevTree;
    constructor(_componentType: Type, _componentResolver: ComponentResolver, _urlParser: RouterUrlParser, _routerOutletMap: RouterOutletMap);
    navigateByUrl(url: string): Promise<void>;
}
