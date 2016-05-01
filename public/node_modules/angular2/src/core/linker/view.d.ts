import { Injector } from 'angular2/src/core/di';
import { AppElement } from './element';
import { Renderer, RenderComponentType } from 'angular2/src/core/render/api';
import { ViewRef_ } from './view_ref';
import { ViewType } from './view_type';
import { ViewUtils } from './view_utils';
import { ChangeDetectorRef, ChangeDetectionStrategy, ChangeDetectorState } from 'angular2/src/core/change_detection/change_detection';
import { StaticNodeDebugInfo, DebugContext } from './debug_context';
/**
 * Cost of making objects: http://jsperf.com/instantiate-size-of-object
 *
 */
export declare abstract class AppView<T> {
    clazz: any;
    componentType: RenderComponentType;
    type: ViewType;
    locals: {
        [key: string]: any;
    };
    viewUtils: ViewUtils;
    parentInjector: Injector;
    declarationAppElement: AppElement;
    cdMode: ChangeDetectionStrategy;
    staticNodeDebugInfos: StaticNodeDebugInfo[];
    ref: ViewRef_;
    rootNodesOrAppElements: any[];
    allNodes: any[];
    disposables: Function[];
    subscriptions: any[];
    contentChildren: AppView<any>[];
    viewChildren: AppView<any>[];
    renderParent: AppView<any>;
    viewContainerElement: AppElement;
    cdState: ChangeDetectorState;
    /**
     * The context against which data-binding expressions in this view are evaluated against.
     * This is always a component instance.
     */
    context: T;
    projectableNodes: Array<any | any[]>;
    destroyed: boolean;
    renderer: Renderer;
    private _currentDebugContext;
    private _hasExternalHostElement;
    constructor(clazz: any, componentType: RenderComponentType, type: ViewType, locals: {
        [key: string]: any;
    }, viewUtils: ViewUtils, parentInjector: Injector, declarationAppElement: AppElement, cdMode: ChangeDetectionStrategy, staticNodeDebugInfos: StaticNodeDebugInfo[]);
    create(givenProjectableNodes: Array<any | any[]>, rootSelectorOrNode: string | any): AppElement;
    /**
     * Overwritten by implementations.
     * Returns the AppElement for the host element for ViewType.HOST.
     */
    createInternal(rootSelectorOrNode: string | any): AppElement;
    init(rootNodesOrAppElements: any[], allNodes: any[], disposables: Function[], subscriptions: any[]): void;
    selectOrCreateHostElement(elementName: string, rootSelectorOrNode: string | any, debugCtx: DebugContext): any;
    injectorGet(token: any, nodeIndex: number, notFoundResult: any): any;
    /**
     * Overwritten by implementations
     */
    injectorGetInternal(token: any, nodeIndex: number, notFoundResult: any): any;
    injector(nodeIndex: number): Injector;
    destroy(): void;
    private _destroyRecurse();
    private _destroyLocal();
    /**
     * Overwritten by implementations
     */
    destroyInternal(): void;
    debugMode: boolean;
    changeDetectorRef: ChangeDetectorRef;
    parent: AppView<any>;
    flatRootNodes: any[];
    lastRootNode: any;
    hasLocal(contextName: string): boolean;
    setLocal(contextName: string, value: any): void;
    /**
     * Overwritten by implementations
     */
    dirtyParentQueriesInternal(): void;
    addRenderContentChild(view: AppView<any>): void;
    removeContentChild(view: AppView<any>): void;
    detectChanges(throwOnChange: boolean): void;
    /**
     * Overwritten by implementations
     */
    detectChangesInternal(throwOnChange: boolean): void;
    detectContentChildrenChanges(throwOnChange: boolean): void;
    detectViewChildrenChanges(throwOnChange: boolean): void;
    addToContentChildren(renderAppElement: AppElement): void;
    removeFromContentChildren(renderAppElement: AppElement): void;
    markAsCheckOnce(): void;
    markPathToRootAsCheckOnce(): void;
    private _resetDebug();
    debug(nodeIndex: number, rowNum: number, colNum: number): DebugContext;
    private _rethrowWithContext(e, stack);
    eventHandler(cb: Function): Function;
    throwDestroyedError(details: string): void;
}
