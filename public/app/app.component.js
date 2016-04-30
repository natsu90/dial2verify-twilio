System.register(['angular2/core', 'angular2/http', 'rxjs/add/operator/map'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {}],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(http) {
                    this.http = http;
                    this.isError = false;
                    this.isVerifyingInput = false;
                    this.number = '';
                }
                AppComponent.prototype.ngOnInit = function () {
                    console.log('ngOnInit');
                };
                AppComponent.prototype.verifyNumber = function () {
                    var _this = this;
                    if (!this.number)
                        return false;
                    this.isVerifyingInput = true;
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/x-www-form-urlencoded');
                    this.http.post('/verify', 'number=' + encodeURIComponent(this.number), { headers: headers })
                        .map(function (res) { return res.json(); })
                        .subscribe(function (data) { return _this.onVerifying(data); }, function (err) { return _this.onError(); }, function () { return console.log('What is it doing here?'); });
                };
                AppComponent.prototype.onVerifying = function (data) {
                    this.subscribeEvents();
                    this.isVerifyingInput = false;
                    this.number = data.valid_number;
                    swal({
                        title: data.number_to_dial,
                        text: "Dial this number within 90 secs from now to verify",
                        type: "info",
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        timer: 1.6 * 60 * 1000
                    });
                };
                AppComponent.prototype.onError = function () {
                    this.isVerifyingInput = false;
                    this.isError = true;
                    var that = this;
                    setTimeout(function () { that.isError = false; that.number = ''; }, 500);
                };
                AppComponent.prototype.subscribeEvents = function () {
                    var stream = new EventSource("events/" + this.number);
                    stream.addEventListener("message", function (event) {
                        console.log(event);
                    });
                    stream.addEventListener("expired", function foo(event) {
                        swal("Too late..", "Your verification process is expired", "error");
                        this.removeEventListener("expired", foo);
                        stream.close();
                    });
                    stream.addEventListener("verified", function foo(event) {
                        swal("Verified!", "It's seems your number is correct", "success");
                        this.removeEventListener("verified", foo);
                        stream.close();
                    });
                };
                AppComponent.prototype.onVerified = function () {
                };
                AppComponent.prototype.onExpired = function () {
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "<form class=\"pure-form\">\n\t        \t<div class=\"pure-g\">\n\t            <div class=\"pure-u-1 pure-u-md-1-1\">\n\t                <input id=\"number\" class=\"pure-u-23-24\" [ngClass]=\"{'shake-hard shake-constant': isError}\" type=\"text\" placeholder=\"Phone number to verify\" style=\"font-size:48px\" [(ngModel)]=\"number\">\n\t            </div>\n\t            </div>\n\t        </form>\n\t        <p>\n\t            <a (click)=\"verifyNumber()\" href=\"#\" class=\"pure-button pure-button-primary\" [ngClass]=\"{'pure-button-disabled': isVerifyingInput}\" style=\"font-size:36px\"><i *ngIf=\"isVerifyingInput\" class=\"fa fa-refresh fa-spin\"></i> Verify</a>\n\t        </p>"
                    }), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map