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
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var async_1 = require('angular2/src/facade/async');
var xhr_1 = require('angular2/src/compiler/xhr');
var url_resolver_1 = require('angular2/src/compiler/url_resolver');
var style_url_resolver_1 = require('./style_url_resolver');
var di_1 = require('angular2/src/core/di');
var view_1 = require('angular2/src/core/metadata/view');
var html_ast_1 = require('./html_ast');
var html_parser_1 = require('./html_parser');
var template_preparser_1 = require('./template_preparser');
var DirectiveNormalizer = (function () {
    function DirectiveNormalizer(_xhr, _urlResolver, _htmlParser) {
        this._xhr = _xhr;
        this._urlResolver = _urlResolver;
        this._htmlParser = _htmlParser;
    }
    DirectiveNormalizer.prototype.normalizeDirective = function (directive) {
        if (!directive.isComponent) {
            // For non components there is nothing to be normalized yet.
            return async_1.PromiseWrapper.resolve(directive);
        }
        return this.normalizeTemplate(directive.type, directive.template)
            .then(function (normalizedTemplate) { return new compile_metadata_1.CompileDirectiveMetadata({
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
        }); });
    };
    DirectiveNormalizer.prototype.normalizeTemplate = function (directiveType, template) {
        var _this = this;
        if (lang_1.isPresent(template.template)) {
            return async_1.PromiseWrapper.resolve(this.normalizeLoadedTemplate(directiveType, template, template.template, directiveType.moduleUrl));
        }
        else if (lang_1.isPresent(template.templateUrl)) {
            var sourceAbsUrl = this._urlResolver.resolve(directiveType.moduleUrl, template.templateUrl);
            return this._xhr.get(sourceAbsUrl)
                .then(function (templateContent) { return _this.normalizeLoadedTemplate(directiveType, template, templateContent, sourceAbsUrl); });
        }
        else {
            throw new exceptions_1.BaseException("No template specified for component " + directiveType.name);
        }
    };
    DirectiveNormalizer.prototype.normalizeLoadedTemplate = function (directiveType, templateMeta, template, templateAbsUrl) {
        var _this = this;
        var rootNodesAndErrors = this._htmlParser.parse(template, directiveType.name);
        if (rootNodesAndErrors.errors.length > 0) {
            var errorString = rootNodesAndErrors.errors.join('\n');
            throw new exceptions_1.BaseException("Template parse errors:\n" + errorString);
        }
        var visitor = new TemplatePreparseVisitor();
        html_ast_1.htmlVisitAll(visitor, rootNodesAndErrors.rootNodes);
        var allStyles = templateMeta.styles.concat(visitor.styles);
        var allStyleAbsUrls = visitor.styleUrls.filter(style_url_resolver_1.isStyleUrlResolvable)
            .map(function (url) { return _this._urlResolver.resolve(templateAbsUrl, url); })
            .concat(templateMeta.styleUrls.filter(style_url_resolver_1.isStyleUrlResolvable)
            .map(function (url) { return _this._urlResolver.resolve(directiveType.moduleUrl, url); }));
        var allResolvedStyles = allStyles.map(function (style) {
            var styleWithImports = style_url_resolver_1.extractStyleUrls(_this._urlResolver, templateAbsUrl, style);
            styleWithImports.styleUrls.forEach(function (styleUrl) { return allStyleAbsUrls.push(styleUrl); });
            return styleWithImports.style;
        });
        var encapsulation = templateMeta.encapsulation;
        if (encapsulation === view_1.ViewEncapsulation.Emulated && allResolvedStyles.length === 0 &&
            allStyleAbsUrls.length === 0) {
            encapsulation = view_1.ViewEncapsulation.None;
        }
        return new compile_metadata_1.CompileTemplateMetadata({
            encapsulation: encapsulation,
            template: template,
            templateUrl: templateAbsUrl,
            styles: allResolvedStyles,
            styleUrls: allStyleAbsUrls,
            ngContentSelectors: visitor.ngContentSelectors
        });
    };
    DirectiveNormalizer = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [xhr_1.XHR, url_resolver_1.UrlResolver, html_parser_1.HtmlParser])
    ], DirectiveNormalizer);
    return DirectiveNormalizer;
}());
exports.DirectiveNormalizer = DirectiveNormalizer;
var TemplatePreparseVisitor = (function () {
    function TemplatePreparseVisitor() {
        this.ngContentSelectors = [];
        this.styles = [];
        this.styleUrls = [];
        this.ngNonBindableStackCount = 0;
    }
    TemplatePreparseVisitor.prototype.visitElement = function (ast, context) {
        var preparsedElement = template_preparser_1.preparseElement(ast);
        switch (preparsedElement.type) {
            case template_preparser_1.PreparsedElementType.NG_CONTENT:
                if (this.ngNonBindableStackCount === 0) {
                    this.ngContentSelectors.push(preparsedElement.selectAttr);
                }
                break;
            case template_preparser_1.PreparsedElementType.STYLE:
                var textContent = '';
                ast.children.forEach(function (child) {
                    if (child instanceof html_ast_1.HtmlTextAst) {
                        textContent += child.value;
                    }
                });
                this.styles.push(textContent);
                break;
            case template_preparser_1.PreparsedElementType.STYLESHEET:
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
        html_ast_1.htmlVisitAll(this, ast.children);
        if (preparsedElement.nonBindable) {
            this.ngNonBindableStackCount--;
        }
        return null;
    };
    TemplatePreparseVisitor.prototype.visitComment = function (ast, context) { return null; };
    TemplatePreparseVisitor.prototype.visitAttr = function (ast, context) { return null; };
    TemplatePreparseVisitor.prototype.visitText = function (ast, context) { return null; };
    TemplatePreparseVisitor.prototype.visitExpansion = function (ast, context) { return null; };
    TemplatePreparseVisitor.prototype.visitExpansionCase = function (ast, context) { return null; };
    return TemplatePreparseVisitor;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX25vcm1hbGl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTRubzNaUXZPLnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvZGlyZWN0aXZlX25vcm1hbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGlDQU1PLG9CQUFvQixDQUFDLENBQUE7QUFDNUIscUJBQTBDLDBCQUEwQixDQUFDLENBQUE7QUFDckUsMkJBQTRCLGdDQUFnQyxDQUFDLENBQUE7QUFDN0Qsc0JBQTZCLDJCQUEyQixDQUFDLENBQUE7QUFFekQsb0JBQWtCLDJCQUEyQixDQUFDLENBQUE7QUFDOUMsNkJBQTBCLG9DQUFvQyxDQUFDLENBQUE7QUFDL0QsbUNBQXFELHNCQUFzQixDQUFDLENBQUE7QUFDNUUsbUJBQXlCLHNCQUFzQixDQUFDLENBQUE7QUFDaEQscUJBQWdDLGlDQUFpQyxDQUFDLENBQUE7QUFHbEUseUJBVU8sWUFBWSxDQUFDLENBQUE7QUFDcEIsNEJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBRXpDLG1DQUFzRSxzQkFBc0IsQ0FBQyxDQUFBO0FBRzdGO0lBQ0UsNkJBQW9CLElBQVMsRUFBVSxZQUF5QixFQUM1QyxXQUF1QjtRQUR2QixTQUFJLEdBQUosSUFBSSxDQUFLO1FBQVUsaUJBQVksR0FBWixZQUFZLENBQWE7UUFDNUMsZ0JBQVcsR0FBWCxXQUFXLENBQVk7SUFBRyxDQUFDO0lBRS9DLGdEQUFrQixHQUFsQixVQUFtQixTQUFtQztRQUNwRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQzNCLDREQUE0RDtZQUM1RCxNQUFNLENBQUMsc0JBQWMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFD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LElBQUksQ0FBQyxDQUFDLENBQUM7SUFFekUsb0RBQWtCLEdBQWxCLFVBQW1CLEdBQXlCLEVBQUUsT0FBWSxJQUFTLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ25GLDhCQUFDO0FBQUQsQ0FBQyxBQTlDRCxJQThDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBpbGVUeXBlTWV0YWRhdGEsXG4gIENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGEsXG4gIENvbXBpbGVQcm92aWRlck1ldGFkYXRhLFxuICBDb21waWxlVG9rZW5NZXRhZGF0YVxufSBmcm9tICcuL2NvbXBpbGVfbWV0YWRhdGEnO1xuaW1wb3J0IHtpc1ByZXNlbnQsIGlzQmxhbmssIGlzQXJyYXl9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge1Byb21pc2VXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jJztcblxuaW1wb3J0IHtYSFJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci94aHInO1xuaW1wb3J0IHtVcmxSZXNvbHZlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3VybF9yZXNvbHZlcic7XG5pbXBvcnQge2V4dHJhY3RTdHlsZVVybHMsIGlzU3R5bGVVcmxSZXNvbHZhYmxlfSBmcm9tICcuL3N0eWxlX3VybF9yZXNvbHZlcic7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7Vmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL21ldGFkYXRhL3ZpZXcnO1xuXG5cbmltcG9ydCB7XG4gIEh0bWxBc3RWaXNpdG9yLFxuICBIdG1sRWxlbWVudEFzdCxcbiAgSHRtbFRleHRBc3QsXG4gIEh0bWxBdHRyQXN0LFxuICBIdG1sQXN0LFxuICBIdG1sQ29tbWVudEFzdCxcbiAgSHRtbEV4cGFuc2lvbkFzdCxcbiAgSHRtbEV4cGFuc2lvbkNhc2VBc3QsXG4gIGh0bWxWaXNpdEFsbFxufSBmcm9tICcuL2h0bWxfYXN0JztcbmltcG9ydCB7SHRtbFBhcnNlcn0gZnJvbSAnLi9odG1sX3BhcnNlcic7XG5cbmltcG9ydCB7cHJlcGFyc2VFbGVtZW50LCBQcmVwYXJzZWRFbGVtZW50LCBQcmVwYXJzZWRFbGVtZW50VHlwZX0gZnJvbSAnLi90ZW1wbGF0ZV9wcmVwYXJzZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGlyZWN0aXZlTm9ybWFsaXplciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3hocjogWEhSLCBwcml2YXRlIF91cmxSZXNvbHZlcjogVXJsUmVzb2x2ZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2h0bWxQYXJzZXI6IEh0bWxQYXJzZXIpIHt9XG5cbiAgbm9ybWFsaXplRGlyZWN0aXZlKGRpcmVjdGl2ZTogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhKTogUHJvbWlzZTxDb21waWxlRGlyZWN0aXZlTWV0YWRhdGE+IHtcbiAgICBpZiAoIWRpcmVjdGl2ZS5pc0NvbXBvbmVudCkge1xuICAgICAgLy8gRm9yIG5vbiBjb21wb25lbnRzIHRoZXJlIGlzIG5vdGhpbmcgdG8gYmUgbm9ybWFsaXplZCB5ZXQuXG4gICAgICByZXR1cm4gUHJvbWlzZVdyYXBwZXIucmVzb2x2ZShkaXJlY3RpdmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5ub3JtYWxpemVUZW1wbGF0ZShkaXJlY3RpdmUudHlwZSwgZGlyZWN0aXZlLnRlbXBsYXRlKVxuICAgICAgICAudGhlbigobm9ybWFsaXplZFRlbXBsYXRlOiBDb21waWxlVGVtcGxhdGVNZXRhZGF0YSkgPT4gbmV3IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSh7XG4gICAgICAgICAgICAgICAgdHlwZTogZGlyZWN0aXZlLnR5cGUsXG4gICAgICAgICAgICAgICAgaXNDb21wb25lbnQ6IGRpcmVjdGl2ZS5pc0NvbXBvbmVudCxcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogZGlyZWN0aXZlLnNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIGV4cG9ydEFzOiBkaXJlY3RpdmUuZXhwb3J0QXMsXG4gICAgICAgICAgICAgICAgY2hhbmdlRGV0ZWN0aW9uOiBkaXJlY3RpdmUuY2hhbmdlRGV0ZWN0aW9uLFxuICAgICAgICAgICAgICAgIGlucHV0czogZGlyZWN0aXZlLmlucHV0cyxcbiAgICAgICAgICAgICAgICBvdXRwdXRzOiBkaXJlY3RpdmUub3V0cHV0cyxcbiAgICAgICAgICAgICAgICBob3N0TGlzdGVuZXJzOiBkaXJlY3RpdmUuaG9zdExpc3RlbmVycyxcbiAgICAgICAgICAgICAgICBob3N0UHJvcGVydGllczogZGlyZWN0aXZlLmhvc3RQcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgIGhvc3RBdHRyaWJ1dGVzOiBkaXJlY3RpdmUuaG9zdEF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgbGlmZWN5Y2xlSG9va3M6IGRpcmVjdGl2ZS5saWZlY3ljbGVIb29rcyxcbiAgICAgICAgICAgICAgICBwcm92aWRlcnM6IGRpcmVjdGl2ZS5wcm92aWRlcnMsXG4gICAgICAgICAgICAgICAgdmlld1Byb3ZpZGVyczogZGlyZWN0aXZlLnZpZXdQcm92aWRlcnMsXG4gICAgICAgICAgICAgICAgcXVlcmllczogZGlyZWN0aXZlLnF1ZXJpZXMsXG4gICAgICAgICAgICAgICAgdmlld1F1ZXJpZXM6IGRpcmVjdGl2ZS52aWV3UXVlcmllcyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogbm9ybWFsaXplZFRlbXBsYXRlXG4gICAgICAgICAgICAgIH0pKTtcbiAgfVxuXG4gIG5vcm1hbGl6ZVRlbXBsYXRlKGRpcmVjdGl2ZVR5cGU6IENvbXBpbGVUeXBlTWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBDb21waWxlVGVtcGxhdGVNZXRhZGF0YSk6IFByb21pc2U8Q29tcGlsZVRlbXBsYXRlTWV0YWRhdGE+IHtcbiAgICBpZiAoaXNQcmVzZW50KHRlbXBsYXRlLnRlbXBsYXRlKSkge1xuICAgICAgcmV0dXJuIFByb21pc2VXcmFwcGVyLnJlc29sdmUodGhpcy5ub3JtYWxpemVMb2FkZWRUZW1wbGF0ZShcbiAgICAgICAgICBkaXJlY3RpdmVUeXBlLCB0ZW1wbGF0ZSwgdGVtcGxhdGUudGVtcGxhdGUsIGRpcmVjdGl2ZVR5cGUubW9kdWxlVXJsKSk7XG4gICAgfSBlbHNlIGlmIChpc1ByZXNlbnQodGVtcGxhdGUudGVtcGxhdGVVcmwpKSB7XG4gICAgICB2YXIgc291cmNlQWJzVXJsID0gdGhpcy5fdXJsUmVzb2x2ZXIucmVzb2x2ZShkaXJlY3RpdmVUeXBlLm1vZHVsZVVybCwgdGVtcGxhdGUudGVtcGxhdGVVcmwpO1xuICAgICAgcmV0dXJuIHRoaXMuX3hoci5nZXQoc291cmNlQWJzVXJsKVxuICAgICAgICAgIC50aGVuKHRlbXBsYXRlQ29udGVudCA9PiB0aGlzLm5vcm1hbGl6ZUxvYWRlZFRlbXBsYXRlKGRpcmVjdGl2ZVR5cGUsIHRlbXBsYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlQ29udGVudCwgc291cmNlQWJzVXJsKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBObyB0ZW1wbGF0ZSBzcGVjaWZpZWQgZm9yIGNvbXBvbmVudCAke2RpcmVjdGl2ZVR5cGUubmFtZX1gKTtcbiAgICB9XG4gIH1cblxuICBub3JtYWxpemVMb2FkZWRUZW1wbGF0ZShkaXJlY3RpdmVUeXBlOiBDb21waWxlVHlwZU1ldGFkYXRhLCB0ZW1wbGF0ZU1ldGE6IENvbXBpbGVUZW1wbGF0ZU1ldGFkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogc3RyaW5nLCB0ZW1wbGF0ZUFic1VybDogc3RyaW5nKTogQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGEge1xuICAgIHZhciByb290Tm9kZXNBbmRFcnJvcnMgPSB0aGlzLl9odG1sUGFyc2VyLnBhcnNlKHRlbXBsYXRlLCBkaXJlY3RpdmVUeXBlLm5hbWUpO1xuICAgIGlmIChyb290Tm9kZXNBbmRFcnJvcnMuZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBlcnJvclN0cmluZyA9IHJvb3ROb2Rlc0FuZEVycm9ycy5lcnJvcnMuam9pbignXFxuJyk7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgVGVtcGxhdGUgcGFyc2UgZXJyb3JzOlxcbiR7ZXJyb3JTdHJpbmd9YCk7XG4gICAgfVxuXG4gICAgdmFyIHZpc2l0b3IgPSBuZXcgVGVtcGxhdGVQcmVwYXJzZVZpc2l0b3IoKTtcbiAgICBodG1sVmlzaXRBbGwodmlzaXRvciwgcm9vdE5vZGVzQW5kRXJyb3JzLnJvb3ROb2Rlcyk7XG4gICAgdmFyIGFsbFN0eWxlcyA9IHRlbXBsYXRlTWV0YS5zdHlsZXMuY29uY2F0KHZpc2l0b3Iuc3R5bGVzKTtcblxuICAgIHZhciBhbGxTdHlsZUFic1VybHMgPVxuICAgICAgICB2aXNpdG9yLnN0eWxlVXJscy5maWx0ZXIoaXNTdHlsZVVybFJlc29sdmFibGUpXG4gICAgICAgICAgICAubWFwKHVybCA9PiB0aGlzLl91cmxSZXNvbHZlci5yZXNvbHZlKHRlbXBsYXRlQWJzVXJsLCB1cmwpKVxuICAgICAgICAgICAgLmNvbmNhdCh0ZW1wbGF0ZU1ldGEuc3R5bGVVcmxzLmZpbHRlcihpc1N0eWxlVXJsUmVzb2x2YWJsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAodXJsID0+IHRoaXMuX3VybFJlc29sdmVyLnJlc29sdmUoZGlyZWN0aXZlVHlwZS5tb2R1bGVVcmwsIHVybCkpKTtcblxuICAgIHZhciBhbGxSZXNvbHZlZFN0eWxlcyA9IGFsbFN0eWxlcy5tYXAoc3R5bGUgPT4ge1xuICAgICAgdmFyIHN0eWxlV2l0aEltcG9ydHMgPSBleHRyYWN0U3R5bGVVcmxzKHRoaXMuX3VybFJlc29sdmVyLCB0ZW1wbGF0ZUFic1VybCwgc3R5bGUpO1xuICAgICAgc3R5bGVXaXRoSW1wb3J0cy5zdHlsZVVybHMuZm9yRWFjaChzdHlsZVVybCA9PiBhbGxTdHlsZUFic1VybHMucHVzaChzdHlsZVVybCkpO1xuICAgICAgcmV0dXJuIHN0eWxlV2l0aEltcG9ydHMuc3R5bGU7XG4gICAgfSk7XG5cbiAgICB2YXIgZW5jYXBzdWxhdGlvbiA9IHRlbXBsYXRlTWV0YS5lbmNhcHN1bGF0aW9uO1xuICAgIGlmIChlbmNhcHN1bGF0aW9uID09PSBWaWV3RW5jYXBzdWxhdGlvbi5FbXVsYXRlZCAmJiBhbGxSZXNvbHZlZFN0eWxlcy5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgYWxsU3R5bGVBYnNVcmxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZW5jYXBzdWxhdGlvbiA9IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmU7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGEoe1xuICAgICAgZW5jYXBzdWxhdGlvbjogZW5jYXBzdWxhdGlvbixcbiAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZUFic1VybCxcbiAgICAgIHN0eWxlczogYWxsUmVzb2x2ZWRTdHlsZXMsXG4gICAgICBzdHlsZVVybHM6IGFsbFN0eWxlQWJzVXJscyxcbiAgICAgIG5nQ29udGVudFNlbGVjdG9yczogdmlzaXRvci5uZ0NvbnRlbnRTZWxlY3RvcnNcbiAgICB9KTtcbiAgfVxufVxuXG5jbGFzcyBUZW1wbGF0ZVByZXBhcnNlVmlzaXRvciBpbXBsZW1lbnRzIEh0bWxBc3RWaXNpdG9yIHtcbiAgbmdDb250ZW50U2VsZWN0b3JzOiBzdHJpbmdbXSA9IFtdO1xuICBzdHlsZXM6IHN0cmluZ1tdID0gW107XG4gIHN0eWxlVXJsczogc3RyaW5nW10gPSBbXTtcbiAgbmdOb25CaW5kYWJsZVN0YWNrQ291bnQ6IG51bWJlciA9IDA7XG5cbiAgdmlzaXRFbGVtZW50KGFzdDogSHRtbEVsZW1lbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdmFyIHByZXBhcnNlZEVsZW1lbnQgPSBwcmVwYXJzZUVsZW1lbnQoYXN0KTtcbiAgICBzd2l0Y2ggKHByZXBhcnNlZEVsZW1lbnQudHlwZSkge1xuICAgICAgY2FzZSBQcmVwYXJzZWRFbGVtZW50VHlwZS5OR19DT05URU5UOlxuICAgICAgICBpZiAodGhpcy5uZ05vbkJpbmRhYmxlU3RhY2tDb3VudCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMubmdDb250ZW50U2VsZWN0b3JzLnB1c2gocHJlcGFyc2VkRWxlbWVudC5zZWxlY3RBdHRyKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUHJlcGFyc2VkRWxlbWVudFR5cGUuU1RZTEU6XG4gICAgICAgIHZhciB0ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBhc3QuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgSHRtbFRleHRBc3QpIHtcbiAgICAgICAgICAgIHRleHRDb250ZW50ICs9ICg8SHRtbFRleHRBc3Q+Y2hpbGQpLnZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3R5bGVzLnB1c2godGV4dENvbnRlbnQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUHJlcGFyc2VkRWxlbWVudFR5cGUuU1RZTEVTSEVFVDpcbiAgICAgICAgdGhpcy5zdHlsZVVybHMucHVzaChwcmVwYXJzZWRFbGVtZW50LmhyZWZBdHRyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBEREMgcmVwb3J0cyB0aGlzIGFzIGVycm9yLiBTZWU6XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXJ0LWxhbmcvZGV2X2NvbXBpbGVyL2lzc3Vlcy80MjhcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChwcmVwYXJzZWRFbGVtZW50Lm5vbkJpbmRhYmxlKSB7XG4gICAgICB0aGlzLm5nTm9uQmluZGFibGVTdGFja0NvdW50Kys7XG4gICAgfVxuICAgIGh0bWxWaXNpdEFsbCh0aGlzLCBhc3QuY2hpbGRyZW4pO1xuICAgIGlmIChwcmVwYXJzZWRFbGVtZW50Lm5vbkJpbmRhYmxlKSB7XG4gICAgICB0aGlzLm5nTm9uQmluZGFibGVTdGFja0NvdW50LS07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0Q29tbWVudChhc3Q6IEh0bWxDb21tZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuICB2aXNpdEF0dHIoYXN0OiBIdG1sQXR0ckFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbiAgdmlzaXRUZXh0KGFzdDogSHRtbFRleHRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBudWxsOyB9XG4gIHZpc2l0RXhwYW5zaW9uKGFzdDogSHRtbEV4cGFuc2lvbkFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cblxuICB2aXNpdEV4cGFuc2lvbkNhc2UoYXN0OiBIdG1sRXhwYW5zaW9uQ2FzZUFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbn1cbiJdfQ==