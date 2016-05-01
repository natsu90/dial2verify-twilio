var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { isPresent, isBlank, CONST } from 'angular2/src/facade/lang';
import { ListWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { ViewType } from './view_type';
export let StaticNodeDebugInfo = class StaticNodeDebugInfo {
    constructor(providerTokens, componentToken, varTokens) {
        this.providerTokens = providerTokens;
        this.componentToken = componentToken;
        this.varTokens = varTokens;
    }
};
StaticNodeDebugInfo = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Array, Object, Object])
], StaticNodeDebugInfo);
export class DebugContext {
    constructor(_view, _nodeIndex, _tplRow, _tplCol) {
        this._view = _view;
        this._nodeIndex = _nodeIndex;
        this._tplRow = _tplRow;
        this._tplCol = _tplCol;
    }
    get _staticNodeInfo() {
        return isPresent(this._nodeIndex) ? this._view.staticNodeDebugInfos[this._nodeIndex] : null;
    }
    get context() { return this._view.context; }
    get component() {
        var staticNodeInfo = this._staticNodeInfo;
        if (isPresent(staticNodeInfo) && isPresent(staticNodeInfo.componentToken)) {
            return this.injector.get(staticNodeInfo.componentToken);
        }
        return null;
    }
    get componentRenderElement() {
        var componentView = this._view;
        while (isPresent(componentView.declarationAppElement) &&
            componentView.type !== ViewType.COMPONENT) {
            componentView = componentView.declarationAppElement.parentView;
        }
        return isPresent(componentView.declarationAppElement) ?
            componentView.declarationAppElement.nativeElement :
            null;
    }
    get injector() { return this._view.injector(this._nodeIndex); }
    get renderNode() {
        if (isPresent(this._nodeIndex) && isPresent(this._view.allNodes)) {
            return this._view.allNodes[this._nodeIndex];
        }
        else {
            return null;
        }
    }
    get providerTokens() {
        var staticNodeInfo = this._staticNodeInfo;
        return isPresent(staticNodeInfo) ? staticNodeInfo.providerTokens : null;
    }
    get source() {
        return `${this._view.componentType.templateUrl}:${this._tplRow}:${this._tplCol}`;
    }
    get locals() {
        var varValues = {};
        // TODO(tbosch): right now, the semantics of debugNode.locals are
        // that it contains the variables of all elements, not just
        // the given one. We preserve this for now to not have a breaking
        // change, but should change this later!
        ListWrapper.forEachWithIndex(this._view.staticNodeDebugInfos, (staticNodeInfo, nodeIndex) => {
            var vars = staticNodeInfo.varTokens;
            StringMapWrapper.forEach(vars, (varToken, varName) => {
                var varValue;
                if (isBlank(varToken)) {
                    varValue = isPresent(this._view.allNodes) ? this._view.allNodes[nodeIndex] : null;
                }
                else {
                    varValue = this._view.injectorGet(varToken, nodeIndex, null);
                }
                varValues[varName] = varValue;
            });
        });
        StringMapWrapper.forEach(this._view.locals, (localValue, localName) => { varValues[localName] = localValue; });
        return varValues;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWdfY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUQxaUdRVkcudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9kZWJ1Z19jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztPQUFPLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUMsTUFBTSwwQkFBMEI7T0FDM0QsRUFBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxnQ0FBZ0M7T0FJckUsRUFBQyxRQUFRLEVBQUMsTUFBTSxhQUFhO0FBR3BDO0lBQ0UsWUFBbUIsY0FBcUIsRUFBUyxjQUFtQixFQUNqRCxTQUErQjtRQUQvQixtQkFBYyxHQUFkLGNBQWMsQ0FBTztRQUFTLG1CQUFjLEdBQWQsY0FBYyxDQUFLO1FBQ2pELGNBQVMsR0FBVCxTQUFTLENBQXNCO0lBQUcsQ0FBQztBQUN4RCxDQUFDO0FBSkQ7SUFBQyxLQUFLLEVBQUU7O3VCQUFBO0FBTVI7SUFDRSxZQUFvQixLQUFtQixFQUFVLFVBQWtCLEVBQVUsT0FBZSxFQUN4RSxPQUFlO1FBRGYsVUFBSyxHQUFMLEtBQUssQ0FBYztRQUFVLGVBQVUsR0FBVixVQUFVLENBQVE7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ3hFLFlBQU8sR0FBUCxPQUFPLENBQVE7SUFBRyxDQUFDO0lBRXZDLElBQVksZUFBZTtRQUN6QixNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDOUYsQ0FBQztJQUVELElBQUksT0FBTyxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDNUMsSUFBSSxTQUFTO1FBQ1gsSUFBSSxj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U0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLFFBQVEsQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUNqQixDQUFDLFVBQVUsRUFBRSxTQUFTLE9BQU8sU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVGLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbkIsQ0FBQztBQUNILENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNQcmVzZW50LCBpc0JsYW5rLCBDT05TVH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TGlzdFdyYXBwZXIsIFN0cmluZ01hcFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge0luamVjdG9yfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge1JlbmRlckRlYnVnSW5mb30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvcmVuZGVyL2FwaSc7XG5pbXBvcnQge0FwcFZpZXd9IGZyb20gJy4vdmlldyc7XG5pbXBvcnQge1ZpZXdUeXBlfSBmcm9tICcuL3ZpZXdfdHlwZSc7XG5cbkBDT05TVCgpXG5leHBvcnQgY2xhc3MgU3RhdGljTm9kZURlYnVnSW5mbyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm92aWRlclRva2VuczogYW55W10sIHB1YmxpYyBjb21wb25lbnRUb2tlbjogYW55LFxuICAgICAgICAgICAgICBwdWJsaWMgdmFyVG9rZW5zOiB7W2tleTogc3RyaW5nXTogYW55fSkge31cbn1cblxuZXhwb3J0IGNsYXNzIERlYnVnQ29udGV4dCBpbXBsZW1lbnRzIFJlbmRlckRlYnVnSW5mbyB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3ZpZXc6IEFwcFZpZXc8YW55PiwgcHJpdmF0ZSBfbm9kZUluZGV4OiBudW1iZXIsIHByaXZhdGUgX3RwbFJvdzogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF90cGxDb2w6IG51bWJlcikge31cblxuICBwcml2YXRlIGdldCBfc3RhdGljTm9kZUluZm8oKTogU3RhdGljTm9kZURlYnVnSW5mbyB7XG4gICAgcmV0dXJuIGlzUHJlc2VudCh0aGlzLl9ub2RlSW5kZXgpID8gdGhpcy5fdmlldy5zdGF0aWNOb2RlRGVidWdJbmZvc1t0aGlzLl9ub2RlSW5kZXhdIDogbnVsbDtcbiAgfVxuXG4gIGdldCBjb250ZXh0KCkgeyByZXR1cm4gdGhpcy5fdmlldy5jb250ZXh0OyB9XG4gIGdldCBjb21wb25lbnQoKSB7XG4gICAgdmFyIHN0YXRpY05vZGVJbmZvID0gdGhpcy5fc3RhdGljTm9kZUluZm87XG4gICAgaWYgKGlzUHJlc2VudChzdGF0aWNOb2RlSW5mbykgJiYgaXNQcmVzZW50KHN0YXRpY05vZGVJbmZvLmNvbXBvbmVudFRva2VuKSkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5qZWN0b3IuZ2V0KHN0YXRpY05vZGVJbmZvLmNvbXBvbmVudFRva2VuKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgZ2V0IGNvbXBvbmVudFJlbmRlckVsZW1lbnQoKSB7XG4gICAgdmFyIGNvbXBvbmVudFZpZXcgPSB0aGlzLl92aWV3O1xuICAgIHdoaWxlIChpc1ByZXNlbnQoY29tcG9uZW50Vmlldy5kZWNsYXJhdGlvbkFwcEVsZW1lbnQpICYmXG4gICAgICAgICAgIGNvbXBvbmVudFZpZXcudHlwZSAhPT0gVmlld1R5cGUuQ09NUE9ORU5UKSB7XG4gICAgICBjb21wb25lbnRWaWV3ID0gY29tcG9uZW50Vmlldy5kZWNsYXJhdGlvbkFwcEVsZW1lbnQucGFyZW50VmlldztcbiAgICB9XG4gICAgcmV0dXJuIGlzUHJlc2VudChjb21wb25lbnRWaWV3LmRlY2xhcmF0aW9uQXBwRWxlbWVudCkgP1xuICAgICAgICAgICAgICAgY29tcG9uZW50Vmlldy5kZWNsYXJhdGlvbkFwcEVsZW1lbnQubmF0aXZlRWxlbWVudCA6XG4gICAgICAgICAgICAgICBudWxsO1xuICB9XG4gIGdldCBpbmplY3RvcigpOiBJbmplY3RvciB7IHJldHVybiB0aGlzLl92aWV3LmluamVjdG9yKHRoaXMuX25vZGVJbmRleCk7IH1cbiAgZ2V0IHJlbmRlck5vZGUoKTogYW55IHtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuX25vZGVJbmRleCkgJiYgaXNQcmVzZW50KHRoaXMuX3ZpZXcuYWxsTm9kZXMpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdmlldy5hbGxOb2Rlc1t0aGlzLl9ub2RlSW5kZXhdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbiAgZ2V0IHByb3ZpZGVyVG9rZW5zKCk6IGFueVtdIHtcbiAgICB2YXIgc3RhdGljTm9kZUluZm8gPSB0aGlzLl9zdGF0aWNOb2RlSW5mbztcbiAgICByZXR1cm4gaXNQcmVzZW50KHN0YXRpY05vZGVJbmZvKSA/IHN0YXRpY05vZGVJbmZvLnByb3ZpZGVyVG9rZW5zIDogbnVsbDtcbiAgfVxuICBnZXQgc291cmNlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke3RoaXMuX3ZpZXcuY29tcG9uZW50VHlwZS50ZW1wbGF0ZVVybH06JHt0aGlzLl90cGxSb3d9OiR7dGhpcy5fdHBsQ29sfWA7XG4gIH1cbiAgZ2V0IGxvY2FscygpOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSB7XG4gICAgdmFyIHZhclZhbHVlczoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgICAvLyBUT0RPKHRib3NjaCk6IHJpZ2h0IG5vdywgdGhlIHNlbWFudGljcyBvZiBkZWJ1Z05vZGUubG9jYWxzIGFyZVxuICAgIC8vIHRoYXQgaXQgY29udGFpbnMgdGhlIHZhcmlhYmxlcyBvZiBhbGwgZWxlbWVudHMsIG5vdCBqdXN0XG4gICAgLy8gdGhlIGdpdmVuIG9uZS4gV2UgcHJlc2VydmUgdGhpcyBmb3Igbm93IHRvIG5vdCBoYXZlIGEgYnJlYWtpbmdcbiAgICAvLyBjaGFuZ2UsIGJ1dCBzaG91bGQgY2hhbmdlIHRoaXMgbGF0ZXIhXG4gICAgTGlzdFdyYXBwZXIuZm9yRWFjaFdpdGhJbmRleChcbiAgICAgICAgdGhpcy5fdmlldy5zdGF0aWNOb2RlRGVidWdJbmZvcyxcbiAgICAgICAgKHN0YXRpY05vZGVJbmZvOiBTdGF0aWNOb2RlRGVidWdJbmZvLCBub2RlSW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgIHZhciB2YXJzID0gc3RhdGljTm9kZUluZm8udmFyVG9rZW5zO1xuICAgICAgICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaCh2YXJzLCAodmFyVG9rZW4sIHZhck5hbWUpID0+IHtcbiAgICAgICAgICAgIHZhciB2YXJWYWx1ZTtcbiAgICAgICAgICAgIGlmIChpc0JsYW5rKHZhclRva2VuKSkge1xuICAgICAgICAgICAgICB2YXJWYWx1ZSA9IGlzUHJlc2VudCh0aGlzLl92aWV3LmFsbE5vZGVzKSA/IHRoaXMuX3ZpZXcuYWxsTm9kZXNbbm9kZUluZGV4XSA6IG51bGw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXJWYWx1ZSA9IHRoaXMuX3ZpZXcuaW5qZWN0b3JHZXQodmFyVG9rZW4sIG5vZGVJbmRleCwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXJWYWx1ZXNbdmFyTmFtZV0gPSB2YXJWYWx1ZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKHRoaXMuX3ZpZXcubG9jYWxzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobG9jYWxWYWx1ZSwgbG9jYWxOYW1lKSA9PiB7IHZhclZhbHVlc1tsb2NhbE5hbWVdID0gbG9jYWxWYWx1ZTsgfSk7XG4gICAgcmV0dXJuIHZhclZhbHVlcztcbiAgfVxufVxuIl19