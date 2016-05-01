'use strict';"use strict";
var exceptions_1 = require('angular2/src/facade/exceptions');
var test_injector_1 = require('./test_injector');
var _FakeAsyncTestZoneSpecType = Zone['FakeAsyncTestZoneSpec'];
/**
 * Wraps a function to be executed in the fakeAsync zone:
 * - microtasks are manually executed by calling `flushMicrotasks()`,
 * - timers are synchronous, `tick()` simulates the asynchronous passage of time.
 *
 * If there are any pending timers at the end of the function, an exception will be thrown.
 *
 * Can be used to wrap inject() calls.
 *
 * ## Example
 *
 * {@example testing/ts/fake_async.ts region='basic'}
 *
 * @param fn
 * @returns {Function} The function wrapped to be executed in the fakeAsync zone
 */
function fakeAsync(fn) {
    if (Zone.current.get('FakeAsyncTestZoneSpec') != null) {
        throw new exceptions_1.BaseException('fakeAsync() calls can not be nested');
    }
    var fakeAsyncTestZoneSpec = new _FakeAsyncTestZoneSpecType();
    var fakeAsyncZone = Zone.current.fork(fakeAsyncTestZoneSpec);
    var innerTestFn = null;
    if (fn instanceof test_injector_1.FunctionWithParamTokens) {
        if (fn.isAsync) {
            throw new exceptions_1.BaseException('Cannot wrap async test with fakeAsync');
        }
        innerTestFn = function () { test_injector_1.getTestInjector().execute(fn); };
    }
    else {
        innerTestFn = fn;
    }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var res = fakeAsyncZone.run(function () {
            var res = innerTestFn.apply(void 0, args);
            flushMicrotasks();
            return res;
        });
        if (fakeAsyncTestZoneSpec.pendingPeriodicTimers.length > 0) {
            throw new exceptions_1.BaseException((fakeAsyncTestZoneSpec.pendingPeriodicTimers.length + " ") +
                "periodic timer(s) still in the queue.");
        }
        if (fakeAsyncTestZoneSpec.pendingTimers.length > 0) {
            throw new exceptions_1.BaseException(fakeAsyncTestZoneSpec.pendingTimers.length + " timer(s) still in the queue.");
        }
        return res;
    };
}
exports.fakeAsync = fakeAsync;
function _getFakeAsyncZoneSpec() {
    var zoneSpec = Zone.current.get('FakeAsyncTestZoneSpec');
    if (zoneSpec == null) {
        throw new Error('The code should be running in the fakeAsync zone to call this function');
    }
    return zoneSpec;
}
/**
 * Clear the queue of pending timers and microtasks.
 * Tests no longer need to call this explicitly.
 *
 * @deprecated
 */
function clearPendingTimers() {
    // Do nothing.
}
exports.clearPendingTimers = clearPendingTimers;
/**
 * Simulates the asynchronous passage of time for the timers in the fakeAsync zone.
 *
 * The microtasks queue is drained at the very start of this function and after any timer callback
 * has been executed.
 *
 * ## Example
 *
 * {@example testing/ts/fake_async.ts region='basic'}
 *
 * @param {number} millis Number of millisecond, defaults to 0
 */
function tick(millis) {
    if (millis === void 0) { millis = 0; }
    _getFakeAsyncZoneSpec().tick(millis);
}
exports.tick = tick;
/**
 * Flush any pending microtasks.
 */
function flushMicrotasks() {
    _getFakeAsyncZoneSpec().flushMicrotasks();
}
exports.flushMicrotasks = flushMicrotasks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZV9hc3luYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtV1MzalB0bnYudG1wL2FuZ3VsYXIyL3NyYy90ZXN0aW5nL2Zha2VfYXN5bmMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDJCQUE0QixnQ0FBZ0MsQ0FBQyxDQUFBO0FBQzdELDhCQUF1RCxpQkFBaUIsQ0FBQyxDQUFBO0FBRXpFLElBQUksMEJBQTBCLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFFL0Q7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsbUJBQTBCLEVBQXNDO0lBQzlELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN0RCxNQUFNLElBQUksMEJBQWEsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxJQUFJLHFCQUFxQixHQUFHLElBQUksMEJBQTBCLEVBQUUsQ0FBQztJQUM3RCxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRTdELElBQUksV0FBVyxHQUFhLElBQUksQ0FBQztJQUVqQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFlBQVksdUNBQXVCLENBQUMsQ0FBQyxDQUFDO1FBQzFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxJQUFJLDBCQUFhLENBQUMsdUNBQXVDLENBQUMsQ0FBQztRQUNuRSxDQUFDO1FBQ0QsV0FBVyxHQUFHLGNBQVEsK0JBQWUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUE2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sV0FBVyxHQUFHLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQsTUFBTSxDQUFDO1FBQVMsY0FBTzthQUFQLFdBQU8sQ0FBUCxzQkFBTyxDQUFQLElBQU87WUFBUCw2QkFBTzs7UUFDckIsSUFBSSxHQUFHLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQztZQUMxQixJQUFJLEdBQUcsR0FBRyxXQUFXLGVBQUksSUFBSSxDQUFDLENBQUM7WUFDL0IsZUFBZSxFQUFFLENBQUM7WUFDbEIsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLENBQUMscUJBQXFCLENBQUMscUJBQXFCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0QsTUFBTSxJQUFJLDBCQUFhLENBQUMsQ0FBRyxxQkFBcUIsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLE9BQUc7Z0JBQ3hELHVDQUF1QyxDQUFDLENBQUM7UUFDbkUsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRCxNQUFNLElBQUksMEJBQWEsQ0FDaEIscUJBQXFCLENBQUMsYUFBYSxDQUFDLE1BQU0sa0NBQStCLENBQUMsQ0FBQztRQUNwRixDQUFDO1FBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUMsQ0FBQztBQUNKLENBQUM7QUFyQ2UsaUJBQVMsWUFxQ3hCLENBQUE7QUFFRDtJQUNFLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDekQsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3RUFBd0UsQ0FBQyxDQUFDO0lBQzVGLENBQUM7SUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNIO0lBQ0UsY0FBYztBQUNoQixDQUFDO0FBRmUsMEJBQWtCLHFCQUVqQyxDQUFBO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxjQUFxQixNQUFrQjtJQUFsQixzQkFBa0IsR0FBbEIsVUFBa0I7SUFDckMscUJBQXFCLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUZlLFlBQUksT0FFbkIsQ0FBQTtBQUVEOztHQUVHO0FBQ0g7SUFDRSxxQkFBcUIsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQzVDLENBQUM7QUFGZSx1QkFBZSxrQkFFOUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7Z2V0VGVzdEluamVjdG9yLCBGdW5jdGlvbldpdGhQYXJhbVRva2Vuc30gZnJvbSAnLi90ZXN0X2luamVjdG9yJztcblxubGV0IF9GYWtlQXN5bmNUZXN0Wm9uZVNwZWNUeXBlID0gWm9uZVsnRmFrZUFzeW5jVGVzdFpvbmVTcGVjJ107XG5cbi8qKlxuICogV3JhcHMgYSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBpbiB0aGUgZmFrZUFzeW5jIHpvbmU6XG4gKiAtIG1pY3JvdGFza3MgYXJlIG1hbnVhbGx5IGV4ZWN1dGVkIGJ5IGNhbGxpbmcgYGZsdXNoTWljcm90YXNrcygpYCxcbiAqIC0gdGltZXJzIGFyZSBzeW5jaHJvbm91cywgYHRpY2soKWAgc2ltdWxhdGVzIHRoZSBhc3luY2hyb25vdXMgcGFzc2FnZSBvZiB0aW1lLlxuICpcbiAqIElmIHRoZXJlIGFyZSBhbnkgcGVuZGluZyB0aW1lcnMgYXQgdGhlIGVuZCBvZiB0aGUgZnVuY3Rpb24sIGFuIGV4Y2VwdGlvbiB3aWxsIGJlIHRocm93bi5cbiAqXG4gKiBDYW4gYmUgdXNlZCB0byB3cmFwIGluamVjdCgpIGNhbGxzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqXG4gKiB7QGV4YW1wbGUgdGVzdGluZy90cy9mYWtlX2FzeW5jLnRzIHJlZ2lvbj0nYmFzaWMnfVxuICpcbiAqIEBwYXJhbSBmblxuICogQHJldHVybnMge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gd3JhcHBlZCB0byBiZSBleGVjdXRlZCBpbiB0aGUgZmFrZUFzeW5jIHpvbmVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZha2VBc3luYyhmbjogRnVuY3Rpb24gfCBGdW5jdGlvbldpdGhQYXJhbVRva2Vucyk6IEZ1bmN0aW9uIHtcbiAgaWYgKFpvbmUuY3VycmVudC5nZXQoJ0Zha2VBc3luY1Rlc3Rab25lU3BlYycpICE9IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbignZmFrZUFzeW5jKCkgY2FsbHMgY2FuIG5vdCBiZSBuZXN0ZWQnKTtcbiAgfVxuXG4gIGxldCBmYWtlQXN5bmNUZXN0Wm9uZVNwZWMgPSBuZXcgX0Zha2VBc3luY1Rlc3Rab25lU3BlY1R5cGUoKTtcbiAgbGV0IGZha2VBc3luY1pvbmUgPSBab25lLmN1cnJlbnQuZm9yayhmYWtlQXN5bmNUZXN0Wm9uZVNwZWMpO1xuXG4gIGxldCBpbm5lclRlc3RGbjogRnVuY3Rpb24gPSBudWxsO1xuXG4gIGlmIChmbiBpbnN0YW5jZW9mIEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zKSB7XG4gICAgaWYgKGZuLmlzQXN5bmMpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCdDYW5ub3Qgd3JhcCBhc3luYyB0ZXN0IHdpdGggZmFrZUFzeW5jJyk7XG4gICAgfVxuICAgIGlubmVyVGVzdEZuID0gKCkgPT4geyBnZXRUZXN0SW5qZWN0b3IoKS5leGVjdXRlKGZuIGFzIEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zKTsgfTtcbiAgfSBlbHNlIHtcbiAgICBpbm5lclRlc3RGbiA9IGZuO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICBsZXQgcmVzID0gZmFrZUFzeW5jWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgbGV0IHJlcyA9IGlubmVyVGVzdEZuKC4uLmFyZ3MpO1xuICAgICAgZmx1c2hNaWNyb3Rhc2tzKCk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0pO1xuXG4gICAgaWYgKGZha2VBc3luY1Rlc3Rab25lU3BlYy5wZW5kaW5nUGVyaW9kaWNUaW1lcnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYCR7ZmFrZUFzeW5jVGVzdFpvbmVTcGVjLnBlbmRpbmdQZXJpb2RpY1RpbWVycy5sZW5ndGh9IGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHBlcmlvZGljIHRpbWVyKHMpIHN0aWxsIGluIHRoZSBxdWV1ZS5gKTtcbiAgICB9XG5cbiAgICBpZiAoZmFrZUFzeW5jVGVzdFpvbmVTcGVjLnBlbmRpbmdUaW1lcnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXG4gICAgICAgICAgYCR7ZmFrZUFzeW5jVGVzdFpvbmVTcGVjLnBlbmRpbmdUaW1lcnMubGVuZ3RofSB0aW1lcihzKSBzdGlsbCBpbiB0aGUgcXVldWUuYCk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH07XG59XG5cbmZ1bmN0aW9uIF9nZXRGYWtlQXN5bmNab25lU3BlYygpOiBhbnkge1xuICBsZXQgem9uZVNwZWMgPSBab25lLmN1cnJlbnQuZ2V0KCdGYWtlQXN5bmNUZXN0Wm9uZVNwZWMnKTtcbiAgaWYgKHpvbmVTcGVjID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjb2RlIHNob3VsZCBiZSBydW5uaW5nIGluIHRoZSBmYWtlQXN5bmMgem9uZSB0byBjYWxsIHRoaXMgZnVuY3Rpb24nKTtcbiAgfVxuICByZXR1cm4gem9uZVNwZWM7XG59XG5cbi8qKlxuICogQ2xlYXIgdGhlIHF1ZXVlIG9mIHBlbmRpbmcgdGltZXJzIGFuZCBtaWNyb3Rhc2tzLlxuICogVGVzdHMgbm8gbG9uZ2VyIG5lZWQgdG8gY2FsbCB0aGlzIGV4cGxpY2l0bHkuXG4gKlxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyUGVuZGluZ1RpbWVycygpOiB2b2lkIHtcbiAgLy8gRG8gbm90aGluZy5cbn1cblxuLyoqXG4gKiBTaW11bGF0ZXMgdGhlIGFzeW5jaHJvbm91cyBwYXNzYWdlIG9mIHRpbWUgZm9yIHRoZSB0aW1lcnMgaW4gdGhlIGZha2VBc3luYyB6b25lLlxuICpcbiAqIFRoZSBtaWNyb3Rhc2tzIHF1ZXVlIGlzIGRyYWluZWQgYXQgdGhlIHZlcnkgc3RhcnQgb2YgdGhpcyBmdW5jdGlvbiBhbmQgYWZ0ZXIgYW55IHRpbWVyIGNhbGxiYWNrXG4gKiBoYXMgYmVlbiBleGVjdXRlZC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKlxuICoge0BleGFtcGxlIHRlc3RpbmcvdHMvZmFrZV9hc3luYy50cyByZWdpb249J2Jhc2ljJ31cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbWlsbGlzIE51bWJlciBvZiBtaWxsaXNlY29uZCwgZGVmYXVsdHMgdG8gMFxuICovXG5leHBvcnQgZnVuY3Rpb24gdGljayhtaWxsaXM6IG51bWJlciA9IDApOiB2b2lkIHtcbiAgX2dldEZha2VBc3luY1pvbmVTcGVjKCkudGljayhtaWxsaXMpO1xufVxuXG4vKipcbiAqIEZsdXNoIGFueSBwZW5kaW5nIG1pY3JvdGFza3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbHVzaE1pY3JvdGFza3MoKTogdm9pZCB7XG4gIF9nZXRGYWtlQXN5bmNab25lU3BlYygpLmZsdXNoTWljcm90YXNrcygpO1xufVxuIl19