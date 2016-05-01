'use strict';"use strict";
var core_1 = require('angular2/core');
var exceptions_1 = require('angular2/src/facade/exceptions');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var TestInjector = (function () {
    function TestInjector() {
        this._instantiated = false;
        this._injector = null;
        this._providers = [];
        this.platformProviders = [];
        this.applicationProviders = [];
    }
    TestInjector.prototype.reset = function () {
        this._injector = null;
        this._providers = [];
        this._instantiated = false;
    };
    TestInjector.prototype.addProviders = function (providers) {
        if (this._instantiated) {
            throw new exceptions_1.BaseException('Cannot add providers after test injector is instantiated');
        }
        this._providers = collection_1.ListWrapper.concat(this._providers, providers);
    };
    TestInjector.prototype.createInjector = function () {
        var rootInjector = core_1.ReflectiveInjector.resolveAndCreate(this.platformProviders);
        this._injector = rootInjector.resolveAndCreateChild(collection_1.ListWrapper.concat(this.applicationProviders, this._providers));
        this._instantiated = true;
        return this._injector;
    };
    TestInjector.prototype.execute = function (fn) {
        var additionalProviders = fn.additionalProviders();
        if (additionalProviders.length > 0) {
            this.addProviders(additionalProviders);
        }
        if (!this._instantiated) {
            this.createInjector();
        }
        return fn.execute(this._injector);
    };
    return TestInjector;
}());
exports.TestInjector = TestInjector;
var _testInjector = null;
function getTestInjector() {
    if (_testInjector == null) {
        _testInjector = new TestInjector();
    }
    return _testInjector;
}
exports.getTestInjector = getTestInjector;
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
function setBaseTestProviders(platformProviders, applicationProviders) {
    var testInjector = getTestInjector();
    if (testInjector.platformProviders.length > 0 || testInjector.applicationProviders.length > 0) {
        throw new exceptions_1.BaseException('Cannot set base providers because it has already been called');
    }
    testInjector.platformProviders = platformProviders;
    testInjector.applicationProviders = applicationProviders;
    var injector = testInjector.createInjector();
    var inits = injector.get(core_1.PLATFORM_INITIALIZER, null);
    if (lang_1.isPresent(inits)) {
        inits.forEach(function (init) { return init(); });
    }
    testInjector.reset();
}
exports.setBaseTestProviders = setBaseTestProviders;
/**
 * Reset the providers for the test injector.
 */
function resetBaseTestProviders() {
    var testInjector = getTestInjector();
    testInjector.platformProviders = [];
    testInjector.applicationProviders = [];
    testInjector.reset();
}
exports.resetBaseTestProviders = resetBaseTestProviders;
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
function inject(tokens, fn) {
    return new FunctionWithParamTokens(tokens, fn, false);
}
exports.inject = inject;
var InjectSetupWrapper = (function () {
    function InjectSetupWrapper(_providers) {
        this._providers = _providers;
    }
    InjectSetupWrapper.prototype.inject = function (tokens, fn) {
        return new FunctionWithParamTokens(tokens, fn, false, this._providers);
    };
    /** @Deprecated {use async(withProviders().inject())} */
    InjectSetupWrapper.prototype.injectAsync = function (tokens, fn) {
        return new FunctionWithParamTokens(tokens, fn, true, this._providers);
    };
    return InjectSetupWrapper;
}());
exports.InjectSetupWrapper = InjectSetupWrapper;
function withProviders(providers) {
    return new InjectSetupWrapper(providers);
}
exports.withProviders = withProviders;
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
function injectAsync(tokens, fn) {
    return new FunctionWithParamTokens(tokens, fn, true);
}
exports.injectAsync = injectAsync;
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
function async(fn) {
    if (fn instanceof FunctionWithParamTokens) {
        fn.isAsync = true;
        return fn;
    }
    else if (fn instanceof Function) {
        return new FunctionWithParamTokens([], fn, true);
    }
    else {
        throw new exceptions_1.BaseException('argument to async must be a function or inject(<Function>)');
    }
}
exports.async = async;
function emptyArray() {
    return [];
}
var FunctionWithParamTokens = (function () {
    function FunctionWithParamTokens(_tokens, fn, isAsync, additionalProviders) {
        if (additionalProviders === void 0) { additionalProviders = emptyArray; }
        this._tokens = _tokens;
        this.fn = fn;
        this.isAsync = isAsync;
        this.additionalProviders = additionalProviders;
    }
    /**
     * Returns the value of the executed function.
     */
    FunctionWithParamTokens.prototype.execute = function (injector) {
        var params = this._tokens.map(function (t) { return injector.get(t); });
        return lang_1.FunctionWrapper.apply(this.fn, params);
    };
    FunctionWithParamTokens.prototype.hasToken = function (token) { return this._tokens.indexOf(token) > -1; };
    return FunctionWithParamTokens;
}());
exports.FunctionWithParamTokens = FunctionWithParamTokens;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9pbmplY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtV1MzalB0bnYudG1wL2FuZ3VsYXIyL3NyYy90ZXN0aW5nL3Rlc3RfaW5qZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUFpRSxlQUFlLENBQUMsQ0FBQTtBQUNqRiwyQkFBOEMsZ0NBQWdDLENBQUMsQ0FBQTtBQUMvRSwyQkFBMEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUMzRCxxQkFBK0MsMEJBQTBCLENBQUMsQ0FBQTtBQUUxRTtJQUFBO1FBQ1Usa0JBQWEsR0FBWSxLQUFLLENBQUM7UUFFL0IsY0FBUyxHQUF1QixJQUFJLENBQUM7UUFFckMsZUFBVSxHQUFtQyxFQUFFLENBQUM7UUFReEQsc0JBQWlCLEdBQW1DLEVBQUUsQ0FBQztRQUV2RCx5QkFBb0IsR0FBbUMsRUFBRSxDQUFDO0lBMkI1RCxDQUFDO0lBbkNDLDRCQUFLLEdBQUw7UUFDRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztJQUM3QixDQUFDO0lBTUQsbUNBQVksR0FBWixVQUFhLFNBQXlDO1FBQ3BELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sSUFBSSwwQkFBYSxDQUFDLDBEQUEwRCxDQUFDLENBQUM7UUFDdEYsQ0FBQztRQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsd0JBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQscUNBQWMsR0FBZDtRQUNFLElBQUksWUFBWSxHQUFHLHlCQUFrQixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxD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dmlkZXIsIFBMQVRGT1JNX0lOSVRJQUxJWkVSfSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbiwgRXhjZXB0aW9uSGFuZGxlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7TGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge0Z1bmN0aW9uV3JhcHBlciwgaXNQcmVzZW50LCBUeXBlfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG5leHBvcnQgY2xhc3MgVGVzdEluamVjdG9yIHtcbiAgcHJpdmF0ZSBfaW5zdGFudGlhdGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfaW5qZWN0b3I6IFJlZmxlY3RpdmVJbmplY3RvciA9IG51bGw7XG5cbiAgcHJpdmF0ZSBfcHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4gPSBbXTtcblxuICByZXNldCgpIHtcbiAgICB0aGlzLl9pbmplY3RvciA9IG51bGw7XG4gICAgdGhpcy5fcHJvdmlkZXJzID0gW107XG4gICAgdGhpcy5faW5zdGFudGlhdGVkID0gZmFsc2U7XG4gIH1cblxuICBwbGF0Zm9ybVByb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+ID0gW107XG5cbiAgYXBwbGljYXRpb25Qcm92aWRlcnM6IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPiA9IFtdO1xuXG4gIGFkZFByb3ZpZGVycyhwcm92aWRlcnM6IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPikge1xuICAgIGlmICh0aGlzLl9pbnN0YW50aWF0ZWQpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCdDYW5ub3QgYWRkIHByb3ZpZGVycyBhZnRlciB0ZXN0IGluamVjdG9yIGlzIGluc3RhbnRpYXRlZCcpO1xuICAgIH1cbiAgICB0aGlzLl9wcm92aWRlcnMgPSBMaXN0V3JhcHBlci5jb25jYXQodGhpcy5fcHJvdmlkZXJzLCBwcm92aWRlcnMpO1xuICB9XG5cbiAgY3JlYXRlSW5qZWN0b3IoKSB7XG4gICAgdmFyIHJvb3RJbmplY3RvciA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKHRoaXMucGxhdGZvcm1Qcm92aWRlcnMpO1xuICAgIHRoaXMuX2luamVjdG9yID0gcm9vdEluamVjdG9yLnJlc29sdmVBbmRDcmVhdGVDaGlsZChcbiAgICAgICAgTGlzdFdyYXBwZXIuY29uY2F0KHRoaXMuYXBwbGljYXRpb25Qcm92aWRlcnMsIHRoaXMuX3Byb3ZpZGVycykpO1xuICAgIHRoaXMuX2luc3RhbnRpYXRlZCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMuX2luamVjdG9yO1xuICB9XG5cbiAgZXhlY3V0ZShmbjogRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMpOiBhbnkge1xuICAgIHZhciBhZGRpdGlvbmFsUHJvdmlkZXJzID0gZm4uYWRkaXRpb25hbFByb3ZpZGVycygpO1xuICAgIGlmIChhZGRpdGlvbmFsUHJvdmlkZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuYWRkUHJvdmlkZXJzKGFkZGl0aW9uYWxQcm92aWRlcnMpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2luc3RhbnRpYXRlZCkge1xuICAgICAgdGhpcy5jcmVhdGVJbmplY3RvcigpO1xuICAgIH1cbiAgICByZXR1cm4gZm4uZXhlY3V0ZSh0aGlzLl9pbmplY3Rvcik7XG4gIH1cbn1cblxudmFyIF90ZXN0SW5qZWN0b3I6IFRlc3RJbmplY3RvciA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUZXN0SW5qZWN0b3IoKSB7XG4gIGlmIChfdGVzdEluamVjdG9yID09IG51bGwpIHtcbiAgICBfdGVzdEluamVjdG9yID0gbmV3IFRlc3RJbmplY3RvcigpO1xuICB9XG4gIHJldHVybiBfdGVzdEluamVjdG9yO1xufVxuXG4vKipcbiAqIFNldCB0aGUgcHJvdmlkZXJzIHRoYXQgdGhlIHRlc3QgaW5qZWN0b3Igc2hvdWxkIHVzZS4gVGhlc2Ugc2hvdWxkIGJlIHByb3ZpZGVyc1xuICogY29tbW9uIHRvIGV2ZXJ5IHRlc3QgaW4gdGhlIHN1aXRlLlxuICpcbiAqIFRoaXMgbWF5IG9ubHkgYmUgY2FsbGVkIG9uY2UsIHRvIHNldCB1cCB0aGUgY29tbW9uIHByb3ZpZGVycyBmb3IgdGhlIGN1cnJlbnQgdGVzdFxuICogc3VpdGUgb24gdGVoIGN1cnJlbnQgcGxhdGZvcm0uIElmIHlvdSBhYnNvbHV0ZWx5IG5lZWQgdG8gY2hhbmdlIHRoZSBwcm92aWRlcnMsXG4gKiBmaXJzdCB1c2UgYHJlc2V0QmFzZVRlc3RQcm92aWRlcnNgLlxuICpcbiAqIFRlc3QgUHJvdmlkZXJzIGZvciBpbmRpdmlkdWFsIHBsYXRmb3JtcyBhcmUgYXZhaWxhYmxlIGZyb21cbiAqICdhbmd1bGFyMi9wbGF0Zm9ybS90ZXN0aW5nLzxwbGF0Zm9ybV9uYW1lPicuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRCYXNlVGVzdFByb3ZpZGVycyhwbGF0Zm9ybVByb3ZpZGVyczogQXJyYXk8VHlwZSB8IFByb3ZpZGVyIHwgYW55W10+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcGxpY2F0aW9uUHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4pIHtcbiAgdmFyIHRlc3RJbmplY3RvciA9IGdldFRlc3RJbmplY3RvcigpO1xuICBpZiAodGVzdEluamVjdG9yLnBsYXRmb3JtUHJvdmlkZXJzLmxlbmd0aCA+IDAgfHwgdGVzdEluamVjdG9yLmFwcGxpY2F0aW9uUHJvdmlkZXJzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbignQ2Fubm90IHNldCBiYXNlIHByb3ZpZGVycyBiZWNhdXNlIGl0IGhhcyBhbHJlYWR5IGJlZW4gY2FsbGVkJyk7XG4gIH1cbiAgdGVzdEluamVjdG9yLnBsYXRmb3JtUHJvdmlkZXJzID0gcGxhdGZvcm1Qcm92aWRlcnM7XG4gIHRlc3RJbmplY3Rvci5hcHBsaWNhdGlvblByb3ZpZGVycyA9IGFwcGxpY2F0aW9uUHJvdmlkZXJzO1xuICB2YXIgaW5qZWN0b3IgPSB0ZXN0SW5qZWN0b3IuY3JlYXRlSW5qZWN0b3IoKTtcbiAgbGV0IGluaXRzOiBGdW5jdGlvbltdID0gaW5qZWN0b3IuZ2V0KFBMQVRGT1JNX0lOSVRJQUxJWkVSLCBudWxsKTtcbiAgaWYgKGlzUHJlc2VudChpbml0cykpIHtcbiAgICBpbml0cy5mb3JFYWNoKGluaXQgPT4gaW5pdCgpKTtcbiAgfVxuICB0ZXN0SW5qZWN0b3IucmVzZXQoKTtcbn1cblxuLyoqXG4gKiBSZXNldCB0aGUgcHJvdmlkZXJzIGZvciB0aGUgdGVzdCBpbmplY3Rvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0QmFzZVRlc3RQcm92aWRlcnMoKSB7XG4gIHZhciB0ZXN0SW5qZWN0b3IgPSBnZXRUZXN0SW5qZWN0b3IoKTtcbiAgdGVzdEluamVjdG9yLnBsYXRmb3JtUHJvdmlkZXJzID0gW107XG4gIHRlc3RJbmplY3Rvci5hcHBsaWNhdGlvblByb3ZpZGVycyA9IFtdO1xuICB0ZXN0SW5qZWN0b3IucmVzZXQoKTtcbn1cblxuLyoqXG4gKiBBbGxvd3MgaW5qZWN0aW5nIGRlcGVuZGVuY2llcyBpbiBgYmVmb3JlRWFjaCgpYCBhbmQgYGl0KClgLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBgXG4gKiBiZWZvcmVFYWNoKGluamVjdChbRGVwZW5kZW5jeSwgQUNsYXNzXSwgKGRlcCwgb2JqZWN0KSA9PiB7XG4gKiAgIC8vIHNvbWUgY29kZSB0aGF0IHVzZXMgYGRlcGAgYW5kIGBvYmplY3RgXG4gKiAgIC8vIC4uLlxuICogfSkpO1xuICpcbiAqIGl0KCcuLi4nLCBpbmplY3QoW0FDbGFzc10sIChvYmplY3QpID0+IHtcbiAqICAgb2JqZWN0LmRvU29tZXRoaW5nKCk7XG4gKiAgIGV4cGVjdCguLi4pO1xuICogfSlcbiAqIGBgYFxuICpcbiAqIE5vdGVzOlxuICogLSBpbmplY3QgaXMgY3VycmVudGx5IGEgZnVuY3Rpb24gYmVjYXVzZSBvZiBzb21lIFRyYWNldXIgbGltaXRhdGlvbiB0aGUgc3ludGF4IHNob3VsZFxuICogZXZlbnR1YWxseVxuICogICBiZWNvbWVzIGBpdCgnLi4uJywgQEluamVjdCAob2JqZWN0OiBBQ2xhc3MsIGFzeW5jOiBBc3luY1Rlc3RDb21wbGV0ZXIpID0+IHsgLi4uIH0pO2BcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB0b2tlbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbldpdGhQYXJhbVRva2Vuc31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluamVjdCh0b2tlbnM6IGFueVtdLCBmbjogRnVuY3Rpb24pOiBGdW5jdGlvbldpdGhQYXJhbVRva2VucyB7XG4gIHJldHVybiBuZXcgRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnModG9rZW5zLCBmbiwgZmFsc2UpO1xufVxuXG5leHBvcnQgY2xhc3MgSW5qZWN0U2V0dXBXcmFwcGVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcHJvdmlkZXJzOiAoKSA9PiBhbnkpIHt9XG5cbiAgaW5qZWN0KHRva2VuczogYW55W10sIGZuOiBGdW5jdGlvbik6IEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zIHtcbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zKHRva2VucywgZm4sIGZhbHNlLCB0aGlzLl9wcm92aWRlcnMpO1xuICB9XG5cbiAgLyoqIEBEZXByZWNhdGVkIHt1c2UgYXN5bmMod2l0aFByb3ZpZGVycygpLmluamVjdCgpKX0gKi9cbiAgaW5qZWN0QXN5bmModG9rZW5zOiBhbnlbXSwgZm46IEZ1bmN0aW9uKTogRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMge1xuICAgIHJldHVybiBuZXcgRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnModG9rZW5zLCBmbiwgdHJ1ZSwgdGhpcy5fcHJvdmlkZXJzKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aFByb3ZpZGVycyhwcm92aWRlcnM6ICgpID0+IGFueSkge1xuICByZXR1cm4gbmV3IEluamVjdFNldHVwV3JhcHBlcihwcm92aWRlcnMpO1xufVxuXG4vKipcbiAqIEBEZXByZWNhdGVkIHt1c2UgYXN5bmMoaW5qZWN0KCkpfVxuICpcbiAqIEFsbG93cyBpbmplY3RpbmcgZGVwZW5kZW5jaWVzIGluIGBiZWZvcmVFYWNoKClgIGFuZCBgaXQoKWAuIFRoZSB0ZXN0IG11c3QgcmV0dXJuXG4gKiBhIHByb21pc2Ugd2hpY2ggd2lsbCByZXNvbHZlIHdoZW4gYWxsIGFzeW5jaHJvbm91cyBhY3Rpdml0eSBpcyBjb21wbGV0ZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYFxuICogaXQoJy4uLicsIGluamVjdEFzeW5jKFtBQ2xhc3NdLCAob2JqZWN0KSA9PiB7XG4gKiAgIHJldHVybiBvYmplY3QuZG9Tb21ldGhpbmcoKS50aGVuKCgpID0+IHtcbiAqICAgICBleHBlY3QoLi4uKTtcbiAqICAgfSk7XG4gKiB9KVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdG9rZW5zXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnN9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3RBc3luYyh0b2tlbnM6IGFueVtdLCBmbjogRnVuY3Rpb24pOiBGdW5jdGlvbldpdGhQYXJhbVRva2VucyB7XG4gIHJldHVybiBuZXcgRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnModG9rZW5zLCBmbiwgdHJ1ZSk7XG59XG5cbi8qKlxuICogV3JhcHMgYSB0ZXN0IGZ1bmN0aW9uIGluIGFuIGFzeW5jaHJvbm91cyB0ZXN0IHpvbmUuIFRoZSB0ZXN0IHdpbGwgYXV0b21hdGljYWxseVxuICogY29tcGxldGUgd2hlbiBhbGwgYXN5bmNocm9ub3VzIGNhbGxzIHdpdGhpbiB0aGlzIHpvbmUgYXJlIGRvbmUuIENhbiBiZSB1c2VkXG4gKiB0byB3cmFwIGFuIHtAbGluayBpbmplY3R9IGNhbGwuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIGl0KCcuLi4nLCBhc3luYyhpbmplY3QoW0FDbGFzc10sIChvYmplY3QpID0+IHtcbiAqICAgb2JqZWN0LmRvU29tZXRoaW5nLnRoZW4oKCkgPT4ge1xuICogICAgIGV4cGVjdCguLi4pO1xuICogICB9KVxuICogfSk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzeW5jKGZuOiBGdW5jdGlvbiB8IEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zKTogRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMge1xuICBpZiAoZm4gaW5zdGFuY2VvZiBGdW5jdGlvbldpdGhQYXJhbVRva2Vucykge1xuICAgIGZuLmlzQXN5bmMgPSB0cnVlO1xuICAgIHJldHVybiBmbjtcbiAgfSBlbHNlIGlmIChmbiBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbldpdGhQYXJhbVRva2VucyhbXSwgZm4sIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKCdhcmd1bWVudCB0byBhc3luYyBtdXN0IGJlIGEgZnVuY3Rpb24gb3IgaW5qZWN0KDxGdW5jdGlvbj4pJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZW1wdHlBcnJheSgpOiBBcnJheTxhbnk+IHtcbiAgcmV0dXJuIFtdO1xufVxuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF90b2tlbnM6IGFueVtdLCBwdWJsaWMgZm46IEZ1bmN0aW9uLCBwdWJsaWMgaXNBc3luYzogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHVibGljIGFkZGl0aW9uYWxQcm92aWRlcnM6ICgpID0+IGFueSA9IGVtcHR5QXJyYXkpIHt9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBleGVjdXRlZCBmdW5jdGlvbi5cbiAgICovXG4gIGV4ZWN1dGUoaW5qZWN0b3I6IFJlZmxlY3RpdmVJbmplY3Rvcik6IGFueSB7XG4gICAgdmFyIHBhcmFtcyA9IHRoaXMuX3Rva2Vucy5tYXAodCA9PiBpbmplY3Rvci5nZXQodCkpO1xuICAgIHJldHVybiBGdW5jdGlvbldyYXBwZXIuYXBwbHkodGhpcy5mbiwgcGFyYW1zKTtcbiAgfVxuXG4gIGhhc1Rva2VuKHRva2VuOiBhbnkpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3Rva2Vucy5pbmRleE9mKHRva2VuKSA+IC0xOyB9XG59XG4iXX0=