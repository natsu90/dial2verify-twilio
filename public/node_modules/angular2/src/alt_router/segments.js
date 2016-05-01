'use strict';"use strict";
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var Tree = (function () {
    function Tree(_nodes) {
        this._nodes = _nodes;
    }
    Object.defineProperty(Tree.prototype, "root", {
        get: function () { return this._nodes[0]; },
        enumerable: true,
        configurable: true
    });
    Tree.prototype.parent = function (t) {
        var index = this._nodes.indexOf(t);
        return index > 0 ? this._nodes[index - 1] : null;
    };
    Tree.prototype.children = function (t) {
        var index = this._nodes.indexOf(t);
        return index > -1 && index < this._nodes.length - 1 ? [this._nodes[index + 1]] : [];
    };
    Tree.prototype.firstChild = function (t) {
        var index = this._nodes.indexOf(t);
        return index > -1 && index < this._nodes.length - 1 ? this._nodes[index + 1] : null;
    };
    Tree.prototype.pathToRoot = function (t) {
        var index = this._nodes.indexOf(t);
        return index > -1 ? this._nodes.slice(0, index + 1) : null;
    };
    return Tree;
}());
exports.Tree = Tree;
var UrlSegment = (function () {
    function UrlSegment(segment, parameters, outlet) {
        this.segment = segment;
        this.parameters = parameters;
        this.outlet = outlet;
    }
    return UrlSegment;
}());
exports.UrlSegment = UrlSegment;
var RouteSegment = (function () {
    function RouteSegment(urlSegments, parameters, outlet, type, componentFactory) {
        this.urlSegments = urlSegments;
        this.outlet = outlet;
        this._type = type;
        this._componentFactory = componentFactory;
        this._parameters = parameters;
    }
    RouteSegment.prototype.getParam = function (param) { return this._parameters[param]; };
    Object.defineProperty(RouteSegment.prototype, "type", {
        get: function () { return this._type; },
        enumerable: true,
        configurable: true
    });
    return RouteSegment;
}());
exports.RouteSegment = RouteSegment;
function equalSegments(a, b) {
    if (lang_1.isBlank(a) && !lang_1.isBlank(b))
        return false;
    if (!lang_1.isBlank(a) && lang_1.isBlank(b))
        return false;
    return a._type === b._type && collection_1.StringMapWrapper.equals(a._parameters, b._parameters);
}
exports.equalSegments = equalSegments;
function routeSegmentComponentFactory(a) {
    return a._componentFactory;
}
exports.routeSegmentComponentFactory = routeSegmentComponentFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VnbWVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTRubzNaUXZPLnRtcC9hbmd1bGFyMi9zcmMvYWx0X3JvdXRlci9zZWdtZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsMkJBQTRDLGdDQUFnQyxDQUFDLENBQUE7QUFDN0UscUJBQTRCLDBCQUEwQixDQUFDLENBQUE7QUFFdkQ7SUFDRSxjQUFvQixNQUFXO1FBQVgsV0FBTSxHQUFOLE1BQU0sQ0FBSztJQUFHLENBQUM7SUFFbkMsc0JBQUksc0JBQUk7YUFBUixjQUFnQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRXhDLHFCQUFNLEdBQU4sVUFBTyxDQUFJO1FBQ1QsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ25ELENBQUM7SUFFRCx1QkFBUSxHQUFSLFVBQVMsQ0FBSTtRQUNYLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3RGLENBQUM7SUFFRCx5QkFBVSxHQUFWLFVBQVcsQ0FBSTtRQUNiLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDdEYsQ0FBQztJQUVELHlCQUFVLEdBQVYsVUFBVyxDQUFJO1FBQ2IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUM3RCxDQUFDO0lBQ0gsV0FBQztBQUFELENBQUMsQUF4QkQsSUF3QkM7QUF4QlksWUFBSSxPQXdCaEIsQ0FBQTtBQUVEO0lBQ0Usb0JBQW1CLE9BQWUsRUFBUyxVQUFtQyxFQUMzRCxNQUFjO1FBRGQsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFTLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBQzNELFdBQU0sR0FBTixNQUFNLENBQVE7SUFBRyxDQUFDO0lBQ3ZDLGlCQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFIWSxrQkFBVSxhQUd0QixDQUFBO0FBRUQ7SUFVRSxzQkFBbUIsV0FBeUIsRUFBRSxVQUFtQyxFQUM5RCxNQUFjLEVBQUUsSUFBVSxFQUFFLGdCQUFrQztRQUQ5RCxnQkFBVyxHQUFYLFdBQVcsQ0FBYztRQUN6QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQztRQUMxQyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsK0JBQVEsR0FBUixVQUFTLEtBQWEsSUFBWSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbkUsc0JBQUksOEJBQUk7YUFBUixjQUFtQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ3pDLG1CQUFDO0FBQUQsQ0FBQyxBQXBCRCxJQW9CQztBQXBCWSxvQkFBWSxlQW9CeEIsQ0FBQTtBQUVELHVCQUE4QixDQUFlLEVBQUUsQ0FBZTtJQUM1RCxFQUFFLENBQUMsQ0FBQyxjQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQzVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLGNBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDNUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSw2QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdEYsQ0FBQztBQUplLHFCQUFhLGdCQUk1QixDQUFBO0FBRUQsc0NBQTZDLENBQWU7SUFDMUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztBQUM3QixDQUFDO0FBRmUsb0NBQTRCLCtCQUUzQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnRGYWN0b3J5fSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7U3RyaW5nTWFwV3JhcHBlciwgTGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1R5cGUsIGlzQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbmV4cG9ydCBjbGFzcyBUcmVlPFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfbm9kZXM6IFRbXSkge31cblxuICBnZXQgcm9vdCgpOiBUIHsgcmV0dXJuIHRoaXMuX25vZGVzWzBdOyB9XG5cbiAgcGFyZW50KHQ6IFQpOiBUIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLl9ub2Rlcy5pbmRleE9mKHQpO1xuICAgIHJldHVybiBpbmRleCA+IDAgPyB0aGlzLl9ub2Rlc1tpbmRleCAtIDFdIDogbnVsbDtcbiAgfVxuXG4gIGNoaWxkcmVuKHQ6IFQpOiBUW10ge1xuICAgIGxldCBpbmRleCA9IHRoaXMuX25vZGVzLmluZGV4T2YodCk7XG4gICAgcmV0dXJuIGluZGV4ID4gLTEgJiYgaW5kZXggPCB0aGlzLl9ub2Rlcy5sZW5ndGggLSAxID8gW3RoaXMuX25vZGVzW2luZGV4ICsgMV1dIDogW107XG4gIH1cblxuICBmaXJzdENoaWxkKHQ6IFQpOiBUIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLl9ub2Rlcy5pbmRleE9mKHQpO1xuICAgIHJldHVybiBpbmRleCA+IC0xICYmIGluZGV4IDwgdGhpcy5fbm9kZXMubGVuZ3RoIC0gMSA/IHRoaXMuX25vZGVzW2luZGV4ICsgMV0gOiBudWxsO1xuICB9XG5cbiAgcGF0aFRvUm9vdCh0OiBUKTogVFtdIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLl9ub2Rlcy5pbmRleE9mKHQpO1xuICAgIHJldHVybiBpbmRleCA+IC0xID8gdGhpcy5fbm9kZXMuc2xpY2UoMCwgaW5kZXggKyAxKSA6IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVybFNlZ21lbnQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgc2VnbWVudDogc3RyaW5nLCBwdWJsaWMgcGFyYW1ldGVyczoge1trZXk6IHN0cmluZ106IHN0cmluZ30sXG4gICAgICAgICAgICAgIHB1YmxpYyBvdXRsZXQ6IHN0cmluZykge31cbn1cblxuZXhwb3J0IGNsYXNzIFJvdXRlU2VnbWVudCB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3R5cGU6IFR5cGU7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY29tcG9uZW50RmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTtcblxuICAvKiogQGludGVybmFsICovXG4gIF9wYXJhbWV0ZXJzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdXJsU2VnbWVudHM6IFVybFNlZ21lbnRbXSwgcGFyYW1ldGVyczoge1trZXk6IHN0cmluZ106IHN0cmluZ30sXG4gICAgICAgICAgICAgIHB1YmxpYyBvdXRsZXQ6IHN0cmluZywgdHlwZTogVHlwZSwgY29tcG9uZW50RmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeSkge1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgIHRoaXMuX2NvbXBvbmVudEZhY3RvcnkgPSBjb21wb25lbnRGYWN0b3J5O1xuICAgIHRoaXMuX3BhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzO1xuICB9XG5cbiAgZ2V0UGFyYW0ocGFyYW06IHN0cmluZyk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9wYXJhbWV0ZXJzW3BhcmFtXTsgfVxuXG4gIGdldCB0eXBlKCk6IFR5cGUgeyByZXR1cm4gdGhpcy5fdHlwZTsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXF1YWxTZWdtZW50cyhhOiBSb3V0ZVNlZ21lbnQsIGI6IFJvdXRlU2VnbWVudCk6IGJvb2xlYW4ge1xuICBpZiAoaXNCbGFuayhhKSAmJiAhaXNCbGFuayhiKSkgcmV0dXJuIGZhbHNlO1xuICBpZiAoIWlzQmxhbmsoYSkgJiYgaXNCbGFuayhiKSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gYS5fdHlwZSA9PT0gYi5fdHlwZSAmJiBTdHJpbmdNYXBXcmFwcGVyLmVxdWFscyhhLl9wYXJhbWV0ZXJzLCBiLl9wYXJhbWV0ZXJzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJvdXRlU2VnbWVudENvbXBvbmVudEZhY3RvcnkoYTogUm91dGVTZWdtZW50KTogQ29tcG9uZW50RmFjdG9yeSB7XG4gIHJldHVybiBhLl9jb21wb25lbnRGYWN0b3J5O1xufSJdfQ==