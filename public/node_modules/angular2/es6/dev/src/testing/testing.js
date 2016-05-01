import { global } from 'angular2/src/facade/lang';
import { FunctionWithParamTokens, getTestInjector } from './test_injector';
export { inject, async, injectAsync } from './test_injector';
export { expect } from './matchers';
var _global = (typeof window === 'undefined' ? global : window);
/**
 * Run a function (with an optional asynchronous callback) after each test case.
 *
 * See http://jasmine.github.io/ for more details.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='afterEach'}
 */
export var afterEach = _global.afterEach;
/**
 * Group test cases together under a common description prefix.
 *
 * See http://jasmine.github.io/ for more details.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='describeIt'}
 */
export var describe = _global.describe;
/**
 * See {@link fdescribe}.
 */
export var ddescribe = _global.fdescribe;
/**
 * Like {@link describe}, but instructs the test runner to only run
 * the test cases in this group. This is useful for debugging.
 *
 * See http://jasmine.github.io/ for more details.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='fdescribe'}
 */
export var fdescribe = _global.fdescribe;
/**
 * Like {@link describe}, but instructs the test runner to exclude
 * this group of test cases from execution. This is useful for
 * debugging, or for excluding broken tests until they can be fixed.
 *
 * See http://jasmine.github.io/ for more details.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='xdescribe'}
 */
export var xdescribe = _global.xdescribe;
var jsmBeforeEach = _global.beforeEach;
var jsmIt = _global.it;
var jsmIIt = _global.fit;
var jsmXIt = _global.xit;
var testInjector = getTestInjector();
// Reset the test providers before each test.
jsmBeforeEach(() => { testInjector.reset(); });
/**
 * Allows overriding default providers of the test injector,
 * which are defined in test_injector.js.
 *
 * The given function must return a list of DI providers.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='beforeEachProviders'}
 */
export function beforeEachProviders(fn) {
    jsmBeforeEach(() => {
        var providers = fn();
        if (!providers)
            return;
        try {
            testInjector.addProviders(providers);
        }
        catch (e) {
            throw new Error('beforeEachProviders was called after the injector had ' +
                'been used in a beforeEach or it block. This invalidates the ' +
                'test injector');
        }
    });
}
function runInAsyncTestZone(fnToExecute, finishCallback, failCallback, testName = '') {
    var AsyncTestZoneSpec = Zone['AsyncTestZoneSpec'];
    var testZoneSpec = new AsyncTestZoneSpec(finishCallback, failCallback, testName);
    var testZone = Zone.current.fork(testZoneSpec);
    return testZone.run(fnToExecute);
}
function _isPromiseLike(input) {
    return input && !!(input.then);
}
function _it(jsmFn, name, testFn, testTimeOut) {
    var timeOut = testTimeOut;
    if (testFn instanceof FunctionWithParamTokens) {
        let testFnT = testFn;
        jsmFn(name, (done) => {
            if (testFnT.isAsync) {
                runInAsyncTestZone(() => testInjector.execute(testFnT), done, done.fail, name);
            }
            else {
                testInjector.execute(testFnT);
                done();
            }
        }, timeOut);
    }
    else {
        // The test case doesn't use inject(). ie `it('test', (done) => { ... }));`
        jsmFn(name, testFn, timeOut);
    }
}
/**
 * Wrapper around Jasmine beforeEach function.
 *
 * beforeEach may be used with the `inject` function to fetch dependencies.
 *
 * See http://jasmine.github.io/ for more details.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='beforeEach'}
 */
export function beforeEach(fn) {
    if (fn instanceof FunctionWithParamTokens) {
        // The test case uses inject(). ie `beforeEach(inject([ClassA], (a) => { ...
        // }));`
        let fnT = fn;
        jsmBeforeEach((done) => {
            if (fnT.isAsync) {
                runInAsyncTestZone(() => testInjector.execute(fnT), done, done.fail, 'beforeEach');
            }
            else {
                testInjector.execute(fnT);
                done();
            }
        });
    }
    else {
        // The test case doesn't use inject(). ie `beforeEach((done) => { ... }));`
        if (fn.length === 0) {
            jsmBeforeEach(() => { fn(); });
        }
        else {
            jsmBeforeEach((done) => { fn(done); });
        }
    }
}
/**
 * Define a single test case with the given test name and execution function.
 *
 * The test function can be either a synchronous function, the result of {@link async},
 * or an injected function created via {@link inject}.
 *
 * Wrapper around Jasmine it function. See http://jasmine.github.io/ for more details.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='describeIt'}
 */
export function it(name, fn, timeOut = null) {
    return _it(jsmIt, name, fn, timeOut);
}
/**
 * Like {@link it}, but instructs the test runner to exclude this test
 * entirely. Useful for debugging or for excluding broken tests until
 * they can be fixed.
 *
 * Wrapper around Jasmine xit function. See http://jasmine.github.io/ for more details.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='xit'}
 */
export function xit(name, fn, timeOut = null) {
    return _it(jsmXIt, name, fn, timeOut);
}
/**
 * See {@link fit}.
 */
export function iit(name, fn, timeOut = null) {
    return _it(jsmIIt, name, fn, timeOut);
}
/**
 * Like {@link it}, but instructs the test runner to only run this test.
 * Useful for debugging.
 *
 * Wrapper around Jasmine fit function. See http://jasmine.github.io/ for more details.
 *
 * ## Example:
 *
 * {@example testing/ts/testing.ts region='fit'}
 */
export function fit(name, fn, timeOut = null) {
    return _it(jsmIIt, name, fn, timeOut);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUQxaUdRVkcudG1wL2FuZ3VsYXIyL3NyYy90ZXN0aW5nL3Rlc3RpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BSU8sRUFBQyxNQUFNLEVBQUMsTUFBTSwwQkFBMEI7T0FJeEMsRUFDTCx1QkFBdUIsRUFLdkIsZUFBZSxFQUNoQixNQUFNLGlCQUFpQjtBQUV4QixTQUFRLE1BQU0sRUFBRSxLQUFLLEVBQUUsV0FBVyxRQUFPLGlCQUFpQixDQUFDO0FBRTNELFNBQVEsTUFBTSxRQUFtQixZQUFZLENBQUM7QUFFOUMsSUFBSSxPQUFPLEdBQVEsQ0FBQyxPQUFPLE1BQU0sS0FBSyxXQUFXLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0FBRXJFOzs7Ozs7OztHQVFHO0FBQ0gsT0FBTyxJQUFJLFNBQVMsR0FBYSxPQUFPLENBQUMsU0FBUyxDQUFDO0FBRW5EOzs7Ozs7OztHQVFHO0FBQ0gsT0FBTyxJQUFJLFFBQVEsR0FBYSxPQUFPLENBQUMsUUFBUSxDQUFDO0FBRWpEOztHQUVHO0FBQ0gsT0FBTyxJQUFJLFNBQVMsR0FBYSxPQUFPLENBQUMsU0FBUyxDQUFDO0FBRW5EOzs7Ozs7Ozs7R0FTRztBQUNILE9BQU8sSUFBSSxTQUFTLEdBQWEsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUVuRDs7Ozs7Ozs7OztHQVVHO0FBQ0gsT0FBTyxJQUFJLFNBQVMsR0FBYSxPQUFPLENBQUMsU0FBUyxDQUFDO0FBa0JuRCxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQ3ZDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7QUFDdkIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUN6QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBRXpCLElBQUksWUFBWSxH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T0FBTyxHQUFXLElBQUk7SUFDeEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN4QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQdWJsaWMgVGVzdCBMaWJyYXJ5IGZvciB1bml0IHRlc3RpbmcgQW5ndWxhcjIgQXBwbGljYXRpb25zLiBVc2VzIHRoZVxuICogSmFzbWluZSBmcmFtZXdvcmsuXG4gKi9cbmltcG9ydCB7Z2xvYmFsfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7YmluZH0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5cbmltcG9ydCB7XG4gIEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zLFxuICBpbmplY3QsXG4gIGFzeW5jLFxuICBpbmplY3RBc3luYyxcbiAgVGVzdEluamVjdG9yLFxuICBnZXRUZXN0SW5qZWN0b3Jcbn0gZnJvbSAnLi90ZXN0X2luamVjdG9yJztcblxuZXhwb3J0IHtpbmplY3QsIGFzeW5jLCBpbmplY3RBc3luY30gZnJvbSAnLi90ZXN0X2luamVjdG9yJztcblxuZXhwb3J0IHtleHBlY3QsIE5nTWF0Y2hlcnN9IGZyb20gJy4vbWF0Y2hlcnMnO1xuXG52YXIgX2dsb2JhbCA9IDxhbnk+KHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93KTtcblxuLyoqXG4gKiBSdW4gYSBmdW5jdGlvbiAod2l0aCBhbiBvcHRpb25hbCBhc3luY2hyb25vdXMgY2FsbGJhY2spIGFmdGVyIGVhY2ggdGVzdCBjYXNlLlxuICpcbiAqIFNlZSBodHRwOi8vamFzbWluZS5naXRodWIuaW8vIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogIyMgRXhhbXBsZTpcbiAqXG4gKiB7QGV4YW1wbGUgdGVzdGluZy90cy90ZXN0aW5nLnRzIHJlZ2lvbj0nYWZ0ZXJFYWNoJ31cbiAqL1xuZXhwb3J0IHZhciBhZnRlckVhY2g6IEZ1bmN0aW9uID0gX2dsb2JhbC5hZnRlckVhY2g7XG5cbi8qKlxuICogR3JvdXAgdGVzdCBjYXNlcyB0b2dldGhlciB1bmRlciBhIGNvbW1vbiBkZXNjcmlwdGlvbiBwcmVmaXguXG4gKlxuICogU2VlIGh0dHA6Ly9qYXNtaW5lLmdpdGh1Yi5pby8gZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiAjIyBFeGFtcGxlOlxuICpcbiAqIHtAZXhhbXBsZSB0ZXN0aW5nL3RzL3Rlc3RpbmcudHMgcmVnaW9uPSdkZXNjcmliZUl0J31cbiAqL1xuZXhwb3J0IHZhciBkZXNjcmliZTogRnVuY3Rpb24gPSBfZ2xvYmFsLmRlc2NyaWJlO1xuXG4vKipcbiAqIFNlZSB7QGxpbmsgZmRlc2NyaWJlfS5cbiAqL1xuZXhwb3J0IHZhciBkZGVzY3JpYmU6IEZ1bmN0aW9uID0gX2dsb2JhbC5mZGVzY3JpYmU7XG5cbi8qKlxuICogTGlrZSB7QGxpbmsgZGVzY3JpYmV9LCBidXQgaW5zdHJ1Y3RzIHRoZSB0ZXN0IHJ1bm5lciB0byBvbmx5IHJ1blxuICogdGhlIHRlc3QgY2FzZXMgaW4gdGhpcyBncm91cC4gVGhpcyBpcyB1c2VmdWwgZm9yIGRlYnVnZ2luZy5cbiAqXG4gKiBTZWUgaHR0cDovL2phc21pbmUuZ2l0aHViLmlvLyBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqICMjIEV4YW1wbGU6XG4gKlxuICoge0BleGFtcGxlIHRlc3RpbmcvdHMvdGVzdGluZy50cyByZWdpb249J2ZkZXNjcmliZSd9XG4gKi9cbmV4cG9ydCB2YXIgZmRlc2NyaWJlOiBGdW5jdGlvbiA9IF9nbG9iYWwuZmRlc2NyaWJlO1xuXG4vKipcbiAqIExpa2Uge0BsaW5rIGRlc2NyaWJlfSwgYnV0IGluc3RydWN0cyB0aGUgdGVzdCBydW5uZXIgdG8gZXhjbHVkZVxuICogdGhpcyBncm91cCBvZiB0ZXN0IGNhc2VzIGZyb20gZXhlY3V0aW9uLiBUaGlzIGlzIHVzZWZ1bCBmb3JcbiAqIGRlYnVnZ2luZywgb3IgZm9yIGV4Y2x1ZGluZyBicm9rZW4gdGVzdHMgdW50aWwgdGhleSBjYW4gYmUgZml4ZWQuXG4gKlxuICogU2VlIGh0dHA6Ly9qYXNtaW5lLmdpdGh1Yi5pby8gZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiAjIyBFeGFtcGxlOlxuICpcbiAqIHtAZXhhbXBsZSB0ZXN0aW5nL3RzL3Rlc3RpbmcudHMgcmVnaW9uPSd4ZGVzY3JpYmUnfVxuICovXG5leHBvcnQgdmFyIHhkZXNjcmliZTogRnVuY3Rpb24gPSBfZ2xvYmFsLnhkZXNjcmliZTtcblxuLyoqXG4gKiBTaWduYXR1cmUgZm9yIGEgc3luY2hyb25vdXMgdGVzdCBmdW5jdGlvbiAobm8gYXJndW1lbnRzKS5cbiAqL1xuZXhwb3J0IHR5cGUgU3luY1Rlc3RGbiA9ICgpID0+IHZvaWQ7XG5cbi8qKlxuICogU2lnbmF0dXJlIGZvciBhbiBhc3luY2hyb25vdXMgdGVzdCBmdW5jdGlvbiB3aGljaCB0YWtlcyBhXG4gKiBgZG9uZWAgY2FsbGJhY2suXG4gKi9cbmV4cG9ydCB0eXBlIEFzeW5jVGVzdEZuID0gKGRvbmU6ICgpID0+IHZvaWQpID0+IHZvaWQ7XG5cbi8qKlxuICogU2lnbmF0dXJlIGZvciBhbnkgc2ltcGxlIHRlc3RpbmcgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCB0eXBlIEFueVRlc3RGbiA9IFN5bmNUZXN0Rm4gfCBBc3luY1Rlc3RGbiB8IEZ1bmN0aW9uO1xuXG52YXIganNtQmVmb3JlRWFjaCA9IF9nbG9iYWwuYmVmb3JlRWFjaDtcbnZhciBqc21JdCA9IF9nbG9iYWwuaXQ7XG52YXIganNtSUl0ID0gX2dsb2JhbC5maXQ7XG52YXIganNtWEl0ID0gX2dsb2JhbC54aXQ7XG5cbnZhciB0ZXN0SW5qZWN0b3I6IFRlc3RJbmplY3RvciA9IGdldFRlc3RJbmplY3RvcigpO1xuXG4vLyBSZXNldCB0aGUgdGVzdCBwcm92aWRlcnMgYmVmb3JlIGVhY2ggdGVzdC5cbmpzbUJlZm9yZUVhY2goKCkgPT4geyB0ZXN0SW5qZWN0b3IucmVzZXQoKTsgfSk7XG5cbi8qKlxuICogQWxsb3dzIG92ZXJyaWRpbmcgZGVmYXVsdCBwcm92aWRlcnMgb2YgdGhlIHRlc3QgaW5qZWN0b3IsXG4gKiB3aGljaCBhcmUgZGVmaW5lZCBpbiB0ZXN0X2luamVjdG9yLmpzLlxuICpcbiAqIFRoZSBnaXZlbiBmdW5jdGlvbiBtdXN0IHJldHVybiBhIGxpc3Qgb2YgREkgcHJvdmlkZXJzLlxuICpcbiAqICMjIEV4YW1wbGU6XG4gKlxuICoge0BleGFtcGxlIHRlc3RpbmcvdHMvdGVzdGluZy50cyByZWdpb249J2JlZm9yZUVhY2hQcm92aWRlcnMnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlRWFjaFByb3ZpZGVycyhmbik6IHZvaWQge1xuICBqc21CZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2YXIgcHJvdmlkZXJzID0gZm4oKTtcbiAgICBpZiAoIXByb3ZpZGVycykgcmV0dXJuO1xuICAgIHRyeSB7XG4gICAgICB0ZXN0SW5qZWN0b3IuYWRkUHJvdmlkZXJzKHByb3ZpZGVycyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdiZWZvcmVFYWNoUHJvdmlkZXJzIHdhcyBjYWxsZWQgYWZ0ZXIgdGhlIGluamVjdG9yIGhhZCAnICtcbiAgICAgICAgICAgICAgICAgICAgICAnYmVlbiB1c2VkIGluIGEgYmVmb3JlRWFjaCBvciBpdCBibG9jay4gVGhpcyBpbnZhbGlkYXRlcyB0aGUgJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ3Rlc3QgaW5qZWN0b3InKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBydW5JbkFzeW5jVGVzdFpvbmUoZm5Ub0V4ZWN1dGUsIGZpbmlzaENhbGxiYWNrOiBGdW5jdGlvbiwgZmFpbENhbGxiYWNrOiBGdW5jdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0TmFtZSA9ICcnKTogYW55IHtcbiAgdmFyIEFzeW5jVGVzdFpvbmVTcGVjID0gWm9uZVsnQXN5bmNUZXN0Wm9uZVNwZWMnXTtcbiAgdmFyIHRlc3Rab25lU3BlYyA9IG5ldyBBc3luY1Rlc3Rab25lU3BlYyhmaW5pc2hDYWxsYmFjaywgZmFpbENhbGxiYWNrLCB0ZXN0TmFtZSk7XG4gIHZhciB0ZXN0Wm9uZSA9IFpvbmUuY3VycmVudC5mb3JrKHRlc3Rab25lU3BlYyk7XG4gIHJldHVybiB0ZXN0Wm9uZS5ydW4oZm5Ub0V4ZWN1dGUpO1xufVxuXG5mdW5jdGlvbiBfaXNQcm9taXNlTGlrZShpbnB1dCk6IGJvb2xlYW4ge1xuICByZXR1cm4gaW5wdXQgJiYgISEoaW5wdXQudGhlbik7XG59XG5cbmZ1bmN0aW9uIF9pdChqc21GbjogRnVuY3Rpb24sIG5hbWU6IHN0cmluZywgdGVzdEZuOiBGdW5jdGlvbldpdGhQYXJhbVRva2VucyB8IEFueVRlc3RGbixcbiAgICAgICAgICAgICB0ZXN0VGltZU91dDogbnVtYmVyKTogdm9pZCB7XG4gIHZhciB0aW1lT3V0ID0gdGVzdFRpbWVPdXQ7XG4gIGlmICh0ZXN0Rm4gaW5zdGFuY2VvZiBGdW5jdGlvbldpdGhQYXJhbVRva2Vucykge1xuICAgIGxldCB0ZXN0Rm5UID0gdGVzdEZuO1xuICAgIGpzbUZuKG5hbWUsIChkb25lKSA9PiB7XG4gICAgICBpZiAodGVzdEZuVC5pc0FzeW5jKSB7XG4gICAgICAgIHJ1bkluQXN5bmNUZXN0Wm9uZSgoKSA9PiB0ZXN0SW5qZWN0b3IuZXhlY3V0ZSh0ZXN0Rm5UKSwgZG9uZSwgZG9uZS5mYWlsLCBuYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRlc3RJbmplY3Rvci5leGVjdXRlKHRlc3RGblQpO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9XG4gICAgfSwgdGltZU91dCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gVGhlIHRlc3QgY2FzZSBkb2Vzbid0IHVzZSBpbmplY3QoKS4gaWUgYGl0KCd0ZXN0JywgKGRvbmUpID0+IHsgLi4uIH0pKTtgXG4gICAganNtRm4obmFtZSwgdGVzdEZuLCB0aW1lT3V0KTtcbiAgfVxufVxuXG4vKipcbiAqIFdyYXBwZXIgYXJvdW5kIEphc21pbmUgYmVmb3JlRWFjaCBmdW5jdGlvbi5cbiAqXG4gKiBiZWZvcmVFYWNoIG1heSBiZSB1c2VkIHdpdGggdGhlIGBpbmplY3RgIGZ1bmN0aW9uIHRvIGZldGNoIGRlcGVuZGVuY2llcy5cbiAqXG4gKiBTZWUgaHR0cDovL2phc21pbmUuZ2l0aHViLmlvLyBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqICMjIEV4YW1wbGU6XG4gKlxuICoge0BleGFtcGxlIHRlc3RpbmcvdHMvdGVzdGluZy50cyByZWdpb249J2JlZm9yZUVhY2gnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlRWFjaChmbjogRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMgfCBBbnlUZXN0Rm4pOiB2b2lkIHtcbiAgaWYgKGZuIGluc3RhbmNlb2YgRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMpIHtcbiAgICAvLyBUaGUgdGVzdCBjYXNlIHVzZXMgaW5qZWN0KCkuIGllIGBiZWZvcmVFYWNoKGluamVjdChbQ2xhc3NBXSwgKGEpID0+IHsgLi4uXG4gICAgLy8gfSkpO2BcbiAgICBsZXQgZm5UID0gZm47XG4gICAganNtQmVmb3JlRWFjaCgoZG9uZSkgPT4ge1xuICAgICAgaWYgKGZuVC5pc0FzeW5jKSB7XG4gICAgICAgIHJ1bkluQXN5bmNUZXN0Wm9uZSgoKSA9PiB0ZXN0SW5qZWN0b3IuZXhlY3V0ZShmblQpLCBkb25lLCBkb25lLmZhaWwsICdiZWZvcmVFYWNoJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXN0SW5qZWN0b3IuZXhlY3V0ZShmblQpO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gVGhlIHRlc3QgY2FzZSBkb2Vzbid0IHVzZSBpbmplY3QoKS4gaWUgYGJlZm9yZUVhY2goKGRvbmUpID0+IHsgLi4uIH0pKTtgXG4gICAgaWYgKCg8YW55PmZuKS5sZW5ndGggPT09IDApIHtcbiAgICAgIGpzbUJlZm9yZUVhY2goKCkgPT4geyAoPFN5bmNUZXN0Rm4+Zm4pKCk7IH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBqc21CZWZvcmVFYWNoKChkb25lKSA9PiB7ICg8QXN5bmNUZXN0Rm4+Zm4pKGRvbmUpOyB9KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBzaW5nbGUgdGVzdCBjYXNlIHdpdGggdGhlIGdpdmVuIHRlc3QgbmFtZSBhbmQgZXhlY3V0aW9uIGZ1bmN0aW9uLlxuICpcbiAqIFRoZSB0ZXN0IGZ1bmN0aW9uIGNhbiBiZSBlaXRoZXIgYSBzeW5jaHJvbm91cyBmdW5jdGlvbiwgdGhlIHJlc3VsdCBvZiB7QGxpbmsgYXN5bmN9LFxuICogb3IgYW4gaW5qZWN0ZWQgZnVuY3Rpb24gY3JlYXRlZCB2aWEge0BsaW5rIGluamVjdH0uXG4gKlxuICogV3JhcHBlciBhcm91bmQgSmFzbWluZSBpdCBmdW5jdGlvbi4gU2VlIGh0dHA6Ly9qYXNtaW5lLmdpdGh1Yi5pby8gZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiAjIyBFeGFtcGxlOlxuICpcbiAqIHtAZXhhbXBsZSB0ZXN0aW5nL3RzL3Rlc3RpbmcudHMgcmVnaW9uPSdkZXNjcmliZUl0J31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGl0KG5hbWU6IHN0cmluZywgZm46IEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zIHwgQW55VGVzdEZuLFxuICAgICAgICAgICAgICAgICAgIHRpbWVPdXQ6IG51bWJlciA9IG51bGwpOiB2b2lkIHtcbiAgcmV0dXJuIF9pdChqc21JdCwgbmFtZSwgZm4sIHRpbWVPdXQpO1xufVxuXG4vKipcbiAqIExpa2Uge0BsaW5rIGl0fSwgYnV0IGluc3RydWN0cyB0aGUgdGVzdCBydW5uZXIgdG8gZXhjbHVkZSB0aGlzIHRlc3RcbiAqIGVudGlyZWx5LiBVc2VmdWwgZm9yIGRlYnVnZ2luZyBvciBmb3IgZXhjbHVkaW5nIGJyb2tlbiB0ZXN0cyB1bnRpbFxuICogdGhleSBjYW4gYmUgZml4ZWQuXG4gKlxuICogV3JhcHBlciBhcm91bmQgSmFzbWluZSB4aXQgZnVuY3Rpb24uIFNlZSBodHRwOi8vamFzbWluZS5naXRodWIuaW8vIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogIyMgRXhhbXBsZTpcbiAqXG4gKiB7QGV4YW1wbGUgdGVzdGluZy90cy90ZXN0aW5nLnRzIHJlZ2lvbj0neGl0J31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHhpdChuYW1lOiBzdHJpbmcsIGZuOiBGdW5jdGlvbldpdGhQYXJhbVRva2VucyB8IEFueVRlc3RGbixcbiAgICAgICAgICAgICAgICAgICAgdGltZU91dDogbnVtYmVyID0gbnVsbCk6IHZvaWQge1xuICByZXR1cm4gX2l0KGpzbVhJdCwgbmFtZSwgZm4sIHRpbWVPdXQpO1xufVxuXG4vKipcbiAqIFNlZSB7QGxpbmsgZml0fS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlpdChuYW1lOiBzdHJpbmcsIGZuOiBGdW5jdGlvbldpdGhQYXJhbVRva2VucyB8IEFueVRlc3RGbixcbiAgICAgICAgICAgICAgICAgICAgdGltZU91dDogbnVtYmVyID0gbnVsbCk6IHZvaWQge1xuICByZXR1cm4gX2l0KGpzbUlJdCwgbmFtZSwgZm4sIHRpbWVPdXQpO1xufVxuXG4vKipcbiAqIExpa2Uge0BsaW5rIGl0fSwgYnV0IGluc3RydWN0cyB0aGUgdGVzdCBydW5uZXIgdG8gb25seSBydW4gdGhpcyB0ZXN0LlxuICogVXNlZnVsIGZvciBkZWJ1Z2dpbmcuXG4gKlxuICogV3JhcHBlciBhcm91bmQgSmFzbWluZSBmaXQgZnVuY3Rpb24uIFNlZSBodHRwOi8vamFzbWluZS5naXRodWIuaW8vIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogIyMgRXhhbXBsZTpcbiAqXG4gKiB7QGV4YW1wbGUgdGVzdGluZy90cy90ZXN0aW5nLnRzIHJlZ2lvbj0nZml0J31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpdChuYW1lOiBzdHJpbmcsIGZuOiBGdW5jdGlvbldpdGhQYXJhbVRva2VucyB8IEFueVRlc3RGbixcbiAgICAgICAgICAgICAgICAgICAgdGltZU91dDogbnVtYmVyID0gbnVsbCk6IHZvaWQge1xuICByZXR1cm4gX2l0KGpzbUlJdCwgbmFtZSwgZm4sIHRpbWVPdXQpO1xufVxuIl19