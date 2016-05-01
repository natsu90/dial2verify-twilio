import { BaseException } from 'angular2/src/facade/exceptions';
import { getTestInjector, FunctionWithParamTokens } from './test_injector';
let _FakeAsyncTestZoneSpecType = Zone['FakeAsyncTestZoneSpec'];
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
export function fakeAsync(fn) {
    if (Zone.current.get('FakeAsyncTestZoneSpec') != null) {
        throw new BaseException('fakeAsync() calls can not be nested');
    }
    let fakeAsyncTestZoneSpec = new _FakeAsyncTestZoneSpecType();
    let fakeAsyncZone = Zone.current.fork(fakeAsyncTestZoneSpec);
    let innerTestFn = null;
    if (fn instanceof FunctionWithParamTokens) {
        if (fn.isAsync) {
            throw new BaseException('Cannot wrap async test with fakeAsync');
        }
        innerTestFn = () => { getTestInjector().execute(fn); };
    }
    else {
        innerTestFn = fn;
    }
    return function (...args) {
        let res = fakeAsyncZone.run(() => {
            let res = innerTestFn(...args);
            flushMicrotasks();
            return res;
        });
        if (fakeAsyncTestZoneSpec.pendingPeriodicTimers.length > 0) {
            throw new BaseException(`${fakeAsyncTestZoneSpec.pendingPeriodicTimers.length} ` +
                `periodic timer(s) still in the queue.`);
        }
        if (fakeAsyncTestZoneSpec.pendingTimers.length > 0) {
            throw new BaseException(`${fakeAsyncTestZoneSpec.pendingTimers.length} timer(s) still in the queue.`);
        }
        return res;
    };
}
function _getFakeAsyncZoneSpec() {
    let zoneSpec = Zone.current.get('FakeAsyncTestZoneSpec');
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
export function clearPendingTimers() {
    // Do nothing.
}
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
export function tick(millis = 0) {
    _getFakeAsyncZoneSpec().tick(millis);
}
/**
 * Flush any pending microtasks.
 */
export function flushMicrotasks() {
    _getFakeAsyncZoneSpec().flushMicrotasks();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZV9hc3luYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUQxaUdRVkcudG1wL2FuZ3VsYXIyL3NyYy90ZXN0aW5nL2Zha2VfYXN5bmMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxnQ0FBZ0M7T0FDckQsRUFBQyxlQUFlLEVBQUUsdUJBQXVCLEVBQUMsTUFBTSxpQkFBaUI7QUFFeEUsSUFBSSwwQkFBMEIsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUUvRDs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCwwQkFBMEIsRUFBc0M7SUFDOUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sSUFBSSxhQUFhLENBQUMscUNBQXFDLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQsSUFBSSxxQkFBcUIsR0FBRyxJQUFJLDBCQUEwQixFQUFFLENBQUM7SUFDN0QsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUU3RCxJQUFJLFdBQVcsR0FBYSxJQUFJLENBQUM7SUFFakMsRUFBRSxDQUFDLENBQUMsRUFBRSxZQUFZLHVCQUF1QixDQUFDLENBQUMsQ0FBQztRQUMxQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNmLE1BQU0sSUFBSSxhQUFhLENBQUMsdUNBQXVDLENBQUMsQ0FBQztRQUNuRSxDQUFDO1FBQ0QsV0FBVyxHQUFHLFFBQVEsZUFBZSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQTZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixXQUFXLEdBQUcsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFRCxNQUFNLENBQUMsVUFBUyxHQUFHLElBQUk7UUFDckIsSUFBSSxHQUFHLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQztZQUMxQixJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUMvQixlQUFlLEVBQUUsQ0FBQztZQUNsQixNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRCxNQUFNLElBQUksYUFBYSxDQUFDLEdBQUcscUJBQXFCLENBQUMscUJBQXFCLENBQUMsTUFBTSxHQUFHO2dCQUN4RCx1Q0FBdUMsQ0FBQyxDQUFDO1FBQ25FLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkQsTUFBTSxJQUFJLGFBQWEsQ0FDbkIsR0FBRyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsTUFBTSwrQkFBK0IsQ0FBQyxDQUFDO1FBQ3BGLENBQUM7UUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2IsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVEO0lBQ0UsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUN6RCxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLHdFQUF3RSxDQUFDLENBQUM7SUFDNUYsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0g7SUFDRSxjQUFjO0FBQ2hCLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7R0FXRztBQUNILHFCQUFxQixNQUFNLEdBQVcsQ0FBQztJQUNyQyxxQkFBcUIsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBRUQ7O0dBRUc7QUFDSDtJQUNFLHFCQUFxQixFQUFFLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDNUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7Z2V0VGVzdEluamVjdG9yLCBGdW5jdGlvbldpdGhQYXJhbVRva2Vuc30gZnJvbSAnLi90ZXN0X2luamVjdG9yJztcblxubGV0IF9GYWtlQXN5bmNUZXN0Wm9uZVNwZWNUeXBlID0gWm9uZVsnRmFrZUFzeW5jVGVzdFpvbmVTcGVjJ107XG5cbi8qKlxuICogV3JhcHMgYSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBpbiB0aGUgZmFrZUFzeW5jIHpvbmU6XG4gKiAtIG1pY3JvdGFza3MgYXJlIG1hbnVhbGx5IGV4ZWN1dGVkIGJ5IGNhbGxpbmcgYGZsdXNoTWljcm90YXNrcygpYCxcbiAqIC0gdGltZXJzIGFyZSBzeW5jaHJvbm91cywgYHRpY2soKWAgc2ltdWxhdGVzIHRoZSBhc3luY2hyb25vdXMgcGFzc2FnZSBvZiB0aW1lLlxuICpcbiAqIElmIHRoZXJlIGFyZSBhbnkgcGVuZGluZyB0aW1lcnMgYXQgdGhlIGVuZCBvZiB0aGUgZnVuY3Rpb24sIGFuIGV4Y2VwdGlvbiB3aWxsIGJlIHRocm93bi5cbiAqXG4gKiBDYW4gYmUgdXNlZCB0byB3cmFwIGluamVjdCgpIGNhbGxzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqXG4gKiB7QGV4YW1wbGUgdGVzdGluZy90cy9mYWtlX2FzeW5jLnRzIHJlZ2lvbj0nYmFzaWMnfVxuICpcbiAqIEBwYXJhbSBmblxuICogQHJldHVybnMge0Z1bmN0aW9ufSBUaGUgZnVuY3Rpb24gd3JhcHBlZCB0byBiZSBleGVjdXRlZCBpbiB0aGUgZmFrZUFzeW5jIHpvbmVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZha2VBc3luYyhmbjogRnVuY3Rpb24gfCBGdW5jdGlvbldpdGhQYXJhbVRva2Vucyk6IEZ1bmN0aW9uIHtcbiAgaWYgKFpvbmUuY3VycmVudC5nZXQoJ0Zha2VBc3luY1Rlc3Rab25lU3BlYycpICE9IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbignZmFrZUFzeW5jKCkgY2FsbHMgY2FuIG5vdCBiZSBuZXN0ZWQnKTtcbiAgfVxuXG4gIGxldCBmYWtlQXN5bmNUZXN0Wm9uZVNwZWMgPSBuZXcgX0Zha2VBc3luY1Rlc3Rab25lU3BlY1R5cGUoKTtcbiAgbGV0IGZha2VBc3luY1pvbmUgPSBab25lLmN1cnJlbnQuZm9yayhmYWtlQXN5bmNUZXN0Wm9uZVNwZWMpO1xuXG4gIGxldCBpbm5lclRlc3RGbjogRnVuY3Rpb24gPSBudWxsO1xuXG4gIGlmIChmbiBpbnN0YW5jZW9mIEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zKSB7XG4gICAgaWYgKGZuLmlzQXN5bmMpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCdDYW5ub3Qgd3JhcCBhc3luYyB0ZXN0IHdpdGggZmFrZUFzeW5jJyk7XG4gICAgfVxuICAgIGlubmVyVGVzdEZuID0gKCkgPT4geyBnZXRUZXN0SW5qZWN0b3IoKS5leGVjdXRlKGZuIGFzIEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zKTsgfTtcbiAgfSBlbHNlIHtcbiAgICBpbm5lclRlc3RGbiA9IGZuO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICBsZXQgcmVzID0gZmFrZUFzeW5jWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgbGV0IHJlcyA9IGlubmVyVGVzdEZuKC4uLmFyZ3MpO1xuICAgICAgZmx1c2hNaWNyb3Rhc2tzKCk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0pO1xuXG4gICAgaWYgKGZha2VBc3luY1Rlc3Rab25lU3BlYy5wZW5kaW5nUGVyaW9kaWNUaW1lcnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYCR7ZmFrZUFzeW5jVGVzdFpvbmVTcGVjLnBlbmRpbmdQZXJpb2RpY1RpbWVycy5sZW5ndGh9IGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHBlcmlvZGljIHRpbWVyKHMpIHN0aWxsIGluIHRoZSBxdWV1ZS5gKTtcbiAgICB9XG5cbiAgICBpZiAoZmFrZUFzeW5jVGVzdFpvbmVTcGVjLnBlbmRpbmdUaW1lcnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXG4gICAgICAgICAgYCR7ZmFrZUFzeW5jVGVzdFpvbmVTcGVjLnBlbmRpbmdUaW1lcnMubGVuZ3RofSB0aW1lcihzKSBzdGlsbCBpbiB0aGUgcXVldWUuYCk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH07XG59XG5cbmZ1bmN0aW9uIF9nZXRGYWtlQXN5bmNab25lU3BlYygpOiBhbnkge1xuICBsZXQgem9uZVNwZWMgPSBab25lLmN1cnJlbnQuZ2V0KCdGYWtlQXN5bmNUZXN0Wm9uZVNwZWMnKTtcbiAgaWYgKHpvbmVTcGVjID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjb2RlIHNob3VsZCBiZSBydW5uaW5nIGluIHRoZSBmYWtlQXN5bmMgem9uZSB0byBjYWxsIHRoaXMgZnVuY3Rpb24nKTtcbiAgfVxuICByZXR1cm4gem9uZVNwZWM7XG59XG5cbi8qKlxuICogQ2xlYXIgdGhlIHF1ZXVlIG9mIHBlbmRpbmcgdGltZXJzIGFuZCBtaWNyb3Rhc2tzLlxuICogVGVzdHMgbm8gbG9uZ2VyIG5lZWQgdG8gY2FsbCB0aGlzIGV4cGxpY2l0bHkuXG4gKlxuICogQGRlcHJlY2F0ZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyUGVuZGluZ1RpbWVycygpOiB2b2lkIHtcbiAgLy8gRG8gbm90aGluZy5cbn1cblxuLyoqXG4gKiBTaW11bGF0ZXMgdGhlIGFzeW5jaHJvbm91cyBwYXNzYWdlIG9mIHRpbWUgZm9yIHRoZSB0aW1lcnMgaW4gdGhlIGZha2VBc3luYyB6b25lLlxuICpcbiAqIFRoZSBtaWNyb3Rhc2tzIHF1ZXVlIGlzIGRyYWluZWQgYXQgdGhlIHZlcnkgc3RhcnQgb2YgdGhpcyBmdW5jdGlvbiBhbmQgYWZ0ZXIgYW55IHRpbWVyIGNhbGxiYWNrXG4gKiBoYXMgYmVlbiBleGVjdXRlZC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKlxuICoge0BleGFtcGxlIHRlc3RpbmcvdHMvZmFrZV9hc3luYy50cyByZWdpb249J2Jhc2ljJ31cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbWlsbGlzIE51bWJlciBvZiBtaWxsaXNlY29uZCwgZGVmYXVsdHMgdG8gMFxuICovXG5leHBvcnQgZnVuY3Rpb24gdGljayhtaWxsaXM6IG51bWJlciA9IDApOiB2b2lkIHtcbiAgX2dldEZha2VBc3luY1pvbmVTcGVjKCkudGljayhtaWxsaXMpO1xufVxuXG4vKipcbiAqIEZsdXNoIGFueSBwZW5kaW5nIG1pY3JvdGFza3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbHVzaE1pY3JvdGFza3MoKTogdm9pZCB7XG4gIF9nZXRGYWtlQXN5bmNab25lU3BlYygpLmZsdXNoTWljcm90YXNrcygpO1xufVxuIl19