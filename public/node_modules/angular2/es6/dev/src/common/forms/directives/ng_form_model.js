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
import { CONST_EXPR, isBlank } from 'angular2/src/facade/lang';
import { ListWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { BaseException } from 'angular2/src/facade/exceptions';
import { ObservableWrapper, EventEmitter } from 'angular2/src/facade/async';
import { Directive, forwardRef, Provider, Inject, Optional, Self } from 'angular2/core';
import { ControlContainer } from './control_container';
import { setUpControl, setUpControlGroup, composeValidators, composeAsyncValidators } from './shared';
import { Validators, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '../validators';
const formDirectiveProvider = CONST_EXPR(new Provider(ControlContainer, { useExisting: forwardRef(() => NgFormModel) }));
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
export let NgFormModel = class NgFormModel extends ControlContainer {
    constructor(_validators, _asyncValidators) {
        super();
        this._validators = _validators;
        this._asyncValidators = _asyncValidators;
        this.form = null;
        this.directives = [];
        this.ngSubmit = new EventEmitter();
    }
    ngOnChanges(changes) {
        this._checkFormPresent();
        if (StringMapWrapper.contains(changes, "form")) {
            var sync = composeValidators(this._validators);
            this.form.validator = Validators.compose([this.form.validator, sync]);
            var async = composeAsyncValidators(this._asyncValidators);
            this.form.asyncValidator = Validators.composeAsync([this.form.asyncValidator, async]);
            this.form.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        }
        this._updateDomValue();
    }
    get formDirective() { return this; }
    get control() { return this.form; }
    get path() { return []; }
    addControl(dir) {
        var ctrl = this.form.find(dir.path);
        setUpControl(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
        this.directives.push(dir);
    }
    getControl(dir) { return this.form.find(dir.path); }
    removeControl(dir) { ListWrapper.remove(this.directives, dir); }
    addControlGroup(dir) {
        var ctrl = this.form.find(dir.path);
        setUpControlGroup(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
    }
    removeControlGroup(dir) { }
    getControlGroup(dir) {
        return this.form.find(dir.path);
    }
    updateModel(dir, value) {
        var ctrl = this.form.find(dir.path);
        ctrl.updateValue(value);
    }
    onSubmit() {
        ObservableWrapper.callEmit(this.ngSubmit, null);
        return false;
    }
    /** @internal */
    _updateDomValue() {
        this.directives.forEach(dir => {
            var ctrl = this.form.find(dir.path);
            dir.valueAccessor.writeValue(ctrl.value);
        });
    }
    _checkFormPresent() {
        if (isBlank(this.form)) {
            throw new BaseException(`ngFormModel expects a form. Please pass one in. Example: <form [ngFormModel]="myCoolForm">`);
        }
    }
};
NgFormModel = __decorate([
    Directive({
        selector: '[ngFormModel]',
        bindings: [formDirectiveProvider],
        inputs: ['form: ngFormModel'],
        host: { '(submit)': 'onSubmit()' },
        outputs: ['ngSubmit'],
        exportAs: 'ngForm'
    }),
    __param(0, Optional()),
    __param(0, Self()),
    __param(0, Inject(NG_VALIDATORS)),
    __param(1, Optional()),
    __param(1, Self()),
    __param(1, Inject(NG_ASYNC_VALIDATORS)), 
    __metadata('design:paramtypes', [Array, Array])
], NgFormModel);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9ybV9tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUQxaUdRVkcudG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vZm9ybXMvZGlyZWN0aXZlcy9uZ19mb3JtX21vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztPQUFPLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLDBCQUEwQjtPQUNyRCxFQUFDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGdDQUFnQztPQUNyRSxFQUFDLGFBQWEsRUFBQyxNQUFNLGdDQUFnQztPQUNyRCxFQUFDLGlCQUFpQixFQUFFLFlBQVksRUFBQyxNQUFNLDJCQUEyQjtPQUNsRSxFQUdMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsUUFBUSxFQUNSLE1BQU0sRUFDTixRQUFRLEVBQ1IsSUFBSSxFQUNMLE1BQU0sZUFBZTtPQUdmLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxxQkFBcUI7T0FHN0MsRUFBQyxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUUsc0JBQXNCLEVBQUMsTUFBTSxVQUFVO09BQzVGLEVBQUMsVUFBVSxFQUFFLGFBQWEsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLGVBQWU7QUFFNUUsTUFBTSxxQkFBcUIsR0FDdkIsVUFBVSxDQUFDLElBQUksUUFBUSxDQUFDLGdCQUFnQixFQUFFLEVBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxNQUFNLFdBQVcsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0FBRTdGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVFRztBQVNILG1EQUFpQyxnQkFBZ0I7SUFNL0MsWUFBK0QsV0FBa0IsRUFDWixnQkFBdUI7UUFDMUYsT0FBTyxDQUFDO1FBRnFELGdCQUFXLEdBQVgsV0FBVyxDQUFP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QWdGRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q09OU1RfRVhQUiwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TGlzdFdyYXBwZXIsIFN0cmluZ01hcFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge09ic2VydmFibGVXcmFwcGVyLCBFdmVudEVtaXR0ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmMnO1xuaW1wb3J0IHtcbiAgU2ltcGxlQ2hhbmdlLFxuICBPbkNoYW5nZXMsXG4gIERpcmVjdGl2ZSxcbiAgZm9yd2FyZFJlZixcbiAgUHJvdmlkZXIsXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG4gIFNlbGZcbn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnLi9uZ19jb250cm9sJztcbmltcG9ydCB7TmdDb250cm9sR3JvdXB9IGZyb20gJy4vbmdfY29udHJvbF9ncm91cCc7XG5pbXBvcnQge0NvbnRyb2xDb250YWluZXJ9IGZyb20gJy4vY29udHJvbF9jb250YWluZXInO1xuaW1wb3J0IHtGb3JtfSBmcm9tICcuL2Zvcm1faW50ZXJmYWNlJztcbmltcG9ydCB7Q29udHJvbCwgQ29udHJvbEdyb3VwfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge3NldFVwQ29udHJvbCwgc2V0VXBDb250cm9sR3JvdXAsIGNvbXBvc2VWYWxpZGF0b3JzLCBjb21wb3NlQXN5bmNWYWxpZGF0b3JzfSBmcm9tICcuL3NoYXJlZCc7XG5pbXBvcnQge1ZhbGlkYXRvcnMsIE5HX1ZBTElEQVRPUlMsIE5HX0FTWU5DX1ZBTElEQVRPUlN9IGZyb20gJy4uL3ZhbGlkYXRvcnMnO1xuXG5jb25zdCBmb3JtRGlyZWN0aXZlUHJvdmlkZXIgPVxuICAgIENPTlNUX0VYUFIobmV3IFByb3ZpZGVyKENvbnRyb2xDb250YWluZXIsIHt1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ0Zvcm1Nb2RlbCl9KSk7XG5cbi8qKlxuICogQmluZHMgYW4gZXhpc3RpbmcgY29udHJvbCBncm91cCB0byBhIERPTSBlbGVtZW50LlxuICpcbiAqICMjIyBFeGFtcGxlIChbbGl2ZSBkZW1vXShodHRwOi8vcGxua3IuY28vZWRpdC9qcXJWaXJ1ZFk4YW5KeFRNVWpUUD9wPXByZXZpZXcpKVxuICpcbiAqIEluIHRoaXMgZXhhbXBsZSwgd2UgYmluZCB0aGUgY29udHJvbCBncm91cCB0byB0aGUgZm9ybSBlbGVtZW50LCBhbmQgd2UgYmluZCB0aGUgbG9naW4gYW5kXG4gKiBwYXNzd29yZCBjb250cm9scyB0byB0aGUgbG9naW4gYW5kIHBhc3N3b3JkIGVsZW1lbnRzLlxuICpcbiAqICBgYGB0eXBlc2NyaXB0XG4gKiBAQ29tcG9uZW50KHtcbiAqICAgc2VsZWN0b3I6ICdteS1hcHAnLFxuICogICB0ZW1wbGF0ZTogYFxuICogICAgIDxkaXY+XG4gKiAgICAgICA8aDI+TmdGb3JtTW9kZWwgRXhhbXBsZTwvaDI+XG4gKiAgICAgICA8Zm9ybSBbbmdGb3JtTW9kZWxdPVwibG9naW5Gb3JtXCI+XG4gKiAgICAgICAgIDxwPkxvZ2luOiA8aW5wdXQgdHlwZT1cInRleHRcIiBuZ0NvbnRyb2w9XCJsb2dpblwiPjwvcD5cbiAqICAgICAgICAgPHA+UGFzc3dvcmQ6IDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBuZ0NvbnRyb2w9XCJwYXNzd29yZFwiPjwvcD5cbiAqICAgICAgIDwvZm9ybT5cbiAqICAgICAgIDxwPlZhbHVlOjwvcD5cbiAqICAgICAgIDxwcmU+e3t2YWx1ZX19PC9wcmU+XG4gKiAgICAgPC9kaXY+XG4gKiAgIGAsXG4gKiAgIGRpcmVjdGl2ZXM6IFtGT1JNX0RJUkVDVElWRVNdXG4gKiB9KVxuICogZXhwb3J0IGNsYXNzIEFwcCB7XG4gKiAgIGxvZ2luRm9ybTogQ29udHJvbEdyb3VwO1xuICpcbiAqICAgY29uc3RydWN0b3IoKSB7XG4gKiAgICAgdGhpcy5sb2dpbkZvcm0gPSBuZXcgQ29udHJvbEdyb3VwKHtcbiAqICAgICAgIGxvZ2luOiBuZXcgQ29udHJvbChcIlwiKSxcbiAqICAgICAgIHBhc3N3b3JkOiBuZXcgQ29udHJvbChcIlwiKVxuICogICAgIH0pO1xuICogICB9XG4gKlxuICogICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAqICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5sb2dpbkZvcm0udmFsdWUsIG51bGwsIDIpO1xuICogICB9XG4gKiB9XG4gKiAgYGBgXG4gKlxuICogV2UgY2FuIGFsc28gdXNlIG5nTW9kZWwgdG8gYmluZCBhIGRvbWFpbiBtb2RlbCB0byB0aGUgZm9ybS5cbiAqXG4gKiAgYGBgdHlwZXNjcmlwdFxuICogQENvbXBvbmVudCh7XG4gKiAgICAgIHNlbGVjdG9yOiBcImxvZ2luLWNvbXBcIixcbiAqICAgICAgZGlyZWN0aXZlczogW0ZPUk1fRElSRUNUSVZFU10sXG4gKiAgICAgIHRlbXBsYXRlOiBgXG4gKiAgICAgICAgPGZvcm0gW25nRm9ybU1vZGVsXT0nbG9naW5Gb3JtJz5cbiAqICAgICAgICAgIExvZ2luIDxpbnB1dCB0eXBlPSd0ZXh0JyBuZ0NvbnRyb2w9J2xvZ2luJyBbKG5nTW9kZWwpXT0nY3JlZGVudGlhbHMubG9naW4nPlxuICogICAgICAgICAgUGFzc3dvcmQgPGlucHV0IHR5cGU9J3Bhc3N3b3JkJyBuZ0NvbnRyb2w9J3Bhc3N3b3JkJ1xuICogICAgICAgICAgICAgICAgICAgICAgICAgIFsobmdNb2RlbCldPSdjcmVkZW50aWFscy5wYXNzd29yZCc+XG4gKiAgICAgICAgICA8YnV0dG9uIChjbGljayk9XCJvbkxvZ2luKClcIj5Mb2dpbjwvYnV0dG9uPlxuICogICAgICAgIDwvZm9ybT5gXG4gKiAgICAgIH0pXG4gKiBjbGFzcyBMb2dpbkNvbXAge1xuICogIGNyZWRlbnRpYWxzOiB7bG9naW46IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZ307XG4gKiAgbG9naW5Gb3JtOiBDb250cm9sR3JvdXA7XG4gKlxuICogIGNvbnN0cnVjdG9yKCkge1xuICogICAgdGhpcy5sb2dpbkZvcm0gPSBuZXcgQ29udHJvbEdyb3VwKHtcbiAqICAgICAgbG9naW46IG5ldyBDb250cm9sKFwiXCIpLFxuICogICAgICBwYXNzd29yZDogbmV3IENvbnRyb2woXCJcIilcbiAqICAgIH0pO1xuICogIH1cbiAqXG4gKiAgb25Mb2dpbigpOiB2b2lkIHtcbiAqICAgIC8vIHRoaXMuY3JlZGVudGlhbHMubG9naW4gPT09ICdzb21lIGxvZ2luJ1xuICogICAgLy8gdGhpcy5jcmVkZW50aWFscy5wYXNzd29yZCA9PT0gJ3NvbWUgcGFzc3dvcmQnXG4gKiAgfVxuICogfVxuICogIGBgYFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdGb3JtTW9kZWxdJyxcbiAgYmluZGluZ3M6IFtmb3JtRGlyZWN0aXZlUHJvdmlkZXJdLFxuICBpbnB1dHM6IFsnZm9ybTogbmdGb3JtTW9kZWwnXSxcbiAgaG9zdDogeycoc3VibWl0KSc6ICdvblN1Ym1pdCgpJ30sXG4gIG91dHB1dHM6IFsnbmdTdWJtaXQnXSxcbiAgZXhwb3J0QXM6ICduZ0Zvcm0nXG59KVxuZXhwb3J0IGNsYXNzIE5nRm9ybU1vZGVsIGV4dGVuZHMgQ29udHJvbENvbnRhaW5lciBpbXBsZW1lbnRzIEZvcm0sXG4gICAgT25DaGFuZ2VzIHtcbiAgZm9ybTogQ29udHJvbEdyb3VwID0gbnVsbDtcbiAgZGlyZWN0aXZlczogTmdDb250cm9sW10gPSBbXTtcbiAgbmdTdWJtaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTElEQVRPUlMpIHByaXZhdGUgX3ZhbGlkYXRvcnM6IGFueVtdLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfQVNZTkNfVkFMSURBVE9SUykgcHJpdmF0ZSBfYXN5bmNWYWxpZGF0b3JzOiBhbnlbXSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiB7W2tleTogc3RyaW5nXTogU2ltcGxlQ2hhbmdlfSk6IHZvaWQge1xuICAgIHRoaXMuX2NoZWNrRm9ybVByZXNlbnQoKTtcbiAgICBpZiAoU3RyaW5nTWFwV3JhcHBlci5jb250YWlucyhjaGFuZ2VzLCBcImZvcm1cIikpIHtcbiAgICAgIHZhciBzeW5jID0gY29tcG9zZVZhbGlkYXRvcnModGhpcy5fdmFsaWRhdG9ycyk7XG4gICAgICB0aGlzLmZvcm0udmFsaWRhdG9yID0gVmFsaWRhdG9ycy5jb21wb3NlKFt0aGlzLmZvcm0udmFsaWRhdG9yLCBzeW5jXSk7XG5cbiAgICAgIHZhciBhc3luYyA9IGNvbXBvc2VBc3luY1ZhbGlkYXRvcnModGhpcy5fYXN5bmNWYWxpZGF0b3JzKTtcbiAgICAgIHRoaXMuZm9ybS5hc3luY1ZhbGlkYXRvciA9IFZhbGlkYXRvcnMuY29tcG9zZUFzeW5jKFt0aGlzLmZvcm0uYXN5bmNWYWxpZGF0b3IsIGFzeW5jXSk7XG5cbiAgICAgIHRoaXMuZm9ybS51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBmYWxzZX0pO1xuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZURvbVZhbHVlKCk7XG4gIH1cblxuICBnZXQgZm9ybURpcmVjdGl2ZSgpOiBGb3JtIHsgcmV0dXJuIHRoaXM7IH1cblxuICBnZXQgY29udHJvbCgpOiBDb250cm9sR3JvdXAgeyByZXR1cm4gdGhpcy5mb3JtOyB9XG5cbiAgZ2V0IHBhdGgoKTogc3RyaW5nW10geyByZXR1cm4gW107IH1cblxuICBhZGRDb250cm9sKGRpcjogTmdDb250cm9sKTogdm9pZCB7XG4gICAgdmFyIGN0cmw6IGFueSA9IHRoaXMuZm9ybS5maW5kKGRpci5wYXRoKTtcbiAgICBzZXRVcENvbnRyb2woY3RybCwgZGlyKTtcbiAgICBjdHJsLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogZmFsc2V9KTtcbiAgICB0aGlzLmRpcmVjdGl2ZXMucHVzaChkaXIpO1xuICB9XG5cbiAgZ2V0Q29udHJvbChkaXI6IE5nQ29udHJvbCk6IENvbnRyb2wgeyByZXR1cm4gPENvbnRyb2w+dGhpcy5mb3JtLmZpbmQoZGlyLnBhdGgpOyB9XG5cbiAgcmVtb3ZlQ29udHJvbChkaXI6IE5nQ29udHJvbCk6IHZvaWQgeyBMaXN0V3JhcHBlci5yZW1vdmUodGhpcy5kaXJlY3RpdmVzLCBkaXIpOyB9XG5cbiAgYWRkQ29udHJvbEdyb3VwKGRpcjogTmdDb250cm9sR3JvdXApIHtcbiAgICB2YXIgY3RybDogYW55ID0gdGhpcy5mb3JtLmZpbmQoZGlyLnBhdGgpO1xuICAgIHNldFVwQ29udHJvbEdyb3VwKGN0cmwsIGRpcik7XG4gICAgY3RybC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gIH1cblxuICByZW1vdmVDb250cm9sR3JvdXAoZGlyOiBOZ0NvbnRyb2xHcm91cCkge31cblxuICBnZXRDb250cm9sR3JvdXAoZGlyOiBOZ0NvbnRyb2xHcm91cCk6IENvbnRyb2xHcm91cCB7XG4gICAgcmV0dXJuIDxDb250cm9sR3JvdXA+dGhpcy5mb3JtLmZpbmQoZGlyLnBhdGgpO1xuICB9XG5cbiAgdXBkYXRlTW9kZWwoZGlyOiBOZ0NvbnRyb2wsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB2YXIgY3RybMKgID0gPENvbnRyb2w+dGhpcy5mb3JtLmZpbmQoZGlyLnBhdGgpO1xuICAgIGN0cmwudXBkYXRlVmFsdWUodmFsdWUpO1xuICB9XG5cbiAgb25TdWJtaXQoKTogYm9vbGVhbiB7XG4gICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5uZ1N1Ym1pdCwgbnVsbCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdXBkYXRlRG9tVmFsdWUoKSB7XG4gICAgdGhpcy5kaXJlY3RpdmVzLmZvckVhY2goZGlyID0+IHtcbiAgICAgIHZhciBjdHJsOiBhbnkgPSB0aGlzLmZvcm0uZmluZChkaXIucGF0aCk7XG4gICAgICBkaXIudmFsdWVBY2Nlc3Nvci53cml0ZVZhbHVlKGN0cmwudmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tGb3JtUHJlc2VudCgpIHtcbiAgICBpZiAoaXNCbGFuayh0aGlzLmZvcm0pKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcbiAgICAgICAgICBgbmdGb3JtTW9kZWwgZXhwZWN0cyBhIGZvcm0uIFBsZWFzZSBwYXNzIG9uZSBpbi4gRXhhbXBsZTogPGZvcm0gW25nRm9ybU1vZGVsXT1cIm15Q29vbEZvcm1cIj5gKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==