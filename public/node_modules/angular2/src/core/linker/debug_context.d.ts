import { Injector } from 'angular2/src/core/di';
import { RenderDebugInfo } from 'angular2/src/core/render/api';
import { AppView } from './view';
export declare class StaticNodeDebugInfo {
    providerTokens: any[];
    componentToken: any;
    varTokens: {
        [key: string]: any;
    };
    constructor(providerTokens: any[], componentToken: any, varTokens: {
        [key: string]: any;
    });
}
export declare class DebugContext implements RenderDebugInfo {
    private _view;
    private _nodeIndex;
    private _tplRow;
    private _tplCol;
    constructor(_view: AppView<any>, _nodeIndex: number, _tplRow: number, _tplCol: number);
    private _staticNodeInfo;
    context: any;
    component: any;
    componentRenderElement: any;
    injector: Injector;
    renderNode: any;
    providerTokens: any[];
    source: string;
    locals: {
        [key: string]: string;
    };
}
