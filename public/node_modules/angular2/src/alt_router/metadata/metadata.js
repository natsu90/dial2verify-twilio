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
var lang_1 = require("angular2/src/facade/lang");
var RouteMetadata = (function () {
    function RouteMetadata() {
    }
    Object.defineProperty(RouteMetadata.prototype, "path", {
        get: function () { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteMetadata.prototype, "component", {
        get: function () { },
        enumerable: true,
        configurable: true
    });
    return RouteMetadata;
}());
exports.RouteMetadata = RouteMetadata;
var Route = (function () {
    function Route(_a) {
        var _b = _a === void 0 ? {} : _a, path = _b.path, component = _b.component;
        this.path = path;
        this.component = component;
    }
    Route.prototype.toString = function () { return "@Route(" + this.path + ", " + lang_1.stringify(this.component) + ")"; };
    Route = __decorate([
        lang_1.CONST(), 
        __metadata('design:paramtypes', [Object])
    ], Route);
    return Route;
}());
exports.Route = Route;
var RoutesMetadata = (function () {
    function RoutesMetadata(routes) {
        this.routes = routes;
    }
    RoutesMetadata.prototype.toString = function () { return "@Routes(" + this.routes + ")"; };
    RoutesMetadata = __decorate([
        lang_1.CONST(), 
        __metadata('design:paramtypes', [Array])
    ], RoutesMetadata);
    return RoutesMetadata;
}());
exports.RoutesMetadata = RoutesMetadata;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTRubzNaUXZPLnRtcC9hbmd1bGFyMi9zcmMvYWx0X3JvdXRlci9tZXRhZGF0YS9tZXRhZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQXFDLDBCQUEwQixDQUFDLENBQUE7QUFFaEU7SUFBQTtJQUdBLENBQUM7SUFGQyxzQkFBYSwrQkFBSTthQUFqQixlQUE0Qjs7O09BQUE7SUFDNUIsc0JBQWEsb0NBQVM7YUFBdEIsZUFBK0I7OztPQUFBO0lBQ2pDLG9CQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFIcUIscUJBQWEsZ0JBR2xDLENBQUE7QUFHRDtJQUdFLGVBQVksRUFBeUQ7WUFBekQsNEJBQXlELEVBQXhELGNBQUksRUFBRSx3QkFBUztRQUMxQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBQ0Qsd0JBQVEsR0FBUixjQUFxQixNQUFNLENBQUMsWUFBVSxJQUFJLENBQUMsSUFBSSxVQUFLLGdCQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFHLENBQUMsQ0FBQyxDQUFDO0lBUnJGO1FBQUMsWUFBSyxFQUFFOzthQUFBO0lBU1IsWUFBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBUlksYUFBSyxRQVFqQixDQUFBO0FBR0Q7SUFDRSx3QkFBbUIsTUFBdUI7UUFBdkIsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7SUFBRyxDQUFDO0lBQzlDLGlDQUFRLEdBQVIsY0FBcUIsTUFBTSxDQUFDLGFBQVcsSUFBSSxDQUFDLE1BQU0sTUFBRyxDQUFDLENBQUMsQ0FBQztJQUgxRDtRQUFDLFlBQUssRUFBRTs7c0JBQUE7SUFJUixxQkFBQztBQUFELENBQUMsQUFIRCxJQUdDO0FBSFksc0JBQWMsaUJBRzFCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NPTlNULCBUeXBlLCBzdHJpbmdpZnl9IGZyb20gXCJhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmdcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJvdXRlTWV0YWRhdGEge1xuICBhYnN0cmFjdCBnZXQgcGF0aCgpOiBzdHJpbmc7XG4gIGFic3RyYWN0IGdldCBjb21wb25lbnQoKTogVHlwZTtcbn1cblxuQENPTlNUKClcbmV4cG9ydCBjbGFzcyBSb3V0ZSBpbXBsZW1lbnRzIFJvdXRlTWV0YWRhdGEge1xuICBwYXRoOiBzdHJpbmc7XG4gIGNvbXBvbmVudDogVHlwZTtcbiAgY29uc3RydWN0b3Ioe3BhdGgsIGNvbXBvbmVudH06IHtwYXRoPzogc3RyaW5nLCBjb21wb25lbnQ/OiBUeXBlfSA9IHt9KSB7XG4gICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB0aGlzLmNvbXBvbmVudCA9IGNvbXBvbmVudDtcbiAgfVxuICB0b1N0cmluZygpOiBzdHJpbmcgeyByZXR1cm4gYEBSb3V0ZSgke3RoaXMucGF0aH0sICR7c3RyaW5naWZ5KHRoaXMuY29tcG9uZW50KX0pYDsgfVxufVxuXG5AQ09OU1QoKVxuZXhwb3J0IGNsYXNzIFJvdXRlc01ldGFkYXRhIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJvdXRlczogUm91dGVNZXRhZGF0YVtdKSB7fVxuICB0b1N0cmluZygpOiBzdHJpbmcgeyByZXR1cm4gYEBSb3V0ZXMoJHt0aGlzLnJvdXRlc30pYDsgfVxufSJdfQ==