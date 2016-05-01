var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CompileIdentifierMetadata } from './compile_metadata';
import * as o from './output/output_ast';
import { ViewEncapsulation } from 'angular2/src/core/metadata/view';
import { ShadowCss } from 'angular2/src/compiler/shadow_css';
import { UrlResolver } from 'angular2/src/compiler/url_resolver';
import { extractStyleUrls } from './style_url_resolver';
import { Injectable } from 'angular2/src/core/di';
import { isPresent } from 'angular2/src/facade/lang';
const COMPONENT_VARIABLE = '%COMP%';
const HOST_ATTR = `_nghost-${COMPONENT_VARIABLE}`;
const CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;
export class StylesCompileDependency {
    constructor(sourceUrl, isShimmed, valuePlaceholder) {
        this.sourceUrl = sourceUrl;
        this.isShimmed = isShimmed;
        this.valuePlaceholder = valuePlaceholder;
    }
}
export class StylesCompileResult {
    constructor(statements, stylesVar, dependencies) {
        this.statements = statements;
        this.stylesVar = stylesVar;
        this.dependencies = dependencies;
    }
}
export let StyleCompiler = class StyleCompiler {
    constructor(_urlResolver) {
        this._urlResolver = _urlResolver;
        this._shadowCss = new ShadowCss();
    }
    compileComponent(comp) {
        var shim = comp.template.encapsulation === ViewEncapsulation.Emulated;
        return this._compileStyles(getStylesVarName(comp), comp.template.styles, comp.template.styleUrls, shim);
    }
    compileStylesheet(stylesheetUrl, cssText, isShimmed) {
        var styleWithImports = extractStyleUrls(this._urlResolver, stylesheetUrl, cssText);
        return this._compileStyles(getStylesVarName(null), [styleWithImports.style], styleWithImports.styleUrls, isShimmed);
    }
    _compileStyles(stylesVar, plainStyles, absUrls, shim) {
        var styleExpressions = plainStyles.map(plainStyle => o.literal(this._shimIfNeeded(plainStyle, shim)));
        var dependencies = [];
        for (var i = 0; i < absUrls.length; i++) {
            var identifier = new CompileIdentifierMetadata({ name: getStylesVarName(null) });
            dependencies.push(new StylesCompileDependency(absUrls[i], shim, identifier));
            styleExpressions.push(new o.ExternalExpr(identifier));
        }
        // styles variable contains plain strings and arrays of other styles arrays (recursive),
        // so we set its type to dynamic.
        var stmt = o.variable(stylesVar)
            .set(o.literalArr(styleExpressions, new o.ArrayType(o.DYNAMIC_TYPE, [o.TypeModifier.Const])))
            .toDeclStmt(null, [o.StmtModifier.Final]);
        return new StylesCompileResult([stmt], stylesVar, dependencies);
    }
    _shimIfNeeded(style, shim) {
        return shim ? this._shadowCss.shimCssText(style, CONTENT_ATTR, HOST_ATTR) : style;
    }
};
StyleCompiler = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [UrlResolver])
], StyleCompiler);
function getStylesVarName(component) {
    var result = `styles`;
    if (isPresent(component)) {
        result += `_${component.type.name}`;
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVfY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTlEMWlHUVZHLnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvc3R5bGVfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O09BQU8sRUFFTCx5QkFBeUIsRUFFMUIsTUFBTSxvQkFBb0I7T0FDcEIsS0FBSyxDQUFDLE1BQU0scUJBQXFCO09BQ2pDLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxpQ0FBaUM7T0FDMUQsRUFBQyxTQUFTLEVBQUMsTUFBTSxrQ0FBa0M7T0FDbkQsRUFBQyxXQUFXLEVBQUMsTUFBTSxvQ0FBb0M7T0FDdkQsRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQjtPQUM5QyxFQUFDLFVBQVUsRUFBQyxNQUFNLHNCQUFzQjtPQUN4QyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQjtBQUVsRCxNQUFNLGtCQUFrQixHQUFHLFFBQVEsQ0FBQztBQUNwQyxNQUFNLFNBQVMsR0FBRyxXQUFXLGtCQUFrQixFQUFFLENBQUM7QUFDbEQsTUFBTSxZQUFZLEdBQUcsY0FBYyxrQkFBa0IsRUFBRSxDQUFDO0FBRXhEO0lBQ0UsWUFBbUIsU0FBaUIsRUFBUyxTQUFrQixFQUM1QyxnQkFBMkM7UUFEM0MsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUFTLGNBQVMsR0FBVCxTQUFTLENBQVM7UUFDNUMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUEyQjtJQUFHLENBQUM7QUFDcEUsQ0FBQztBQUVEO0lBQ0UsWUFBbUIsVUFBeUIsRUFBUyxTQUFpQixFQUNuRCxZQUF1QztRQUR2QyxlQUFVLEdBQVYsVUFBVSxDQUFlO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNuRCxpQkFBWSxHQUFaLFlBQVksQ0FBMkI7SUFBRyxDQUFDO0FBQ2hFLENBQUM7QUFHRDtJQUdFLFlBQW9CLFlBQXlCO1FBQXpCLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBRnJDLGVBQVUsR0FBYyxJQUFJLFNBQVMsRUFBRSxDQUFDO0lBRUEsQ0FBQztJQUVqRCxnQkFBZ0IsQ0FBQyxJQUE4QjtRQUM3QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsS0FBSyxpQkFBaUIsQ0FBQyxRQUFRLENBQUM7UUFDdEUsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQzVDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxhQUFxQixFQUFFLE9BQWUsRUFDdEMsU0FBa0I7UUFDbEMsSUFBSSxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuRixNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxFQUNoRCxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVPLGNBQWMsQ0FBQyxTQUFpQixFQUFFLFdBQXFCLEVBQUUsT0FBaUIsRUFDM0QsSUFBYTtRQUNsQyxJQUFJLGdCQUFnQixHQUNoQixXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDeEMsSUFBSSxVQUFVLEdBQUcsSUFBSSx5QkFBeUIsQ0FBQyxFQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDL0UsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUM3RSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUNELHdGQUF3RjtRQUN4RixpQ0FBaUM7UUFDakMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7YUFDaEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQ2hCLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDMUUsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN6RCxNQUFNLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRU8sYUFBYSxDQUFDLEtBQWEsRUFBRSxJQUFhO1FBQ2hELE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDcEYsQ0FBQztBQUNILENBQUM7QUF6Q0Q7SUFBQyxVQUFVLEVBQUU7O2lCQUFBO0FBMkNiLDBCQUEwQixTQUFtQztJQUMzRCxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUM7SUFDdEIsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixNQUFNLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21waWxlVGVtcGxhdGVNZXRhZGF0YSxcbiAgQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YSxcbiAgQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhXG59IGZyb20gJy4vY29tcGlsZV9tZXRhZGF0YSc7XG5pbXBvcnQgKiBhcyBvIGZyb20gJy4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbWV0YWRhdGEvdmlldyc7XG5pbXBvcnQge1NoYWRvd0Nzc30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3NoYWRvd19jc3MnO1xuaW1wb3J0IHtVcmxSZXNvbHZlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3VybF9yZXNvbHZlcic7XG5pbXBvcnQge2V4dHJhY3RTdHlsZVVybHN9IGZyb20gJy4vc3R5bGVfdXJsX3Jlc29sdmVyJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtpc1ByZXNlbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbmNvbnN0IENPTVBPTkVOVF9WQVJJQUJMRSA9ICclQ09NUCUnO1xuY29uc3QgSE9TVF9BVFRSID0gYF9uZ2hvc3QtJHtDT01QT05FTlRfVkFSSUFCTEV9YDtcbmNvbnN0IENPTlRFTlRfQVRUUiA9IGBfbmdjb250ZW50LSR7Q09NUE9ORU5UX1ZBUklBQkxFfWA7XG5cbmV4cG9ydCBjbGFzcyBTdHlsZXNDb21waWxlRGVwZW5kZW5jeSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzb3VyY2VVcmw6IHN0cmluZywgcHVibGljIGlzU2hpbW1lZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHVibGljIHZhbHVlUGxhY2Vob2xkZXI6IENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGEpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBTdHlsZXNDb21waWxlUmVzdWx0IHtcbiAgY29uc3RydWN0b3IocHVibGljIHN0YXRlbWVudHM6IG8uU3RhdGVtZW50W10sIHB1YmxpYyBzdHlsZXNWYXI6IHN0cmluZyxcbiAgICAgICAgICAgICAgcHVibGljIGRlcGVuZGVuY2llczogU3R5bGVzQ29tcGlsZURlcGVuZGVuY3lbXSkge31cbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0eWxlQ29tcGlsZXIge1xuICBwcml2YXRlIF9zaGFkb3dDc3M6IFNoYWRvd0NzcyA9IG5ldyBTaGFkb3dDc3MoKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF91cmxSZXNvbHZlcjogVXJsUmVzb2x2ZXIpIHt9XG5cbiAgY29tcGlsZUNvbXBvbmVudChjb21wOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEpOiBTdHlsZXNDb21waWxlUmVzdWx0IHtcbiAgICB2YXIgc2hpbSA9IGNvbXAudGVtcGxhdGUuZW5jYXBzdWxhdGlvbiA9PT0gVmlld0VuY2Fwc3VsYXRpb24uRW11bGF0ZWQ7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBpbGVTdHlsZXMoZ2V0U3R5bGVzVmFyTmFtZShjb21wKSwgY29tcC50ZW1wbGF0ZS5zdHlsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcC50ZW1wbGF0ZS5zdHlsZVVybHMsIHNoaW0pO1xuICB9XG5cbiAgY29tcGlsZVN0eWxlc2hlZXQoc3R5bGVzaGVldFVybDogc3RyaW5nLCBjc3NUZXh0OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgIGlzU2hpbW1lZDogYm9vbGVhbik6IFN0eWxlc0NvbXBpbGVSZXN1bHQge1xuICAgIHZhciBzdHlsZVdpdGhJbXBvcnRzID0gZXh0cmFjdFN0eWxlVXJscyh0aGlzLl91cmxSZXNvbHZlciwgc3R5bGVzaGVldFVybCwgY3NzVGV4dCk7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBpbGVTdHlsZXMoZ2V0U3R5bGVzVmFyTmFtZShudWxsKSwgW3N0eWxlV2l0aEltcG9ydHMuc3R5bGVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlV2l0aEltcG9ydHMuc3R5bGVVcmxzLCBpc1NoaW1tZWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tcGlsZVN0eWxlcyhzdHlsZXNWYXI6IHN0cmluZywgcGxhaW5TdHlsZXM6IHN0cmluZ1tdLCBhYnNVcmxzOiBzdHJpbmdbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBzaGltOiBib29sZWFuKTogU3R5bGVzQ29tcGlsZVJlc3VsdCB7XG4gICAgdmFyIHN0eWxlRXhwcmVzc2lvbnMgPVxuICAgICAgICBwbGFpblN0eWxlcy5tYXAocGxhaW5TdHlsZSA9PiBvLmxpdGVyYWwodGhpcy5fc2hpbUlmTmVlZGVkKHBsYWluU3R5bGUsIHNoaW0pKSk7XG4gICAgdmFyIGRlcGVuZGVuY2llcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWJzVXJscy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBuZXcgQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YSh7bmFtZTogZ2V0U3R5bGVzVmFyTmFtZShudWxsKX0pO1xuICAgICAgZGVwZW5kZW5jaWVzLnB1c2gobmV3IFN0eWxlc0NvbXBpbGVEZXBlbmRlbmN5KGFic1VybHNbaV0sIHNoaW0sIGlkZW50aWZpZXIpKTtcbiAgICAgIHN0eWxlRXhwcmVzc2lvbnMucHVzaChuZXcgby5FeHRlcm5hbEV4cHIoaWRlbnRpZmllcikpO1xuICAgIH1cbiAgICAvLyBzdHlsZXMgdmFyaWFibGUgY29udGFpbnMgcGxhaW4gc3RyaW5ncyBhbmQgYXJyYXlzIG9mIG90aGVyIHN0eWxlcyBhcnJheXMgKHJlY3Vyc2l2ZSksXG4gICAgLy8gc28gd2Ugc2V0IGl0cyB0eXBlIHRvIGR5bmFtaWMuXG4gICAgdmFyIHN0bXQgPSBvLnZhcmlhYmxlKHN0eWxlc1ZhcilcbiAgICAgICAgICAgICAgICAgICAuc2V0KG8ubGl0ZXJhbEFycihzdHlsZUV4cHJlc3Npb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBvLkFycmF5VHlwZShvLkRZTkFNSUNfVFlQRSwgW28uVHlwZU1vZGlmaWVyLkNvbnN0XSkpKVxuICAgICAgICAgICAgICAgICAgIC50b0RlY2xTdG10KG51bGwsIFtvLlN0bXRNb2RpZmllci5GaW5hbF0pO1xuICAgIHJldHVybiBuZXcgU3R5bGVzQ29tcGlsZVJlc3VsdChbc3RtdF0sIHN0eWxlc1ZhciwgZGVwZW5kZW5jaWVzKTtcbiAgfVxuXG4gIHByaXZhdGUgX3NoaW1JZk5lZWRlZChzdHlsZTogc3RyaW5nLCBzaGltOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc2hpbSA/IHRoaXMuX3NoYWRvd0Nzcy5zaGltQ3NzVGV4dChzdHlsZSwgQ09OVEVOVF9BVFRSLCBIT1NUX0FUVFIpIDogc3R5bGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0U3R5bGVzVmFyTmFtZShjb21wb25lbnQ6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSk6IHN0cmluZyB7XG4gIHZhciByZXN1bHQgPSBgc3R5bGVzYDtcbiAgaWYgKGlzUHJlc2VudChjb21wb25lbnQpKSB7XG4gICAgcmVzdWx0ICs9IGBfJHtjb21wb25lbnQudHlwZS5uYW1lfWA7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn0iXX0=