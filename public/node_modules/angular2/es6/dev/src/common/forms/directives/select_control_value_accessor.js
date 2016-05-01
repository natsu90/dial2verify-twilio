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
import { Directive, Renderer, forwardRef, Provider, ElementRef, Input, Host, Optional } from 'angular2/core';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
import { CONST_EXPR, StringWrapper, isPrimitive, isPresent, isBlank, looseIdentical } from 'angular2/src/facade/lang';
import { MapWrapper } from 'angular2/src/facade/collection';
const SELECT_VALUE_ACCESSOR = CONST_EXPR(new Provider(NG_VALUE_ACCESSOR, { useExisting: forwardRef(() => SelectControlValueAccessor), multi: true }));
function _buildValueString(id, value) {
    if (isBlank(id))
        return `${value}`;
    if (!isPrimitive(value))
        value = "Object";
    return StringWrapper.slice(`${id}: ${value}`, 0, 50);
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
export let SelectControlValueAccessor = class SelectControlValueAccessor {
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /** @internal */
        this._optionMap = new Map();
        /** @internal */
        this._idCounter = 0;
        this.onChange = (_) => { };
        this.onTouched = () => { };
    }
    writeValue(value) {
        this.value = value;
        var valueString = _buildValueString(this._getOptionId(value), value);
        this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', valueString);
    }
    registerOnChange(fn) {
        this.onChange = (valueString) => { fn(this._getOptionValue(valueString)); };
    }
    registerOnTouched(fn) { this.onTouched = fn; }
    /** @internal */
    _registerOption() { return (this._idCounter++).toString(); }
    /** @internal */
    _getOptionId(value) {
        for (let id of MapWrapper.keys(this._optionMap)) {
            if (looseIdentical(this._optionMap.get(id), value))
                return id;
        }
        return null;
    }
    /** @internal */
    _getOptionValue(valueString) {
        let value = this._optionMap.get(_extractId(valueString));
        return isPresent(value) ? value : valueString;
    }
};
SelectControlValueAccessor = __decorate([
    Directive({
        selector: 'select[ngControl],select[ngFormControl],select[ngModel]',
        host: { '(change)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
        providers: [SELECT_VALUE_ACCESSOR]
    }), 
    __metadata('design:paramtypes', [Renderer, ElementRef])
], SelectControlValueAccessor);
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
export let NgSelectOption = class NgSelectOption {
    constructor(_element, _renderer, _select) {
        this._element = _element;
        this._renderer = _renderer;
        this._select = _select;
        if (isPresent(this._select))
            this.id = this._select._registerOption();
    }
    set ngValue(value) {
        if (this._select == null)
            return;
        this._select._optionMap.set(this.id, value);
        this._setElementValue(_buildValueString(this.id, value));
        this._select.writeValue(this._select.value);
    }
    set value(value) {
        this._setElementValue(value);
        if (isPresent(this._select))
            this._select.writeValue(this._select.value);
    }
    /** @internal */
    _setElementValue(value) {
        this._renderer.setElementProperty(this._element.nativeElement, 'value', value);
    }
    ngOnDestroy() {
        if (isPresent(this._select)) {
            this._select._optionMap.delete(this.id);
            this._select.writeValue(this._select.value);
        }
    }
};
__decorate([
    Input('ngValue'), 
    __metadata('design:type', Object), 
    __metadata('design:paramtypes', [Object])
], NgSelectOption.prototype, "ngValue", null);
__decorate([
    Input('value'), 
    __metadata('design:type', Object), 
    __metadata('design:paramtypes', [Object])
], NgSelectOption.prototype, "value", null);
NgSelectOption = __decorate([
    Directive({ selector: 'option' }),
    __param(2, Optional()),
    __param(2, Host()), 
    __metadata('design:paramtypes', [ElementRef, Renderer, SelectControlValueAccessor])
], NgSelectOption);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0X2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTlEMWlHUVZHLnRtcC9hbmd1bGFyMi9zcmMvY29tbW9uL2Zvcm1zL2RpcmVjdGl2ZXMvc2VsZWN0X2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O09BQU8sRUFDTCxTQUFTLEVBQ1QsUUFBUSxFQUNSLFVBQVUsRUFDVixRQUFRLEVBQ1IsVUFBVSxFQUNWLEtBQUssRUFDTCxJQUFJLEVBRUosUUFBUSxFQUNULE1BQU0sZUFBZTtPQUNmLEVBQUMsaUJBQWlCLEVBQXVCLE1BQU0sMEJBQTBCO09BQ3pFLEVBQ0wsVUFBVSxFQUNWLGFBQWEsRUFDYixXQUFXLEVBQ1gsU0FBUyxFQUNULE9BQU8sRUFDUCxjQUFjLEVBQ2YsTUFBTSwwQkFBMEI7T0FFMUIsRUFBQyxVQUFVLEVBQUMsTUFBTSxnQ0FBZ0M7QUFFekQsTUFBTSxxQkFBcUIsR0FBRyxVQUFVLENBQUMsSUFBSSxRQUFRLENBQ2pELGlCQUFpQixFQUFFLEVBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxNQUFNLDBCQUEwQixDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQztBQUVsRywyQkFBMkIsRUFBVSxFQUFFLEtBQVU7SUFDL0MsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUM7SUFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO0lBQzFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENB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LFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQXpCQztJQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7Ozs2Q0FBQTtBQVFqQjtJQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7OzsyQ0FBQTtBQWpCakI7SUFBQyxTQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDLENBQUM7ZUFLakIsUUFBUSxFQUFFO2VBQUUsSUFBSSxFQUFFOztrQkFMRDtBQWtDL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIFJlbmRlcmVyLFxuICBmb3J3YXJkUmVmLFxuICBQcm92aWRlcixcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIEhvc3QsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWxcbn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge05HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7XG4gIENPTlNUX0VYUFIsXG4gIFN0cmluZ1dyYXBwZXIsXG4gIGlzUHJpbWl0aXZlLFxuICBpc1ByZXNlbnQsXG4gIGlzQmxhbmssXG4gIGxvb3NlSWRlbnRpY2FsXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbmltcG9ydCB7TWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcblxuY29uc3QgU0VMRUNUX1ZBTFVFX0FDQ0VTU09SID0gQ09OU1RfRVhQUihuZXcgUHJvdmlkZXIoXG4gICAgTkdfVkFMVUVfQUNDRVNTT1IsIHt1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvciksIG11bHRpOiB0cnVlfSkpO1xuXG5mdW5jdGlvbiBfYnVpbGRWYWx1ZVN0cmluZyhpZDogc3RyaW5nLCB2YWx1ZTogYW55KTogc3RyaW5nIHtcbiAgaWYgKGlzQmxhbmsoaWQpKSByZXR1cm4gYCR7dmFsdWV9YDtcbiAgaWYgKCFpc1ByaW1pdGl2ZSh2YWx1ZSkpIHZhbHVlID0gXCJPYmplY3RcIjtcbiAgcmV0dXJuIFN0cmluZ1dyYXBwZXIuc2xpY2UoYCR7aWR9OiAke3ZhbHVlfWAsIDAsIDUwKTtcbn1cblxuZnVuY3Rpb24gX2V4dHJhY3RJZCh2YWx1ZVN0cmluZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhbHVlU3RyaW5nLnNwbGl0KFwiOlwiKVswXTtcbn1cblxuLyoqXG4gKiBUaGUgYWNjZXNzb3IgZm9yIHdyaXRpbmcgYSB2YWx1ZSBhbmQgbGlzdGVuaW5nIHRvIGNoYW5nZXMgb24gYSBzZWxlY3QgZWxlbWVudC5cbiAqXG4gKiBOb3RlOiBXZSBoYXZlIHRvIGxpc3RlbiB0byB0aGUgJ2NoYW5nZScgZXZlbnQgYmVjYXVzZSAnaW5wdXQnIGV2ZW50cyBhcmVuJ3QgZmlyZWRcbiAqIGZvciBzZWxlY3RzIGluIEZpcmVmb3ggYW5kIElFOlxuICogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTAyNDM1MFxuICogaHR0cHM6Ly9kZXZlbG9wZXIubWljcm9zb2Z0LmNvbS9lbi11cy9taWNyb3NvZnQtZWRnZS9wbGF0Zm9ybS9pc3N1ZXMvNDY2MDA0NS9cbiAqXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ3NlbGVjdFtuZ0NvbnRyb2xdLHNlbGVjdFtuZ0Zvcm1Db250cm9sXSxzZWxlY3RbbmdNb2RlbF0nLFxuICBob3N0OiB7JyhjaGFuZ2UpJzogJ29uQ2hhbmdlKCRldmVudC50YXJnZXQudmFsdWUpJywgJyhibHVyKSc6ICdvblRvdWNoZWQoKSd9LFxuICBwcm92aWRlcnM6IFtTRUxFQ1RfVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICB2YWx1ZTogYW55O1xuICAvKiogQGludGVybmFsICovXG4gIF9vcHRpb25NYXA6IE1hcDxzdHJpbmcsIGFueT4gPSBuZXcgTWFwPHN0cmluZywgYW55PigpO1xuICAvKiogQGludGVybmFsICovXG4gIF9pZENvdW50ZXI6IG51bWJlciA9IDA7XG5cbiAgb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcbiAgb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyLCBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB2YXIgdmFsdWVTdHJpbmcgPSBfYnVpbGRWYWx1ZVN0cmluZyh0aGlzLl9nZXRPcHRpb25JZCh2YWx1ZSksIHZhbHVlKTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAndmFsdWUnLCB2YWx1ZVN0cmluZyk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gYW55KTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZSA9ICh2YWx1ZVN0cmluZzogc3RyaW5nKSA9PiB7IGZuKHRoaXMuX2dldE9wdGlvblZhbHVlKHZhbHVlU3RyaW5nKSk7IH07XG4gIH1cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IGFueSk6IHZvaWQgeyB0aGlzLm9uVG91Y2hlZCA9IGZuOyB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVnaXN0ZXJPcHRpb24oKTogc3RyaW5nIHsgcmV0dXJuICh0aGlzLl9pZENvdW50ZXIrKykudG9TdHJpbmcoKTsgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2dldE9wdGlvbklkKHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuICAgIGZvciAobGV0IGlkIG9mIE1hcFdyYXBwZXIua2V5cyh0aGlzLl9vcHRpb25NYXApKSB7XG4gICAgICBpZiAobG9vc2VJZGVudGljYWwodGhpcy5fb3B0aW9uTWFwLmdldChpZCksIHZhbHVlKSkgcmV0dXJuIGlkO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2dldE9wdGlvblZhbHVlKHZhbHVlU3RyaW5nOiBzdHJpbmcpOiBhbnkge1xuICAgIGxldCB2YWx1ZSA9IHRoaXMuX29wdGlvbk1hcC5nZXQoX2V4dHJhY3RJZCh2YWx1ZVN0cmluZykpO1xuICAgIHJldHVybiBpc1ByZXNlbnQodmFsdWUpID8gdmFsdWUgOiB2YWx1ZVN0cmluZztcbiAgfVxufVxuXG4vKipcbiAqIE1hcmtzIGA8b3B0aW9uPmAgYXMgZHluYW1pYywgc28gQW5ndWxhciBjYW4gYmUgbm90aWZpZWQgd2hlbiBvcHRpb25zIGNoYW5nZS5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYFxuICogPHNlbGVjdCBuZ0NvbnRyb2w9XCJjaXR5XCI+XG4gKiAgIDxvcHRpb24gKm5nRm9yPVwiI2Mgb2YgY2l0aWVzXCIgW3ZhbHVlXT1cImNcIj48L29wdGlvbj5cbiAqIDwvc2VsZWN0PlxuICogYGBgXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnb3B0aW9uJ30pXG5leHBvcnQgY2xhc3MgTmdTZWxlY3RPcHRpb24gaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBpZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEhvc3QoKSBwcml2YXRlIF9zZWxlY3Q6IFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yKSB7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLl9zZWxlY3QpKSB0aGlzLmlkID0gdGhpcy5fc2VsZWN0Ll9yZWdpc3Rlck9wdGlvbigpO1xuICB9XG5cbiAgQElucHV0KCduZ1ZhbHVlJylcbiAgc2V0IG5nVmFsdWUodmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLl9zZWxlY3QgPT0gbnVsbCkgcmV0dXJuO1xuICAgIHRoaXMuX3NlbGVjdC5fb3B0aW9uTWFwLnNldCh0aGlzLmlkLCB2YWx1ZSk7XG4gICAgdGhpcy5fc2V0RWxlbWVudFZhbHVlKF9idWlsZFZhbHVlU3RyaW5nKHRoaXMuaWQsIHZhbHVlKSk7XG4gICAgdGhpcy5fc2VsZWN0LndyaXRlVmFsdWUodGhpcy5fc2VsZWN0LnZhbHVlKTtcbiAgfVxuXG4gIEBJbnB1dCgndmFsdWUnKVxuICBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xuICAgIHRoaXMuX3NldEVsZW1lbnRWYWx1ZSh2YWx1ZSk7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLl9zZWxlY3QpKSB0aGlzLl9zZWxlY3Qud3JpdGVWYWx1ZSh0aGlzLl9zZWxlY3QudmFsdWUpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc2V0RWxlbWVudFZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50UHJvcGVydHkodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCAndmFsdWUnLCB2YWx1ZSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuX3NlbGVjdCkpIHtcbiAgICAgIHRoaXMuX3NlbGVjdC5fb3B0aW9uTWFwLmRlbGV0ZSh0aGlzLmlkKTtcbiAgICAgIHRoaXMuX3NlbGVjdC53cml0ZVZhbHVlKHRoaXMuX3NlbGVjdC52YWx1ZSk7XG4gICAgfVxuICB9XG59XG4iXX0=