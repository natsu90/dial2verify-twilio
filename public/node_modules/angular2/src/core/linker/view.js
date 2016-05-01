'use strict';"use strict";
var collection_1 = require('angular2/src/facade/collection');
var element_1 = require('./element');
var lang_1 = require('angular2/src/facade/lang');
var async_1 = require('angular2/src/facade/async');
var view_ref_1 = require('./view_ref');
var view_type_1 = require('./view_type');
var view_utils_1 = require('./view_utils');
var change_detection_1 = require('angular2/src/core/change_detection/change_detection');
var profile_1 = require('../profile/profile');
var exceptions_1 = require('./exceptions');
var debug_context_1 = require('./debug_context');
var element_injector_1 = require('./element_injector');
var EMPTY_CONTEXT = lang_1.CONST_EXPR(new Object());
var _scope_check = profile_1.wtfCreateScope("AppView#check(ascii id)");
/**
 * Cost of making objects: http://jsperf.com/instantiate-size-of-object
 *
 */
var AppView = (function () {
    function AppView(clazz, componentType, type, locals, viewUtils, parentInjector, declarationAppElement, cdMode, staticNodeDebugInfos) {
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
        this.cdState = change_detection_1.ChangeDetectorState.NeverChecked;
        /**
         * The context against which data-binding expressions in this view are evaluated against.
         * This is always a component instance.
         */
        this.context = null;
        this.destroyed = false;
        this._currentDebugContext = null;
        this.ref = new view_ref_1.ViewRef_(this);
        if (type === view_type_1.ViewType.COMPONENT || type === view_type_1.ViewType.HOST) {
            this.renderer = viewUtils.renderComponent(componentType);
        }
        else {
            this.renderer = declarationAppElement.parentView.renderer;
        }
    }
    AppView.prototype.create = function (givenProjectableNodes, rootSelectorOrNode) {
        var context;
        var projectableNodes;
        switch (this.type) {
            case view_type_1.ViewType.COMPONENT:
                context = this.declarationAppElement.component;
                projectableNodes = view_utils_1.ensureSlotCount(givenProjectableNodes, this.componentType.slotCount);
                break;
            case view_type_1.ViewType.EMBEDDED:
                context = this.declarationAppElement.parentView.context;
                projectableNodes = this.declarationAppElement.parentView.projectableNodes;
                break;
            case view_type_1.ViewType.HOST:
                context = EMPTY_CONTEXT;
                // Note: Don't ensure the slot count for the projectableNodes as we store
                // them only for the contained component view (which will later check the slot count...)
                projectableNodes = givenProjectableNodes;
                break;
        }
        this._hasExternalHostElement = lang_1.isPresent(rootSelectorOrNode);
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
    };
    /**
     * Overwritten by implementations.
     * Returns the AppElement for the host element for ViewType.HOST.
     */
    AppView.prototype.createInternal = function (rootSelectorOrNode) { return null; };
    AppView.prototype.init = function (rootNodesOrAppElements, allNodes, disposables, subscriptions) {
        this.rootNodesOrAppElements = rootNodesOrAppElements;
        this.allNodes = allNodes;
        this.disposables = disposables;
        this.subscriptions = subscriptions;
        if (this.type === view_type_1.ViewType.COMPONENT) {
            // Note: the render nodes have been attached to their host element
            // in the ViewFactory already.
            this.declarationAppElement.parentView.viewChildren.push(this);
            this.renderParent = this.declarationAppElement.parentView;
            this.dirtyParentQueriesInternal();
        }
    };
    AppView.prototype.selectOrCreateHostElement = function (elementName, rootSelectorOrNode, debugCtx) {
        var hostElement;
        if (lang_1.isPresent(rootSelectorOrNode)) {
            hostElement = this.renderer.selectRootElement(rootSelectorOrNode, debugCtx);
        }
        else {
            hostElement = this.renderer.createElement(null, elementName, debugCtx);
        }
        return hostElement;
    };
    AppView.prototype.injectorGet = function (token, nodeIndex, notFoundResult) {
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
    };
    /**
     * Overwritten by implementations
     */
    AppView.prototype.injectorGetInternal = function (token, nodeIndex, notFoundResult) {
        return notFoundResult;
    };
    AppView.prototype.injector = function (nodeIndex) {
        if (lang_1.isPresent(nodeIndex)) {
            return new element_injector_1.ElementInjector(this, nodeIndex);
        }
        else {
            return this.parentInjector;
        }
    };
    AppView.prototype.destroy = function () {
        if (this._hasExternalHostElement) {
            this.renderer.detachView(this.flatRootNodes);
        }
        else if (lang_1.isPresent(this.viewContainerElement)) {
            this.viewContainerElement.detachView(this.viewContainerElement.nestedViews.indexOf(this));
        }
        this._destroyRecurse();
    };
    AppView.prototype._destroyRecurse = function () {
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
    };
    AppView.prototype._destroyLocal = function () {
        var hostElement = this.type === view_type_1.ViewType.COMPONENT ? this.declarationAppElement.nativeElement : null;
        for (var i = 0; i < this.disposables.length; i++) {
            this.disposables[i]();
        }
        for (var i = 0; i < this.subscriptions.length; i++) {
            async_1.ObservableWrapper.dispose(this.subscriptions[i]);
        }
        this.destroyInternal();
        if (this._hasExternalHostElement) {
            this.renderer.detachView(this.flatRootNodes);
        }
        else if (lang_1.isPresent(this.viewContainerElement)) {
            this.viewContainerElement.detachView(this.viewContainerElement.nestedViews.indexOf(this));
        }
        else {
            this.dirtyParentQueriesInternal();
        }
        this.renderer.destroyView(hostElement, this.allNodes);
    };
    /**
     * Overwritten by implementations
     */
    AppView.prototype.destroyInternal = function () { };
    Object.defineProperty(AppView.prototype, "debugMode", {
        get: function () { return lang_1.isPresent(this.staticNodeDebugInfos); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppView.prototype, "changeDetectorRef", {
        get: function () { return this.ref; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppView.prototype, "parent", {
        get: function () {
            return lang_1.isPresent(this.declarationAppElement) ? this.declarationAppElement.parentView : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppView.prototype, "flatRootNodes", {
        get: function () { return view_utils_1.flattenNestedViewRenderNodes(this.rootNodesOrAppElements); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppView.prototype, "lastRootNode", {
        get: function () {
            var lastNode = this.rootNodesOrAppElements.length > 0 ?
                this.rootNodesOrAppElements[this.rootNodesOrAppElements.length - 1] :
                null;
            return _findLastRenderNode(lastNode);
        },
        enumerable: true,
        configurable: true
    });
    AppView.prototype.hasLocal = function (contextName) {
        return collection_1.StringMapWrapper.contains(this.locals, contextName);
    };
    AppView.prototype.setLocal = function (contextName, value) { this.locals[contextName] = value; };
    /**
     * Overwritten by implementations
     */
    AppView.prototype.dirtyParentQueriesInternal = function () { };
    AppView.prototype.addRenderContentChild = function (view) {
        this.contentChildren.push(view);
        view.renderParent = this;
        view.dirtyParentQueriesInternal();
    };
    AppView.prototype.removeContentChild = function (view) {
        collection_1.ListWrapper.remove(this.contentChildren, view);
        view.dirtyParentQueriesInternal();
        view.renderParent = null;
    };
    AppView.prototype.detectChanges = function (throwOnChange) {
        var s = _scope_check(this.clazz);
        if (this.cdMode === change_detection_1.ChangeDetectionStrategy.Detached ||
            this.cdMode === change_detection_1.ChangeDetectionStrategy.Checked ||
            this.cdState === change_detection_1.ChangeDetectorState.Errored)
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
        if (this.cdMode === change_detection_1.ChangeDetectionStrategy.CheckOnce)
            this.cdMode = change_detection_1.ChangeDetectionStrategy.Checked;
        this.cdState = change_detection_1.ChangeDetectorState.CheckedBefore;
        profile_1.wtfLeave(s);
    };
    /**
     * Overwritten by implementations
     */
    AppView.prototype.detectChangesInternal = function (throwOnChange) {
        this.detectContentChildrenChanges(throwOnChange);
        this.detectViewChildrenChanges(throwOnChange);
    };
    AppView.prototype.detectContentChildrenChanges = function (throwOnChange) {
        for (var i = 0; i < this.contentChildren.length; ++i) {
            this.contentChildren[i].detectChanges(throwOnChange);
        }
    };
    AppView.prototype.detectViewChildrenChanges = function (throwOnChange) {
        for (var i = 0; i < this.viewChildren.length; ++i) {
            this.viewChildren[i].detectChanges(throwOnChange);
        }
    };
    AppView.prototype.addToContentChildren = function (renderAppElement) {
        renderAppElement.parentView.contentChildren.push(this);
        this.viewContainerElement = renderAppElement;
        this.dirtyParentQueriesInternal();
    };
    AppView.prototype.removeFromContentChildren = function (renderAppElement) {
        collection_1.ListWrapper.remove(renderAppElement.parentView.contentChildren, this);
        this.dirtyParentQueriesInternal();
        this.viewContainerElement = null;
    };
    AppView.prototype.markAsCheckOnce = function () { this.cdMode = change_detection_1.ChangeDetectionStrategy.CheckOnce; };
    AppView.prototype.markPathToRootAsCheckOnce = function () {
        var c = this;
        while (lang_1.isPresent(c) && c.cdMode !== change_detection_1.ChangeDetectionStrategy.Detached) {
            if (c.cdMode === change_detection_1.ChangeDetectionStrategy.Checked) {
                c.cdMode = change_detection_1.ChangeDetectionStrategy.CheckOnce;
            }
            c = c.renderParent;
        }
    };
    AppView.prototype._resetDebug = function () { this._currentDebugContext = null; };
    AppView.prototype.debug = function (nodeIndex, rowNum, colNum) {
        return this._currentDebugContext = new debug_context_1.DebugContext(this, nodeIndex, rowNum, colNum);
    };
    AppView.prototype._rethrowWithContext = function (e, stack) {
        if (!(e instanceof exceptions_1.ViewWrappedException)) {
            if (!(e instanceof exceptions_1.ExpressionChangedAfterItHasBeenCheckedException)) {
                this.cdState = change_detection_1.ChangeDetectorState.Errored;
            }
            if (lang_1.isPresent(this._currentDebugContext)) {
                throw new exceptions_1.ViewWrappedException(e, stack, this._currentDebugContext);
            }
        }
    };
    AppView.prototype.eventHandler = function (cb) {
        var _this = this;
        if (this.debugMode) {
            return function (event) {
                _this._resetDebug();
                try {
                    return cb(event);
                }
                catch (e) {
                    _this._rethrowWithContext(e, e.stack);
                    throw e;
                }
            };
        }
        else {
            return cb;
        }
    };
    AppView.prototype.throwDestroyedError = function (details) { throw new exceptions_1.ViewDestroyedException(details); };
    return AppView;
}());
exports.AppView = AppView;
function _findLastRenderNode(node) {
    var lastNode;
    if (node instanceof element_1.AppElement) {
        var appEl = node;
        lastNode = appEl.nativeElement;
        if (lang_1.isPresent(appEl.nestedViews)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtNG5vM1pRdk8udG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci92aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwyQkFPTyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBR3hDLHdCQUF5QixXQUFXLENBQUMsQ0FBQTtBQUNyQyxxQkFZTywwQkFBMEIsQ0FBQyxDQUFBO0FBRWxDLHNCQUFnQywyQkFBMkIsQ0FBQyxDQUFBO0FBRTVELHlCQUF1QixZQUFZLENBQUMsQ0FBQTtBQUVwQywwQkFBdUIsYUFBYSxDQUFDLENBQUE7QUFDckMsMkJBTU8sY0FBYyxDQUFDLENBQUE7QUFDdEIsaUNBTU8scURBQXFELENBQUMsQ0FBQTtBQUM3RCx3QkFBbUQsb0JBQW9CLENBQUMsQ0FBQTtBQUN4RSwyQkFJTyxjQUFjLENBQUMsQ0FBQTtBQUN0Qiw4QkFBZ0QsaUJBQWlCLENBQUMsQ0FBQTtBQUNsRSxpQ0FBOEIsb0JBQW9CLENBQUMsQ0FBQTtBQUVuRCxJQUFNLGFBQWEsR0FBRyxpQkFBVSxDQUFDLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQztBQUUvQyxJQUFJLFlBQVksR0FBZSx3QkFBYyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFFekU7OztHQUdHO0FBQ0g7SUErQkUsaUJBQW1CLEtBQVUsRUFBUyxhQUFrQyxFQUFTLElBQWMsRUFDNUUsTUFBNEIsRUFBUyxTQUFvQixFQUN6RCxjQUF3QixFQUFTLHFCQUFpQyxFQUNsRSxNQUErQixFQUMvQixvQkFBMkM7UUFKM0MsVUFBSyxHQUFMLEtBQUssQ0FBSztRQUFTLGtCQUFhLEdBQWIsYUFBYSxDQUFxQjtRQUFTLFNBQUksR0FBSixJQUFJLENBQVU7UUFDNUUsV0FBTSxHQUFOLE1BQU0sQ0FBc0I7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3pELG1CQUFjLEdBQWQsY0FBYyxDQUFV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QUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN2RCxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsc0JBQXNCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pELFFBQVEsR0FBRyxtQkFBbUIsQ0FDMUIsVUFBVSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkYsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sUUFBUSxHQUFHLElBQUksQ0FBQztJQUNsQixDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNsQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgTGlzdFdyYXBwZXIsXG4gIE1hcFdyYXBwZXIsXG4gIE1hcCxcbiAgU3RyaW5nTWFwV3JhcHBlcixcbiAgaXNMaXN0TGlrZUl0ZXJhYmxlLFxuICBhcmVJdGVyYWJsZXNFcXVhbFxufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuXG5pbXBvcnQge0luamVjdG9yfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge0FwcEVsZW1lbnR9IGZyb20gJy4vZWxlbWVudCc7XG5pbXBvcnQge1xuICBhc3NlcnRpb25zRW5hYmxlZCxcbiAgaXNQcmVzZW50LFxuICBpc0JsYW5rLFxuICBUeXBlLFxuICBpc0FycmF5LFxuICBpc051bWJlcixcbiAgQ09OU1QsXG4gIENPTlNUX0VYUFIsXG4gIHN0cmluZ2lmeSxcbiAgaXNQcmltaXRpdmUsXG4gIGlzU3RyaW5nXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbmltcG9ydCB7T2JzZXJ2YWJsZVdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmMnO1xuaW1wb3J0IHtSZW5kZXJlciwgUm9vdFJlbmRlcmVyLCBSZW5kZXJDb21wb25lbnRUeXBlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9yZW5kZXIvYXBpJztcbmltcG9ydCB7Vmlld1JlZl99IGZyb20gJy4vdmlld19yZWYnO1xuXG5pbXBvcnQge1ZpZXdUeXBlfSBmcm9tICcuL3ZpZXdfdHlwZSc7XG5pbXBvcnQge1xuICBWaWV3VXRpbHMsXG4gIGZsYXR0ZW5OZXN0ZWRWaWV3UmVuZGVyTm9kZXMsXG4gIGVuc3VyZVNsb3RDb3VudCxcbiAgYXJyYXlMb29zZUlkZW50aWNhbCxcbiAgbWFwTG9vc2VJZGVudGljYWxcbn0gZnJvbSAnLi92aWV3X3V0aWxzJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JTdGF0ZSxcbiAgaXNEZWZhdWx0Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIGRldk1vZGVFcXVhbFxufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2NoYW5nZV9kZXRlY3Rpb24nO1xuaW1wb3J0IHt3dGZDcmVhdGVTY29wZSwgd3RmTGVhdmUsIFd0ZlNjb3BlRm59IGZyb20gJy4uL3Byb2ZpbGUvcHJvZmlsZSc7XG5pbXBvcnQge1xuICBFeHByZXNzaW9uQ2hhbmdlZEFmdGVySXRIYXNCZWVuQ2hlY2tlZEV4Y2VwdGlvbixcbiAgVmlld0Rlc3Ryb3llZEV4Y2VwdGlvbixcbiAgVmlld1dyYXBwZWRFeGNlcHRpb25cbn0gZnJvbSAnLi9leGNlcHRpb25zJztcbmltcG9ydCB7U3RhdGljTm9kZURlYnVnSW5mbywgRGVidWdDb250ZXh0fSBmcm9tICcuL2RlYnVnX2NvbnRleHQnO1xuaW1wb3J0IHtFbGVtZW50SW5qZWN0b3J9IGZyb20gJy4vZWxlbWVudF9pbmplY3Rvcic7XG5cbmNvbnN0IEVNUFRZX0NPTlRFWFQgPSBDT05TVF9FWFBSKG5ldyBPYmplY3QoKSk7XG5cbnZhciBfc2NvcGVfY2hlY2s6IFd0ZlNjb3BlRm4gPSB3dGZDcmVhdGVTY29wZShgQXBwVmlldyNjaGVjayhhc2NpaSBpZClgKTtcblxuLyoqXG4gKiBDb3N0IG9mIG1ha2luZyBvYmplY3RzOiBodHRwOi8vanNwZXJmLmNvbS9pbnN0YW50aWF0ZS1zaXplLW9mLW9iamVjdFxuICpcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFwcFZpZXc8VD4ge1xuICByZWY6IFZpZXdSZWZfO1xuICByb290Tm9kZXNPckFwcEVsZW1lbnRzOiBhbnlbXTtcbiAgYWxsTm9kZXM6IGFueVtdO1xuICBkaXNwb3NhYmxlczogRnVuY3Rpb25bXTtcbiAgc3Vic2NyaXB0aW9uczogYW55W107XG4gIGNvbnRlbnRDaGlsZHJlbjogQXBwVmlldzxhbnk+W10gPSBbXTtcbiAgdmlld0NoaWxkcmVuOiBBcHBWaWV3PGFueT5bXSA9IFtdO1xuICByZW5kZXJQYXJlbnQ6IEFwcFZpZXc8YW55PjtcbiAgdmlld0NvbnRhaW5lckVsZW1lbnQ6IEFwcEVsZW1lbnQgPSBudWxsO1xuXG4gIC8vIFRoZSBuYW1lcyBvZiB0aGUgYmVsb3cgZmllbGRzIG11c3QgYmUga2VwdCBpbiBzeW5jIHdpdGggY29kZWdlbl9uYW1lX3V0aWwudHMgb3JcbiAgLy8gY2hhbmdlIGRldGVjdGlvbiB3aWxsIGZhaWwuXG4gIGNkU3RhdGU6IENoYW5nZURldGVjdG9yU3RhdGUgPSBDaGFuZ2VEZXRlY3RvclN0YXRlLk5ldmVyQ2hlY2tlZDtcblxuICAvKipcbiAgICogVGhlIGNvbnRleHQgYWdhaW5zdCB3aGljaCBkYXRhLWJpbmRpbmcgZXhwcmVzc2lvbnMgaW4gdGhpcyB2aWV3IGFyZSBldmFsdWF0ZWQgYWdhaW5zdC5cbiAgICogVGhpcyBpcyBhbHdheXMgYSBjb21wb25lbnQgaW5zdGFuY2UuXG4gICAqL1xuICBjb250ZXh0OiBUID0gbnVsbDtcblxuICBwcm9qZWN0YWJsZU5vZGVzOiBBcnJheTxhbnkgfCBhbnlbXT47XG5cbiAgZGVzdHJveWVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcmVuZGVyZXI6IFJlbmRlcmVyO1xuXG4gIHByaXZhdGUgX2N1cnJlbnREZWJ1Z0NvbnRleHQ6IERlYnVnQ29udGV4dCA9IG51bGw7XG5cbiAgcHJpdmF0ZSBfaGFzRXh0ZXJuYWxIb3N0RWxlbWVudDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY2xheno6IGFueSwgcHVibGljIGNvbXBvbmVudFR5cGU6IFJlbmRlckNvbXBvbmVudFR5cGUsIHB1YmxpYyB0eXBlOiBWaWV3VHlwZSxcbiAgICAgICAgICAgICAgcHVibGljIGxvY2Fsczoge1trZXk6IHN0cmluZ106IGFueX0sIHB1YmxpYyB2aWV3VXRpbHM6IFZpZXdVdGlscyxcbiAgICAgICAgICAgICAgcHVibGljIHBhcmVudEluamVjdG9yOiBJbmplY3RvciwgcHVibGljIGRlY2xhcmF0aW9uQXBwRWxlbWVudDogQXBwRWxlbWVudCxcbiAgICAgICAgICAgICAgcHVibGljIGNkTW9kZTogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgICAgICAgICAgIHB1YmxpYyBzdGF0aWNOb2RlRGVidWdJbmZvczogU3RhdGljTm9kZURlYnVnSW5mb1tdKSB7XG4gICAgdGhpcy5yZWYgPSBuZXcgVmlld1JlZl8odGhpcyk7XG4gICAgaWYgKHR5cGUgPT09IFZpZXdUeXBlLkNPTVBPTkVOVCB8fCB0eXBlID09PSBWaWV3VHlwZS5IT1NUKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyID0gdmlld1V0aWxzLnJlbmRlckNvbXBvbmVudChjb21wb25lbnRUeXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJlciA9IGRlY2xhcmF0aW9uQXBwRWxlbWVudC5wYXJlbnRWaWV3LnJlbmRlcmVyO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZShnaXZlblByb2plY3RhYmxlTm9kZXM6IEFycmF5PGFueSB8IGFueVtdPiwgcm9vdFNlbGVjdG9yT3JOb2RlOiBzdHJpbmcgfCBhbnkpOiBBcHBFbGVtZW50IHtcbiAgICB2YXIgY29udGV4dDtcbiAgICB2YXIgcHJvamVjdGFibGVOb2RlcztcbiAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgY2FzZSBWaWV3VHlwZS5DT01QT05FTlQ6XG4gICAgICAgIGNvbnRleHQgPSB0aGlzLmRlY2xhcmF0aW9uQXBwRWxlbWVudC5jb21wb25lbnQ7XG4gICAgICAgIHByb2plY3RhYmxlTm9kZXMgPSBlbnN1cmVTbG90Q291bnQoZ2l2ZW5Qcm9qZWN0YWJsZU5vZGVzLCB0aGlzLmNvbXBvbmVudFR5cGUuc2xvdENvdW50KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFZpZXdUeXBlLkVNQkVEREVEOlxuICAgICAgICBjb250ZXh0ID0gdGhpcy5kZWNsYXJhdGlvbkFwcEVsZW1lbnQucGFyZW50Vmlldy5jb250ZXh0O1xuICAgICAgICBwcm9qZWN0YWJsZU5vZGVzID0gdGhpcy5kZWNsYXJhdGlvbkFwcEVsZW1lbnQucGFyZW50Vmlldy5wcm9qZWN0YWJsZU5vZGVzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVmlld1R5cGUuSE9TVDpcbiAgICAgICAgY29udGV4dCA9IEVNUFRZX0NPTlRFWFQ7XG4gICAgICAgIC8vIE5vdGU6IERvbid0IGVuc3VyZSB0aGUgc2xvdCBjb3VudCBmb3IgdGhlIHByb2plY3RhYmxlTm9kZXMgYXMgd2Ugc3RvcmVcbiAgICAgICAgLy8gdGhlbSBvbmx5IGZvciB0aGUgY29udGFpbmVkIGNvbXBvbmVudCB2aWV3ICh3aGljaCB3aWxsIGxhdGVyIGNoZWNrIHRoZSBzbG90IGNvdW50Li4uKVxuICAgICAgICBwcm9qZWN0YWJsZU5vZGVzID0gZ2l2ZW5Qcm9qZWN0YWJsZU5vZGVzO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgdGhpcy5faGFzRXh0ZXJuYWxIb3N0RWxlbWVudCA9IGlzUHJlc2VudChyb290U2VsZWN0b3JPck5vZGUpO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy5wcm9qZWN0YWJsZU5vZGVzID0gcHJvamVjdGFibGVOb2RlcztcbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUpIHtcbiAgICAgIHRoaXMuX3Jlc2V0RGVidWcoKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUludGVybmFsKHJvb3RTZWxlY3Rvck9yTm9kZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRoaXMuX3JldGhyb3dXaXRoQ29udGV4dChlLCBlLnN0YWNrKTtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlSW50ZXJuYWwocm9vdFNlbGVjdG9yT3JOb2RlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT3ZlcndyaXR0ZW4gYnkgaW1wbGVtZW50YXRpb25zLlxuICAgKiBSZXR1cm5zIHRoZSBBcHBFbGVtZW50IGZvciB0aGUgaG9zdCBlbGVtZW50IGZvciBWaWV3VHlwZS5IT1NULlxuICAgKi9cbiAgY3JlYXRlSW50ZXJuYWwocm9vdFNlbGVjdG9yT3JOb2RlOiBzdHJpbmcgfCBhbnkpOiBBcHBFbGVtZW50IHsgcmV0dXJuIG51bGw7IH1cblxuICBpbml0KHJvb3ROb2Rlc09yQXBwRWxlbWVudHM6IGFueVtdLCBhbGxOb2RlczogYW55W10sIGRpc3Bvc2FibGVzOiBGdW5jdGlvbltdLFxuICAgICAgIHN1YnNjcmlwdGlvbnM6IGFueVtdKSB7XG4gICAgdGhpcy5yb290Tm9kZXNPckFwcEVsZW1lbnRzID0gcm9vdE5vZGVzT3JBcHBFbGVtZW50cztcbiAgICB0aGlzLmFsbE5vZGVzID0gYWxsTm9kZXM7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IGRpc3Bvc2FibGVzO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IHN1YnNjcmlwdGlvbnM7XG4gICAgaWYgKHRoaXMudHlwZSA9PT0gVmlld1R5cGUuQ09NUE9ORU5UKSB7XG4gICAgICAvLyBOb3RlOiB0aGUgcmVuZGVyIG5vZGVzIGhhdmUgYmVlbiBhdHRhY2hlZCB0byB0aGVpciBob3N0IGVsZW1lbnRcbiAgICAgIC8vIGluIHRoZSBWaWV3RmFjdG9yeSBhbHJlYWR5LlxuICAgICAgdGhpcy5kZWNsYXJhdGlvbkFwcEVsZW1lbnQucGFyZW50Vmlldy52aWV3Q2hpbGRyZW4ucHVzaCh0aGlzKTtcbiAgICAgIHRoaXMucmVuZGVyUGFyZW50ID0gdGhpcy5kZWNsYXJhdGlvbkFwcEVsZW1lbnQucGFyZW50VmlldztcbiAgICAgIHRoaXMuZGlydHlQYXJlbnRRdWVyaWVzSW50ZXJuYWwoKTtcbiAgICB9XG4gIH1cblxuICBzZWxlY3RPckNyZWF0ZUhvc3RFbGVtZW50KGVsZW1lbnROYW1lOiBzdHJpbmcsIHJvb3RTZWxlY3Rvck9yTm9kZTogc3RyaW5nIHwgYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnQ3R4OiBEZWJ1Z0NvbnRleHQpOiBhbnkge1xuICAgIHZhciBob3N0RWxlbWVudDtcbiAgICBpZiAoaXNQcmVzZW50KHJvb3RTZWxlY3Rvck9yTm9kZSkpIHtcbiAgICAgIGhvc3RFbGVtZW50ID0gdGhpcy5yZW5kZXJlci5zZWxlY3RSb290RWxlbWVudChyb290U2VsZWN0b3JPck5vZGUsIGRlYnVnQ3R4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaG9zdEVsZW1lbnQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQobnVsbCwgZWxlbWVudE5hbWUsIGRlYnVnQ3R4KTtcbiAgICB9XG4gICAgcmV0dXJuIGhvc3RFbGVtZW50O1xuICB9XG5cbiAgaW5qZWN0b3JHZXQodG9rZW46IGFueSwgbm9kZUluZGV4OiBudW1iZXIsIG5vdEZvdW5kUmVzdWx0OiBhbnkpOiBhbnkge1xuICAgIGlmICh0aGlzLmRlYnVnTW9kZSkge1xuICAgICAgdGhpcy5fcmVzZXREZWJ1ZygpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5qZWN0b3JHZXRJbnRlcm5hbCh0b2tlbiwgbm9kZUluZGV4LCBub3RGb3VuZFJlc3VsdCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRoaXMuX3JldGhyb3dXaXRoQ29udGV4dChlLCBlLnN0YWNrKTtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuaW5qZWN0b3JHZXRJbnRlcm5hbCh0b2tlbiwgbm9kZUluZGV4LCBub3RGb3VuZFJlc3VsdCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJ3cml0dGVuIGJ5IGltcGxlbWVudGF0aW9uc1xuICAgKi9cbiAgaW5qZWN0b3JHZXRJbnRlcm5hbCh0b2tlbjogYW55LCBub2RlSW5kZXg6IG51bWJlciwgbm90Rm91bmRSZXN1bHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIG5vdEZvdW5kUmVzdWx0O1xuICB9XG5cbiAgaW5qZWN0b3Iobm9kZUluZGV4OiBudW1iZXIpOiBJbmplY3RvciB7XG4gICAgaWYgKGlzUHJlc2VudChub2RlSW5kZXgpKSB7XG4gICAgICByZXR1cm4gbmV3IEVsZW1lbnRJbmplY3Rvcih0aGlzLCBub2RlSW5kZXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnRJbmplY3RvcjtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9oYXNFeHRlcm5hbEhvc3RFbGVtZW50KSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmRldGFjaFZpZXcodGhpcy5mbGF0Um9vdE5vZGVzKTtcbiAgICB9IGVsc2UgaWYgKGlzUHJlc2VudCh0aGlzLnZpZXdDb250YWluZXJFbGVtZW50KSkge1xuICAgICAgdGhpcy52aWV3Q29udGFpbmVyRWxlbWVudC5kZXRhY2hWaWV3KHRoaXMudmlld0NvbnRhaW5lckVsZW1lbnQubmVzdGVkVmlld3MuaW5kZXhPZih0aGlzKSk7XG4gICAgfVxuICAgIHRoaXMuX2Rlc3Ryb3lSZWN1cnNlKCk7XG4gIH1cblxuICBwcml2YXRlIF9kZXN0cm95UmVjdXJzZSgpIHtcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGNoaWxkcmVuID0gdGhpcy5jb250ZW50Q2hpbGRyZW47XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGRyZW5baV0uX2Rlc3Ryb3lSZWN1cnNlKCk7XG4gICAgfVxuICAgIGNoaWxkcmVuID0gdGhpcy52aWV3Q2hpbGRyZW47XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGRyZW5baV0uX2Rlc3Ryb3lSZWN1cnNlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmRlYnVnTW9kZSkge1xuICAgICAgdGhpcy5fcmVzZXREZWJ1ZygpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5fZGVzdHJveUxvY2FsKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRoaXMuX3JldGhyb3dXaXRoQ29udGV4dChlLCBlLnN0YWNrKTtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZGVzdHJveUxvY2FsKCk7XG4gICAgfVxuXG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBfZGVzdHJveUxvY2FsKCkge1xuICAgIHZhciBob3N0RWxlbWVudCA9XG4gICAgICAgIHRoaXMudHlwZSA9PT0gVmlld1R5cGUuQ09NUE9ORU5UID8gdGhpcy5kZWNsYXJhdGlvbkFwcEVsZW1lbnQubmF0aXZlRWxlbWVudCA6IG51bGw7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRpc3Bvc2FibGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmRpc3Bvc2FibGVzW2ldKCk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdWJzY3JpcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBPYnNlcnZhYmxlV3JhcHBlci5kaXNwb3NlKHRoaXMuc3Vic2NyaXB0aW9uc1tpXSk7XG4gICAgfVxuICAgIHRoaXMuZGVzdHJveUludGVybmFsKCk7XG4gICAgaWYgKHRoaXMuX2hhc0V4dGVybmFsSG9zdEVsZW1lbnQpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuZGV0YWNoVmlldyh0aGlzLmZsYXRSb290Tm9kZXMpO1xuICAgIH0gZWxzZSBpZiAoaXNQcmVzZW50KHRoaXMudmlld0NvbnRhaW5lckVsZW1lbnQpKSB7XG4gICAgICB0aGlzLnZpZXdDb250YWluZXJFbGVtZW50LmRldGFjaFZpZXcodGhpcy52aWV3Q29udGFpbmVyRWxlbWVudC5uZXN0ZWRWaWV3cy5pbmRleE9mKHRoaXMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXJ0eVBhcmVudFF1ZXJpZXNJbnRlcm5hbCgpO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcmVyLmRlc3Ryb3lWaWV3KGhvc3RFbGVtZW50LCB0aGlzLmFsbE5vZGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVyd3JpdHRlbiBieSBpbXBsZW1lbnRhdGlvbnNcbiAgICovXG4gIGRlc3Ryb3lJbnRlcm5hbCgpOiB2b2lkIHt9XG5cbiAgZ2V0IGRlYnVnTW9kZSgpOiBib29sZWFuIHsgcmV0dXJuIGlzUHJlc2VudCh0aGlzLnN0YXRpY05vZGVEZWJ1Z0luZm9zKTsgfVxuXG4gIGdldCBjaGFuZ2VEZXRlY3RvclJlZigpOiBDaGFuZ2VEZXRlY3RvclJlZiB7IHJldHVybiB0aGlzLnJlZjsgfVxuXG4gIGdldCBwYXJlbnQoKTogQXBwVmlldzxhbnk+IHtcbiAgICByZXR1cm4gaXNQcmVzZW50KHRoaXMuZGVjbGFyYXRpb25BcHBFbGVtZW50KSA/IHRoaXMuZGVjbGFyYXRpb25BcHBFbGVtZW50LnBhcmVudFZpZXcgOiBudWxsO1xuICB9XG5cbiAgZ2V0IGZsYXRSb290Tm9kZXMoKTogYW55W10geyByZXR1cm4gZmxhdHRlbk5lc3RlZFZpZXdSZW5kZXJOb2Rlcyh0aGlzLnJvb3ROb2Rlc09yQXBwRWxlbWVudHMpOyB9XG5cbiAgZ2V0IGxhc3RSb290Tm9kZSgpOiBhbnkge1xuICAgIHZhciBsYXN0Tm9kZSA9IHRoaXMucm9vdE5vZGVzT3JBcHBFbGVtZW50cy5sZW5ndGggPiAwID9cbiAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290Tm9kZXNPckFwcEVsZW1lbnRzW3RoaXMucm9vdE5vZGVzT3JBcHBFbGVtZW50cy5sZW5ndGggLSAxXSA6XG4gICAgICAgICAgICAgICAgICAgICAgIG51bGw7XG4gICAgcmV0dXJuIF9maW5kTGFzdFJlbmRlck5vZGUobGFzdE5vZGUpO1xuICB9XG5cbiAgaGFzTG9jYWwoY29udGV4dE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBTdHJpbmdNYXBXcmFwcGVyLmNvbnRhaW5zKHRoaXMubG9jYWxzLCBjb250ZXh0TmFtZSk7XG4gIH1cblxuICBzZXRMb2NhbChjb250ZXh0TmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7IHRoaXMubG9jYWxzW2NvbnRleHROYW1lXSA9IHZhbHVlOyB9XG5cbiAgLyoqXG4gICAqIE92ZXJ3cml0dGVuIGJ5IGltcGxlbWVudGF0aW9uc1xuICAgKi9cbiAgZGlydHlQYXJlbnRRdWVyaWVzSW50ZXJuYWwoKTogdm9pZCB7fVxuXG4gIGFkZFJlbmRlckNvbnRlbnRDaGlsZCh2aWV3OiBBcHBWaWV3PGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRlbnRDaGlsZHJlbi5wdXNoKHZpZXcpO1xuICAgIHZpZXcucmVuZGVyUGFyZW50ID0gdGhpcztcbiAgICB2aWV3LmRpcnR5UGFyZW50UXVlcmllc0ludGVybmFsKCk7XG4gIH1cblxuICByZW1vdmVDb250ZW50Q2hpbGQodmlldzogQXBwVmlldzxhbnk+KTogdm9pZCB7XG4gICAgTGlzdFdyYXBwZXIucmVtb3ZlKHRoaXMuY29udGVudENoaWxkcmVuLCB2aWV3KTtcbiAgICB2aWV3LmRpcnR5UGFyZW50UXVlcmllc0ludGVybmFsKCk7XG4gICAgdmlldy5yZW5kZXJQYXJlbnQgPSBudWxsO1xuICB9XG5cbiAgZGV0ZWN0Q2hhbmdlcyh0aHJvd09uQ2hhbmdlOiBib29sZWFuKTogdm9pZCB7XG4gICAgdmFyIHMgPSBfc2NvcGVfY2hlY2sodGhpcy5jbGF6eik7XG4gICAgaWYgKHRoaXMuY2RNb2RlID09PSBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZXRhY2hlZCB8fFxuICAgICAgICB0aGlzLmNkTW9kZSA9PT0gQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuQ2hlY2tlZCB8fFxuICAgICAgICB0aGlzLmNkU3RhdGUgPT09IENoYW5nZURldGVjdG9yU3RhdGUuRXJyb3JlZClcbiAgICAgIHJldHVybjtcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICAgIHRoaXMudGhyb3dEZXN0cm95ZWRFcnJvcignZGV0ZWN0Q2hhbmdlcycpO1xuICAgIH1cbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUpIHtcbiAgICAgIHRoaXMuX3Jlc2V0RGVidWcoKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZGV0ZWN0Q2hhbmdlc0ludGVybmFsKHRocm93T25DaGFuZ2UpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aGlzLl9yZXRocm93V2l0aENvbnRleHQoZSwgZS5zdGFjayk7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGV0ZWN0Q2hhbmdlc0ludGVybmFsKHRocm93T25DaGFuZ2UpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jZE1vZGUgPT09IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkNoZWNrT25jZSlcbiAgICAgIHRoaXMuY2RNb2RlID0gQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuQ2hlY2tlZDtcblxuICAgIHRoaXMuY2RTdGF0ZSA9IENoYW5nZURldGVjdG9yU3RhdGUuQ2hlY2tlZEJlZm9yZTtcbiAgICB3dGZMZWF2ZShzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVyd3JpdHRlbiBieSBpbXBsZW1lbnRhdGlvbnNcbiAgICovXG4gIGRldGVjdENoYW5nZXNJbnRlcm5hbCh0aHJvd09uQ2hhbmdlOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kZXRlY3RDb250ZW50Q2hpbGRyZW5DaGFuZ2VzKHRocm93T25DaGFuZ2UpO1xuICAgIHRoaXMuZGV0ZWN0Vmlld0NoaWxkcmVuQ2hhbmdlcyh0aHJvd09uQ2hhbmdlKTtcbiAgfVxuXG4gIGRldGVjdENvbnRlbnRDaGlsZHJlbkNoYW5nZXModGhyb3dPbkNoYW5nZTogYm9vbGVhbikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb250ZW50Q2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgIHRoaXMuY29udGVudENoaWxkcmVuW2ldLmRldGVjdENoYW5nZXModGhyb3dPbkNoYW5nZSk7XG4gICAgfVxuICB9XG5cbiAgZGV0ZWN0Vmlld0NoaWxkcmVuQ2hhbmdlcyh0aHJvd09uQ2hhbmdlOiBib29sZWFuKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnZpZXdDaGlsZHJlbi5sZW5ndGg7ICsraSkge1xuICAgICAgdGhpcy52aWV3Q2hpbGRyZW5baV0uZGV0ZWN0Q2hhbmdlcyh0aHJvd09uQ2hhbmdlKTtcbiAgICB9XG4gIH1cblxuICBhZGRUb0NvbnRlbnRDaGlsZHJlbihyZW5kZXJBcHBFbGVtZW50OiBBcHBFbGVtZW50KTogdm9pZCB7XG4gICAgcmVuZGVyQXBwRWxlbWVudC5wYXJlbnRWaWV3LmNvbnRlbnRDaGlsZHJlbi5wdXNoKHRoaXMpO1xuICAgIHRoaXMudmlld0NvbnRhaW5lckVsZW1lbnQgPSByZW5kZXJBcHBFbGVtZW50O1xuICAgIHRoaXMuZGlydHlQYXJlbnRRdWVyaWVzSW50ZXJuYWwoKTtcbiAgfVxuXG4gIHJlbW92ZUZyb21Db250ZW50Q2hpbGRyZW4ocmVuZGVyQXBwRWxlbWVudDogQXBwRWxlbWVudCk6IHZvaWQge1xuICAgIExpc3RXcmFwcGVyLnJlbW92ZShyZW5kZXJBcHBFbGVtZW50LnBhcmVudFZpZXcuY29udGVudENoaWxkcmVuLCB0aGlzKTtcbiAgICB0aGlzLmRpcnR5UGFyZW50UXVlcmllc0ludGVybmFsKCk7XG4gICAgdGhpcy52aWV3Q29udGFpbmVyRWxlbWVudCA9IG51bGw7XG4gIH1cblxuICBtYXJrQXNDaGVja09uY2UoKTogdm9pZCB7IHRoaXMuY2RNb2RlID0gQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuQ2hlY2tPbmNlOyB9XG5cbiAgbWFya1BhdGhUb1Jvb3RBc0NoZWNrT25jZSgpOiB2b2lkIHtcbiAgICB2YXIgYzogQXBwVmlldzxhbnk+ID0gdGhpcztcbiAgICB3aGlsZSAoaXNQcmVzZW50KGMpICYmIGMuY2RNb2RlICE9PSBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZXRhY2hlZCkge1xuICAgICAgaWYgKGMuY2RNb2RlID09PSBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5DaGVja2VkKSB7XG4gICAgICAgIGMuY2RNb2RlID0gQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuQ2hlY2tPbmNlO1xuICAgICAgfVxuICAgICAgYyA9IGMucmVuZGVyUGFyZW50O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3Jlc2V0RGVidWcoKSB7IHRoaXMuX2N1cnJlbnREZWJ1Z0NvbnRleHQgPSBudWxsOyB9XG5cbiAgZGVidWcobm9kZUluZGV4OiBudW1iZXIsIHJvd051bTogbnVtYmVyLCBjb2xOdW06IG51bWJlcik6IERlYnVnQ29udGV4dCB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnREZWJ1Z0NvbnRleHQgPSBuZXcgRGVidWdDb250ZXh0KHRoaXMsIG5vZGVJbmRleCwgcm93TnVtLCBjb2xOdW0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmV0aHJvd1dpdGhDb250ZXh0KGU6IGFueSwgc3RhY2s6IGFueSkge1xuICAgIGlmICghKGUgaW5zdGFuY2VvZiBWaWV3V3JhcHBlZEV4Y2VwdGlvbikpIHtcbiAgICAgIGlmICghKGUgaW5zdGFuY2VvZiBFeHByZXNzaW9uQ2hhbmdlZEFmdGVySXRIYXNCZWVuQ2hlY2tlZEV4Y2VwdGlvbikpIHtcbiAgICAgICAgdGhpcy5jZFN0YXRlID0gQ2hhbmdlRGV0ZWN0b3JTdGF0ZS5FcnJvcmVkO1xuICAgICAgfVxuICAgICAgaWYgKGlzUHJlc2VudCh0aGlzLl9jdXJyZW50RGVidWdDb250ZXh0KSkge1xuICAgICAgICB0aHJvdyBuZXcgVmlld1dyYXBwZWRFeGNlcHRpb24oZSwgc3RhY2ssIHRoaXMuX2N1cnJlbnREZWJ1Z0NvbnRleHQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGV2ZW50SGFuZGxlcihjYjogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XG4gICAgaWYgKHRoaXMuZGVidWdNb2RlKSB7XG4gICAgICByZXR1cm4gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuX3Jlc2V0RGVidWcoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gY2IoZXZlbnQpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgdGhpcy5fcmV0aHJvd1dpdGhDb250ZXh0KGUsIGUuc3RhY2spO1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYjtcbiAgICB9XG4gIH1cblxuICB0aHJvd0Rlc3Ryb3llZEVycm9yKGRldGFpbHM6IHN0cmluZyk6IHZvaWQgeyB0aHJvdyBuZXcgVmlld0Rlc3Ryb3llZEV4Y2VwdGlvbihkZXRhaWxzKTsgfVxufVxuXG5mdW5jdGlvbiBfZmluZExhc3RSZW5kZXJOb2RlKG5vZGU6IGFueSk6IGFueSB7XG4gIHZhciBsYXN0Tm9kZTtcbiAgaWYgKG5vZGUgaW5zdGFuY2VvZiBBcHBFbGVtZW50KSB7XG4gICAgdmFyIGFwcEVsID0gPEFwcEVsZW1lbnQ+bm9kZTtcbiAgICBsYXN0Tm9kZSA9IGFwcEVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKGlzUHJlc2VudChhcHBFbC5uZXN0ZWRWaWV3cykpIHtcbiAgICAgIC8vIE5vdGU6IFZpZXdzIG1pZ2h0IGhhdmUgbm8gcm9vdCBub2RlcyBhdCBhbGwhXG4gICAgICBmb3IgKHZhciBpID0gYXBwRWwubmVzdGVkVmlld3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgdmFyIG5lc3RlZFZpZXcgPSBhcHBFbC5uZXN0ZWRWaWV3c1tpXTtcbiAgICAgICAgaWYgKG5lc3RlZFZpZXcucm9vdE5vZGVzT3JBcHBFbGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgbGFzdE5vZGUgPSBfZmluZExhc3RSZW5kZXJOb2RlKFxuICAgICAgICAgICAgICBuZXN0ZWRWaWV3LnJvb3ROb2Rlc09yQXBwRWxlbWVudHNbbmVzdGVkVmlldy5yb290Tm9kZXNPckFwcEVsZW1lbnRzLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBsYXN0Tm9kZSA9IG5vZGU7XG4gIH1cbiAgcmV0dXJuIGxhc3ROb2RlO1xufVxuIl19