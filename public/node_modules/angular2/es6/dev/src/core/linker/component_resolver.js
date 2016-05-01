var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from 'angular2/src/core/di';
import { isBlank, stringify } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { reflector } from 'angular2/src/core/reflection/reflection';
import { ComponentFactory } from './component_factory';
/**
 * Low-level service for loading {@link ComponentFactory}s, which
 * can later be used to create and render a Component instance.
 */
export class ComponentResolver {
}
function _isComponentFactory(type) {
    return type instanceof ComponentFactory;
}
export let ReflectorComponentResolver = class ReflectorComponentResolver extends ComponentResolver {
    resolveComponent(componentType) {
        var metadatas = reflector.annotations(componentType);
        var componentFactory = metadatas.find(_isComponentFactory);
        if (isBlank(componentFactory)) {
            throw new BaseException(`No precompiled component ${stringify(componentType)} found`);
        }
        return PromiseWrapper.resolve(componentFactory);
    }
    clearCache() { }
};
ReflectorComponentResolver = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], ReflectorComponentResolver);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50X3Jlc29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC05RDFpR1FWRy50bXAvYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL2NvbXBvbmVudF9yZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7T0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLHNCQUFzQjtPQUN4QyxFQUFPLE9BQU8sRUFBRSxTQUFTLEVBQUMsTUFBTSwwQkFBMEI7T0FDMUQsRUFBQyxhQUFhLEVBQUMsTUFBTSxnQ0FBZ0M7T0FDckQsRUFBQyxjQUFjLEVBQUMsTUFBTSwyQkFBMkI7T0FDakQsRUFBQyxTQUFTLEVBQUMsTUFBTSx5Q0FBeUM7T0FDMUQsRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQjtBQUVwRDs7O0dBR0c7QUFDSDtBQUdBLENBQUM7QUFFRCw2QkFBNkIsSUFBUztJQUNwQyxNQUFNLENBQUMsSUFBSSxZQUFZLGdCQUFnQixDQUFDO0FBQzFDLENBQUM7QUFHRCxpRkFBZ0QsaUJBQWlCO0lBQy9ELGdCQUFnQixDQUFDLGFBQW1CO1FBQ2xDLElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDckQsSUFBSSxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFM0QsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sSUFBSSxhQUFhLENBQUMsNEJBQTRCLFNBQVMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEYsQ0FBQztRQUNELE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNELFVBQVUsS0FBSSxDQUFDO0FBQ2pCLENBQUM7QUFaRDtJQUFDLFVBQVUsRUFBRTs7OEJBQUE7QUFZWiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtUeXBlLCBpc0JsYW5rLCBzdHJpbmdpZnl9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge1Byb21pc2VXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jJztcbmltcG9ydCB7cmVmbGVjdG9yfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9yZWZsZWN0aW9uL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtDb21wb25lbnRGYWN0b3J5fSBmcm9tICcuL2NvbXBvbmVudF9mYWN0b3J5JztcblxuLyoqXG4gKiBMb3ctbGV2ZWwgc2VydmljZSBmb3IgbG9hZGluZyB7QGxpbmsgQ29tcG9uZW50RmFjdG9yeX1zLCB3aGljaFxuICogY2FuIGxhdGVyIGJlIHVzZWQgdG8gY3JlYXRlIGFuZCByZW5kZXIgYSBDb21wb25lbnQgaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb21wb25lbnRSZXNvbHZlciB7XG4gIGFic3RyYWN0IHJlc29sdmVDb21wb25lbnQoY29tcG9uZW50VHlwZTogVHlwZSk6IFByb21pc2U8Q29tcG9uZW50RmFjdG9yeT47XG4gIGFic3RyYWN0IGNsZWFyQ2FjaGUoKTtcbn1cblxuZnVuY3Rpb24gX2lzQ29tcG9uZW50RmFjdG9yeSh0eXBlOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHR5cGUgaW5zdGFuY2VvZiBDb21wb25lbnRGYWN0b3J5O1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUmVmbGVjdG9yQ29tcG9uZW50UmVzb2x2ZXIgZXh0ZW5kcyBDb21wb25lbnRSZXNvbHZlciB7XG4gIHJlc29sdmVDb21wb25lbnQoY29tcG9uZW50VHlwZTogVHlwZSk6IFByb21pc2U8Q29tcG9uZW50RmFjdG9yeT4ge1xuICAgIHZhciBtZXRhZGF0YXMgPSByZWZsZWN0b3IuYW5ub3RhdGlvbnMoY29tcG9uZW50VHlwZSk7XG4gICAgdmFyIGNvbXBvbmVudEZhY3RvcnkgPSBtZXRhZGF0YXMuZmluZChfaXNDb21wb25lbnRGYWN0b3J5KTtcblxuICAgIGlmIChpc0JsYW5rKGNvbXBvbmVudEZhY3RvcnkpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgTm8gcHJlY29tcGlsZWQgY29tcG9uZW50ICR7c3RyaW5naWZ5KGNvbXBvbmVudFR5cGUpfSBmb3VuZGApO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZVdyYXBwZXIucmVzb2x2ZShjb21wb25lbnRGYWN0b3J5KTtcbiAgfVxuICBjbGVhckNhY2hlKCkge31cbn1cbiJdfQ==