import { isPresent, isBlank, isArray, normalizeBlank } from 'angular2/src/facade/lang';
import { ListWrapper } from 'angular2/src/facade/collection';
import { ProviderAst, ProviderAstType } from './template_ast';
import { CompileTypeMetadata, CompileTokenMap, CompileTokenMetadata, CompileProviderMetadata, CompileDiDependencyMetadata } from './compile_metadata';
import { Identifiers, identifierToken } from './identifiers';
import { ParseError } from './parse_util';
export class ProviderError extends ParseError {
    constructor(message, span) {
        super(span, message);
    }
}
export class ProviderViewContext {
    constructor(component, sourceSpan) {
        this.component = component;
        this.sourceSpan = sourceSpan;
        this.errors = [];
        this.viewQueries = _getViewQueries(component);
        this.viewProviders = new CompileTokenMap();
        _normalizeProviders(component.viewProviders, sourceSpan, this.errors)
            .forEach((provider) => {
            if (isBlank(this.viewProviders.get(provider.token))) {
                this.viewProviders.add(provider.token, true);
            }
        });
    }
}
export class ProviderElementContext {
    constructor(_viewContext, _parent, _isViewRoot, _directiveAsts, attrs, vars, _sourceSpan) {
        this._viewContext = _viewContext;
        this._parent = _parent;
        this._isViewRoot = _isViewRoot;
        this._directiveAsts = _directiveAsts;
        this._sourceSpan = _sourceSpan;
        this._transformedProviders = new CompileTokenMap();
        this._seenProviders = new CompileTokenMap();
        this._hasViewContainer = false;
        this._attrs = {};
        attrs.forEach((attrAst) => this._attrs[attrAst.name] = attrAst.value);
        var directivesMeta = _directiveAsts.map(directiveAst => directiveAst.directive);
        this._allProviders =
            _resolveProvidersFromDirectives(directivesMeta, _sourceSpan, _viewContext.errors);
        this._contentQueries = _getContentQueries(directivesMeta);
        var queriedTokens = new CompileTokenMap();
        this._allProviders.values().forEach((provider) => { this._addQueryReadsTo(provider.token, queriedTokens); });
        vars.forEach((varAst) => {
            var varToken = new CompileTokenMetadata({ value: varAst.name });
            this._addQueryReadsTo(varToken, queriedTokens);
        });
        if (isPresent(queriedTokens.get(identifierToken(Identifiers.ViewContainerRef)))) {
            this._hasViewContainer = true;
        }
        // create the providers that we know are eager first
        this._allProviders.values().forEach((provider) => {
            var eager = provider.eager || isPresent(queriedTokens.get(provider.token));
            if (eager) {
                this._getOrCreateLocalProvider(provider.providerType, provider.token, true);
            }
        });
    }
    afterElement() {
        // collect lazy providers
        this._allProviders.values().forEach((provider) => {
            this._getOrCreateLocalProvider(provider.providerType, provider.token, false);
        });
    }
    get transformProviders() { return this._transformedProviders.values(); }
    get transformedDirectiveAsts() {
        var sortedProviderTypes = this._transformedProviders.values().map(provider => provider.token.identifier);
        var sortedDirectives = ListWrapper.clone(this._directiveAsts);
        ListWrapper.sort(sortedDirectives, (dir1, dir2) => sortedProviderTypes.indexOf(dir1.directive.type) -
            sortedProviderTypes.indexOf(dir2.directive.type));
        return sortedDirectives;
    }
    get transformedHasViewContainer() { return this._hasViewContainer; }
    _addQueryReadsTo(token, queryReadTokens) {
        this._getQueriesFor(token).forEach((query) => {
            var queryReadToken = isPresent(query.read) ? query.read : token;
            if (isBlank(queryReadTokens.get(queryReadToken))) {
                queryReadTokens.add(queryReadToken, true);
            }
        });
    }
    _getQueriesFor(token) {
        var result = [];
        var currentEl = this;
        var distance = 0;
        var queries;
        while (currentEl !== null) {
            queries = currentEl._contentQueries.get(token);
            if (isPresent(queries)) {
                ListWrapper.addAll(result, queries.filter((query) => query.descendants || distance <= 1));
            }
            if (currentEl._directiveAsts.length > 0) {
                distance++;
            }
            currentEl = currentEl._parent;
        }
        queries = this._viewContext.viewQueries.get(token);
        if (isPresent(queries)) {
            ListWrapper.addAll(result, queries);
        }
        return result;
    }
    _getOrCreateLocalProvider(requestingProviderType, token, eager) {
        var resolvedProvider = this._allProviders.get(token);
        if (isBlank(resolvedProvider) ||
            ((requestingProviderType === ProviderAstType.Directive ||
                requestingProviderType === ProviderAstType.PublicService) &&
                resolvedProvider.providerType === ProviderAstType.PrivateService) ||
            ((requestingProviderType === ProviderAstType.PrivateService ||
                requestingProviderType === ProviderAstType.PublicService) &&
                resolvedProvider.providerType === ProviderAstType.Builtin)) {
            return null;
        }
        var transformedProviderAst = this._transformedProviders.get(token);
        if (isPresent(transformedProviderAst)) {
            return transformedProviderAst;
        }
        if (isPresent(this._seenProviders.get(token))) {
            this._viewContext.errors.push(new ProviderError(`Cannot instantiate cyclic dependency! ${token.name}`, this._sourceSpan));
            return null;
        }
        this._seenProviders.add(token, true);
        var transformedProviders = resolvedProvider.providers.map((provider) => {
            var transformedUseValue = provider.useValue;
            var transformedUseExisting = provider.useExisting;
            var transformedDeps;
            if (isPresent(provider.useExisting)) {
                var existingDiDep = this._getDependency(resolvedProvider.providerType, new CompileDiDependencyMetadata({ token: provider.useExisting }), eager);
                if (isPresent(existingDiDep.token)) {
                    transformedUseExisting = existingDiDep.token;
                }
                else {
                    transformedUseExisting = null;
                    transformedUseValue = existingDiDep.value;
                }
            }
            else if (isPresent(provider.useFactory)) {
                var deps = isPresent(provider.deps) ? provider.deps : provider.useFactory.diDeps;
                transformedDeps =
                    deps.map((dep) => this._getDependency(resolvedProvider.providerType, dep, eager));
            }
            else if (isPresent(provider.useClass)) {
                var deps = isPresent(provider.deps) ? provider.deps : provider.useClass.diDeps;
                transformedDeps =
                    deps.map((dep) => this._getDependency(resolvedProvider.providerType, dep, eager));
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
    }
    _getLocalDependency(requestingProviderType, dep, eager = null) {
        if (dep.isAttribute) {
            var attrValue = this._attrs[dep.token.value];
            return new CompileDiDependencyMetadata({ isValue: true, value: normalizeBlank(attrValue) });
        }
        if (isPresent(dep.query) || isPresent(dep.viewQuery)) {
            return dep;
        }
        if (isPresent(dep.token)) {
            // access builtints
            if ((requestingProviderType === ProviderAstType.Directive ||
                requestingProviderType === ProviderAstType.Component)) {
                if (dep.token.equalsTo(identifierToken(Identifiers.Renderer)) ||
                    dep.token.equalsTo(identifierToken(Identifiers.ElementRef)) ||
                    dep.token.equalsTo(identifierToken(Identifiers.ChangeDetectorRef)) ||
                    dep.token.equalsTo(identifierToken(Identifiers.TemplateRef))) {
                    return dep;
                }
                if (dep.token.equalsTo(identifierToken(Identifiers.ViewContainerRef))) {
                    this._hasViewContainer = true;
                }
            }
            // access the injector
            if (dep.token.equalsTo(identifierToken(Identifiers.Injector))) {
                return dep;
            }
            // access providers
            if (isPresent(this._getOrCreateLocalProvider(requestingProviderType, dep.token, eager))) {
                return dep;
            }
        }
        return null;
    }
    _getDependency(requestingProviderType, dep, eager = null) {
        var currElement = this;
        var currEager = eager;
        var result = null;
        if (!dep.isSkipSelf) {
            result = this._getLocalDependency(requestingProviderType, dep, eager);
        }
        if (dep.isSelf) {
            if (isBlank(result) && dep.isOptional) {
                result = new CompileDiDependencyMetadata({ isValue: true, value: null });
            }
        }
        else {
            // check parent elements
            while (isBlank(result) && isPresent(currElement._parent)) {
                var prevElement = currElement;
                currElement = currElement._parent;
                if (prevElement._isViewRoot) {
                    currEager = false;
                }
                result = currElement._getLocalDependency(ProviderAstType.PublicService, dep, currEager);
            }
            // check @Host restriction
            if (isBlank(result)) {
                if (!dep.isHost || this._viewContext.component.type.isHost ||
                    identifierToken(this._viewContext.component.type).equalsTo(dep.token) ||
                    isPresent(this._viewContext.viewProviders.get(dep.token))) {
                    result = dep;
                }
                else {
                    result = dep.isOptional ?
                        result = new CompileDiDependencyMetadata({ isValue: true, value: null }) :
                        null;
                }
            }
        }
        if (isBlank(result)) {
            this._viewContext.errors.push(new ProviderError(`No provider for ${dep.token.name}`, this._sourceSpan));
        }
        return result;
    }
}
function _transformProvider(provider, { useExisting, useValue, deps }) {
    return new CompileProviderMetadata({
        token: provider.token,
        useClass: provider.useClass,
        useExisting: useExisting,
        useFactory: provider.useFactory,
        useValue: useValue,
        deps: deps,
        multi: provider.multi
    });
}
function _transformProviderAst(provider, { eager, providers }) {
    return new ProviderAst(provider.token, provider.multiProvider, provider.eager || eager, providers, provider.providerType, provider.sourceSpan);
}
function _normalizeProviders(providers, sourceSpan, targetErrors, targetProviders = null) {
    if (isBlank(targetProviders)) {
        targetProviders = [];
    }
    if (isPresent(providers)) {
        providers.forEach((provider) => {
            if (isArray(provider)) {
                _normalizeProviders(provider, sourceSpan, targetErrors, targetProviders);
            }
            else {
                var normalizeProvider;
                if (provider instanceof CompileProviderMetadata) {
                    normalizeProvider = provider;
                }
                else if (provider instanceof CompileTypeMetadata) {
                    normalizeProvider = new CompileProviderMetadata({ token: new CompileTokenMetadata({ identifier: provider }), useClass: provider });
                }
                else {
                    targetErrors.push(new ProviderError(`Unknown provider type ${provider}`, sourceSpan));
                }
                if (isPresent(normalizeProvider)) {
                    targetProviders.push(normalizeProvider);
                }
            }
        });
    }
    return targetProviders;
}
function _resolveProvidersFromDirectives(directives, sourceSpan, targetErrors) {
    var providersByToken = new CompileTokenMap();
    directives.forEach((directive) => {
        var dirProvider = new CompileProviderMetadata({ token: new CompileTokenMetadata({ identifier: directive.type }), useClass: directive.type });
        _resolveProviders([dirProvider], directive.isComponent ? ProviderAstType.Component : ProviderAstType.Directive, true, sourceSpan, targetErrors, providersByToken);
    });
    // Note: directives need to be able to overwrite providers of a component!
    var directivesWithComponentFirst = directives.filter(dir => dir.isComponent).concat(directives.filter(dir => !dir.isComponent));
    directivesWithComponentFirst.forEach((directive) => {
        _resolveProviders(_normalizeProviders(directive.providers, sourceSpan, targetErrors), ProviderAstType.PublicService, false, sourceSpan, targetErrors, providersByToken);
        _resolveProviders(_normalizeProviders(directive.viewProviders, sourceSpan, targetErrors), ProviderAstType.PrivateService, false, sourceSpan, targetErrors, providersByToken);
    });
    return providersByToken;
}
function _resolveProviders(providers, providerType, eager, sourceSpan, targetErrors, targetProvidersByToken) {
    providers.forEach((provider) => {
        var resolvedProvider = targetProvidersByToken.get(provider.token);
        if (isPresent(resolvedProvider) && resolvedProvider.multiProvider !== provider.multi) {
            targetErrors.push(new ProviderError(`Mixing multi and non multi provider is not possible for token ${resolvedProvider.token.name}`, sourceSpan));
        }
        if (isBlank(resolvedProvider)) {
            resolvedProvider = new ProviderAst(provider.token, provider.multi, eager, [provider], providerType, sourceSpan);
            targetProvidersByToken.add(provider.token, resolvedProvider);
        }
        else {
            if (!provider.multi) {
                ListWrapper.clear(resolvedProvider.providers);
            }
            resolvedProvider.providers.push(provider);
        }
    });
}
function _getViewQueries(component) {
    var viewQueries = new CompileTokenMap();
    if (isPresent(component.viewQueries)) {
        component.viewQueries.forEach((query) => _addQueryToTokenMap(viewQueries, query));
    }
    component.type.diDeps.forEach((dep) => {
        if (isPresent(dep.viewQuery)) {
            _addQueryToTokenMap(viewQueries, dep.viewQuery);
        }
    });
    return viewQueries;
}
function _getContentQueries(directives) {
    var contentQueries = new CompileTokenMap();
    directives.forEach(directive => {
        if (isPresent(directive.queries)) {
            directive.queries.forEach((query) => _addQueryToTokenMap(contentQueries, query));
        }
        directive.type.diDeps.forEach((dep) => {
            if (isPresent(dep.query)) {
                _addQueryToTokenMap(contentQueries, dep.query);
            }
        });
    });
    return contentQueries;
}
function _addQueryToTokenMap(map, query) {
    query.selectors.forEach((token) => {
        var entry = map.get(token);
        if (isBlank(entry)) {
            entry = [];
            map.add(token, entry);
        }
        entry.push(query);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXJfcGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC05RDFpR1FWRy50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3Byb3ZpZGVyX3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBQyxNQUFNLDBCQUEwQjtPQUM3RSxFQUFDLFdBQVcsRUFBQyxNQUFNLGdDQUFnQztPQUNuRCxFQWdCTCxXQUFXLEVBQ1gsZUFBZSxFQUNoQixNQUFNLGdCQUFnQjtPQUNoQixFQUNMLG1CQUFtQixFQUNuQixlQUFlLEVBRWYsb0JBQW9CLEVBQ3BCLHVCQUF1QixFQUV2QiwyQkFBMkIsRUFDNUIsTUFBTSxvQkFBb0I7T0FDcEIsRUFBQyxXQUFXLEVBQUUsZUFBZSxFQUFDLE1BQU0sZUFBZTtPQUNuRCxFQUFrQixVQUFVLEVBQWdCLE1BQU0sY0FBYztBQUV2RSxtQ0FBbUMsVUFBVTtJQUMzQyxZQUFZLE9BQWUsRUFBRSxJQUFxQjtRQUFJLE1BQU0sSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQUMsQ0FBQztBQUMvRSxDQUFDO0FBRUQ7SUFXRSxZQUFtQixTQUFtQyxFQUFTLFVBQTJCO1FBQXZFLGNBQVMsR0FBVCxTQUFTLENBQTBCO1FBQVMsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7UUFGMUYsV0FBTSxHQUFvQixFQUFFLENBQUM7UUFHM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLGVBQWUsRUFBVyxDQUFDO1FBQ3BELG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDaEUsT0FBTyxDQUFDLENBQUMsUUFBUTtZQUNoQixFQUFFLENB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Q2pDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxLQUFLLG1CQUFtQixDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ25GLENBQUM7UUFDRCxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHO1lBQ2hDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixtQkFBbUIsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pELENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLGNBQWMsQ0FBQztBQUN4QixDQUFDO0FBRUQsNkJBQTZCLEdBQTRDLEVBQzVDLEtBQTJCO0lBQ3RELEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBMkI7UUFDbEQsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDWCxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixDQUFDO1FBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzUHJlc2VudCwgaXNCbGFuaywgaXNBcnJheSwgbm9ybWFsaXplQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0xpc3RXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtcbiAgVGVtcGxhdGVBc3QsXG4gIFRlbXBsYXRlQXN0VmlzaXRvcixcbiAgTmdDb250ZW50QXN0LFxuICBFbWJlZGRlZFRlbXBsYXRlQXN0LFxuICBFbGVtZW50QXN0LFxuICBWYXJpYWJsZUFzdCxcbiAgQm91bmRFdmVudEFzdCxcbiAgQm91bmRFbGVtZW50UHJvcGVydHlBc3QsXG4gIEF0dHJBc3QsXG4gIEJvdW5kVGV4dEFzdCxcbiAgVGV4dEFzdCxcbiAgRGlyZWN0aXZlQXN0LFxuICBCb3VuZERpcmVjdGl2ZVByb3BlcnR5QXN0LFxuICB0ZW1wbGF0ZVZpc2l0QWxsLFxuICBQcm9wZXJ0eUJpbmRpbmdUeXBlLFxuICBQcm92aWRlckFzdCxcbiAgUHJvdmlkZXJBc3RUeXBlXG59IGZyb20gJy4vdGVtcGxhdGVfYXN0JztcbmltcG9ydCB7XG4gIENvbXBpbGVUeXBlTWV0YWRhdGEsXG4gIENvbXBpbGVUb2tlbk1hcCxcbiAgQ29tcGlsZVF1ZXJ5TWV0YWRhdGEsXG4gIENvbXBpbGVUb2tlbk1ldGFkYXRhLFxuICBDb21waWxlUHJvdmlkZXJNZXRhZGF0YSxcbiAgQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICBDb21waWxlRGlEZXBlbmRlbmN5TWV0YWRhdGFcbn0gZnJvbSAnLi9jb21waWxlX21ldGFkYXRhJztcbmltcG9ydCB7SWRlbnRpZmllcnMsIGlkZW50aWZpZXJUb2tlbn0gZnJvbSAnLi9pZGVudGlmaWVycyc7XG5pbXBvcnQge1BhcnNlU291cmNlU3BhbiwgUGFyc2VFcnJvciwgUGFyc2VMb2NhdGlvbn0gZnJvbSAnLi9wYXJzZV91dGlsJztcblxuZXhwb3J0IGNsYXNzIFByb3ZpZGVyRXJyb3IgZXh0ZW5kcyBQYXJzZUVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nLCBzcGFuOiBQYXJzZVNvdXJjZVNwYW4pIHsgc3VwZXIoc3BhbiwgbWVzc2FnZSk7IH1cbn1cblxuZXhwb3J0IGNsYXNzIFByb3ZpZGVyVmlld0NvbnRleHQge1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICB2aWV3UXVlcmllczogQ29tcGlsZVRva2VuTWFwPENvbXBpbGVRdWVyeU1ldGFkYXRhW10+O1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICB2aWV3UHJvdmlkZXJzOiBDb21waWxlVG9rZW5NYXA8Ym9vbGVhbj47XG4gIGVycm9yczogUHJvdmlkZXJFcnJvcltdID0gW107XG5cbiAgY29uc3RydWN0b3IocHVibGljIGNvbXBvbmVudDogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7XG4gICAgdGhpcy52aWV3UXVlcmllcyA9IF9nZXRWaWV3UXVlcmllcyhjb21wb25lbnQpO1xuICAgIHRoaXMudmlld1Byb3ZpZGVycyA9IG5ldyBDb21waWxlVG9rZW5NYXA8Ym9vbGVhbj4oKTtcbiAgICBfbm9ybWFsaXplUHJvdmlkZXJzKGNvbXBvbmVudC52aWV3UHJvdmlkZXJzLCBzb3VyY2VTcGFuLCB0aGlzLmVycm9ycylcbiAgICAgICAgLmZvckVhY2goKHByb3ZpZGVyKSA9PiB7XG4gICAgICAgICAgaWYgKGlzQmxhbmsodGhpcy52aWV3UHJvdmlkZXJzLmdldChwcm92aWRlci50b2tlbikpKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXdQcm92aWRlcnMuYWRkKHByb3ZpZGVyLnRva2VuLCB0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQcm92aWRlckVsZW1lbnRDb250ZXh0IHtcbiAgcHJpdmF0ZSBfY29udGVudFF1ZXJpZXM6IENvbXBpbGVUb2tlbk1hcDxDb21waWxlUXVlcnlNZXRhZGF0YVtdPjtcblxuICBwcml2YXRlIF90cmFuc2Zvcm1lZFByb3ZpZGVycyA9IG5ldyBDb21waWxlVG9rZW5NYXA8UHJvdmlkZXJBc3Q+KCk7XG4gIHByaXZhdGUgX3NlZW5Qcm92aWRlcnMgPSBuZXcgQ29tcGlsZVRva2VuTWFwPGJvb2xlYW4+KCk7XG4gIHByaXZhdGUgX2FsbFByb3ZpZGVyczogQ29tcGlsZVRva2VuTWFwPFByb3ZpZGVyQXN0PjtcbiAgcHJpdmF0ZSBfYXR0cnM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9O1xuICBwcml2YXRlIF9oYXNWaWV3Q29udGFpbmVyOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdmlld0NvbnRleHQ6IFByb3ZpZGVyVmlld0NvbnRleHQsIHByaXZhdGUgX3BhcmVudDogUHJvdmlkZXJFbGVtZW50Q29udGV4dCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfaXNWaWV3Um9vdDogYm9vbGVhbiwgcHJpdmF0ZSBfZGlyZWN0aXZlQXN0czogRGlyZWN0aXZlQXN0W10sXG4gICAgICAgICAgICAgIGF0dHJzOiBBdHRyQXN0W10sIHZhcnM6IFZhcmlhYmxlQXN0W10sIHByaXZhdGUgX3NvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge1xuICAgIHRoaXMuX2F0dHJzID0ge307XG4gICAgYXR0cnMuZm9yRWFjaCgoYXR0ckFzdCkgPT4gdGhpcy5fYXR0cnNbYXR0ckFzdC5uYW1lXSA9IGF0dHJBc3QudmFsdWUpO1xuICAgIHZhciBkaXJlY3RpdmVzTWV0YSA9IF9kaXJlY3RpdmVBc3RzLm1hcChkaXJlY3RpdmVBc3QgPT4gZGlyZWN0aXZlQXN0LmRpcmVjdGl2ZSk7XG4gICAgdGhpcy5fYWxsUHJvdmlkZXJzID1cbiAgICAgICAgX3Jlc29sdmVQcm92aWRlcnNGcm9tRGlyZWN0aXZlcyhkaXJlY3RpdmVzTWV0YSwgX3NvdXJjZVNwYW4sIF92aWV3Q29udGV4dC5lcnJvcnMpO1xuICAgIHRoaXMuX2NvbnRlbnRRdWVyaWVzID0gX2dldENvbnRlbnRRdWVyaWVzKGRpcmVjdGl2ZXNNZXRhKTtcbiAgICB2YXIgcXVlcmllZFRva2VucyA9IG5ldyBDb21waWxlVG9rZW5NYXA8Ym9vbGVhbj4oKTtcbiAgICB0aGlzLl9hbGxQcm92aWRlcnMudmFsdWVzKCkuZm9yRWFjaChcbiAgICAgICAgKHByb3ZpZGVyKSA9PiB7IHRoaXMuX2FkZFF1ZXJ5UmVhZHNUbyhwcm92aWRlci50b2tlbiwgcXVlcmllZFRva2Vucyk7IH0pO1xuICAgIHZhcnMuZm9yRWFjaCgodmFyQXN0KSA9PiB7XG4gICAgICB2YXIgdmFyVG9rZW4gPSBuZXcgQ29tcGlsZVRva2VuTWV0YWRhdGEoe3ZhbHVlOiB2YXJBc3QubmFtZX0pO1xuICAgICAgdGhpcy5fYWRkUXVlcnlSZWFkc1RvKHZhclRva2VuLCBxdWVyaWVkVG9rZW5zKTtcbiAgICB9KTtcbiAgICBpZiAoaXNQcmVzZW50KHF1ZXJpZWRUb2tlbnMuZ2V0KGlkZW50aWZpZXJUb2tlbihJZGVudGlmaWVycy5WaWV3Q29udGFpbmVyUmVmKSkpKSB7XG4gICAgICB0aGlzLl9oYXNWaWV3Q29udGFpbmVyID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgdGhlIHByb3ZpZGVycyB0aGF0IHdlIGtub3cgYXJlIGVhZ2VyIGZpcnN0XG4gICAgdGhpcy5fYWxsUHJvdmlkZXJzLnZhbHVlcygpLmZvckVhY2goKHByb3ZpZGVyKSA9PiB7XG4gICAgICB2YXIgZWFnZXIgPSBwcm92aWRlci5lYWdlciB8fCBpc1ByZXNlbnQocXVlcmllZFRva2Vucy5nZXQocHJvdmlkZXIudG9rZW4pKTtcbiAgICAgIGlmIChlYWdlcikge1xuICAgICAgICB0aGlzLl9nZXRPckNyZWF0ZUxvY2FsUHJvdmlkZXIocHJvdmlkZXIucHJvdmlkZXJUeXBlLCBwcm92aWRlci50b2tlbiwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhZnRlckVsZW1lbnQoKSB7XG4gICAgLy8gY29sbGVjdCBsYXp5IHByb3ZpZGVyc1xuICAgIHRoaXMuX2FsbFByb3ZpZGVycy52YWx1ZXMoKS5mb3JFYWNoKChwcm92aWRlcikgPT4ge1xuICAgICAgdGhpcy5fZ2V0T3JDcmVhdGVMb2NhbFByb3ZpZGVyKHByb3ZpZGVyLnByb3ZpZGVyVHlwZSwgcHJvdmlkZXIudG9rZW4sIGZhbHNlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCB0cmFuc2Zvcm1Qcm92aWRlcnMoKTogUHJvdmlkZXJBc3RbXSB7IHJldHVybiB0aGlzLl90cmFuc2Zvcm1lZFByb3ZpZGVycy52YWx1ZXMoKTsgfVxuXG4gIGdldCB0cmFuc2Zvcm1lZERpcmVjdGl2ZUFzdHMoKTogRGlyZWN0aXZlQXN0W10ge1xuICAgIHZhciBzb3J0ZWRQcm92aWRlclR5cGVzID1cbiAgICAgICAgdGhpcy5fdHJhbnNmb3JtZWRQcm92aWRlcnMudmFsdWVzKCkubWFwKHByb3ZpZGVyID0+IHByb3ZpZGVyLnRva2VuLmlkZW50aWZpZXIpO1xuICAgIHZhciBzb3J0ZWREaXJlY3RpdmVzID0gTGlzdFdyYXBwZXIuY2xvbmUodGhpcy5fZGlyZWN0aXZlQXN0cyk7XG4gICAgTGlzdFdyYXBwZXIuc29ydChzb3J0ZWREaXJlY3RpdmVzLFxuICAgICAgICAgICAgICAgICAgICAgKGRpcjEsIGRpcjIpID0+IHNvcnRlZFByb3ZpZGVyVHlwZXMuaW5kZXhPZihkaXIxLmRpcmVjdGl2ZS50eXBlKSAtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc29ydGVkUHJvdmlkZXJUeXBlcy5pbmRleE9mKGRpcjIuZGlyZWN0aXZlLnR5cGUpKTtcbiAgICByZXR1cm4gc29ydGVkRGlyZWN0aXZlcztcbiAgfVxuXG4gIGdldCB0cmFuc2Zvcm1lZEhhc1ZpZXdDb250YWluZXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9oYXNWaWV3Q29udGFpbmVyOyB9XG5cbiAgcHJpdmF0ZSBfYWRkUXVlcnlSZWFkc1RvKHRva2VuOiBDb21waWxlVG9rZW5NZXRhZGF0YSwgcXVlcnlSZWFkVG9rZW5zOiBDb21waWxlVG9rZW5NYXA8Ym9vbGVhbj4pIHtcbiAgICB0aGlzLl9nZXRRdWVyaWVzRm9yKHRva2VuKS5mb3JFYWNoKChxdWVyeSkgPT4ge1xuICAgICAgdmFyIHF1ZXJ5UmVhZFRva2VuID0gaXNQcmVzZW50KHF1ZXJ5LnJlYWQpID8gcXVlcnkucmVhZCA6IHRva2VuO1xuICAgICAgaWYgKGlzQmxhbmsocXVlcnlSZWFkVG9rZW5zLmdldChxdWVyeVJlYWRUb2tlbikpKSB7XG4gICAgICAgIHF1ZXJ5UmVhZFRva2Vucy5hZGQocXVlcnlSZWFkVG9rZW4sIHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UXVlcmllc0Zvcih0b2tlbjogQ29tcGlsZVRva2VuTWV0YWRhdGEpOiBDb21waWxlUXVlcnlNZXRhZGF0YVtdIHtcbiAgICB2YXIgcmVzdWx0OiBDb21waWxlUXVlcnlNZXRhZGF0YVtdID0gW107XG4gICAgdmFyIGN1cnJlbnRFbDogUHJvdmlkZXJFbGVtZW50Q29udGV4dCA9IHRoaXM7XG4gICAgdmFyIGRpc3RhbmNlID0gMDtcbiAgICB2YXIgcXVlcmllczogQ29tcGlsZVF1ZXJ5TWV0YWRhdGFbXTtcbiAgICB3aGlsZSAoY3VycmVudEVsICE9PSBudWxsKSB7XG4gICAgICBxdWVyaWVzID0gY3VycmVudEVsLl9jb250ZW50UXVlcmllcy5nZXQodG9rZW4pO1xuICAgICAgaWYgKGlzUHJlc2VudChxdWVyaWVzKSkge1xuICAgICAgICBMaXN0V3JhcHBlci5hZGRBbGwocmVzdWx0LCBxdWVyaWVzLmZpbHRlcigocXVlcnkpID0+IHF1ZXJ5LmRlc2NlbmRhbnRzIHx8IGRpc3RhbmNlIDw9IDEpKTtcbiAgICAgIH1cbiAgICAgIGlmIChjdXJyZW50RWwuX2RpcmVjdGl2ZUFzdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBkaXN0YW5jZSsrO1xuICAgICAgfVxuICAgICAgY3VycmVudEVsID0gY3VycmVudEVsLl9wYXJlbnQ7XG4gICAgfVxuICAgIHF1ZXJpZXMgPSB0aGlzLl92aWV3Q29udGV4dC52aWV3UXVlcmllcy5nZXQodG9rZW4pO1xuICAgIGlmIChpc1ByZXNlbnQocXVlcmllcykpIHtcbiAgICAgIExpc3RXcmFwcGVyLmFkZEFsbChyZXN1bHQsIHF1ZXJpZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cblxuICBwcml2YXRlIF9nZXRPckNyZWF0ZUxvY2FsUHJvdmlkZXIocmVxdWVzdGluZ1Byb3ZpZGVyVHlwZTogUHJvdmlkZXJBc3RUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW46IENvbXBpbGVUb2tlbk1ldGFkYXRhLCBlYWdlcjogYm9vbGVhbik6IFByb3ZpZGVyQXN0IHtcbiAgICB2YXIgcmVzb2x2ZWRQcm92aWRlciA9IHRoaXMuX2FsbFByb3ZpZGVycy5nZXQodG9rZW4pO1xuICAgIGlmIChpc0JsYW5rKHJlc29sdmVkUHJvdmlkZXIpIHx8XG4gICAgICAgICgocmVxdWVzdGluZ1Byb3ZpZGVyVHlwZSA9PT0gUHJvdmlkZXJBc3RUeXBlLkRpcmVjdGl2ZSB8fFxuICAgICAgICAgIHJlcXVlc3RpbmdQcm92aWRlclR5cGUgPT09IFByb3ZpZGVyQXN0VHlwZS5QdWJsaWNTZXJ2aWNlKSAmJlxuICAgICAgICAgcmVzb2x2ZWRQcm92aWRlci5wcm92aWRlclR5cGUgPT09IFByb3ZpZGVyQXN0VHlwZS5Qcml2YXRlU2VydmljZSkgfHxcbiAgICAgICAgKChyZXF1ZXN0aW5nUHJvdmlkZXJUeXBlID09PSBQcm92aWRlckFzdFR5cGUuUHJpdmF0ZVNlcnZpY2UgfHxcbiAgICAgICAgICByZXF1ZXN0aW5nUHJvdmlkZXJUeXBlID09PSBQcm92aWRlckFzdFR5cGUuUHVibGljU2VydmljZSkgJiZcbiAgICAgICAgIHJlc29sdmVkUHJvdmlkZXIucHJvdmlkZXJUeXBlID09PSBQcm92aWRlckFzdFR5cGUuQnVpbHRpbikpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB2YXIgdHJhbnNmb3JtZWRQcm92aWRlckFzdCA9IHRoaXMuX3RyYW5zZm9ybWVkUHJvdmlkZXJzLmdldCh0b2tlbik7XG4gICAgaWYgKGlzUHJlc2VudCh0cmFuc2Zvcm1lZFByb3ZpZGVyQXN0KSkge1xuICAgICAgcmV0dXJuIHRyYW5zZm9ybWVkUHJvdmlkZXJBc3Q7XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQodGhpcy5fc2VlblByb3ZpZGVycy5nZXQodG9rZW4pKSkge1xuICAgICAgdGhpcy5fdmlld0NvbnRleHQuZXJyb3JzLnB1c2gobmV3IFByb3ZpZGVyRXJyb3IoXG4gICAgICAgICAgYENhbm5vdCBpbnN0YW50aWF0ZSBjeWNsaWMgZGVwZW5kZW5jeSEgJHt0b2tlbi5uYW1lfWAsIHRoaXMuX3NvdXJjZVNwYW4pKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB0aGlzLl9zZWVuUHJvdmlkZXJzLmFkZCh0b2tlbiwgdHJ1ZSk7XG4gICAgdmFyIHRyYW5zZm9ybWVkUHJvdmlkZXJzID0gcmVzb2x2ZWRQcm92aWRlci5wcm92aWRlcnMubWFwKChwcm92aWRlcikgPT4ge1xuICAgICAgdmFyIHRyYW5zZm9ybWVkVXNlVmFsdWUgPSBwcm92aWRlci51c2VWYWx1ZTtcbiAgICAgIHZhciB0cmFuc2Zvcm1lZFVzZUV4aXN0aW5nID0gcHJvdmlkZXIudXNlRXhpc3Rpbmc7XG4gICAgICB2YXIgdHJhbnNmb3JtZWREZXBzO1xuICAgICAgaWYgKGlzUHJlc2VudChwcm92aWRlci51c2VFeGlzdGluZykpIHtcbiAgICAgICAgdmFyIGV4aXN0aW5nRGlEZXAgPSB0aGlzLl9nZXREZXBlbmRlbmN5KFxuICAgICAgICAgICAgcmVzb2x2ZWRQcm92aWRlci5wcm92aWRlclR5cGUsXG4gICAgICAgICAgICBuZXcgQ29tcGlsZURpRGVwZW5kZW5jeU1ldGFkYXRhKHt0b2tlbjogcHJvdmlkZXIudXNlRXhpc3Rpbmd9KSwgZWFnZXIpO1xuICAgICAgICBpZiAoaXNQcmVzZW50KGV4aXN0aW5nRGlEZXAudG9rZW4pKSB7XG4gICAgICAgICAgdHJhbnNmb3JtZWRVc2VFeGlzdGluZyA9IGV4aXN0aW5nRGlEZXAudG9rZW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJhbnNmb3JtZWRVc2VFeGlzdGluZyA9IG51bGw7XG4gICAgICAgICAgdHJhbnNmb3JtZWRVc2VWYWx1ZSA9IGV4aXN0aW5nRGlEZXAudmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXNQcmVzZW50KHByb3ZpZGVyLnVzZUZhY3RvcnkpKSB7XG4gICAgICAgIHZhciBkZXBzID0gaXNQcmVzZW50KHByb3ZpZGVyLmRlcHMpID8gcHJvdmlkZXIuZGVwcyA6IHByb3ZpZGVyLnVzZUZhY3RvcnkuZGlEZXBzO1xuICAgICAgICB0cmFuc2Zvcm1lZERlcHMgPVxuICAgICAgICAgICAgZGVwcy5tYXAoKGRlcCkgPT4gdGhpcy5fZ2V0RGVwZW5kZW5jeShyZXNvbHZlZFByb3ZpZGVyLnByb3ZpZGVyVHlwZSwgZGVwLCBlYWdlcikpO1xuICAgICAgfSBlbHNlIGlmIChpc1ByZXNlbnQocHJvdmlkZXIudXNlQ2xhc3MpKSB7XG4gICAgICAgIHZhciBkZXBzID0gaXNQcmVzZW50KHByb3ZpZGVyLmRlcHMpID8gcHJvdmlkZXIuZGVwcyA6IHByb3ZpZGVyLnVzZUNsYXNzLmRpRGVwcztcbiAgICAgICAgdHJhbnNmb3JtZWREZXBzID1cbiAgICAgICAgICAgIGRlcHMubWFwKChkZXApID0+IHRoaXMuX2dldERlcGVuZGVuY3kocmVzb2x2ZWRQcm92aWRlci5wcm92aWRlclR5cGUsIGRlcCwgZWFnZXIpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfdHJhbnNmb3JtUHJvdmlkZXIocHJvdmlkZXIsIHtcbiAgICAgICAgdXNlRXhpc3Rpbmc6IHRyYW5zZm9ybWVkVXNlRXhpc3RpbmcsXG4gICAgICAgIHVzZVZhbHVlOiB0cmFuc2Zvcm1lZFVzZVZhbHVlLFxuICAgICAgICBkZXBzOiB0cmFuc2Zvcm1lZERlcHNcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRyYW5zZm9ybWVkUHJvdmlkZXJBc3QgPVxuICAgICAgICBfdHJhbnNmb3JtUHJvdmlkZXJBc3QocmVzb2x2ZWRQcm92aWRlciwge2VhZ2VyOiBlYWdlciwgcHJvdmlkZXJzOiB0cmFuc2Zvcm1lZFByb3ZpZGVyc30pO1xuICAgIHRoaXMuX3RyYW5zZm9ybWVkUHJvdmlkZXJzLmFkZCh0b2tlbiwgdHJhbnNmb3JtZWRQcm92aWRlckFzdCk7XG4gICAgcmV0dXJuIHRyYW5zZm9ybWVkUHJvdmlkZXJBc3Q7XG4gIH1cblxuICBwcml2YXRlIF9nZXRMb2NhbERlcGVuZGVuY3kocmVxdWVzdGluZ1Byb3ZpZGVyVHlwZTogUHJvdmlkZXJBc3RUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwOiBDb21waWxlRGlEZXBlbmRlbmN5TWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYWdlcjogYm9vbGVhbiA9IG51bGwpOiBDb21waWxlRGlEZXBlbmRlbmN5TWV0YWRhdGEge1xuICAgIGlmIChkZXAuaXNBdHRyaWJ1dGUpIHtcbiAgICAgIHZhciBhdHRyVmFsdWUgPSB0aGlzLl9hdHRyc1tkZXAudG9rZW4udmFsdWVdO1xuICAgICAgcmV0dXJuIG5ldyBDb21waWxlRGlEZXBlbmRlbmN5TWV0YWRhdGEoe2lzVmFsdWU6IHRydWUsIHZhbHVlOiBub3JtYWxpemVCbGFuayhhdHRyVmFsdWUpfSk7XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQoZGVwLnF1ZXJ5KSB8fCBpc1ByZXNlbnQoZGVwLnZpZXdRdWVyeSkpIHtcbiAgICAgIHJldHVybiBkZXA7XG4gICAgfVxuXG4gICAgaWYgKGlzUHJlc2VudChkZXAudG9rZW4pKSB7XG4gICAgICAvLyBhY2Nlc3MgYnVpbHRpbnRzXG4gICAgICBpZiAoKHJlcXVlc3RpbmdQcm92aWRlclR5cGUgPT09IFByb3ZpZGVyQXN0VHlwZS5EaXJlY3RpdmUgfHxcbiAgICAgICAgICAgcmVxdWVzdGluZ1Byb3ZpZGVyVHlwZSA9PT0gUHJvdmlkZXJBc3RUeXBlLkNvbXBvbmVudCkpIHtcbiAgICAgICAgaWYgKGRlcC50b2tlbi5lcXVhbHNUbyhpZGVudGlmaWVyVG9rZW4oSWRlbnRpZmllcnMuUmVuZGVyZXIpKSB8fFxuICAgICAgICAgICAgZGVwLnRva2VuLmVxdWFsc1RvKGlkZW50aWZpZXJUb2tlbihJZGVudGlmaWVycy5FbGVtZW50UmVmKSkgfHxcbiAgICAgICAgICAgIGRlcC50b2tlbi5lcXVhbHNUbyhpZGVudGlmaWVyVG9rZW4oSWRlbnRpZmllcnMuQ2hhbmdlRGV0ZWN0b3JSZWYpKSB8fFxuICAgICAgICAgICAgZGVwLnRva2VuLmVxdWFsc1RvKGlkZW50aWZpZXJUb2tlbihJZGVudGlmaWVycy5UZW1wbGF0ZVJlZikpKSB7XG4gICAgICAgICAgcmV0dXJuIGRlcDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVwLnRva2VuLmVxdWFsc1RvKGlkZW50aWZpZXJUb2tlbihJZGVudGlmaWVycy5WaWV3Q29udGFpbmVyUmVmKSkpIHtcbiAgICAgICAgICB0aGlzLl9oYXNWaWV3Q29udGFpbmVyID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gYWNjZXNzIHRoZSBpbmplY3RvclxuICAgICAgaWYgKGRlcC50b2tlbi5lcXVhbHNUbyhpZGVudGlmaWVyVG9rZW4oSWRlbnRpZmllcnMuSW5qZWN0b3IpKSkge1xuICAgICAgICByZXR1cm4gZGVwO1xuICAgICAgfVxuICAgICAgLy8gYWNjZXNzIHByb3ZpZGVyc1xuICAgICAgaWYgKGlzUHJlc2VudCh0aGlzLl9nZXRPckNyZWF0ZUxvY2FsUHJvdmlkZXIocmVxdWVzdGluZ1Byb3ZpZGVyVHlwZSwgZGVwLnRva2VuLCBlYWdlcikpKSB7XG4gICAgICAgIHJldHVybiBkZXA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0RGVwZW5kZW5jeShyZXF1ZXN0aW5nUHJvdmlkZXJUeXBlOiBQcm92aWRlckFzdFR5cGUsIGRlcDogQ29tcGlsZURpRGVwZW5kZW5jeU1ldGFkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgIGVhZ2VyOiBib29sZWFuID0gbnVsbCk6IENvbXBpbGVEaURlcGVuZGVuY3lNZXRhZGF0YSB7XG4gICAgdmFyIGN1cnJFbGVtZW50OiBQcm92aWRlckVsZW1lbnRDb250ZXh0ID0gdGhpcztcbiAgICB2YXIgY3VyckVhZ2VyOiBib29sZWFuID0gZWFnZXI7XG4gICAgdmFyIHJlc3VsdDogQ29tcGlsZURpRGVwZW5kZW5jeU1ldGFkYXRhID0gbnVsbDtcbiAgICBpZiAoIWRlcC5pc1NraXBTZWxmKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLl9nZXRMb2NhbERlcGVuZGVuY3kocmVxdWVzdGluZ1Byb3ZpZGVyVHlwZSwgZGVwLCBlYWdlcik7XG4gICAgfVxuICAgIGlmIChkZXAuaXNTZWxmKSB7XG4gICAgICBpZiAoaXNCbGFuayhyZXN1bHQpICYmIGRlcC5pc09wdGlvbmFsKSB7XG4gICAgICAgIHJlc3VsdCA9IG5ldyBDb21waWxlRGlEZXBlbmRlbmN5TWV0YWRhdGEoe2lzVmFsdWU6IHRydWUsIHZhbHVlOiBudWxsfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNoZWNrIHBhcmVudCBlbGVtZW50c1xuICAgICAgd2hpbGUgKGlzQmxhbmsocmVzdWx0KSAmJiBpc1ByZXNlbnQoY3VyckVsZW1lbnQuX3BhcmVudCkpIHtcbiAgICAgICAgdmFyIHByZXZFbGVtZW50ID0gY3VyckVsZW1lbnQ7XG4gICAgICAgIGN1cnJFbGVtZW50ID0gY3VyckVsZW1lbnQuX3BhcmVudDtcbiAgICAgICAgaWYgKHByZXZFbGVtZW50Ll9pc1ZpZXdSb290KSB7XG4gICAgICAgICAgY3VyckVhZ2VyID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gY3VyckVsZW1lbnQuX2dldExvY2FsRGVwZW5kZW5jeShQcm92aWRlckFzdFR5cGUuUHVibGljU2VydmljZSwgZGVwLCBjdXJyRWFnZXIpO1xuICAgICAgfVxuICAgICAgLy8gY2hlY2sgQEhvc3QgcmVzdHJpY3Rpb25cbiAgICAgIGlmIChpc0JsYW5rKHJlc3VsdCkpIHtcbiAgICAgICAgaWYgKCFkZXAuaXNIb3N0IHx8IHRoaXMuX3ZpZXdDb250ZXh0LmNvbXBvbmVudC50eXBlLmlzSG9zdCB8fFxuICAgICAgICAgICAgaWRlbnRpZmllclRva2VuKHRoaXMuX3ZpZXdDb250ZXh0LmNvbXBvbmVudC50eXBlKS5lcXVhbHNUbyhkZXAudG9rZW4pIHx8XG4gICAgICAgICAgICBpc1ByZXNlbnQodGhpcy5fdmlld0NvbnRleHQudmlld1Byb3ZpZGVycy5nZXQoZGVwLnRva2VuKSkpIHtcbiAgICAgICAgICByZXN1bHQgPSBkZXA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0ID0gZGVwLmlzT3B0aW9uYWwgP1xuICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBuZXcgQ29tcGlsZURpRGVwZW5kZW5jeU1ldGFkYXRhKHtpc1ZhbHVlOiB0cnVlLCB2YWx1ZTogbnVsbH0pIDpcbiAgICAgICAgICAgICAgICAgICAgICAgbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNCbGFuayhyZXN1bHQpKSB7XG4gICAgICB0aGlzLl92aWV3Q29udGV4dC5lcnJvcnMucHVzaChcbiAgICAgICAgICBuZXcgUHJvdmlkZXJFcnJvcihgTm8gcHJvdmlkZXIgZm9yICR7ZGVwLnRva2VuLm5hbWV9YCwgdGhpcy5fc291cmNlU3BhbikpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmZ1bmN0aW9uIF90cmFuc2Zvcm1Qcm92aWRlcihcbiAgICBwcm92aWRlcjogQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGEsXG4gICAge3VzZUV4aXN0aW5nLCB1c2VWYWx1ZSwgZGVwc306XG4gICAgICAgIHt1c2VFeGlzdGluZzogQ29tcGlsZVRva2VuTWV0YWRhdGEsIHVzZVZhbHVlOiBhbnksIGRlcHM6IENvbXBpbGVEaURlcGVuZGVuY3lNZXRhZGF0YVtdfSkge1xuICByZXR1cm4gbmV3IENvbXBpbGVQcm92aWRlck1ldGFkYXRhKHtcbiAgICB0b2tlbjogcHJvdmlkZXIudG9rZW4sXG4gICAgdXNlQ2xhc3M6IHByb3ZpZGVyLnVzZUNsYXNzLFxuICAgIHVzZUV4aXN0aW5nOiB1c2VFeGlzdGluZyxcbiAgICB1c2VGYWN0b3J5OiBwcm92aWRlci51c2VGYWN0b3J5LFxuICAgIHVzZVZhbHVlOiB1c2VWYWx1ZSxcbiAgICBkZXBzOiBkZXBzLFxuICAgIG11bHRpOiBwcm92aWRlci5tdWx0aVxuICB9KTtcbn1cblxuZnVuY3Rpb24gX3RyYW5zZm9ybVByb3ZpZGVyQXN0KFxuICAgIHByb3ZpZGVyOiBQcm92aWRlckFzdCxcbiAgICB7ZWFnZXIsIHByb3ZpZGVyc306IHtlYWdlcjogYm9vbGVhbiwgcHJvdmlkZXJzOiBDb21waWxlUHJvdmlkZXJNZXRhZGF0YVtdfSk6IFByb3ZpZGVyQXN0IHtcbiAgcmV0dXJuIG5ldyBQcm92aWRlckFzdChwcm92aWRlci50b2tlbiwgcHJvdmlkZXIubXVsdGlQcm92aWRlciwgcHJvdmlkZXIuZWFnZXIgfHwgZWFnZXIsIHByb3ZpZGVycyxcbiAgICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlci5wcm92aWRlclR5cGUsIHByb3ZpZGVyLnNvdXJjZVNwYW4pO1xufVxuXG5mdW5jdGlvbiBfbm9ybWFsaXplUHJvdmlkZXJzKFxuICAgIHByb3ZpZGVyczogQXJyYXk8Q29tcGlsZVByb3ZpZGVyTWV0YWRhdGEgfCBDb21waWxlVHlwZU1ldGFkYXRhIHwgYW55W10+LFxuICAgIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbiwgdGFyZ2V0RXJyb3JzOiBQYXJzZUVycm9yW10sXG4gICAgdGFyZ2V0UHJvdmlkZXJzOiBDb21waWxlUHJvdmlkZXJNZXRhZGF0YVtdID0gbnVsbCk6IENvbXBpbGVQcm92aWRlck1ldGFkYXRhW10ge1xuICBpZiAoaXNCbGFuayh0YXJnZXRQcm92aWRlcnMpKSB7XG4gICAgdGFyZ2V0UHJvdmlkZXJzID0gW107XG4gIH1cbiAgaWYgKGlzUHJlc2VudChwcm92aWRlcnMpKSB7XG4gICAgcHJvdmlkZXJzLmZvckVhY2goKHByb3ZpZGVyKSA9PiB7XG4gICAgICBpZiAoaXNBcnJheShwcm92aWRlcikpIHtcbiAgICAgICAgX25vcm1hbGl6ZVByb3ZpZGVycyg8YW55W10+cHJvdmlkZXIsIHNvdXJjZVNwYW4sIHRhcmdldEVycm9ycywgdGFyZ2V0UHJvdmlkZXJzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBub3JtYWxpemVQcm92aWRlcjogQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGE7XG4gICAgICAgIGlmIChwcm92aWRlciBpbnN0YW5jZW9mIENvbXBpbGVQcm92aWRlck1ldGFkYXRhKSB7XG4gICAgICAgICAgbm9ybWFsaXplUHJvdmlkZXIgPSBwcm92aWRlcjtcbiAgICAgICAgfSBlbHNlIGlmIChwcm92aWRlciBpbnN0YW5jZW9mIENvbXBpbGVUeXBlTWV0YWRhdGEpIHtcbiAgICAgICAgICBub3JtYWxpemVQcm92aWRlciA9IG5ldyBDb21waWxlUHJvdmlkZXJNZXRhZGF0YShcbiAgICAgICAgICAgICAge3Rva2VuOiBuZXcgQ29tcGlsZVRva2VuTWV0YWRhdGEoe2lkZW50aWZpZXI6IHByb3ZpZGVyfSksIHVzZUNsYXNzOiBwcm92aWRlcn0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldEVycm9ycy5wdXNoKG5ldyBQcm92aWRlckVycm9yKGBVbmtub3duIHByb3ZpZGVyIHR5cGUgJHtwcm92aWRlcn1gLCBzb3VyY2VTcGFuKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzUHJlc2VudChub3JtYWxpemVQcm92aWRlcikpIHtcbiAgICAgICAgICB0YXJnZXRQcm92aWRlcnMucHVzaChub3JtYWxpemVQcm92aWRlcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gdGFyZ2V0UHJvdmlkZXJzO1xufVxuXG5cbmZ1bmN0aW9uIF9yZXNvbHZlUHJvdmlkZXJzRnJvbURpcmVjdGl2ZXMoZGlyZWN0aXZlczogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RXJyb3JzOiBQYXJzZUVycm9yW10pOiBDb21waWxlVG9rZW5NYXA8UHJvdmlkZXJBc3Q+IHtcbiAgdmFyIHByb3ZpZGVyc0J5VG9rZW4gPSBuZXcgQ29tcGlsZVRva2VuTWFwPFByb3ZpZGVyQXN0PigpO1xuICBkaXJlY3RpdmVzLmZvckVhY2goKGRpcmVjdGl2ZSkgPT4ge1xuICAgIHZhciBkaXJQcm92aWRlciA9IG5ldyBDb21waWxlUHJvdmlkZXJNZXRhZGF0YShcbiAgICAgICAge3Rva2VuOiBuZXcgQ29tcGlsZVRva2VuTWV0YWRhdGEoe2lkZW50aWZpZXI6IGRpcmVjdGl2ZS50eXBlfSksIHVzZUNsYXNzOiBkaXJlY3RpdmUudHlwZX0pO1xuICAgIF9yZXNvbHZlUHJvdmlkZXJzKFtkaXJQcm92aWRlcl0sXG4gICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlLmlzQ29tcG9uZW50ID8gUHJvdmlkZXJBc3RUeXBlLkNvbXBvbmVudCA6IFByb3ZpZGVyQXN0VHlwZS5EaXJlY3RpdmUsXG4gICAgICAgICAgICAgICAgICAgICAgdHJ1ZSwgc291cmNlU3BhbiwgdGFyZ2V0RXJyb3JzLCBwcm92aWRlcnNCeVRva2VuKTtcbiAgfSk7XG5cbiAgLy8gTm90ZTogZGlyZWN0aXZlcyBuZWVkIHRvIGJlIGFibGUgdG8gb3ZlcndyaXRlIHByb3ZpZGVycyBvZiBhIGNvbXBvbmVudCFcbiAgdmFyIGRpcmVjdGl2ZXNXaXRoQ29tcG9uZW50Rmlyc3QgPVxuICAgICAgZGlyZWN0aXZlcy5maWx0ZXIoZGlyID0+IGRpci5pc0NvbXBvbmVudCkuY29uY2F0KGRpcmVjdGl2ZXMuZmlsdGVyKGRpciA9PiAhZGlyLmlzQ29tcG9uZW50KSk7XG4gIGRpcmVjdGl2ZXNXaXRoQ29tcG9uZW50Rmlyc3QuZm9yRWFjaCgoZGlyZWN0aXZlKSA9PiB7XG4gICAgX3Jlc29sdmVQcm92aWRlcnMoX25vcm1hbGl6ZVByb3ZpZGVycyhkaXJlY3RpdmUucHJvdmlkZXJzLCBzb3VyY2VTcGFuLCB0YXJnZXRFcnJvcnMpLFxuICAgICAgICAgICAgICAgICAgICAgIFByb3ZpZGVyQXN0VHlwZS5QdWJsaWNTZXJ2aWNlLCBmYWxzZSwgc291cmNlU3BhbiwgdGFyZ2V0RXJyb3JzLFxuICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyc0J5VG9rZW4pO1xuICAgIF9yZXNvbHZlUHJvdmlkZXJzKF9ub3JtYWxpemVQcm92aWRlcnMoZGlyZWN0aXZlLnZpZXdQcm92aWRlcnMsIHNvdXJjZVNwYW4sIHRhcmdldEVycm9ycyksXG4gICAgICAgICAgICAgICAgICAgICAgUHJvdmlkZXJBc3RUeXBlLlByaXZhdGVTZXJ2aWNlLCBmYWxzZSwgc291cmNlU3BhbiwgdGFyZ2V0RXJyb3JzLFxuICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyc0J5VG9rZW4pO1xuICB9KTtcbiAgcmV0dXJuIHByb3ZpZGVyc0J5VG9rZW47XG59XG5cbmZ1bmN0aW9uIF9yZXNvbHZlUHJvdmlkZXJzKHByb3ZpZGVyczogQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGFbXSwgcHJvdmlkZXJUeXBlOiBQcm92aWRlckFzdFR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBlYWdlcjogYm9vbGVhbiwgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuLCB0YXJnZXRFcnJvcnM6IFBhcnNlRXJyb3JbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFByb3ZpZGVyc0J5VG9rZW46IENvbXBpbGVUb2tlbk1hcDxQcm92aWRlckFzdD4pIHtcbiAgcHJvdmlkZXJzLmZvckVhY2goKHByb3ZpZGVyKSA9PiB7XG4gICAgdmFyIHJlc29sdmVkUHJvdmlkZXIgPSB0YXJnZXRQcm92aWRlcnNCeVRva2VuLmdldChwcm92aWRlci50b2tlbik7XG4gICAgaWYgKGlzUHJlc2VudChyZXNvbHZlZFByb3ZpZGVyKSAmJiByZXNvbHZlZFByb3ZpZGVyLm11bHRpUHJvdmlkZXIgIT09IHByb3ZpZGVyLm11bHRpKSB7XG4gICAgICB0YXJnZXRFcnJvcnMucHVzaChuZXcgUHJvdmlkZXJFcnJvcihcbiAgICAgICAgICBgTWl4aW5nIG11bHRpIGFuZCBub24gbXVsdGkgcHJvdmlkZXIgaXMgbm90IHBvc3NpYmxlIGZvciB0b2tlbiAke3Jlc29sdmVkUHJvdmlkZXIudG9rZW4ubmFtZX1gLFxuICAgICAgICAgIHNvdXJjZVNwYW4pKTtcbiAgICB9XG4gICAgaWYgKGlzQmxhbmsocmVzb2x2ZWRQcm92aWRlcikpIHtcbiAgICAgIHJlc29sdmVkUHJvdmlkZXIgPSBuZXcgUHJvdmlkZXJBc3QocHJvdmlkZXIudG9rZW4sIHByb3ZpZGVyLm11bHRpLCBlYWdlciwgW3Byb3ZpZGVyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJUeXBlLCBzb3VyY2VTcGFuKTtcbiAgICAgIHRhcmdldFByb3ZpZGVyc0J5VG9rZW4uYWRkKHByb3ZpZGVyLnRva2VuLCByZXNvbHZlZFByb3ZpZGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFwcm92aWRlci5tdWx0aSkge1xuICAgICAgICBMaXN0V3JhcHBlci5jbGVhcihyZXNvbHZlZFByb3ZpZGVyLnByb3ZpZGVycyk7XG4gICAgICB9XG4gICAgICByZXNvbHZlZFByb3ZpZGVyLnByb3ZpZGVycy5wdXNoKHByb3ZpZGVyKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbmZ1bmN0aW9uIF9nZXRWaWV3UXVlcmllcyhcbiAgICBjb21wb25lbnQ6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSk6IENvbXBpbGVUb2tlbk1hcDxDb21waWxlUXVlcnlNZXRhZGF0YVtdPiB7XG4gIHZhciB2aWV3UXVlcmllcyA9IG5ldyBDb21waWxlVG9rZW5NYXA8Q29tcGlsZVF1ZXJ5TWV0YWRhdGFbXT4oKTtcbiAgaWYgKGlzUHJlc2VudChjb21wb25lbnQudmlld1F1ZXJpZXMpKSB7XG4gICAgY29tcG9uZW50LnZpZXdRdWVyaWVzLmZvckVhY2goKHF1ZXJ5KSA9PiBfYWRkUXVlcnlUb1Rva2VuTWFwKHZpZXdRdWVyaWVzLCBxdWVyeSkpO1xuICB9XG4gIGNvbXBvbmVudC50eXBlLmRpRGVwcy5mb3JFYWNoKChkZXApID0+IHtcbiAgICBpZiAoaXNQcmVzZW50KGRlcC52aWV3UXVlcnkpKSB7XG4gICAgICBfYWRkUXVlcnlUb1Rva2VuTWFwKHZpZXdRdWVyaWVzLCBkZXAudmlld1F1ZXJ5KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdmlld1F1ZXJpZXM7XG59XG5cbmZ1bmN0aW9uIF9nZXRDb250ZW50UXVlcmllcyhcbiAgICBkaXJlY3RpdmVzOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGFbXSk6IENvbXBpbGVUb2tlbk1hcDxDb21waWxlUXVlcnlNZXRhZGF0YVtdPiB7XG4gIHZhciBjb250ZW50UXVlcmllcyA9IG5ldyBDb21waWxlVG9rZW5NYXA8Q29tcGlsZVF1ZXJ5TWV0YWRhdGFbXT4oKTtcbiAgZGlyZWN0aXZlcy5mb3JFYWNoKGRpcmVjdGl2ZSA9PiB7XG4gICAgaWYgKGlzUHJlc2VudChkaXJlY3RpdmUucXVlcmllcykpIHtcbiAgICAgIGRpcmVjdGl2ZS5xdWVyaWVzLmZvckVhY2goKHF1ZXJ5KSA9PiBfYWRkUXVlcnlUb1Rva2VuTWFwKGNvbnRlbnRRdWVyaWVzLCBxdWVyeSkpO1xuICAgIH1cbiAgICBkaXJlY3RpdmUudHlwZS5kaURlcHMuZm9yRWFjaCgoZGVwKSA9PiB7XG4gICAgICBpZiAoaXNQcmVzZW50KGRlcC5xdWVyeSkpIHtcbiAgICAgICAgX2FkZFF1ZXJ5VG9Ub2tlbk1hcChjb250ZW50UXVlcmllcywgZGVwLnF1ZXJ5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBjb250ZW50UXVlcmllcztcbn1cblxuZnVuY3Rpb24gX2FkZFF1ZXJ5VG9Ub2tlbk1hcChtYXA6IENvbXBpbGVUb2tlbk1hcDxDb21waWxlUXVlcnlNZXRhZGF0YVtdPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnk6IENvbXBpbGVRdWVyeU1ldGFkYXRhKSB7XG4gIHF1ZXJ5LnNlbGVjdG9ycy5mb3JFYWNoKCh0b2tlbjogQ29tcGlsZVRva2VuTWV0YWRhdGEpID0+IHtcbiAgICB2YXIgZW50cnkgPSBtYXAuZ2V0KHRva2VuKTtcbiAgICBpZiAoaXNCbGFuayhlbnRyeSkpIHtcbiAgICAgIGVudHJ5ID0gW107XG4gICAgICBtYXAuYWRkKHRva2VuLCBlbnRyeSk7XG4gICAgfVxuICAgIGVudHJ5LnB1c2gocXVlcnkpO1xuICB9KTtcbn1cbiJdfQ==