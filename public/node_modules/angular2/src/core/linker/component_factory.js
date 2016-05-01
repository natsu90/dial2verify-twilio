'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var view_utils_1 = require('./view_utils');
/**
 * Represents an instance of a Component created via a {@link ComponentFactory}.
 *
 * `ComponentRef` provides access to the Component Instance as well other objects related to this
 * Component Instance and allows you to destroy the Component Instance via the {@link #destroy}
 * method.
 */
var ComponentRef = (function () {
    function ComponentRef() {
    }
    Object.defineProperty(ComponentRef.prototype, "location", {
        /**
         * Location of the Host Element of this Component Instance.
         */
        get: function () { return exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentRef.prototype, "injector", {
        /**
         * The injector on which the component instance exists.
         */
        get: function () { return exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentRef.prototype, "instance", {
        /**
         * The instance of the Component.
         */
        get: function () { return exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ComponentRef.prototype, "hostView", {
        /**
         * The {@link ViewRef} of the Host View of this Component instance.
         */
        get: function () { return exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ComponentRef.prototype, "changeDetectorRef", {
        /**
         * The {@link ChangeDetectorRef} of the Component instance.
         */
        get: function () { return exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentRef.prototype, "componentType", {
        /**
         * The component type.
         */
        get: function () { return exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    return ComponentRef;
}());
exports.ComponentRef = ComponentRef;
var ComponentRef_ = (function (_super) {
    __extends(ComponentRef_, _super);
    function ComponentRef_(_hostElement, _componentType) {
        _super.call(this);
        this._hostElement = _hostElement;
        this._componentType = _componentType;
    }
    Object.defineProperty(ComponentRef_.prototype, "location", {
        get: function () { return this._hostElement.elementRef; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentRef_.prototype, "injector", {
        get: function () { return this._hostElement.injector; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentRef_.prototype, "instance", {
        get: function () { return this._hostElement.component; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ComponentRef_.prototype, "hostView", {
        get: function () { return this._hostElement.parentView.ref; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ComponentRef_.prototype, "changeDetectorRef", {
        get: function () { return this.hostView; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ComponentRef_.prototype, "componentType", {
        get: function () { return this._componentType; },
        enumerable: true,
        configurable: true
    });
    ComponentRef_.prototype.destroy = function () { this._hostElement.parentView.destroy(); };
    ComponentRef_.prototype.onDestroy = function (callback) { this.hostView.onDestroy(callback); };
    return ComponentRef_;
}(ComponentRef));
exports.ComponentRef_ = ComponentRef_;
var ComponentFactory = (function () {
    function ComponentFactory(selector, _viewFactory, _componentType) {
        this.selector = selector;
        this._viewFactory = _viewFactory;
        this._componentType = _componentType;
    }
    Object.defineProperty(ComponentFactory.prototype, "componentType", {
        get: function () { return this._componentType; },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a new component.
     */
    ComponentFactory.prototype.create = function (injector, projectableNodes, rootSelectorOrNode) {
        if (projectableNodes === void 0) { projectableNodes = null; }
        if (rootSelectorOrNode === void 0) { rootSelectorOrNode = null; }
        var vu = injector.get(view_utils_1.ViewUtils);
        if (lang_1.isBlank(projectableNodes)) {
            projectableNodes = [];
        }
        // Note: Host views don't need a declarationAppElement!
        var hostView = this._viewFactory(vu, injector, null);
        var hostElement = hostView.create(projectableNodes, rootSelectorOrNode);
        return new ComponentRef_(hostElement, this._componentType);
    };
    ComponentFactory = __decorate([
        lang_1.CONST(), 
        __metadata('design:paramtypes', [String, Function, lang_1.Type])
    ], ComponentFactory);
    return ComponentFactory;
}());
exports.ComponentFactory = ComponentFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50X2ZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTRubzNaUXZPLnRtcC9hbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvY29tcG9uZW50X2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EscUJBQThDLDBCQUEwQixDQUFDLENBQUE7QUFDekUsMkJBQTRCLGdDQUFnQyxDQUFDLENBQUE7QUFJN0QsMkJBQXdCLGNBQWMsQ0FBQyxDQUFBO0FBR3ZDOzs7Ozs7R0FNRztBQUNIO0lBQUE7SUF3Q0EsQ0FBQztJQXBDQyxzQkFBSSxrQ0FBUTtRQUhaOztXQUVHO2FBQ0gsY0FBNkIsTUFBTSxDQUFDLDBCQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBS3RELHNCQUFJLGtDQUFRO1FBSFo7O1dBRUc7YUFDSCxjQUEyQixNQUFNLENBQUMsMEJBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFLcEQsc0JBQUksa0NBQVE7UUFIWjs7V0FFRzthQUNILGNBQXNCLE1BQU0sQ0FBQywwQkFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTs7SUFLL0Msc0JBQUksa0NBQVE7UUFIWjs7V0FFRzthQUNILGNBQTBCLE1BQU0sQ0FBQywwQkFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTs7SUFLbkQsc0JBQUksMkNBQWlCO1FBSHJCOztXQUVHO2FBQ0gsY0FBNkMsTUFBTSxDQUFDLDBCQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBS3RFLHNCQUFJLHVDQUFhO1FBSGpCOztXQUVHO2FBQ0gsY0FBNEIsTUFBTSxDQUFDLDBCQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBV3ZELG1CQUFDO0FBQUQsQ0FBQyxBQXhDRCxJQXdDQztBQXhDcUIsb0JBQVksZUF3Q2pDLENBQUE7QUFFRDtJQUFtQyxpQ0FBWTtJQUM3Qyx1QkFBb0IsWUFBd0IsRUFBVSxjQUFvQjtRQUFJLGlCQUFPLENBQUM7UUFBbEUsaUJBQVksR0FBWixZQUFZLENBQVk7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBTTtJQUFhLENBQUM7SUFDeEYsc0JBQUksbUNBQVE7YUFBWixjQUE2QixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUNuRSxzQkFBSSxtQ0FBUTthQUFaLGNBQTJCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQy9ELHNCQUFJLG1DQUFRO2FBQVosY0FBc0IsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7O0lBQzNELHNCQUFJLG1DQUFRO2FBQVosY0FBMEIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7OztPQUFBOztJQUNwRSxzQkFBSSw0Q0FBaUI7YUFBckIsY0FBNkMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTs7SUFDcEUsc0JBQUksd0NBQWE7YUFBakIsY0FBNEIsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUV6RCwrQkFBTyxHQUFQLGNBQWtCLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMzRCxpQ0FBUyxHQUFULFVBQVUsUUFBa0IsSUFBVSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUUsb0JBQUM7QUFBRCxDQUFDLEFBWEQsQ0FBbUMsWUFBWSxHQVc5QztBQVhZLHFCQUFhLGdCQVd6QixDQUFBO0FBR0Q7SUFDRSwwQkFBbUIsUUFBZ0IsRUFBVSxZQUFzQixFQUMvQyxjQUFvQjtRQURyQixhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQVUsaUJBQVksR0FBWixZQUFZLENBQVU7UUFDL0MsbUJBQWMsR0FBZCxjQUFjLENBQU07SUFBRyxDQUFDO0lBRTVDLHNCQUFJLDJDQUFhO2FBQWpCLGNBQTRCLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFekQ7O09BRUc7SUFDSCxpQ0FBTSxHQUFOLFVBQU8sUUFBa0IsRUFBRSxnQkFBZ0MsRUFDcEQsa0JBQXVDO1FBRG5CLGdDQUFnQyxHQUFoQyx1QkFBZ0M7UUFDcEQsa0NBQXVDLEdBQXZDLHlCQUF1QztRQUM1QyxJQUFJLEVBQUUsR0FBYyxRQUFRLENBQUMsR0FBRyxDQUFDLHNCQUFTLENBQUMsQ0FBQztRQUM1QyxFQUFFLENBQUMsQ0FBQyxjQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLENBQUM7UUFDRCx1REFBdUQ7UUFDdkQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JELElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUN4RSxNQUFNLENBQUMsSUFBSSxhQUFhLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBcEJIO1FBQUMsWUFBSyxFQUFFOzt3QkFBQTtJQXFCUix1QkFBQztBQUFELENBQUMsQUFwQkQsSUFvQkM7QUFwQlksd0JBQWdCLG1CQW9CNUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7VHlwZSwgQ09OU1QsIGlzUHJlc2VudCwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7dW5pbXBsZW1lbnRlZH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7RWxlbWVudFJlZn0gZnJvbSAnLi9lbGVtZW50X3JlZic7XG5pbXBvcnQge1ZpZXdSZWYsIFZpZXdSZWZffSBmcm9tICcuL3ZpZXdfcmVmJztcbmltcG9ydCB7QXBwRWxlbWVudH0gZnJvbSAnLi9lbGVtZW50JztcbmltcG9ydCB7Vmlld1V0aWxzfSBmcm9tICcuL3ZpZXdfdXRpbHMnO1xuaW1wb3J0IHtDaGFuZ2VEZXRlY3RvclJlZn0gZnJvbSAnLi4vY2hhbmdlX2RldGVjdGlvbi9jaGFuZ2VfZGV0ZWN0aW9uJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIGluc3RhbmNlIG9mIGEgQ29tcG9uZW50IGNyZWF0ZWQgdmlhIGEge0BsaW5rIENvbXBvbmVudEZhY3Rvcnl9LlxuICpcbiAqIGBDb21wb25lbnRSZWZgIHByb3ZpZGVzIGFjY2VzcyB0byB0aGUgQ29tcG9uZW50IEluc3RhbmNlIGFzIHdlbGwgb3RoZXIgb2JqZWN0cyByZWxhdGVkIHRvIHRoaXNcbiAqIENvbXBvbmVudCBJbnN0YW5jZSBhbmQgYWxsb3dzIHlvdSB0byBkZXN0cm95IHRoZSBDb21wb25lbnQgSW5zdGFuY2UgdmlhIHRoZSB7QGxpbmsgI2Rlc3Ryb3l9XG4gKiBtZXRob2QuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb21wb25lbnRSZWYge1xuICAvKipcbiAgICogTG9jYXRpb24gb2YgdGhlIEhvc3QgRWxlbWVudCBvZiB0aGlzIENvbXBvbmVudCBJbnN0YW5jZS5cbiAgICovXG4gIGdldCBsb2NhdGlvbigpOiBFbGVtZW50UmVmIHsgcmV0dXJuIHVuaW1wbGVtZW50ZWQoKTsgfVxuXG4gIC8qKlxuICAgKiBUaGUgaW5qZWN0b3Igb24gd2hpY2ggdGhlIGNvbXBvbmVudCBpbnN0YW5jZSBleGlzdHMuXG4gICAqL1xuICBnZXQgaW5qZWN0b3IoKTogSW5qZWN0b3IgeyByZXR1cm4gdW5pbXBsZW1lbnRlZCgpOyB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnN0YW5jZSBvZiB0aGUgQ29tcG9uZW50LlxuICAgKi9cbiAgZ2V0IGluc3RhbmNlKCk6IGFueSB7IHJldHVybiB1bmltcGxlbWVudGVkKCk7IH07XG5cbiAgLyoqXG4gICAqIFRoZSB7QGxpbmsgVmlld1JlZn0gb2YgdGhlIEhvc3QgVmlldyBvZiB0aGlzIENvbXBvbmVudCBpbnN0YW5jZS5cbiAgICovXG4gIGdldCBob3N0VmlldygpOiBWaWV3UmVmIHsgcmV0dXJuIHVuaW1wbGVtZW50ZWQoKTsgfTtcblxuICAvKipcbiAgICogVGhlIHtAbGluayBDaGFuZ2VEZXRlY3RvclJlZn0gb2YgdGhlIENvbXBvbmVudCBpbnN0YW5jZS5cbiAgICovXG4gIGdldCBjaGFuZ2VEZXRlY3RvclJlZigpOiBDaGFuZ2VEZXRlY3RvclJlZiB7IHJldHVybiB1bmltcGxlbWVudGVkKCk7IH1cblxuICAvKipcbiAgICogVGhlIGNvbXBvbmVudCB0eXBlLlxuICAgKi9cbiAgZ2V0IGNvbXBvbmVudFR5cGUoKTogVHlwZSB7IHJldHVybiB1bmltcGxlbWVudGVkKCk7IH1cblxuICAvKipcbiAgICogRGVzdHJveXMgdGhlIGNvbXBvbmVudCBpbnN0YW5jZSBhbmQgYWxsIG9mIHRoZSBkYXRhIHN0cnVjdHVyZXMgYXNzb2NpYXRlZCB3aXRoIGl0LlxuICAgKi9cbiAgYWJzdHJhY3QgZGVzdHJveSgpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBbGxvd3MgdG8gcmVnaXN0ZXIgYSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuXG4gICAqL1xuICBhYnN0cmFjdCBvbkRlc3Ryb3koY2FsbGJhY2s6IEZ1bmN0aW9uKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudFJlZl8gZXh0ZW5kcyBDb21wb25lbnRSZWYge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9ob3N0RWxlbWVudDogQXBwRWxlbWVudCwgcHJpdmF0ZSBfY29tcG9uZW50VHlwZTogVHlwZSkgeyBzdXBlcigpOyB9XG4gIGdldCBsb2NhdGlvbigpOiBFbGVtZW50UmVmIHsgcmV0dXJuIHRoaXMuX2hvc3RFbGVtZW50LmVsZW1lbnRSZWY7IH1cbiAgZ2V0IGluamVjdG9yKCk6IEluamVjdG9yIHsgcmV0dXJuIHRoaXMuX2hvc3RFbGVtZW50LmluamVjdG9yOyB9XG4gIGdldCBpbnN0YW5jZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5faG9zdEVsZW1lbnQuY29tcG9uZW50OyB9O1xuICBnZXQgaG9zdFZpZXcoKTogVmlld1JlZiB7IHJldHVybiB0aGlzLl9ob3N0RWxlbWVudC5wYXJlbnRWaWV3LnJlZjsgfTtcbiAgZ2V0IGNoYW5nZURldGVjdG9yUmVmKCk6IENoYW5nZURldGVjdG9yUmVmIHsgcmV0dXJuIHRoaXMuaG9zdFZpZXc7IH07XG4gIGdldCBjb21wb25lbnRUeXBlKCk6IFR5cGUgeyByZXR1cm4gdGhpcy5fY29tcG9uZW50VHlwZTsgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7IHRoaXMuX2hvc3RFbGVtZW50LnBhcmVudFZpZXcuZGVzdHJveSgpOyB9XG4gIG9uRGVzdHJveShjYWxsYmFjazogRnVuY3Rpb24pOiB2b2lkIHsgdGhpcy5ob3N0Vmlldy5vbkRlc3Ryb3koY2FsbGJhY2spOyB9XG59XG5cbkBDT05TVCgpXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50RmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzZWxlY3Rvcjogc3RyaW5nLCBwcml2YXRlIF92aWV3RmFjdG9yeTogRnVuY3Rpb24sXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NvbXBvbmVudFR5cGU6IFR5cGUpIHt9XG5cbiAgZ2V0IGNvbXBvbmVudFR5cGUoKTogVHlwZSB7IHJldHVybiB0aGlzLl9jb21wb25lbnRUeXBlOyB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgY29tcG9uZW50LlxuICAgKi9cbiAgY3JlYXRlKGluamVjdG9yOiBJbmplY3RvciwgcHJvamVjdGFibGVOb2RlczogYW55W11bXSA9IG51bGwsXG4gICAgICAgICByb290U2VsZWN0b3JPck5vZGU6IHN0cmluZyB8IGFueSA9IG51bGwpOiBDb21wb25lbnRSZWYge1xuICAgIHZhciB2dTogVmlld1V0aWxzID0gaW5qZWN0b3IuZ2V0KFZpZXdVdGlscyk7XG4gICAgaWYgKGlzQmxhbmsocHJvamVjdGFibGVOb2RlcykpIHtcbiAgICAgIHByb2plY3RhYmxlTm9kZXMgPSBbXTtcbiAgICB9XG4gICAgLy8gTm90ZTogSG9zdCB2aWV3cyBkb24ndCBuZWVkIGEgZGVjbGFyYXRpb25BcHBFbGVtZW50IVxuICAgIHZhciBob3N0VmlldyA9IHRoaXMuX3ZpZXdGYWN0b3J5KHZ1LCBpbmplY3RvciwgbnVsbCk7XG4gICAgdmFyIGhvc3RFbGVtZW50ID0gaG9zdFZpZXcuY3JlYXRlKHByb2plY3RhYmxlTm9kZXMsIHJvb3RTZWxlY3Rvck9yTm9kZSk7XG4gICAgcmV0dXJuIG5ldyBDb21wb25lbnRSZWZfKGhvc3RFbGVtZW50LCB0aGlzLl9jb21wb25lbnRUeXBlKTtcbiAgfVxufVxuIl19