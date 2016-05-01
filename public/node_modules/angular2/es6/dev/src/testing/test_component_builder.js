var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DynamicComponentLoader, Injector, Injectable } from 'angular2/core';
import { DirectiveResolver, ViewResolver } from 'angular2/compiler';
import { isPresent } from 'angular2/src/facade/lang';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { MapWrapper } from 'angular2/src/facade/collection';
import { el } from './utils';
import { DOCUMENT } from 'angular2/src/platform/dom/dom_tokens';
import { DOM } from 'angular2/src/platform/dom/dom_adapter';
import { getDebugNode } from 'angular2/src/core/debug/debug_node';
import { tick } from './fake_async';
/**
 * Fixture for debugging and testing a component.
 */
export class ComponentFixture {
    constructor(componentRef) {
        this.changeDetectorRef = componentRef.changeDetectorRef;
        this.elementRef = componentRef.location;
        this.debugElement = getDebugNode(this.elementRef.nativeElement);
        this.componentInstance = componentRef.instance;
        this.nativeElement = this.elementRef.nativeElement;
        this.componentRef = componentRef;
    }
    /**
     * Trigger a change detection cycle for the component.
     */
    detectChanges(checkNoChanges = true) {
        this.changeDetectorRef.detectChanges();
        if (checkNoChanges) {
            this.checkNoChanges();
        }
    }
    checkNoChanges() { this.changeDetectorRef.checkNoChanges(); }
    /**
     * Trigger component destruction.
     */
    destroy() { this.componentRef.destroy(); }
}
var _nextRootElementId = 0;
/**
 * Builds a ComponentFixture for use in component level tests.
 */
let TestComponentBuilder_1;
export let TestComponentBuilder = TestComponentBuilder_1 = class TestComponentBuilder {
    constructor(_injector) {
        this._injector = _injector;
        /** @internal */
        this._bindingsOverrides = new Map();
        /** @internal */
        this._directiveOverrides = new Map();
        /** @internal */
        this._templateOverrides = new Map();
        /** @internal */
        this._viewBindingsOverrides = new Map();
        /** @internal */
        this._viewOverrides = new Map();
    }
    /** @internal */
    _clone() {
        var clone = new TestComponentBuilder_1(this._injector);
        clone._viewOverrides = MapWrapper.clone(this._viewOverrides);
        clone._directiveOverrides = MapWrapper.clone(this._directiveOverrides);
        clone._templateOverrides = MapWrapper.clone(this._templateOverrides);
        clone._bindingsOverrides = MapWrapper.clone(this._bindingsOverrides);
        clone._viewBindingsOverrides = MapWrapper.clone(this._viewBindingsOverrides);
        return clone;
    }
    /**
     * Overrides only the html of a {@link ComponentMetadata}.
     * All the other properties of the component's {@link ViewMetadata} are preserved.
     *
     * @param {Type} component
     * @param {string} html
     *
     * @return {TestComponentBuilder}
     */
    overrideTemplate(componentType, template) {
        var clone = this._clone();
        clone._templateOverrides.set(componentType, template);
        return clone;
    }
    /**
     * Overrides a component's {@link ViewMetadata}.
     *
     * @param {Type} component
     * @param {view} View
     *
     * @return {TestComponentBuilder}
     */
    overrideView(componentType, view) {
        var clone = this._clone();
        clone._viewOverrides.set(componentType, view);
        return clone;
    }
    /**
     * Overrides the directives from the component {@link ViewMetadata}.
     *
     * @param {Type} component
     * @param {Type} from
     * @param {Type} to
     *
     * @return {TestComponentBuilder}
     */
    overrideDirective(componentType, from, to) {
        var clone = this._clone();
        var overridesForComponent = clone._directiveOverrides.get(componentType);
        if (!isPresent(overridesForComponent)) {
            clone._directiveOverrides.set(componentType, new Map());
            overridesForComponent = clone._directiveOverrides.get(componentType);
        }
        overridesForComponent.set(from, to);
        return clone;
    }
    /**
     * Overrides one or more injectables configured via `providers` metadata property of a directive
     * or
     * component.
     * Very useful when certain providers need to be mocked out.
     *
     * The providers specified via this method are appended to the existing `providers` causing the
     * duplicated providers to
     * be overridden.
     *
     * @param {Type} component
     * @param {any[]} providers
     *
     * @return {TestComponentBuilder}
     */
    overrideProviders(type, providers) {
        var clone = this._clone();
        clone._bindingsOverrides.set(type, providers);
        return clone;
    }
    /**
     * @deprecated
     */
    overrideBindings(type, providers) {
        return this.overrideProviders(type, providers);
    }
    /**
     * Overrides one or more injectables configured via `providers` metadata property of a directive
     * or
     * component.
     * Very useful when certain providers need to be mocked out.
     *
     * The providers specified via this method are appended to the existing `providers` causing the
     * duplicated providers to
     * be overridden.
     *
     * @param {Type} component
     * @param {any[]} providers
     *
     * @return {TestComponentBuilder}
     */
    overrideViewProviders(type, providers) {
        var clone = this._clone();
        clone._viewBindingsOverrides.set(type, providers);
        return clone;
    }
    /**
     * @deprecated
     */
    overrideViewBindings(type, providers) {
        return this.overrideViewProviders(type, providers);
    }
    /**
     * Builds and returns a ComponentFixture.
     *
     * @return {Promise<ComponentFixture>}
     */
    createAsync(rootComponentType) {
        var mockDirectiveResolver = this._injector.get(DirectiveResolver);
        var mockViewResolver = this._injector.get(ViewResolver);
        this._viewOverrides.forEach((view, type) => mockViewResolver.setView(type, view));
        this._templateOverrides.forEach((template, type) => mockViewResolver.setInlineTemplate(type, template));
        this._directiveOverrides.forEach((overrides, component) => {
            overrides.forEach((to, from) => { mockViewResolver.overrideViewDirective(component, from, to); });
        });
        this._bindingsOverrides.forEach((bindings, type) => mockDirectiveResolver.setBindingsOverride(type, bindings));
        this._viewBindingsOverrides.forEach((bindings, type) => mockDirectiveResolver.setViewBindingsOverride(type, bindings));
        var rootElId = `root${_nextRootElementId++}`;
        var rootEl = el(`<div id="${rootElId}"></div>`);
        var doc = this._injector.get(DOCUMENT);
        // TODO(juliemr): can/should this be optional?
        var oldRoots = DOM.querySelectorAll(doc, '[id^=root]');
        for (var i = 0; i < oldRoots.length; i++) {
            DOM.remove(oldRoots[i]);
        }
        DOM.appendChild(doc.body, rootEl);
        var promise = this._injector.get(DynamicComponentLoader)
            .loadAsRoot(rootComponentType, `#${rootElId}`, this._injector);
        return promise.then((componentRef) => { return new ComponentFixture(componentRef); });
    }
    createFakeAsync(rootComponentType) {
        var result;
        var error;
        PromiseWrapper.then(this.createAsync(rootComponentType), (_result) => { result = _result; }, (_error) => { error = _error; });
        tick();
        if (isPresent(error)) {
            throw error;
        }
        return result;
    }
};
TestComponentBuilder = TestComponentBuilder_1 = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [Injector])
], TestComponentBuilder);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9jb21wb25lbnRfYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUQxaUdRVkcudG1wL2FuZ3VsYXIyL3NyYy90ZXN0aW5nL3Rlc3RfY29tcG9uZW50X2J1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O09BQU8sRUFFTCxzQkFBc0IsRUFDdEIsUUFBUSxFQUNSLFVBQVUsRUFNWCxNQUFNLGVBQWU7T0FDZixFQUFDLGlCQUFpQixFQUFFLFlBQVksRUFBQyxNQUFNLG1CQUFtQjtPQUUxRCxFQUFPLFNBQVMsRUFBVSxNQUFNLDBCQUEwQjtPQUMxRCxFQUFDLGNBQWMsRUFBQyxNQUFNLDJCQUEyQjtPQUNqRCxFQUFjLFVBQVUsRUFBQyxNQUFNLGdDQUFnQztPQUUvRCxFQUFDLEVBQUUsRUFBQyxNQUFNLFNBQVM7T0FFbkIsRUFBQyxRQUFRLEVBQUMsTUFBTSxzQ0FBc0M7T0FDdEQsRUFBQyxHQUFHLEVBQUMsTUFBTSx1Q0FBdUM7T0FFbEQsRUFBMEIsWUFBWSxFQUFDLE1BQU0sb0NBQW9DO09BRWpGLEVBQUMsSUFBSSxFQUFDLE1BQU0sY0FBYztBQUVqQzs7R0FFRztBQUNIO0lBK0JFLFlBQVksWUFBMEI7UUFDcEMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQztRQUN4RCxJQUFJLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7UUFDeEMsSUFBSSxDQUFDLFlBQVksR0FBaUIsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7UUFDL0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztRQUNuRCxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVks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QUM7UUFDckQsSUFBSSxFQUFFLENBQUM7UUFDUCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztBQUNILENBQUM7QUFwTEQ7SUFBQyxVQUFVLEVBQUU7O3dCQUFBO0FBb0xaIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50UmVmLFxuICBEeW5hbWljQ29tcG9uZW50TG9hZGVyLFxuICBJbmplY3RvcixcbiAgSW5qZWN0YWJsZSxcbiAgVmlld01ldGFkYXRhLFxuICBFbGVtZW50UmVmLFxuICBFbWJlZGRlZFZpZXdSZWYsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBwcm92aWRlXG59IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtEaXJlY3RpdmVSZXNvbHZlciwgVmlld1Jlc29sdmVyfSBmcm9tICdhbmd1bGFyMi9jb21waWxlcic7XG5cbmltcG9ydCB7VHlwZSwgaXNQcmVzZW50LCBpc0JsYW5rfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtQcm9taXNlV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYyc7XG5pbXBvcnQge0xpc3RXcmFwcGVyLCBNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuXG5pbXBvcnQge2VsfSBmcm9tICcuL3V0aWxzJztcblxuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kb21fdG9rZW5zJztcbmltcG9ydCB7RE9NfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV9hZGFwdGVyJztcblxuaW1wb3J0IHtEZWJ1Z05vZGUsIERlYnVnRWxlbWVudCwgZ2V0RGVidWdOb2RlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kZWJ1Zy9kZWJ1Z19ub2RlJztcblxuaW1wb3J0IHt0aWNrfSBmcm9tICcuL2Zha2VfYXN5bmMnO1xuXG4vKipcbiAqIEZpeHR1cmUgZm9yIGRlYnVnZ2luZyBhbmQgdGVzdGluZyBhIGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbXBvbmVudEZpeHR1cmUge1xuICAvKipcbiAgICogVGhlIERlYnVnRWxlbWVudCBhc3NvY2lhdGVkIHdpdGggdGhlIHJvb3QgZWxlbWVudCBvZiB0aGlzIGNvbXBvbmVudC5cbiAgICovXG4gIGRlYnVnRWxlbWVudDogRGVidWdFbGVtZW50O1xuXG4gIC8qKlxuICAgKiBUaGUgaW5zdGFuY2Ugb2YgdGhlIHJvb3QgY29tcG9uZW50IGNsYXNzLlxuICAgKi9cbiAgY29tcG9uZW50SW5zdGFuY2U6IGFueTtcblxuICAvKipcbiAgICogVGhlIG5hdGl2ZSBlbGVtZW50IGF0IHRoZSByb290IG9mIHRoZSBjb21wb25lbnQuXG4gICAqL1xuICBuYXRpdmVFbGVtZW50OiBhbnk7XG5cbiAgLyoqXG4gICAqIFRoZSBFbGVtZW50UmVmIGZvciB0aGUgZWxlbWVudCBhdCB0aGUgcm9vdCBvZiB0aGUgY29tcG9uZW50LlxuICAgKi9cbiAgZWxlbWVudFJlZjogRWxlbWVudFJlZjtcblxuICAvKipcbiAgICogVGhlIENvbXBvbmVudFJlZiBmb3IgdGhlIGNvbXBvbmVudFxuICAgKi9cbiAgY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY7XG5cbiAgLyoqXG4gICAqIFRoZSBDaGFuZ2VEZXRlY3RvclJlZiBmb3IgdGhlIGNvbXBvbmVudFxuICAgKi9cbiAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmO1xuXG4gIGNvbnN0cnVjdG9yKGNvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmKSB7XG4gICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZiA9IGNvbXBvbmVudFJlZi5jaGFuZ2VEZXRlY3RvclJlZjtcbiAgICB0aGlzLmVsZW1lbnRSZWYgPSBjb21wb25lbnRSZWYubG9jYXRpb247XG4gICAgdGhpcy5kZWJ1Z0VsZW1lbnQgPSA8RGVidWdFbGVtZW50PmdldERlYnVnTm9kZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5jb21wb25lbnRJbnN0YW5jZSA9IGNvbXBvbmVudFJlZi5pbnN0YW5jZTtcbiAgICB0aGlzLm5hdGl2ZUVsZW1lbnQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLmNvbXBvbmVudFJlZiA9IGNvbXBvbmVudFJlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIGEgY2hhbmdlIGRldGVjdGlvbiBjeWNsZSBmb3IgdGhlIGNvbXBvbmVudC5cbiAgICovXG4gIGRldGVjdENoYW5nZXMoY2hlY2tOb0NoYW5nZXM6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgaWYgKGNoZWNrTm9DaGFuZ2VzKSB7XG4gICAgICB0aGlzLmNoZWNrTm9DaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tOb0NoYW5nZXMoKTogdm9pZCB7IHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYuY2hlY2tOb0NoYW5nZXMoKTsgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIGNvbXBvbmVudCBkZXN0cnVjdGlvbi5cbiAgICovXG4gIGRlc3Ryb3koKTogdm9pZCB7IHRoaXMuY29tcG9uZW50UmVmLmRlc3Ryb3koKTsgfVxufVxuXG52YXIgX25leHRSb290RWxlbWVudElkID0gMDtcblxuLyoqXG4gKiBCdWlsZHMgYSBDb21wb25lbnRGaXh0dXJlIGZvciB1c2UgaW4gY29tcG9uZW50IGxldmVsIHRlc3RzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVGVzdENvbXBvbmVudEJ1aWxkZXIge1xuICAvKiogQGludGVybmFsICovXG4gIF9iaW5kaW5nc092ZXJyaWRlcyA9IG5ldyBNYXA8VHlwZSwgYW55W10+KCk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2RpcmVjdGl2ZU92ZXJyaWRlcyA9IG5ldyBNYXA8VHlwZSwgTWFwPFR5cGUsIFR5cGU+PigpO1xuICAvKiogQGludGVybmFsICovXG4gIF90ZW1wbGF0ZU92ZXJyaWRlcyA9IG5ldyBNYXA8VHlwZSwgc3RyaW5nPigpO1xuICAvKiogQGludGVybmFsICovXG4gIF92aWV3QmluZGluZ3NPdmVycmlkZXMgPSBuZXcgTWFwPFR5cGUsIGFueVtdPigpO1xuICAvKiogQGludGVybmFsICovXG4gIF92aWV3T3ZlcnJpZGVzID0gbmV3IE1hcDxUeXBlLCBWaWV3TWV0YWRhdGE+KCk7XG5cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IpIHt9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2xvbmUoKTogVGVzdENvbXBvbmVudEJ1aWxkZXIge1xuICAgIHZhciBjbG9uZSA9IG5ldyBUZXN0Q29tcG9uZW50QnVpbGRlcih0aGlzLl9pbmplY3Rvcik7XG4gICAgY2xvbmUuX3ZpZXdPdmVycmlkZXMgPSBNYXBXcmFwcGVyLmNsb25lKHRoaXMuX3ZpZXdPdmVycmlkZXMpO1xuICAgIGNsb25lLl9kaXJlY3RpdmVPdmVycmlkZXMgPSBNYXBXcmFwcGVyLmNsb25lKHRoaXMuX2RpcmVjdGl2ZU92ZXJyaWRlcyk7XG4gICAgY2xvbmUuX3RlbXBsYXRlT3ZlcnJpZGVzID0gTWFwV3JhcHBlci5jbG9uZSh0aGlzLl90ZW1wbGF0ZU92ZXJyaWRlcyk7XG4gICAgY2xvbmUuX2JpbmRpbmdzT3ZlcnJpZGVzID0gTWFwV3JhcHBlci5jbG9uZSh0aGlzLl9iaW5kaW5nc092ZXJyaWRlcyk7XG4gICAgY2xvbmUuX3ZpZXdCaW5kaW5nc092ZXJyaWRlcyA9IE1hcFdyYXBwZXIuY2xvbmUodGhpcy5fdmlld0JpbmRpbmdzT3ZlcnJpZGVzKTtcbiAgICByZXR1cm4gY2xvbmU7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIG9ubHkgdGhlIGh0bWwgb2YgYSB7QGxpbmsgQ29tcG9uZW50TWV0YWRhdGF9LlxuICAgKiBBbGwgdGhlIG90aGVyIHByb3BlcnRpZXMgb2YgdGhlIGNvbXBvbmVudCdzIHtAbGluayBWaWV3TWV0YWRhdGF9IGFyZSBwcmVzZXJ2ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7VHlwZX0gY29tcG9uZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBodG1sXG4gICAqXG4gICAqIEByZXR1cm4ge1Rlc3RDb21wb25lbnRCdWlsZGVyfVxuICAgKi9cbiAgb3ZlcnJpZGVUZW1wbGF0ZShjb21wb25lbnRUeXBlOiBUeXBlLCB0ZW1wbGF0ZTogc3RyaW5nKTogVGVzdENvbXBvbmVudEJ1aWxkZXIge1xuICAgIHZhciBjbG9uZSA9IHRoaXMuX2Nsb25lKCk7XG4gICAgY2xvbmUuX3RlbXBsYXRlT3ZlcnJpZGVzLnNldChjb21wb25lbnRUeXBlLCB0ZW1wbGF0ZSk7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlcyBhIGNvbXBvbmVudCdzIHtAbGluayBWaWV3TWV0YWRhdGF9LlxuICAgKlxuICAgKiBAcGFyYW0ge1R5cGV9IGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge3ZpZXd9IFZpZXdcbiAgICpcbiAgICogQHJldHVybiB7VGVzdENvbXBvbmVudEJ1aWxkZXJ9XG4gICAqL1xuICBvdmVycmlkZVZpZXcoY29tcG9uZW50VHlwZTogVHlwZSwgdmlldzogVmlld01ldGFkYXRhKTogVGVzdENvbXBvbmVudEJ1aWxkZXIge1xuICAgIHZhciBjbG9uZSA9IHRoaXMuX2Nsb25lKCk7XG4gICAgY2xvbmUuX3ZpZXdPdmVycmlkZXMuc2V0KGNvbXBvbmVudFR5cGUsIHZpZXcpO1xuICAgIHJldHVybiBjbG9uZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZXMgdGhlIGRpcmVjdGl2ZXMgZnJvbSB0aGUgY29tcG9uZW50IHtAbGluayBWaWV3TWV0YWRhdGF9LlxuICAgKlxuICAgKiBAcGFyYW0ge1R5cGV9IGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge1R5cGV9IGZyb21cbiAgICogQHBhcmFtIHtUeXBlfSB0b1xuICAgKlxuICAgKiBAcmV0dXJuIHtUZXN0Q29tcG9uZW50QnVpbGRlcn1cbiAgICovXG4gIG92ZXJyaWRlRGlyZWN0aXZlKGNvbXBvbmVudFR5cGU6IFR5cGUsIGZyb206IFR5cGUsIHRvOiBUeXBlKTogVGVzdENvbXBvbmVudEJ1aWxkZXIge1xuICAgIHZhciBjbG9uZSA9IHRoaXMuX2Nsb25lKCk7XG4gICAgdmFyIG92ZXJyaWRlc0ZvckNvbXBvbmVudCA9IGNsb25lLl9kaXJlY3RpdmVPdmVycmlkZXMuZ2V0KGNvbXBvbmVudFR5cGUpO1xuICAgIGlmICghaXNQcmVzZW50KG92ZXJyaWRlc0ZvckNvbXBvbmVudCkpIHtcbiAgICAgIGNsb25lLl9kaXJlY3RpdmVPdmVycmlkZXMuc2V0KGNvbXBvbmVudFR5cGUsIG5ldyBNYXA8VHlwZSwgVHlwZT4oKSk7XG4gICAgICBvdmVycmlkZXNGb3JDb21wb25lbnQgPSBjbG9uZS5fZGlyZWN0aXZlT3ZlcnJpZGVzLmdldChjb21wb25lbnRUeXBlKTtcbiAgICB9XG4gICAgb3ZlcnJpZGVzRm9yQ29tcG9uZW50LnNldChmcm9tLCB0byk7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlcyBvbmUgb3IgbW9yZSBpbmplY3RhYmxlcyBjb25maWd1cmVkIHZpYSBgcHJvdmlkZXJzYCBtZXRhZGF0YSBwcm9wZXJ0eSBvZiBhIGRpcmVjdGl2ZVxuICAgKiBvclxuICAgKiBjb21wb25lbnQuXG4gICAqIFZlcnkgdXNlZnVsIHdoZW4gY2VydGFpbiBwcm92aWRlcnMgbmVlZCB0byBiZSBtb2NrZWQgb3V0LlxuICAgKlxuICAgKiBUaGUgcHJvdmlkZXJzIHNwZWNpZmllZCB2aWEgdGhpcyBtZXRob2QgYXJlIGFwcGVuZGVkIHRvIHRoZSBleGlzdGluZyBgcHJvdmlkZXJzYCBjYXVzaW5nIHRoZVxuICAgKiBkdXBsaWNhdGVkIHByb3ZpZGVycyB0b1xuICAgKiBiZSBvdmVycmlkZGVuLlxuICAgKlxuICAgKiBAcGFyYW0ge1R5cGV9IGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge2FueVtdfSBwcm92aWRlcnNcbiAgICpcbiAgICogQHJldHVybiB7VGVzdENvbXBvbmVudEJ1aWxkZXJ9XG4gICAqL1xuICBvdmVycmlkZVByb3ZpZGVycyh0eXBlOiBUeXBlLCBwcm92aWRlcnM6IGFueVtdKTogVGVzdENvbXBvbmVudEJ1aWxkZXIge1xuICAgIHZhciBjbG9uZSA9IHRoaXMuX2Nsb25lKCk7XG4gICAgY2xvbmUuX2JpbmRpbmdzT3ZlcnJpZGVzLnNldCh0eXBlLCBwcm92aWRlcnMpO1xuICAgIHJldHVybiBjbG9uZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKi9cbiAgb3ZlcnJpZGVCaW5kaW5ncyh0eXBlOiBUeXBlLCBwcm92aWRlcnM6IGFueVtdKTogVGVzdENvbXBvbmVudEJ1aWxkZXIge1xuICAgIHJldHVybiB0aGlzLm92ZXJyaWRlUHJvdmlkZXJzKHR5cGUsIHByb3ZpZGVycyk7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIG9uZSBvciBtb3JlIGluamVjdGFibGVzIGNvbmZpZ3VyZWQgdmlhIGBwcm92aWRlcnNgIG1ldGFkYXRhIHByb3BlcnR5IG9mIGEgZGlyZWN0aXZlXG4gICAqIG9yXG4gICAqIGNvbXBvbmVudC5cbiAgICogVmVyeSB1c2VmdWwgd2hlbiBjZXJ0YWluIHByb3ZpZGVycyBuZWVkIHRvIGJlIG1vY2tlZCBvdXQuXG4gICAqXG4gICAqIFRoZSBwcm92aWRlcnMgc3BlY2lmaWVkIHZpYSB0aGlzIG1ldGhvZCBhcmUgYXBwZW5kZWQgdG8gdGhlIGV4aXN0aW5nIGBwcm92aWRlcnNgIGNhdXNpbmcgdGhlXG4gICAqIGR1cGxpY2F0ZWQgcHJvdmlkZXJzIHRvXG4gICAqIGJlIG92ZXJyaWRkZW4uXG4gICAqXG4gICAqIEBwYXJhbSB7VHlwZX0gY29tcG9uZW50XG4gICAqIEBwYXJhbSB7YW55W119IHByb3ZpZGVyc1xuICAgKlxuICAgKiBAcmV0dXJuIHtUZXN0Q29tcG9uZW50QnVpbGRlcn1cbiAgICovXG4gIG92ZXJyaWRlVmlld1Byb3ZpZGVycyh0eXBlOiBUeXBlLCBwcm92aWRlcnM6IGFueVtdKTogVGVzdENvbXBvbmVudEJ1aWxkZXIge1xuICAgIHZhciBjbG9uZSA9IHRoaXMuX2Nsb25lKCk7XG4gICAgY2xvbmUuX3ZpZXdCaW5kaW5nc092ZXJyaWRlcy5zZXQodHlwZSwgcHJvdmlkZXJzKTtcbiAgICByZXR1cm4gY2xvbmU7XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWRcbiAgICovXG4gIG92ZXJyaWRlVmlld0JpbmRpbmdzKHR5cGU6IFR5cGUsIHByb3ZpZGVyczogYW55W10pOiBUZXN0Q29tcG9uZW50QnVpbGRlciB7XG4gICAgcmV0dXJuIHRoaXMub3ZlcnJpZGVWaWV3UHJvdmlkZXJzKHR5cGUsIHByb3ZpZGVycyk7XG4gIH1cblxuICAvKipcbiAgICogQnVpbGRzIGFuZCByZXR1cm5zIGEgQ29tcG9uZW50Rml4dHVyZS5cbiAgICpcbiAgICogQHJldHVybiB7UHJvbWlzZTxDb21wb25lbnRGaXh0dXJlPn1cbiAgICovXG4gIGNyZWF0ZUFzeW5jKHJvb3RDb21wb25lbnRUeXBlOiBUeXBlKTogUHJvbWlzZTxDb21wb25lbnRGaXh0dXJlPiB7XG4gICAgdmFyIG1vY2tEaXJlY3RpdmVSZXNvbHZlciA9IHRoaXMuX2luamVjdG9yLmdldChEaXJlY3RpdmVSZXNvbHZlcik7XG4gICAgdmFyIG1vY2tWaWV3UmVzb2x2ZXIgPSB0aGlzLl9pbmplY3Rvci5nZXQoVmlld1Jlc29sdmVyKTtcbiAgICB0aGlzLl92aWV3T3ZlcnJpZGVzLmZvckVhY2goKHZpZXcsIHR5cGUpID0+IG1vY2tWaWV3UmVzb2x2ZXIuc2V0Vmlldyh0eXBlLCB2aWV3KSk7XG4gICAgdGhpcy5fdGVtcGxhdGVPdmVycmlkZXMuZm9yRWFjaCgodGVtcGxhdGUsIHR5cGUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ja1ZpZXdSZXNvbHZlci5zZXRJbmxpbmVUZW1wbGF0ZSh0eXBlLCB0ZW1wbGF0ZSkpO1xuICAgIHRoaXMuX2RpcmVjdGl2ZU92ZXJyaWRlcy5mb3JFYWNoKChvdmVycmlkZXMsIGNvbXBvbmVudCkgPT4ge1xuICAgICAgb3ZlcnJpZGVzLmZvckVhY2goXG4gICAgICAgICAgKHRvLCBmcm9tKSA9PiB7IG1vY2tWaWV3UmVzb2x2ZXIub3ZlcnJpZGVWaWV3RGlyZWN0aXZlKGNvbXBvbmVudCwgZnJvbSwgdG8pOyB9KTtcbiAgICB9KTtcbiAgICB0aGlzLl9iaW5kaW5nc092ZXJyaWRlcy5mb3JFYWNoKChiaW5kaW5ncywgdHlwZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2NrRGlyZWN0aXZlUmVzb2x2ZXIuc2V0QmluZGluZ3NPdmVycmlkZSh0eXBlLCBiaW5kaW5ncykpO1xuICAgIHRoaXMuX3ZpZXdCaW5kaW5nc092ZXJyaWRlcy5mb3JFYWNoKFxuICAgICAgICAoYmluZGluZ3MsIHR5cGUpID0+IG1vY2tEaXJlY3RpdmVSZXNvbHZlci5zZXRWaWV3QmluZGluZ3NPdmVycmlkZSh0eXBlLCBiaW5kaW5ncykpO1xuXG4gICAgdmFyIHJvb3RFbElkID0gYHJvb3Qke19uZXh0Um9vdEVsZW1lbnRJZCsrfWA7XG4gICAgdmFyIHJvb3RFbCA9IGVsKGA8ZGl2IGlkPVwiJHtyb290RWxJZH1cIj48L2Rpdj5gKTtcbiAgICB2YXIgZG9jID0gdGhpcy5faW5qZWN0b3IuZ2V0KERPQ1VNRU5UKTtcblxuICAgIC8vIFRPRE8oanVsaWVtcik6IGNhbi9zaG91bGQgdGhpcyBiZSBvcHRpb25hbD9cbiAgICB2YXIgb2xkUm9vdHMgPSBET00ucXVlcnlTZWxlY3RvckFsbChkb2MsICdbaWRePXJvb3RdJyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvbGRSb290cy5sZW5ndGg7IGkrKykge1xuICAgICAgRE9NLnJlbW92ZShvbGRSb290c1tpXSk7XG4gICAgfVxuICAgIERPTS5hcHBlbmRDaGlsZChkb2MuYm9keSwgcm9vdEVsKTtcblxuICAgIHZhciBwcm9taXNlOiBQcm9taXNlPENvbXBvbmVudFJlZj4gPVxuICAgICAgICB0aGlzLl9pbmplY3Rvci5nZXQoRHluYW1pY0NvbXBvbmVudExvYWRlcilcbiAgICAgICAgICAgIC5sb2FkQXNSb290KHJvb3RDb21wb25lbnRUeXBlLCBgIyR7cm9vdEVsSWR9YCwgdGhpcy5faW5qZWN0b3IpO1xuICAgIHJldHVybiBwcm9taXNlLnRoZW4oKGNvbXBvbmVudFJlZikgPT4geyByZXR1cm4gbmV3IENvbXBvbmVudEZpeHR1cmUoY29tcG9uZW50UmVmKTsgfSk7XG4gIH1cblxuICBjcmVhdGVGYWtlQXN5bmMocm9vdENvbXBvbmVudFR5cGU6IFR5cGUpOiBDb21wb25lbnRGaXh0dXJlIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIHZhciBlcnJvcjtcbiAgICBQcm9taXNlV3JhcHBlci50aGVuKHRoaXMuY3JlYXRlQXN5bmMocm9vdENvbXBvbmVudFR5cGUpLCAoX3Jlc3VsdCkgPT4geyByZXN1bHQgPSBfcmVzdWx0OyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKF9lcnJvcikgPT4geyBlcnJvciA9IF9lcnJvcjsgfSk7XG4gICAgdGljaygpO1xuICAgIGlmIChpc1ByZXNlbnQoZXJyb3IpKSB7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19