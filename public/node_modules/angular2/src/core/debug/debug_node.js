'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var EventListener = (function () {
    function EventListener(name, callback) {
        this.name = name;
        this.callback = callback;
    }
    ;
    return EventListener;
}());
exports.EventListener = EventListener;
var DebugNode = (function () {
    function DebugNode(nativeNode, parent, _debugInfo) {
        this._debugInfo = _debugInfo;
        this.nativeNode = nativeNode;
        if (lang_1.isPresent(parent) && parent instanceof DebugElement) {
            parent.addChild(this);
        }
        else {
            this.parent = null;
        }
        this.listeners = [];
    }
    Object.defineProperty(DebugNode.prototype, "injector", {
        get: function () { return lang_1.isPresent(this._debugInfo) ? this._debugInfo.injector : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugNode.prototype, "componentInstance", {
        get: function () {
            return lang_1.isPresent(this._debugInfo) ? this._debugInfo.component : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugNode.prototype, "locals", {
        get: function () {
            return lang_1.isPresent(this._debugInfo) ? this._debugInfo.locals : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugNode.prototype, "providerTokens", {
        get: function () {
            return lang_1.isPresent(this._debugInfo) ? this._debugInfo.providerTokens : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugNode.prototype, "source", {
        get: function () { return lang_1.isPresent(this._debugInfo) ? this._debugInfo.source : null; },
        enumerable: true,
        configurable: true
    });
    DebugNode.prototype.inject = function (token) { return this.injector.get(token); };
    DebugNode.prototype.getLocal = function (name) { return this.locals[name]; };
    return DebugNode;
}());
exports.DebugNode = DebugNode;
var DebugElement = (function (_super) {
    __extends(DebugElement, _super);
    function DebugElement(nativeNode, parent, _debugInfo) {
        _super.call(this, nativeNode, parent, _debugInfo);
        this.properties = {};
        this.attributes = {};
        this.childNodes = [];
        this.nativeElement = nativeNode;
    }
    DebugElement.prototype.addChild = function (child) {
        if (lang_1.isPresent(child)) {
            this.childNodes.push(child);
            child.parent = this;
        }
    };
    DebugElement.prototype.removeChild = function (child) {
        var childIndex = this.childNodes.indexOf(child);
        if (childIndex !== -1) {
            child.parent = null;
            this.childNodes.splice(childIndex, 1);
        }
    };
    DebugElement.prototype.insertChildrenAfter = function (child, newChildren) {
        var siblingIndex = this.childNodes.indexOf(child);
        if (siblingIndex !== -1) {
            var previousChildren = this.childNodes.slice(0, siblingIndex + 1);
            var nextChildren = this.childNodes.slice(siblingIndex + 1);
            this.childNodes =
                collection_1.ListWrapper.concat(collection_1.ListWrapper.concat(previousChildren, newChildren), nextChildren);
            for (var i = 0; i < newChildren.length; ++i) {
                var newChild = newChildren[i];
                if (lang_1.isPresent(newChild.parent)) {
                    newChild.parent.removeChild(newChild);
                }
                newChild.parent = this;
            }
        }
    };
    DebugElement.prototype.query = function (predicate) {
        var results = this.queryAll(predicate);
        return results.length > 0 ? results[0] : null;
    };
    DebugElement.prototype.queryAll = function (predicate) {
        var matches = [];
        _queryElementChildren(this, predicate, matches);
        return matches;
    };
    DebugElement.prototype.queryAllNodes = function (predicate) {
        var matches = [];
        _queryNodeChildren(this, predicate, matches);
        return matches;
    };
    Object.defineProperty(DebugElement.prototype, "children", {
        get: function () {
            var children = [];
            this.childNodes.forEach(function (node) {
                if (node instanceof DebugElement) {
                    children.push(node);
                }
            });
            return children;
        },
        enumerable: true,
        configurable: true
    });
    DebugElement.prototype.triggerEventHandler = function (eventName, eventObj) {
        this.listeners.forEach(function (listener) {
            if (listener.name == eventName) {
                listener.callback(eventObj);
            }
        });
    };
    return DebugElement;
}(DebugNode));
exports.DebugElement = DebugElement;
function asNativeElements(debugEls) {
    return debugEls.map(function (el) { return el.nativeElement; });
}
exports.asNativeElements = asNativeElements;
function _queryElementChildren(element, predicate, matches) {
    element.childNodes.forEach(function (node) {
        if (node instanceof DebugElement) {
            if (predicate(node)) {
                matches.push(node);
            }
            _queryElementChildren(node, predicate, matches);
        }
    });
}
function _queryNodeChildren(parentNode, predicate, matches) {
    if (parentNode instanceof DebugElement) {
        parentNode.childNodes.forEach(function (node) {
            if (predicate(node)) {
                matches.push(node);
            }
            if (node instanceof DebugElement) {
                _queryNodeChildren(node, predicate, matches);
            }
        });
    }
}
// Need to keep the nodes in a global Map so that multiple angular apps are supported.
var _nativeNodeToDebugNode = new Map();
function getDebugNode(nativeNode) {
    return _nativeNodeToDebugNode.get(nativeNode);
}
exports.getDebugNode = getDebugNode;
function getAllDebugNodes() {
    return collection_1.MapWrapper.values(_nativeNodeToDebugNode);
}
exports.getAllDebugNodes = getAllDebugNodes;
function indexDebugNode(node) {
    _nativeNodeToDebugNode.set(node.nativeNode, node);
}
exports.indexDebugNode = indexDebugNode;
function removeDebugNodeFromIndex(node) {
    _nativeNodeToDebugNode.delete(node.nativeNode);
}
exports.removeDebugNodeFromIndex = removeDebugNodeFromIndex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWdfbm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtNG5vM1pRdk8udG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2RlYnVnL2RlYnVnX25vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEscUJBQThCLDBCQUEwQixDQUFDLENBQUE7QUFHekQsMkJBQXNDLGdDQUFnQyxDQUFDLENBQUE7QUFHdkU7SUFBNkIsdUJBQW1CLElBQVksRUFBUyxRQUFrQjtRQUF2QyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtJQUFFLENBQUM7O0lBQUUsb0JBQUM7QUFBRCxDQUFDLEFBQTdGLElBQTZGO0FBQWhGLHFCQUFhLGdCQUFtRSxDQUFBO0FBRTdGO0lBS0UsbUJBQVksVUFBZSxFQUFFLE1BQWlCLEVBQVUsVUFBMkI7UUFBM0IsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7UUFDakYsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLFlBQVksWUFBWSxDQUFDLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLENBQUM7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQsc0JBQUksK0JBQVE7YUFBWixjQUEyQixNQUFNLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFakcsc0JBQUksd0NBQWlCO2FBQXJCO1lB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QUFDcEQsQ0FBQztBQUZlLHNCQUFjLGlCQUU3QixDQUFBO0FBRUQsa0NBQXlDLElBQWU7SUFDdEQsc0JBQXNCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRmUsZ0NBQXdCLDJCQUV2QyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1ByZXNlbnQsIFR5cGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge1ByZWRpY2F0ZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7SW5qZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7TGlzdFdyYXBwZXIsIE1hcFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1JlbmRlckRlYnVnSW5mb30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvcmVuZGVyL2FwaSc7XG5cbmV4cG9ydCBjbGFzcyBFdmVudExpc3RlbmVyIHsgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGNhbGxiYWNrOiBGdW5jdGlvbil7fTsgfVxuXG5leHBvcnQgY2xhc3MgRGVidWdOb2RlIHtcbiAgbmF0aXZlTm9kZTogYW55O1xuICBsaXN0ZW5lcnM6IEV2ZW50TGlzdGVuZXJbXTtcbiAgcGFyZW50OiBEZWJ1Z0VsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IobmF0aXZlTm9kZTogYW55LCBwYXJlbnQ6IERlYnVnTm9kZSwgcHJpdmF0ZSBfZGVidWdJbmZvOiBSZW5kZXJEZWJ1Z0luZm8pIHtcbiAgICB0aGlzLm5hdGl2ZU5vZGUgPSBuYXRpdmVOb2RlO1xuICAgIGlmIChpc1ByZXNlbnQocGFyZW50KSAmJiBwYXJlbnQgaW5zdGFuY2VvZiBEZWJ1Z0VsZW1lbnQpIHtcbiAgICAgIHBhcmVudC5hZGRDaGlsZCh0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xuICB9XG5cbiAgZ2V0IGluamVjdG9yKCk6IEluamVjdG9yIHsgcmV0dXJuIGlzUHJlc2VudCh0aGlzLl9kZWJ1Z0luZm8pID8gdGhpcy5fZGVidWdJbmZvLmluamVjdG9yIDogbnVsbDsgfVxuXG4gIGdldCBjb21wb25lbnRJbnN0YW5jZSgpOiBhbnkge1xuICAgIHJldHVybiBpc1ByZXNlbnQodGhpcy5fZGVidWdJbmZvKSA/IHRoaXMuX2RlYnVnSW5mby5jb21wb25lbnQgOiBudWxsO1xuICB9XG5cbiAgZ2V0IGxvY2FscygpOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gICAgcmV0dXJuIGlzUHJlc2VudCh0aGlzLl9kZWJ1Z0luZm8pID8gdGhpcy5fZGVidWdJbmZvLmxvY2FscyA6IG51bGw7XG4gIH1cblxuICBnZXQgcHJvdmlkZXJUb2tlbnMoKTogYW55W10ge1xuICAgIHJldHVybiBpc1ByZXNlbnQodGhpcy5fZGVidWdJbmZvKSA/IHRoaXMuX2RlYnVnSW5mby5wcm92aWRlclRva2VucyA6IG51bGw7XG4gIH1cblxuICBnZXQgc291cmNlKCk6IHN0cmluZyB7IHJldHVybiBpc1ByZXNlbnQodGhpcy5fZGVidWdJbmZvKSA/IHRoaXMuX2RlYnVnSW5mby5zb3VyY2UgOiBudWxsOyB9XG5cbiAgaW5qZWN0KHRva2VuOiBhbnkpOiBhbnkgeyByZXR1cm4gdGhpcy5pbmplY3Rvci5nZXQodG9rZW4pOyB9XG5cbiAgZ2V0TG9jYWwobmFtZTogc3RyaW5nKTogYW55IHsgcmV0dXJuIHRoaXMubG9jYWxzW25hbWVdOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBEZWJ1Z0VsZW1lbnQgZXh0ZW5kcyBEZWJ1Z05vZGUge1xuICBuYW1lOiBzdHJpbmc7XG4gIHByb3BlcnRpZXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9O1xuICBhdHRyaWJ1dGVzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfTtcbiAgY2hpbGROb2RlczogRGVidWdOb2RlW107XG4gIG5hdGl2ZUVsZW1lbnQ6IGFueTtcblxuICBjb25zdHJ1Y3RvcihuYXRpdmVOb2RlOiBhbnksIHBhcmVudDogYW55LCBfZGVidWdJbmZvOiBSZW5kZXJEZWJ1Z0luZm8pIHtcbiAgICBzdXBlcihuYXRpdmVOb2RlLCBwYXJlbnQsIF9kZWJ1Z0luZm8pO1xuICAgIHRoaXMucHJvcGVydGllcyA9IHt9O1xuICAgIHRoaXMuYXR0cmlidXRlcyA9IHt9O1xuICAgIHRoaXMuY2hpbGROb2RlcyA9IFtdO1xuICAgIHRoaXMubmF0aXZlRWxlbWVudCA9IG5hdGl2ZU5vZGU7XG4gIH1cblxuICBhZGRDaGlsZChjaGlsZDogRGVidWdOb2RlKSB7XG4gICAgaWYgKGlzUHJlc2VudChjaGlsZCkpIHtcbiAgICAgIHRoaXMuY2hpbGROb2Rlcy5wdXNoKGNoaWxkKTtcbiAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlQ2hpbGQoY2hpbGQ6IERlYnVnTm9kZSkge1xuICAgIHZhciBjaGlsZEluZGV4ID0gdGhpcy5jaGlsZE5vZGVzLmluZGV4T2YoY2hpbGQpO1xuICAgIGlmIChjaGlsZEluZGV4ICE9PSAtMSkge1xuICAgICAgY2hpbGQucGFyZW50ID0gbnVsbDtcbiAgICAgIHRoaXMuY2hpbGROb2Rlcy5zcGxpY2UoY2hpbGRJbmRleCwgMSk7XG4gICAgfVxuICB9XG5cbiAgaW5zZXJ0Q2hpbGRyZW5BZnRlcihjaGlsZDogRGVidWdOb2RlLCBuZXdDaGlsZHJlbjogRGVidWdOb2RlW10pIHtcbiAgICB2YXIgc2libGluZ0luZGV4ID0gdGhpcy5jaGlsZE5vZGVzLmluZGV4T2YoY2hpbGQpO1xuICAgIGlmIChzaWJsaW5nSW5kZXggIT09IC0xKSB7XG4gICAgICB2YXIgcHJldmlvdXNDaGlsZHJlbiA9IHRoaXMuY2hpbGROb2Rlcy5zbGljZSgwLCBzaWJsaW5nSW5kZXggKyAxKTtcbiAgICAgIHZhciBuZXh0Q2hpbGRyZW4gPSB0aGlzLmNoaWxkTm9kZXMuc2xpY2Uoc2libGluZ0luZGV4ICsgMSk7XG4gICAgICB0aGlzLmNoaWxkTm9kZXMgPVxuICAgICAgICAgIExpc3RXcmFwcGVyLmNvbmNhdChMaXN0V3JhcHBlci5jb25jYXQocHJldmlvdXNDaGlsZHJlbiwgbmV3Q2hpbGRyZW4pLCBuZXh0Q2hpbGRyZW4pO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXdDaGlsZHJlbi5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgbmV3Q2hpbGQgPSBuZXdDaGlsZHJlbltpXTtcbiAgICAgICAgaWYgKGlzUHJlc2VudChuZXdDaGlsZC5wYXJlbnQpKSB7XG4gICAgICAgICAgbmV3Q2hpbGQucGFyZW50LnJlbW92ZUNoaWxkKG5ld0NoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdDaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHF1ZXJ5KHByZWRpY2F0ZTogUHJlZGljYXRlPERlYnVnRWxlbWVudD4pOiBEZWJ1Z0VsZW1lbnQge1xuICAgIHZhciByZXN1bHRzID0gdGhpcy5xdWVyeUFsbChwcmVkaWNhdGUpO1xuICAgIHJldHVybiByZXN1bHRzLmxlbmd0aCA+IDAgPyByZXN1bHRzWzBdIDogbnVsbDtcbiAgfVxuXG4gIHF1ZXJ5QWxsKHByZWRpY2F0ZTogUHJlZGljYXRlPERlYnVnRWxlbWVudD4pOiBEZWJ1Z0VsZW1lbnRbXSB7XG4gICAgdmFyIG1hdGNoZXM6IERlYnVnRWxlbWVudFtdID0gW107XG4gICAgX3F1ZXJ5RWxlbWVudENoaWxkcmVuKHRoaXMsIHByZWRpY2F0ZSwgbWF0Y2hlcyk7XG4gICAgcmV0dXJuIG1hdGNoZXM7XG4gIH1cblxuICBxdWVyeUFsbE5vZGVzKHByZWRpY2F0ZTogUHJlZGljYXRlPERlYnVnTm9kZT4pOiBEZWJ1Z05vZGVbXSB7XG4gICAgdmFyIG1hdGNoZXM6IERlYnVnTm9kZVtdID0gW107XG4gICAgX3F1ZXJ5Tm9kZUNoaWxkcmVuKHRoaXMsIHByZWRpY2F0ZSwgbWF0Y2hlcyk7XG4gICAgcmV0dXJuIG1hdGNoZXM7XG4gIH1cblxuICBnZXQgY2hpbGRyZW4oKTogRGVidWdFbGVtZW50W10ge1xuICAgIHZhciBjaGlsZHJlbjogRGVidWdFbGVtZW50W10gPSBbXTtcbiAgICB0aGlzLmNoaWxkTm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBEZWJ1Z0VsZW1lbnQpIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cblxuICB0cmlnZ2VyRXZlbnRIYW5kbGVyKGV2ZW50TmFtZTogc3RyaW5nLCBldmVudE9iajogYW55KSB7XG4gICAgdGhpcy5saXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcbiAgICAgIGlmIChsaXN0ZW5lci5uYW1lID09IGV2ZW50TmFtZSkge1xuICAgICAgICBsaXN0ZW5lci5jYWxsYmFjayhldmVudE9iaik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzTmF0aXZlRWxlbWVudHMoZGVidWdFbHM6IERlYnVnRWxlbWVudFtdKTogYW55IHtcbiAgcmV0dXJuIGRlYnVnRWxzLm1hcCgoZWwpID0+IGVsLm5hdGl2ZUVsZW1lbnQpO1xufVxuXG5mdW5jdGlvbiBfcXVlcnlFbGVtZW50Q2hpbGRyZW4oZWxlbWVudDogRGVidWdFbGVtZW50LCBwcmVkaWNhdGU6IFByZWRpY2F0ZTxEZWJ1Z0VsZW1lbnQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZXM6IERlYnVnRWxlbWVudFtdKSB7XG4gIGVsZW1lbnQuY2hpbGROb2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgRGVidWdFbGVtZW50KSB7XG4gICAgICBpZiAocHJlZGljYXRlKG5vZGUpKSB7XG4gICAgICAgIG1hdGNoZXMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICAgIF9xdWVyeUVsZW1lbnRDaGlsZHJlbihub2RlLCBwcmVkaWNhdGUsIG1hdGNoZXMpO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIF9xdWVyeU5vZGVDaGlsZHJlbihwYXJlbnROb2RlOiBEZWJ1Z05vZGUsIHByZWRpY2F0ZTogUHJlZGljYXRlPERlYnVnTm9kZT4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlczogRGVidWdOb2RlW10pIHtcbiAgaWYgKHBhcmVudE5vZGUgaW5zdGFuY2VvZiBEZWJ1Z0VsZW1lbnQpIHtcbiAgICBwYXJlbnROb2RlLmNoaWxkTm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgIGlmIChwcmVkaWNhdGUobm9kZSkpIHtcbiAgICAgICAgbWF0Y2hlcy5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBEZWJ1Z0VsZW1lbnQpIHtcbiAgICAgICAgX3F1ZXJ5Tm9kZUNoaWxkcmVuKG5vZGUsIHByZWRpY2F0ZSwgbWF0Y2hlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuLy8gTmVlZCB0byBrZWVwIHRoZSBub2RlcyBpbiBhIGdsb2JhbCBNYXAgc28gdGhhdCBtdWx0aXBsZSBhbmd1bGFyIGFwcHMgYXJlIHN1cHBvcnRlZC5cbnZhciBfbmF0aXZlTm9kZVRvRGVidWdOb2RlID0gbmV3IE1hcDxhbnksIERlYnVnTm9kZT4oKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlYnVnTm9kZShuYXRpdmVOb2RlOiBhbnkpOiBEZWJ1Z05vZGUge1xuICByZXR1cm4gX25hdGl2ZU5vZGVUb0RlYnVnTm9kZS5nZXQobmF0aXZlTm9kZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxEZWJ1Z05vZGVzKCk6IERlYnVnTm9kZVtdIHtcbiAgcmV0dXJuIE1hcFdyYXBwZXIudmFsdWVzKF9uYXRpdmVOb2RlVG9EZWJ1Z05vZGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5kZXhEZWJ1Z05vZGUobm9kZTogRGVidWdOb2RlKSB7XG4gIF9uYXRpdmVOb2RlVG9EZWJ1Z05vZGUuc2V0KG5vZGUubmF0aXZlTm9kZSwgbm9kZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEZWJ1Z05vZGVGcm9tSW5kZXgobm9kZTogRGVidWdOb2RlKSB7XG4gIF9uYXRpdmVOb2RlVG9EZWJ1Z05vZGUuZGVsZXRlKG5vZGUubmF0aXZlTm9kZSk7XG59XG4iXX0=