import { ListWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { AppElement } from './element';
import { isPresent, CONST_EXPR } from 'angular2/src/facade/lang';
import { ObservableWrapper } from 'angular2/src/facade/async';
import { ViewRef_ } from './view_ref';
import { ViewType } from './view_type';
import { flattenNestedViewRenderNodes, ensureSlotCount } from './view_utils';
import { ChangeDetectionStrategy, ChangeDetectorState } from 'angular2/src/core/change_detection/change_detection';
import { wtfCreateScope, wtfLeave } from '../profile/profile';
import { ExpressionChangedAfterItHasBeenCheckedException, ViewDestroyedException, ViewWrappedException } from './exceptions';
import { DebugContext } from './debug_context';
import { ElementInjector } from './element_injector';
const EMPTY_CONTEXT = CONST_EXPR(new Object());
var _scope_check = wtfCreateScope(`AppView#check(ascii id)`);
/**
 * Cost of making objects: http://jsperf.com/instantiate-size-of-object
 *
 */
export class AppView {
    constructor(clazz, componentType, type, locals, viewUtils, parentInjector, declarationAppElement, cdMode, staticNodeDebugInfos) {
        this.clazz = clazz;
        this.componentType = componentType;
        this.type = type;
        this.locals = locals;
        this.viewUtils = viewUtils;
        this.parentInjector = parentInjector;
        this.declarationAppElement = declarationAppElement;
        this.cdMode = cdMode;
        this.staticNodeDebugInfos = staticNodeDebugInfos;
        this.contentChildren = [];
        this.viewChildren = [];
        this.viewContainerElement = null;
        // The names of the below fields must be kept in sync with codegen_name_util.ts or
        // change detection will fail.
        this.cdState = ChangeDetectorState.NeverChecked;
        /**
         * The context against which data-binding expressions in this view are evaluated against.
         * This is always a component instance.
         */
        this.context = null;
        this.destroyed = false;
        this._currentDebugContext = null;
        this.ref = new ViewRef_(this);
        if (type === ViewType.COMPONENT || type === ViewType.HOST) {
            this.renderer = viewUtils.renderComponent(componentType);
        }
        else {
            this.renderer = declarationAppElement.parentView.renderer;
        }
    }
    create(givenProjectableNodes, rootSelectorOrNode) {
        var context;
        var projectableNodes;
        switch (this.type) {
            case ViewType.COMPONENT:
                context = this.declarationAppElement.component;
                projectableNodes = ensureSlotCount(givenProjectableNodes, this.componentType.slotCount);
                break;
            case ViewType.EMBEDDED:
                context = this.declarationAppElement.parentView.context;
                projectableNodes = this.declarationAppElement.parentView.projectableNodes;
                break;
            case ViewType.HOST:
                context = EMPTY_CONTEXT;
                // Note: Don't ensure the slot count for the projectableNodes as we store
                // them only for the contained component view (which will later check the slot count...)
                projectableNodes = givenProjectableNodes;
                break;
        }
        this._hasExternalHostElement = isPresent(rootSelectorOrNode);
        this.context = context;
        this.projectableNodes = projectableNodes;
        if (this.debugMode) {
            this._resetDebug();
            try {
                return this.createInternal(rootSelectorOrNode);
            }
            catch (e) {
                this._rethrowWithContext(e, e.stack);
                throw e;
            }
        }
        else {
            return this.createInternal(rootSelectorOrNode);
        }
    }
    /**
     * Overwritten by implementations.
     * Returns the AppElement for the host element for ViewType.HOST.
     */
    createInternal(rootSelectorOrNode) { return null; }
    init(rootNodesOrAppElements, allNodes, disposables, subscriptions) {
        this.rootNodesOrAppElements = rootNodesOrAppElements;
        this.allNodes = allNodes;
        this.disposables = disposables;
        this.subscriptions = subscriptions;
        if (this.type === ViewType.COMPONENT) {
            // Note: the render nodes have been attached to their host element
            // in the ViewFactory already.
            this.declarationAppElement.parentView.viewChildren.push(this);
            this.renderParent = this.declarationAppElement.parentView;
            this.dirtyParentQueriesInternal();
        }
    }
    selectOrCreateHostElement(elementName, rootSelectorOrNode, debugCtx) {
        var hostElement;
        if (isPresent(rootSelectorOrNode)) {
            hostElement = this.renderer.selectRootElement(rootSelectorOrNode, debugCtx);
        }
        else {
            hostElement = this.renderer.createElement(null, elementName, debugCtx);
        }
        return hostElement;
    }
    injectorGet(token, nodeIndex, notFoundResult) {
        if (this.debugMode) {
            this._resetDebug();
            try {
                return this.injectorGetInternal(token, nodeIndex, notFoundResult);
            }
            catch (e) {
                this._rethrowWithContext(e, e.stack);
                throw e;
            }
        }
        else {
            return this.injectorGetInternal(token, nodeIndex, notFoundResult);
        }
    }
    /**
     * Overwritten by implementations
     */
    injectorGetInternal(token, nodeIndex, notFoundResult) {
        return notFoundResult;
    }
    injector(nodeIndex) {
        if (isPresent(nodeIndex)) {
            return new ElementInjector(this, nodeIndex);
        }
        else {
            return this.parentInjector;
        }
    }
    destroy() {
        if (this._hasExternalHostElement) {
            this.renderer.detachView(this.flatRootNodes);
        }
        else if (isPresent(this.viewContainerElement)) {
            this.viewContainerElement.detachView(this.viewContainerElement.nestedViews.indexOf(this));
        }
        this._destroyRecurse();
    }
    _destroyRecurse() {
        if (this.destroyed) {
            return;
        }
        var children = this.contentChildren;
        for (var i = 0; i < children.length; i++) {
            children[i]._destroyRecurse();
        }
        children = this.viewChildren;
        for (var i = 0; i < children.length; i++) {
            children[i]._destroyRecurse();
        }
        if (this.debugMode) {
            this._resetDebug();
            try {
                this._destroyLocal();
            }
            catch (e) {
                this._rethrowWithContext(e, e.stack);
                throw e;
            }
        }
        else {
            this._destroyLocal();
        }
        this.destroyed = true;
    }
    _destroyLocal() {
        var hostElement = this.type === ViewType.COMPONENT ? this.declarationAppElement.nativeElement : null;
        for (var i = 0; i < this.disposables.length; i++) {
            this.disposables[i]();
        }
        for (var i = 0; i < this.subscriptions.length; i++) {
            ObservableWrapper.dispose(this.subscriptions[i]);
        }
        this.destroyInternal();
        if (this._hasExternalHostElement) {
            this.renderer.detachView(this.flatRootNodes);
        }
        else if (isPresent(this.viewContainerElement)) {
            this.viewContainerElement.detachView(this.viewContainerElement.nestedViews.indexOf(this));
        }
        else {
            this.dirtyParentQueriesInternal();
        }
        this.renderer.destroyView(hostElement, this.allNodes);
    }
    /**
     * Overwritten by implementations
     */
    destroyInternal() { }
    get debugMode() { return isPresent(this.staticNodeDebugInfos); }
    get changeDetectorRef() { return this.ref; }
    get parent() {
        return isPresent(this.declarationAppElement) ? this.declarationAppElement.parentView : null;
    }
    get flatRootNodes() { return flattenNestedViewRenderNodes(this.rootNodesOrAppElements); }
    get lastRootNode() {
        var lastNode = this.rootNodesOrAppElements.length > 0 ?
            this.rootNodesOrAppElements[this.rootNodesOrAppElements.length - 1] :
            null;
        return _findLastRenderNode(lastNode);
    }
    hasLocal(contextName) {
        return StringMapWrapper.contains(this.locals, contextName);
    }
    setLocal(contextName, value) { this.locals[contextName] = value; }
    /**
     * Overwritten by implementations
     */
    dirtyParentQueriesInternal() { }
    addRenderContentChild(view) {
        this.contentChildren.push(view);
        view.renderParent = this;
        view.dirtyParentQueriesInternal();
    }
    removeContentChild(view) {
        ListWrapper.remove(this.contentChildren, view);
        view.dirtyParentQueriesInternal();
        view.renderParent = null;
    }
    detectChanges(throwOnChange) {
        var s = _scope_check(this.clazz);
        if (this.cdMode === ChangeDetectionStrategy.Detached ||
            this.cdMode === ChangeDetectionStrategy.Checked ||
            this.cdState === ChangeDetectorState.Errored)
            return;
        if (this.destroyed) {
            this.throwDestroyedError('detectChanges');
        }
        if (this.debugMode) {
            this._resetDebug();
            try {
                this.detectChangesInternal(throwOnChange);
            }
            catch (e) {
                this._rethrowWithContext(e, e.stack);
                throw e;
            }
        }
        else {
            this.detectChangesInternal(throwOnChange);
        }
        if (this.cdMode === ChangeDetectionStrategy.CheckOnce)
            this.cdMode = ChangeDetectionStrategy.Checked;
        this.cdState = ChangeDetectorState.CheckedBefore;
        wtfLeave(s);
    }
    /**
     * Overwritten by implementations
     */
    detectChangesInternal(throwOnChange) {
        this.detectContentChildrenChanges(throwOnChange);
        this.detectViewChildrenChanges(throwOnChange);
    }
    detectContentChildrenChanges(throwOnChange) {
        for (var i = 0; i < this.contentChildren.length; ++i) {
            this.contentChildren[i].detectChanges(throwOnChange);
        }
    }
    detectViewChildrenChanges(throwOnChange) {
        for (var i = 0; i < this.viewChildren.length; ++i) {
            this.viewChildren[i].detectChanges(throwOnChange);
        }
    }
    addToContentChildren(renderAppElement) {
        renderAppElement.parentView.contentChildren.push(this);
        this.viewContainerElement = renderAppElement;
        this.dirtyParentQueriesInternal();
    }
    removeFromContentChildren(renderAppElement) {
        ListWrapper.remove(renderAppElement.parentView.contentChildren, this);
        this.dirtyParentQueriesInternal();
        this.viewContainerElement = null;
    }
    markAsCheckOnce() { this.cdMode = ChangeDetectionStrategy.CheckOnce; }
    markPathToRootAsCheckOnce() {
        var c = this;
        while (isPresent(c) && c.cdMode !== ChangeDetectionStrategy.Detached) {
            if (c.cdMode === ChangeDetectionStrategy.Checked) {
                c.cdMode = ChangeDetectionStrategy.CheckOnce;
            }
            c = c.renderParent;
        }
    }
    _resetDebug() { this._currentDebugContext = null; }
    debug(nodeIndex, rowNum, colNum) {
        return this._currentDebugContext = new DebugContext(this, nodeIndex, rowNum, colNum);
    }
    _rethrowWithContext(e, stack) {
        if (!(e instanceof ViewWrappedException)) {
            if (!(e instanceof ExpressionChangedAfterItHasBeenCheckedException)) {
                this.cdState = ChangeDetectorState.Errored;
            }
            if (isPresent(this._currentDebugContext)) {
                throw new ViewWrappedException(e, stack, this._currentDebugContext);
            }
        }
    }
    eventHandler(cb) {
        if (this.debugMode) {
            return (event) => {
                this._resetDebug();
                try {
                    return cb(event);
                }
                catch (e) {
                    this._rethrowWithContext(e, e.stack);
                    throw e;
                }
            };
        }
        else {
            return cb;
        }
    }
    throwDestroyedError(details) { throw new ViewDestroyedException(details); }
}
function _findLastRenderNode(node) {
    var lastNode;
    if (node instanceof AppElement) {
        var appEl = node;
        lastNode = appEl.nativeElement;
        if (isPresent(appEl.nestedViews)) {
            // Note: Views might have no root nodes at all!
            for (var i = appEl.nestedViews.length - 1; i >= 0; i--) {
                var nestedView = appEl.nestedViews[i];
                if (nestedView.rootNodesOrAppElements.length > 0) {
                    lastNode = _findLastRenderNode(nestedView.rootNodesOrAppElements[nestedView.rootNodesOrAppElements.length - 1]);
                }
            }
        }
    }
    else {
        lastNode = node;
    }
    return lastNode;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUQxaUdRVkcudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci92aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQ0wsV0FBVyxFQUdYLGdCQUFnQixFQUdqQixNQUFNLGdDQUFnQztPQUdoQyxFQUFDLFVBQVUsRUFBQyxNQUFNLFdBQVc7T0FDN0IsRUFFTCxTQUFTLEVBTVQsVUFBVSxFQUlYLE1BQU0sMEJBQTBCO09BRTFCLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSwyQkFBMkI7T0FFcEQsRUFBQyxRQUFRLEVBQUMsTUFBTSxZQUFZO09BRTVCLEVBQUMsUUFBUSxFQUFDLE1BQU0sYUFBYTtPQUM3QixFQUVMLDRCQUE0QixFQUM1QixlQUFlLEVBR2hCLE1BQU0sY0FBYztPQUNkLEVBRUwsdUJBQXVCLEVBQ3ZCLG1CQUFtQixFQUdwQixNQUFNLHFEQUFxRDtPQUNyRCxFQUFDLGNBQWMsRUFBRSxRQUFRLEVBQWEsTUFBTSxvQkFBb0I7T0FDaEUsRUFDTCwrQ0FBK0MsRUFDL0Msc0JBQXNCLEVBQ3RCLG9CQUFvQixFQUNyQixNQUFNLGNBQWM7T0FDZCxFQUFzQixZQUFZLEVBQUMsTUFBTSxpQkFBaUI7T0FDMUQsRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0I7QUFFbEQsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQztBQUUvQyxJQUFJLFlBQVksR0FBZSxjQUFjLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUV6RTs7O0dBR0c7QUFDSDtJQStCRSxZQUFtQixLQUFVLEVBQVMsYUFBa0MsRUFBUyxJQUFjLEVBQzVFLE1BQTRCLEVBQVMsU0FBb0IsRUFDekQsY0FBd0IsRUFBUyxxQkFBaUMsRUFDbEUsTUFBK0IsRUFDL0Isb0JBQTJDO1FBSjNDLFVBQUssR0FBTCxLQUFLLENBQUs7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QixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ2xCLENBQUM7SUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ2xCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBMaXN0V3JhcHBlcixcbiAgTWFwV3JhcHBlcixcbiAgTWFwLFxuICBTdHJpbmdNYXBXcmFwcGVyLFxuICBpc0xpc3RMaWtlSXRlcmFibGUsXG4gIGFyZUl0ZXJhYmxlc0VxdWFsXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5cbmltcG9ydCB7SW5qZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7QXBwRWxlbWVudH0gZnJvbSAnLi9lbGVtZW50JztcbmltcG9ydCB7XG4gIGFzc2VydGlvbnNFbmFibGVkLFxuICBpc1ByZXNlbnQsXG4gIGlzQmxhbmssXG4gIFR5cGUsXG4gIGlzQXJyYXksXG4gIGlzTnVtYmVyLFxuICBDT05TVCxcbiAgQ09OU1RfRVhQUixcbiAgc3RyaW5naWZ5LFxuICBpc1ByaW1pdGl2ZSxcbiAgaXNTdHJpbmdcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcblxuaW1wb3J0IHtPYnNlcnZhYmxlV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYyc7XG5pbXBvcnQge1JlbmRlcmVyLCBSb290UmVuZGVyZXIsIFJlbmRlckNvbXBvbmVudFR5cGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlbmRlci9hcGknO1xuaW1wb3J0IHtWaWV3UmVmX30gZnJvbSAnLi92aWV3X3JlZic7XG5cbmltcG9ydCB7Vmlld1R5cGV9IGZyb20gJy4vdmlld190eXBlJztcbmltcG9ydCB7XG4gIFZpZXdVdGlscyxcbiAgZmxhdHRlbk5lc3RlZFZpZXdSZW5kZXJOb2RlcyxcbiAgZW5zdXJlU2xvdENvdW50LFxuICBhcnJheUxvb3NlSWRlbnRpY2FsLFxuICBtYXBMb29zZUlkZW50aWNhbFxufSBmcm9tICcuL3ZpZXdfdXRpbHMnO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclN0YXRlLFxuICBpc0RlZmF1bHRDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgZGV2TW9kZUVxdWFsXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2NoYW5nZV9kZXRlY3Rpb24vY2hhbmdlX2RldGVjdGlvbic7XG5pbXBvcnQge3d0ZkNyZWF0ZVNjb3BlLCB3dGZMZWF2ZSwgV3RmU2NvcGVGbn0gZnJvbSAnLi4vcHJvZmlsZS9wcm9maWxlJztcbmltcG9ydCB7XG4gIEV4cHJlc3Npb25DaGFuZ2VkQWZ0ZXJJdEhhc0JlZW5DaGVja2VkRXhjZXB0aW9uLFxuICBWaWV3RGVzdHJveWVkRXhjZXB0aW9uLFxuICBWaWV3V3JhcHBlZEV4Y2VwdGlvblxufSBmcm9tICcuL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtTdGF0aWNOb2RlRGVidWdJbmZvLCBEZWJ1Z0NvbnRleHR9IGZyb20gJy4vZGVidWdfY29udGV4dCc7XG5pbXBvcnQge0VsZW1lbnRJbmplY3Rvcn0gZnJvbSAnLi9lbGVtZW50X2luamVjdG9yJztcblxuY29uc3QgRU1QVFlfQ09OVEVYVCA9IENPTlNUX0VYUFIobmV3IE9iamVjdCgpKTtcblxudmFyIF9zY29wZV9jaGVjazogV3RmU2NvcGVGbiA9IHd0ZkNyZWF0ZVNjb3BlKGBBcHBWaWV3I2NoZWNrKGFzY2lpIGlkKWApO1xuXG4vKipcbiAqIENvc3Qgb2YgbWFraW5nIG9iamVjdHM6IGh0dHA6Ly9qc3BlcmYuY29tL2luc3RhbnRpYXRlLXNpemUtb2Ytb2JqZWN0XG4gKlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQXBwVmlldzxUPiB7XG4gIHJlZjogVmlld1JlZl87XG4gIHJvb3ROb2Rlc09yQXBwRWxlbWVudHM6IGFueVtdO1xuICBhbGxOb2RlczogYW55W107XG4gIGRpc3Bvc2FibGVzOiBGdW5jdGlvbltdO1xuICBzdWJzY3JpcHRpb25zOiBhbnlbXTtcbiAgY29udGVudENoaWxkcmVuOiBBcHBWaWV3PGFueT5bXSA9IFtdO1xuICB2aWV3Q2hpbGRyZW46IEFwcFZpZXc8YW55PltdID0gW107XG4gIHJlbmRlclBhcmVudDogQXBwVmlldzxhbnk+O1xuICB2aWV3Q29udGFpbmVyRWxlbWVudDogQXBwRWxlbWVudCA9IG51bGw7XG5cbiAgLy8gVGhlIG5hbWVzIG9mIHRoZSBiZWxvdyBmaWVsZHMgbXVzdCBiZSBrZXB0IGluIHN5bmMgd2l0aCBjb2RlZ2VuX25hbWVfdXRpbC50cyBvclxuICAvLyBjaGFuZ2UgZGV0ZWN0aW9uIHdpbGwgZmFpbC5cbiAgY2RTdGF0ZTogQ2hhbmdlRGV0ZWN0b3JTdGF0ZSA9IENoYW5nZURldGVjdG9yU3RhdGUuTmV2ZXJDaGVja2VkO1xuXG4gIC8qKlxuICAgKiBUaGUgY29udGV4dCBhZ2FpbnN0IHdoaWNoIGRhdGEtYmluZGluZyBleHByZXNzaW9ucyBpbiB0aGlzIHZpZXcgYXJlIGV2YWx1YXRlZCBhZ2FpbnN0LlxuICAgKiBUaGlzIGlzIGFsd2F5cyBhIGNvbXBvbmVudCBpbnN0YW5jZS5cbiAgICovXG4gIGNvbnRleHQ6IFQgPSBudWxsO1xuXG4gIHByb2plY3RhYmxlTm9kZXM6IEFycmF5PGFueSB8IGFueVtdPjtcblxuICBkZXN0cm95ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICByZW5kZXJlcjogUmVuZGVyZXI7XG5cbiAgcHJpdmF0ZSBfY3VycmVudERlYnVnQ29udGV4dDogRGVidWdDb250ZXh0ID0gbnVsbDtcblxuICBwcml2YXRlIF9oYXNFeHRlcm5hbEhvc3RFbGVtZW50OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjbGF6ejogYW55LCBwdWJsaWMgY29tcG9uZW50VHlwZTogUmVuZGVyQ29tcG9uZW50VHlwZSwgcHVibGljIHR5cGU6IFZpZXdUeXBlLFxuICAgICAgICAgICAgICBwdWJsaWMgbG9jYWxzOiB7W2tleTogc3RyaW5nXTogYW55fSwgcHVibGljIHZpZXdVdGlsczogVmlld1V0aWxzLFxuICAgICAgICAgICAgICBwdWJsaWMgcGFyZW50SW5qZWN0b3I6IEluamVjdG9yLCBwdWJsaWMgZGVjbGFyYXRpb25BcHBFbGVtZW50OiBBcHBFbGVtZW50LFxuICAgICAgICAgICAgICBwdWJsaWMgY2RNb2RlOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICAgICAgICAgICAgcHVibGljIHN0YXRpY05vZGVEZWJ1Z0luZm9zOiBTdGF0aWNOb2RlRGVidWdJbmZvW10pIHtcbiAgICB0aGlzLnJlZiA9IG5ldyBWaWV3UmVmXyh0aGlzKTtcbiAgICBpZiAodHlwZSA9PT0gVmlld1R5cGUuQ09NUE9ORU5UIHx8IHR5cGUgPT09IFZpZXdUeXBlLkhPU1QpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIgPSB2aWV3VXRpbHMucmVuZGVyQ29tcG9uZW50KGNvbXBvbmVudFR5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlcmVyID0gZGVjbGFyYXRpb25BcHBFbGVtZW50LnBhcmVudFZpZXcucmVuZGVyZXI7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlKGdpdmVuUHJvamVjdGFibGVOb2RlczogQXJyYXk8YW55IHwgYW55W10+LCByb290U2VsZWN0b3JPck5vZGU6IHN0cmluZyB8IGFueSk6IEFwcEVsZW1lbnQge1xuICAgIHZhciBjb250ZXh0O1xuICAgIHZhciBwcm9qZWN0YWJsZU5vZGVzO1xuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICBjYXNlIFZpZXdUeXBlLkNPTVBPTkVOVDpcbiAgICAgICAgY29udGV4dCA9IHRoaXMuZGVjbGFyYXRpb25BcHBFbGVtZW50LmNvbXBvbmVudDtcbiAgICAgICAgcHJvamVjdGFibGVOb2RlcyA9IGVuc3VyZVNsb3RDb3VudChnaXZlblByb2plY3RhYmxlTm9kZXMsIHRoaXMuY29tcG9uZW50VHlwZS5zbG90Q291bnQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVmlld1R5cGUuRU1CRURERUQ6XG4gICAgICAgIGNvbnRleHQgPSB0aGlzLmRlY2xhcmF0aW9uQXBwRWxlbWVudC5wYXJlbnRWaWV3LmNvbnRleHQ7XG4gICAgICAgIHByb2plY3RhYmxlTm9kZXMgPSB0aGlzLmRlY2xhcmF0aW9uQXBwRWxlbWVudC5wYXJlbnRWaWV3LnByb2plY3RhYmxlTm9kZXM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBWaWV3VHlwZS5IT1NUOlxuICAgICAgICBjb250ZXh0ID0gRU1QVFlfQ09OVEVYVDtcbiAgICAgICAgLy8gTm90ZTogRG9uJ3QgZW5zdXJlIHRoZSBzbG90IGNvdW50IGZvciB0aGUgcHJvamVjdGFibGVOb2RlcyBhcyB3ZSBzdG9yZVxuICAgICAgICAvLyB0aGVtIG9ubHkgZm9yIHRoZSBjb250YWluZWQgY29tcG9uZW50IHZpZXcgKHdoaWNoIHdpbGwgbGF0ZXIgY2hlY2sgdGhlIHNsb3QgY291bnQuLi4pXG4gICAgICAgIHByb2plY3RhYmxlTm9kZXMgPSBnaXZlblByb2plY3RhYmxlTm9kZXM7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB0aGlzLl9oYXNFeHRlcm5hbEhvc3RFbGVtZW50ID0gaXNQcmVzZW50KHJvb3RTZWxlY3Rvck9yTm9kZSk7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLnByb2plY3RhYmxlTm9kZXMgPSBwcm9qZWN0YWJsZU5vZGVzO1xuICAgIGlmICh0aGlzLmRlYnVnTW9kZSkge1xuICAgICAgdGhpcy5fcmVzZXREZWJ1ZygpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlSW50ZXJuYWwocm9vdFNlbGVjdG9yT3JOb2RlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5fcmV0aHJvd1dpdGhDb250ZXh0KGUsIGUuc3RhY2spO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGVJbnRlcm5hbChyb290U2VsZWN0b3JPck5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVyd3JpdHRlbiBieSBpbXBsZW1lbnRhdGlvbnMuXG4gICAqIFJldHVybnMgdGhlIEFwcEVsZW1lbnQgZm9yIHRoZSBob3N0IGVsZW1lbnQgZm9yIFZpZXdUeXBlLkhPU1QuXG4gICAqL1xuICBjcmVhdGVJbnRlcm5hbChyb290U2VsZWN0b3JPck5vZGU6IHN0cmluZyB8IGFueSk6IEFwcEVsZW1lbnQgeyByZXR1cm4gbnVsbDsgfVxuXG4gIGluaXQocm9vdE5vZGVzT3JBcHBFbGVtZW50czogYW55W10sIGFsbE5vZGVzOiBhbnlbXSwgZGlzcG9zYWJsZXM6IEZ1bmN0aW9uW10sXG4gICAgICAgc3Vic2NyaXB0aW9uczogYW55W10pIHtcbiAgICB0aGlzLnJvb3ROb2Rlc09yQXBwRWxlbWVudHMgPSByb290Tm9kZXNPckFwcEVsZW1lbnRzO1xuICAgIHRoaXMuYWxsTm9kZXMgPSBhbGxOb2RlcztcbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gZGlzcG9zYWJsZXM7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gc3Vic2NyaXB0aW9ucztcbiAgICBpZiAodGhpcy50eXBlID09PSBWaWV3VHlwZS5DT01QT05FTlQpIHtcbiAgICAgIC8vIE5vdGU6IHRoZSByZW5kZXIgbm9kZXMgaGF2ZSBiZWVuIGF0dGFjaGVkIHRvIHRoZWlyIGhvc3QgZWxlbWVudFxuICAgICAgLy8gaW4gdGhlIFZpZXdGYWN0b3J5IGFscmVhZHkuXG4gICAgICB0aGlzLmRlY2xhcmF0aW9uQXBwRWxlbWVudC5wYXJlbnRWaWV3LnZpZXdDaGlsZHJlbi5wdXNoKHRoaXMpO1xuICAgICAgdGhpcy5yZW5kZXJQYXJlbnQgPSB0aGlzLmRlY2xhcmF0aW9uQXBwRWxlbWVudC5wYXJlbnRWaWV3O1xuICAgICAgdGhpcy5kaXJ0eVBhcmVudFF1ZXJpZXNJbnRlcm5hbCgpO1xuICAgIH1cbiAgfVxuXG4gIHNlbGVjdE9yQ3JlYXRlSG9zdEVsZW1lbnQoZWxlbWVudE5hbWU6IHN0cmluZywgcm9vdFNlbGVjdG9yT3JOb2RlOiBzdHJpbmcgfCBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVidWdDdHg6IERlYnVnQ29udGV4dCk6IGFueSB7XG4gICAgdmFyIGhvc3RFbGVtZW50O1xuICAgIGlmIChpc1ByZXNlbnQocm9vdFNlbGVjdG9yT3JOb2RlKSkge1xuICAgICAgaG9zdEVsZW1lbnQgPSB0aGlzLnJlbmRlcmVyLnNlbGVjdFJvb3RFbGVtZW50KHJvb3RTZWxlY3Rvck9yTm9kZSwgZGVidWdDdHgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBob3N0RWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudChudWxsLCBlbGVtZW50TmFtZSwgZGVidWdDdHgpO1xuICAgIH1cbiAgICByZXR1cm4gaG9zdEVsZW1lbnQ7XG4gIH1cblxuICBpbmplY3RvckdldCh0b2tlbjogYW55LCBub2RlSW5kZXg6IG51bWJlciwgbm90Rm91bmRSZXN1bHQ6IGFueSk6IGFueSB7XG4gICAgaWYgKHRoaXMuZGVidWdNb2RlKSB7XG4gICAgICB0aGlzLl9yZXNldERlYnVnKCk7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbmplY3RvckdldEludGVybmFsKHRva2VuLCBub2RlSW5kZXgsIG5vdEZvdW5kUmVzdWx0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5fcmV0aHJvd1dpdGhDb250ZXh0KGUsIGUuc3RhY2spO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5pbmplY3RvckdldEludGVybmFsKHRva2VuLCBub2RlSW5kZXgsIG5vdEZvdW5kUmVzdWx0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT3ZlcndyaXR0ZW4gYnkgaW1wbGVtZW50YXRpb25zXG4gICAqL1xuICBpbmplY3RvckdldEludGVybmFsKHRva2VuOiBhbnksIG5vZGVJbmRleDogbnVtYmVyLCBub3RGb3VuZFJlc3VsdDogYW55KTogYW55IHtcbiAgICByZXR1cm4gbm90Rm91bmRSZXN1bHQ7XG4gIH1cblxuICBpbmplY3Rvcihub2RlSW5kZXg6IG51bWJlcik6IEluamVjdG9yIHtcbiAgICBpZiAoaXNQcmVzZW50KG5vZGVJbmRleCkpIHtcbiAgICAgIHJldHVybiBuZXcgRWxlbWVudEluamVjdG9yKHRoaXMsIG5vZGVJbmRleCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudEluamVjdG9yO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX2hhc0V4dGVybmFsSG9zdEVsZW1lbnQpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuZGV0YWNoVmlldyh0aGlzLmZsYXRSb290Tm9kZXMpO1xuICAgIH0gZWxzZSBpZiAoaXNQcmVzZW50KHRoaXMudmlld0NvbnRhaW5lckVsZW1lbnQpKSB7XG4gICAgICB0aGlzLnZpZXdDb250YWluZXJFbGVtZW50LmRldGFjaFZpZXcodGhpcy52aWV3Q29udGFpbmVyRWxlbWVudC5uZXN0ZWRWaWV3cy5pbmRleE9mKHRoaXMpKTtcbiAgICB9XG4gICAgdGhpcy5fZGVzdHJveVJlY3Vyc2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2Rlc3Ryb3lSZWN1cnNlKCkge1xuICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmNvbnRlbnRDaGlsZHJlbjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZHJlbltpXS5fZGVzdHJveVJlY3Vyc2UoKTtcbiAgICB9XG4gICAgY2hpbGRyZW4gPSB0aGlzLnZpZXdDaGlsZHJlbjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZHJlbltpXS5fZGVzdHJveVJlY3Vyc2UoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZGVidWdNb2RlKSB7XG4gICAgICB0aGlzLl9yZXNldERlYnVnKCk7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLl9kZXN0cm95TG9jYWwoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5fcmV0aHJvd1dpdGhDb250ZXh0KGUsIGUuc3RhY2spO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kZXN0cm95TG9jYWwoKTtcbiAgICB9XG5cbiAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XG4gIH1cblxuICBwcml2YXRlIF9kZXN0cm95TG9jYWwoKSB7XG4gICAgdmFyIGhvc3RFbGVtZW50ID1cbiAgICAgICAgdGhpcy50eXBlID09PSBWaWV3VHlwZS5DT01QT05FTlQgPyB0aGlzLmRlY2xhcmF0aW9uQXBwRWxlbWVudC5uYXRpdmVFbGVtZW50IDogbnVsbDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGlzcG9zYWJsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXNbaV0oKTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1YnNjcmlwdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIE9ic2VydmFibGVXcmFwcGVyLmRpc3Bvc2UodGhpcy5zdWJzY3JpcHRpb25zW2ldKTtcbiAgICB9XG4gICAgdGhpcy5kZXN0cm95SW50ZXJuYWwoKTtcbiAgICBpZiAodGhpcy5faGFzRXh0ZXJuYWxIb3N0RWxlbWVudCkge1xuICAgICAgdGhpcy5yZW5kZXJlci5kZXRhY2hWaWV3KHRoaXMuZmxhdFJvb3ROb2Rlcyk7XG4gICAgfSBlbHNlIGlmIChpc1ByZXNlbnQodGhpcy52aWV3Q29udGFpbmVyRWxlbWVudCkpIHtcbiAgICAgIHRoaXMudmlld0NvbnRhaW5lckVsZW1lbnQuZGV0YWNoVmlldyh0aGlzLnZpZXdDb250YWluZXJFbGVtZW50Lm5lc3RlZFZpZXdzLmluZGV4T2YodGhpcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRpcnR5UGFyZW50UXVlcmllc0ludGVybmFsKCk7XG4gICAgfVxuICAgIHRoaXMucmVuZGVyZXIuZGVzdHJveVZpZXcoaG9zdEVsZW1lbnQsIHRoaXMuYWxsTm9kZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJ3cml0dGVuIGJ5IGltcGxlbWVudGF0aW9uc1xuICAgKi9cbiAgZGVzdHJveUludGVybmFsKCk6IHZvaWQge31cblxuICBnZXQgZGVidWdNb2RlKCk6IGJvb2xlYW4geyByZXR1cm4gaXNQcmVzZW50KHRoaXMuc3RhdGljTm9kZURlYnVnSW5mb3MpOyB9XG5cbiAgZ2V0IGNoYW5nZURldGVjdG9yUmVmKCk6IENoYW5nZURldGVjdG9yUmVmIHsgcmV0dXJuIHRoaXMucmVmOyB9XG5cbiAgZ2V0IHBhcmVudCgpOiBBcHBWaWV3PGFueT4ge1xuICAgIHJldHVybiBpc1ByZXNlbnQodGhpcy5kZWNsYXJhdGlvbkFwcEVsZW1lbnQpID8gdGhpcy5kZWNsYXJhdGlvbkFwcEVsZW1lbnQucGFyZW50VmlldyA6IG51bGw7XG4gIH1cblxuICBnZXQgZmxhdFJvb3ROb2RlcygpOiBhbnlbXSB7IHJldHVybiBmbGF0dGVuTmVzdGVkVmlld1JlbmRlck5vZGVzKHRoaXMucm9vdE5vZGVzT3JBcHBFbGVtZW50cyk7IH1cblxuICBnZXQgbGFzdFJvb3ROb2RlKCk6IGFueSB7XG4gICAgdmFyIGxhc3ROb2RlID0gdGhpcy5yb290Tm9kZXNPckFwcEVsZW1lbnRzLmxlbmd0aCA+IDAgP1xuICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3ROb2Rlc09yQXBwRWxlbWVudHNbdGhpcy5yb290Tm9kZXNPckFwcEVsZW1lbnRzLmxlbmd0aCAtIDFdIDpcbiAgICAgICAgICAgICAgICAgICAgICAgbnVsbDtcbiAgICByZXR1cm4gX2ZpbmRMYXN0UmVuZGVyTm9kZShsYXN0Tm9kZSk7XG4gIH1cblxuICBoYXNMb2NhbChjb250ZXh0TmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFN0cmluZ01hcFdyYXBwZXIuY29udGFpbnModGhpcy5sb2NhbHMsIGNvbnRleHROYW1lKTtcbiAgfVxuXG4gIHNldExvY2FsKGNvbnRleHROYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHsgdGhpcy5sb2NhbHNbY29udGV4dE5hbWVdID0gdmFsdWU7IH1cblxuICAvKipcbiAgICogT3ZlcndyaXR0ZW4gYnkgaW1wbGVtZW50YXRpb25zXG4gICAqL1xuICBkaXJ0eVBhcmVudFF1ZXJpZXNJbnRlcm5hbCgpOiB2b2lkIHt9XG5cbiAgYWRkUmVuZGVyQ29udGVudENoaWxkKHZpZXc6IEFwcFZpZXc8YW55Pik6IHZvaWQge1xuICAgIHRoaXMuY29udGVudENoaWxkcmVuLnB1c2godmlldyk7XG4gICAgdmlldy5yZW5kZXJQYXJlbnQgPSB0aGlzO1xuICAgIHZpZXcuZGlydHlQYXJlbnRRdWVyaWVzSW50ZXJuYWwoKTtcbiAgfVxuXG4gIHJlbW92ZUNvbnRlbnRDaGlsZCh2aWV3OiBBcHBWaWV3PGFueT4pOiB2b2lkIHtcbiAgICBMaXN0V3JhcHBlci5yZW1vdmUodGhpcy5jb250ZW50Q2hpbGRyZW4sIHZpZXcpO1xuICAgIHZpZXcuZGlydHlQYXJlbnRRdWVyaWVzSW50ZXJuYWwoKTtcbiAgICB2aWV3LnJlbmRlclBhcmVudCA9IG51bGw7XG4gIH1cblxuICBkZXRlY3RDaGFuZ2VzKHRocm93T25DaGFuZ2U6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB2YXIgcyA9IF9zY29wZV9jaGVjayh0aGlzLmNsYXp6KTtcbiAgICBpZiAodGhpcy5jZE1vZGUgPT09IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRldGFjaGVkIHx8XG4gICAgICAgIHRoaXMuY2RNb2RlID09PSBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5DaGVja2VkIHx8XG4gICAgICAgIHRoaXMuY2RTdGF0ZSA9PT0gQ2hhbmdlRGV0ZWN0b3JTdGF0ZS5FcnJvcmVkKVxuICAgICAgcmV0dXJuO1xuICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgICAgdGhpcy50aHJvd0Rlc3Ryb3llZEVycm9yKCdkZXRlY3RDaGFuZ2VzJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmRlYnVnTW9kZSkge1xuICAgICAgdGhpcy5fcmVzZXREZWJ1ZygpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5kZXRlY3RDaGFuZ2VzSW50ZXJuYWwodGhyb3dPbkNoYW5nZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRoaXMuX3JldGhyb3dXaXRoQ29udGV4dChlLCBlLnN0YWNrKTtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZXRlY3RDaGFuZ2VzSW50ZXJuYWwodGhyb3dPbkNoYW5nZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNkTW9kZSA9PT0gQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuQ2hlY2tPbmNlKVxuICAgICAgdGhpcy5jZE1vZGUgPSBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5DaGVja2VkO1xuXG4gICAgdGhpcy5jZFN0YXRlID0gQ2hhbmdlRGV0ZWN0b3JTdGF0ZS5DaGVja2VkQmVmb3JlO1xuICAgIHd0ZkxlYXZlKHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJ3cml0dGVuIGJ5IGltcGxlbWVudGF0aW9uc1xuICAgKi9cbiAgZGV0ZWN0Q2hhbmdlc0ludGVybmFsKHRocm93T25DaGFuZ2U6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRldGVjdENvbnRlbnRDaGlsZHJlbkNoYW5nZXModGhyb3dPbkNoYW5nZSk7XG4gICAgdGhpcy5kZXRlY3RWaWV3Q2hpbGRyZW5DaGFuZ2VzKHRocm93T25DaGFuZ2UpO1xuICB9XG5cbiAgZGV0ZWN0Q29udGVudENoaWxkcmVuQ2hhbmdlcyh0aHJvd09uQ2hhbmdlOiBib29sZWFuKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNvbnRlbnRDaGlsZHJlbi5sZW5ndGg7ICsraSkge1xuICAgICAgdGhpcy5jb250ZW50Q2hpbGRyZW5baV0uZGV0ZWN0Q2hhbmdlcyh0aHJvd09uQ2hhbmdlKTtcbiAgICB9XG4gIH1cblxuICBkZXRlY3RWaWV3Q2hpbGRyZW5DaGFuZ2VzKHRocm93T25DaGFuZ2U6IGJvb2xlYW4pIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudmlld0NoaWxkcmVuLmxlbmd0aDsgKytpKSB7XG4gICAgICB0aGlzLnZpZXdDaGlsZHJlbltpXS5kZXRlY3RDaGFuZ2VzKHRocm93T25DaGFuZ2UpO1xuICAgIH1cbiAgfVxuXG4gIGFkZFRvQ29udGVudENoaWxkcmVuKHJlbmRlckFwcEVsZW1lbnQ6IEFwcEVsZW1lbnQpOiB2b2lkIHtcbiAgICByZW5kZXJBcHBFbGVtZW50LnBhcmVudFZpZXcuY29udGVudENoaWxkcmVuLnB1c2godGhpcyk7XG4gICAgdGhpcy52aWV3Q29udGFpbmVyRWxlbWVudCA9IHJlbmRlckFwcEVsZW1lbnQ7XG4gICAgdGhpcy5kaXJ0eVBhcmVudFF1ZXJpZXNJbnRlcm5hbCgpO1xuICB9XG5cbiAgcmVtb3ZlRnJvbUNvbnRlbnRDaGlsZHJlbihyZW5kZXJBcHBFbGVtZW50OiBBcHBFbGVtZW50KTogdm9pZCB7XG4gICAgTGlzdFdyYXBwZXIucmVtb3ZlKHJlbmRlckFwcEVsZW1lbnQucGFyZW50Vmlldy5jb250ZW50Q2hpbGRyZW4sIHRoaXMpO1xuICAgIHRoaXMuZGlydHlQYXJlbnRRdWVyaWVzSW50ZXJuYWwoKTtcbiAgICB0aGlzLnZpZXdDb250YWluZXJFbGVtZW50ID0gbnVsbDtcbiAgfVxuXG4gIG1hcmtBc0NoZWNrT25jZSgpOiB2b2lkIHsgdGhpcy5jZE1vZGUgPSBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5DaGVja09uY2U7IH1cblxuICBtYXJrUGF0aFRvUm9vdEFzQ2hlY2tPbmNlKCk6IHZvaWQge1xuICAgIHZhciBjOiBBcHBWaWV3PGFueT4gPSB0aGlzO1xuICAgIHdoaWxlIChpc1ByZXNlbnQoYykgJiYgYy5jZE1vZGUgIT09IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRldGFjaGVkKSB7XG4gICAgICBpZiAoYy5jZE1vZGUgPT09IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkNoZWNrZWQpIHtcbiAgICAgICAgYy5jZE1vZGUgPSBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5DaGVja09uY2U7XG4gICAgICB9XG4gICAgICBjID0gYy5yZW5kZXJQYXJlbnQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfcmVzZXREZWJ1ZygpIHsgdGhpcy5fY3VycmVudERlYnVnQ29udGV4dCA9IG51bGw7IH1cblxuICBkZWJ1Zyhub2RlSW5kZXg6IG51bWJlciwgcm93TnVtOiBudW1iZXIsIGNvbE51bTogbnVtYmVyKTogRGVidWdDb250ZXh0IHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudERlYnVnQ29udGV4dCA9IG5ldyBEZWJ1Z0NvbnRleHQodGhpcywgbm9kZUluZGV4LCByb3dOdW0sIGNvbE51bSk7XG4gIH1cblxuICBwcml2YXRlIF9yZXRocm93V2l0aENvbnRleHQoZTogYW55LCBzdGFjazogYW55KSB7XG4gICAgaWYgKCEoZSBpbnN0YW5jZW9mIFZpZXdXcmFwcGVkRXhjZXB0aW9uKSkge1xuICAgICAgaWYgKCEoZSBpbnN0YW5jZW9mIEV4cHJlc3Npb25DaGFuZ2VkQWZ0ZXJJdEhhc0JlZW5DaGVja2VkRXhjZXB0aW9uKSkge1xuICAgICAgICB0aGlzLmNkU3RhdGUgPSBDaGFuZ2VEZXRlY3RvclN0YXRlLkVycm9yZWQ7XG4gICAgICB9XG4gICAgICBpZiAoaXNQcmVzZW50KHRoaXMuX2N1cnJlbnREZWJ1Z0NvbnRleHQpKSB7XG4gICAgICAgIHRocm93IG5ldyBWaWV3V3JhcHBlZEV4Y2VwdGlvbihlLCBzdGFjaywgdGhpcy5fY3VycmVudERlYnVnQ29udGV4dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZXZlbnRIYW5kbGVyKGNiOiBGdW5jdGlvbik6IEZ1bmN0aW9uIHtcbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUpIHtcbiAgICAgIHJldHVybiAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5fcmVzZXREZWJ1ZygpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBjYihldmVudCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICB0aGlzLl9yZXRocm93V2l0aENvbnRleHQoZSwgZS5zdGFjayk7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNiO1xuICAgIH1cbiAgfVxuXG4gIHRocm93RGVzdHJveWVkRXJyb3IoZGV0YWlsczogc3RyaW5nKTogdm9pZCB7IHRocm93IG5ldyBWaWV3RGVzdHJveWVkRXhjZXB0aW9uKGRldGFpbHMpOyB9XG59XG5cbmZ1bmN0aW9uIF9maW5kTGFzdFJlbmRlck5vZGUobm9kZTogYW55KTogYW55IHtcbiAgdmFyIGxhc3ROb2RlO1xuICBpZiAobm9kZSBpbnN0YW5jZW9mIEFwcEVsZW1lbnQpIHtcbiAgICB2YXIgYXBwRWwgPSA8QXBwRWxlbWVudD5ub2RlO1xuICAgIGxhc3ROb2RlID0gYXBwRWwubmF0aXZlRWxlbWVudDtcbiAgICBpZiAoaXNQcmVzZW50KGFwcEVsLm5lc3RlZFZpZXdzKSkge1xuICAgICAgLy8gTm90ZTogVmlld3MgbWlnaHQgaGF2ZSBubyByb290IG5vZGVzIGF0IGFsbCFcbiAgICAgIGZvciAodmFyIGkgPSBhcHBFbC5uZXN0ZWRWaWV3cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICB2YXIgbmVzdGVkVmlldyA9IGFwcEVsLm5lc3RlZFZpZXdzW2ldO1xuICAgICAgICBpZiAobmVzdGVkVmlldy5yb290Tm9kZXNPckFwcEVsZW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBsYXN0Tm9kZSA9IF9maW5kTGFzdFJlbmRlck5vZGUoXG4gICAgICAgICAgICAgIG5lc3RlZFZpZXcucm9vdE5vZGVzT3JBcHBFbGVtZW50c1tuZXN0ZWRWaWV3LnJvb3ROb2Rlc09yQXBwRWxlbWVudHMubGVuZ3RoIC0gMV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGxhc3ROb2RlID0gbm9kZTtcbiAgfVxuICByZXR1cm4gbGFzdE5vZGU7XG59XG4iXX0=