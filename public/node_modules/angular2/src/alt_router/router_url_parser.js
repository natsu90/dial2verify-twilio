'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var segments_1 = require('./segments');
var exceptions_1 = require('angular2/src/facade/exceptions');
var RouterUrlParser = (function () {
    function RouterUrlParser() {
    }
    return RouterUrlParser;
}());
exports.RouterUrlParser = RouterUrlParser;
var DefaultRouterUrlParser = (function (_super) {
    __extends(DefaultRouterUrlParser, _super);
    function DefaultRouterUrlParser() {
        _super.apply(this, arguments);
    }
    DefaultRouterUrlParser.prototype.parse = function (url) {
        if (url.length === 0) {
            throw new exceptions_1.BaseException("Invalid url '" + url + "'");
        }
        return new segments_1.Tree(this._parseNodes(url));
    };
    DefaultRouterUrlParser.prototype._parseNodes = function (url) {
        var index = url.indexOf("/", 1);
        var children;
        var currentUrl;
        if (index > -1) {
            children = this._parseNodes(url.substring(index + 1));
            currentUrl = url.substring(0, index);
        }
        else {
            children = [];
            currentUrl = url;
        }
        return [new segments_1.UrlSegment(currentUrl, {}, "")].concat(children);
    };
    return DefaultRouterUrlParser;
}(RouterUrlParser));
exports.DefaultRouterUrlParser = DefaultRouterUrlParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3VybF9wYXJzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTRubzNaUXZPLnRtcC9hbmd1bGFyMi9zcmMvYWx0X3JvdXRlci9yb3V0ZXJfdXJsX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5QkFBK0IsWUFBWSxDQUFDLENBQUE7QUFDNUMsMkJBQTRCLGdDQUFnQyxDQUFDLENBQUE7QUFFN0Q7SUFBQTtJQUF1RixDQUFDO0lBQUQsc0JBQUM7QUFBRCxDQUFDLEFBQXhGLElBQXdGO0FBQWxFLHVCQUFlLGtCQUFtRCxDQUFBO0FBRXhGO0lBQTRDLDBDQUFlO0lBQTNEO1FBQTRDLDhCQUFlO0lBcUIzRCxDQUFDO0lBcEJDLHNDQUFLLEdBQUwsVUFBTSxHQUFXO1FBQ2YsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sSUFBSSwwQkFBYSxDQUFDLGtCQUFnQixHQUFHLE1BQUcsQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxlQUFJLENBQWEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFTyw0Q0FBVyxHQUFuQixVQUFvQixHQUFXO1FBQzdCLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksUUFBc0IsQ0FBQztRQUMzQixJQUFJLFVBQVUsQ0FBQztRQUNmLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RELFVBQVUsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ2QsVUFBVSxHQUFHLEdBQUcsQ0FBQztRQUNuQixDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsSUFBSSxxQkFBVSxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUNILDZCQUFDO0FBQUQsQ0FBQyxBQXJCRCxDQUE0QyxlQUFlLEdBcUIxRDtBQXJCWSw4QkFBc0IseUJBcUJsQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtVcmxTZWdtZW50LCBUcmVlfSBmcm9tICcuL3NlZ21lbnRzJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJvdXRlclVybFBhcnNlciB7IGFic3RyYWN0IHBhcnNlKHVybDogc3RyaW5nKTogVHJlZTxVcmxTZWdtZW50PjsgfVxuXG5leHBvcnQgY2xhc3MgRGVmYXVsdFJvdXRlclVybFBhcnNlciBleHRlbmRzIFJvdXRlclVybFBhcnNlciB7XG4gIHBhcnNlKHVybDogc3RyaW5nKTogVHJlZTxVcmxTZWdtZW50PiB7XG4gICAgaWYgKHVybC5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBJbnZhbGlkIHVybCAnJHt1cmx9J2ApO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFRyZWU8VXJsU2VnbWVudD4odGhpcy5fcGFyc2VOb2Rlcyh1cmwpKTtcbiAgfVxuXG4gIHByaXZhdGUgX3BhcnNlTm9kZXModXJsOiBzdHJpbmcpOiBVcmxTZWdtZW50W10ge1xuICAgIGxldCBpbmRleCA9IHVybC5pbmRleE9mKFwiL1wiLCAxKTtcbiAgICBsZXQgY2hpbGRyZW46IFVybFNlZ21lbnRbXTtcbiAgICBsZXQgY3VycmVudFVybDtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgY2hpbGRyZW4gPSB0aGlzLl9wYXJzZU5vZGVzKHVybC5zdWJzdHJpbmcoaW5kZXggKyAxKSk7XG4gICAgICBjdXJyZW50VXJsID0gdXJsLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoaWxkcmVuID0gW107XG4gICAgICBjdXJyZW50VXJsID0gdXJsO1xuICAgIH1cbiAgICByZXR1cm4gW25ldyBVcmxTZWdtZW50KGN1cnJlbnRVcmwsIHt9LCBcIlwiKV0uY29uY2F0KGNoaWxkcmVuKTtcbiAgfVxufSJdfQ==