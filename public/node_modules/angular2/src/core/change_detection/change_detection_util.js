'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var lang_2 = require('angular2/src/facade/lang');
exports.looseIdentical = lang_2.looseIdentical;
exports.uninitialized = lang_1.CONST_EXPR(new Object());
function devModeEqual(a, b) {
    if (collection_1.isListLikeIterable(a) && collection_1.isListLikeIterable(b)) {
        return collection_1.areIterablesEqual(a, b, devModeEqual);
    }
    else if (!collection_1.isListLikeIterable(a) && !lang_1.isPrimitive(a) && !collection_1.isListLikeIterable(b) &&
        !lang_1.isPrimitive(b)) {
        return true;
    }
    else {
        return lang_1.looseIdentical(a, b);
    }
}
exports.devModeEqual = devModeEqual;
/**
 * Indicates that the result of a {@link PipeMetadata} transformation has changed even though the
 * reference
 * has not changed.
 *
 * The wrapped value will be unwrapped by change detection, and the unwrapped value will be stored.
 *
 * Example:
 *
 * ```
 * if (this._latestValue === this._latestReturnedValue) {
 *    return this._latestReturnedValue;
 *  } else {
 *    this._latestReturnedValue = this._latestValue;
 *    return WrappedValue.wrap(this._latestValue); // this will force update
 *  }
 * ```
 */
var WrappedValue = (function () {
    function WrappedValue(wrapped) {
        this.wrapped = wrapped;
    }
    WrappedValue.wrap = function (value) { return new WrappedValue(value); };
    return WrappedValue;
}());
exports.WrappedValue = WrappedValue;
/**
 * Helper class for unwrapping WrappedValue s
 */
var ValueUnwrapper = (function () {
    function ValueUnwrapper() {
        this.hasWrappedValue = false;
    }
    ValueUnwrapper.prototype.unwrap = function (value) {
        if (value instanceof WrappedValue) {
            this.hasWrappedValue = true;
            return value.wrapped;
        }
        return value;
    };
    ValueUnwrapper.prototype.reset = function () { this.hasWrappedValue = false; };
    return ValueUnwrapper;
}());
exports.ValueUnwrapper = ValueUnwrapper;
/**
 * Represents a basic change from a previous to a new value.
 */
var SimpleChange = (function () {
    function SimpleChange(previousValue, currentValue) {
        this.previousValue = previousValue;
        this.currentValue = currentValue;
    }
    /**
     * Check whether the new value is the first value assigned.
     */
    SimpleChange.prototype.isFirstChange = function () { return this.previousValue === exports.uninitialized; };
    return SimpleChange;
}());
exports.SimpleChange = SimpleChange;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlX2RldGVjdGlvbl91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC00bm8zWlF2Ty50bXAvYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9jaGFuZ2VfZGV0ZWN0aW9uX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUErRCwwQkFBMEIsQ0FBQyxDQUFBO0FBQzFGLDJCQUlPLGdDQUFnQyxDQUFDLENBQUE7QUFFeEMscUJBQTZCLDBCQUEwQixDQUFDO0FBQWhELCtDQUFnRDtBQUM3QyxxQkFBYSxHQUFXLGlCQUFVLENBQVMsSUFBSSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBRXBFLHNCQUE2QixDQUFNLEVBQUUsQ0FBTTtJQUN6QyxFQUFFLENBQUMsQ0FBQywrQkFBa0IsQ0FBQyxDQUFDLENBQUMsSUFBSSwrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkQsTUFBTSxDQUFDLDhCQUFpQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFFL0MsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLCtCQUFrQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLCtCQUFrQixDQUFDLENBQUMsQ0FBQztRQUNuRSxDQUFDLGtCQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFFZCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixNQUFNLENBQUMscUJBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUIsQ0FBQztBQUNILENBQUM7QUFYZSxvQkFBWSxlQVczQixDQUFBO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBQ0g7SUFDRSxzQkFBbUIsT0FBWTtRQUFaLFlBQU8sR0FBUCxPQUFPLENBQUs7SUFBRyxDQUFDO0lBRTVCLGlCQUFJLEdBQVgsVUFBWSxLQUFVLElBQWtCLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0UsbUJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpZLG9CQUFZLGVBSXhCLENBQUE7QUFFRDs7R0FFRztBQUNIO0lBQUE7UUFDUyxvQkFBZSxHQUFHLEtBQUssQ0FBQztJQVdqQyxDQUFDO0lBVEMsK0JBQU0sR0FBTixVQUFPLEtBQVU7UUFDZixFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztZQUM1QixNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUN2QixDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCw4QkFBSyxHQUFMLGNBQVUsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzNDLHFCQUFDO0FBQUQsQ0FBQyxBQVpELElBWUM7QUFaWSxzQkFBYyxpQkFZMUIsQ0FBQTtBQUVEOztHQUVHO0FBQ0g7SUFDRSxzQkFBbUIsYUFBa0IsRUFBUyxZQUFpQjtRQUE1QyxrQkFBYSxHQUFiLGFBQWEsQ0FBSztRQUFTLGlCQUFZLEdBQVosWUFBWSxDQUFLO0lBQUcsQ0FBQztJQUVuRTs7T0FFRztJQUNILG9DQUFhLEdBQWIsY0FBMkIsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEtBQUsscUJBQWEsQ0FBQyxDQUFDLENBQUM7SUFDM0UsbUJBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQztBQVBZLG9CQUFZLGVBT3hCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NPTlNUX0VYUFIsIGlzQmxhbmssIGxvb3NlSWRlbnRpY2FsLCBpc1ByaW1pdGl2ZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7XG4gIFN0cmluZ01hcFdyYXBwZXIsXG4gIGlzTGlzdExpa2VJdGVyYWJsZSxcbiAgYXJlSXRlcmFibGVzRXF1YWxcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcblxuZXhwb3J0IHtsb29zZUlkZW50aWNhbH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmV4cG9ydCB2YXIgdW5pbml0aWFsaXplZDogT2JqZWN0ID0gQ09OU1RfRVhQUjxPYmplY3Q+KG5ldyBPYmplY3QoKSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXZNb2RlRXF1YWwoYTogYW55LCBiOiBhbnkpOiBib29sZWFuIHtcbiAgaWYgKGlzTGlzdExpa2VJdGVyYWJsZShhKSAmJiBpc0xpc3RMaWtlSXRlcmFibGUoYikpIHtcbiAgICByZXR1cm4gYXJlSXRlcmFibGVzRXF1YWwoYSwgYiwgZGV2TW9kZUVxdWFsKTtcblxuICB9IGVsc2UgaWYgKCFpc0xpc3RMaWtlSXRlcmFibGUoYSkgJiYgIWlzUHJpbWl0aXZlKGEpICYmICFpc0xpc3RMaWtlSXRlcmFibGUoYikgJiZcbiAgICAgICAgICAgICAhaXNQcmltaXRpdmUoYikpIHtcbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9IGVsc2Uge1xuICAgIHJldHVybiBsb29zZUlkZW50aWNhbChhLCBiKTtcbiAgfVxufVxuXG4vKipcbiAqIEluZGljYXRlcyB0aGF0IHRoZSByZXN1bHQgb2YgYSB7QGxpbmsgUGlwZU1ldGFkYXRhfSB0cmFuc2Zvcm1hdGlvbiBoYXMgY2hhbmdlZCBldmVuIHRob3VnaCB0aGVcbiAqIHJlZmVyZW5jZVxuICogaGFzIG5vdCBjaGFuZ2VkLlxuICpcbiAqIFRoZSB3cmFwcGVkIHZhbHVlIHdpbGwgYmUgdW53cmFwcGVkIGJ5IGNoYW5nZSBkZXRlY3Rpb24sIGFuZCB0aGUgdW53cmFwcGVkIHZhbHVlIHdpbGwgYmUgc3RvcmVkLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBgXG4gKiBpZiAodGhpcy5fbGF0ZXN0VmFsdWUgPT09IHRoaXMuX2xhdGVzdFJldHVybmVkVmFsdWUpIHtcbiAqICAgIHJldHVybiB0aGlzLl9sYXRlc3RSZXR1cm5lZFZhbHVlO1xuICogIH0gZWxzZSB7XG4gKiAgICB0aGlzLl9sYXRlc3RSZXR1cm5lZFZhbHVlID0gdGhpcy5fbGF0ZXN0VmFsdWU7XG4gKiAgICByZXR1cm4gV3JhcHBlZFZhbHVlLndyYXAodGhpcy5fbGF0ZXN0VmFsdWUpOyAvLyB0aGlzIHdpbGwgZm9yY2UgdXBkYXRlXG4gKiAgfVxuICogYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBXcmFwcGVkVmFsdWUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgd3JhcHBlZDogYW55KSB7fVxuXG4gIHN0YXRpYyB3cmFwKHZhbHVlOiBhbnkpOiBXcmFwcGVkVmFsdWUgeyByZXR1cm4gbmV3IFdyYXBwZWRWYWx1ZSh2YWx1ZSk7IH1cbn1cblxuLyoqXG4gKiBIZWxwZXIgY2xhc3MgZm9yIHVud3JhcHBpbmcgV3JhcHBlZFZhbHVlIHNcbiAqL1xuZXhwb3J0IGNsYXNzIFZhbHVlVW53cmFwcGVyIHtcbiAgcHVibGljIGhhc1dyYXBwZWRWYWx1ZSA9IGZhbHNlO1xuXG4gIHVud3JhcCh2YWx1ZTogYW55KTogYW55IHtcbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBXcmFwcGVkVmFsdWUpIHtcbiAgICAgIHRoaXMuaGFzV3JhcHBlZFZhbHVlID0gdHJ1ZTtcbiAgICAgIHJldHVybiB2YWx1ZS53cmFwcGVkO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICByZXNldCgpIHsgdGhpcy5oYXNXcmFwcGVkVmFsdWUgPSBmYWxzZTsgfVxufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBiYXNpYyBjaGFuZ2UgZnJvbSBhIHByZXZpb3VzIHRvIGEgbmV3IHZhbHVlLlxuICovXG5leHBvcnQgY2xhc3MgU2ltcGxlQ2hhbmdlIHtcbiAgY29uc3RydWN0b3IocHVibGljIHByZXZpb3VzVmFsdWU6IGFueSwgcHVibGljIGN1cnJlbnRWYWx1ZTogYW55KSB7fVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBuZXcgdmFsdWUgaXMgdGhlIGZpcnN0IHZhbHVlIGFzc2lnbmVkLlxuICAgKi9cbiAgaXNGaXJzdENoYW5nZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMucHJldmlvdXNWYWx1ZSA9PT0gdW5pbml0aWFsaXplZDsgfVxufVxuIl19