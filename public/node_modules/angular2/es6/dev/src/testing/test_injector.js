import { ReflectiveInjector, PLATFORM_INITIALIZER } from 'angular2/core';
import { BaseException } from 'angular2/src/facade/exceptions';
import { ListWrapper } from 'angular2/src/facade/collection';
import { FunctionWrapper, isPresent } from 'angular2/src/facade/lang';
export class TestInjector {
    constructor() {
        this._instantiated = false;
        this._injector = null;
        this._providers = [];
        this.platformProviders = [];
        this.applicationProviders = [];
    }
    reset() {
        this._injector = null;
        this._providers = [];
        this._instantiated = false;
    }
    addProviders(providers) {
        if (this._instantiated) {
            throw new BaseException('Cannot add providers after test injector is instantiated');
        }
        this._providers = ListWrapper.concat(this._providers, providers);
    }
    createInjector() {
        var rootInjector = ReflectiveInjector.resolveAndCreate(this.platformProviders);
        this._injector = rootInjector.resolveAndCreateChild(ListWrapper.concat(this.applicationProviders, this._providers));
        this._instantiated = true;
        return this._injector;
    }
    execute(fn) {
        var additionalProviders = fn.additionalProviders();
        if (additionalProviders.length > 0) {
            this.addProviders(additionalProviders);
        }
        if (!this._instantiated) {
            this.createInjector();
        }
        return fn.execute(this._injector);
    }
}
var _testInjector = null;
export function getTestInjector() {
    if (_testInjector == null) {
        _testInjector = new TestInjector();
    }
    return _testInjector;
}
/**
 * Set the providers that the test injector should use. These should be providers
 * common to every test in the suite.
 *
 * This may only be called once, to set up the common providers for the current test
 * suite on teh current platform. If you absolutely need to change the providers,
 * first use `resetBaseTestProviders`.
 *
 * Test Providers for individual platforms are available from
 * 'angular2/platform/testing/<platform_name>'.
 */
export function setBaseTestProviders(platformProviders, applicationProviders) {
    var testInjector = getTestInjector();
    if (testInjector.platformProviders.length > 0 || testInjector.applicationProviders.length > 0) {
        throw new BaseException('Cannot set base providers because it has already been called');
    }
    testInjector.platformProviders = platformProviders;
    testInjector.applicationProviders = applicationProviders;
    var injector = testInjector.createInjector();
    let inits = injector.get(PLATFORM_INITIALIZER, null);
    if (isPresent(inits)) {
        inits.forEach(init => init());
    }
    testInjector.reset();
}
/**
 * Reset the providers for the test injector.
 */
export function resetBaseTestProviders() {
    var testInjector = getTestInjector();
    testInjector.platformProviders = [];
    testInjector.applicationProviders = [];
    testInjector.reset();
}
/**
 * Allows injecting dependencies in `beforeEach()` and `it()`.
 *
 * Example:
 *
 * ```
 * beforeEach(inject([Dependency, AClass], (dep, object) => {
 *   // some code that uses `dep` and `object`
 *   // ...
 * }));
 *
 * it('...', inject([AClass], (object) => {
 *   object.doSomething();
 *   expect(...);
 * })
 * ```
 *
 * Notes:
 * - inject is currently a function because of some Traceur limitation the syntax should
 * eventually
 *   becomes `it('...', @Inject (object: AClass, async: AsyncTestCompleter) => { ... });`
 *
 * @param {Array} tokens
 * @param {Function} fn
 * @return {FunctionWithParamTokens}
 */
export function inject(tokens, fn) {
    return new FunctionWithParamTokens(tokens, fn, false);
}
export class InjectSetupWrapper {
    constructor(_providers) {
        this._providers = _providers;
    }
    inject(tokens, fn) {
        return new FunctionWithParamTokens(tokens, fn, false, this._providers);
    }
    /** @Deprecated {use async(withProviders().inject())} */
    injectAsync(tokens, fn) {
        return new FunctionWithParamTokens(tokens, fn, true, this._providers);
    }
}
export function withProviders(providers) {
    return new InjectSetupWrapper(providers);
}
/**
 * @Deprecated {use async(inject())}
 *
 * Allows injecting dependencies in `beforeEach()` and `it()`. The test must return
 * a promise which will resolve when all asynchronous activity is complete.
 *
 * Example:
 *
 * ```
 * it('...', injectAsync([AClass], (object) => {
 *   return object.doSomething().then(() => {
 *     expect(...);
 *   });
 * })
 * ```
 *
 * @param {Array} tokens
 * @param {Function} fn
 * @return {FunctionWithParamTokens}
 */
export function injectAsync(tokens, fn) {
    return new FunctionWithParamTokens(tokens, fn, true);
}
/**
 * Wraps a test function in an asynchronous test zone. The test will automatically
 * complete when all asynchronous calls within this zone are done. Can be used
 * to wrap an {@link inject} call.
 *
 * Example:
 *
 * ```
 * it('...', async(inject([AClass], (object) => {
 *   object.doSomething.then(() => {
 *     expect(...);
 *   })
 * });
 * ```
 */
export function async(fn) {
    if (fn instanceof FunctionWithParamTokens) {
        fn.isAsync = true;
        return fn;
    }
    else if (fn instanceof Function) {
        return new FunctionWithParamTokens([], fn, true);
    }
    else {
        throw new BaseException('argument to async must be a function or inject(<Function>)');
    }
}
function emptyArray() {
    return [];
}
export class FunctionWithParamTokens {
    constructor(_tokens, fn, isAsync, additionalProviders = emptyArray) {
        this._tokens = _tokens;
        this.fn = fn;
        this.isAsync = isAsync;
        this.additionalProviders = additionalProviders;
    }
    /**
     * Returns the value of the executed function.
     */
    execute(injector) {
        var params = this._tokens.map(t => injector.get(t));
        return FunctionWrapper.apply(this.fn, params);
    }
    hasToken(token) { return this._tokens.indexOf(token) > -1; }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9pbmplY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUQxaUdRVkcudG1wL2FuZ3VsYXIyL3NyYy90ZXN0aW5nL3Rlc3RfaW5qZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxrQkFBa0IsRUFBWSxvQkFBb0IsRUFBQyxNQUFNLGVBQWU7T0FDekUsRUFBQyxhQUFhLEVBQW1CLE1BQU0sZ0NBQWdDO09BQ3ZFLEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0NBQWdDO09BQ25ELEVBQUMsZUFBZSxFQUFFLFNBQVMsRUFBTyxNQUFNLDBCQUEwQjtBQUV6RTtJQUFBO1FBQ1Usa0JBQWEsR0FBWSxLQUFLLENBQUM7UUFFL0IsY0FBUyxHQUF1QixJQUFJLENBQUM7UUFFckMsZUFBVSxHQUFtQyxFQUFFLENBQUM7UUFReEQsc0JBQWlCLEdBQW1DLEVBQUUsQ0FBQztRQUV2RCx5QkFBb0IsR0FBbUMsRUFBRSxDQUFDO0lBMkI1RCxDQUFDO0lBbkNDLEtBQUs7UUFDSCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztJQUM3QixDQUFDO0lBTUQsWUFBWSxDQUFDLFNBQXlDO1FBQ3BELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sSUFBSSxhQUFhLENBQUMsMERBQTBELENBQUMsQ0FBQztRQUN0RixDQUFDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELGNBQWM7UUFDWixJQUFJLFlBQVksR0FBRyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENB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QUFnQixFQUM3RCxtQkFBbUIsR0FBYyxVQUFVO1FBRDFDLFlBQU8sR0FBUCxPQUFPLENBQU87UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFVO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUM3RCx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXdCO0lBQUcsQ0FBQztJQUVsRTs7T0FFRztJQUNILE9BQU8sQ0FBQyxRQUE0QjtRQUNsQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELFFBQVEsQ0FBQyxLQUFVLElBQWEsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1RSxDQUFDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1JlZmxlY3RpdmVJbmplY3RvciwgUHJvdmlkZXIsIFBMQVRGT1JNX0lOSVRJQUxJWkVSfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbiwgRXhjZXB0aW9uSGFuZGxlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7TGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge0Z1bmN0aW9uV3JhcHBlciwgaXNQcmVzZW50LCBUeXBlfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG5leHBvcnQgY2xhc3MgVGVzdEluamVjdG9yIHtcbiAgcHJpdmF0ZSBfaW5zdGFudGlhdGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfaW5qZWN0b3I6IFJlZmxlY3RpdmVJbmplY3RvciA9IG51bGw7XG5cbiAgcHJpdmF0ZSBfcHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4gPSBbXTtcblxuICByZXNldCgpIHtcbiAgICB0aGlzLl9pbmplY3RvciA9IG51bGw7XG4gICAgdGhpcy5fcHJvdmlkZXJzID0gW107XG4gICAgdGhpcy5faW5zdGFudGlhdGVkID0gZmFsc2U7XG4gIH1cblxuICBwbGF0Zm9ybVByb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+ID0gW107XG5cbiAgYXBwbGljYXRpb25Qcm92aWRlcnM6IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPiA9IFtdO1xuXG4gIGFkZFByb3ZpZGVycyhwcm92aWRlcnM6IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPikge1xuICAgIGlmICh0aGlzLl9pbnN0YW50aWF0ZWQpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCdDYW5ub3QgYWRkIHByb3ZpZGVycyBhZnRlciB0ZXN0IGluamVjdG9yIGlzIGluc3RhbnRpYXRlZCcpO1xuICAgIH1cbiAgICB0aGlzLl9wcm92aWRlcnMgPSBMaXN0V3JhcHBlci5jb25jYXQodGhpcy5fcHJvdmlkZXJzLCBwcm92aWRlcnMpO1xuICB9XG5cbiAgY3JlYXRlSW5qZWN0b3IoKSB7XG4gICAgdmFyIHJvb3RJbmplY3RvciA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKHRoaXMucGxhdGZvcm1Qcm92aWRlcnMpO1xuICAgIHRoaXMuX2luamVjdG9yID0gcm9vdEluamVjdG9yLnJlc29sdmVBbmRDcmVhdGVDaGlsZChcbiAgICAgICAgTGlzdFdyYXBwZXIuY29uY2F0KHRoaXMuYXBwbGljYXRpb25Qcm92aWRlcnMsIHRoaXMuX3Byb3ZpZGVycykpO1xuICAgIHRoaXMuX2luc3RhbnRpYXRlZCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMuX2luamVjdG9yO1xuICB9XG5cbiAgZXhlY3V0ZShmbjogRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMpOiBhbnkge1xuICAgIHZhciBhZGRpdGlvbmFsUHJvdmlkZXJzID0gZm4uYWRkaXRpb25hbFByb3ZpZGVycygpO1xuICAgIGlmIChhZGRpdGlvbmFsUHJvdmlkZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuYWRkUHJvdmlkZXJzKGFkZGl0aW9uYWxQcm92aWRlcnMpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2luc3RhbnRpYXRlZCkge1xuICAgICAgdGhpcy5jcmVhdGVJbmplY3RvcigpO1xuICAgIH1cbiAgICByZXR1cm4gZm4uZXhlY3V0ZSh0aGlzLl9pbmplY3Rvcik7XG4gIH1cbn1cblxudmFyIF90ZXN0SW5qZWN0b3I6IFRlc3RJbmplY3RvciA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUZXN0SW5qZWN0b3IoKSB7XG4gIGlmIChfdGVzdEluamVjdG9yID09IG51bGwpIHtcbiAgICBfdGVzdEluamVjdG9yID0gbmV3IFRlc3RJbmplY3RvcigpO1xuICB9XG4gIHJldHVybiBfdGVzdEluamVjdG9yO1xufVxuXG4vKipcbiAqIFNldCB0aGUgcHJvdmlkZXJzIHRoYXQgdGhlIHRlc3QgaW5qZWN0b3Igc2hvdWxkIHVzZS4gVGhlc2Ugc2hvdWxkIGJlIHByb3ZpZGVyc1xuICogY29tbW9uIHRvIGV2ZXJ5IHRlc3QgaW4gdGhlIHN1aXRlLlxuICpcbiAqIFRoaXMgbWF5IG9ubHkgYmUgY2FsbGVkIG9uY2UsIHRvIHNldCB1cCB0aGUgY29tbW9uIHByb3ZpZGVycyBmb3IgdGhlIGN1cnJlbnQgdGVzdFxuICogc3VpdGUgb24gdGVoIGN1cnJlbnQgcGxhdGZvcm0uIElmIHlvdSBhYnNvbHV0ZWx5IG5lZWQgdG8gY2hhbmdlIHRoZSBwcm92aWRlcnMsXG4gKiBmaXJzdCB1c2UgYHJlc2V0QmFzZVRlc3RQcm92aWRlcnNgLlxuICpcbiAqIFRlc3QgUHJvdmlkZXJzIGZvciBpbmRpdmlkdWFsIHBsYXRmb3JtcyBhcmUgYXZhaWxhYmxlIGZyb21cbiAqICdhbmd1bGFyMi9wbGF0Zm9ybS90ZXN0aW5nLzxwbGF0Zm9ybV9uYW1lPicuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRCYXNlVGVzdFByb3ZpZGVycyhwbGF0Zm9ybVByb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uUHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4pIHtcbiAgdmFyIHRlc3RJbmplY3RvciA9IGdldFRlc3RJbmplY3RvcigpO1xuICBpZiAodGVzdEluamVjdG9yLnBsYXRmb3JtUHJvdmlkZXJzLmxlbmd0aCA+IDAgfHwgdGVzdEluamVjdG9yLmFwcGxpY2F0aW9uUHJvdmlkZXJzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbignQ2Fubm90IHNldCBiYXNlIHByb3ZpZGVycyBiZWNhdXNlIGl0IGhhcyBhbHJlYWR5IGJlZW4gY2FsbGVkJyk7XG4gIH1cbiAgdGVzdEluamVjdG9yLnBsYXRmb3JtUHJvdmlkZXJzID0gcGxhdGZvcm1Qcm92aWRlcnM7XG4gIHRlc3RJbmplY3Rvci5hcHBsaWNhdGlvblByb3ZpZGVycyA9IGFwcGxpY2F0aW9uUHJvdmlkZXJzO1xuICB2YXIgaW5qZWN0b3IgPSB0ZXN0SW5qZWN0b3IuY3JlYXRlSW5qZWN0b3IoKTtcbiAgbGV0IGluaXRzOiBGdW5jdGlvbltdID0gaW5qZWN0b3IuZ2V0KFBMQVRGT1JNX0lOSVRJQUxJWkVSLCBudWxsKTtcbiAgaWYgKGlzUHJlc2VudChpbml0cykpIHtcbiAgICBpbml0cy5mb3JFYWNoKGluaXQgPT4gaW5pdCgpKTtcbiAgfVxuICB0ZXN0SW5qZWN0b3IucmVzZXQoKTtcbn1cblxuLyoqXG4gKiBSZXNldCB0aGUgcHJvdmlkZXJzIGZvciB0aGUgdGVzdCBpbmplY3Rvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0QmFzZVRlc3RQcm92aWRlcnMoKSB7XG4gIHZhciB0ZXN0SW5qZWN0b3IgPSBnZXRUZXN0SW5qZWN0b3IoKTtcbiAgdGVzdEluamVjdG9yLnBsYXRmb3JtUHJvdmlkZXJzID0gW107XG4gIHRlc3RJbmplY3Rvci5hcHBsaWNhdGlvblByb3ZpZGVycyA9IFtdO1xuICB0ZXN0SW5qZWN0b3IucmVzZXQoKTtcbn1cblxuLyoqXG4gKiBBbGxvd3MgaW5qZWN0aW5nIGRlcGVuZGVuY2llcyBpbiBgYmVmb3JlRWFjaCgpYCBhbmQgYGl0KClgLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBgXG4gKiBiZWZvcmVFYWNoKGluamVjdChbRGVwZW5kZW5jeSwgQUNsYXNzXSwgKGRlcCwgb2JqZWN0KSA9PiB7XG4gKiAgIC8vIHNvbWUgY29kZSB0aGF0IHVzZXMgYGRlcGAgYW5kIGBvYmplY3RgXG4gKiAgIC8vIC4uLlxuICogfSkpO1xuICpcbiAqIGl0KCcuLi4nLCBpbmplY3QoW0FDbGFzc10sIChvYmplY3QpID0+IHtcbiAqICAgb2JqZWN0LmRvU29tZXRoaW5nKCk7XG4gKiAgIGV4cGVjdCguLi4pO1xuICogfSlcbiAqIGBgYFxuICpcbiAqIE5vdGVzOlxuICogLSBpbmplY3QgaXMgY3VycmVudGx5IGEgZnVuY3Rpb24gYmVjYXVzZSBvZiBzb21lIFRyYWNldXIgbGltaXRhdGlvbiB0aGUgc3ludGF4IHNob3VsZFxuICogZXZlbnR1YWxseVxuICogICBiZWNvbWVzIGBpdCgnLi4uJywgQEluamVjdCAob2JqZWN0OiBBQ2xhc3MsIGFzeW5jOiBBc3luY1Rlc3RDb21wbGV0ZXIpID0+IHsgLi4uIH0pO2BcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB0b2tlbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbldpdGhQYXJhbVRva2Vuc31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluamVjdCh0b2tlbnM6IGFueVtdLCBmbjogRnVuY3Rpb24pOiBGdW5jdGlvbldpdGhQYXJhbVRva2VucyB7XG4gIHJldHVybiBuZXcgRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnModG9rZW5zLCBmbiwgZmFsc2UpO1xufVxuXG5leHBvcnQgY2xhc3MgSW5qZWN0U2V0dXBXcmFwcGVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcHJvdmlkZXJzOiAoKSA9PiBhbnkpIHt9XG5cbiAgaW5qZWN0KHRva2VuczogYW55W10sIGZuOiBGdW5jdGlvbik6IEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zIHtcbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zKHRva2VucywgZm4sIGZhbHNlLCB0aGlzLl9wcm92aWRlcnMpO1xuICB9XG5cbiAgLyoqIEBEZXByZWNhdGVkIHt1c2UgYXN5bmMod2l0aFByb3ZpZGVycygpLmluamVjdCgpKX0gKi9cbiAgaW5qZWN0QXN5bmModG9rZW5zOiBhbnlbXSwgZm46IEZ1bmN0aW9uKTogRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMge1xuICAgIHJldHVybiBuZXcgRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnModG9rZW5zLCBmbiwgdHJ1ZSwgdGhpcy5fcHJvdmlkZXJzKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aFByb3ZpZGVycyhwcm92aWRlcnM6ICgpID0+IGFueSkge1xuICByZXR1cm4gbmV3IEluamVjdFNldHVwV3JhcHBlcihwcm92aWRlcnMpO1xufVxuXG4vKipcbiAqIEBEZXByZWNhdGVkIHt1c2UgYXN5bmMoaW5qZWN0KCkpfVxuICpcbiAqIEFsbG93cyBpbmplY3RpbmcgZGVwZW5kZW5jaWVzIGluIGBiZWZvcmVFYWNoKClgIGFuZCBgaXQoKWAuIFRoZSB0ZXN0IG11c3QgcmV0dXJuXG4gKiBhIHByb21pc2Ugd2hpY2ggd2lsbCByZXNvbHZlIHdoZW4gYWxsIGFzeW5jaHJvbm91cyBhY3Rpdml0eSBpcyBjb21wbGV0ZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYFxuICogaXQoJy4uLicsIGluamVjdEFzeW5jKFtBQ2xhc3NdLCAob2JqZWN0KSA9PiB7XG4gKiAgIHJldHVybiBvYmplY3QuZG9Tb21ldGhpbmcoKS50aGVuKCgpID0+IHtcbiAqICAgICBleHBlY3QoLi4uKTtcbiAqICAgfSk7XG4gKiB9KVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdG9rZW5zXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnN9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3RBc3luYyh0b2tlbnM6IGFueVtdLCBmbjogRnVuY3Rpb24pOiBGdW5jdGlvbldpdGhQYXJhbVRva2VucyB7XG4gIHJldHVybiBuZXcgRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnModG9rZW5zLCBmbiwgdHJ1ZSk7XG59XG5cbi8qKlxuICogV3JhcHMgYSB0ZXN0IGZ1bmN0aW9uIGluIGFuIGFzeW5jaHJvbm91cyB0ZXN0IHpvbmUuIFRoZSB0ZXN0IHdpbGwgYXV0b21hdGljYWxseVxuICogY29tcGxldGUgd2hlbiBhbGwgYXN5bmNocm9ub3VzIGNhbGxzIHdpdGhpbiB0aGlzIHpvbmUgYXJlIGRvbmUuIENhbiBiZSB1c2VkXG4gKiB0byB3cmFwIGFuIHtAbGluayBpbmplY3R9IGNhbGwuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIGl0KCcuLi4nLCBhc3luYyhpbmplY3QoW0FDbGFzc10sIChvYmplY3QpID0+IHtcbiAqICAgb2JqZWN0LmRvU29tZXRoaW5nLnRoZW4oKCkgPT4ge1xuICogICAgIGV4cGVjdCguLi4pO1xuICogICB9KVxuICogfSk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzeW5jKGZuOiBGdW5jdGlvbiB8IEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zKTogRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMge1xuICBpZiAoZm4gaW5zdGFuY2VvZiBGdW5jdGlvbldpdGhQYXJhbVRva2Vucykge1xuICAgIGZuLmlzQXN5bmMgPSB0cnVlO1xuICAgIHJldHVybiBmbjtcbiAgfSBlbHNlIGlmIChmbiBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbldpdGhQYXJhbVRva2VucyhbXSwgZm4sIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCdhcmd1bWVudCB0byBhc3luYyBtdXN0IGJlIGEgZnVuY3Rpb24gb3IgaW5qZWN0KDxGdW5jdGlvbj4pJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZW1wdHlBcnJheSgpOiBBcnJheTxhbnk+IHtcbiAgcmV0dXJuIFtdO1xufVxuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF90b2tlbnM6IGFueVtdLCBwdWJsaWMgZm46IEZ1bmN0aW9uLCBwdWJsaWMgaXNBc3luYzogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHVibGljIGFkZGl0aW9uYWxQcm92aWRlcnM6ICgpID0+IGFueSA9IGVtcHR5QXJyYXkpIHt9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBleGVjdXRlZCBmdW5jdGlvbi5cbiAgICovXG4gIGV4ZWN1dGUoaW5qZWN0b3I6IFJlZmxlY3RpdmVJbmplY3Rvcik6IGFueSB7XG4gICAgdmFyIHBhcmFtcyA9IHRoaXMuX3Rva2Vucy5tYXAodCA9PiBpbmplY3Rvci5nZXQodCkpO1xuICAgIHJldHVybiBGdW5jdGlvbldyYXBwZXIuYXBwbHkodGhpcy5mbiwgcGFyYW1zKTtcbiAgfVxuXG4gIGhhc1Rva2VuKHRva2VuOiBhbnkpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3Rva2Vucy5pbmRleE9mKHRva2VuKSA+IC0xOyB9XG59XG4iXX0=