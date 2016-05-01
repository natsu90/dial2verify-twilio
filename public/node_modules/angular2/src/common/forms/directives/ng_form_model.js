'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var exceptions_1 = require('angular2/src/facade/exceptions');
var async_1 = require('angular2/src/facade/async');
var core_1 = require('angular2/core');
var control_container_1 = require('./control_container');
var shared_1 = require('./shared');
var validators_1 = require('../validators');
var formDirectiveProvider = lang_1.CONST_EXPR(new core_1.Provider(control_container_1.ControlContainer, { useExisting: core_1.forwardRef(function () { return NgFormModel; }) }));
/**
 * Binds an existing control group to a DOM element.
 *
 * ### Example ([live demo](http://plnkr.co/edit/jqrVirudY8anJxTMUjTP?p=preview))
 *
 * In this example, we bind the control group to the form element, and we bind the login and
 * password controls to the login and password elements.
 *
 *  ```typescript
 * @Component({
 *   selector: 'my-app',
 *   template: `
 *     <div>
 *       <h2>NgFormModel Example</h2>
 *       <form [ngFormModel]="loginForm">
 *         <p>Login: <input type="text" ngControl="login"></p>
 *         <p>Password: <input type="password" ngControl="password"></p>
 *       </form>
 *       <p>Value:</p>
 *       <pre>{{value}}</pre>
 *     </div>
 *   `,
 *   directives: [FORM_DIRECTIVES]
 * })
 * export class App {
 *   loginForm: ControlGroup;
 *
 *   constructor() {
 *     this.loginForm = new ControlGroup({
 *       login: new Control(""),
 *       password: new Control("")
 *     });
 *   }
 *
 *   get value(): string {
 *     return JSON.stringify(this.loginForm.value, null, 2);
 *   }
 * }
 *  ```
 *
 * We can also use ngModel to bind a domain model to the form.
 *
 *  ```typescript
 * @Component({
 *      selector: "login-comp",
 *      directives: [FORM_DIRECTIVES],
 *      template: `
 *        <form [ngFormModel]='loginForm'>
 *          Login <input type='text' ngControl='login' [(ngModel)]='credentials.login'>
 *          Password <input type='password' ngControl='password'
 *                          [(ngModel)]='credentials.password'>
 *          <button (click)="onLogin()">Login</button>
 *        </form>`
 *      })
 * class LoginComp {
 *  credentials: {login: string, password: string};
 *  loginForm: ControlGroup;
 *
 *  constructor() {
 *    this.loginForm = new ControlGroup({
 *      login: new Control(""),
 *      password: new Control("")
 *    });
 *  }
 *
 *  onLogin(): void {
 *    // this.credentials.login === 'some login'
 *    // this.credentials.password === 'some password'
 *  }
 * }
 *  ```
 */
var NgFormModel = (function (_super) {
    __extends(NgFormModel, _super);
    function NgFormModel(_validators, _asyncValidators) {
        _super.call(this);
        this._validators = _validators;
        this._asyncValidators = _asyncValidators;
        this.form = null;
        this.directives = [];
        this.ngSubmit = new async_1.EventEmitter();
    }
    NgFormModel.prototype.ngOnChanges = function (changes) {
        this._checkFormPresent();
        if (collection_1.StringMapWrapper.contains(changes, "form")) {
            var sync = shared_1.composeValidators(this._validators);
            this.form.validator = validators_1.Validators.compose([this.form.validator, sync]);
            var async = shared_1.composeAsyncValidators(this._asyncValidators);
            this.form.asyncValidator = validators_1.Validators.composeAsync([this.form.asyncValidator, async]);
            this.form.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        }
        this._updateDomValue();
    };
    Object.defineProperty(NgFormModel.prototype, "formDirective", {
        get: function () { return this; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgFormModel.prototype, "control", {
        get: function () { return this.form; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgFormModel.prototype, "path", {
        get: function () { return []; },
        enumerable: true,
        configurable: true
    });
    NgFormModel.prototype.addControl = function (dir) {
        var ctrl = this.form.find(dir.path);
        shared_1.setUpControl(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
        this.directives.push(dir);
    };
    NgFormModel.prototype.getControl = function (dir) { return this.form.find(dir.path); };
    NgFormModel.prototype.removeControl = function (dir) { collection_1.ListWrapper.remove(this.directives, dir); };
    NgFormModel.prototype.addControlGroup = function (dir) {
        var ctrl = this.form.find(dir.path);
        shared_1.setUpControlGroup(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
    };
    NgFormModel.prototype.removeControlGroup = function (dir) { };
    NgFormModel.prototype.getControlGroup = function (dir) {
        return this.form.find(dir.path);
    };
    NgFormModel.prototype.updateModel = function (dir, value) {
        var ctrl = this.form.find(dir.path);
        ctrl.updateValue(value);
    };
    NgFormModel.prototype.onSubmit = function () {
        async_1.ObservableWrapper.callEmit(this.ngSubmit, null);
        return false;
    };
    /** @internal */
    NgFormModel.prototype._updateDomValue = function () {
        var _this = this;
        this.directives.forEach(function (dir) {
            var ctrl = _this.form.find(dir.path);
            dir.valueAccessor.writeValue(ctrl.value);
        });
    };
    NgFormModel.prototype._checkFormPresent = function () {
        if (lang_1.isBlank(this.form)) {
            throw new exceptions_1.BaseException("ngFormModel expects a form. Please pass one in. Example: <form [ngFormModel]=\"myCoolForm\">");
        }
    };
    NgFormModel = __decorate([
        core_1.Directive({
            selector: '[ngFormModel]',
            bindings: [formDirectiveProvider],
            inputs: ['form: ngFormModel'],
            host: { '(submit)': 'onSubmit()' },
            outputs: ['ngSubmit'],
            exportAs: 'ngForm'
        }),
        __param(0, core_1.Optional()),
        __param(0, core_1.Self()),
        __param(0, core_1.Inject(validators_1.NG_VALIDATORS)),
        __param(1, core_1.Optional()),
        __param(1, core_1.Self()),
        __param(1, core_1.Inject(validators_1.NG_ASYNC_VALIDATORS)), 
        __metadata('design:paramtypes', [Array, Array])
    ], NgFormModel);
    return NgFormModel;
}(control_container_1.ControlContainer));
exports.NgFormModel = NgFormModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9ybV9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtNG5vM1pRdk8udG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vZm9ybXMvZGlyZWN0aXZlcy9uZ19mb3JtX21vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFCQUFrQywwQkFBMEIsQ0FBQyxDQUFBO0FBQzdELDJCQUE0QyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQzdFLDJCQUE0QixnQ0FBZ0MsQ0FBQyxDQUFBO0FBQzdELHNCQUE4QywyQkFBMkIsQ0FBQyxDQUFBO0FBQzFFLHFCQVNPLGVBQWUsQ0FBQyxDQUFBO0FBR3ZCLGtDQUErQixxQkFBcUIsQ0FBQyxDQUFBO0FBR3JELHVCQUF5RixVQUFVLENBQUMsQ0FBQTtBQUNwRywyQkFBNkQsZUFBZSxDQUFDLENBQUE7QUFFN0UsSUFBTSxxQkFBcUIsR0FDdkIsaUJBQVUsQ0FBQyxJQUFJLGVBQVEsQ0FBQyxvQ0FBZ0IsRUFBRSxFQUFDLFdBQVcsRUFBRSxpQkFBVSxDQUFDLGNBQU0sT0FBQSxXQUFXLEVBQVgsQ0FBVyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFFN0Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUVHO0FBU0g7SUFBaUMsK0JBQWdCO0lBTS9DLHFCQUErRCxXQUFrQixFQUNaLGdCQUF1QjtRQUMxRixpQkFBTyxDQUFDO1FBRnFELGdCQUFXLEdBQVgsV0FBVyxDQUFPO1FBQ1oscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFPO1FBTDVGLFNBQUksR0FBaUIsSUFBSSxDQUFDO1FBQzFCLGVBQVUsR0FBZ0IsRUFBRSxDQUFDO1FBQzdCLGFBQVEsR0FBRyxJQUFJLG9CQUFZLEVBQUUsQ0FBQztJQUs5QixDQUFDO0lBRUQsaUNBQVcs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O0FBQUQsQ0FBQyxBQS9FRCxDQUFpQyxvQ0FBZ0IsR0ErRWhEO0FBL0VZLG1CQUFXLGNBK0V2QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDT05TVF9FWFBSLCBpc0JsYW5rfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtMaXN0V3JhcHBlciwgU3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7T2JzZXJ2YWJsZVdyYXBwZXIsIEV2ZW50RW1pdHRlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYyc7XG5pbXBvcnQge1xuICBTaW1wbGVDaGFuZ2UsXG4gIE9uQ2hhbmdlcyxcbiAgRGlyZWN0aXZlLFxuICBmb3J3YXJkUmVmLFxuICBQcm92aWRlcixcbiAgSW5qZWN0LFxuICBPcHRpb25hbCxcbiAgU2VsZlxufSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICcuL25nX2NvbnRyb2wnO1xuaW1wb3J0IHtOZ0NvbnRyb2xHcm91cH0gZnJvbSAnLi9uZ19jb250cm9sX2dyb3VwJztcbmltcG9ydCB7Q29udHJvbENvbnRhaW5lcn0gZnJvbSAnLi9jb250cm9sX2NvbnRhaW5lcic7XG5pbXBvcnQge0Zvcm19IGZyb20gJy4vZm9ybV9pbnRlcmZhY2UnO1xuaW1wb3J0IHtDb250cm9sLCBDb250cm9sR3JvdXB9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7c2V0VXBDb250cm9sLCBzZXRVcENvbnRyb2xHcm91cCwgY29tcG9zZVZhbGlkYXRvcnMsIGNvbXBvc2VBc3luY1ZhbGlkYXRvcnN9IGZyb20gJy4vc2hhcmVkJztcbmltcG9ydCB7VmFsaWRhdG9ycywgTkdfVkFMSURBVE9SUywgTkdfQVNZTkNfVkFMSURBVE9SU30gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cbmNvbnN0IGZvcm1EaXJlY3RpdmVQcm92aWRlciA9XG4gICAgQ09OU1RfRVhQUihuZXcgUHJvdmlkZXIoQ29udHJvbENvbnRhaW5lciwge3VzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nRm9ybU1vZGVsKX0pKTtcblxuLyoqXG4gKiBCaW5kcyBhbiBleGlzdGluZyBjb250cm9sIGdyb3VwIHRvIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogIyMjIEV4YW1wbGUgKFtsaXZlIGRlbW9dKGh0dHA6Ly9wbG5rci5jby9lZGl0L2pxclZpcnVkWThhbkp4VE1ValRQP3A9cHJldmlldykpXG4gKlxuICogSW4gdGhpcyBleGFtcGxlLCB3ZSBiaW5kIHRoZSBjb250cm9sIGdyb3VwIHRvIHRoZSBmb3JtIGVsZW1lbnQsIGFuZCB3ZSBiaW5kIHRoZSBsb2dpbiBhbmRcbiAqIHBhc3N3b3JkIGNvbnRyb2xzIHRvIHRoZSBsb2dpbiBhbmQgcGFzc3dvcmQgZWxlbWVudHMuXG4gKlxuICogIGBgYHR5cGVzY3JpcHRcbiAqIEBDb21wb25lbnQoe1xuICogICBzZWxlY3RvcjogJ215LWFwcCcsXG4gKiAgIHRlbXBsYXRlOiBgXG4gKiAgICAgPGRpdj5cbiAqICAgICAgIDxoMj5OZ0Zvcm1Nb2RlbCBFeGFtcGxlPC9oMj5cbiAqICAgICAgIDxmb3JtIFtuZ0Zvcm1Nb2RlbF09XCJsb2dpbkZvcm1cIj5cbiAqICAgICAgICAgPHA+TG9naW46IDxpbnB1dCB0eXBlPVwidGV4dFwiIG5nQ29udHJvbD1cImxvZ2luXCI+PC9wPlxuICogICAgICAgICA8cD5QYXNzd29yZDogPGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIG5nQ29udHJvbD1cInBhc3N3b3JkXCI+PC9wPlxuICogICAgICAgPC9mb3JtPlxuICogICAgICAgPHA+VmFsdWU6PC9wPlxuICogICAgICAgPHByZT57e3ZhbHVlfX08L3ByZT5cbiAqICAgICA8L2Rpdj5cbiAqICAgYCxcbiAqICAgZGlyZWN0aXZlczogW0ZPUk1fRElSRUNUSVZFU11cbiAqIH0pXG4gKiBleHBvcnQgY2xhc3MgQXBwIHtcbiAqICAgbG9naW5Gb3JtOiBDb250cm9sR3JvdXA7XG4gKlxuICogICBjb25zdHJ1Y3RvcigpIHtcbiAqICAgICB0aGlzLmxvZ2luRm9ybSA9IG5ldyBDb250cm9sR3JvdXAoe1xuICogICAgICAgbG9naW46IG5ldyBDb250cm9sKFwiXCIpLFxuICogICAgICAgcGFzc3dvcmQ6IG5ldyBDb250cm9sKFwiXCIpXG4gKiAgICAgfSk7XG4gKiAgIH1cbiAqXG4gKiAgIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICogICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmxvZ2luRm9ybS52YWx1ZSwgbnVsbCwgMik7XG4gKiAgIH1cbiAqIH1cbiAqICBgYGBcbiAqXG4gKiBXZSBjYW4gYWxzbyB1c2UgbmdNb2RlbCB0byBiaW5kIGEgZG9tYWluIG1vZGVsIHRvIHRoZSBmb3JtLlxuICpcbiAqICBgYGB0eXBlc2NyaXB0XG4gKiBAQ29tcG9uZW50KHtcbiAqICAgICAgc2VsZWN0b3I6IFwibG9naW4tY29tcFwiLFxuICogICAgICBkaXJlY3RpdmVzOiBbRk9STV9ESVJFQ1RJVkVTXSxcbiAqICAgICAgdGVtcGxhdGU6IGBcbiAqICAgICAgICA8Zm9ybSBbbmdGb3JtTW9kZWxdPSdsb2dpbkZvcm0nPlxuICogICAgICAgICAgTG9naW4gPGlucHV0IHR5cGU9J3RleHQnIG5nQ29udHJvbD0nbG9naW4nIFsobmdNb2RlbCldPSdjcmVkZW50aWFscy5sb2dpbic+XG4gKiAgICAgICAgICBQYXNzd29yZCA8aW5wdXQgdHlwZT0ncGFzc3dvcmQnIG5nQ29udHJvbD0ncGFzc3dvcmQnXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09J2NyZWRlbnRpYWxzLnBhc3N3b3JkJz5cbiAqICAgICAgICAgIDxidXR0b24gKGNsaWNrKT1cIm9uTG9naW4oKVwiPkxvZ2luPC9idXR0b24+XG4gKiAgICAgICAgPC9mb3JtPmBcbiAqICAgICAgfSlcbiAqIGNsYXNzIExvZ2luQ29tcCB7XG4gKiAgY3JlZGVudGlhbHM6IHtsb2dpbjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nfTtcbiAqICBsb2dpbkZvcm06IENvbnRyb2xHcm91cDtcbiAqXG4gKiAgY29uc3RydWN0b3IoKSB7XG4gKiAgICB0aGlzLmxvZ2luRm9ybSA9IG5ldyBDb250cm9sR3JvdXAoe1xuICogICAgICBsb2dpbjogbmV3IENvbnRyb2woXCJcIiksXG4gKiAgICAgIHBhc3N3b3JkOiBuZXcgQ29udHJvbChcIlwiKVxuICogICAgfSk7XG4gKiAgfVxuICpcbiAqICBvbkxvZ2luKCk6IHZvaWQge1xuICogICAgLy8gdGhpcy5jcmVkZW50aWFscy5sb2dpbiA9PT0gJ3NvbWUgbG9naW4nXG4gKiAgICAvLyB0aGlzLmNyZWRlbnRpYWxzLnBhc3N3b3JkID09PSAnc29tZSBwYXNzd29yZCdcbiAqICB9XG4gKiB9XG4gKiAgYGBgXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ0Zvcm1Nb2RlbF0nLFxuICBiaW5kaW5nczogW2Zvcm1EaXJlY3RpdmVQcm92aWRlcl0sXG4gIGlucHV0czogWydmb3JtOiBuZ0Zvcm1Nb2RlbCddLFxuICBob3N0OiB7JyhzdWJtaXQpJzogJ29uU3VibWl0KCknfSxcbiAgb3V0cHV0czogWyduZ1N1Ym1pdCddLFxuICBleHBvcnRBczogJ25nRm9ybSdcbn0pXG5leHBvcnQgY2xhc3MgTmdGb3JtTW9kZWwgZXh0ZW5kcyBDb250cm9sQ29udGFpbmVyIGltcGxlbWVudHMgRm9ybSxcbiAgICBPbkNoYW5nZXMge1xuICBmb3JtOiBDb250cm9sR3JvdXAgPSBudWxsO1xuICBkaXJlY3RpdmVzOiBOZ0NvbnRyb2xbXSA9IFtdO1xuICBuZ1N1Ym1pdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfVkFMSURBVE9SUykgcHJpdmF0ZSBfdmFsaWRhdG9yczogYW55W10sXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19BU1lOQ19WQUxJREFUT1JTKSBwcml2YXRlIF9hc3luY1ZhbGlkYXRvcnM6IGFueVtdKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IHtba2V5OiBzdHJpbmddOiBTaW1wbGVDaGFuZ2V9KTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tGb3JtUHJlc2VudCgpO1xuICAgIGlmIChTdHJpbmdNYXBXcmFwcGVyLmNvbnRhaW5zKGNoYW5nZXMsIFwiZm9ybVwiKSkge1xuICAgICAgdmFyIHN5bmMgPSBjb21wb3NlVmFsaWRhdG9ycyh0aGlzLl92YWxpZGF0b3JzKTtcbiAgICAgIHRoaXMuZm9ybS52YWxpZGF0b3IgPSBWYWxpZGF0b3JzLmNvbXBvc2UoW3RoaXMuZm9ybS52YWxpZGF0b3IsIHN5bmNdKTtcblxuICAgICAgdmFyIGFzeW5jID0gY29tcG9zZUFzeW5jVmFsaWRhdG9ycyh0aGlzLl9hc3luY1ZhbGlkYXRvcnMpO1xuICAgICAgdGhpcy5mb3JtLmFzeW5jVmFsaWRhdG9yID0gVmFsaWRhdG9ycy5jb21wb3NlQXN5bmMoW3RoaXMuZm9ybS5hc3luY1ZhbGlkYXRvciwgYXN5bmNdKTtcblxuICAgICAgdGhpcy5mb3JtLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlRG9tVmFsdWUoKTtcbiAgfVxuXG4gIGdldCBmb3JtRGlyZWN0aXZlKCk6IEZvcm0geyByZXR1cm4gdGhpczsgfVxuXG4gIGdldCBjb250cm9sKCk6IENvbnRyb2xHcm91cCB7IHJldHVybiB0aGlzLmZvcm07IH1cblxuICBnZXQgcGF0aCgpOiBzdHJpbmdbXSB7IHJldHVybiBbXTsgfVxuXG4gIGFkZENvbnRyb2woZGlyOiBOZ0NvbnRyb2wpOiB2b2lkIHtcbiAgICB2YXIgY3RybDogYW55ID0gdGhpcy5mb3JtLmZpbmQoZGlyLnBhdGgpO1xuICAgIHNldFVwQ29udHJvbChjdHJsLCBkaXIpO1xuICAgIGN0cmwudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBmYWxzZX0pO1xuICAgIHRoaXMuZGlyZWN0aXZlcy5wdXNoKGRpcik7XG4gIH1cblxuICBnZXRDb250cm9sKGRpcjogTmdDb250cm9sKTogQ29udHJvbCB7IHJldHVybiA8Q29udHJvbD50aGlzLmZvcm0uZmluZChkaXIucGF0aCk7IH1cblxuICByZW1vdmVDb250cm9sKGRpcjogTmdDb250cm9sKTogdm9pZCB7IExpc3RXcmFwcGVyLnJlbW92ZSh0aGlzLmRpcmVjdGl2ZXMsIGRpcik7IH1cblxuICBhZGRDb250cm9sR3JvdXAoZGlyOiBOZ0NvbnRyb2xHcm91cCkge1xuICAgIHZhciBjdHJsOiBhbnkgPSB0aGlzLmZvcm0uZmluZChkaXIucGF0aCk7XG4gICAgc2V0VXBDb250cm9sR3JvdXAoY3RybCwgZGlyKTtcbiAgICBjdHJsLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogZmFsc2V9KTtcbiAgfVxuXG4gIHJlbW92ZUNvbnRyb2xHcm91cChkaXI6IE5nQ29udHJvbEdyb3VwKSB7fVxuXG4gIGdldENvbnRyb2xHcm91cChkaXI6IE5nQ29udHJvbEdyb3VwKTogQ29udHJvbEdyb3VwIHtcbiAgICByZXR1cm4gPENvbnRyb2xHcm91cD50aGlzLmZvcm0uZmluZChkaXIucGF0aCk7XG4gIH1cblxuICB1cGRhdGVNb2RlbChkaXI6IE5nQ29udHJvbCwgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHZhciBjdHJswqAgPSA8Q29udHJvbD50aGlzLmZvcm0uZmluZChkaXIucGF0aCk7XG4gICAgY3RybC51cGRhdGVWYWx1ZSh2YWx1ZSk7XG4gIH1cblxuICBvblN1Ym1pdCgpOiBib29sZWFuIHtcbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm5nU3VibWl0LCBudWxsKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVEb21WYWx1ZSgpIHtcbiAgICB0aGlzLmRpcmVjdGl2ZXMuZm9yRWFjaChkaXIgPT4ge1xuICAgICAgdmFyIGN0cmw6IGFueSA9IHRoaXMuZm9ybS5maW5kKGRpci5wYXRoKTtcbiAgICAgIGRpci52YWx1ZUFjY2Vzc29yLndyaXRlVmFsdWUoY3RybC52YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9jaGVja0Zvcm1QcmVzZW50KCkge1xuICAgIGlmIChpc0JsYW5rKHRoaXMuZm9ybSkpIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICAgIGBuZ0Zvcm1Nb2RlbCBleHBlY3RzIGEgZm9ybS4gUGxlYXNlIHBhc3Mgb25lIGluLiBFeGFtcGxlOiA8Zm9ybSBbbmdGb3JtTW9kZWxdPVwibXlDb29sRm9ybVwiPmApO1xuICAgIH1cbiAgfVxufVxuIl19