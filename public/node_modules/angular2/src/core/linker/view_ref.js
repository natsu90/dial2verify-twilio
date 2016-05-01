'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var exceptions_1 = require('angular2/src/facade/exceptions');
var change_detector_ref_1 = require('../change_detection/change_detector_ref');
var constants_1 = require('angular2/src/core/change_detection/constants');
var ViewRef = (function (_super) {
    __extends(ViewRef, _super);
    function ViewRef() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(ViewRef.prototype, "changeDetectorRef", {
        /**
         * @internal
         */
        get: function () { return exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ViewRef.prototype, "destroyed", {
        get: function () { return exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    return ViewRef;
}(change_detector_ref_1.ChangeDetectorRef));
exports.ViewRef = ViewRef;
/**
 * Represents an Angular View.
 *
 * <!-- TODO: move the next two paragraphs to the dev guide -->
 * A View is a fundamental building block of the application UI. It is the smallest grouping of
 * Elements which are created and destroyed together.
 *
 * Properties of elements in a View can change, but the structure (number and order) of elements in
 * a View cannot. Changing the structure of Elements can only be done by inserting, moving or
 * removing nested Views via a {@link ViewContainerRef}. Each View can contain many View Containers.
 * <!-- /TODO -->
 *
 * ### Example
 *
 * Given this template...
 *
 * ```
 * Count: {{items.length}}
 * <ul>
 *   <li *ngFor="var item of items">{{item}}</li>
 * </ul>
 * ```
 *
 * ... we have two {@link ProtoViewRef}s:
 *
 * Outer {@link ProtoViewRef}:
 * ```
 * Count: {{items.length}}
 * <ul>
 *   <template ngFor var-item [ngForOf]="items"></template>
 * </ul>
 * ```
 *
 * Inner {@link ProtoViewRef}:
 * ```
 *   <li>{{item}}</li>
 * ```
 *
 * Notice that the original template is broken down into two separate {@link ProtoViewRef}s.
 *
 * The outer/inner {@link ProtoViewRef}s are then assembled into views like so:
 *
 * ```
 * <!-- ViewRef: outer-0 -->
 * Count: 2
 * <ul>
 *   <template view-container-ref></template>
 *   <!-- ViewRef: inner-1 --><li>first</li><!-- /ViewRef: inner-1 -->
 *   <!-- ViewRef: inner-2 --><li>second</li><!-- /ViewRef: inner-2 -->
 * </ul>
 * <!-- /ViewRef: outer-0 -->
 * ```
 */
var EmbeddedViewRef = (function (_super) {
    __extends(EmbeddedViewRef, _super);
    function EmbeddedViewRef() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(EmbeddedViewRef.prototype, "rootNodes", {
        get: function () { return exceptions_1.unimplemented(); },
        enumerable: true,
        configurable: true
    });
    ;
    return EmbeddedViewRef;
}(ViewRef));
exports.EmbeddedViewRef = EmbeddedViewRef;
var ViewRef_ = (function () {
    function ViewRef_(_view) {
        this._view = _view;
        this._view = _view;
    }
    Object.defineProperty(ViewRef_.prototype, "internalView", {
        get: function () { return this._view; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewRef_.prototype, "changeDetectorRef", {
        /**
         * Return `ChangeDetectorRef`
         */
        get: function () { return this; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewRef_.prototype, "rootNodes", {
        get: function () { return this._view.flatRootNodes; },
        enumerable: true,
        configurable: true
    });
    ViewRef_.prototype.setLocal = function (variableName, value) { this._view.setLocal(variableName, value); };
    ViewRef_.prototype.hasLocal = function (variableName) { return this._view.hasLocal(variableName); };
    Object.defineProperty(ViewRef_.prototype, "destroyed", {
        get: function () { return this._view.destroyed; },
        enumerable: true,
        configurable: true
    });
    ViewRef_.prototype.markForCheck = function () { this._view.markPathToRootAsCheckOnce(); };
    ViewRef_.prototype.detach = function () { this._view.cdMode = constants_1.ChangeDetectionStrategy.Detached; };
    ViewRef_.prototype.detectChanges = function () { this._view.detectChanges(false); };
    ViewRef_.prototype.checkNoChanges = function () { this._view.detectChanges(true); };
    ViewRef_.prototype.reattach = function () {
        this._view.cdMode = constants_1.ChangeDetectionStrategy.CheckAlways;
        this.markForCheck();
    };
    ViewRef_.prototype.onDestroy = function (callback) { this._view.disposables.push(callback); };
    ViewRef_.prototype.destroy = function () { this._view.destroy(); };
    return ViewRef_;
}());
exports.ViewRef_ = ViewRef_;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19yZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTRubzNaUXZPLnRtcC9hbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvdmlld19yZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMkJBQTRCLGdDQUFnQyxDQUFDLENBQUE7QUFFN0Qsb0NBQWdDLHlDQUF5QyxDQUFDLENBQUE7QUFFMUUsMEJBQXNDLDhDQUE4QyxDQUFDLENBQUE7QUFFckY7SUFBc0MsMkJBQWlCO0lBQXZEO1FBQXNDLDhCQUFpQjtJQVN2RCxDQUFDO0lBTEMsc0JBQUksc0NBQWlCO1FBSHJCOztXQUVHO2FBQ0gsY0FBNkMsTUFBTSxDQUFvQiwwQkFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTs7SUFFekYsc0JBQUksOEJBQVM7YUFBYixjQUEyQixNQUFNLENBQVUsMEJBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFHL0QsY0FBQztBQUFELENBQUMsQUFURCxDQUFzQyx1Q0FBaUIsR0FTdEQ7QUFUcUIsZUFBTyxVQVM1QixDQUFBO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvREc7QUFDSDtJQUE4QyxtQ0FBTztJQUFyRDtRQUE4Qyw4QkFBTztJQWlCckQsQ0FBQztJQU5DLHNCQUFJLHNDQUFTO2FBQWIsY0FBeUIsTUFBTSxDQUFRLDBCQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztPQUFBOztJQU0zRCxzQkFBQztBQUFELENBQUMsQUFqQkQsQ0FBOEMsT0FBTyxHQWlCcEQ7QUFqQnFCLHVCQUFlLGtCQWlCcEMsQ0FBQTtBQUVEO0lBQ0Usa0JBQW9CLEtBQW1CO1FBQW5CLFVBQUssR0FBTCxLQUFLLENBQWM7UUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUFDLENBQUM7SUFFaEUsc0JBQUksa0NBQVk7YUFBaEIsY0FBbUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUt2RCxzQkFBSSx1Q0FBaUI7UUFIckI7O1dBRUc7YUFDSCxjQUE2QyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFM0Qsc0JBQUksK0JBQVM7YUFBYixjQUF5QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUUzRCwyQkFBUSxHQUFSLFVBQVMsWUFBb0IsRUFBRSxLQUFVLElBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU5RiwyQkFBUSxHQUFSLFVBQVMsWUFBb0IsSUFBYSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXJGLHNCQUFJLCtCQUFTO2FBQWIsY0FBMkIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFekQsK0JBQVksR0FBWixjQUF1QixJQUFJLENBQUMsS0FBSyxDQUFDLHlCQUF5QixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLHlCQUFNLEdBQU4sY0FBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsbUNBQXVCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN4RSxnQ0FBYSxHQUFiLGNBQXdCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRCxpQ0FBYyxHQUFkLGNBQXlCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRCwyQkFBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsbUNBQXVCLENBQUMsV0FBVyxDQUFDO1FBQ3hELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQsNEJBQVMsR0FBVCxVQUFVLFFBQWtCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV4RSwwQkFBTyxHQUFQLGNBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDckMsZUFBQztBQUFELENBQUMsQUE5QkQsSUE4QkM7QUE5QlksZ0JBQVEsV0E4QnBCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3VuaW1wbGVtZW50ZWR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge2lzUHJlc2VudH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7Q2hhbmdlRGV0ZWN0b3JSZWZ9IGZyb20gJy4uL2NoYW5nZV9kZXRlY3Rpb24vY2hhbmdlX2RldGVjdG9yX3JlZic7XG5pbXBvcnQge0FwcFZpZXd9IGZyb20gJy4vdmlldyc7XG5pbXBvcnQge0NoYW5nZURldGVjdGlvblN0cmF0ZWd5fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWaWV3UmVmIGV4dGVuZHMgQ2hhbmdlRGV0ZWN0b3JSZWYge1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBnZXQgY2hhbmdlRGV0ZWN0b3JSZWYoKTogQ2hhbmdlRGV0ZWN0b3JSZWYgeyByZXR1cm4gPENoYW5nZURldGVjdG9yUmVmPnVuaW1wbGVtZW50ZWQoKTsgfTtcblxuICBnZXQgZGVzdHJveWVkKCk6IGJvb2xlYW4geyByZXR1cm4gPGJvb2xlYW4+dW5pbXBsZW1lbnRlZCgpOyB9XG5cbiAgYWJzdHJhY3Qgb25EZXN0cm95KGNhbGxiYWNrOiBGdW5jdGlvbik7XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhbiBBbmd1bGFyIFZpZXcuXG4gKlxuICogPCEtLSBUT0RPOiBtb3ZlIHRoZSBuZXh0IHR3byBwYXJhZ3JhcGhzIHRvIHRoZSBkZXYgZ3VpZGUgLS0+XG4gKiBBIFZpZXcgaXMgYSBmdW5kYW1lbnRhbCBidWlsZGluZyBibG9jayBvZiB0aGUgYXBwbGljYXRpb24gVUkuIEl0IGlzIHRoZSBzbWFsbGVzdCBncm91cGluZyBvZlxuICogRWxlbWVudHMgd2hpY2ggYXJlIGNyZWF0ZWQgYW5kIGRlc3Ryb3llZCB0b2dldGhlci5cbiAqXG4gKiBQcm9wZXJ0aWVzIG9mIGVsZW1lbnRzIGluIGEgVmlldyBjYW4gY2hhbmdlLCBidXQgdGhlIHN0cnVjdHVyZSAobnVtYmVyIGFuZCBvcmRlcikgb2YgZWxlbWVudHMgaW5cbiAqIGEgVmlldyBjYW5ub3QuIENoYW5naW5nIHRoZSBzdHJ1Y3R1cmUgb2YgRWxlbWVudHMgY2FuIG9ubHkgYmUgZG9uZSBieSBpbnNlcnRpbmcsIG1vdmluZyBvclxuICogcmVtb3ZpbmcgbmVzdGVkIFZpZXdzIHZpYSBhIHtAbGluayBWaWV3Q29udGFpbmVyUmVmfS4gRWFjaCBWaWV3IGNhbiBjb250YWluIG1hbnkgVmlldyBDb250YWluZXJzLlxuICogPCEtLSAvVE9ETyAtLT5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIEdpdmVuIHRoaXMgdGVtcGxhdGUuLi5cbiAqXG4gKiBgYGBcbiAqIENvdW50OiB7e2l0ZW1zLmxlbmd0aH19XG4gKiA8dWw+XG4gKiAgIDxsaSAqbmdGb3I9XCJ2YXIgaXRlbSBvZiBpdGVtc1wiPnt7aXRlbX19PC9saT5cbiAqIDwvdWw+XG4gKiBgYGBcbiAqXG4gKiAuLi4gd2UgaGF2ZSB0d28ge0BsaW5rIFByb3RvVmlld1JlZn1zOlxuICpcbiAqIE91dGVyIHtAbGluayBQcm90b1ZpZXdSZWZ9OlxuICogYGBgXG4gKiBDb3VudDoge3tpdGVtcy5sZW5ndGh9fVxuICogPHVsPlxuICogICA8dGVtcGxhdGUgbmdGb3IgdmFyLWl0ZW0gW25nRm9yT2ZdPVwiaXRlbXNcIj48L3RlbXBsYXRlPlxuICogPC91bD5cbiAqIGBgYFxuICpcbiAqIElubmVyIHtAbGluayBQcm90b1ZpZXdSZWZ9OlxuICogYGBgXG4gKiAgIDxsaT57e2l0ZW19fTwvbGk+XG4gKiBgYGBcbiAqXG4gKiBOb3RpY2UgdGhhdCB0aGUgb3JpZ2luYWwgdGVtcGxhdGUgaXMgYnJva2VuIGRvd24gaW50byB0d28gc2VwYXJhdGUge0BsaW5rIFByb3RvVmlld1JlZn1zLlxuICpcbiAqIFRoZSBvdXRlci9pbm5lciB7QGxpbmsgUHJvdG9WaWV3UmVmfXMgYXJlIHRoZW4gYXNzZW1ibGVkIGludG8gdmlld3MgbGlrZSBzbzpcbiAqXG4gKiBgYGBcbiAqIDwhLS0gVmlld1JlZjogb3V0ZXItMCAtLT5cbiAqIENvdW50OiAyXG4gKiA8dWw+XG4gKiAgIDx0ZW1wbGF0ZSB2aWV3LWNvbnRhaW5lci1yZWY+PC90ZW1wbGF0ZT5cbiAqICAgPCEtLSBWaWV3UmVmOiBpbm5lci0xIC0tPjxsaT5maXJzdDwvbGk+PCEtLSAvVmlld1JlZjogaW5uZXItMSAtLT5cbiAqICAgPCEtLSBWaWV3UmVmOiBpbm5lci0yIC0tPjxsaT5zZWNvbmQ8L2xpPjwhLS0gL1ZpZXdSZWY6IGlubmVyLTIgLS0+XG4gKiA8L3VsPlxuICogPCEtLSAvVmlld1JlZjogb3V0ZXItMCAtLT5cbiAqIGBgYFxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRW1iZWRkZWRWaWV3UmVmIGV4dGVuZHMgVmlld1JlZiB7XG4gIC8qKlxuICAgKiBTZXRzIGB2YWx1ZWAgb2YgbG9jYWwgdmFyaWFibGUgY2FsbGVkIGB2YXJpYWJsZU5hbWVgIGluIHRoaXMgVmlldy5cbiAgICovXG4gIGFic3RyYWN0IHNldExvY2FsKHZhcmlhYmxlTmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZDtcblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgdGhpcyB2aWV3IGhhcyBhIGxvY2FsIHZhcmlhYmxlIGNhbGxlZCBgdmFyaWFibGVOYW1lYC5cbiAgICovXG4gIGFic3RyYWN0IGhhc0xvY2FsKHZhcmlhYmxlTmFtZTogc3RyaW5nKTogYm9vbGVhbjtcblxuICBnZXQgcm9vdE5vZGVzKCk6IGFueVtdIHsgcmV0dXJuIDxhbnlbXT51bmltcGxlbWVudGVkKCk7IH07XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIHRoZSB2aWV3IGFuZCBhbGwgb2YgdGhlIGRhdGEgc3RydWN0dXJlcyBhc3NvY2lhdGVkIHdpdGggaXQuXG4gICAqL1xuICBhYnN0cmFjdCBkZXN0cm95KCk7XG59XG5cbmV4cG9ydCBjbGFzcyBWaWV3UmVmXyBpbXBsZW1lbnRzIEVtYmVkZGVkVmlld1JlZiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3ZpZXc6IEFwcFZpZXc8YW55PikgeyB0aGlzLl92aWV3ID0gX3ZpZXc7IH1cblxuICBnZXQgaW50ZXJuYWxWaWV3KCk6IEFwcFZpZXc8YW55PiB7IHJldHVybiB0aGlzLl92aWV3OyB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBgQ2hhbmdlRGV0ZWN0b3JSZWZgXG4gICAqL1xuICBnZXQgY2hhbmdlRGV0ZWN0b3JSZWYoKTogQ2hhbmdlRGV0ZWN0b3JSZWYgeyByZXR1cm4gdGhpczsgfVxuXG4gIGdldCByb290Tm9kZXMoKTogYW55W10geyByZXR1cm4gdGhpcy5fdmlldy5mbGF0Um9vdE5vZGVzOyB9XG5cbiAgc2V0TG9jYWwodmFyaWFibGVOYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHsgdGhpcy5fdmlldy5zZXRMb2NhbCh2YXJpYWJsZU5hbWUsIHZhbHVlKTsgfVxuXG4gIGhhc0xvY2FsKHZhcmlhYmxlTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl92aWV3Lmhhc0xvY2FsKHZhcmlhYmxlTmFtZSk7IH1cblxuICBnZXQgZGVzdHJveWVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fdmlldy5kZXN0cm95ZWQ7IH1cblxuICBtYXJrRm9yQ2hlY2soKTogdm9pZCB7IHRoaXMuX3ZpZXcubWFya1BhdGhUb1Jvb3RBc0NoZWNrT25jZSgpOyB9XG4gIGRldGFjaCgpOiB2b2lkIHsgdGhpcy5fdmlldy5jZE1vZGUgPSBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZXRhY2hlZDsgfVxuICBkZXRlY3RDaGFuZ2VzKCk6IHZvaWQgeyB0aGlzLl92aWV3LmRldGVjdENoYW5nZXMoZmFsc2UpOyB9XG4gIGNoZWNrTm9DaGFuZ2VzKCk6IHZvaWQgeyB0aGlzLl92aWV3LmRldGVjdENoYW5nZXModHJ1ZSk7IH1cbiAgcmVhdHRhY2goKTogdm9pZCB7XG4gICAgdGhpcy5fdmlldy5jZE1vZGUgPSBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5DaGVja0Fsd2F5cztcbiAgICB0aGlzLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgb25EZXN0cm95KGNhbGxiYWNrOiBGdW5jdGlvbikgeyB0aGlzLl92aWV3LmRpc3Bvc2FibGVzLnB1c2goY2FsbGJhY2spOyB9XG5cbiAgZGVzdHJveSgpIHsgdGhpcy5fdmlldy5kZXN0cm95KCk7IH1cbn1cbiJdfQ==