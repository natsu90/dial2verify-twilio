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
var di_1 = require('angular2/src/core/di');
var compile_element_1 = require('./compile_element');
var compile_view_1 = require('./compile_view');
var view_builder_1 = require('./view_builder');
var config_1 = require('../config');
var ViewCompileResult = (function () {
    function ViewCompileResult(statements, viewFactoryVar, dependencies) {
        this.statements = statements;
        this.viewFactoryVar = viewFactoryVar;
        this.dependencies = dependencies;
    }
    return ViewCompileResult;
}());
exports.ViewCompileResult = ViewCompileResult;
var ViewCompiler = (function () {
    function ViewCompiler(_genConfig) {
        this._genConfig = _genConfig;
    }
    ViewCompiler.prototype.compileComponent = function (component, template, styles, pipes) {
        var statements = [];
        var dependencies = [];
        var view = new compile_view_1.CompileView(component, this._genConfig, pipes, styles, 0, compile_element_1.CompileElement.createNull(), []);
        view_builder_1.buildView(view, template, dependencies, statements);
        return new ViewCompileResult(statements, view.viewFactory.name, dependencies);
    };
    ViewCompiler = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [config_1.CompilerConfig])
    ], ViewCompiler);
    return ViewCompiler;
}());
exports.ViewCompiler = ViewCompiler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19jb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtNG5vM1pRdk8udG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci92aWV3X2NvbXBpbGVyL3ZpZXdfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG1CQUF5QixzQkFBc0IsQ0FBQyxDQUFBO0FBR2hELGdDQUE2QixtQkFBbUIsQ0FBQyxDQUFBO0FBQ2pELDZCQUEwQixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzNDLDZCQUErQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBS2hFLHVCQUE2QixXQUFXLENBQUMsQ0FBQTtBQUV6QztJQUNFLDJCQUFtQixVQUF5QixFQUFTLGNBQXNCLEVBQ3hELFlBQXFDO1FBRHJDLGVBQVUsR0FBVixVQUFVLENBQWU7UUFBUyxtQkFBYyxHQUFkLGNBQWMsQ0FBUTtRQUN4RCxpQkFBWSxHQUFaLFlBQVksQ0FBeUI7SUFBRyxDQUFDO0lBQzlELHdCQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFIWSx5QkFBaUIsb0JBRzdCLENBQUE7QUFHRDtJQUNFLHNCQUFvQixVQUEwQjtRQUExQixlQUFVLEdBQVYsVUFBVSxDQUFnQjtJQUFHLENBQUM7SUFFbEQsdUNBQWdCLEdBQWhCLFVBQWlCLFNBQW1DLEVBQUUsUUFBdUIsRUFDNUQsTUFBb0IsRUFBRSxLQUE0QjtRQUNqRSxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksSUFBSSxHQUFHLElBQUksMEJBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFDNUMsZ0NBQWMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM1RCx3QkFBUyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBWkg7UUFBQyxlQUFVLEVBQUU7O29CQUFBO0lBYWIsbUJBQUM7QUFBRCxDQUFDLEFBWkQsSUFZQztBQVpZLG9CQUFZLGVBWXhCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcblxuaW1wb3J0ICogYXMgbyBmcm9tICcuLi9vdXRwdXQvb3V0cHV0X2FzdCc7XG5pbXBvcnQge0NvbXBpbGVFbGVtZW50fSBmcm9tICcuL2NvbXBpbGVfZWxlbWVudCc7XG5pbXBvcnQge0NvbXBpbGVWaWV3fSBmcm9tICcuL2NvbXBpbGVfdmlldyc7XG5pbXBvcnQge2J1aWxkVmlldywgVmlld0NvbXBpbGVEZXBlbmRlbmN5fSBmcm9tICcuL3ZpZXdfYnVpbGRlcic7XG5cbmltcG9ydCB7Q29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLCBDb21waWxlUGlwZU1ldGFkYXRhfSBmcm9tICcuLi9jb21waWxlX21ldGFkYXRhJztcblxuaW1wb3J0IHtUZW1wbGF0ZUFzdH0gZnJvbSAnLi4vdGVtcGxhdGVfYXN0JztcbmltcG9ydCB7Q29tcGlsZXJDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5cbmV4cG9ydCBjbGFzcyBWaWV3Q29tcGlsZVJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGF0ZW1lbnRzOiBvLlN0YXRlbWVudFtdLCBwdWJsaWMgdmlld0ZhY3RvcnlWYXI6IHN0cmluZyxcbiAgICAgICAgICAgICAgcHVibGljIGRlcGVuZGVuY2llczogVmlld0NvbXBpbGVEZXBlbmRlbmN5W10pIHt9XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBWaWV3Q29tcGlsZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9nZW5Db25maWc6IENvbXBpbGVyQ29uZmlnKSB7fVxuXG4gIGNvbXBpbGVDb21wb25lbnQoY29tcG9uZW50OiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsIHRlbXBsYXRlOiBUZW1wbGF0ZUFzdFtdLFxuICAgICAgICAgICAgICAgICAgIHN0eWxlczogby5FeHByZXNzaW9uLCBwaXBlczogQ29tcGlsZVBpcGVNZXRhZGF0YVtdKTogVmlld0NvbXBpbGVSZXN1bHQge1xuICAgIHZhciBzdGF0ZW1lbnRzID0gW107XG4gICAgdmFyIGRlcGVuZGVuY2llcyA9IFtdO1xuICAgIHZhciB2aWV3ID0gbmV3IENvbXBpbGVWaWV3KGNvbXBvbmVudCwgdGhpcy5fZ2VuQ29uZmlnLCBwaXBlcywgc3R5bGVzLCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbXBpbGVFbGVtZW50LmNyZWF0ZU51bGwoKSwgW10pO1xuICAgIGJ1aWxkVmlldyh2aWV3LCB0ZW1wbGF0ZSwgZGVwZW5kZW5jaWVzLCBzdGF0ZW1lbnRzKTtcbiAgICByZXR1cm4gbmV3IFZpZXdDb21waWxlUmVzdWx0KHN0YXRlbWVudHMsIHZpZXcudmlld0ZhY3RvcnkubmFtZSwgZGVwZW5kZW5jaWVzKTtcbiAgfVxufVxuIl19