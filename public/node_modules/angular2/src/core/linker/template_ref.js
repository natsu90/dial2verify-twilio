'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Represents an Embedded Template that can be used to instantiate Embedded Views.
 *
 * You can access a `TemplateRef`, in two ways. Via a directive placed on a `<template>` element (or
 * directive prefixed with `*`) and have the `TemplateRef` for this Embedded View injected into the
 * constructor of the directive using the `TemplateRef` Token. Alternatively you can query for the
 * `TemplateRef` from a Component or a Directive via {@link Query}.
 *
 * To instantiate Embedded Views based on a Template, use
 * {@link ViewContainerRef#createEmbeddedView}, which will create the View and attach it to the
 * View Container.
 */
var TemplateRef = (function () {
    function TemplateRef() {
    }
    Object.defineProperty(TemplateRef.prototype, "elementRef", {
        /**
         * The location in the View where the Embedded View logically belongs to.
         *
         * The data-binding and injection contexts of Embedded Views created from this `TemplateRef`
         * inherit from the contexts of this location.
         *
         * Typically new Embedded Views are attached to the View Container of this location, but in
         * advanced use-cases, the View can be attached to a different container while keeping the
         * data-binding and injection context from the original location.
         *
         */
        // TODO(i): rename to anchor or location
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    return TemplateRef;
}());
exports.TemplateRef = TemplateRef;
var TemplateRef_ = (function (_super) {
    __extends(TemplateRef_, _super);
    function TemplateRef_(_appElement, _viewFactory) {
        _super.call(this);
        this._appElement = _appElement;
        this._viewFactory = _viewFactory;
    }
    TemplateRef_.prototype.createEmbeddedView = function () {
        var view = this._viewFactory(this._appElement.parentView.viewUtils, this._appElement.parentInjector, this._appElement);
        view.create(null, null);
        return view.ref;
    };
    Object.defineProperty(TemplateRef_.prototype, "elementRef", {
        get: function () { return this._appElement.elementRef; },
        enumerable: true,
        configurable: true
    });
    return TemplateRef_;
}(TemplateRef));
exports.TemplateRef_ = TemplateRef_;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC00bm8zWlF2Ty50bXAvYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3RlbXBsYXRlX3JlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFLQTs7Ozs7Ozs7Ozs7R0FXRztBQUNIO0lBQUE7SUFnQkEsQ0FBQztJQUhDLHNCQUFJLG1DQUFVO1FBWmQ7Ozs7Ozs7Ozs7V0FVRztRQUNILHdDQUF3QzthQUN4QyxjQUErQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFHL0Msa0JBQUM7QUFBRCxDQUFDLEFBaEJELElBZ0JDO0FBaEJxQixtQkFBVyxjQWdCaEMsQ0FBQTtBQUVEO0lBQWtDLGdDQUFXO0lBQzNDLHNCQUFvQixXQUF1QixFQUFVLFlBQXNCO1FBQUksaUJBQU8sQ0FBQztRQUFuRSxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFVO0lBQWEsQ0FBQztJQUV6Rix5Q0FBa0IsR0FBbEI7UUFDRSxJQUFJLElBQUksR0FBaUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM5RixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNsQixDQUFDO0lBRUQsc0JBQUksb0NBQVU7YUFBZCxjQUErQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUN0RSxtQkFBQztBQUFELENBQUMsQUFYRCxDQUFrQyxXQUFXLEdBVzVDO0FBWFksb0JBQVksZUFXeEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RWxlbWVudFJlZn0gZnJvbSAnLi9lbGVtZW50X3JlZic7XG5pbXBvcnQge0FwcEVsZW1lbnR9IGZyb20gJy4vZWxlbWVudCc7XG5pbXBvcnQge0FwcFZpZXd9IGZyb20gJy4vdmlldyc7XG5pbXBvcnQge0VtYmVkZGVkVmlld1JlZn0gZnJvbSAnLi92aWV3X3JlZic7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhbiBFbWJlZGRlZCBUZW1wbGF0ZSB0aGF0IGNhbiBiZSB1c2VkIHRvIGluc3RhbnRpYXRlIEVtYmVkZGVkIFZpZXdzLlxuICpcbiAqIFlvdSBjYW4gYWNjZXNzIGEgYFRlbXBsYXRlUmVmYCwgaW4gdHdvIHdheXMuIFZpYSBhIGRpcmVjdGl2ZSBwbGFjZWQgb24gYSBgPHRlbXBsYXRlPmAgZWxlbWVudCAob3JcbiAqIGRpcmVjdGl2ZSBwcmVmaXhlZCB3aXRoIGAqYCkgYW5kIGhhdmUgdGhlIGBUZW1wbGF0ZVJlZmAgZm9yIHRoaXMgRW1iZWRkZWQgVmlldyBpbmplY3RlZCBpbnRvIHRoZVxuICogY29uc3RydWN0b3Igb2YgdGhlIGRpcmVjdGl2ZSB1c2luZyB0aGUgYFRlbXBsYXRlUmVmYCBUb2tlbi4gQWx0ZXJuYXRpdmVseSB5b3UgY2FuIHF1ZXJ5IGZvciB0aGVcbiAqIGBUZW1wbGF0ZVJlZmAgZnJvbSBhIENvbXBvbmVudCBvciBhIERpcmVjdGl2ZSB2aWEge0BsaW5rIFF1ZXJ5fS5cbiAqXG4gKiBUbyBpbnN0YW50aWF0ZSBFbWJlZGRlZCBWaWV3cyBiYXNlZCBvbiBhIFRlbXBsYXRlLCB1c2VcbiAqIHtAbGluayBWaWV3Q29udGFpbmVyUmVmI2NyZWF0ZUVtYmVkZGVkVmlld30sIHdoaWNoIHdpbGwgY3JlYXRlIHRoZSBWaWV3IGFuZCBhdHRhY2ggaXQgdG8gdGhlXG4gKiBWaWV3IENvbnRhaW5lci5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFRlbXBsYXRlUmVmIHtcbiAgLyoqXG4gICAqIFRoZSBsb2NhdGlvbiBpbiB0aGUgVmlldyB3aGVyZSB0aGUgRW1iZWRkZWQgVmlldyBsb2dpY2FsbHkgYmVsb25ncyB0by5cbiAgICpcbiAgICogVGhlIGRhdGEtYmluZGluZyBhbmQgaW5qZWN0aW9uIGNvbnRleHRzIG9mIEVtYmVkZGVkIFZpZXdzIGNyZWF0ZWQgZnJvbSB0aGlzIGBUZW1wbGF0ZVJlZmBcbiAgICogaW5oZXJpdCBmcm9tIHRoZSBjb250ZXh0cyBvZiB0aGlzIGxvY2F0aW9uLlxuICAgKlxuICAgKiBUeXBpY2FsbHkgbmV3IEVtYmVkZGVkIFZpZXdzIGFyZSBhdHRhY2hlZCB0byB0aGUgVmlldyBDb250YWluZXIgb2YgdGhpcyBsb2NhdGlvbiwgYnV0IGluXG4gICAqIGFkdmFuY2VkIHVzZS1jYXNlcywgdGhlIFZpZXcgY2FuIGJlIGF0dGFjaGVkIHRvIGEgZGlmZmVyZW50IGNvbnRhaW5lciB3aGlsZSBrZWVwaW5nIHRoZVxuICAgKiBkYXRhLWJpbmRpbmcgYW5kIGluamVjdGlvbiBjb250ZXh0IGZyb20gdGhlIG9yaWdpbmFsIGxvY2F0aW9uLlxuICAgKlxuICAgKi9cbiAgLy8gVE9ETyhpKTogcmVuYW1lIHRvIGFuY2hvciBvciBsb2NhdGlvblxuICBnZXQgZWxlbWVudFJlZigpOiBFbGVtZW50UmVmIHsgcmV0dXJuIG51bGw7IH1cblxuICBhYnN0cmFjdCBjcmVhdGVFbWJlZGRlZFZpZXcoKTogRW1iZWRkZWRWaWV3UmVmO1xufVxuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVSZWZfIGV4dGVuZHMgVGVtcGxhdGVSZWYge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9hcHBFbGVtZW50OiBBcHBFbGVtZW50LCBwcml2YXRlIF92aWV3RmFjdG9yeTogRnVuY3Rpb24pIHsgc3VwZXIoKTsgfVxuXG4gIGNyZWF0ZUVtYmVkZGVkVmlldygpOiBFbWJlZGRlZFZpZXdSZWYge1xuICAgIHZhciB2aWV3OiBBcHBWaWV3PGFueT4gPSB0aGlzLl92aWV3RmFjdG9yeSh0aGlzLl9hcHBFbGVtZW50LnBhcmVudFZpZXcudmlld1V0aWxzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9hcHBFbGVtZW50LnBhcmVudEluamVjdG9yLCB0aGlzLl9hcHBFbGVtZW50KTtcbiAgICB2aWV3LmNyZWF0ZShudWxsLCBudWxsKTtcbiAgICByZXR1cm4gdmlldy5yZWY7XG4gIH1cblxuICBnZXQgZWxlbWVudFJlZigpOiBFbGVtZW50UmVmIHsgcmV0dXJuIHRoaXMuX2FwcEVsZW1lbnQuZWxlbWVudFJlZjsgfVxufVxuIl19