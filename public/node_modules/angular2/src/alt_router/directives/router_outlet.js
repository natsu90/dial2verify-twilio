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
var core_1 = require('angular2/core');
var router_1 = require('../router');
var lang_1 = require('angular2/src/facade/lang');
var RouterOutlet = (function () {
    function RouterOutlet(parentOutletMap, _location) {
        this._location = _location;
        this.name = "";
        parentOutletMap.registerOutlet("", this);
    }
    RouterOutlet.prototype.load = function (factory, providers, outletMap) {
        if (lang_1.isPresent(this._loaded)) {
            this._loaded.destroy();
        }
        this.outletMap = outletMap;
        var inj = core_1.ReflectiveInjector.fromResolvedProviders(providers, this._location.parentInjector);
        this._loaded = this._location.createComponent(factory, this._location.length, inj, []);
        return this._loaded;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RouterOutlet.prototype, "name", void 0);
    RouterOutlet = __decorate([
        core_1.Directive({ selector: 'router-outlet' }), 
        __metadata('design:paramtypes', [router_1.RouterOutletMap, core_1.ViewContainerRef])
    ], RouterOutlet);
    return RouterOutlet;
}());
exports.RouterOutlet = RouterOutlet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX291dGxldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtNG5vM1pRdk8udG1wL2FuZ3VsYXIyL3NyYy9hbHRfcm91dGVyL2RpcmVjdGl2ZXMvcm91dGVyX291dGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBU08sZUFBZSxDQUFDLENBQUE7QUFDdkIsdUJBQThCLFdBQVcsQ0FBQyxDQUFBO0FBQzFDLHFCQUF3QiwwQkFBMEIsQ0FBQyxDQUFBO0FBR25EO0lBS0Usc0JBQVksZUFBZ0MsRUFBVSxTQUEyQjtRQUEzQixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUZ4RSxTQUFJLEdBQVcsRUFBRSxDQUFDO1FBR3pCLGVBQWUsQ0FBQyxjQUFjLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCwyQkFBSSxHQUFKLFVBQUssT0FBeUIsRUFBRSxTQUF1QyxFQUNsRSxTQUEwQjtRQUM3QixFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN6QixDQUFDO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxHQUFHLEdBQUcseUJBQWtCLENBQUMscUJBQXFCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDN0YsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZGLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFmRDtRQUFDLFlBQUssRUFBRTs7OENBQUE7SUFKVjtRQUFDLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFDLENBQUM7O29CQUFBO0lBb0J2QyxtQkFBQztBQUFELENBQUMsQUFuQkQsSUFtQkM7QUFuQlksb0JBQVksZUFtQnhCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcixcbiAgRGlyZWN0aXZlLFxuICBEeW5hbWljQ29tcG9uZW50TG9hZGVyLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBJbnB1dCxcbiAgQ29tcG9uZW50UmVmLFxuICBDb21wb25lbnRGYWN0b3J5LFxuICBSZWZsZWN0aXZlSW5qZWN0b3Jcbn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge1JvdXRlck91dGxldE1hcH0gZnJvbSAnLi4vcm91dGVyJztcbmltcG9ydCB7aXNQcmVzZW50fSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ3JvdXRlci1vdXRsZXQnfSlcbmV4cG9ydCBjbGFzcyBSb3V0ZXJPdXRsZXQge1xuICBwcml2YXRlIF9sb2FkZWQ6IENvbXBvbmVudFJlZjtcbiAgcHVibGljIG91dGxldE1hcDogUm91dGVyT3V0bGV0TWFwO1xuICBASW5wdXQoKSBuYW1lOiBzdHJpbmcgPSBcIlwiO1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudE91dGxldE1hcDogUm91dGVyT3V0bGV0TWFwLCBwcml2YXRlIF9sb2NhdGlvbjogVmlld0NvbnRhaW5lclJlZikge1xuICAgIHBhcmVudE91dGxldE1hcC5yZWdpc3Rlck91dGxldChcIlwiLCB0aGlzKTtcbiAgfVxuXG4gIGxvYWQoZmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeSwgcHJvdmlkZXJzOiBSZXNvbHZlZFJlZmxlY3RpdmVQcm92aWRlcltdLFxuICAgICAgIG91dGxldE1hcDogUm91dGVyT3V0bGV0TWFwKTogQ29tcG9uZW50UmVmIHtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuX2xvYWRlZCkpIHtcbiAgICAgIHRoaXMuX2xvYWRlZC5kZXN0cm95KCk7XG4gICAgfVxuICAgIHRoaXMub3V0bGV0TWFwID0gb3V0bGV0TWFwO1xuICAgIGxldCBpbmogPSBSZWZsZWN0aXZlSW5qZWN0b3IuZnJvbVJlc29sdmVkUHJvdmlkZXJzKHByb3ZpZGVycywgdGhpcy5fbG9jYXRpb24ucGFyZW50SW5qZWN0b3IpO1xuICAgIHRoaXMuX2xvYWRlZCA9IHRoaXMuX2xvY2F0aW9uLmNyZWF0ZUNvbXBvbmVudChmYWN0b3J5LCB0aGlzLl9sb2NhdGlvbi5sZW5ndGgsIGluaiwgW10pO1xuICAgIHJldHVybiB0aGlzLl9sb2FkZWQ7XG4gIH1cbn0iXX0=