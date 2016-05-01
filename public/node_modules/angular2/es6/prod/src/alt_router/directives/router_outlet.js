var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, ViewContainerRef, Input, ReflectiveInjector } from 'angular2/core';
import { RouterOutletMap } from '../router';
import { isPresent } from 'angular2/src/facade/lang';
export let RouterOutlet = class RouterOutlet {
    constructor(parentOutletMap, _location) {
        this._location = _location;
        this.name = "";
        parentOutletMap.registerOutlet("", this);
    }
    load(factory, providers, outletMap) {
        if (isPresent(this._loaded)) {
            this._loaded.destroy();
        }
        this.outletMap = outletMap;
        let inj = ReflectiveInjector.fromResolvedProviders(providers, this._location.parentInjector);
        this._loaded = this._location.createComponent(factory, this._location.length, inj, []);
        return this._loaded;
    }
};
__decorate([
    Input(), 
    __metadata('design:type', String)
], RouterOutlet.prototype, "name", void 0);
RouterOutlet = __decorate([
    Directive({ selector: 'router-outlet' }), 
    __metadata('design:paramtypes', [RouterOutletMap, ViewContainerRef])
], RouterOutlet);
