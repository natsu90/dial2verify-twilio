var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { isBlank, isString, isArray, StringWrapper } from 'angular2/src/facade/lang';
import { ListWrapper } from 'angular2/src/facade/collection';
import { Injectable, Pipe } from 'angular2/core';
import { InvalidPipeArgumentException } from './invalid_pipe_argument_exception';
/**
 * Creates a new List or String containing only a subset (slice) of the
 * elements.
 *
 * The starting index of the subset to return is specified by the `start` parameter.
 *
 * The ending index of the subset to return is specified by the optional `end` parameter.
 *
 * ### Usage
 *
 *     expression | slice:start[:end]
 *
 * All behavior is based on the expected behavior of the JavaScript API
 * Array.prototype.slice() and String.prototype.slice()
 *
 * Where the input expression is a [List] or [String], and `start` is:
 *
 * - **a positive integer**: return the item at _start_ index and all items after
 * in the list or string expression.
 * - **a negative integer**: return the item at _start_ index from the end and all items after
 * in the list or string expression.
 * - **`|start|` greater than the size of the expression**: return an empty list or string.
 * - **`|start|` negative greater than the size of the expression**: return entire list or
 * string expression.
 *
 * and where `end` is:
 *
 * - **omitted**: return all items until the end of the input
 * - **a positive integer**: return all items before _end_ index of the list or string
 * expression.
 * - **a negative integer**: return all items before _end_ index from the end of the list
 * or string expression.
 *
 * When operating on a [List], the returned list is always a copy even when all
 * the elements are being returned.
 *
 * ## List Example
 *
 * This `ngFor` example:
 *
 * {@example core/pipes/ts/slice_pipe/slice_pipe_example.ts region='SlicePipe_list'}
 *
 * produces the following:
 *
 *     <li>b</li>
 *     <li>c</li>
 *
 * ## String Examples
 *
 * {@example core/pipes/ts/slice_pipe/slice_pipe_example.ts region='SlicePipe_string'}
 */
let SlicePipe_1;
export let SlicePipe = SlicePipe_1 = class SlicePipe {
    transform(value, start, end = null) {
        if (!this.supports(value)) {
            throw new InvalidPipeArgumentException(SlicePipe_1, value);
        }
        if (isBlank(value))
            return value;
        if (isString(value)) {
            return StringWrapper.slice(value, start, end);
        }
        return ListWrapper.slice(value, start, end);
    }
    supports(obj) { return isString(obj) || isArray(obj); }
};
SlicePipe = SlicePipe_1 = __decorate([
    Pipe({ name: 'slice', pure: false }),
    Injectable(), 
    __metadata('design:paramtypes', [])
], SlicePipe);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2VfcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUQxaUdRVkcudG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vcGlwZXMvc2xpY2VfcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7T0FBTyxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBUSxNQUFNLDBCQUEwQjtPQUNsRixFQUFDLFdBQVcsRUFBQyxNQUFNLGdDQUFnQztPQUNuRCxFQUFDLFVBQVUsRUFBK0IsSUFBSSxFQUFDLE1BQU0sZUFBZTtPQUNwRSxFQUFDLDRCQUE0QixFQUFDLE1BQU0sbUNBQW1DO0FBRTlFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtERztBQUlIOztJQUNFLFNBQVMsQ0FBQyxLQUFVLEVBQUUsS0FBYSxFQUFFLEdBQUcsR0FBVyxJQUFJO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsTUFBTSxJQUFJLDRCQUE0QixDQUFDLFdBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUNELE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVPLFFBQVEsQ0FBQyxHQUFRLElBQWEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9FLENBQUM7QUFmRDtJQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDO0lBQ2xDLFVBQVUsRUFBRTs7YUFBQTtBQWNaIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0JsYW5rLCBpc1N0cmluZywgaXNBcnJheSwgU3RyaW5nV3JhcHBlciwgQ09OU1R9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0xpc3RXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtJbmplY3RhYmxlLCBQaXBlVHJhbnNmb3JtLCBXcmFwcGVkVmFsdWUsIFBpcGV9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtJbnZhbGlkUGlwZUFyZ3VtZW50RXhjZXB0aW9ufSBmcm9tICcuL2ludmFsaWRfcGlwZV9hcmd1bWVudF9leGNlcHRpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgTGlzdCBvciBTdHJpbmcgY29udGFpbmluZyBvbmx5IGEgc3Vic2V0IChzbGljZSkgb2YgdGhlXG4gKiBlbGVtZW50cy5cbiAqXG4gKiBUaGUgc3RhcnRpbmcgaW5kZXggb2YgdGhlIHN1YnNldCB0byByZXR1cm4gaXMgc3BlY2lmaWVkIGJ5IHRoZSBgc3RhcnRgIHBhcmFtZXRlci5cbiAqXG4gKiBUaGUgZW5kaW5nIGluZGV4IG9mIHRoZSBzdWJzZXQgdG8gcmV0dXJuIGlzIHNwZWNpZmllZCBieSB0aGUgb3B0aW9uYWwgYGVuZGAgcGFyYW1ldGVyLlxuICpcbiAqICMjIyBVc2FnZVxuICpcbiAqICAgICBleHByZXNzaW9uIHwgc2xpY2U6c3RhcnRbOmVuZF1cbiAqXG4gKiBBbGwgYmVoYXZpb3IgaXMgYmFzZWQgb24gdGhlIGV4cGVjdGVkIGJlaGF2aW9yIG9mIHRoZSBKYXZhU2NyaXB0IEFQSVxuICogQXJyYXkucHJvdG90eXBlLnNsaWNlKCkgYW5kIFN0cmluZy5wcm90b3R5cGUuc2xpY2UoKVxuICpcbiAqIFdoZXJlIHRoZSBpbnB1dCBleHByZXNzaW9uIGlzIGEgW0xpc3RdIG9yIFtTdHJpbmddLCBhbmQgYHN0YXJ0YCBpczpcbiAqXG4gKiAtICoqYSBwb3NpdGl2ZSBpbnRlZ2VyKio6IHJldHVybiB0aGUgaXRlbSBhdCBfc3RhcnRfIGluZGV4IGFuZCBhbGwgaXRlbXMgYWZ0ZXJcbiAqIGluIHRoZSBsaXN0IG9yIHN0cmluZyBleHByZXNzaW9uLlxuICogLSAqKmEgbmVnYXRpdmUgaW50ZWdlcioqOiByZXR1cm4gdGhlIGl0ZW0gYXQgX3N0YXJ0XyBpbmRleCBmcm9tIHRoZSBlbmQgYW5kIGFsbCBpdGVtcyBhZnRlclxuICogaW4gdGhlIGxpc3Qgb3Igc3RyaW5nIGV4cHJlc3Npb24uXG4gKiAtICoqYHxzdGFydHxgIGdyZWF0ZXIgdGhhbiB0aGUgc2l6ZSBvZiB0aGUgZXhwcmVzc2lvbioqOiByZXR1cm4gYW4gZW1wdHkgbGlzdCBvciBzdHJpbmcuXG4gKiAtICoqYHxzdGFydHxgIG5lZ2F0aXZlIGdyZWF0ZXIgdGhhbiB0aGUgc2l6ZSBvZiB0aGUgZXhwcmVzc2lvbioqOiByZXR1cm4gZW50aXJlIGxpc3Qgb3JcbiAqIHN0cmluZyBleHByZXNzaW9uLlxuICpcbiAqIGFuZCB3aGVyZSBgZW5kYCBpczpcbiAqXG4gKiAtICoqb21pdHRlZCoqOiByZXR1cm4gYWxsIGl0ZW1zIHVudGlsIHRoZSBlbmQgb2YgdGhlIGlucHV0XG4gKiAtICoqYSBwb3NpdGl2ZSBpbnRlZ2VyKio6IHJldHVybiBhbGwgaXRlbXMgYmVmb3JlIF9lbmRfIGluZGV4IG9mIHRoZSBsaXN0IG9yIHN0cmluZ1xuICogZXhwcmVzc2lvbi5cbiAqIC0gKiphIG5lZ2F0aXZlIGludGVnZXIqKjogcmV0dXJuIGFsbCBpdGVtcyBiZWZvcmUgX2VuZF8gaW5kZXggZnJvbSB0aGUgZW5kIG9mIHRoZSBsaXN0XG4gKiBvciBzdHJpbmcgZXhwcmVzc2lvbi5cbiAqXG4gKiBXaGVuIG9wZXJhdGluZyBvbiBhIFtMaXN0XSwgdGhlIHJldHVybmVkIGxpc3QgaXMgYWx3YXlzIGEgY29weSBldmVuIHdoZW4gYWxsXG4gKiB0aGUgZWxlbWVudHMgYXJlIGJlaW5nIHJldHVybmVkLlxuICpcbiAqICMjIExpc3QgRXhhbXBsZVxuICpcbiAqIFRoaXMgYG5nRm9yYCBleGFtcGxlOlxuICpcbiAqIHtAZXhhbXBsZSBjb3JlL3BpcGVzL3RzL3NsaWNlX3BpcGUvc2xpY2VfcGlwZV9leGFtcGxlLnRzIHJlZ2lvbj0nU2xpY2VQaXBlX2xpc3QnfVxuICpcbiAqIHByb2R1Y2VzIHRoZSBmb2xsb3dpbmc6XG4gKlxuICogICAgIDxsaT5iPC9saT5cbiAqICAgICA8bGk+YzwvbGk+XG4gKlxuICogIyMgU3RyaW5nIEV4YW1wbGVzXG4gKlxuICoge0BleGFtcGxlIGNvcmUvcGlwZXMvdHMvc2xpY2VfcGlwZS9zbGljZV9waXBlX2V4YW1wbGUudHMgcmVnaW9uPSdTbGljZVBpcGVfc3RyaW5nJ31cbiAqL1xuXG5AUGlwZSh7bmFtZTogJ3NsaWNlJywgcHVyZTogZmFsc2V9KVxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNsaWNlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0odmFsdWU6IGFueSwgc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIgPSBudWxsKTogYW55IHtcbiAgICBpZiAoIXRoaXMuc3VwcG9ydHModmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZFBpcGVBcmd1bWVudEV4Y2VwdGlvbihTbGljZVBpcGUsIHZhbHVlKTtcbiAgICB9XG4gICAgaWYgKGlzQmxhbmsodmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gICAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIFN0cmluZ1dyYXBwZXIuc2xpY2UodmFsdWUsIHN0YXJ0LCBlbmQpO1xuICAgIH1cbiAgICByZXR1cm4gTGlzdFdyYXBwZXIuc2xpY2UodmFsdWUsIHN0YXJ0LCBlbmQpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdXBwb3J0cyhvYmo6IGFueSk6IGJvb2xlYW4geyByZXR1cm4gaXNTdHJpbmcob2JqKSB8fCBpc0FycmF5KG9iaik7IH1cbn1cbiJdfQ==