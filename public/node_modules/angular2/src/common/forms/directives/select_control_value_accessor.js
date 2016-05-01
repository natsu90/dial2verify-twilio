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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('angular2/core');
var control_value_accessor_1 = require('./control_value_accessor');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var SELECT_VALUE_ACCESSOR = lang_1.CONST_EXPR(new core_1.Provider(control_value_accessor_1.NG_VALUE_ACCESSOR, { useExisting: core_1.forwardRef(function () { return SelectControlValueAccessor; }), multi: true }));
function _buildValueString(id, value) {
    if (lang_1.isBlank(id))
        return "" + value;
    if (!lang_1.isPrimitive(value))
        value = "Object";
    return lang_1.StringWrapper.slice(id + ": " + value, 0, 50);
}
function _extractId(valueString) {
    return valueString.split(":")[0];
}
/**
 * The accessor for writing a value and listening to changes on a select element.
 *
 * Note: We have to listen to the 'change' event because 'input' events aren't fired
 * for selects in Firefox and IE:
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1024350
 * https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/4660045/
 *
 */
var SelectControlValueAccessor = (function () {
    function SelectControlValueAccessor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /** @internal */
        this._optionMap = new Map();
        /** @internal */
        this._idCounter = 0;
        this.onChange = function (_) { };
        this.onTouched = function () { };
    }
    SelectControlValueAccessor.prototype.writeValue = function (value) {
        this.value = value;
        var valueString = _buildValueString(this._getOptionId(value), value);
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', valueString);
    };
    SelectControlValueAccessor.prototype.registerOnChange = function (fn) {
        var _this = this;
        this.onChange = function (valueString) { fn(_this._getOptionValue(valueString)); };
    };
    SelectControlValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    /** @internal */
    SelectControlValueAccessor.prototype._registerOption = function () { return (this._idCounter++).toString(); };
    /** @internal */
    SelectControlValueAccessor.prototype._getOptionId = function (value) {
        for (var _i = 0, _a = collection_1.MapWrapper.keys(this._optionMap); _i < _a.length; _i++) {
            var id = _a[_i];
            if (lang_1.looseIdentical(this._optionMap.get(id), value))
                return id;
        }
        return null;
    };
    /** @internal */
    SelectControlValueAccessor.prototype._getOptionValue = function (valueString) {
        var value = this._optionMap.get(_extractId(valueString));
        return lang_1.isPresent(value) ? value : valueString;
    };
    SelectControlValueAccessor = __decorate([
        core_1.Directive({
            selector: 'select[ngControl],select[ngFormControl],select[ngModel]',
            host: { '(change)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
            providers: [SELECT_VALUE_ACCESSOR]
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef])
    ], SelectControlValueAccessor);
    return SelectControlValueAccessor;
}());
exports.SelectControlValueAccessor = SelectControlValueAccessor;
/**
 * Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * ### Example
 *
 * ```
 * <select ngControl="city">
 *   <option *ngFor="#c of cities" [value]="c"></option>
 * </select>
 * ```
 */
var NgSelectOption = (function () {
    function NgSelectOption(_element, _renderer, _select) {
        this._element = _element;
        this._renderer = _renderer;
        this._select = _select;
        if (lang_1.isPresent(this._select))
            this.id = this._select._registerOption();
    }
    Object.defineProperty(NgSelectOption.prototype, "ngValue", {
        set: function (value) {
            if (this._select == null)
                return;
            this._select._optionMap.set(this.id, value);
            this._setElementValue(_buildValueString(this.id, value));
            this._select.writeValue(this._select.value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgSelectOption.prototype, "value", {
        set: function (value) {
            this._setElementValue(value);
            if (lang_1.isPresent(this._select))
                this._select.writeValue(this._select.value);
        },
        enumerable: true,
        configurable: true
    });
    /** @internal */
    NgSelectOption.prototype._setElementValue = function (value) {
        this._renderer.setElementProperty(this._element.nativeElement, 'value', value);
    };
    NgSelectOption.prototype.ngOnDestroy = function () {
        if (lang_1.isPresent(this._select)) {
            this._select._optionMap.delete(this.id);
            this._select.writeValue(this._select.value);
        }
    };
    __decorate([
        core_1.Input('ngValue'), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], NgSelectOption.prototype, "ngValue", null);
    __decorate([
        core_1.Input('value'), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], NgSelectOption.prototype, "value", null);
    NgSelectOption = __decorate([
        core_1.Directive({ selector: 'option' }),
        __param(2, core_1.Optional()),
        __param(2, core_1.Host()), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer, SelectControlValueAccessor])
    ], NgSelectOption);
    return NgSelectOption;
}());
exports.NgSelectOption = NgSelectOption;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0X2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTRubzNaUXZPLnRtcC9hbmd1bGFyMi9zcmMvY29tbW9uL2Zvcm1zL2RpcmVjdGl2ZXMvc2VsZWN0X2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLHFCQVVPLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZCLHVDQUFzRCwwQkFBMEIsQ0FBQyxDQUFBO0FBQ2pGLHFCQU9PLDBCQUEwQixDQUFDLENBQUE7QUFFbEMsMkJBQXlCLGdDQUFnQyxDQUFDLENBQUE7QUFFMUQsSUFBTSxxQkFBcUIsR0FBRyxpQkFBVSxDQUFDLElBQUksZUFBUSxDQUNqRCwwQ0FBaUIsRUFBRSxFQUFDLFdBQVcsRUFBRSxpQkFBVSxDQUFDLGNBQU0sT0FBQSwwQkFBMEIsRUFBMUIsQ0FBMEIsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFFbEcsMkJBQTJCLEVBQVUsRUFBRSxLQUFVO0lBQy9DLEVBQUUsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQyxLQUFHLEtBQU8sQ0FBQztJQUNuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO0lBQzFDLE1BQU0sQ0FBQyxvQkFBYSxDQUFDLEtBQUssQ0FBSSxFQUFFLFVBQUssS0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBRUQsb0JBQW9CLFdBQW1CO0lBQ3JDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRDs7Ozs7Ozs7R0FR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QUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLENBQUM7SUFDSCxDQUFDO0lBeEJEO1FBQUMsWUFBSyxDQUFDLFNBQVMsQ0FBQzs7O2lEQUFBO0lBUWpCO1FBQUMsWUFBSyxDQUFDLE9BQU8sQ0FBQzs7OytDQUFBO0lBakJqQjtRQUFDLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDLENBQUM7bUJBS2pCLGVBQVEsRUFBRTttQkFBRSxXQUFJLEVBQUU7O3NCQUxEO0lBa0NoQyxxQkFBQztBQUFELENBQUMsQUFqQ0QsSUFpQ0M7QUFqQ1ksc0JBQWMsaUJBaUMxQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBSZW5kZXJlcixcbiAgZm9yd2FyZFJlZixcbiAgUHJvdmlkZXIsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBIb3N0LFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsXG59IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge1xuICBDT05TVF9FWFBSLFxuICBTdHJpbmdXcmFwcGVyLFxuICBpc1ByaW1pdGl2ZSxcbiAgaXNQcmVzZW50LFxuICBpc0JsYW5rLFxuICBsb29zZUlkZW50aWNhbFxufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG5pbXBvcnQge01hcFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5cbmNvbnN0IFNFTEVDVF9WQUxVRV9BQ0NFU1NPUiA9IENPTlNUX0VYUFIobmV3IFByb3ZpZGVyKFxuICAgIE5HX1ZBTFVFX0FDQ0VTU09SLCB7dXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3IpLCBtdWx0aTogdHJ1ZX0pKTtcblxuZnVuY3Rpb24gX2J1aWxkVmFsdWVTdHJpbmcoaWQ6IHN0cmluZywgdmFsdWU6IGFueSk6IHN0cmluZyB7XG4gIGlmIChpc0JsYW5rKGlkKSkgcmV0dXJuIGAke3ZhbHVlfWA7XG4gIGlmICghaXNQcmltaXRpdmUodmFsdWUpKSB2YWx1ZSA9IFwiT2JqZWN0XCI7XG4gIHJldHVybiBTdHJpbmdXcmFwcGVyLnNsaWNlKGAke2lkfTogJHt2YWx1ZX1gLCAwLCA1MCk7XG59XG5cbmZ1bmN0aW9uIF9leHRyYWN0SWQodmFsdWVTdHJpbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB2YWx1ZVN0cmluZy5zcGxpdChcIjpcIilbMF07XG59XG5cbi8qKlxuICogVGhlIGFjY2Vzc29yIGZvciB3cml0aW5nIGEgdmFsdWUgYW5kIGxpc3RlbmluZyB0byBjaGFuZ2VzIG9uIGEgc2VsZWN0IGVsZW1lbnQuXG4gKlxuICogTm90ZTogV2UgaGF2ZSB0byBsaXN0ZW4gdG8gdGhlICdjaGFuZ2UnIGV2ZW50IGJlY2F1c2UgJ2lucHV0JyBldmVudHMgYXJlbid0IGZpcmVkXG4gKiBmb3Igc2VsZWN0cyBpbiBGaXJlZm94IGFuZCBJRTpcbiAqIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTEwMjQzNTBcbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1pY3Jvc29mdC5jb20vZW4tdXMvbWljcm9zb2Z0LWVkZ2UvcGxhdGZvcm0vaXNzdWVzLzQ2NjAwNDUvXG4gKlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdzZWxlY3RbbmdDb250cm9sXSxzZWxlY3RbbmdGb3JtQ29udHJvbF0sc2VsZWN0W25nTW9kZWxdJyxcbiAgaG9zdDogeycoY2hhbmdlKSc6ICdvbkNoYW5nZSgkZXZlbnQudGFyZ2V0LnZhbHVlKScsICcoYmx1ciknOiAnb25Ub3VjaGVkKCknfSxcbiAgcHJvdmlkZXJzOiBbU0VMRUNUX1ZBTFVFX0FDQ0VTU09SXVxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvciBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgdmFsdWU6IGFueTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfb3B0aW9uTWFwOiBNYXA8c3RyaW5nLCBhbnk+ID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaWRDb3VudGVyOiBudW1iZXIgPSAwO1xuXG4gIG9uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG4gIG9uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlciwgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdmFyIHZhbHVlU3RyaW5nID0gX2J1aWxkVmFsdWVTdHJpbmcodGhpcy5fZ2V0T3B0aW9uSWQodmFsdWUpLCB2YWx1ZSk7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFByb3BlcnR5KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgdmFsdWVTdHJpbmcpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSAodmFsdWVTdHJpbmc6IHN0cmluZykgPT4geyBmbih0aGlzLl9nZXRPcHRpb25WYWx1ZSh2YWx1ZVN0cmluZykpOyB9O1xuICB9XG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5vblRvdWNoZWQgPSBmbjsgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZ2lzdGVyT3B0aW9uKCk6IHN0cmluZyB7IHJldHVybiAodGhpcy5faWRDb3VudGVyKyspLnRvU3RyaW5nKCk7IH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9nZXRPcHRpb25JZCh2YWx1ZTogYW55KTogc3RyaW5nIHtcbiAgICBmb3IgKGxldCBpZCBvZiBNYXBXcmFwcGVyLmtleXModGhpcy5fb3B0aW9uTWFwKSkge1xuICAgICAgaWYgKGxvb3NlSWRlbnRpY2FsKHRoaXMuX29wdGlvbk1hcC5nZXQoaWQpLCB2YWx1ZSkpIHJldHVybiBpZDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9nZXRPcHRpb25WYWx1ZSh2YWx1ZVN0cmluZzogc3RyaW5nKTogYW55IHtcbiAgICBsZXQgdmFsdWUgPSB0aGlzLl9vcHRpb25NYXAuZ2V0KF9leHRyYWN0SWQodmFsdWVTdHJpbmcpKTtcbiAgICByZXR1cm4gaXNQcmVzZW50KHZhbHVlKSA/IHZhbHVlIDogdmFsdWVTdHJpbmc7XG4gIH1cbn1cblxuLyoqXG4gKiBNYXJrcyBgPG9wdGlvbj5gIGFzIGR5bmFtaWMsIHNvIEFuZ3VsYXIgY2FuIGJlIG5vdGlmaWVkIHdoZW4gb3B0aW9ucyBjaGFuZ2UuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBcbiAqIDxzZWxlY3QgbmdDb250cm9sPVwiY2l0eVwiPlxuICogICA8b3B0aW9uICpuZ0Zvcj1cIiNjIG9mIGNpdGllc1wiIFt2YWx1ZV09XCJjXCI+PC9vcHRpb24+XG4gKiA8L3NlbGVjdD5cbiAqIGBgYFxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ29wdGlvbid9KVxuZXhwb3J0IGNsYXNzIE5nU2VsZWN0T3B0aW9uIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgaWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBIb3N0KCkgcHJpdmF0ZSBfc2VsZWN0OiBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3Nvcikge1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5fc2VsZWN0KSkgdGhpcy5pZCA9IHRoaXMuX3NlbGVjdC5fcmVnaXN0ZXJPcHRpb24oKTtcbiAgfVxuXG4gIEBJbnB1dCgnbmdWYWx1ZScpXG4gIHNldCBuZ1ZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0ID09IG51bGwpIHJldHVybjtcbiAgICB0aGlzLl9zZWxlY3QuX29wdGlvbk1hcC5zZXQodGhpcy5pZCwgdmFsdWUpO1xuICAgIHRoaXMuX3NldEVsZW1lbnRWYWx1ZShfYnVpbGRWYWx1ZVN0cmluZyh0aGlzLmlkLCB2YWx1ZSkpO1xuICAgIHRoaXMuX3NlbGVjdC53cml0ZVZhbHVlKHRoaXMuX3NlbGVjdC52YWx1ZSk7XG4gIH1cblxuICBASW5wdXQoJ3ZhbHVlJylcbiAgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl9zZXRFbGVtZW50VmFsdWUodmFsdWUpO1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy5fc2VsZWN0KSkgdGhpcy5fc2VsZWN0LndyaXRlVmFsdWUodGhpcy5fc2VsZWN0LnZhbHVlKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3NldEVsZW1lbnRWYWx1ZSh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFByb3BlcnR5KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgdmFsdWUpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLl9zZWxlY3QpKSB7XG4gICAgICB0aGlzLl9zZWxlY3QuX29wdGlvbk1hcC5kZWxldGUodGhpcy5pZCk7XG4gICAgICB0aGlzLl9zZWxlY3Qud3JpdGVWYWx1ZSh0aGlzLl9zZWxlY3QudmFsdWUpO1xuICAgIH1cbiAgfVxufVxuIl19