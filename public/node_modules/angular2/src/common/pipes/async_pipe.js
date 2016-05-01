'use strict';"use strict";
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
var async_1 = require('angular2/src/facade/async');
var core_1 = require('angular2/core');
var invalid_pipe_argument_exception_1 = require('./invalid_pipe_argument_exception');
var ObservableStrategy = (function () {
    function ObservableStrategy() {
    }
    ObservableStrategy.prototype.createSubscription = function (async, updateLatestValue) {
        return async_1.ObservableWrapper.subscribe(async, updateLatestValue, function (e) { throw e; });
    };
    ObservableStrategy.prototype.dispose = function (subscription) { async_1.ObservableWrapper.dispose(subscription); };
    ObservableStrategy.prototype.onDestroy = function (subscription) { async_1.ObservableWrapper.dispose(subscription); };
    return ObservableStrategy;
}());
var PromiseStrategy = (function () {
    function PromiseStrategy() {
    }
    PromiseStrategy.prototype.createSubscription = function (async, updateLatestValue) {
        return async.then(updateLatestValue);
    };
    PromiseStrategy.prototype.dispose = function (subscription) { };
    PromiseStrategy.prototype.onDestroy = function (subscription) { };
    return PromiseStrategy;
}());
var _promiseStrategy = new PromiseStrategy();
var _observableStrategy = new ObservableStrategy();
var __unused; // avoid unused import when Promise union types are erased
/**
 * The `async` pipe subscribes to an Observable or Promise and returns the latest value it has
 * emitted.
 * When a new value is emitted, the `async` pipe marks the component to be checked for changes.
 *
 * ### Example
 *
 * This example binds a `Promise` to the view. Clicking the `Resolve` button resolves the
 * promise.
 *
 * {@example core/pipes/ts/async_pipe/async_pipe_example.ts region='AsyncPipe'}
 *
 * It's also possible to use `async` with Observables. The example below binds the `time` Observable
 * to the view. Every 500ms, the `time` Observable updates the view with the current time.
 *
 * ```typescript
 * ```
 */
var AsyncPipe = (function () {
    function AsyncPipe(_ref) {
        /** @internal */
        this._latestValue = null;
        /** @internal */
        this._latestReturnedValue = null;
        /** @internal */
        this._subscription = null;
        /** @internal */
        this._obj = null;
        this._strategy = null;
        this._ref = _ref;
    }
    AsyncPipe.prototype.ngOnDestroy = function () {
        if (lang_1.isPresent(this._subscription)) {
            this._dispose();
        }
    };
    AsyncPipe.prototype.transform = function (obj) {
        if (lang_1.isBlank(this._obj)) {
            if (lang_1.isPresent(obj)) {
                this._subscribe(obj);
            }
            this._latestReturnedValue = this._latestValue;
            return this._latestValue;
        }
        if (obj !== this._obj) {
            this._dispose();
            return this.transform(obj);
        }
        if (this._latestValue === this._latestReturnedValue) {
            return this._latestReturnedValue;
        }
        else {
            this._latestReturnedValue = this._latestValue;
            return core_1.WrappedValue.wrap(this._latestValue);
        }
    };
    /** @internal */
    AsyncPipe.prototype._subscribe = function (obj) {
        var _this = this;
        this._obj = obj;
        this._strategy = this._selectStrategy(obj);
        this._subscription = this._strategy.createSubscription(obj, function (value) { return _this._updateLatestValue(obj, value); });
    };
    /** @internal */
    AsyncPipe.prototype._selectStrategy = function (obj) {
        if (lang_1.isPromise(obj)) {
            return _promiseStrategy;
        }
        else if (async_1.ObservableWrapper.isObservable(obj)) {
            return _observableStrategy;
        }
        else {
            throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(AsyncPipe, obj);
        }
    };
    /** @internal */
    AsyncPipe.prototype._dispose = function () {
        this._strategy.dispose(this._subscription);
        this._latestValue = null;
        this._latestReturnedValue = null;
        this._subscription = null;
        this._obj = null;
    };
    /** @internal */
    AsyncPipe.prototype._updateLatestValue = function (async, value) {
        if (async === this._obj) {
            this._latestValue = value;
            this._ref.markForCheck();
        }
    };
    AsyncPipe = __decorate([
        // avoid unused import when Promise union types are erased
        core_1.Pipe({ name: 'async', pure: false }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
    ], AsyncPipe);
    return AsyncPipe;
}());
exports.AsyncPipe = AsyncPipe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmNfcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtNG5vM1pRdk8udG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vcGlwZXMvYXN5bmNfcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQW1ELDBCQUEwQixDQUFDLENBQUE7QUFDOUUsc0JBQTBELDJCQUEyQixDQUFDLENBQUE7QUFDdEYscUJBQTJFLGVBQWUsQ0FBQyxDQUFBO0FBRTNGLGdEQUEyQyxtQ0FBbUMsQ0FBQyxDQUFBO0FBRS9FO0lBQUE7SUFRQSxDQUFDO0lBUEMsK0NBQWtCLEdBQWxCLFVBQW1CLEtBQVUsRUFBRSxpQkFBc0I7UUFDbkQsTUFBTSxDQUFDLHlCQUFpQixDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsVUFBQSxDQUFDLElBQU0sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRixDQUFDO0lBRUQsb0NBQU8sR0FBUCxVQUFRLFlBQWlCLElBQVUseUJBQWlCLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU3RSxzQ0FBUyxHQUFULFVBQVUsWUFBaUIsSUFBVSx5QkFBaUIsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pGLHlCQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFFRDtJQUFBO0lBUUEsQ0FBQztJQVBDLDRDQUFrQixHQUFsQixVQUFtQixLQUFtQixFQUFFLGlCQUFrQztRQUN4RSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxpQ0FBTyxHQUFQLFVBQVEsWUFBaUIsSUFBUyxDQUFDO0lBRW5DLG1DQUFTLEdBQVQsVUFBVSxZQUFpQixJQUFTLENBQUM7SUFDdkMsc0JBQUM7QUFBRCxDQUFD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QyxNQUFNLENBQUMsbUJBQW1CLENBQUM7UUFDN0IsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxJQUFJLDhEQUE0QixDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN6RCxDQUFDO0lBQ0gsQ0FBQztJQUVELGdCQUFnQjtJQUNoQiw0QkFBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7UUFDakMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVELGdCQUFnQjtJQUNoQixzQ0FBa0IsR0FBbEIsVUFBbUIsS0FBVSxFQUFFLEtBQWE7UUFDMUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDM0IsQ0FBQztJQUNILENBQUM7SUEvRUg7UUFwQjZCLDBEQUEwRDtRQW9CdEYsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDbEMsaUJBQVUsRUFBRTs7aUJBQUE7SUErRWIsZ0JBQUM7QUFBRCxDQUFDLEFBOUVELElBOEVDO0FBOUVZLGlCQUFTLFlBOEVyQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0JsYW5rLCBpc1ByZXNlbnQsIGlzUHJvbWlzZSwgQ09OU1R9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge09ic2VydmFibGVXcmFwcGVyLCBPYnNlcnZhYmxlLCBFdmVudEVtaXR0ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmMnO1xuaW1wb3J0IHtQaXBlLCBJbmplY3RhYmxlLCBDaGFuZ2VEZXRlY3RvclJlZiwgT25EZXN0cm95LCBXcmFwcGVkVmFsdWV9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuXG5pbXBvcnQge0ludmFsaWRQaXBlQXJndW1lbnRFeGNlcHRpb259IGZyb20gJy4vaW52YWxpZF9waXBlX2FyZ3VtZW50X2V4Y2VwdGlvbic7XG5cbmNsYXNzIE9ic2VydmFibGVTdHJhdGVneSB7XG4gIGNyZWF0ZVN1YnNjcmlwdGlvbihhc3luYzogYW55LCB1cGRhdGVMYXRlc3RWYWx1ZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gT2JzZXJ2YWJsZVdyYXBwZXIuc3Vic2NyaWJlKGFzeW5jLCB1cGRhdGVMYXRlc3RWYWx1ZSwgZSA9PiB7IHRocm93IGU7IH0pO1xuICB9XG5cbiAgZGlzcG9zZShzdWJzY3JpcHRpb246IGFueSk6IHZvaWQgeyBPYnNlcnZhYmxlV3JhcHBlci5kaXNwb3NlKHN1YnNjcmlwdGlvbik7IH1cblxuICBvbkRlc3Ryb3koc3Vic2NyaXB0aW9uOiBhbnkpOiB2b2lkIHsgT2JzZXJ2YWJsZVdyYXBwZXIuZGlzcG9zZShzdWJzY3JpcHRpb24pOyB9XG59XG5cbmNsYXNzIFByb21pc2VTdHJhdGVneSB7XG4gIGNyZWF0ZVN1YnNjcmlwdGlvbihhc3luYzogUHJvbWlzZTxhbnk+LCB1cGRhdGVMYXRlc3RWYWx1ZTogKHY6IGFueSkgPT4gYW55KTogYW55IHtcbiAgICByZXR1cm4gYXN5bmMudGhlbih1cGRhdGVMYXRlc3RWYWx1ZSk7XG4gIH1cblxuICBkaXNwb3NlKHN1YnNjcmlwdGlvbjogYW55KTogdm9pZCB7fVxuXG4gIG9uRGVzdHJveShzdWJzY3JpcHRpb246IGFueSk6IHZvaWQge31cbn1cblxudmFyIF9wcm9taXNlU3RyYXRlZ3kgPSBuZXcgUHJvbWlzZVN0cmF0ZWd5KCk7XG52YXIgX29ic2VydmFibGVTdHJhdGVneSA9IG5ldyBPYnNlcnZhYmxlU3RyYXRlZ3koKTtcbnZhciBfX3VudXNlZDogUHJvbWlzZTxhbnk+OyAgLy8gYXZvaWQgdW51c2VkIGltcG9ydCB3aGVuIFByb21pc2UgdW5pb24gdHlwZXMgYXJlIGVyYXNlZFxuXG4vKipcbiAqIFRoZSBgYXN5bmNgIHBpcGUgc3Vic2NyaWJlcyB0byBhbiBPYnNlcnZhYmxlIG9yIFByb21pc2UgYW5kIHJldHVybnMgdGhlIGxhdGVzdCB2YWx1ZSBpdCBoYXNcbiAqIGVtaXR0ZWQuXG4gKiBXaGVuIGEgbmV3IHZhbHVlIGlzIGVtaXR0ZWQsIHRoZSBgYXN5bmNgIHBpcGUgbWFya3MgdGhlIGNvbXBvbmVudCB0byBiZSBjaGVja2VkIGZvciBjaGFuZ2VzLlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogVGhpcyBleGFtcGxlIGJpbmRzIGEgYFByb21pc2VgIHRvIHRoZSB2aWV3LiBDbGlja2luZyB0aGUgYFJlc29sdmVgIGJ1dHRvbiByZXNvbHZlcyB0aGVcbiAqIHByb21pc2UuXG4gKlxuICoge0BleGFtcGxlIGNvcmUvcGlwZXMvdHMvYXN5bmNfcGlwZS9hc3luY19waXBlX2V4YW1wbGUudHMgcmVnaW9uPSdBc3luY1BpcGUnfVxuICpcbiAqIEl0J3MgYWxzbyBwb3NzaWJsZSB0byB1c2UgYGFzeW5jYCB3aXRoIE9ic2VydmFibGVzLiBUaGUgZXhhbXBsZSBiZWxvdyBiaW5kcyB0aGUgYHRpbWVgIE9ic2VydmFibGVcbiAqIHRvIHRoZSB2aWV3LiBFdmVyeSA1MDBtcywgdGhlIGB0aW1lYCBPYnNlcnZhYmxlIHVwZGF0ZXMgdGhlIHZpZXcgd2l0aCB0aGUgY3VycmVudCB0aW1lLlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGBgYFxuICovXG5AUGlwZSh7bmFtZTogJ2FzeW5jJywgcHVyZTogZmFsc2V9KVxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEFzeW5jUGlwZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2xhdGVzdFZhbHVlOiBPYmplY3QgPSBudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIF9sYXRlc3RSZXR1cm5lZFZhbHVlOiBPYmplY3QgPSBudWxsO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N1YnNjcmlwdGlvbjogT2JqZWN0ID0gbnVsbDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfb2JqOiBPYnNlcnZhYmxlPGFueT58IFByb21pc2U8YW55PnwgRXZlbnRFbWl0dGVyPGFueT4gPSBudWxsO1xuICBwcml2YXRlIF9zdHJhdGVneTogYW55ID0gbnVsbDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBwdWJsaWMgX3JlZjogQ2hhbmdlRGV0ZWN0b3JSZWY7XG4gIGNvbnN0cnVjdG9yKF9yZWY6IENoYW5nZURldGVjdG9yUmVmKSB7IHRoaXMuX3JlZiA9IF9yZWY7IH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuX3N1YnNjcmlwdGlvbikpIHtcbiAgICAgIHRoaXMuX2Rpc3Bvc2UoKTtcbiAgICB9XG4gIH1cblxuICB0cmFuc2Zvcm0ob2JqOiBPYnNlcnZhYmxlPGFueT58IFByb21pc2U8YW55PnwgRXZlbnRFbWl0dGVyPGFueT4pOiBhbnkge1xuICAgIGlmIChpc0JsYW5rKHRoaXMuX29iaikpIHtcbiAgICAgIGlmIChpc1ByZXNlbnQob2JqKSkge1xuICAgICAgICB0aGlzLl9zdWJzY3JpYmUob2JqKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2xhdGVzdFJldHVybmVkVmFsdWUgPSB0aGlzLl9sYXRlc3RWYWx1ZTtcbiAgICAgIHJldHVybiB0aGlzLl9sYXRlc3RWYWx1ZTtcbiAgICB9XG5cbiAgICBpZiAob2JqICE9PSB0aGlzLl9vYmopIHtcbiAgICAgIHRoaXMuX2Rpc3Bvc2UoKTtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybShvYmopO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9sYXRlc3RWYWx1ZSA9PT0gdGhpcy5fbGF0ZXN0UmV0dXJuZWRWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2xhdGVzdFJldHVybmVkVmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2xhdGVzdFJldHVybmVkVmFsdWUgPSB0aGlzLl9sYXRlc3RWYWx1ZTtcbiAgICAgIHJldHVybiBXcmFwcGVkVmFsdWUud3JhcCh0aGlzLl9sYXRlc3RWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3Vic2NyaWJlKG9iajogT2JzZXJ2YWJsZTxhbnk+fCBQcm9taXNlPGFueT58IEV2ZW50RW1pdHRlcjxhbnk+KTogdm9pZCB7XG4gICAgdGhpcy5fb2JqID0gb2JqO1xuICAgIHRoaXMuX3N0cmF0ZWd5ID0gdGhpcy5fc2VsZWN0U3RyYXRlZ3kob2JqKTtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb24gPSB0aGlzLl9zdHJhdGVneS5jcmVhdGVTdWJzY3JpcHRpb24oXG4gICAgICAgIG9iaiwgKHZhbHVlOiBPYmplY3QpID0+IHRoaXMuX3VwZGF0ZUxhdGVzdFZhbHVlKG9iaiwgdmFsdWUpKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3NlbGVjdFN0cmF0ZWd5KG9iajogT2JzZXJ2YWJsZTxhbnk+fCBQcm9taXNlPGFueT58IEV2ZW50RW1pdHRlcjxhbnk+KTogYW55IHtcbiAgICBpZiAoaXNQcm9taXNlKG9iaikpIHtcbiAgICAgIHJldHVybiBfcHJvbWlzZVN0cmF0ZWd5O1xuICAgIH0gZWxzZSBpZiAoT2JzZXJ2YWJsZVdyYXBwZXIuaXNPYnNlcnZhYmxlKG9iaikpIHtcbiAgICAgIHJldHVybiBfb2JzZXJ2YWJsZVN0cmF0ZWd5O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZFBpcGVBcmd1bWVudEV4Y2VwdGlvbihBc3luY1BpcGUsIG9iaik7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZGlzcG9zZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9zdHJhdGVneS5kaXNwb3NlKHRoaXMuX3N1YnNjcmlwdGlvbik7XG4gICAgdGhpcy5fbGF0ZXN0VmFsdWUgPSBudWxsO1xuICAgIHRoaXMuX2xhdGVzdFJldHVybmVkVmFsdWUgPSBudWxsO1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fb2JqID0gbnVsbDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VwZGF0ZUxhdGVzdFZhbHVlKGFzeW5jOiBhbnksIHZhbHVlOiBPYmplY3QpIHtcbiAgICBpZiAoYXN5bmMgPT09IHRoaXMuX29iaikge1xuICAgICAgdGhpcy5fbGF0ZXN0VmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX3JlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==