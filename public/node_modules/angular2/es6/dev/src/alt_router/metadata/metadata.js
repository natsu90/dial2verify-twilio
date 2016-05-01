var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CONST, stringify } from "angular2/src/facade/lang";
export class RouteMetadata {
    get path() { }
    get component() { }
}
export let Route = class Route {
    constructor({ path, component } = {}) {
        this.path = path;
        this.component = component;
    }
    toString() { return `@Route(${this.path}, ${stringify(this.component)})`; }
};
Route = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], Route);
export let RoutesMetadata = class RoutesMetadata {
    constructor(routes) {
        this.routes = routes;
    }
    toString() { return `@Routes(${this.routes})`; }
};
RoutesMetadata = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Array])
], RoutesMetadata);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTlEMWlHUVZHLnRtcC9hbmd1bGFyMi9zcmMvYWx0X3JvdXRlci9tZXRhZGF0YS9tZXRhZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7T0FBTyxFQUFDLEtBQUssRUFBUSxTQUFTLEVBQUMsTUFBTSwwQkFBMEI7QUFFL0Q7SUFDRSxJQUFhLElBQUksTUFBVztJQUM1QixJQUFhLFNBQVMsTUFBUztBQUNqQyxDQUFDO0FBR0Q7SUFHRSxZQUFZLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxHQUFzQyxFQUFFO1FBQ25FLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzdCLENBQUM7SUFDRCxRQUFRLEtBQWEsTUFBTSxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JGLENBQUM7QUFURDtJQUFDLEtBQUssRUFBRTs7U0FBQTtBQVlSO0lBQ0UsWUFBbUIsTUFBdUI7UUFBdkIsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7SUFBRyxDQUFDO0lBQzlDLFFBQVEsS0FBYSxNQUFNLENBQUMsV0FBVyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFKRDtJQUFDLEtBQUssRUFBRTs7a0JBQUE7QUFJUCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q09OU1QsIFR5cGUsIHN0cmluZ2lmeX0gZnJvbSBcImFuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZ1wiO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUm91dGVNZXRhZGF0YSB7XG4gIGFic3RyYWN0IGdldCBwYXRoKCk6IHN0cmluZztcbiAgYWJzdHJhY3QgZ2V0IGNvbXBvbmVudCgpOiBUeXBlO1xufVxuXG5AQ09OU1QoKVxuZXhwb3J0IGNsYXNzIFJvdXRlIGltcGxlbWVudHMgUm91dGVNZXRhZGF0YSB7XG4gIHBhdGg6IHN0cmluZztcbiAgY29tcG9uZW50OiBUeXBlO1xuICBjb25zdHJ1Y3Rvcih7cGF0aCwgY29tcG9uZW50fToge3BhdGg/OiBzdHJpbmcsIGNvbXBvbmVudD86IFR5cGV9ID0ge30pIHtcbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIHRoaXMuY29tcG9uZW50ID0gY29tcG9uZW50O1xuICB9XG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7IHJldHVybiBgQFJvdXRlKCR7dGhpcy5wYXRofSwgJHtzdHJpbmdpZnkodGhpcy5jb21wb25lbnQpfSlgOyB9XG59XG5cbkBDT05TVCgpXG5leHBvcnQgY2xhc3MgUm91dGVzTWV0YWRhdGEge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcm91dGVzOiBSb3V0ZU1ldGFkYXRhW10pIHt9XG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7IHJldHVybiBgQFJvdXRlcygke3RoaXMucm91dGVzfSlgOyB9XG59Il19