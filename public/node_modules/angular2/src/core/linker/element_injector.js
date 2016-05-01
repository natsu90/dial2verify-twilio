'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lang_1 = require('angular2/src/facade/lang');
var injector_1 = require('angular2/src/core/di/injector');
var _UNDEFINED = lang_1.CONST_EXPR(new Object());
var ElementInjector = (function (_super) {
    __extends(ElementInjector, _super);
    function ElementInjector(_view, _nodeIndex) {
        _super.call(this);
        this._view = _view;
        this._nodeIndex = _nodeIndex;
    }
    ElementInjector.prototype.get = function (token, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = injector_1.THROW_IF_NOT_FOUND; }
        var result = _UNDEFINED;
        if (result === _UNDEFINED) {
            result = this._view.injectorGet(token, this._nodeIndex, _UNDEFINED);
        }
        if (result === _UNDEFINED) {
            result = this._view.parentInjector.get(token, notFoundValue);
        }
        return result;
    };
    return ElementInjector;
}(injector_1.Injector));
exports.ElementInjector = ElementInjector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudF9pbmplY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtNG5vM1pRdk8udG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9lbGVtZW50X2luamVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFCQUE2QywwQkFBMEIsQ0FBQyxDQUFBO0FBQ3hFLHlCQUEyQywrQkFBK0IsQ0FBQyxDQUFBO0FBRzNFLElBQU0sVUFBVSxHQUFHLGlCQUFVLENBQUMsSUFBSSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBRTVDO0lBQXFDLG1DQUFRO0lBQzNDLHlCQUFvQixLQUFtQixFQUFVLFVBQWtCO1FBQUksaUJBQU8sQ0FBQztRQUEzRCxVQUFLLEdBQUwsS0FBSyxDQUFjO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBUTtJQUFhLENBQUM7SUFFakYsNkJBQUcsR0FBSCxVQUFJLEtBQVUsRUFBRSxhQUF1QztRQUF2Qyw2QkFBdUMsR0FBdkMsNkNBQXVDO1FBQ3JELElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQztRQUN4QixFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztZQUMxQixNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdEUsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUFiRCxDQUFxQyxtQkFBUSxHQWE1QztBQWJZLHVCQUFlLGtCQWEzQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0JsYW5rLCBzdHJpbmdpZnksIENPTlNUX0VYUFJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0luamVjdG9yLCBUSFJPV19JRl9OT1RfRk9VTkR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpL2luamVjdG9yJztcbmltcG9ydCB7QXBwVmlld30gZnJvbSAnLi92aWV3JztcblxuY29uc3QgX1VOREVGSU5FRCA9IENPTlNUX0VYUFIobmV3IE9iamVjdCgpKTtcblxuZXhwb3J0IGNsYXNzIEVsZW1lbnRJbmplY3RvciBleHRlbmRzIEluamVjdG9yIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdmlldzogQXBwVmlldzxhbnk+LCBwcml2YXRlIF9ub2RlSW5kZXg6IG51bWJlcikgeyBzdXBlcigpOyB9XG5cbiAgZ2V0KHRva2VuOiBhbnksIG5vdEZvdW5kVmFsdWU6IGFueSA9IFRIUk9XX0lGX05PVF9GT1VORCk6IGFueSB7XG4gICAgdmFyIHJlc3VsdCA9IF9VTkRFRklORUQ7XG4gICAgaWYgKHJlc3VsdCA9PT0gX1VOREVGSU5FRCkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5fdmlldy5pbmplY3RvckdldCh0b2tlbiwgdGhpcy5fbm9kZUluZGV4LCBfVU5ERUZJTkVEKTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdCA9PT0gX1VOREVGSU5FRCkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5fdmlldy5wYXJlbnRJbmplY3Rvci5nZXQodG9rZW4sIG5vdEZvdW5kVmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=