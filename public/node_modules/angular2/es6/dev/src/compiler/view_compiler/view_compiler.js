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
import { CompileElement } from './compile_element';
import { CompileView } from './compile_view';
import { buildView } from './view_builder';
import { CompilerConfig } from '../config';
export class ViewCompileResult {
    constructor(statements, viewFactoryVar, dependencies) {
        this.statements = statements;
        this.viewFactoryVar = viewFactoryVar;
        this.dependencies = dependencies;
    }
}
export let ViewCompiler = class ViewCompiler {
    constructor(_genConfig) {
        this._genConfig = _genConfig;
    }
    compileComponent(component, template, styles, pipes) {
        var statements = [];
        var dependencies = [];
        var view = new CompileView(component, this._genConfig, pipes, styles, 0, CompileElement.createNull(), []);
        buildView(view, template, dependencies, statements);
        return new ViewCompileResult(statements, view.viewFactory.name, dependencies);
    }
};
ViewCompiler = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [CompilerConfig])
], ViewCompiler);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19jb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUQxaUdRVkcudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci92aWV3X2NvbXBpbGVyL3ZpZXdfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O09BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxzQkFBc0I7T0FHeEMsRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUI7T0FDekMsRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0I7T0FDbkMsRUFBQyxTQUFTLEVBQXdCLE1BQU0sZ0JBQWdCO09BS3hELEVBQUMsY0FBYyxFQUFDLE1BQU0sV0FBVztBQUV4QztJQUNFLFlBQW1CLFVBQXlCLEVBQVMsY0FBc0IsRUFDeEQsWUFBcUM7UUFEckMsZUFBVSxHQUFWLFVBQVUsQ0FBZTtRQUFTLG1CQUFjLEdBQWQsY0FBYyxDQUFRO1FBQ3hELGlCQUFZLEdBQVosWUFBWSxDQUF5QjtJQUFHLENBQUM7QUFDOUQsQ0FBQztBQUdEO0lBQ0UsWUFBb0IsVUFBMEI7UUFBMUIsZUFBVSxHQUFWLFVBQVUsQ0FBZ0I7SUFBRyxDQUFDO0lBRWxELGdCQUFnQixDQUFDLFNBQW1DLEVBQUUsUUFBdUIsRUFDNUQsTUFBb0IsRUFBRSxLQUE0QjtRQUNqRSxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksSUFBSSxHQUFHLElBQUksV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUM1QyxjQUFjLENBQUMsVUFBVSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDNUQsU0FBUyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNoRixDQUFDO0FBQ0gsQ0FBQztBQWJEO0lBQUMsVUFBVSxFQUFFOztnQkFBQTtBQWFaIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5cbmltcG9ydCAqIGFzIG8gZnJvbSAnLi4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtDb21waWxlRWxlbWVudH0gZnJvbSAnLi9jb21waWxlX2VsZW1lbnQnO1xuaW1wb3J0IHtDb21waWxlVmlld30gZnJvbSAnLi9jb21waWxlX3ZpZXcnO1xuaW1wb3J0IHtidWlsZFZpZXcsIFZpZXdDb21waWxlRGVwZW5kZW5jeX0gZnJvbSAnLi92aWV3X2J1aWxkZXInO1xuXG5pbXBvcnQge0NvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSwgQ29tcGlsZVBpcGVNZXRhZGF0YX0gZnJvbSAnLi4vY29tcGlsZV9tZXRhZGF0YSc7XG5cbmltcG9ydCB7VGVtcGxhdGVBc3R9IGZyb20gJy4uL3RlbXBsYXRlX2FzdCc7XG5pbXBvcnQge0NvbXBpbGVyQ29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuXG5leHBvcnQgY2xhc3MgVmlld0NvbXBpbGVSZXN1bHQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhdGVtZW50czogby5TdGF0ZW1lbnRbXSwgcHVibGljIHZpZXdGYWN0b3J5VmFyOiBzdHJpbmcsXG4gICAgICAgICAgICAgIHB1YmxpYyBkZXBlbmRlbmNpZXM6IFZpZXdDb21waWxlRGVwZW5kZW5jeVtdKSB7fVxufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVmlld0NvbXBpbGVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZ2VuQ29uZmlnOiBDb21waWxlckNvbmZpZykge31cblxuICBjb21waWxlQ29tcG9uZW50KGNvbXBvbmVudDogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLCB0ZW1wbGF0ZTogVGVtcGxhdGVBc3RbXSxcbiAgICAgICAgICAgICAgICAgICBzdHlsZXM6IG8uRXhwcmVzc2lvbiwgcGlwZXM6IENvbXBpbGVQaXBlTWV0YWRhdGFbXSk6IFZpZXdDb21waWxlUmVzdWx0IHtcbiAgICB2YXIgc3RhdGVtZW50cyA9IFtdO1xuICAgIHZhciBkZXBlbmRlbmNpZXMgPSBbXTtcbiAgICB2YXIgdmlldyA9IG5ldyBDb21waWxlVmlldyhjb21wb25lbnQsIHRoaXMuX2dlbkNvbmZpZywgcGlwZXMsIHN0eWxlcywgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb21waWxlRWxlbWVudC5jcmVhdGVOdWxsKCksIFtdKTtcbiAgICBidWlsZFZpZXcodmlldywgdGVtcGxhdGUsIGRlcGVuZGVuY2llcywgc3RhdGVtZW50cyk7XG4gICAgcmV0dXJuIG5ldyBWaWV3Q29tcGlsZVJlc3VsdChzdGF0ZW1lbnRzLCB2aWV3LnZpZXdGYWN0b3J5Lm5hbWUsIGRlcGVuZGVuY2llcyk7XG4gIH1cbn1cbiJdfQ==