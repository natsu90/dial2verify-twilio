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
