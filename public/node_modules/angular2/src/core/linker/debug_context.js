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
var collection_1 = require('angular2/src/facade/collection');
var view_type_1 = require('./view_type');
var StaticNodeDebugInfo = (function () {
    function StaticNodeDebugInfo(providerTokens, componentToken, varTokens) {
        this.providerTokens = providerTokens;
        this.componentToken = componentToken;
        this.varTokens = varTokens;
    }
    StaticNodeDebugInfo = __decorate([
        lang_1.CONST(), 
        __metadata('design:paramtypes', [Array, Object, Object])
    ], StaticNodeDebugInfo);
    return StaticNodeDebugInfo;
}());
exports.StaticNodeDebugInfo = StaticNodeDebugInfo;
var DebugContext = (function () {
    function DebugContext(_view, _nodeIndex, _tplRow, _tplCol) {
        this._view = _view;
        this._nodeIndex = _nodeIndex;
        this._tplRow = _tplRow;
        this._tplCol = _tplCol;
    }
    Object.defineProperty(DebugContext.prototype, "_staticNodeInfo", {
        get: function () {
            return lang_1.isPresent(this._nodeIndex) ? this._view.staticNodeDebugInfos[this._nodeIndex] : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugContext.prototype, "context", {
        get: function () { return this._view.context; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugContext.prototype, "component", {
        get: function () {
            var staticNodeInfo = this._staticNodeInfo;
            if (lang_1.isPresent(staticNodeInfo) && lang_1.isPresent(staticNodeInfo.componentToken)) {
                return this.injector.get(staticNodeInfo.componentToken);
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugContext.prototype, "componentRenderElement", {
        get: function () {
            var componentView = this._view;
            while (lang_1.isPresent(componentView.declarationAppElement) &&
                componentView.type !== view_type_1.ViewType.COMPONENT) {
                componentView = componentView.declarationAppElement.parentView;
            }
            return lang_1.isPresent(componentView.declarationAppElement) ?
                componentView.declarationAppElement.nativeElement :
                null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugContext.prototype, "injector", {
        get: function () { return this._view.injector(this._nodeIndex); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugContext.prototype, "renderNode", {
        get: function () {
            if (lang_1.isPresent(this._nodeIndex) && lang_1.isPresent(this._view.allNodes)) {
                return this._view.allNodes[this._nodeIndex];
            }
            else {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugContext.prototype, "providerTokens", {
        get: function () {
            var staticNodeInfo = this._staticNodeInfo;
            return lang_1.isPresent(staticNodeInfo) ? staticNodeInfo.providerTokens : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugContext.prototype, "source", {
        get: function () {
            return this._view.componentType.templateUrl + ":" + this._tplRow + ":" + this._tplCol;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DebugContext.prototype, "locals", {
        get: function () {
            var _this = this;
            var varValues = {};
            // TODO(tbosch): right now, the semantics of debugNode.locals are
            // that it contains the variables of all elements, not just
            // the given one. We preserve this for now to not have a breaking
            // change, but should change this later!
            collection_1.ListWrapper.forEachWithIndex(this._view.staticNodeDebugInfos, function (staticNodeInfo, nodeIndex) {
                var vars = staticNodeInfo.varTokens;
                collection_1.StringMapWrapper.forEach(vars, function (varToken, varName) {
                    var varValue;
                    if (lang_1.isBlank(varToken)) {
                        varValue = lang_1.isPresent(_this._view.allNodes) ? _this._view.allNodes[nodeIndex] : null;
                    }
                    else {
                        varValue = _this._view.injectorGet(varToken, nodeIndex, null);
                    }
                    varValues[varName] = varValue;
                });
            });
            collection_1.StringMapWrapper.forEach(this._view.locals, function (localValue, localName) { varValues[localName] = localValue; });
            return varValues;
        },
        enumerable: true,
        configurable: true
    });
    return DebugContext;
}());
exports.DebugContext = DebugContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWdfY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtNG5vM1pRdk8udG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9kZWJ1Z19jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQkFBd0MsMEJBQTBCLENBQUMsQ0FBQTtBQUNuRSwyQkFBNEMsZ0NBQWdDLENBQUMsQ0FBQTtBQUk3RSwwQkFBdUIsYUFBYSxDQUFDLENBQUE7QUFHckM7SUFDRSw2QkFBbUIsY0FBcUIsRUFBUyxjQUFtQixFQUNqRCxTQUErQjtRQUQvQixtQkFBYyxHQUFkLGNBQWMsQ0FBTztRQUFTLG1CQUFjLEdBQWQsY0FBYyxDQUFLO1FBQ2pELGNBQVMsR0FBVCxTQUFTLENBQXNCO0lBQUcsQ0FBQztJQUh4RDtRQUFDLFlBQUssRUFBRTs7MkJBQUE7SUFJUiwwQkFBQztBQUFELENBQUMsQUFIRCxJQUdDO0FBSFksMkJBQW1CLHNCQUcvQixDQUFBO0FBRUQ7SUFDRSxzQkFBb0IsS0FBbUIsRUFBVSxVQUFrQixFQUFVLE9BQWUsRUFDeEUsT0FBZTtRQURmLFVBQUssR0FBTCxLQUFLLENBQWM7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUN4RSxZQUFPLEdBQVAsT0FBTyxDQUFRO0lBQUcsQ0FBQztJQUV2QyxzQkFBWSx5Q0FBZTthQUEzQjtZQUNFLE1BQU0sQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDOUYsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSxpQ0FBTzthQUFYLGNBQWdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENB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QUMsR0FBRyxJQUFJLENBQUM7b0JBQ3BGLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ04sUUFBUSxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQy9ELENBQUM7b0JBQ0QsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLFFBQVEsQ0FBQztnQkFDaEMsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLDZCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFDakIsVUFBQyxVQUFVLEVBQUUsU0FBUyxJQUFPLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RixNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ25CLENBQUM7OztPQUFBO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBakVELElBaUVDO0FBakVZLG9CQUFZLGVBaUV4QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1ByZXNlbnQsIGlzQmxhbmssIENPTlNUfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtMaXN0V3JhcHBlciwgU3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7SW5qZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7UmVuZGVyRGVidWdJbmZvfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9yZW5kZXIvYXBpJztcbmltcG9ydCB7QXBwVmlld30gZnJvbSAnLi92aWV3JztcbmltcG9ydCB7Vmlld1R5cGV9IGZyb20gJy4vdmlld190eXBlJztcblxuQENPTlNUKClcbmV4cG9ydCBjbGFzcyBTdGF0aWNOb2RlRGVidWdJbmZvIHtcbiAgY29uc3RydWN0b3IocHVibGljIHByb3ZpZGVyVG9rZW5zOiBhbnlbXSwgcHVibGljIGNvbXBvbmVudFRva2VuOiBhbnksXG4gICAgICAgICAgICAgIHB1YmxpYyB2YXJUb2tlbnM6IHtba2V5OiBzdHJpbmddOiBhbnl9KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgRGVidWdDb250ZXh0IGltcGxlbWVudHMgUmVuZGVyRGVidWdJbmZvIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdmlldzogQXBwVmlldzxhbnk+LCBwcml2YXRlIF9ub2RlSW5kZXg6IG51bWJlciwgcHJpdmF0ZSBfdHBsUm93OiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3RwbENvbDogbnVtYmVyKSB7fVxuXG4gIHByaXZhdGUgZ2V0IF9zdGF0aWNOb2RlSW5mbygpOiBTdGF0aWNOb2RlRGVidWdJbmZvIHtcbiAgICByZXR1cm4gaXNQcmVzZW50KHRoaXMuX25vZGVJbmRleCkgPyB0aGlzLl92aWV3LnN0YXRpY05vZGVEZWJ1Z0luZm9zW3RoaXMuX25vZGVJbmRleF0gOiBudWxsO1xuICB9XG5cbiAgZ2V0IGNvbnRleHQoKSB7IHJldHVybiB0aGlzLl92aWV3LmNvbnRleHQ7IH1cbiAgZ2V0IGNvbXBvbmVudCgpIHtcbiAgICB2YXIgc3RhdGljTm9kZUluZm8gPSB0aGlzLl9zdGF0aWNOb2RlSW5mbztcbiAgICBpZiAoaXNQcmVzZW50KHN0YXRpY05vZGVJbmZvKSAmJiBpc1ByZXNlbnQoc3RhdGljTm9kZUluZm8uY29tcG9uZW50VG9rZW4pKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbmplY3Rvci5nZXQoc3RhdGljTm9kZUluZm8uY29tcG9uZW50VG9rZW4pO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBnZXQgY29tcG9uZW50UmVuZGVyRWxlbWVudCgpIHtcbiAgICB2YXIgY29tcG9uZW50VmlldyA9IHRoaXMuX3ZpZXc7XG4gICAgd2hpbGUgKGlzUHJlc2VudChjb21wb25lbnRWaWV3LmRlY2xhcmF0aW9uQXBwRWxlbWVudCkgJiZcbiAgICAgICAgICAgY29tcG9uZW50Vmlldy50eXBlICE9PSBWaWV3VHlwZS5DT01QT05FTlQpIHtcbiAgICAgIGNvbXBvbmVudFZpZXcgPSBjb21wb25lbnRWaWV3LmRlY2xhcmF0aW9uQXBwRWxlbWVudC5wYXJlbnRWaWV3O1xuICAgIH1cbiAgICByZXR1cm4gaXNQcmVzZW50KGNvbXBvbmVudFZpZXcuZGVjbGFyYXRpb25BcHBFbGVtZW50KSA/XG4gICAgICAgICAgICAgICBjb21wb25lbnRWaWV3LmRlY2xhcmF0aW9uQXBwRWxlbWVudC5uYXRpdmVFbGVtZW50IDpcbiAgICAgICAgICAgICAgIG51bGw7XG4gIH1cbiAgZ2V0IGluamVjdG9yKCk6IEluamVjdG9yIHsgcmV0dXJuIHRoaXMuX3ZpZXcuaW5qZWN0b3IodGhpcy5fbm9kZUluZGV4KTsgfVxuICBnZXQgcmVuZGVyTm9kZSgpOiBhbnkge1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5fbm9kZUluZGV4KSAmJiBpc1ByZXNlbnQodGhpcy5fdmlldy5hbGxOb2RlcykpIHtcbiAgICAgIHJldHVybiB0aGlzLl92aWV3LmFsbE5vZGVzW3RoaXMuX25vZGVJbmRleF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuICBnZXQgcHJvdmlkZXJUb2tlbnMoKTogYW55W10ge1xuICAgIHZhciBzdGF0aWNOb2RlSW5mbyA9IHRoaXMuX3N0YXRpY05vZGVJbmZvO1xuICAgIHJldHVybiBpc1ByZXNlbnQoc3RhdGljTm9kZUluZm8pID8gc3RhdGljTm9kZUluZm8ucHJvdmlkZXJUb2tlbnMgOiBudWxsO1xuICB9XG4gIGdldCBzb3VyY2UoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7dGhpcy5fdmlldy5jb21wb25lbnRUeXBlLnRlbXBsYXRlVXJsfToke3RoaXMuX3RwbFJvd306JHt0aGlzLl90cGxDb2x9YDtcbiAgfVxuICBnZXQgbG9jYWxzKCk6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9IHtcbiAgICB2YXIgdmFyVmFsdWVzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuICAgIC8vIFRPRE8odGJvc2NoKTogcmlnaHQgbm93LCB0aGUgc2VtYW50aWNzIG9mIGRlYnVnTm9kZS5sb2NhbHMgYXJlXG4gICAgLy8gdGhhdCBpdCBjb250YWlucyB0aGUgdmFyaWFibGVzIG9mIGFsbCBlbGVtZW50cywgbm90IGp1c3RcbiAgICAvLyB0aGUgZ2l2ZW4gb25lLiBXZSBwcmVzZXJ2ZSB0aGlzIGZvciBub3cgdG8gbm90IGhhdmUgYSBicmVha2luZ1xuICAgIC8vIGNoYW5nZSwgYnV0IHNob3VsZCBjaGFuZ2UgdGhpcyBsYXRlciFcbiAgICBMaXN0V3JhcHBlci5mb3JFYWNoV2l0aEluZGV4KFxuICAgICAgICB0aGlzLl92aWV3LnN0YXRpY05vZGVEZWJ1Z0luZm9zLFxuICAgICAgICAoc3RhdGljTm9kZUluZm86IFN0YXRpY05vZGVEZWJ1Z0luZm8sIG5vZGVJbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgdmFyIHZhcnMgPSBzdGF0aWNOb2RlSW5mby52YXJUb2tlbnM7XG4gICAgICAgICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKHZhcnMsICh2YXJUb2tlbiwgdmFyTmFtZSkgPT4ge1xuICAgICAgICAgICAgdmFyIHZhclZhbHVlO1xuICAgICAgICAgICAgaWYgKGlzQmxhbmsodmFyVG9rZW4pKSB7XG4gICAgICAgICAgICAgIHZhclZhbHVlID0gaXNQcmVzZW50KHRoaXMuX3ZpZXcuYWxsTm9kZXMpID8gdGhpcy5fdmlldy5hbGxOb2Rlc1tub2RlSW5kZXhdIDogbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZhclZhbHVlID0gdGhpcy5fdmlldy5pbmplY3RvckdldCh2YXJUb2tlbiwgbm9kZUluZGV4LCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhclZhbHVlc1t2YXJOYW1lXSA9IHZhclZhbHVlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICBTdHJpbmdNYXBXcmFwcGVyLmZvckVhY2godGhpcy5fdmlldy5sb2NhbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIChsb2NhbFZhbHVlLCBsb2NhbE5hbWUpID0+IHsgdmFyVmFsdWVzW2xvY2FsTmFtZV0gPSBsb2NhbFZhbHVlOyB9KTtcbiAgICByZXR1cm4gdmFyVmFsdWVzO1xuICB9XG59XG4iXX0=