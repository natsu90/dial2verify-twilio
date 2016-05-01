'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lang_1 = require('angular2/src/facade/lang');
var view_1 = require('angular2/src/core/linker/view');
var exceptions_1 = require('angular2/src/facade/exceptions');
var InterpretiveAppViewInstanceFactory = (function () {
    function InterpretiveAppViewInstanceFactory() {
    }
    InterpretiveAppViewInstanceFactory.prototype.createInstance = function (superClass, clazz, args, props, getters, methods) {
        if (superClass === view_1.AppView) {
            return new _InterpretiveAppView(args, props, getters, methods);
        }
        throw new exceptions_1.BaseException("Can't instantiate class " + superClass + " in interpretative mode");
    };
    return InterpretiveAppViewInstanceFactory;
}());
exports.InterpretiveAppViewInstanceFactory = InterpretiveAppViewInstanceFactory;
var _InterpretiveAppView = (function (_super) {
    __extends(_InterpretiveAppView, _super);
    function _InterpretiveAppView(args, props, getters, methods) {
        _super.call(this, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
        this.props = props;
        this.getters = getters;
        this.methods = methods;
    }
    _InterpretiveAppView.prototype.createInternal = function (rootSelector) {
        var m = this.methods.get('createInternal');
        if (lang_1.isPresent(m)) {
            return m(rootSelector);
        }
        else {
            return _super.prototype.createInternal.call(this, rootSelector);
        }
    };
    _InterpretiveAppView.prototype.injectorGetInternal = function (token, nodeIndex, notFoundResult) {
        var m = this.methods.get('injectorGetInternal');
        if (lang_1.isPresent(m)) {
            return m(token, nodeIndex, notFoundResult);
        }
        else {
            return _super.prototype.injectorGet.call(this, token, nodeIndex, notFoundResult);
        }
    };
    _InterpretiveAppView.prototype.destroyInternal = function () {
        var m = this.methods.get('destroyInternal');
        if (lang_1.isPresent(m)) {
            return m();
        }
        else {
            return _super.prototype.destroyInternal.call(this);
        }
    };
    _InterpretiveAppView.prototype.dirtyParentQueriesInternal = function () {
        var m = this.methods.get('dirtyParentQueriesInternal');
        if (lang_1.isPresent(m)) {
            return m();
        }
        else {
            return _super.prototype.dirtyParentQueriesInternal.call(this);
        }
    };
    _InterpretiveAppView.prototype.detectChangesInternal = function (throwOnChange) {
        var m = this.methods.get('detectChangesInternal');
        if (lang_1.isPresent(m)) {
            return m(throwOnChange);
        }
        else {
            return _super.prototype.detectChangesInternal.call(this, throwOnChange);
        }
    };
    return _InterpretiveAppView;
}(view_1.AppView));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJwcmV0aXZlX3ZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTRubzNaUXZPLnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvb3V0cHV0L2ludGVycHJldGl2ZV92aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFCQUF3QiwwQkFBMEIsQ0FBQyxDQUFBO0FBQ25ELHFCQUFzQiwrQkFBK0IsQ0FBQyxDQUFBO0FBRXRELDJCQUE0QixnQ0FBZ0MsQ0FBQyxDQUFBO0FBRzdEO0lBQUE7SUFRQSxDQUFDO0lBUEMsMkRBQWMsR0FBZCxVQUFlLFVBQWUsRUFBRSxLQUFVLEVBQUUsSUFBVyxFQUFFLEtBQXVCLEVBQ2pFLE9BQThCLEVBQUUsT0FBOEI7UUFDM0UsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLGNBQU8sQ0FBQyxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFDLElBQUksb0JBQW9CLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDakUsQ0FBQztRQUNELE1BQU0sSUFBSSwwQkFBYSxDQUFDLDZCQUEyQixVQUFVLDRCQUF5QixDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUNILHlDQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFSWSwwQ0FBa0MscUNBUTlDLENBQUE7QUFFRDtJQUFtQyx3Q0FBWTtJQUM3Qyw4QkFBWSxJQUFXLEVBQVMsS0FBdUIsRUFBUyxPQUE4QixFQUMzRSxPQUE4QjtRQUMvQyxrQkFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRnpELFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBdUI7UUFDM0UsWUFBTyxHQUFQLE9BQU8sQ0FBdUI7SUFFakQsQ0FBQztJQUNELDZDQUFjLEdBQWQsVUFBZSxZQUEwQjtRQUN2QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxDQUFDLGdCQUFLLENBQUMsY0FBYyxZQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVDLENBQUM7SUFDSCxDQUFDO0lBQ0Qsa0RBQW1CLEdBQW5CLFVBQW9CLEtBQVUsRUFBRSxTQUFpQixFQUFFLGNBQW1CO1FBQ3BFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDaEQsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakIsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxnQkFBSyxDQUFDLFdBQVcsWUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQzdELENBQUM7SUFDSCxDQUFDO0lBQ0QsOENBQWUsR0FBZjtRQUNFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDNUMsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakIsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2IsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxDQUFDLGdCQUFLLENBQUMsZUFBZSxXQUFFLENBQUM7UUFDakMsQ0FBQztJQUNILENBQUM7SUFDRCx5REFBMEIsR0FBMUI7UUFDRSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBQ3ZELEVBQUUsQ0FBQyxDQUFDLGdCQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNiLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxnQkFBSyxDQUFDLDBCQUEwQixXQUFFLENBQUM7UUFDNUMsQ0FBQztJQUNILENBQUM7SUFDRCxvREFBcUIsR0FBckIsVUFBc0IsYUFBc0I7UUFDMUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNsRCxFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQixNQUFNLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxnQkFBSyxDQUFDLHFCQUFxQixZQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BELENBQUM7SUFDSCxDQUFDO0lBQ0gsMkJBQUM7QUFBRCxDQUFDLEFBN0NELENBQW1DLGNBQU8sR0E2Q3pDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1ByZXNlbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0FwcFZpZXd9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci92aWV3JztcbmltcG9ydCB7QXBwRWxlbWVudH0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL2VsZW1lbnQnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtJbnN0YW5jZUZhY3RvcnksIER5bmFtaWNJbnN0YW5jZX0gZnJvbSAnLi9vdXRwdXRfaW50ZXJwcmV0ZXInO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJwcmV0aXZlQXBwVmlld0luc3RhbmNlRmFjdG9yeSBpbXBsZW1lbnRzIEluc3RhbmNlRmFjdG9yeSB7XG4gIGNyZWF0ZUluc3RhbmNlKHN1cGVyQ2xhc3M6IGFueSwgY2xheno6IGFueSwgYXJnczogYW55W10sIHByb3BzOiBNYXA8c3RyaW5nLCBhbnk+LFxuICAgICAgICAgICAgICAgICBnZXR0ZXJzOiBNYXA8c3RyaW5nLCBGdW5jdGlvbj4sIG1ldGhvZHM6IE1hcDxzdHJpbmcsIEZ1bmN0aW9uPik6IGFueSB7XG4gICAgaWYgKHN1cGVyQ2xhc3MgPT09IEFwcFZpZXcpIHtcbiAgICAgIHJldHVybiBuZXcgX0ludGVycHJldGl2ZUFwcFZpZXcoYXJncywgcHJvcHMsIGdldHRlcnMsIG1ldGhvZHMpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgQ2FuJ3QgaW5zdGFudGlhdGUgY2xhc3MgJHtzdXBlckNsYXNzfSBpbiBpbnRlcnByZXRhdGl2ZSBtb2RlYCk7XG4gIH1cbn1cblxuY2xhc3MgX0ludGVycHJldGl2ZUFwcFZpZXcgZXh0ZW5kcyBBcHBWaWV3PGFueT4gaW1wbGVtZW50cyBEeW5hbWljSW5zdGFuY2Uge1xuICBjb25zdHJ1Y3RvcihhcmdzOiBhbnlbXSwgcHVibGljIHByb3BzOiBNYXA8c3RyaW5nLCBhbnk+LCBwdWJsaWMgZ2V0dGVyczogTWFwPHN0cmluZywgRnVuY3Rpb24+LFxuICAgICAgICAgICAgICBwdWJsaWMgbWV0aG9kczogTWFwPHN0cmluZywgRnVuY3Rpb24+KSB7XG4gICAgc3VwZXIoYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSwgYXJnc1s0XSwgYXJnc1s1XSwgYXJnc1s2XSwgYXJnc1s3XSwgYXJnc1s4XSk7XG4gIH1cbiAgY3JlYXRlSW50ZXJuYWwocm9vdFNlbGVjdG9yOiBzdHJpbmcgfCBhbnkpOiBBcHBFbGVtZW50IHtcbiAgICB2YXIgbSA9IHRoaXMubWV0aG9kcy5nZXQoJ2NyZWF0ZUludGVybmFsJyk7XG4gICAgaWYgKGlzUHJlc2VudChtKSkge1xuICAgICAgcmV0dXJuIG0ocm9vdFNlbGVjdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN1cGVyLmNyZWF0ZUludGVybmFsKHJvb3RTZWxlY3Rvcik7XG4gICAgfVxuICB9XG4gIGluamVjdG9yR2V0SW50ZXJuYWwodG9rZW46IGFueSwgbm9kZUluZGV4OiBudW1iZXIsIG5vdEZvdW5kUmVzdWx0OiBhbnkpOiBhbnkge1xuICAgIHZhciBtID0gdGhpcy5tZXRob2RzLmdldCgnaW5qZWN0b3JHZXRJbnRlcm5hbCcpO1xuICAgIGlmIChpc1ByZXNlbnQobSkpIHtcbiAgICAgIHJldHVybiBtKHRva2VuLCBub2RlSW5kZXgsIG5vdEZvdW5kUmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN1cGVyLmluamVjdG9yR2V0KHRva2VuLCBub2RlSW5kZXgsIG5vdEZvdW5kUmVzdWx0KTtcbiAgICB9XG4gIH1cbiAgZGVzdHJveUludGVybmFsKCk6IHZvaWQge1xuICAgIHZhciBtID0gdGhpcy5tZXRob2RzLmdldCgnZGVzdHJveUludGVybmFsJyk7XG4gICAgaWYgKGlzUHJlc2VudChtKSkge1xuICAgICAgcmV0dXJuIG0oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN1cGVyLmRlc3Ryb3lJbnRlcm5hbCgpO1xuICAgIH1cbiAgfVxuICBkaXJ0eVBhcmVudFF1ZXJpZXNJbnRlcm5hbCgpOiB2b2lkIHtcbiAgICB2YXIgbSA9IHRoaXMubWV0aG9kcy5nZXQoJ2RpcnR5UGFyZW50UXVlcmllc0ludGVybmFsJyk7XG4gICAgaWYgKGlzUHJlc2VudChtKSkge1xuICAgICAgcmV0dXJuIG0oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN1cGVyLmRpcnR5UGFyZW50UXVlcmllc0ludGVybmFsKCk7XG4gICAgfVxuICB9XG4gIGRldGVjdENoYW5nZXNJbnRlcm5hbCh0aHJvd09uQ2hhbmdlOiBib29sZWFuKTogdm9pZCB7XG4gICAgdmFyIG0gPSB0aGlzLm1ldGhvZHMuZ2V0KCdkZXRlY3RDaGFuZ2VzSW50ZXJuYWwnKTtcbiAgICBpZiAoaXNQcmVzZW50KG0pKSB7XG4gICAgICByZXR1cm4gbSh0aHJvd09uQ2hhbmdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN1cGVyLmRldGVjdENoYW5nZXNJbnRlcm5hbCh0aHJvd09uQ2hhbmdlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==