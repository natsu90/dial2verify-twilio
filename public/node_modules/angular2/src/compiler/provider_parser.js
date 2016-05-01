'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var template_ast_1 = require('./template_ast');
var compile_metadata_1 = require('./compile_metadata');
var identifiers_1 = require('./identifiers');
var parse_util_1 = require('./parse_util');
var ProviderError = (function (_super) {
    __extends(ProviderError, _super);
    function ProviderError(message, span) {
        _super.call(this, span, message);
    }
    return ProviderError;
}(parse_util_1.ParseError));
exports.ProviderError = ProviderError;
var ProviderViewContext = (function () {
    function ProviderViewContext(component, sourceSpan) {
        var _this = this;
        this.component = component;
        this.sourceSpan = sourceSpan;
        this.errors = [];
        this.viewQueries = _getViewQueries(component);
        this.viewProviders = new compile_metadata_1.CompileTokenMap();
        _normalizeProviders(component.viewProviders, sourceSpan, this.errors)
            .forEach(function (provider) {
            if (lang_1.isBlank(_this.viewProviders.get(provider.token))) {
                _this.viewProviders.add(provider.token, true);
            }
        });
    }
    return ProviderViewContext;
}());
exports.ProviderViewContext = ProviderViewContext;
var ProviderElementContext = (function () {
    function ProviderElementContext(_viewContext, _parent, _isViewRoot, _directiveAsts, attrs, vars, _sourceSpan) {
        var _this = this;
        this._viewContext = _viewContext;
        this._parent = _parent;
        this._isViewRoot = _isViewRoot;
        this._directiveAsts = _directiveAsts;
        this._sourceSpan = _sourceSpan;
        this._transformedProviders = new compile_metadata_1.CompileTokenMap();
        this._seenProviders = new compile_metadata_1.CompileTokenMap();
        this._hasViewContainer = false;
        this._attrs = {};
        attrs.forEach(function (attrAst) { return _this._attrs[attrAst.name] = attrAst.value; });
        var directivesMeta = _directiveAsts.map(function (directiveAst) { return directiveAst.directive; });
        this._allProviders =
            _resolveProvidersFromDirectives(directivesMeta, _sourceSpan, _viewContext.errors);
        this._contentQueries = _getContentQueries(directivesMeta);
        var queriedTokens = new compile_metadata_1.CompileTokenMap();
        this._allProviders.values().forEach(function (provider) { _this._addQueryReadsTo(provider.token, queriedTokens); });
        vars.forEach(function (varAst) {
            var varToken = new compile_metadata_1.CompileTokenMetadata({ value: varAst.name });
            _this._addQueryReadsTo(varToken, queriedTokens);
        });
        if (lang_1.isPresent(queriedTokens.get(identifiers_1.identifierToken(identifiers_1.Identifiers.ViewContainerRef)))) {
            this._hasViewContainer = true;
        }
        // create the providers that we know are eager first
        this._allProviders.values().forEach(function (provider) {
            var eager = provider.eager || lang_1.isPresent(queriedTokens.get(provider.token));
            if (eager) {
                _this._getOrCreateLocalProvider(provider.providerType, provider.token, true);
            }
        });
    }
    ProviderElementContext.prototype.afterElement = function () {
        var _this = this;
        // collect lazy providers
        this._allProviders.values().forEach(function (provider) {
            _this._getOrCreateLocalProvider(provider.providerType, provider.token, false);
        });
    };
    Object.defineProperty(ProviderElementContext.prototype, "transformProviders", {
        get: function () { return this._transformedProviders.values(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProviderElementContext.prototype, "transformedDirectiveAsts", {
        get: function () {
            var sortedProviderTypes = this._transformedProviders.values().map(function (provider) { return provider.token.identifier; });
            var sortedDirectives = collection_1.ListWrapper.clone(this._directiveAsts);
            collection_1.ListWrapper.sort(sortedDirectives, function (dir1, dir2) { return sortedProviderTypes.indexOf(dir1.directive.type) -
                sortedProviderTypes.indexOf(dir2.directive.type); });
            return sortedDirectives;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProviderElementContext.prototype, "transformedHasViewContainer", {
        get: function () { return this._hasViewContainer; },
        enumerable: true,
        configurable: true
    });
    ProviderElementContext.prototype._addQueryReadsTo = function (token, queryReadTokens) {
        this._getQueriesFor(token).forEach(function (query) {
            var queryReadToken = lang_1.isPresent(query.read) ? query.read : token;
            if (lang_1.isBlank(queryReadTokens.get(queryReadToken))) {
                queryReadTokens.add(queryReadToken, true);
            }
        });
    };
    ProviderElementContext.prototype._getQueriesFor = function (token) {
        var result = [];
        var currentEl = this;
        var distance = 0;
        var queries;
        while (currentEl !== null) {
            queries = currentEl._contentQueries.get(token);
            if (lang_1.isPresent(queries)) {
                collection_1.ListWrapper.addAll(result, queries.filter(function (query) { return query.descendants || distance <= 1; }));
            }
            if (currentEl._directiveAsts.length > 0) {
                distance++;
            }
            currentEl = currentEl._parent;
        }
        queries = this._viewContext.viewQueries.get(token);
        if (lang_1.isPresent(queries)) {
            collection_1.ListWrapper.addAll(result, queries);
        }
        return result;
    };
    ProviderElementContext.prototype._getOrCreateLocalProvider = function (requestingProviderType, token, eager) {
        var _this = this;
        var resolvedProvider = this._allProviders.get(token);
        if (lang_1.isBlank(resolvedProvider) ||
            ((requestingProviderType === template_ast_1.ProviderAstType.Directive ||
                requestingProviderType === template_ast_1.ProviderAstType.PublicService) &&
                resolvedProvider.providerType === template_ast_1.ProviderAstType.PrivateService) ||
            ((requestingProviderType === template_ast_1.ProviderAstType.PrivateService ||
                requestingProviderType === template_ast_1.ProviderAstType.PublicService) &&
                resolvedProvider.providerType === template_ast_1.ProviderAstType.Builtin)) {
            return null;
        }
        var transformedProviderAst = this._transformedProviders.get(token);
        if (lang_1.isPresent(transformedProviderAst)) {
            return transformedProviderAst;
        }
        if (lang_1.isPresent(this._seenProviders.get(token))) {
            this._viewContext.errors.push(new ProviderError("Cannot instantiate cyclic dependency! " + token.name, this._sourceSpan));
            return null;
        }
        this._seenProviders.add(token, true);
        var transformedProviders = resolvedProvider.providers.map(function (provider) {
            var transformedUseValue = provider.useValue;
            var transformedUseExisting = provider.useExisting;
            var transformedDeps;
            if (lang_1.isPresent(provider.useExisting)) {
                var existingDiDep = _this._getDependency(resolvedProvider.providerType, new compile_metadata_1.CompileDiDependencyMetadata({ token: provider.useExisting }), eager);
                if (lang_1.isPresent(existingDiDep.token)) {
                    transformedUseExisting = existingDiDep.token;
                }
                else {
                    transformedUseExisting = null;
                    transformedUseValue = existingDiDep.value;
                }
            }
            else if (lang_1.isPresent(provider.useFactory)) {
                var deps = lang_1.isPresent(provider.deps) ? provider.deps : provider.useFactory.diDeps;
                transformedDeps =
                    deps.map(function (dep) { return _this._getDependency(resolvedProvider.providerType, dep, eager); });
            }
            else if (lang_1.isPresent(provider.useClass)) {
                var deps = lang_1.isPresent(provider.deps) ? provider.deps : provider.useClass.diDeps;
                transformedDeps =
                    deps.map(function (dep) { return _this._getDependency(resolvedProvider.providerType, dep, eager); });
            }
            return _transformProvider(provider, {
                useExisting: transformedUseExisting,
                useValue: transformedUseValue,
                deps: transformedDeps
            });
        });
        transformedProviderAst =
            _transformProviderAst(resolvedProvider, { eager: eager, providers: transformedProviders });
        this._transformedProviders.add(token, transformedProviderAst);
        return transformedProviderAst;
    };
    ProviderElementContext.prototype._getLocalDependency = function (requestingProviderType, dep, eager) {
        if (eager === void 0) { eager = null; }
        if (dep.isAttribute) {
            var attrValue = this._attrs[dep.token.value];
            return new compile_metadata_1.CompileDiDependencyMetadata({ isValue: true, value: lang_1.normalizeBlank(attrValue) });
        }
        if (lang_1.isPresent(dep.query) || lang_1.isPresent(dep.viewQuery)) {
            return dep;
        }
        if (lang_1.isPresent(dep.token)) {
            // access builtints
            if ((requestingProviderType === template_ast_1.ProviderAstType.Directive ||
                requestingProviderType === template_ast_1.ProviderAstType.Component)) {
                if (dep.token.equalsTo(identifiers_1.identifierToken(identifiers_1.Identifiers.Renderer)) ||
                    dep.token.equalsTo(identifiers_1.identifierToken(identifiers_1.Identifiers.ElementRef)) ||
                    dep.token.equalsTo(identifiers_1.identifierToken(identifiers_1.Identifiers.ChangeDetectorRef)) ||
                    dep.token.equalsTo(identifiers_1.identifierToken(identifiers_1.Identifiers.TemplateRef))) {
                    return dep;
                }
                if (dep.token.equalsTo(identifiers_1.identifierToken(identifiers_1.Identifiers.ViewContainerRef))) {
                    this._hasViewContainer = true;
                }
            }
            // access the injector
            if (dep.token.equalsTo(identifiers_1.identifierToken(identifiers_1.Identifiers.Injector))) {
                return dep;
            }
            // access providers
            if (lang_1.isPresent(this._getOrCreateLocalProvider(requestingProviderType, dep.token, eager))) {
                return dep;
            }
        }
        return null;
    };
    ProviderElementContext.prototype._getDependency = function (requestingProviderType, dep, eager) {
        if (eager === void 0) { eager = null; }
        var currElement = this;
        var currEager = eager;
        var result = null;
        if (!dep.isSkipSelf) {
            result = this._getLocalDependency(requestingProviderType, dep, eager);
        }
        if (dep.isSelf) {
            if (lang_1.isBlank(result) && dep.isOptional) {
                result = new compile_metadata_1.CompileDiDependencyMetadata({ isValue: true, value: null });
            }
        }
        else {
            // check parent elements
            while (lang_1.isBlank(result) && lang_1.isPresent(currElement._parent)) {
                var prevElement = currElement;
                currElement = currElement._parent;
                if (prevElement._isViewRoot) {
                    currEager = false;
                }
                result = currElement._getLocalDependency(template_ast_1.ProviderAstType.PublicService, dep, currEager);
            }
            // check @Host restriction
            if (lang_1.isBlank(result)) {
                if (!dep.isHost || this._viewContext.component.type.isHost ||
                    identifiers_1.identifierToken(this._viewContext.component.type).equalsTo(dep.token) ||
                    lang_1.isPresent(this._viewContext.viewProviders.get(dep.token))) {
                    result = dep;
                }
                else {
                    result = dep.isOptional ?
                        result = new compile_metadata_1.CompileDiDependencyMetadata({ isValue: true, value: null }) :
                        null;
                }
            }
        }
        if (lang_1.isBlank(result)) {
            this._viewContext.errors.push(new ProviderError("No provider for " + dep.token.name, this._sourceSpan));
        }
        return result;
    };
    return ProviderElementContext;
}());
exports.ProviderElementContext = ProviderElementContext;
function _transformProvider(provider, _a) {
    var useExisting = _a.useExisting, useValue = _a.useValue, deps = _a.deps;
    return new compile_metadata_1.CompileProviderMetadata({
        token: provider.token,
        useClass: provider.useClass,
        useExisting: useExisting,
        useFactory: provider.useFactory,
        useValue: useValue,
        deps: deps,
        multi: provider.multi
    });
}
function _transformProviderAst(provider, _a) {
    var eager = _a.eager, providers = _a.providers;
    return new template_ast_1.ProviderAst(provider.token, provider.multiProvider, provider.eager || eager, providers, provider.providerType, provider.sourceSpan);
}
function _normalizeProviders(providers, sourceSpan, targetErrors, targetProviders) {
    if (targetProviders === void 0) { targetProviders = null; }
    if (lang_1.isBlank(targetProviders)) {
        targetProviders = [];
    }
    if (lang_1.isPresent(providers)) {
        providers.forEach(function (provider) {
            if (lang_1.isArray(provider)) {
                _normalizeProviders(provider, sourceSpan, targetErrors, targetProviders);
            }
            else {
                var normalizeProvider;
                if (provider instanceof compile_metadata_1.CompileProviderMetadata) {
                    normalizeProvider = provider;
                }
                else if (provider instanceof compile_metadata_1.CompileTypeMetadata) {
                    normalizeProvider = new compile_metadata_1.CompileProviderMetadata({ token: new compile_metadata_1.CompileTokenMetadata({ identifier: provider }), useClass: provider });
                }
                else {
                    targetErrors.push(new ProviderError("Unknown provider type " + provider, sourceSpan));
                }
                if (lang_1.isPresent(normalizeProvider)) {
                    targetProviders.push(normalizeProvider);
                }
            }
        });
    }
    return targetProviders;
}
function _resolveProvidersFromDirectives(directives, sourceSpan, targetErrors) {
    var providersByToken = new compile_metadata_1.CompileTokenMap();
    directives.forEach(function (directive) {
        var dirProvider = new compile_metadata_1.CompileProviderMetadata({ token: new compile_metadata_1.CompileTokenMetadata({ identifier: directive.type }), useClass: directive.type });
        _resolveProviders([dirProvider], directive.isComponent ? template_ast_1.ProviderAstType.Component : template_ast_1.ProviderAstType.Directive, true, sourceSpan, targetErrors, providersByToken);
    });
    // Note: directives need to be able to overwrite providers of a component!
    var directivesWithComponentFirst = directives.filter(function (dir) { return dir.isComponent; }).concat(directives.filter(function (dir) { return !dir.isComponent; }));
    directivesWithComponentFirst.forEach(function (directive) {
        _resolveProviders(_normalizeProviders(directive.providers, sourceSpan, targetErrors), template_ast_1.ProviderAstType.PublicService, false, sourceSpan, targetErrors, providersByToken);
        _resolveProviders(_normalizeProviders(directive.viewProviders, sourceSpan, targetErrors), template_ast_1.ProviderAstType.PrivateService, false, sourceSpan, targetErrors, providersByToken);
    });
    return providersByToken;
}
function _resolveProviders(providers, providerType, eager, sourceSpan, targetErrors, targetProvidersByToken) {
    providers.forEach(function (provider) {
        var resolvedProvider = targetProvidersByToken.get(provider.token);
        if (lang_1.isPresent(resolvedProvider) && resolvedProvider.multiProvider !== provider.multi) {
            targetErrors.push(new ProviderError("Mixing multi and non multi provider is not possible for token " + resolvedProvider.token.name, sourceSpan));
        }
        if (lang_1.isBlank(resolvedProvider)) {
            resolvedProvider = new template_ast_1.ProviderAst(provider.token, provider.multi, eager, [provider], providerType, sourceSpan);
            targetProvidersByToken.add(provider.token, resolvedProvider);
        }
        else {
            if (!provider.multi) {
                collection_1.ListWrapper.clear(resolvedProvider.providers);
            }
            resolvedProvider.providers.push(provider);
        }
    });
}
function _getViewQueries(component) {
    var viewQueries = new compile_metadata_1.CompileTokenMap();
    if (lang_1.isPresent(component.viewQueries)) {
        component.viewQueries.forEach(function (query) { return _addQueryToTokenMap(viewQueries, query); });
    }
    component.type.diDeps.forEach(function (dep) {
        if (lang_1.isPresent(dep.viewQuery)) {
            _addQueryToTokenMap(viewQueries, dep.viewQuery);
        }
    });
    return viewQueries;
}
function _getContentQueries(directives) {
    var contentQueries = new compile_metadata_1.CompileTokenMap();
    directives.forEach(function (directive) {
        if (lang_1.isPresent(directive.queries)) {
            directive.queries.forEach(function (query) { return _addQueryToTokenMap(contentQueries, query); });
        }
        directive.type.diDeps.forEach(function (dep) {
            if (lang_1.isPresent(dep.query)) {
                _addQueryToTokenMap(contentQueries, dep.query);
            }
        });
    });
    return contentQueries;
}
function _addQueryToTokenMap(map, query) {
    query.selectors.forEach(function (token) {
        var entry = map.get(token);
        if (lang_1.isBlank(entry)) {
            entry = [];
            map.add(token, entry);
        }
        entry.push(query);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXJfcGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC00bm8zWlF2Ty50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3Byb3ZpZGVyX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxQkFBMEQsMEJBQTBCLENBQUMsQ0FBQTtBQUNyRiwyQkFBMEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUMzRCw2QkFrQk8sZ0JBQWdCLENBQUMsQ0FBQTtBQUN4QixpQ0FRTyxvQkFBb0IsQ0FBQyxDQUFBO0FBQzVCLDRCQUEyQyxlQUFlLENBQUMsQ0FBQTtBQUMzRCwyQkFBeUQsY0FBYyxDQUFDLENBQUE7QUFFeEU7SUFBbUMsaUNBQVU7SUFDM0MsdUJBQVksT0FBZSxFQUFFLElBQXFCO1FBQUksa0JBQU0sSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQUMsQ0FBQztJQUMvRSxvQkFBQztBQUFELENBQUMsQUFGRCxDQUFtQyx1QkFBVSxHQUU1QztBQUZZLHFCQUFhLGdCQUV6QixDQUFBO0FBRUQ7SUFXRSw2QkFBbUIsU0FBbUMsRUFBUyxVQUEyQjtRQVg1RixpQkFxQkM7UUFWb0IsY0FBUyxHQUFULFNBQVMsQ0FBMEI7UUFBUyxlQUFVLEdBQVYsVUFBVSxDQUFpQjtRQUYxRixXQUFNLEdBQW9CLEVBQUUsQ0FBQztRQUczQixJQUFJLENBQUMsV0FBVyxHQUFHLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksa0NBQWUsRUFBVyxDQUFDO1FBQ3BELG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDaEUsT0FBTyxDQUFDLFVBQUMsUUFBUTtZQUNoQixFQUFFLENBQUMsQ0FBQyxjQUFPLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENB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U0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQTJCO1FBQ2xELElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsRUFBRSxDQUFDLENBQUMsY0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ1gsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1ByZXNlbnQsIGlzQmxhbmssIGlzQXJyYXksIG5vcm1hbGl6ZUJsYW5rfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7XG4gIFRlbXBsYXRlQXN0LFxuICBUZW1wbGF0ZUFzdFZpc2l0b3IsXG4gIE5nQ29udGVudEFzdCxcbiAgRW1iZWRkZWRUZW1wbGF0ZUFzdCxcbiAgRWxlbWVudEFzdCxcbiAgVmFyaWFibGVBc3QsXG4gIEJvdW5kRXZlbnRBc3QsXG4gIEJvdW5kRWxlbWVudFByb3BlcnR5QXN0LFxuICBBdHRyQXN0LFxuICBCb3VuZFRleHRBc3QsXG4gIFRleHRBc3QsXG4gIERpcmVjdGl2ZUFzdCxcbiAgQm91bmREaXJlY3RpdmVQcm9wZXJ0eUFzdCxcbiAgdGVtcGxhdGVWaXNpdEFsbCxcbiAgUHJvcGVydHlCaW5kaW5nVHlwZSxcbiAgUHJvdmlkZXJBc3QsXG4gIFByb3ZpZGVyQXN0VHlwZVxufSBmcm9tICcuL3RlbXBsYXRlX2FzdCc7XG5pbXBvcnQge1xuICBDb21waWxlVHlwZU1ldGFkYXRhLFxuICBDb21waWxlVG9rZW5NYXAsXG4gIENvbXBpbGVRdWVyeU1ldGFkYXRhLFxuICBDb21waWxlVG9rZW5NZXRhZGF0YSxcbiAgQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGEsXG4gIENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgQ29tcGlsZURpRGVwZW5kZW5jeU1ldGFkYXRhXG59IGZyb20gJy4vY29tcGlsZV9tZXRhZGF0YSc7XG5pbXBvcnQge0lkZW50aWZpZXJzLCBpZGVudGlmaWVyVG9rZW59IGZyb20gJy4vaWRlbnRpZmllcnMnO1xuaW1wb3J0IHtQYXJzZVNvdXJjZVNwYW4sIFBhcnNlRXJyb3IsIFBhcnNlTG9jYXRpb259IGZyb20gJy4vcGFyc2VfdXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBQcm92aWRlckVycm9yIGV4dGVuZHMgUGFyc2VFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZywgc3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7IHN1cGVyKHNwYW4sIG1lc3NhZ2UpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBQcm92aWRlclZpZXdDb250ZXh0IHtcbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgdmlld1F1ZXJpZXM6IENvbXBpbGVUb2tlbk1hcDxDb21waWxlUXVlcnlNZXRhZGF0YVtdPjtcbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgdmlld1Byb3ZpZGVyczogQ29tcGlsZVRva2VuTWFwPGJvb2xlYW4+O1xuICBlcnJvcnM6IFByb3ZpZGVyRXJyb3JbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb21wb25lbnQ6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSwgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge1xuICAgIHRoaXMudmlld1F1ZXJpZXMgPSBfZ2V0Vmlld1F1ZXJpZXMoY29tcG9uZW50KTtcbiAgICB0aGlzLnZpZXdQcm92aWRlcnMgPSBuZXcgQ29tcGlsZVRva2VuTWFwPGJvb2xlYW4+KCk7XG4gICAgX25vcm1hbGl6ZVByb3ZpZGVycyhjb21wb25lbnQudmlld1Byb3ZpZGVycywgc291cmNlU3BhbiwgdGhpcy5lcnJvcnMpXG4gICAgICAgIC5mb3JFYWNoKChwcm92aWRlcikgPT4ge1xuICAgICAgICAgIGlmIChpc0JsYW5rKHRoaXMudmlld1Byb3ZpZGVycy5nZXQocHJvdmlkZXIudG9rZW4pKSkge1xuICAgICAgICAgICAgdGhpcy52aWV3UHJvdmlkZXJzLmFkZChwcm92aWRlci50b2tlbiwgdHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUHJvdmlkZXJFbGVtZW50Q29udGV4dCB7XG4gIHByaXZhdGUgX2NvbnRlbnRRdWVyaWVzOiBDb21waWxlVG9rZW5NYXA8Q29tcGlsZVF1ZXJ5TWV0YWRhdGFbXT47XG5cbiAgcHJpdmF0ZSBfdHJhbnNmb3JtZWRQcm92aWRlcnMgPSBuZXcgQ29tcGlsZVRva2VuTWFwPFByb3ZpZGVyQXN0PigpO1xuICBwcml2YXRlIF9zZWVuUHJvdmlkZXJzID0gbmV3IENvbXBpbGVUb2tlbk1hcDxib29sZWFuPigpO1xuICBwcml2YXRlIF9hbGxQcm92aWRlcnM6IENvbXBpbGVUb2tlbk1hcDxQcm92aWRlckFzdD47XG4gIHByaXZhdGUgX2F0dHJzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfTtcbiAgcHJpdmF0ZSBfaGFzVmlld0NvbnRhaW5lcjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3ZpZXdDb250ZXh0OiBQcm92aWRlclZpZXdDb250ZXh0LCBwcml2YXRlIF9wYXJlbnQ6IFByb3ZpZGVyRWxlbWVudENvbnRleHQsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2lzVmlld1Jvb3Q6IGJvb2xlYW4sIHByaXZhdGUgX2RpcmVjdGl2ZUFzdHM6IERpcmVjdGl2ZUFzdFtdLFxuICAgICAgICAgICAgICBhdHRyczogQXR0ckFzdFtdLCB2YXJzOiBWYXJpYWJsZUFzdFtdLCBwcml2YXRlIF9zb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4pIHtcbiAgICB0aGlzLl9hdHRycyA9IHt9O1xuICAgIGF0dHJzLmZvckVhY2goKGF0dHJBc3QpID0+IHRoaXMuX2F0dHJzW2F0dHJBc3QubmFtZV0gPSBhdHRyQXN0LnZhbHVlKTtcbiAgICB2YXIgZGlyZWN0aXZlc01ldGEgPSBfZGlyZWN0aXZlQXN0cy5tYXAoZGlyZWN0aXZlQXN0ID0+IGRpcmVjdGl2ZUFzdC5kaXJlY3RpdmUpO1xuICAgIHRoaXMuX2FsbFByb3ZpZGVycyA9XG4gICAgICAgIF9yZXNvbHZlUHJvdmlkZXJzRnJvbURpcmVjdGl2ZXMoZGlyZWN0aXZlc01ldGEsIF9zb3VyY2VTcGFuLCBfdmlld0NvbnRleHQuZXJyb3JzKTtcbiAgICB0aGlzLl9jb250ZW50UXVlcmllcyA9IF9nZXRDb250ZW50UXVlcmllcyhkaXJlY3RpdmVzTWV0YSk7XG4gICAgdmFyIHF1ZXJpZWRUb2tlbnMgPSBuZXcgQ29tcGlsZVRva2VuTWFwPGJvb2xlYW4+KCk7XG4gICAgdGhpcy5fYWxsUHJvdmlkZXJzLnZhbHVlcygpLmZvckVhY2goXG4gICAgICAgIChwcm92aWRlcikgPT4geyB0aGlzLl9hZGRRdWVyeVJlYWRzVG8ocHJvdmlkZXIudG9rZW4sIHF1ZXJpZWRUb2tlbnMpOyB9KTtcbiAgICB2YXJzLmZvckVhY2goKHZhckFzdCkgPT4ge1xuICAgICAgdmFyIHZhclRva2VuID0gbmV3IENvbXBpbGVUb2tlbk1ldGFkYXRhKHt2YWx1ZTogdmFyQXN0Lm5hbWV9KTtcbiAgICAgIHRoaXMuX2FkZFF1ZXJ5UmVhZHNUbyh2YXJUb2tlbiwgcXVlcmllZFRva2Vucyk7XG4gICAgfSk7XG4gICAgaWYgKGlzUHJlc2VudChxdWVyaWVkVG9rZW5zLmdldChpZGVudGlmaWVyVG9rZW4oSWRlbnRpZmllcnMuVmlld0NvbnRhaW5lclJlZikpKSkge1xuICAgICAgdGhpcy5faGFzVmlld0NvbnRhaW5lciA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIHRoZSBwcm92aWRlcnMgdGhhdCB3ZSBrbm93IGFyZSBlYWdlciBmaXJzdFxuICAgIHRoaXMuX2FsbFByb3ZpZGVycy52YWx1ZXMoKS5mb3JFYWNoKChwcm92aWRlcikgPT4ge1xuICAgICAgdmFyIGVhZ2VyID0gcHJvdmlkZXIuZWFnZXIgfHwgaXNQcmVzZW50KHF1ZXJpZWRUb2tlbnMuZ2V0KHByb3ZpZGVyLnRva2VuKSk7XG4gICAgICBpZiAoZWFnZXIpIHtcbiAgICAgICAgdGhpcy5fZ2V0T3JDcmVhdGVMb2NhbFByb3ZpZGVyKHByb3ZpZGVyLnByb3ZpZGVyVHlwZSwgcHJvdmlkZXIudG9rZW4sIHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYWZ0ZXJFbGVtZW50KCkge1xuICAgIC8vIGNvbGxlY3QgbGF6eSBwcm92aWRlcnNcbiAgICB0aGlzLl9hbGxQcm92aWRlcnMudmFsdWVzKCkuZm9yRWFjaCgocHJvdmlkZXIpID0+IHtcbiAgICAgIHRoaXMuX2dldE9yQ3JlYXRlTG9jYWxQcm92aWRlcihwcm92aWRlci5wcm92aWRlclR5cGUsIHByb3ZpZGVyLnRva2VuLCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgdHJhbnNmb3JtUHJvdmlkZXJzKCk6IFByb3ZpZGVyQXN0W10geyByZXR1cm4gdGhpcy5fdHJhbnNmb3JtZWRQcm92aWRlcnMudmFsdWVzKCk7IH1cblxuICBnZXQgdHJhbnNmb3JtZWREaXJlY3RpdmVBc3RzKCk6IERpcmVjdGl2ZUFzdFtdIHtcbiAgICB2YXIgc29ydGVkUHJvdmlkZXJUeXBlcyA9XG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybWVkUHJvdmlkZXJzLnZhbHVlcygpLm1hcChwcm92aWRlciA9PiBwcm92aWRlci50b2tlbi5pZGVudGlmaWVyKTtcbiAgICB2YXIgc29ydGVkRGlyZWN0aXZlcyA9IExpc3RXcmFwcGVyLmNsb25lKHRoaXMuX2RpcmVjdGl2ZUFzdHMpO1xuICAgIExpc3RXcmFwcGVyLnNvcnQoc29ydGVkRGlyZWN0aXZlcyxcbiAgICAgICAgICAgICAgICAgICAgIChkaXIxLCBkaXIyKSA9PiBzb3J0ZWRQcm92aWRlclR5cGVzLmluZGV4T2YoZGlyMS5kaXJlY3RpdmUudHlwZSkgLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRlZFByb3ZpZGVyVHlwZXMuaW5kZXhPZihkaXIyLmRpcmVjdGl2ZS50eXBlKSk7XG4gICAgcmV0dXJuIHNvcnRlZERpcmVjdGl2ZXM7XG4gIH1cblxuICBnZXQgdHJhbnNmb3JtZWRIYXNWaWV3Q29udGFpbmVyKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faGFzVmlld0NvbnRhaW5lcjsgfVxuXG4gIHByaXZhdGUgX2FkZFF1ZXJ5UmVhZHNUbyh0b2tlbjogQ29tcGlsZVRva2VuTWV0YWRhdGEsIHF1ZXJ5UmVhZFRva2VuczogQ29tcGlsZVRva2VuTWFwPGJvb2xlYW4+KSB7XG4gICAgdGhpcy5fZ2V0UXVlcmllc0Zvcih0b2tlbikuZm9yRWFjaCgocXVlcnkpID0+IHtcbiAgICAgIHZhciBxdWVyeVJlYWRUb2tlbiA9IGlzUHJlc2VudChxdWVyeS5yZWFkKSA/IHF1ZXJ5LnJlYWQgOiB0b2tlbjtcbiAgICAgIGlmIChpc0JsYW5rKHF1ZXJ5UmVhZFRva2Vucy5nZXQocXVlcnlSZWFkVG9rZW4pKSkge1xuICAgICAgICBxdWVyeVJlYWRUb2tlbnMuYWRkKHF1ZXJ5UmVhZFRva2VuLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFF1ZXJpZXNGb3IodG9rZW46IENvbXBpbGVUb2tlbk1ldGFkYXRhKTogQ29tcGlsZVF1ZXJ5TWV0YWRhdGFbXSB7XG4gICAgdmFyIHJlc3VsdDogQ29tcGlsZVF1ZXJ5TWV0YWRhdGFbXSA9IFtdO1xuICAgIHZhciBjdXJyZW50RWw6IFByb3ZpZGVyRWxlbWVudENvbnRleHQgPSB0aGlzO1xuICAgIHZhciBkaXN0YW5jZSA9IDA7XG4gICAgdmFyIHF1ZXJpZXM6IENvbXBpbGVRdWVyeU1ldGFkYXRhW107XG4gICAgd2hpbGUgKGN1cnJlbnRFbCAhPT0gbnVsbCkge1xuICAgICAgcXVlcmllcyA9IGN1cnJlbnRFbC5fY29udGVudFF1ZXJpZXMuZ2V0KHRva2VuKTtcbiAgICAgIGlmIChpc1ByZXNlbnQocXVlcmllcykpIHtcbiAgICAgICAgTGlzdFdyYXBwZXIuYWRkQWxsKHJlc3VsdCwgcXVlcmllcy5maWx0ZXIoKHF1ZXJ5KSA9PiBxdWVyeS5kZXNjZW5kYW50cyB8fCBkaXN0YW5jZSA8PSAxKSk7XG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudEVsLl9kaXJlY3RpdmVBc3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGlzdGFuY2UrKztcbiAgICAgIH1cbiAgICAgIGN1cnJlbnRFbCA9IGN1cnJlbnRFbC5fcGFyZW50O1xuICAgIH1cbiAgICBxdWVyaWVzID0gdGhpcy5fdmlld0NvbnRleHQudmlld1F1ZXJpZXMuZ2V0KHRva2VuKTtcbiAgICBpZiAoaXNQcmVzZW50KHF1ZXJpZXMpKSB7XG4gICAgICBMaXN0V3JhcHBlci5hZGRBbGwocmVzdWx0LCBxdWVyaWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG5cbiAgcHJpdmF0ZSBfZ2V0T3JDcmVhdGVMb2NhbFByb3ZpZGVyKHJlcXVlc3RpbmdQcm92aWRlclR5cGU6IFByb3ZpZGVyQXN0VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuOiBDb21waWxlVG9rZW5NZXRhZGF0YSwgZWFnZXI6IGJvb2xlYW4pOiBQcm92aWRlckFzdCB7XG4gICAgdmFyIHJlc29sdmVkUHJvdmlkZXIgPSB0aGlzLl9hbGxQcm92aWRlcnMuZ2V0KHRva2VuKTtcbiAgICBpZiAoaXNCbGFuayhyZXNvbHZlZFByb3ZpZGVyKSB8fFxuICAgICAgICAoKHJlcXVlc3RpbmdQcm92aWRlclR5cGUgPT09IFByb3ZpZGVyQXN0VHlwZS5EaXJlY3RpdmUgfHxcbiAgICAgICAgICByZXF1ZXN0aW5nUHJvdmlkZXJUeXBlID09PSBQcm92aWRlckFzdFR5cGUuUHVibGljU2VydmljZSkgJiZcbiAgICAgICAgIHJlc29sdmVkUHJvdmlkZXIucHJvdmlkZXJUeXBlID09PSBQcm92aWRlckFzdFR5cGUuUHJpdmF0ZVNlcnZpY2UpIHx8XG4gICAgICAgICgocmVxdWVzdGluZ1Byb3ZpZGVyVHlwZSA9PT0gUHJvdmlkZXJBc3RUeXBlLlByaXZhdGVTZXJ2aWNlIHx8XG4gICAgICAgICAgcmVxdWVzdGluZ1Byb3ZpZGVyVHlwZSA9PT0gUHJvdmlkZXJBc3RUeXBlLlB1YmxpY1NlcnZpY2UpICYmXG4gICAgICAgICByZXNvbHZlZFByb3ZpZGVyLnByb3ZpZGVyVHlwZSA9PT0gUHJvdmlkZXJBc3RUeXBlLkJ1aWx0aW4pKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIHRyYW5zZm9ybWVkUHJvdmlkZXJBc3QgPSB0aGlzLl90cmFuc2Zvcm1lZFByb3ZpZGVycy5nZXQodG9rZW4pO1xuICAgIGlmIChpc1ByZXNlbnQodHJhbnNmb3JtZWRQcm92aWRlckFzdCkpIHtcbiAgICAgIHJldHVybiB0cmFuc2Zvcm1lZFByb3ZpZGVyQXN0O1xuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuX3NlZW5Qcm92aWRlcnMuZ2V0KHRva2VuKSkpIHtcbiAgICAgIHRoaXMuX3ZpZXdDb250ZXh0LmVycm9ycy5wdXNoKG5ldyBQcm92aWRlckVycm9yKFxuICAgICAgICAgIGBDYW5ub3QgaW5zdGFudGlhdGUgY3ljbGljIGRlcGVuZGVuY3khICR7dG9rZW4ubmFtZX1gLCB0aGlzLl9zb3VyY2VTcGFuKSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5fc2VlblByb3ZpZGVycy5hZGQodG9rZW4sIHRydWUpO1xuICAgIHZhciB0cmFuc2Zvcm1lZFByb3ZpZGVycyA9IHJlc29sdmVkUHJvdmlkZXIucHJvdmlkZXJzLm1hcCgocHJvdmlkZXIpID0+IHtcbiAgICAgIHZhciB0cmFuc2Zvcm1lZFVzZVZhbHVlID0gcHJvdmlkZXIudXNlVmFsdWU7XG4gICAgICB2YXIgdHJhbnNmb3JtZWRVc2VFeGlzdGluZyA9IHByb3ZpZGVyLnVzZUV4aXN0aW5nO1xuICAgICAgdmFyIHRyYW5zZm9ybWVkRGVwcztcbiAgICAgIGlmIChpc1ByZXNlbnQocHJvdmlkZXIudXNlRXhpc3RpbmcpKSB7XG4gICAgICAgIHZhciBleGlzdGluZ0RpRGVwID0gdGhpcy5fZ2V0RGVwZW5kZW5jeShcbiAgICAgICAgICAgIHJlc29sdmVkUHJvdmlkZXIucHJvdmlkZXJUeXBlLFxuICAgICAgICAgICAgbmV3IENvbXBpbGVEaURlcGVuZGVuY3lNZXRhZGF0YSh7dG9rZW46IHByb3ZpZGVyLnVzZUV4aXN0aW5nfSksIGVhZ2VyKTtcbiAgICAgICAgaWYgKGlzUHJlc2VudChleGlzdGluZ0RpRGVwLnRva2VuKSkge1xuICAgICAgICAgIHRyYW5zZm9ybWVkVXNlRXhpc3RpbmcgPSBleGlzdGluZ0RpRGVwLnRva2VuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyYW5zZm9ybWVkVXNlRXhpc3RpbmcgPSBudWxsO1xuICAgICAgICAgIHRyYW5zZm9ybWVkVXNlVmFsdWUgPSBleGlzdGluZ0RpRGVwLnZhbHVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGlzUHJlc2VudChwcm92aWRlci51c2VGYWN0b3J5KSkge1xuICAgICAgICB2YXIgZGVwcyA9IGlzUHJlc2VudChwcm92aWRlci5kZXBzKSA/IHByb3ZpZGVyLmRlcHMgOiBwcm92aWRlci51c2VGYWN0b3J5LmRpRGVwcztcbiAgICAgICAgdHJhbnNmb3JtZWREZXBzID1cbiAgICAgICAgICAgIGRlcHMubWFwKChkZXApID0+IHRoaXMuX2dldERlcGVuZGVuY3kocmVzb2x2ZWRQcm92aWRlci5wcm92aWRlclR5cGUsIGRlcCwgZWFnZXIpKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNQcmVzZW50KHByb3ZpZGVyLnVzZUNsYXNzKSkge1xuICAgICAgICB2YXIgZGVwcyA9IGlzUHJlc2VudChwcm92aWRlci5kZXBzKSA/IHByb3ZpZGVyLmRlcHMgOiBwcm92aWRlci51c2VDbGFzcy5kaURlcHM7XG4gICAgICAgIHRyYW5zZm9ybWVkRGVwcyA9XG4gICAgICAgICAgICBkZXBzLm1hcCgoZGVwKSA9PiB0aGlzLl9nZXREZXBlbmRlbmN5KHJlc29sdmVkUHJvdmlkZXIucHJvdmlkZXJUeXBlLCBkZXAsIGVhZ2VyKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX3RyYW5zZm9ybVByb3ZpZGVyKHByb3ZpZGVyLCB7XG4gICAgICAgIHVzZUV4aXN0aW5nOiB0cmFuc2Zvcm1lZFVzZUV4aXN0aW5nLFxuICAgICAgICB1c2VWYWx1ZTogdHJhbnNmb3JtZWRVc2VWYWx1ZSxcbiAgICAgICAgZGVwczogdHJhbnNmb3JtZWREZXBzXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB0cmFuc2Zvcm1lZFByb3ZpZGVyQXN0ID1cbiAgICAgICAgX3RyYW5zZm9ybVByb3ZpZGVyQXN0KHJlc29sdmVkUHJvdmlkZXIsIHtlYWdlcjogZWFnZXIsIHByb3ZpZGVyczogdHJhbnNmb3JtZWRQcm92aWRlcnN9KTtcbiAgICB0aGlzLl90cmFuc2Zvcm1lZFByb3ZpZGVycy5hZGQodG9rZW4sIHRyYW5zZm9ybWVkUHJvdmlkZXJBc3QpO1xuICAgIHJldHVybiB0cmFuc2Zvcm1lZFByb3ZpZGVyQXN0O1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0TG9jYWxEZXBlbmRlbmN5KHJlcXVlc3RpbmdQcm92aWRlclR5cGU6IFByb3ZpZGVyQXN0VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcDogQ29tcGlsZURpRGVwZW5kZW5jeU1ldGFkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFnZXI6IGJvb2xlYW4gPSBudWxsKTogQ29tcGlsZURpRGVwZW5kZW5jeU1ldGFkYXRhIHtcbiAgICBpZiAoZGVwLmlzQXR0cmlidXRlKSB7XG4gICAgICB2YXIgYXR0clZhbHVlID0gdGhpcy5fYXR0cnNbZGVwLnRva2VuLnZhbHVlXTtcbiAgICAgIHJldHVybiBuZXcgQ29tcGlsZURpRGVwZW5kZW5jeU1ldGFkYXRhKHtpc1ZhbHVlOiB0cnVlLCB2YWx1ZTogbm9ybWFsaXplQmxhbmsoYXR0clZhbHVlKX0pO1xuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KGRlcC5xdWVyeSkgfHwgaXNQcmVzZW50KGRlcC52aWV3UXVlcnkpKSB7XG4gICAgICByZXR1cm4gZGVwO1xuICAgIH1cblxuICAgIGlmIChpc1ByZXNlbnQoZGVwLnRva2VuKSkge1xuICAgICAgLy8gYWNjZXNzIGJ1aWx0aW50c1xuICAgICAgaWYgKChyZXF1ZXN0aW5nUHJvdmlkZXJUeXBlID09PSBQcm92aWRlckFzdFR5cGUuRGlyZWN0aXZlIHx8XG4gICAgICAgICAgIHJlcXVlc3RpbmdQcm92aWRlclR5cGUgPT09IFByb3ZpZGVyQXN0VHlwZS5Db21wb25lbnQpKSB7XG4gICAgICAgIGlmIChkZXAudG9rZW4uZXF1YWxzVG8oaWRlbnRpZmllclRva2VuKElkZW50aWZpZXJzLlJlbmRlcmVyKSkgfHxcbiAgICAgICAgICAgIGRlcC50b2tlbi5lcXVhbHNUbyhpZGVudGlmaWVyVG9rZW4oSWRlbnRpZmllcnMuRWxlbWVudFJlZikpIHx8XG4gICAgICAgICAgICBkZXAudG9rZW4uZXF1YWxzVG8oaWRlbnRpZmllclRva2VuKElkZW50aWZpZXJzLkNoYW5nZURldGVjdG9yUmVmKSkgfHxcbiAgICAgICAgICAgIGRlcC50b2tlbi5lcXVhbHNUbyhpZGVudGlmaWVyVG9rZW4oSWRlbnRpZmllcnMuVGVtcGxhdGVSZWYpKSkge1xuICAgICAgICAgIHJldHVybiBkZXA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlcC50b2tlbi5lcXVhbHNUbyhpZGVudGlmaWVyVG9rZW4oSWRlbnRpZmllcnMuVmlld0NvbnRhaW5lclJlZikpKSB7XG4gICAgICAgICAgdGhpcy5faGFzVmlld0NvbnRhaW5lciA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGFjY2VzcyB0aGUgaW5qZWN0b3JcbiAgICAgIGlmIChkZXAudG9rZW4uZXF1YWxzVG8oaWRlbnRpZmllclRva2VuKElkZW50aWZpZXJzLkluamVjdG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIGRlcDtcbiAgICAgIH1cbiAgICAgIC8vIGFjY2VzcyBwcm92aWRlcnNcbiAgICAgIGlmIChpc1ByZXNlbnQodGhpcy5fZ2V0T3JDcmVhdGVMb2NhbFByb3ZpZGVyKHJlcXVlc3RpbmdQcm92aWRlclR5cGUsIGRlcC50b2tlbiwgZWFnZXIpKSkge1xuICAgICAgICByZXR1cm4gZGVwO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX2dldERlcGVuZGVuY3kocmVxdWVzdGluZ1Byb3ZpZGVyVHlwZTogUHJvdmlkZXJBc3RUeXBlLCBkZXA6IENvbXBpbGVEaURlcGVuZGVuY3lNZXRhZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBlYWdlcjogYm9vbGVhbiA9IG51bGwpOiBDb21waWxlRGlEZXBlbmRlbmN5TWV0YWRhdGEge1xuICAgIHZhciBjdXJyRWxlbWVudDogUHJvdmlkZXJFbGVtZW50Q29udGV4dCA9IHRoaXM7XG4gICAgdmFyIGN1cnJFYWdlcjogYm9vbGVhbiA9IGVhZ2VyO1xuICAgIHZhciByZXN1bHQ6IENvbXBpbGVEaURlcGVuZGVuY3lNZXRhZGF0YSA9IG51bGw7XG4gICAgaWYgKCFkZXAuaXNTa2lwU2VsZikge1xuICAgICAgcmVzdWx0ID0gdGhpcy5fZ2V0TG9jYWxEZXBlbmRlbmN5KHJlcXVlc3RpbmdQcm92aWRlclR5cGUsIGRlcCwgZWFnZXIpO1xuICAgIH1cbiAgICBpZiAoZGVwLmlzU2VsZikge1xuICAgICAgaWYgKGlzQmxhbmsocmVzdWx0KSAmJiBkZXAuaXNPcHRpb25hbCkge1xuICAgICAgICByZXN1bHQgPSBuZXcgQ29tcGlsZURpRGVwZW5kZW5jeU1ldGFkYXRhKHtpc1ZhbHVlOiB0cnVlLCB2YWx1ZTogbnVsbH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjaGVjayBwYXJlbnQgZWxlbWVudHNcbiAgICAgIHdoaWxlIChpc0JsYW5rKHJlc3VsdCkgJiYgaXNQcmVzZW50KGN1cnJFbGVtZW50Ll9wYXJlbnQpKSB7XG4gICAgICAgIHZhciBwcmV2RWxlbWVudCA9IGN1cnJFbGVtZW50O1xuICAgICAgICBjdXJyRWxlbWVudCA9IGN1cnJFbGVtZW50Ll9wYXJlbnQ7XG4gICAgICAgIGlmIChwcmV2RWxlbWVudC5faXNWaWV3Um9vdCkge1xuICAgICAgICAgIGN1cnJFYWdlciA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IGN1cnJFbGVtZW50Ll9nZXRMb2NhbERlcGVuZGVuY3koUHJvdmlkZXJBc3RUeXBlLlB1YmxpY1NlcnZpY2UsIGRlcCwgY3VyckVhZ2VyKTtcbiAgICAgIH1cbiAgICAgIC8vIGNoZWNrIEBIb3N0IHJlc3RyaWN0aW9uXG4gICAgICBpZiAoaXNCbGFuayhyZXN1bHQpKSB7XG4gICAgICAgIGlmICghZGVwLmlzSG9zdCB8fCB0aGlzLl92aWV3Q29udGV4dC5jb21wb25lbnQudHlwZS5pc0hvc3QgfHxcbiAgICAgICAgICAgIGlkZW50aWZpZXJUb2tlbih0aGlzLl92aWV3Q29udGV4dC5jb21wb25lbnQudHlwZSkuZXF1YWxzVG8oZGVwLnRva2VuKSB8fFxuICAgICAgICAgICAgaXNQcmVzZW50KHRoaXMuX3ZpZXdDb250ZXh0LnZpZXdQcm92aWRlcnMuZ2V0KGRlcC50b2tlbikpKSB7XG4gICAgICAgICAgcmVzdWx0ID0gZGVwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCA9IGRlcC5pc09wdGlvbmFsID9cbiAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gbmV3IENvbXBpbGVEaURlcGVuZGVuY3lNZXRhZGF0YSh7aXNWYWx1ZTogdHJ1ZSwgdmFsdWU6IG51bGx9KSA6XG4gICAgICAgICAgICAgICAgICAgICAgIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzQmxhbmsocmVzdWx0KSkge1xuICAgICAgdGhpcy5fdmlld0NvbnRleHQuZXJyb3JzLnB1c2goXG4gICAgICAgICAgbmV3IFByb3ZpZGVyRXJyb3IoYE5vIHByb3ZpZGVyIGZvciAke2RlcC50b2tlbi5uYW1lfWAsIHRoaXMuX3NvdXJjZVNwYW4pKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5mdW5jdGlvbiBfdHJhbnNmb3JtUHJvdmlkZXIoXG4gICAgcHJvdmlkZXI6IENvbXBpbGVQcm92aWRlck1ldGFkYXRhLFxuICAgIHt1c2VFeGlzdGluZywgdXNlVmFsdWUsIGRlcHN9OlxuICAgICAgICB7dXNlRXhpc3Rpbmc6IENvbXBpbGVUb2tlbk1ldGFkYXRhLCB1c2VWYWx1ZTogYW55LCBkZXBzOiBDb21waWxlRGlEZXBlbmRlbmN5TWV0YWRhdGFbXX0pIHtcbiAgcmV0dXJuIG5ldyBDb21waWxlUHJvdmlkZXJNZXRhZGF0YSh7XG4gICAgdG9rZW46IHByb3ZpZGVyLnRva2VuLFxuICAgIHVzZUNsYXNzOiBwcm92aWRlci51c2VDbGFzcyxcbiAgICB1c2VFeGlzdGluZzogdXNlRXhpc3RpbmcsXG4gICAgdXNlRmFjdG9yeTogcHJvdmlkZXIudXNlRmFjdG9yeSxcbiAgICB1c2VWYWx1ZTogdXNlVmFsdWUsXG4gICAgZGVwczogZGVwcyxcbiAgICBtdWx0aTogcHJvdmlkZXIubXVsdGlcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIF90cmFuc2Zvcm1Qcm92aWRlckFzdChcbiAgICBwcm92aWRlcjogUHJvdmlkZXJBc3QsXG4gICAge2VhZ2VyLCBwcm92aWRlcnN9OiB7ZWFnZXI6IGJvb2xlYW4sIHByb3ZpZGVyczogQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGFbXX0pOiBQcm92aWRlckFzdCB7XG4gIHJldHVybiBuZXcgUHJvdmlkZXJBc3QocHJvdmlkZXIudG9rZW4sIHByb3ZpZGVyLm11bHRpUHJvdmlkZXIsIHByb3ZpZGVyLmVhZ2VyIHx8IGVhZ2VyLCBwcm92aWRlcnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXIucHJvdmlkZXJUeXBlLCBwcm92aWRlci5zb3VyY2VTcGFuKTtcbn1cblxuZnVuY3Rpb24gX25vcm1hbGl6ZVByb3ZpZGVycyhcbiAgICBwcm92aWRlcnM6IEFycmF5PENvbXBpbGVQcm92aWRlck1ldGFkYXRhIHwgQ29tcGlsZVR5cGVNZXRhZGF0YSB8IGFueVtdPixcbiAgICBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sIHRhcmdldEVycm9yczogUGFyc2VFcnJvcltdLFxuICAgIHRhcmdldFByb3ZpZGVyczogQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGFbXSA9IG51bGwpOiBDb21waWxlUHJvdmlkZXJNZXRhZGF0YVtdIHtcbiAgaWYgKGlzQmxhbmsodGFyZ2V0UHJvdmlkZXJzKSkge1xuICAgIHRhcmdldFByb3ZpZGVycyA9IFtdO1xuICB9XG4gIGlmIChpc1ByZXNlbnQocHJvdmlkZXJzKSkge1xuICAgIHByb3ZpZGVycy5mb3JFYWNoKChwcm92aWRlcikgPT4ge1xuICAgICAgaWYgKGlzQXJyYXkocHJvdmlkZXIpKSB7XG4gICAgICAgIF9ub3JtYWxpemVQcm92aWRlcnMoPGFueVtdPnByb3ZpZGVyLCBzb3VyY2VTcGFuLCB0YXJnZXRFcnJvcnMsIHRhcmdldFByb3ZpZGVycyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbm9ybWFsaXplUHJvdmlkZXI6IENvbXBpbGVQcm92aWRlck1ldGFkYXRhO1xuICAgICAgICBpZiAocHJvdmlkZXIgaW5zdGFuY2VvZiBDb21waWxlUHJvdmlkZXJNZXRhZGF0YSkge1xuICAgICAgICAgIG5vcm1hbGl6ZVByb3ZpZGVyID0gcHJvdmlkZXI7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvdmlkZXIgaW5zdGFuY2VvZiBDb21waWxlVHlwZU1ldGFkYXRhKSB7XG4gICAgICAgICAgbm9ybWFsaXplUHJvdmlkZXIgPSBuZXcgQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGEoXG4gICAgICAgICAgICAgIHt0b2tlbjogbmV3IENvbXBpbGVUb2tlbk1ldGFkYXRhKHtpZGVudGlmaWVyOiBwcm92aWRlcn0pLCB1c2VDbGFzczogcHJvdmlkZXJ9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXRFcnJvcnMucHVzaChuZXcgUHJvdmlkZXJFcnJvcihgVW5rbm93biBwcm92aWRlciB0eXBlICR7cHJvdmlkZXJ9YCwgc291cmNlU3BhbikpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1ByZXNlbnQobm9ybWFsaXplUHJvdmlkZXIpKSB7XG4gICAgICAgICAgdGFyZ2V0UHJvdmlkZXJzLnB1c2gobm9ybWFsaXplUHJvdmlkZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHRhcmdldFByb3ZpZGVycztcbn1cblxuXG5mdW5jdGlvbiBfcmVzb2x2ZVByb3ZpZGVyc0Zyb21EaXJlY3RpdmVzKGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEVycm9yczogUGFyc2VFcnJvcltdKTogQ29tcGlsZVRva2VuTWFwPFByb3ZpZGVyQXN0PiB7XG4gIHZhciBwcm92aWRlcnNCeVRva2VuID0gbmV3IENvbXBpbGVUb2tlbk1hcDxQcm92aWRlckFzdD4oKTtcbiAgZGlyZWN0aXZlcy5mb3JFYWNoKChkaXJlY3RpdmUpID0+IHtcbiAgICB2YXIgZGlyUHJvdmlkZXIgPSBuZXcgQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGEoXG4gICAgICAgIHt0b2tlbjogbmV3IENvbXBpbGVUb2tlbk1ldGFkYXRhKHtpZGVudGlmaWVyOiBkaXJlY3RpdmUudHlwZX0pLCB1c2VDbGFzczogZGlyZWN0aXZlLnR5cGV9KTtcbiAgICBfcmVzb2x2ZVByb3ZpZGVycyhbZGlyUHJvdmlkZXJdLFxuICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZS5pc0NvbXBvbmVudCA/IFByb3ZpZGVyQXN0VHlwZS5Db21wb25lbnQgOiBQcm92aWRlckFzdFR5cGUuRGlyZWN0aXZlLFxuICAgICAgICAgICAgICAgICAgICAgIHRydWUsIHNvdXJjZVNwYW4sIHRhcmdldEVycm9ycywgcHJvdmlkZXJzQnlUb2tlbik7XG4gIH0pO1xuXG4gIC8vIE5vdGU6IGRpcmVjdGl2ZXMgbmVlZCB0byBiZSBhYmxlIHRvIG92ZXJ3cml0ZSBwcm92aWRlcnMgb2YgYSBjb21wb25lbnQhXG4gIHZhciBkaXJlY3RpdmVzV2l0aENvbXBvbmVudEZpcnN0ID1cbiAgICAgIGRpcmVjdGl2ZXMuZmlsdGVyKGRpciA9PiBkaXIuaXNDb21wb25lbnQpLmNvbmNhdChkaXJlY3RpdmVzLmZpbHRlcihkaXIgPT4gIWRpci5pc0NvbXBvbmVudCkpO1xuICBkaXJlY3RpdmVzV2l0aENvbXBvbmVudEZpcnN0LmZvckVhY2goKGRpcmVjdGl2ZSkgPT4ge1xuICAgIF9yZXNvbHZlUHJvdmlkZXJzKF9ub3JtYWxpemVQcm92aWRlcnMoZGlyZWN0aXZlLnByb3ZpZGVycywgc291cmNlU3BhbiwgdGFyZ2V0RXJyb3JzKSxcbiAgICAgICAgICAgICAgICAgICAgICBQcm92aWRlckFzdFR5cGUuUHVibGljU2VydmljZSwgZmFsc2UsIHNvdXJjZVNwYW4sIHRhcmdldEVycm9ycyxcbiAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnNCeVRva2VuKTtcbiAgICBfcmVzb2x2ZVByb3ZpZGVycyhfbm9ybWFsaXplUHJvdmlkZXJzKGRpcmVjdGl2ZS52aWV3UHJvdmlkZXJzLCBzb3VyY2VTcGFuLCB0YXJnZXRFcnJvcnMpLFxuICAgICAgICAgICAgICAgICAgICAgIFByb3ZpZGVyQXN0VHlwZS5Qcml2YXRlU2VydmljZSwgZmFsc2UsIHNvdXJjZVNwYW4sIHRhcmdldEVycm9ycyxcbiAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnNCeVRva2VuKTtcbiAgfSk7XG4gIHJldHVybiBwcm92aWRlcnNCeVRva2VuO1xufVxuXG5mdW5jdGlvbiBfcmVzb2x2ZVByb3ZpZGVycyhwcm92aWRlcnM6IENvbXBpbGVQcm92aWRlck1ldGFkYXRhW10sIHByb3ZpZGVyVHlwZTogUHJvdmlkZXJBc3RUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFnZXI6IGJvb2xlYW4sIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbiwgdGFyZ2V0RXJyb3JzOiBQYXJzZUVycm9yW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRQcm92aWRlcnNCeVRva2VuOiBDb21waWxlVG9rZW5NYXA8UHJvdmlkZXJBc3Q+KSB7XG4gIHByb3ZpZGVycy5mb3JFYWNoKChwcm92aWRlcikgPT4ge1xuICAgIHZhciByZXNvbHZlZFByb3ZpZGVyID0gdGFyZ2V0UHJvdmlkZXJzQnlUb2tlbi5nZXQocHJvdmlkZXIudG9rZW4pO1xuICAgIGlmIChpc1ByZXNlbnQocmVzb2x2ZWRQcm92aWRlcikgJiYgcmVzb2x2ZWRQcm92aWRlci5tdWx0aVByb3ZpZGVyICE9PSBwcm92aWRlci5tdWx0aSkge1xuICAgICAgdGFyZ2V0RXJyb3JzLnB1c2gobmV3IFByb3ZpZGVyRXJyb3IoXG4gICAgICAgICAgYE1peGluZyBtdWx0aSBhbmQgbm9uIG11bHRpIHByb3ZpZGVyIGlzIG5vdCBwb3NzaWJsZSBmb3IgdG9rZW4gJHtyZXNvbHZlZFByb3ZpZGVyLnRva2VuLm5hbWV9YCxcbiAgICAgICAgICBzb3VyY2VTcGFuKSk7XG4gICAgfVxuICAgIGlmIChpc0JsYW5rKHJlc29sdmVkUHJvdmlkZXIpKSB7XG4gICAgICByZXNvbHZlZFByb3ZpZGVyID0gbmV3IFByb3ZpZGVyQXN0KHByb3ZpZGVyLnRva2VuLCBwcm92aWRlci5tdWx0aSwgZWFnZXIsIFtwcm92aWRlcl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyVHlwZSwgc291cmNlU3Bhbik7XG4gICAgICB0YXJnZXRQcm92aWRlcnNCeVRva2VuLmFkZChwcm92aWRlci50b2tlbiwgcmVzb2x2ZWRQcm92aWRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghcHJvdmlkZXIubXVsdGkpIHtcbiAgICAgICAgTGlzdFdyYXBwZXIuY2xlYXIocmVzb2x2ZWRQcm92aWRlci5wcm92aWRlcnMpO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZWRQcm92aWRlci5wcm92aWRlcnMucHVzaChwcm92aWRlcik7XG4gICAgfVxuICB9KTtcbn1cblxuXG5mdW5jdGlvbiBfZ2V0Vmlld1F1ZXJpZXMoXG4gICAgY29tcG9uZW50OiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEpOiBDb21waWxlVG9rZW5NYXA8Q29tcGlsZVF1ZXJ5TWV0YWRhdGFbXT4ge1xuICB2YXIgdmlld1F1ZXJpZXMgPSBuZXcgQ29tcGlsZVRva2VuTWFwPENvbXBpbGVRdWVyeU1ldGFkYXRhW10+KCk7XG4gIGlmIChpc1ByZXNlbnQoY29tcG9uZW50LnZpZXdRdWVyaWVzKSkge1xuICAgIGNvbXBvbmVudC52aWV3UXVlcmllcy5mb3JFYWNoKChxdWVyeSkgPT4gX2FkZFF1ZXJ5VG9Ub2tlbk1hcCh2aWV3UXVlcmllcywgcXVlcnkpKTtcbiAgfVxuICBjb21wb25lbnQudHlwZS5kaURlcHMuZm9yRWFjaCgoZGVwKSA9PiB7XG4gICAgaWYgKGlzUHJlc2VudChkZXAudmlld1F1ZXJ5KSkge1xuICAgICAgX2FkZFF1ZXJ5VG9Ub2tlbk1hcCh2aWV3UXVlcmllcywgZGVwLnZpZXdRdWVyeSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHZpZXdRdWVyaWVzO1xufVxuXG5mdW5jdGlvbiBfZ2V0Q29udGVudFF1ZXJpZXMoXG4gICAgZGlyZWN0aXZlczogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhW10pOiBDb21waWxlVG9rZW5NYXA8Q29tcGlsZVF1ZXJ5TWV0YWRhdGFbXT4ge1xuICB2YXIgY29udGVudFF1ZXJpZXMgPSBuZXcgQ29tcGlsZVRva2VuTWFwPENvbXBpbGVRdWVyeU1ldGFkYXRhW10+KCk7XG4gIGRpcmVjdGl2ZXMuZm9yRWFjaChkaXJlY3RpdmUgPT4ge1xuICAgIGlmIChpc1ByZXNlbnQoZGlyZWN0aXZlLnF1ZXJpZXMpKSB7XG4gICAgICBkaXJlY3RpdmUucXVlcmllcy5mb3JFYWNoKChxdWVyeSkgPT4gX2FkZFF1ZXJ5VG9Ub2tlbk1hcChjb250ZW50UXVlcmllcywgcXVlcnkpKTtcbiAgICB9XG4gICAgZGlyZWN0aXZlLnR5cGUuZGlEZXBzLmZvckVhY2goKGRlcCkgPT4ge1xuICAgICAgaWYgKGlzUHJlc2VudChkZXAucXVlcnkpKSB7XG4gICAgICAgIF9hZGRRdWVyeVRvVG9rZW5NYXAoY29udGVudFF1ZXJpZXMsIGRlcC5xdWVyeSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gY29udGVudFF1ZXJpZXM7XG59XG5cbmZ1bmN0aW9uIF9hZGRRdWVyeVRvVG9rZW5NYXAobWFwOiBDb21waWxlVG9rZW5NYXA8Q29tcGlsZVF1ZXJ5TWV0YWRhdGFbXT4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBDb21waWxlUXVlcnlNZXRhZGF0YSkge1xuICBxdWVyeS5zZWxlY3RvcnMuZm9yRWFjaCgodG9rZW46IENvbXBpbGVUb2tlbk1ldGFkYXRhKSA9PiB7XG4gICAgdmFyIGVudHJ5ID0gbWFwLmdldCh0b2tlbik7XG4gICAgaWYgKGlzQmxhbmsoZW50cnkpKSB7XG4gICAgICBlbnRyeSA9IFtdO1xuICAgICAgbWFwLmFkZCh0b2tlbiwgZW50cnkpO1xuICAgIH1cbiAgICBlbnRyeS5wdXNoKHF1ZXJ5KTtcbiAgfSk7XG59XG4iXX0=