var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { PromiseWrapper, EventEmitter } from 'angular2/src/facade/async';
import { StringMapWrapper } from 'angular2/src/facade/collection';
import { isBlank, isPresent } from 'angular2/src/facade/lang';
import { Directive, Attribute, DynamicComponentLoader, ViewContainerRef, provide, ReflectiveInjector, Output } from 'angular2/core';
import * as routerMod from '../router';
import { RouteParams, RouteData } from '../instruction';
import * as hookMod from '../lifecycle/lifecycle_annotations';
import { hasLifecycleHook } from '../lifecycle/route_lifecycle_reflector';
let _resolveToTrue = PromiseWrapper.resolve(true);
/**
 * A router outlet is a placeholder that Angular dynamically fills based on the application's route.
 *
 * ## Use
 *
 * ```
 * <router-outlet></router-outlet>
 * ```
 */
export let RouterOutlet = class RouterOutlet {
    constructor(_viewContainerRef, _loader, _parentRouter, nameAttr) {
        this._viewContainerRef = _viewContainerRef;
        this._loader = _loader;
        this._parentRouter = _parentRouter;
        this.name = null;
        this._componentRef = null;
        this._currentInstruction = null;
        this.activateEvents = new EventEmitter();
        if (isPresent(nameAttr)) {
            this.name = nameAttr;
            this._parentRouter.registerAuxOutlet(this);
        }
        else {
            this._parentRouter.registerPrimaryOutlet(this);
        }
    }
    /**
     * Called by the Router to instantiate a new component during the commit phase of a navigation.
     * This method in turn is responsible for calling the `routerOnActivate` hook of its child.
     */
    activate(nextInstruction) {
        var previousInstruction = this._currentInstruction;
        this._currentInstruction = nextInstruction;
        var componentType = nextInstruction.componentType;
        var childRouter = this._parentRouter.childRouter(componentType);
        var providers = ReflectiveInjector.resolve([
            provide(RouteData, { useValue: nextInstruction.routeData }),
            provide(RouteParams, { useValue: new RouteParams(nextInstruction.params) }),
            provide(routerMod.Router, { useValue: childRouter })
        ]);
        this._componentRef =
            this._loader.loadNextToLocation(componentType, this._viewContainerRef, providers);
        return this._componentRef.then((componentRef) => {
            this.activateEvents.emit(componentRef.instance);
            if (hasLifecycleHook(hookMod.routerOnActivate, componentType)) {
                return this._componentRef.then((ref) => ref.instance.routerOnActivate(nextInstruction, previousInstruction));
            }
            else {
                return componentRef;
            }
        });
    }
    /**
     * Called by the {@link Router} during the commit phase of a navigation when an outlet
     * reuses a component between different routes.
     * This method in turn is responsible for calling the `routerOnReuse` hook of its child.
     */
    reuse(nextInstruction) {
        var previousInstruction = this._currentInstruction;
        this._currentInstruction = nextInstruction;
        // it's possible the component is removed before it can be reactivated (if nested withing
        // another dynamically loaded component, for instance). In that case, we simply activate
        // a new one.
        if (isBlank(this._componentRef)) {
            return this.activate(nextInstruction);
        }
        else {
            return PromiseWrapper.resolve(hasLifecycleHook(hookMod.routerOnReuse, this._currentInstruction.componentType) ?
                this._componentRef.then((ref) => ref.instance.routerOnReuse(nextInstruction, previousInstruction)) :
                true);
        }
    }
    /**
     * Called by the {@link Router} when an outlet disposes of a component's contents.
     * This method in turn is responsible for calling the `routerOnDeactivate` hook of its child.
     */
    deactivate(nextInstruction) {
        var next = _resolveToTrue;
        if (isPresent(this._componentRef) && isPresent(this._currentInstruction) &&
            hasLifecycleHook(hookMod.routerOnDeactivate, this._currentInstruction.componentType)) {
            next = this._componentRef.then((ref) => ref.instance
                .routerOnDeactivate(nextInstruction, this._currentInstruction));
        }
        return next.then((_) => {
            if (isPresent(this._componentRef)) {
                var onDispose = this._componentRef.then((ref) => ref.destroy());
                this._componentRef = null;
                return onDispose;
            }
        });
    }
    /**
     * Called by the {@link Router} during recognition phase of a navigation.
     *
     * If this resolves to `false`, the given navigation is cancelled.
     *
     * This method delegates to the child component's `routerCanDeactivate` hook if it exists,
     * and otherwise resolves to true.
     */
    routerCanDeactivate(nextInstruction) {
        if (isBlank(this._currentInstruction)) {
            return _resolveToTrue;
        }
        if (hasLifecycleHook(hookMod.routerCanDeactivate, this._currentInstruction.componentType)) {
            return this._componentRef.then((ref) => ref.instance
                .routerCanDeactivate(nextInstruction, this._currentInstruction));
        }
        else {
            return _resolveToTrue;
        }
    }
    /**
     * Called by the {@link Router} during recognition phase of a navigation.
     *
     * If the new child component has a different Type than the existing child component,
     * this will resolve to `false`. You can't reuse an old component when the new component
     * is of a different Type.
     *
     * Otherwise, this method delegates to the child component's `routerCanReuse` hook if it exists,
     * or resolves to true if the hook is not present.
     */
    routerCanReuse(nextInstruction) {
        var result;
        if (isBlank(this._currentInstruction) ||
            this._currentInstruction.componentType != nextInstruction.componentType) {
            result = false;
        }
        else if (hasLifecycleHook(hookMod.routerCanReuse, this._currentInstruction.componentType)) {
            result = this._componentRef.then((ref) => ref.instance.routerCanReuse(nextInstruction, this._currentInstruction));
        }
        else {
            result = nextInstruction == this._currentInstruction ||
                (isPresent(nextInstruction.params) && isPresent(this._currentInstruction.params) &&
                    StringMapWrapper.equals(nextInstruction.params, this._currentInstruction.params));
        }
        return PromiseWrapper.resolve(result);
    }
    ngOnDestroy() { this._parentRouter.unregisterPrimaryOutlet(this); }
};
__decorate([
    Output('activate'), 
    __metadata('design:type', Object)
], RouterOutlet.prototype, "activateEvents", void 0);
RouterOutlet = __decorate([
    Directive({ selector: 'router-outlet' }),
    __param(3, Attribute('name')), 
    __metadata('design:paramtypes', [ViewContainerRef, DynamicComponentLoader, routerMod.Router, String])
], RouterOutlet);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX291dGxldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUQxaUdRVkcudG1wL2FuZ3VsYXIyL3NyYy9yb3V0ZXIvZGlyZWN0aXZlcy9yb3V0ZXJfb3V0bGV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztPQUFPLEVBQUMsY0FBYyxFQUFFLFlBQVksRUFBQyxNQUFNLDJCQUEyQjtPQUMvRCxFQUFDLGdCQUFnQixFQUFDLE1BQU0sZ0NBQWdDO09BQ3hELEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBQyxNQUFNLDBCQUEwQjtPQUVwRCxFQUNMLFNBQVMsRUFDVCxTQUFTLEVBQ1Qsc0JBQXNCLEVBRXRCLGdCQUFnQixFQUNoQixPQUFPLEVBQ1Asa0JBQWtCLEVBRWxCLE1BQU0sRUFDUCxNQUFNLGVBQWU7T0FFZixLQUFLLFNBQVMsTUFBTSxXQUFXO09BQy9CLEVBQXVCLFdBQVcsRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0I7T0FDcEUsS0FBSyxPQUFPLE1BQU0sb0NBQW9DO09BQ3RELEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx3Q0FBd0M7QUFHdkUsSUFBSSxjQUFjLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUVsRDs7Ozs7Ozs7R0FRRztBQUVIO0lBT0UsWUFBb0IsaUJBQW1DLEVBQVUsT0FBK0IsRUFDNUUsYUFBK0IsRUFBcUIsUUFBZ0I7UUFEcEUsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQXdCO1FBQzVFLGtCQUFhLEdBQWIsYUFBYSxDQUFrQjtRQVBuRCxTQUFJLEdBQVcsSUFBSSxDQUFDO1FBQ1osa0JBQWEsR0FBMEIsSUFBSSxDQUFDO1FBQzVDLHdCQUFtQixHQUF5QixJQUFJLENBQUM7UUFFOUIsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBSWxFLEVBQUUs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TSxDQUFDO29CQUMvRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM5RixDQUFDO1FBQ0QsTUFBTSxDQUFtQixjQUFjLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxXQUFXLEtBQVcsSUFBSSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQTFJQztJQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7O29EQUFBO0FBTnJCO0lBQUMsU0FBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGVBQWUsRUFBQyxDQUFDO2VBU2lCLFNBQVMsQ0FBQyxNQUFNLENBQUM7eUZBQTFCLE1BQU07Z0JBVGQ7QUFnSnRDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQcm9taXNlV3JhcHBlciwgRXZlbnRFbWl0dGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jJztcbmltcG9ydCB7U3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7aXNCbGFuaywgaXNQcmVzZW50fSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEF0dHJpYnV0ZSxcbiAgRHluYW1pY0NvbXBvbmVudExvYWRlcixcbiAgQ29tcG9uZW50UmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBwcm92aWRlLFxuICBSZWZsZWN0aXZlSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0XG59IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuXG5pbXBvcnQgKiBhcyByb3V0ZXJNb2QgZnJvbSAnLi4vcm91dGVyJztcbmltcG9ydCB7Q29tcG9uZW50SW5zdHJ1Y3Rpb24sIFJvdXRlUGFyYW1zLCBSb3V0ZURhdGF9IGZyb20gJy4uL2luc3RydWN0aW9uJztcbmltcG9ydCAqIGFzIGhvb2tNb2QgZnJvbSAnLi4vbGlmZWN5Y2xlL2xpZmVjeWNsZV9hbm5vdGF0aW9ucyc7XG5pbXBvcnQge2hhc0xpZmVjeWNsZUhvb2t9IGZyb20gJy4uL2xpZmVjeWNsZS9yb3V0ZV9saWZlY3ljbGVfcmVmbGVjdG9yJztcbmltcG9ydCB7T25BY3RpdmF0ZSwgQ2FuUmV1c2UsIE9uUmV1c2UsIE9uRGVhY3RpdmF0ZSwgQ2FuRGVhY3RpdmF0ZX0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XG5cbmxldCBfcmVzb2x2ZVRvVHJ1ZSA9IFByb21pc2VXcmFwcGVyLnJlc29sdmUodHJ1ZSk7XG5cbi8qKlxuICogQSByb3V0ZXIgb3V0bGV0IGlzIGEgcGxhY2Vob2xkZXIgdGhhdCBBbmd1bGFyIGR5bmFtaWNhbGx5IGZpbGxzIGJhc2VkIG9uIHRoZSBhcHBsaWNhdGlvbidzIHJvdXRlLlxuICpcbiAqICMjIFVzZVxuICpcbiAqIGBgYFxuICogPHJvdXRlci1vdXRsZXQ+PC9yb3V0ZXItb3V0bGV0PlxuICogYGBgXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAncm91dGVyLW91dGxldCd9KVxuZXhwb3J0IGNsYXNzIFJvdXRlck91dGxldCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIG5hbWU6IHN0cmluZyA9IG51bGw7XG4gIHByaXZhdGUgX2NvbXBvbmVudFJlZjogUHJvbWlzZTxDb21wb25lbnRSZWY+ID0gbnVsbDtcbiAgcHJpdmF0ZSBfY3VycmVudEluc3RydWN0aW9uOiBDb21wb25lbnRJbnN0cnVjdGlvbiA9IG51bGw7XG5cbiAgQE91dHB1dCgnYWN0aXZhdGUnKSBwdWJsaWMgYWN0aXZhdGVFdmVudHMgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLCBwcml2YXRlIF9sb2FkZXI6IER5bmFtaWNDb21wb25lbnRMb2FkZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3BhcmVudFJvdXRlcjogcm91dGVyTW9kLlJvdXRlciwgQEF0dHJpYnV0ZSgnbmFtZScpIG5hbWVBdHRyOiBzdHJpbmcpIHtcbiAgICBpZiAoaXNQcmVzZW50KG5hbWVBdHRyKSkge1xuICAgICAgdGhpcy5uYW1lID0gbmFtZUF0dHI7XG4gICAgICB0aGlzLl9wYXJlbnRSb3V0ZXIucmVnaXN0ZXJBdXhPdXRsZXQodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3BhcmVudFJvdXRlci5yZWdpc3RlclByaW1hcnlPdXRsZXQodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCBieSB0aGUgUm91dGVyIHRvIGluc3RhbnRpYXRlIGEgbmV3IGNvbXBvbmVudCBkdXJpbmcgdGhlIGNvbW1pdCBwaGFzZSBvZiBhIG5hdmlnYXRpb24uXG4gICAqIFRoaXMgbWV0aG9kIGluIHR1cm4gaXMgcmVzcG9uc2libGUgZm9yIGNhbGxpbmcgdGhlIGByb3V0ZXJPbkFjdGl2YXRlYCBob29rIG9mIGl0cyBjaGlsZC5cbiAgICovXG4gIGFjdGl2YXRlKG5leHRJbnN0cnVjdGlvbjogQ29tcG9uZW50SW5zdHJ1Y3Rpb24pOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBwcmV2aW91c0luc3RydWN0aW9uID0gdGhpcy5fY3VycmVudEluc3RydWN0aW9uO1xuICAgIHRoaXMuX2N1cnJlbnRJbnN0cnVjdGlvbiA9IG5leHRJbnN0cnVjdGlvbjtcbiAgICB2YXIgY29tcG9uZW50VHlwZSA9IG5leHRJbnN0cnVjdGlvbi5jb21wb25lbnRUeXBlO1xuICAgIHZhciBjaGlsZFJvdXRlciA9IHRoaXMuX3BhcmVudFJvdXRlci5jaGlsZFJvdXRlcihjb21wb25lbnRUeXBlKTtcblxuICAgIHZhciBwcm92aWRlcnMgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZShbXG4gICAgICBwcm92aWRlKFJvdXRlRGF0YSwge3VzZVZhbHVlOiBuZXh0SW5zdHJ1Y3Rpb24ucm91dGVEYXRhfSksXG4gICAgICBwcm92aWRlKFJvdXRlUGFyYW1zLCB7dXNlVmFsdWU6IG5ldyBSb3V0ZVBhcmFtcyhuZXh0SW5zdHJ1Y3Rpb24ucGFyYW1zKX0pLFxuICAgICAgcHJvdmlkZShyb3V0ZXJNb2QuUm91dGVyLCB7dXNlVmFsdWU6IGNoaWxkUm91dGVyfSlcbiAgICBdKTtcbiAgICB0aGlzLl9jb21wb25lbnRSZWYgPVxuICAgICAgICB0aGlzLl9sb2FkZXIubG9hZE5leHRUb0xvY2F0aW9uKGNvbXBvbmVudFR5cGUsIHRoaXMuX3ZpZXdDb250YWluZXJSZWYsIHByb3ZpZGVycyk7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudFJlZi50aGVuKChjb21wb25lbnRSZWYpID0+IHtcbiAgICAgIHRoaXMuYWN0aXZhdGVFdmVudHMuZW1pdChjb21wb25lbnRSZWYuaW5zdGFuY2UpO1xuICAgICAgaWYgKGhhc0xpZmVjeWNsZUhvb2soaG9va01vZC5yb3V0ZXJPbkFjdGl2YXRlLCBjb21wb25lbnRUeXBlKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50UmVmLnRoZW4oXG4gICAgICAgICAgICAocmVmOiBDb21wb25lbnRSZWYpID0+XG4gICAgICAgICAgICAgICAgKDxPbkFjdGl2YXRlPnJlZi5pbnN0YW5jZSkucm91dGVyT25BY3RpdmF0ZShuZXh0SW5zdHJ1Y3Rpb24sIHByZXZpb3VzSW5zdHJ1Y3Rpb24pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjb21wb25lbnRSZWY7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIGJ5IHRoZSB7QGxpbmsgUm91dGVyfSBkdXJpbmcgdGhlIGNvbW1pdCBwaGFzZSBvZiBhIG5hdmlnYXRpb24gd2hlbiBhbiBvdXRsZXRcbiAgICogcmV1c2VzIGEgY29tcG9uZW50IGJldHdlZW4gZGlmZmVyZW50IHJvdXRlcy5cbiAgICogVGhpcyBtZXRob2QgaW4gdHVybiBpcyByZXNwb25zaWJsZSBmb3IgY2FsbGluZyB0aGUgYHJvdXRlck9uUmV1c2VgIGhvb2sgb2YgaXRzIGNoaWxkLlxuICAgKi9cbiAgcmV1c2UobmV4dEluc3RydWN0aW9uOiBDb21wb25lbnRJbnN0cnVjdGlvbik6IFByb21pc2U8YW55PiB7XG4gICAgdmFyIHByZXZpb3VzSW5zdHJ1Y3Rpb24gPSB0aGlzLl9jdXJyZW50SW5zdHJ1Y3Rpb247XG4gICAgdGhpcy5fY3VycmVudEluc3RydWN0aW9uID0gbmV4dEluc3RydWN0aW9uO1xuXG4gICAgLy8gaXQncyBwb3NzaWJsZSB0aGUgY29tcG9uZW50IGlzIHJlbW92ZWQgYmVmb3JlIGl0IGNhbiBiZSByZWFjdGl2YXRlZCAoaWYgbmVzdGVkIHdpdGhpbmdcbiAgICAvLyBhbm90aGVyIGR5bmFtaWNhbGx5IGxvYWRlZCBjb21wb25lbnQsIGZvciBpbnN0YW5jZSkuIEluIHRoYXQgY2FzZSwgd2Ugc2ltcGx5IGFjdGl2YXRlXG4gICAgLy8gYSBuZXcgb25lLlxuICAgIGlmIChpc0JsYW5rKHRoaXMuX2NvbXBvbmVudFJlZikpIHtcbiAgICAgIHJldHVybiB0aGlzLmFjdGl2YXRlKG5leHRJbnN0cnVjdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlV3JhcHBlci5yZXNvbHZlKFxuICAgICAgICAgIGhhc0xpZmVjeWNsZUhvb2soaG9va01vZC5yb3V0ZXJPblJldXNlLCB0aGlzLl9jdXJyZW50SW5zdHJ1Y3Rpb24uY29tcG9uZW50VHlwZSkgP1xuICAgICAgICAgICAgICB0aGlzLl9jb21wb25lbnRSZWYudGhlbihcbiAgICAgICAgICAgICAgICAgIChyZWY6IENvbXBvbmVudFJlZikgPT5cbiAgICAgICAgICAgICAgICAgICAgICAoPE9uUmV1c2U+cmVmLmluc3RhbmNlKS5yb3V0ZXJPblJldXNlKG5leHRJbnN0cnVjdGlvbiwgcHJldmlvdXNJbnN0cnVjdGlvbikpIDpcbiAgICAgICAgICAgICAgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCBieSB0aGUge0BsaW5rIFJvdXRlcn0gd2hlbiBhbiBvdXRsZXQgZGlzcG9zZXMgb2YgYSBjb21wb25lbnQncyBjb250ZW50cy5cbiAgICogVGhpcyBtZXRob2QgaW4gdHVybiBpcyByZXNwb25zaWJsZSBmb3IgY2FsbGluZyB0aGUgYHJvdXRlck9uRGVhY3RpdmF0ZWAgaG9vayBvZiBpdHMgY2hpbGQuXG4gICAqL1xuICBkZWFjdGl2YXRlKG5leHRJbnN0cnVjdGlvbjogQ29tcG9uZW50SW5zdHJ1Y3Rpb24pOiBQcm9taXNlPGFueT4ge1xuICAgIHZhciBuZXh0ID0gX3Jlc29sdmVUb1RydWU7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLl9jb21wb25lbnRSZWYpICYmIGlzUHJlc2VudCh0aGlzLl9jdXJyZW50SW5zdHJ1Y3Rpb24pICYmXG4gICAgICAgIGhhc0xpZmVjeWNsZUhvb2soaG9va01vZC5yb3V0ZXJPbkRlYWN0aXZhdGUsIHRoaXMuX2N1cnJlbnRJbnN0cnVjdGlvbi5jb21wb25lbnRUeXBlKSkge1xuICAgICAgbmV4dCA9IHRoaXMuX2NvbXBvbmVudFJlZi50aGVuKFxuICAgICAgICAgIChyZWY6IENvbXBvbmVudFJlZikgPT5cbiAgICAgICAgICAgICAgKDxPbkRlYWN0aXZhdGU+cmVmLmluc3RhbmNlKVxuICAgICAgICAgICAgICAgICAgLnJvdXRlck9uRGVhY3RpdmF0ZShuZXh0SW5zdHJ1Y3Rpb24sIHRoaXMuX2N1cnJlbnRJbnN0cnVjdGlvbikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV4dC50aGVuKChfKSA9PiB7XG4gICAgICBpZiAoaXNQcmVzZW50KHRoaXMuX2NvbXBvbmVudFJlZikpIHtcbiAgICAgICAgdmFyIG9uRGlzcG9zZSA9IHRoaXMuX2NvbXBvbmVudFJlZi50aGVuKChyZWY6IENvbXBvbmVudFJlZikgPT4gcmVmLmRlc3Ryb3koKSk7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudFJlZiA9IG51bGw7XG4gICAgICAgIHJldHVybiBvbkRpc3Bvc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIGJ5IHRoZSB7QGxpbmsgUm91dGVyfSBkdXJpbmcgcmVjb2duaXRpb24gcGhhc2Ugb2YgYSBuYXZpZ2F0aW9uLlxuICAgKlxuICAgKiBJZiB0aGlzIHJlc29sdmVzIHRvIGBmYWxzZWAsIHRoZSBnaXZlbiBuYXZpZ2F0aW9uIGlzIGNhbmNlbGxlZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgZGVsZWdhdGVzIHRvIHRoZSBjaGlsZCBjb21wb25lbnQncyBgcm91dGVyQ2FuRGVhY3RpdmF0ZWAgaG9vayBpZiBpdCBleGlzdHMsXG4gICAqIGFuZCBvdGhlcndpc2UgcmVzb2x2ZXMgdG8gdHJ1ZS5cbiAgICovXG4gIHJvdXRlckNhbkRlYWN0aXZhdGUobmV4dEluc3RydWN0aW9uOiBDb21wb25lbnRJbnN0cnVjdGlvbik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmIChpc0JsYW5rKHRoaXMuX2N1cnJlbnRJbnN0cnVjdGlvbikpIHtcbiAgICAgIHJldHVybiBfcmVzb2x2ZVRvVHJ1ZTtcbiAgICB9XG4gICAgaWYgKGhhc0xpZmVjeWNsZUhvb2soaG9va01vZC5yb3V0ZXJDYW5EZWFjdGl2YXRlLCB0aGlzLl9jdXJyZW50SW5zdHJ1Y3Rpb24uY29tcG9uZW50VHlwZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jb21wb25lbnRSZWYudGhlbihcbiAgICAgICAgICAocmVmOiBDb21wb25lbnRSZWYpID0+XG4gICAgICAgICAgICAgICg8Q2FuRGVhY3RpdmF0ZT5yZWYuaW5zdGFuY2UpXG4gICAgICAgICAgICAgICAgICAucm91dGVyQ2FuRGVhY3RpdmF0ZShuZXh0SW5zdHJ1Y3Rpb24sIHRoaXMuX2N1cnJlbnRJbnN0cnVjdGlvbikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gX3Jlc29sdmVUb1RydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCBieSB0aGUge0BsaW5rIFJvdXRlcn0gZHVyaW5nIHJlY29nbml0aW9uIHBoYXNlIG9mIGEgbmF2aWdhdGlvbi5cbiAgICpcbiAgICogSWYgdGhlIG5ldyBjaGlsZCBjb21wb25lbnQgaGFzIGEgZGlmZmVyZW50IFR5cGUgdGhhbiB0aGUgZXhpc3RpbmcgY2hpbGQgY29tcG9uZW50LFxuICAgKiB0aGlzIHdpbGwgcmVzb2x2ZSB0byBgZmFsc2VgLiBZb3UgY2FuJ3QgcmV1c2UgYW4gb2xkIGNvbXBvbmVudCB3aGVuIHRoZSBuZXcgY29tcG9uZW50XG4gICAqIGlzIG9mIGEgZGlmZmVyZW50IFR5cGUuXG4gICAqXG4gICAqIE90aGVyd2lzZSwgdGhpcyBtZXRob2QgZGVsZWdhdGVzIHRvIHRoZSBjaGlsZCBjb21wb25lbnQncyBgcm91dGVyQ2FuUmV1c2VgIGhvb2sgaWYgaXQgZXhpc3RzLFxuICAgKiBvciByZXNvbHZlcyB0byB0cnVlIGlmIHRoZSBob29rIGlzIG5vdCBwcmVzZW50LlxuICAgKi9cbiAgcm91dGVyQ2FuUmV1c2UobmV4dEluc3RydWN0aW9uOiBDb21wb25lbnRJbnN0cnVjdGlvbik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHZhciByZXN1bHQ7XG5cbiAgICBpZiAoaXNCbGFuayh0aGlzLl9jdXJyZW50SW5zdHJ1Y3Rpb24pIHx8XG4gICAgICAgIHRoaXMuX2N1cnJlbnRJbnN0cnVjdGlvbi5jb21wb25lbnRUeXBlICE9IG5leHRJbnN0cnVjdGlvbi5jb21wb25lbnRUeXBlKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGhhc0xpZmVjeWNsZUhvb2soaG9va01vZC5yb3V0ZXJDYW5SZXVzZSwgdGhpcy5fY3VycmVudEluc3RydWN0aW9uLmNvbXBvbmVudFR5cGUpKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLl9jb21wb25lbnRSZWYudGhlbihcbiAgICAgICAgICAocmVmOiBDb21wb25lbnRSZWYpID0+XG4gICAgICAgICAgICAgICg8Q2FuUmV1c2U+cmVmLmluc3RhbmNlKS5yb3V0ZXJDYW5SZXVzZShuZXh0SW5zdHJ1Y3Rpb24sIHRoaXMuX2N1cnJlbnRJbnN0cnVjdGlvbikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBuZXh0SW5zdHJ1Y3Rpb24gPT0gdGhpcy5fY3VycmVudEluc3RydWN0aW9uIHx8XG4gICAgICAgICAgICAgICAoaXNQcmVzZW50KG5leHRJbnN0cnVjdGlvbi5wYXJhbXMpICYmIGlzUHJlc2VudCh0aGlzLl9jdXJyZW50SW5zdHJ1Y3Rpb24ucGFyYW1zKSAmJlxuICAgICAgICAgICAgICAgIFN0cmluZ01hcFdyYXBwZXIuZXF1YWxzKG5leHRJbnN0cnVjdGlvbi5wYXJhbXMsIHRoaXMuX2N1cnJlbnRJbnN0cnVjdGlvbi5wYXJhbXMpKTtcbiAgICB9XG4gICAgcmV0dXJuIDxQcm9taXNlPGJvb2xlYW4+PlByb21pc2VXcmFwcGVyLnJlc29sdmUocmVzdWx0KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQgeyB0aGlzLl9wYXJlbnRSb3V0ZXIudW5yZWdpc3RlclByaW1hcnlPdXRsZXQodGhpcyk7IH1cbn0iXX0=