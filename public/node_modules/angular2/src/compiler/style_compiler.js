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
var compile_metadata_1 = require('./compile_metadata');
var o = require('./output/output_ast');
var view_1 = require('angular2/src/core/metadata/view');
var shadow_css_1 = require('angular2/src/compiler/shadow_css');
var url_resolver_1 = require('angular2/src/compiler/url_resolver');
var style_url_resolver_1 = require('./style_url_resolver');
var di_1 = require('angular2/src/core/di');
var lang_1 = require('angular2/src/facade/lang');
var COMPONENT_VARIABLE = '%COMP%';
var HOST_ATTR = "_nghost-" + COMPONENT_VARIABLE;
var CONTENT_ATTR = "_ngcontent-" + COMPONENT_VARIABLE;
var StylesCompileDependency = (function () {
    function StylesCompileDependency(sourceUrl, isShimmed, valuePlaceholder) {
        this.sourceUrl = sourceUrl;
        this.isShimmed = isShimmed;
        this.valuePlaceholder = valuePlaceholder;
    }
    return StylesCompileDependency;
}());
exports.StylesCompileDependency = StylesCompileDependency;
var StylesCompileResult = (function () {
    function StylesCompileResult(statements, stylesVar, dependencies) {
        this.statements = statements;
        this.stylesVar = stylesVar;
        this.dependencies = dependencies;
    }
    return StylesCompileResult;
}());
exports.StylesCompileResult = StylesCompileResult;
var StyleCompiler = (function () {
    function StyleCompiler(_urlResolver) {
        this._urlResolver = _urlResolver;
        this._shadowCss = new shadow_css_1.ShadowCss();
    }
    StyleCompiler.prototype.compileComponent = function (comp) {
        var shim = comp.template.encapsulation === view_1.ViewEncapsulation.Emulated;
        return this._compileStyles(getStylesVarName(comp), comp.template.styles, comp.template.styleUrls, shim);
    };
    StyleCompiler.prototype.compileStylesheet = function (stylesheetUrl, cssText, isShimmed) {
        var styleWithImports = style_url_resolver_1.extractStyleUrls(this._urlResolver, stylesheetUrl, cssText);
        return this._compileStyles(getStylesVarName(null), [styleWithImports.style], styleWithImports.styleUrls, isShimmed);
    };
    StyleCompiler.prototype._compileStyles = function (stylesVar, plainStyles, absUrls, shim) {
        var _this = this;
        var styleExpressions = plainStyles.map(function (plainStyle) { return o.literal(_this._shimIfNeeded(plainStyle, shim)); });
        var dependencies = [];
        for (var i = 0; i < absUrls.length; i++) {
            var identifier = new compile_metadata_1.CompileIdentifierMetadata({ name: getStylesVarName(null) });
            dependencies.push(new StylesCompileDependency(absUrls[i], shim, identifier));
            styleExpressions.push(new o.ExternalExpr(identifier));
        }
        // styles variable contains plain strings and arrays of other styles arrays (recursive),
        // so we set its type to dynamic.
        var stmt = o.variable(stylesVar)
            .set(o.literalArr(styleExpressions, new o.ArrayType(o.DYNAMIC_TYPE, [o.TypeModifier.Const])))
            .toDeclStmt(null, [o.StmtModifier.Final]);
        return new StylesCompileResult([stmt], stylesVar, dependencies);
    };
    StyleCompiler.prototype._shimIfNeeded = function (style, shim) {
        return shim ? this._shadowCss.shimCssText(style, CONTENT_ATTR, HOST_ATTR) : style;
    };
    StyleCompiler = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [url_resolver_1.UrlResolver])
    ], StyleCompiler);
    return StyleCompiler;
}());
exports.StyleCompiler = StyleCompiler;
function getStylesVarName(component) {
    var result = "styles";
    if (lang_1.isPresent(component)) {
        result += "_" + component.type.name;
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVfY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTRubzNaUXZPLnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvc3R5bGVfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGlDQUlPLG9CQUFvQixDQUFDLENBQUE7QUFDNUIsSUFBWSxDQUFDLFdBQU0scUJBQXFCLENBQUMsQ0FBQTtBQUN6QyxxQkFBZ0MsaUNBQWlDLENBQUMsQ0FBQTtBQUNsRSwyQkFBd0Isa0NBQWtDLENBQUMsQ0FBQTtBQUMzRCw2QkFBMEIsb0NBQW9DLENBQUMsQ0FBQTtBQUMvRCxtQ0FBK0Isc0JBQXNCLENBQUMsQ0FBQTtBQUN0RCxtQkFBeUIsc0JBQXNCLENBQUMsQ0FBQTtBQUNoRCxxQkFBd0IsMEJBQTBCLENBQUMsQ0FBQTtBQUVuRCxJQUFNLGtCQUFrQixHQUFHLFFBQVEsQ0FBQztBQUNwQyxJQUFNLFNBQVMsR0FBRyxhQUFXLGtCQUFvQixDQUFDO0FBQ2xELElBQU0sWUFBWSxHQUFHLGdCQUFjLGtCQUFvQixDQUFDO0FBRXhEO0lBQ0UsaUNBQW1CLFNBQWlCLEVBQVMsU0FBa0IsRUFDNUMsZ0JBQTJDO1FBRDNDLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFTO1FBQzVDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBMkI7SUFBRyxDQUFDO0lBQ3BFLDhCQUFDO0FBQUQsQ0FBQyxBQUhELElBR0M7QUFIWSwrQkFBdUIsMEJBR25DLENBQUE7QUFFRDtJQUNFLDZCQUFtQixVQUF5QixFQUFTLFNBQWlCLEVBQ25ELFlBQXVDO1FBRHZDLGVBQVUsR0FBVixVQUFVLENBQWU7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ25ELGlCQUFZLEdBQVosWUFBWSxDQUEyQjtJQUFHLENBQUM7SUFDaEUsMEJBQUM7QUFBRCxDQUFD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Q0FBQztJQUNwRixDQUFDO0lBeENIO1FBQUMsZUFBVSxFQUFFOztxQkFBQTtJQXlDYixvQkFBQztBQUFELENBQUMsQUF4Q0QsSUF3Q0M7QUF4Q1kscUJBQWEsZ0JBd0N6QixDQUFBO0FBRUQsMEJBQTBCLFNBQW1DO0lBQzNELElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQztJQUN0QixFQUFFLENBQUMsQ0FBQyxnQkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixNQUFNLElBQUksTUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQU0sQ0FBQztJQUN0QyxDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGEsXG4gIENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGEsXG4gIENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVxufSBmcm9tICcuL2NvbXBpbGVfbWV0YWRhdGEnO1xuaW1wb3J0ICogYXMgbyBmcm9tICcuL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7Vmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL21ldGFkYXRhL3ZpZXcnO1xuaW1wb3J0IHtTaGFkb3dDc3N9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci9zaGFkb3dfY3NzJztcbmltcG9ydCB7VXJsUmVzb2x2ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci91cmxfcmVzb2x2ZXInO1xuaW1wb3J0IHtleHRyYWN0U3R5bGVVcmxzfSBmcm9tICcuL3N0eWxlX3VybF9yZXNvbHZlcic7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7aXNQcmVzZW50fSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG5jb25zdCBDT01QT05FTlRfVkFSSUFCTEUgPSAnJUNPTVAlJztcbmNvbnN0IEhPU1RfQVRUUiA9IGBfbmdob3N0LSR7Q09NUE9ORU5UX1ZBUklBQkxFfWA7XG5jb25zdCBDT05URU5UX0FUVFIgPSBgX25nY29udGVudC0ke0NPTVBPTkVOVF9WQVJJQUJMRX1gO1xuXG5leHBvcnQgY2xhc3MgU3R5bGVzQ29tcGlsZURlcGVuZGVuY3kge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgc291cmNlVXJsOiBzdHJpbmcsIHB1YmxpYyBpc1NoaW1tZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHB1YmxpYyB2YWx1ZVBsYWNlaG9sZGVyOiBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgU3R5bGVzQ29tcGlsZVJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGF0ZW1lbnRzOiBvLlN0YXRlbWVudFtdLCBwdWJsaWMgc3R5bGVzVmFyOiBzdHJpbmcsXG4gICAgICAgICAgICAgIHB1YmxpYyBkZXBlbmRlbmNpZXM6IFN0eWxlc0NvbXBpbGVEZXBlbmRlbmN5W10pIHt9XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdHlsZUNvbXBpbGVyIHtcbiAgcHJpdmF0ZSBfc2hhZG93Q3NzOiBTaGFkb3dDc3MgPSBuZXcgU2hhZG93Q3NzKCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdXJsUmVzb2x2ZXI6IFVybFJlc29sdmVyKSB7fVxuXG4gIGNvbXBpbGVDb21wb25lbnQoY29tcDogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhKTogU3R5bGVzQ29tcGlsZVJlc3VsdCB7XG4gICAgdmFyIHNoaW0gPSBjb21wLnRlbXBsYXRlLmVuY2Fwc3VsYXRpb24gPT09IFZpZXdFbmNhcHN1bGF0aW9uLkVtdWxhdGVkO1xuICAgIHJldHVybiB0aGlzLl9jb21waWxlU3R5bGVzKGdldFN0eWxlc1Zhck5hbWUoY29tcCksIGNvbXAudGVtcGxhdGUuc3R5bGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXAudGVtcGxhdGUuc3R5bGVVcmxzLCBzaGltKTtcbiAgfVxuXG4gIGNvbXBpbGVTdHlsZXNoZWV0KHN0eWxlc2hlZXRVcmw6IHN0cmluZywgY3NzVGV4dDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICBpc1NoaW1tZWQ6IGJvb2xlYW4pOiBTdHlsZXNDb21waWxlUmVzdWx0IHtcbiAgICB2YXIgc3R5bGVXaXRoSW1wb3J0cyA9IGV4dHJhY3RTdHlsZVVybHModGhpcy5fdXJsUmVzb2x2ZXIsIHN0eWxlc2hlZXRVcmwsIGNzc1RleHQpO1xuICAgIHJldHVybiB0aGlzLl9jb21waWxlU3R5bGVzKGdldFN0eWxlc1Zhck5hbWUobnVsbCksIFtzdHlsZVdpdGhJbXBvcnRzLnN0eWxlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZVdpdGhJbXBvcnRzLnN0eWxlVXJscywgaXNTaGltbWVkKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbXBpbGVTdHlsZXMoc3R5bGVzVmFyOiBzdHJpbmcsIHBsYWluU3R5bGVzOiBzdHJpbmdbXSwgYWJzVXJsczogc3RyaW5nW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgc2hpbTogYm9vbGVhbik6IFN0eWxlc0NvbXBpbGVSZXN1bHQge1xuICAgIHZhciBzdHlsZUV4cHJlc3Npb25zID1cbiAgICAgICAgcGxhaW5TdHlsZXMubWFwKHBsYWluU3R5bGUgPT4gby5saXRlcmFsKHRoaXMuX3NoaW1JZk5lZWRlZChwbGFpblN0eWxlLCBzaGltKSkpO1xuICAgIHZhciBkZXBlbmRlbmNpZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFic1VybHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbmV3IENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGEoe25hbWU6IGdldFN0eWxlc1Zhck5hbWUobnVsbCl9KTtcbiAgICAgIGRlcGVuZGVuY2llcy5wdXNoKG5ldyBTdHlsZXNDb21waWxlRGVwZW5kZW5jeShhYnNVcmxzW2ldLCBzaGltLCBpZGVudGlmaWVyKSk7XG4gICAgICBzdHlsZUV4cHJlc3Npb25zLnB1c2gobmV3IG8uRXh0ZXJuYWxFeHByKGlkZW50aWZpZXIpKTtcbiAgICB9XG4gICAgLy8gc3R5bGVzIHZhcmlhYmxlIGNvbnRhaW5zIHBsYWluIHN0cmluZ3MgYW5kIGFycmF5cyBvZiBvdGhlciBzdHlsZXMgYXJyYXlzIChyZWN1cnNpdmUpLFxuICAgIC8vIHNvIHdlIHNldCBpdHMgdHlwZSB0byBkeW5hbWljLlxuICAgIHZhciBzdG10ID0gby52YXJpYWJsZShzdHlsZXNWYXIpXG4gICAgICAgICAgICAgICAgICAgLnNldChvLmxpdGVyYWxBcnIoc3R5bGVFeHByZXNzaW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgby5BcnJheVR5cGUoby5EWU5BTUlDX1RZUEUsIFtvLlR5cGVNb2RpZmllci5Db25zdF0pKSlcbiAgICAgICAgICAgICAgICAgICAudG9EZWNsU3RtdChudWxsLCBbby5TdG10TW9kaWZpZXIuRmluYWxdKTtcbiAgICByZXR1cm4gbmV3IFN0eWxlc0NvbXBpbGVSZXN1bHQoW3N0bXRdLCBzdHlsZXNWYXIsIGRlcGVuZGVuY2llcyk7XG4gIH1cblxuICBwcml2YXRlIF9zaGltSWZOZWVkZWQoc3R5bGU6IHN0cmluZywgc2hpbTogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgcmV0dXJuIHNoaW0gPyB0aGlzLl9zaGFkb3dDc3Muc2hpbUNzc1RleHQoc3R5bGUsIENPTlRFTlRfQVRUUiwgSE9TVF9BVFRSKSA6IHN0eWxlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFN0eWxlc1Zhck5hbWUoY29tcG9uZW50OiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEpOiBzdHJpbmcge1xuICB2YXIgcmVzdWx0ID0gYHN0eWxlc2A7XG4gIGlmIChpc1ByZXNlbnQoY29tcG9uZW50KSkge1xuICAgIHJlc3VsdCArPSBgXyR7Y29tcG9uZW50LnR5cGUubmFtZX1gO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59Il19