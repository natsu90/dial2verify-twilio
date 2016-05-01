var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CompileDirectiveMetadata, CompileTemplateMetadata } from './compile_metadata';
import { isPresent } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { XHR } from 'angular2/src/compiler/xhr';
import { UrlResolver } from 'angular2/src/compiler/url_resolver';
import { extractStyleUrls, isStyleUrlResolvable } from './style_url_resolver';
import { Injectable } from 'angular2/src/core/di';
import { ViewEncapsulation } from 'angular2/src/core/metadata/view';
import { HtmlTextAst, htmlVisitAll } from './html_ast';
import { HtmlParser } from './html_parser';
import { preparseElement, PreparsedElementType } from './template_preparser';
export let DirectiveNormalizer = class DirectiveNormalizer {
    constructor(_xhr, _urlResolver, _htmlParser) {
        this._xhr = _xhr;
        this._urlResolver = _urlResolver;
        this._htmlParser = _htmlParser;
    }
    normalizeDirective(directive) {
        if (!directive.isComponent) {
            // For non components there is nothing to be normalized yet.
            return PromiseWrapper.resolve(directive);
        }
        return this.normalizeTemplate(directive.type, directive.template)
            .then((normalizedTemplate) => new CompileDirectiveMetadata({
            type: directive.type,
            isComponent: directive.isComponent,
            selector: directive.selector,
            exportAs: directive.exportAs,
            changeDetection: directive.changeDetection,
            inputs: directive.inputs,
            outputs: directive.outputs,
            hostListeners: directive.hostListeners,
            hostProperties: directive.hostProperties,
            hostAttributes: directive.hostAttributes,
            lifecycleHooks: directive.lifecycleHooks,
            providers: directive.providers,
            viewProviders: directive.viewProviders,
            queries: directive.queries,
            viewQueries: directive.viewQueries,
            template: normalizedTemplate
        }));
    }
    normalizeTemplate(directiveType, template) {
        if (isPresent(template.template)) {
            return PromiseWrapper.resolve(this.normalizeLoadedTemplate(directiveType, template, template.template, directiveType.moduleUrl));
        }
        else if (isPresent(template.templateUrl)) {
            var sourceAbsUrl = this._urlResolver.resolve(directiveType.moduleUrl, template.templateUrl);
            return this._xhr.get(sourceAbsUrl)
                .then(templateContent => this.normalizeLoadedTemplate(directiveType, template, templateContent, sourceAbsUrl));
        }
        else {
            throw new BaseException(`No template specified for component ${directiveType.name}`);
        }
    }
    normalizeLoadedTemplate(directiveType, templateMeta, template, templateAbsUrl) {
        var rootNodesAndErrors = this._htmlParser.parse(template, directiveType.name);
        if (rootNodesAndErrors.errors.length > 0) {
            var errorString = rootNodesAndErrors.errors.join('\n');
            throw new BaseException(`Template parse errors:\n${errorString}`);
        }
        var visitor = new TemplatePreparseVisitor();
        htmlVisitAll(visitor, rootNodesAndErrors.rootNodes);
        var allStyles = templateMeta.styles.concat(visitor.styles);
        var allStyleAbsUrls = visitor.styleUrls.filter(isStyleUrlResolvable)
            .map(url => this._urlResolver.resolve(templateAbsUrl, url))
            .concat(templateMeta.styleUrls.filter(isStyleUrlResolvable)
            .map(url => this._urlResolver.resolve(directiveType.moduleUrl, url)));
        var allResolvedStyles = allStyles.map(style => {
            var styleWithImports = extractStyleUrls(this._urlResolver, templateAbsUrl, style);
            styleWithImports.styleUrls.forEach(styleUrl => allStyleAbsUrls.push(styleUrl));
            return styleWithImports.style;
        });
        var encapsulation = templateMeta.encapsulation;
        if (encapsulation === ViewEncapsulation.Emulated && allResolvedStyles.length === 0 &&
            allStyleAbsUrls.length === 0) {
            encapsulation = ViewEncapsulation.None;
        }
        return new CompileTemplateMetadata({
            encapsulation: encapsulation,
            template: template,
            templateUrl: templateAbsUrl,
            styles: allResolvedStyles,
            styleUrls: allStyleAbsUrls,
            ngContentSelectors: visitor.ngContentSelectors
        });
    }
};
DirectiveNormalizer = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [XHR, UrlResolver, HtmlParser])
], DirectiveNormalizer);
class TemplatePreparseVisitor {
    constructor() {
        this.ngContentSelectors = [];
        this.styles = [];
        this.styleUrls = [];
        this.ngNonBindableStackCount = 0;
    }
    visitElement(ast, context) {
        var preparsedElement = preparseElement(ast);
        switch (preparsedElement.type) {
            case PreparsedElementType.NG_CONTENT:
                if (this.ngNonBindableStackCount === 0) {
                    this.ngContentSelectors.push(preparsedElement.selectAttr);
                }
                break;
            case PreparsedElementType.STYLE:
                var textContent = '';
                ast.children.forEach(child => {
                    if (child instanceof HtmlTextAst) {
                        textContent += child.value;
                    }
                });
                this.styles.push(textContent);
                break;
            case PreparsedElementType.STYLESHEET:
                this.styleUrls.push(preparsedElement.hrefAttr);
                break;
            default:
                // DDC reports this as error. See:
                // https://github.com/dart-lang/dev_compiler/issues/428
                break;
        }
        if (preparsedElement.nonBindable) {
            this.ngNonBindableStackCount++;
        }
        htmlVisitAll(this, ast.children);
        if (preparsedElement.nonBindable) {
            this.ngNonBindableStackCount--;
        }
        return null;
    }
    visitComment(ast, context) { return null; }
    visitAttr(ast, context) { return null; }
    visitText(ast, context) { return null; }
    visitExpansion(ast, context) { return null; }
    visitExpansionCase(ast, context) { return null; }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX25vcm1hbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTlEMWlHUVZHLnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvZGlyZWN0aXZlX25vcm1hbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O09BQU8sRUFFTCx3QkFBd0IsRUFDeEIsdUJBQXVCLEVBR3hCLE1BQU0sb0JBQW9CO09BQ3BCLEVBQUMsU0FBUyxFQUFtQixNQUFNLDBCQUEwQjtPQUM3RCxFQUFDLGFBQWEsRUFBQyxNQUFNLGdDQUFnQztPQUNyRCxFQUFDLGNBQWMsRUFBQyxNQUFNLDJCQUEyQjtPQUVqRCxFQUFDLEdBQUcsRUFBQyxNQUFNLDJCQUEyQjtPQUN0QyxFQUFDLFdBQVcsRUFBQyxNQUFNLG9DQUFvQztPQUN2RCxFQUFDLGdCQUFnQixFQUFFLG9CQUFvQixFQUFDLE1BQU0sc0JBQXNCO09BQ3BFLEVBQUMsVUFBVSxFQUFDLE1BQU0sc0JBQXNCO09BQ3hDLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxpQ0FBaUM7T0FHMUQsRUFHTCxXQUFXLEVBTVgsWUFBWSxFQUNiLE1BQU0sWUFBWTtPQUNaLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZTtPQUVqQyxFQUFDLGVBQWUsRUFBb0Isb0JBQW9CLEVBQUMsTUFBTSxzQkFBc0I7QUFHNUY7SUFDRSxZQUFvQixJQUFTLEVBQVUsWUFBeUIsRUFDNUMsV0FBdUI7UUFEdkIsU0FBSSxHQUFKLElBQUksQ0FBSztRQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQzVDLGdCQUFXLEdBQVgsV0FBVyxDQUFZO0lBQUcsQ0FBQztJQUUvQyxrQkFBa0IsQ0FBQyxTQUFtQztRQUNwRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQzNCLDREQUE0RDtZQUM1RCxNQUFNLENBQUMsY0FBYyxDQUFD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ZXRhZGF0YSxcbiAgQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICBDb21waWxlVGVtcGxhdGVNZXRhZGF0YSxcbiAgQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGEsXG4gIENvbXBpbGVUb2tlbk1ldGFkYXRhXG59IGZyb20gJy4vY29tcGlsZV9tZXRhZGF0YSc7XG5pbXBvcnQge2lzUHJlc2VudCwgaXNCbGFuaywgaXNBcnJheX0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7UHJvbWlzZVdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmMnO1xuXG5pbXBvcnQge1hIUn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3hocic7XG5pbXBvcnQge1VybFJlc29sdmVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIvdXJsX3Jlc29sdmVyJztcbmltcG9ydCB7ZXh0cmFjdFN0eWxlVXJscywgaXNTdHlsZVVybFJlc29sdmFibGV9IGZyb20gJy4vc3R5bGVfdXJsX3Jlc29sdmVyJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbWV0YWRhdGEvdmlldyc7XG5cblxuaW1wb3J0IHtcbiAgSHRtbEFzdFZpc2l0b3IsXG4gIEh0bWxFbGVtZW50QXN0LFxuICBIdG1sVGV4dEFzdCxcbiAgSHRtbEF0dHJBc3QsXG4gIEh0bWxBc3QsXG4gIEh0bWxDb21tZW50QXN0LFxuICBIdG1sRXhwYW5zaW9uQXN0LFxuICBIdG1sRXhwYW5zaW9uQ2FzZUFzdCxcbiAgaHRtbFZpc2l0QWxsXG59IGZyb20gJy4vaHRtbF9hc3QnO1xuaW1wb3J0IHtIdG1sUGFyc2VyfSBmcm9tICcuL2h0bWxfcGFyc2VyJztcblxuaW1wb3J0IHtwcmVwYXJzZUVsZW1lbnQsIFByZXBhcnNlZEVsZW1lbnQsIFByZXBhcnNlZEVsZW1lbnRUeXBlfSBmcm9tICcuL3RlbXBsYXRlX3ByZXBhcnNlcic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEaXJlY3RpdmVOb3JtYWxpemVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfeGhyOiBYSFIsIHByaXZhdGUgX3VybFJlc29sdmVyOiBVcmxSZXNvbHZlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfaHRtbFBhcnNlcjogSHRtbFBhcnNlcikge31cblxuICBub3JtYWxpemVEaXJlY3RpdmUoZGlyZWN0aXZlOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEpOiBQcm9taXNlPENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YT4ge1xuICAgIGlmICghZGlyZWN0aXZlLmlzQ29tcG9uZW50KSB7XG4gICAgICAvLyBGb3Igbm9uIGNvbXBvbmVudHMgdGhlcmUgaXMgbm90aGluZyB0byBiZSBub3JtYWxpemVkIHlldC5cbiAgICAgIHJldHVybiBQcm9taXNlV3JhcHBlci5yZXNvbHZlKGRpcmVjdGl2ZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZVRlbXBsYXRlKGRpcmVjdGl2ZS50eXBlLCBkaXJlY3RpdmUudGVtcGxhdGUpXG4gICAgICAgIC50aGVuKChub3JtYWxpemVkVGVtcGxhdGU6IENvbXBpbGVUZW1wbGF0ZU1ldGFkYXRhKSA9PiBuZXcgQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBkaXJlY3RpdmUudHlwZSxcbiAgICAgICAgICAgICAgICBpc0NvbXBvbmVudDogZGlyZWN0aXZlLmlzQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBkaXJlY3RpdmUuc2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgZXhwb3J0QXM6IGRpcmVjdGl2ZS5leHBvcnRBcyxcbiAgICAgICAgICAgICAgICBjaGFuZ2VEZXRlY3Rpb246IGRpcmVjdGl2ZS5jaGFuZ2VEZXRlY3Rpb24sXG4gICAgICAgICAgICAgICAgaW5wdXRzOiBkaXJlY3RpdmUuaW5wdXRzLFxuICAgICAgICAgICAgICAgIG91dHB1dHM6IGRpcmVjdGl2ZS5vdXRwdXRzLFxuICAgICAgICAgICAgICAgIGhvc3RMaXN0ZW5lcnM6IGRpcmVjdGl2ZS5ob3N0TGlzdGVuZXJzLFxuICAgICAgICAgICAgICAgIGhvc3RQcm9wZXJ0aWVzOiBkaXJlY3RpdmUuaG9zdFByb3BlcnRpZXMsXG4gICAgICAgICAgICAgICAgaG9zdEF0dHJpYnV0ZXM6IGRpcmVjdGl2ZS5ob3N0QXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICBsaWZlY3ljbGVIb29rczogZGlyZWN0aXZlLmxpZmVjeWNsZUhvb2tzLFxuICAgICAgICAgICAgICAgIHByb3ZpZGVyczogZGlyZWN0aXZlLnByb3ZpZGVycyxcbiAgICAgICAgICAgICAgICB2aWV3UHJvdmlkZXJzOiBkaXJlY3RpdmUudmlld1Byb3ZpZGVycyxcbiAgICAgICAgICAgICAgICBxdWVyaWVzOiBkaXJlY3RpdmUucXVlcmllcyxcbiAgICAgICAgICAgICAgICB2aWV3UXVlcmllczogZGlyZWN0aXZlLnZpZXdRdWVyaWVzLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBub3JtYWxpemVkVGVtcGxhdGVcbiAgICAgICAgICAgICAgfSkpO1xuICB9XG5cbiAgbm9ybWFsaXplVGVtcGxhdGUoZGlyZWN0aXZlVHlwZTogQ29tcGlsZVR5cGVNZXRhZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IENvbXBpbGVUZW1wbGF0ZU1ldGFkYXRhKTogUHJvbWlzZTxDb21waWxlVGVtcGxhdGVNZXRhZGF0YT4ge1xuICAgIGlmIChpc1ByZXNlbnQodGVtcGxhdGUudGVtcGxhdGUpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZVdyYXBwZXIucmVzb2x2ZSh0aGlzLm5vcm1hbGl6ZUxvYWRlZFRlbXBsYXRlKFxuICAgICAgICAgIGRpcmVjdGl2ZVR5cGUsIHRlbXBsYXRlLCB0ZW1wbGF0ZS50ZW1wbGF0ZSwgZGlyZWN0aXZlVHlwZS5tb2R1bGVVcmwpKTtcbiAgICB9IGVsc2UgaWYgKGlzUHJlc2VudCh0ZW1wbGF0ZS50ZW1wbGF0ZVVybCkpIHtcbiAgICAgIHZhciBzb3VyY2VBYnNVcmwgPSB0aGlzLl91cmxSZXNvbHZlci5yZXNvbHZlKGRpcmVjdGl2ZVR5cGUubW9kdWxlVXJsLCB0ZW1wbGF0ZS50ZW1wbGF0ZVVybCk7XG4gICAgICByZXR1cm4gdGhpcy5feGhyLmdldChzb3VyY2VBYnNVcmwpXG4gICAgICAgICAgLnRoZW4odGVtcGxhdGVDb250ZW50ID0+IHRoaXMubm9ybWFsaXplTG9hZGVkVGVtcGxhdGUoZGlyZWN0aXZlVHlwZSwgdGVtcGxhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVDb250ZW50LCBzb3VyY2VBYnNVcmwpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYE5vIHRlbXBsYXRlIHNwZWNpZmllZCBmb3IgY29tcG9uZW50ICR7ZGlyZWN0aXZlVHlwZS5uYW1lfWApO1xuICAgIH1cbiAgfVxuXG4gIG5vcm1hbGl6ZUxvYWRlZFRlbXBsYXRlKGRpcmVjdGl2ZVR5cGU6IENvbXBpbGVUeXBlTWV0YWRhdGEsIHRlbXBsYXRlTWV0YTogQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBzdHJpbmcsIHRlbXBsYXRlQWJzVXJsOiBzdHJpbmcpOiBDb21waWxlVGVtcGxhdGVNZXRhZGF0YSB7XG4gICAgdmFyIHJvb3ROb2Rlc0FuZEVycm9ycyA9IHRoaXMuX2h0bWxQYXJzZXIucGFyc2UodGVtcGxhdGUsIGRpcmVjdGl2ZVR5cGUubmFtZSk7XG4gICAgaWYgKHJvb3ROb2Rlc0FuZEVycm9ycy5lcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGVycm9yU3RyaW5nID0gcm9vdE5vZGVzQW5kRXJyb3JzLmVycm9ycy5qb2luKCdcXG4nKTtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBUZW1wbGF0ZSBwYXJzZSBlcnJvcnM6XFxuJHtlcnJvclN0cmluZ31gKTtcbiAgICB9XG5cbiAgICB2YXIgdmlzaXRvciA9IG5ldyBUZW1wbGF0ZVByZXBhcnNlVmlzaXRvcigpO1xuICAgIGh0bWxWaXNpdEFsbCh2aXNpdG9yLCByb290Tm9kZXNBbmRFcnJvcnMucm9vdE5vZGVzKTtcbiAgICB2YXIgYWxsU3R5bGVzID0gdGVtcGxhdGVNZXRhLnN0eWxlcy5jb25jYXQodmlzaXRvci5zdHlsZXMpO1xuXG4gICAgdmFyIGFsbFN0eWxlQWJzVXJscyA9XG4gICAgICAgIHZpc2l0b3Iuc3R5bGVVcmxzLmZpbHRlcihpc1N0eWxlVXJsUmVzb2x2YWJsZSlcbiAgICAgICAgICAgIC5tYXAodXJsID0+IHRoaXMuX3VybFJlc29sdmVyLnJlc29sdmUodGVtcGxhdGVBYnNVcmwsIHVybCkpXG4gICAgICAgICAgICAuY29uY2F0KHRlbXBsYXRlTWV0YS5zdHlsZVVybHMuZmlsdGVyKGlzU3R5bGVVcmxSZXNvbHZhYmxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCh1cmwgPT4gdGhpcy5fdXJsUmVzb2x2ZXIucmVzb2x2ZShkaXJlY3RpdmVUeXBlLm1vZHVsZVVybCwgdXJsKSkpO1xuXG4gICAgdmFyIGFsbFJlc29sdmVkU3R5bGVzID0gYWxsU3R5bGVzLm1hcChzdHlsZSA9PiB7XG4gICAgICB2YXIgc3R5bGVXaXRoSW1wb3J0cyA9IGV4dHJhY3RTdHlsZVVybHModGhpcy5fdXJsUmVzb2x2ZXIsIHRlbXBsYXRlQWJzVXJsLCBzdHlsZSk7XG4gICAgICBzdHlsZVdpdGhJbXBvcnRzLnN0eWxlVXJscy5mb3JFYWNoKHN0eWxlVXJsID0+IGFsbFN0eWxlQWJzVXJscy5wdXNoKHN0eWxlVXJsKSk7XG4gICAgICByZXR1cm4gc3R5bGVXaXRoSW1wb3J0cy5zdHlsZTtcbiAgICB9KTtcblxuICAgIHZhciBlbmNhcHN1bGF0aW9uID0gdGVtcGxhdGVNZXRhLmVuY2Fwc3VsYXRpb247XG4gICAgaWYgKGVuY2Fwc3VsYXRpb24gPT09IFZpZXdFbmNhcHN1bGF0aW9uLkVtdWxhdGVkICYmIGFsbFJlc29sdmVkU3R5bGVzLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgICBhbGxTdHlsZUFic1VybHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBlbmNhcHN1bGF0aW9uID0gVmlld0VuY2Fwc3VsYXRpb24uTm9uZTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBDb21waWxlVGVtcGxhdGVNZXRhZGF0YSh7XG4gICAgICBlbmNhcHN1bGF0aW9uOiBlbmNhcHN1bGF0aW9uLFxuICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlQWJzVXJsLFxuICAgICAgc3R5bGVzOiBhbGxSZXNvbHZlZFN0eWxlcyxcbiAgICAgIHN0eWxlVXJsczogYWxsU3R5bGVBYnNVcmxzLFxuICAgICAgbmdDb250ZW50U2VsZWN0b3JzOiB2aXNpdG9yLm5nQ29udGVudFNlbGVjdG9yc1xuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIFRlbXBsYXRlUHJlcGFyc2VWaXNpdG9yIGltcGxlbWVudHMgSHRtbEFzdFZpc2l0b3Ige1xuICBuZ0NvbnRlbnRTZWxlY3RvcnM6IHN0cmluZ1tdID0gW107XG4gIHN0eWxlczogc3RyaW5nW10gPSBbXTtcbiAgc3R5bGVVcmxzOiBzdHJpbmdbXSA9IFtdO1xuICBuZ05vbkJpbmRhYmxlU3RhY2tDb3VudDogbnVtYmVyID0gMDtcblxuICB2aXNpdEVsZW1lbnQoYXN0OiBIdG1sRWxlbWVudEFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB2YXIgcHJlcGFyc2VkRWxlbWVudCA9IHByZXBhcnNlRWxlbWVudChhc3QpO1xuICAgIHN3aXRjaCAocHJlcGFyc2VkRWxlbWVudC50eXBlKSB7XG4gICAgICBjYXNlIFByZXBhcnNlZEVsZW1lbnRUeXBlLk5HX0NPTlRFTlQ6XG4gICAgICAgIGlmICh0aGlzLm5nTm9uQmluZGFibGVTdGFja0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5uZ0NvbnRlbnRTZWxlY3RvcnMucHVzaChwcmVwYXJzZWRFbGVtZW50LnNlbGVjdEF0dHIpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQcmVwYXJzZWRFbGVtZW50VHlwZS5TVFlMRTpcbiAgICAgICAgdmFyIHRleHRDb250ZW50ID0gJyc7XG4gICAgICAgIGFzdC5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBIdG1sVGV4dEFzdCkge1xuICAgICAgICAgICAgdGV4dENvbnRlbnQgKz0gKDxIdG1sVGV4dEFzdD5jaGlsZCkudmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zdHlsZXMucHVzaCh0ZXh0Q29udGVudCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQcmVwYXJzZWRFbGVtZW50VHlwZS5TVFlMRVNIRUVUOlxuICAgICAgICB0aGlzLnN0eWxlVXJscy5wdXNoKHByZXBhcnNlZEVsZW1lbnQuaHJlZkF0dHIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIEREQyByZXBvcnRzIHRoaXMgYXMgZXJyb3IuIFNlZTpcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2RhcnQtbGFuZy9kZXZfY29tcGlsZXIvaXNzdWVzLzQyOFxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKHByZXBhcnNlZEVsZW1lbnQubm9uQmluZGFibGUpIHtcbiAgICAgIHRoaXMubmdOb25CaW5kYWJsZVN0YWNrQ291bnQrKztcbiAgICB9XG4gICAgaHRtbFZpc2l0QWxsKHRoaXMsIGFzdC5jaGlsZHJlbik7XG4gICAgaWYgKHByZXBhcnNlZEVsZW1lbnQubm9uQmluZGFibGUpIHtcbiAgICAgIHRoaXMubmdOb25CaW5kYWJsZVN0YWNrQ291bnQtLTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRDb21tZW50KGFzdDogSHRtbENvbW1lbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG4gIHZpc2l0QXR0cihhc3Q6IEh0bWxBdHRyQXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuICB2aXNpdFRleHQoYXN0OiBIdG1sVGV4dEFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbiAgdmlzaXRFeHBhbnNpb24oYXN0OiBIdG1sRXhwYW5zaW9uQXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHZpc2l0RXhwYW5zaW9uQ2FzZShhc3Q6IEh0bWxFeHBhbnNpb25DYXNlQXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxufVxuIl19