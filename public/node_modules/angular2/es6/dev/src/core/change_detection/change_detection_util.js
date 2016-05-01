import { CONST_EXPR, looseIdentical, isPrimitive } from 'angular2/src/facade/lang';
import { isListLikeIterable, areIterablesEqual } from 'angular2/src/facade/collection';
export { looseIdentical } from 'angular2/src/facade/lang';
export var uninitialized = CONST_EXPR(new Object());
export function devModeEqual(a, b) {
    if (isListLikeIterable(a) && isListLikeIterable(b)) {
        return areIterablesEqual(a, b, devModeEqual);
    }
    else if (!isListLikeIterable(a) && !isPrimitive(a) && !isListLikeIterable(b) &&
        !isPrimitive(b)) {
        return true;
    }
    else {
        return looseIdentical(a, b);
    }
}
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
export class WrappedValue {
    constructor(wrapped) {
        this.wrapped = wrapped;
    }
    static wrap(value) { return new WrappedValue(value); }
}
/**
 * Helper class for unwrapping WrappedValue s
 */
export class ValueUnwrapper {
    constructor() {
        this.hasWrappedValue = false;
    }
    unwrap(value) {
        if (value instanceof WrappedValue) {
            this.hasWrappedValue = true;
            return value.wrapped;
        }
        return value;
    }
    reset() { this.hasWrappedValue = false; }
}
/**
 * Represents a basic change from a previous to a new value.
 */
export class SimpleChange {
    constructor(previousValue, currentValue) {
        this.previousValue = previousValue;
        this.currentValue = currentValue;
    }
    /**
     * Check whether the new value is the first value assigned.
     */
    isFirstChange() { return this.previousValue === uninitialized; }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlX2RldGVjdGlvbl91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC05RDFpR1FWRy50bXAvYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9jaGFuZ2VfZGV0ZWN0aW9uX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxVQUFVLEVBQVcsY0FBYyxFQUFFLFdBQVcsRUFBQyxNQUFNLDBCQUEwQjtPQUNsRixFQUVMLGtCQUFrQixFQUNsQixpQkFBaUIsRUFDbEIsTUFBTSxnQ0FBZ0M7QUFFdkMsU0FBUSxjQUFjLFFBQU8sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxJQUFJLGFBQWEsR0FBVyxVQUFVLENBQVMsSUFBSSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBRXBFLDZCQUE2QixDQUFNLEVBQUUsQ0FBTTtJQUN6QyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkQsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFFL0MsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1FBQ25FLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDO0lBRWQsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUIsQ0FBQztBQUNILENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSDtJQUNFLFlBQW1CLE9BQVk7UUFBWixZQUFPLEdBQVAsT0FBTyxDQUFLO0lBQUcsQ0FBQztJQUVuQyxPQUFPLElBQUksQ0FBQyxLQUFVLElBQWtCLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUVEOztHQUVHO0FBQ0g7SUFBQTtRQUNTLG9CQUFlLEdBQUcsS0FBSyxDQUFDO0lBV2pDLENBQUM7SUFUQyxNQUFNLENBQUMsS0FBVTtRQUNmLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELEtBQUssS0FBSyxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDM0MsQ0FBQztBQUVEOztHQUVHO0FBQ0g7SUFDRSxZQUFtQixhQUFrQixFQUFTLFlBQWlCO1FBQTVDLGtCQUFhLEdBQWIsYUFBYSxDQUFLO1FBQVMsaUJBQVksR0FBWixZQUFZLENBQUs7SUFBRyxDQUFDO0lBRW5FOztPQUVHO0lBQ0gsYUFBYSxLQUFjLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDT05TVF9FWFBSLCBpc0JsYW5rLCBsb29zZUlkZW50aWNhbCwgaXNQcmltaXRpdmV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge1xuICBTdHJpbmdNYXBXcmFwcGVyLFxuICBpc0xpc3RMaWtlSXRlcmFibGUsXG4gIGFyZUl0ZXJhYmxlc0VxdWFsXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5cbmV4cG9ydCB7bG9vc2VJZGVudGljYWx9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5leHBvcnQgdmFyIHVuaW5pdGlhbGl6ZWQ6IE9iamVjdCA9IENPTlNUX0VYUFI8T2JqZWN0PihuZXcgT2JqZWN0KCkpO1xuXG5leHBvcnQgZnVuY3Rpb24gZGV2TW9kZUVxdWFsKGE6IGFueSwgYjogYW55KTogYm9vbGVhbiB7XG4gIGlmIChpc0xpc3RMaWtlSXRlcmFibGUoYSkgJiYgaXNMaXN0TGlrZUl0ZXJhYmxlKGIpKSB7XG4gICAgcmV0dXJuIGFyZUl0ZXJhYmxlc0VxdWFsKGEsIGIsIGRldk1vZGVFcXVhbCk7XG5cbiAgfSBlbHNlIGlmICghaXNMaXN0TGlrZUl0ZXJhYmxlKGEpICYmICFpc1ByaW1pdGl2ZShhKSAmJiAhaXNMaXN0TGlrZUl0ZXJhYmxlKGIpICYmXG4gICAgICAgICAgICAgIWlzUHJpbWl0aXZlKGIpKSB7XG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbG9vc2VJZGVudGljYWwoYSwgYik7XG4gIH1cbn1cblxuLyoqXG4gKiBJbmRpY2F0ZXMgdGhhdCB0aGUgcmVzdWx0IG9mIGEge0BsaW5rIFBpcGVNZXRhZGF0YX0gdHJhbnNmb3JtYXRpb24gaGFzIGNoYW5nZWQgZXZlbiB0aG91Z2ggdGhlXG4gKiByZWZlcmVuY2VcbiAqIGhhcyBub3QgY2hhbmdlZC5cbiAqXG4gKiBUaGUgd3JhcHBlZCB2YWx1ZSB3aWxsIGJlIHVud3JhcHBlZCBieSBjaGFuZ2UgZGV0ZWN0aW9uLCBhbmQgdGhlIHVud3JhcHBlZCB2YWx1ZSB3aWxsIGJlIHN0b3JlZC5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYFxuICogaWYgKHRoaXMuX2xhdGVzdFZhbHVlID09PSB0aGlzLl9sYXRlc3RSZXR1cm5lZFZhbHVlKSB7XG4gKiAgICByZXR1cm4gdGhpcy5fbGF0ZXN0UmV0dXJuZWRWYWx1ZTtcbiAqICB9IGVsc2Uge1xuICogICAgdGhpcy5fbGF0ZXN0UmV0dXJuZWRWYWx1ZSA9IHRoaXMuX2xhdGVzdFZhbHVlO1xuICogICAgcmV0dXJuIFdyYXBwZWRWYWx1ZS53cmFwKHRoaXMuX2xhdGVzdFZhbHVlKTsgLy8gdGhpcyB3aWxsIGZvcmNlIHVwZGF0ZVxuICogIH1cbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgV3JhcHBlZFZhbHVlIHtcbiAgY29uc3RydWN0b3IocHVibGljIHdyYXBwZWQ6IGFueSkge31cblxuICBzdGF0aWMgd3JhcCh2YWx1ZTogYW55KTogV3JhcHBlZFZhbHVlIHsgcmV0dXJuIG5ldyBXcmFwcGVkVmFsdWUodmFsdWUpOyB9XG59XG5cbi8qKlxuICogSGVscGVyIGNsYXNzIGZvciB1bndyYXBwaW5nIFdyYXBwZWRWYWx1ZSBzXG4gKi9cbmV4cG9ydCBjbGFzcyBWYWx1ZVVud3JhcHBlciB7XG4gIHB1YmxpYyBoYXNXcmFwcGVkVmFsdWUgPSBmYWxzZTtcblxuICB1bndyYXAodmFsdWU6IGFueSk6IGFueSB7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgV3JhcHBlZFZhbHVlKSB7XG4gICAgICB0aGlzLmhhc1dyYXBwZWRWYWx1ZSA9IHRydWU7XG4gICAgICByZXR1cm4gdmFsdWUud3JhcHBlZDtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcmVzZXQoKSB7IHRoaXMuaGFzV3JhcHBlZFZhbHVlID0gZmFsc2U7IH1cbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgYmFzaWMgY2hhbmdlIGZyb20gYSBwcmV2aW91cyB0byBhIG5ldyB2YWx1ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNpbXBsZUNoYW5nZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwcmV2aW91c1ZhbHVlOiBhbnksIHB1YmxpYyBjdXJyZW50VmFsdWU6IGFueSkge31cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGUgbmV3IHZhbHVlIGlzIHRoZSBmaXJzdCB2YWx1ZSBhc3NpZ25lZC5cbiAgICovXG4gIGlzRmlyc3RDaGFuZ2UoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnByZXZpb3VzVmFsdWUgPT09IHVuaW5pdGlhbGl6ZWQ7IH1cbn1cbiJdfQ==