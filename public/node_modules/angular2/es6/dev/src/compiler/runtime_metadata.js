var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { resolveForwardRef } from 'angular2/src/core/di';
import { Type, isBlank, isPresent, isArray, stringify, isString } from 'angular2/src/facade/lang';
import { StringMapWrapper } from 'angular2/src/facade/collection';
import { BaseException } from 'angular2/src/facade/exceptions';
import { NoAnnotationError } from 'angular2/src/core/di/reflective_exceptions';
import * as cpl from './compile_metadata';
import * as md from 'angular2/src/core/metadata/directives';
import * as dimd from 'angular2/src/core/metadata/di';
import { DirectiveResolver } from './directive_resolver';
import { PipeResolver } from './pipe_resolver';
import { ViewResolver } from './view_resolver';
import { hasLifecycleHook } from './directive_lifecycle_reflector';
import { LIFECYCLE_HOOKS_VALUES } from 'angular2/src/core/metadata/lifecycle_hooks';
import { reflector } from 'angular2/src/core/reflection/reflection';
import { Injectable, Inject, Optional } from 'angular2/src/core/di';
import { PLATFORM_DIRECTIVES, PLATFORM_PIPES } from 'angular2/src/core/platform_directives_and_pipes';
import { MODULE_SUFFIX, sanitizeIdentifier } from './util';
import { assertArrayOfStrings } from './assertions';
import { getUrlScheme } from 'angular2/src/compiler/url_resolver';
import { Provider } from 'angular2/src/core/di/provider';
import { constructDependencies } from 'angular2/src/core/di/reflective_provider';
import { SelfMetadata, HostMetadata, SkipSelfMetadata } from 'angular2/src/core/di/metadata';
import { AttributeMetadata } from 'angular2/src/core/metadata/di';
import { ReflectorReader } from 'angular2/src/core/reflection/reflector_reader';
export let RuntimeMetadataResolver = class RuntimeMetadataResolver {
    constructor(_directiveResolver, _pipeResolver, _viewResolver, _platformDirectives, _platformPipes, _reflector) {
        this._directiveResolver = _directiveResolver;
        this._pipeResolver = _pipeResolver;
        this._viewResolver = _viewResolver;
        this._platformDirectives = _platformDirectives;
        this._platformPipes = _platformPipes;
        this._directiveCache = new Map();
        this._pipeCache = new Map();
        this._anonymousTypes = new Map();
        this._anonymousTypeIndex = 0;
        if (isPresent(_reflector)) {
            this._reflector = _reflector;
        }
        else {
            this._reflector = reflector;
        }
    }
    sanitizeTokenName(token) {
        let identifier = stringify(token);
        if (identifier.indexOf('(') >= 0) {
            // case: anonymous functions!
            let found = this._anonymousTypes.get(token);
            if (isBlank(found)) {
                this._anonymousTypes.set(token, this._anonymousTypeIndex++);
                found = this._anonymousTypes.get(token);
            }
            identifier = `anonymous_token_${found}_`;
        }
        return sanitizeIdentifier(identifier);
    }
    getDirectiveMetadata(directiveType) {
        var meta = this._directiveCache.get(directiveType);
        if (isBlank(meta)) {
            var dirMeta = this._directiveResolver.resolve(directiveType);
            var moduleUrl = null;
            var templateMeta = null;
            var changeDetectionStrategy = null;
            var viewProviders = [];
            if (dirMeta instanceof md.ComponentMetadata) {
                assertArrayOfStrings('styles', dirMeta.styles);
                var cmpMeta = dirMeta;
                moduleUrl = calcModuleUrl(this._reflector, directiveType, cmpMeta);
                var viewMeta = this._viewResolver.resolve(directiveType);
                assertArrayOfStrings('styles', viewMeta.styles);
                templateMeta = new cpl.CompileTemplateMetadata({
                    encapsulation: viewMeta.encapsulation,
                    template: viewMeta.template,
                    templateUrl: viewMeta.templateUrl,
                    styles: viewMeta.styles,
                    styleUrls: viewMeta.styleUrls
                });
                changeDetectionStrategy = cmpMeta.changeDetection;
                if (isPresent(dirMeta.viewProviders)) {
                    viewProviders = this.getProvidersMetadata(dirMeta.viewProviders);
                }
            }
            var providers = [];
            if (isPresent(dirMeta.providers)) {
                providers = this.getProvidersMetadata(dirMeta.providers);
            }
            var queries = [];
            var viewQueries = [];
            if (isPresent(dirMeta.queries)) {
                queries = this.getQueriesMetadata(dirMeta.queries, false);
                viewQueries = this.getQueriesMetadata(dirMeta.queries, true);
            }
            meta = cpl.CompileDirectiveMetadata.create({
                selector: dirMeta.selector,
                exportAs: dirMeta.exportAs,
                isComponent: isPresent(templateMeta),
                type: this.getTypeMetadata(directiveType, moduleUrl),
                template: templateMeta,
                changeDetection: changeDetectionStrategy,
                inputs: dirMeta.inputs,
                outputs: dirMeta.outputs,
                host: dirMeta.host,
                lifecycleHooks: LIFECYCLE_HOOKS_VALUES.filter(hook => hasLifecycleHook(hook, directiveType)),
                providers: providers,
                viewProviders: viewProviders,
                queries: queries,
                viewQueries: viewQueries
            });
            this._directiveCache.set(directiveType, meta);
        }
        return meta;
    }
    getTypeMetadata(type, moduleUrl) {
        return new cpl.CompileTypeMetadata({
            name: this.sanitizeTokenName(type),
            moduleUrl: moduleUrl,
            runtime: type,
            diDeps: this.getDependenciesMetadata(type, null)
        });
    }
    getFactoryMetadata(factory, moduleUrl) {
        return new cpl.CompileFactoryMetadata({
            name: this.sanitizeTokenName(factory),
            moduleUrl: moduleUrl,
            runtime: factory,
            diDeps: this.getDependenciesMetadata(factory, null)
        });
    }
    getPipeMetadata(pipeType) {
        var meta = this._pipeCache.get(pipeType);
        if (isBlank(meta)) {
            var pipeMeta = this._pipeResolver.resolve(pipeType);
            var moduleUrl = this._reflector.importUri(pipeType);
            meta = new cpl.CompilePipeMetadata({
                type: this.getTypeMetadata(pipeType, moduleUrl),
                name: pipeMeta.name,
                pure: pipeMeta.pure,
                lifecycleHooks: LIFECYCLE_HOOKS_VALUES.filter(hook => hasLifecycleHook(hook, pipeType)),
            });
            this._pipeCache.set(pipeType, meta);
        }
        return meta;
    }
    getViewDirectivesMetadata(component) {
        var view = this._viewResolver.resolve(component);
        var directives = flattenDirectives(view, this._platformDirectives);
        for (var i = 0; i < directives.length; i++) {
            if (!isValidType(directives[i])) {
                throw new BaseException(`Unexpected directive value '${stringify(directives[i])}' on the View of component '${stringify(component)}'`);
            }
        }
        return directives.map(type => this.getDirectiveMetadata(type));
    }
    getViewPipesMetadata(component) {
        var view = this._viewResolver.resolve(component);
        var pipes = flattenPipes(view, this._platformPipes);
        for (var i = 0; i < pipes.length; i++) {
            if (!isValidType(pipes[i])) {
                throw new BaseException(`Unexpected piped value '${stringify(pipes[i])}' on the View of component '${stringify(component)}'`);
            }
        }
        return pipes.map(type => this.getPipeMetadata(type));
    }
    getDependenciesMetadata(typeOrFunc, dependencies) {
        var deps;
        try {
            deps = constructDependencies(typeOrFunc, dependencies);
        }
        catch (e) {
            if (e instanceof NoAnnotationError) {
                deps = [];
            }
            else {
                throw e;
            }
        }
        return deps.map((dep) => {
            var compileToken;
            var p = dep.properties.find(p => p instanceof AttributeMetadata);
            var isAttribute = false;
            if (isPresent(p)) {
                compileToken = this.getTokenMetadata(p.attributeName);
                isAttribute = true;
            }
            else {
                compileToken = this.getTokenMetadata(dep.key.token);
            }
            var compileQuery = null;
            var q = dep.properties.find(p => p instanceof dimd.QueryMetadata);
            if (isPresent(q)) {
                compileQuery = this.getQueryMetadata(q, null);
            }
            return new cpl.CompileDiDependencyMetadata({
                isAttribute: isAttribute,
                isHost: dep.upperBoundVisibility instanceof HostMetadata,
                isSelf: dep.upperBoundVisibility instanceof SelfMetadata,
                isSkipSelf: dep.lowerBoundVisibility instanceof SkipSelfMetadata,
                isOptional: dep.optional,
                query: isPresent(q) && !q.isViewQuery ? compileQuery : null,
                viewQuery: isPresent(q) && q.isViewQuery ? compileQuery : null,
                token: compileToken
            });
        });
    }
    getTokenMetadata(token) {
        token = resolveForwardRef(token);
        var compileToken;
        if (isString(token)) {
            compileToken = new cpl.CompileTokenMetadata({ value: token });
        }
        else {
            compileToken = new cpl.CompileTokenMetadata({
                identifier: new cpl.CompileIdentifierMetadata({ runtime: token, name: this.sanitizeTokenName(token) })
            });
        }
        return compileToken;
    }
    getProvidersMetadata(providers) {
        return providers.map((provider) => {
            provider = resolveForwardRef(provider);
            if (isArray(provider)) {
                return this.getProvidersMetadata(provider);
            }
            else if (provider instanceof Provider) {
                return this.getProviderMetadata(provider);
            }
            else {
                return this.getTypeMetadata(provider, null);
            }
        });
    }
    getProviderMetadata(provider) {
        var compileDeps;
        if (isPresent(provider.useClass)) {
            compileDeps = this.getDependenciesMetadata(provider.useClass, provider.dependencies);
        }
        else if (isPresent(provider.useFactory)) {
            compileDeps = this.getDependenciesMetadata(provider.useFactory, provider.dependencies);
        }
        return new cpl.CompileProviderMetadata({
            token: this.getTokenMetadata(provider.token),
            useClass: isPresent(provider.useClass) ? this.getTypeMetadata(provider.useClass, null) : null,
            useValue: isPresent(provider.useValue) ?
                new cpl.CompileIdentifierMetadata({ runtime: provider.useValue }) :
                null,
            useFactory: isPresent(provider.useFactory) ?
                this.getFactoryMetadata(provider.useFactory, null) :
                null,
            useExisting: isPresent(provider.useExisting) ? this.getTokenMetadata(provider.useExisting) :
                null,
            deps: compileDeps,
            multi: provider.multi
        });
    }
    getQueriesMetadata(queries, isViewQuery) {
        var compileQueries = [];
        StringMapWrapper.forEach(queries, (query, propertyName) => {
            if (query.isViewQuery === isViewQuery) {
                compileQueries.push(this.getQueryMetadata(query, propertyName));
            }
        });
        return compileQueries;
    }
    getQueryMetadata(q, propertyName) {
        var selectors;
        if (q.isVarBindingQuery) {
            selectors = q.varBindings.map(varName => this.getTokenMetadata(varName));
        }
        else {
            selectors = [this.getTokenMetadata(q.selector)];
        }
        return new cpl.CompileQueryMetadata({
            selectors: selectors,
            first: q.first,
            descendants: q.descendants,
            propertyName: propertyName,
            read: isPresent(q.read) ? this.getTokenMetadata(q.read) : null
        });
    }
};
RuntimeMetadataResolver = __decorate([
    Injectable(),
    __param(3, Optional()),
    __param(3, Inject(PLATFORM_DIRECTIVES)),
    __param(4, Optional()),
    __param(4, Inject(PLATFORM_PIPES)), 
    __metadata('design:paramtypes', [DirectiveResolver, PipeResolver, ViewResolver, Array, Array, ReflectorReader])
], RuntimeMetadataResolver);
function flattenDirectives(view, platformDirectives) {
    let directives = [];
    if (isPresent(platformDirectives)) {
        flattenArray(platformDirectives, directives);
    }
    if (isPresent(view.directives)) {
        flattenArray(view.directives, directives);
    }
    return directives;
}
function flattenPipes(view, platformPipes) {
    let pipes = [];
    if (isPresent(platformPipes)) {
        flattenArray(platformPipes, pipes);
    }
    if (isPresent(view.pipes)) {
        flattenArray(view.pipes, pipes);
    }
    return pipes;
}
function flattenArray(tree, out) {
    for (var i = 0; i < tree.length; i++) {
        var item = resolveForwardRef(tree[i]);
        if (isArray(item)) {
            flattenArray(item, out);
        }
        else {
            out.push(item);
        }
    }
}
function isValidType(value) {
    return isPresent(value) && (value instanceof Type);
}
function calcModuleUrl(reflector, type, cmpMetadata) {
    var moduleId = cmpMetadata.moduleId;
    if (isPresent(moduleId)) {
        var scheme = getUrlScheme(moduleId);
        return isPresent(scheme) && scheme.length > 0 ? moduleId :
            `package:${moduleId}${MODULE_SUFFIX}`;
    }
    else {
        return reflector.importUri(type);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZV9tZXRhZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUQxaUdRVkcudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9ydW50aW1lX21ldGFkYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxzQkFBc0I7T0FDL0MsRUFDTCxJQUFJLEVBQ0osT0FBTyxFQUNQLFNBQVMsRUFDVCxPQUFPLEVBQ1AsU0FBUyxFQUNULFFBQVEsRUFHVCxNQUFNLDBCQUEwQjtPQUMxQixFQUFDLGdCQUFnQixFQUFDLE1BQU0sZ0NBQWdDO09BQ3hELEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0NBQWdDO09BQ3JELEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw0Q0FBNEM7T0FDckUsS0FBSyxHQUFHLE1BQU0sb0JBQW9CO09BQ2xDLEtBQUssRUFBRSxNQUFNLHVDQUF1QztPQUNwRCxLQUFLLElBQUksTUFBTSwrQkFBK0I7T0FDOUMsRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHNCQUFzQjtPQUMvQyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQjtPQUNyQyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQjtPQUVyQyxFQUFDLGdCQUFnQixFQUFDLE1BQU0saUNBQWlDO09BQ3pELEVBQWlCLHNCQUFzQixFQUFDLE1BQU0sNENBQTRDO09BQzFGLEVBQUMsU0FBUyxFQUFDLE1BQU0seUNBQXlDO09BQzFELEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUMsTUFBTSxzQkFBc0I7T0FDMUQsRUFBQyxtQkFBbUIsRUFBRSxjQUFjLEVBQUMsTUFBTSxpREFBaUQ7T0FDNUYsRUFBQyxhQUFhLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxRQUFRO09BQ2pELEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxjQUFjO09BQzFDLEVBQUMsWUFBWSxFQUFD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O0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7cmVzb2x2ZUZvcndhcmRSZWZ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7XG4gIFR5cGUsXG4gIGlzQmxhbmssXG4gIGlzUHJlc2VudCxcbiAgaXNBcnJheSxcbiAgc3RyaW5naWZ5LFxuICBpc1N0cmluZyxcbiAgUmVnRXhwV3JhcHBlcixcbiAgU3RyaW5nV3JhcHBlclxufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtTdHJpbmdNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtOb0Fubm90YXRpb25FcnJvcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGkvcmVmbGVjdGl2ZV9leGNlcHRpb25zJztcbmltcG9ydCAqIGFzIGNwbCBmcm9tICcuL2NvbXBpbGVfbWV0YWRhdGEnO1xuaW1wb3J0ICogYXMgbWQgZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbWV0YWRhdGEvZGlyZWN0aXZlcyc7XG5pbXBvcnQgKiBhcyBkaW1kIGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL21ldGFkYXRhL2RpJztcbmltcG9ydCB7RGlyZWN0aXZlUmVzb2x2ZXJ9IGZyb20gJy4vZGlyZWN0aXZlX3Jlc29sdmVyJztcbmltcG9ydCB7UGlwZVJlc29sdmVyfSBmcm9tICcuL3BpcGVfcmVzb2x2ZXInO1xuaW1wb3J0IHtWaWV3UmVzb2x2ZXJ9IGZyb20gJy4vdmlld19yZXNvbHZlcic7XG5pbXBvcnQge1ZpZXdNZXRhZGF0YX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbWV0YWRhdGEvdmlldyc7XG5pbXBvcnQge2hhc0xpZmVjeWNsZUhvb2t9IGZyb20gJy4vZGlyZWN0aXZlX2xpZmVjeWNsZV9yZWZsZWN0b3InO1xuaW1wb3J0IHtMaWZlY3ljbGVIb29rcywgTElGRUNZQ0xFX0hPT0tTX1ZBTFVFU30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbWV0YWRhdGEvbGlmZWN5Y2xlX2hvb2tzJztcbmltcG9ydCB7cmVmbGVjdG9yfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9yZWZsZWN0aW9uL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtJbmplY3RhYmxlLCBJbmplY3QsIE9wdGlvbmFsfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge1BMQVRGT1JNX0RJUkVDVElWRVMsIFBMQVRGT1JNX1BJUEVTfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9wbGF0Zm9ybV9kaXJlY3RpdmVzX2FuZF9waXBlcyc7XG5pbXBvcnQge01PRFVMRV9TVUZGSVgsIHNhbml0aXplSWRlbnRpZmllcn0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7YXNzZXJ0QXJyYXlPZlN0cmluZ3N9IGZyb20gJy4vYXNzZXJ0aW9ucyc7XG5pbXBvcnQge2dldFVybFNjaGVtZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3VybF9yZXNvbHZlcic7XG5pbXBvcnQge1Byb3ZpZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaS9wcm92aWRlcic7XG5pbXBvcnQge1xuICBjb25zdHJ1Y3REZXBlbmRlbmNpZXMsXG4gIFJlZmxlY3RpdmVEZXBlbmRlbmN5XG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpL3JlZmxlY3RpdmVfcHJvdmlkZXInO1xuaW1wb3J0IHtcbiAgT3B0aW9uYWxNZXRhZGF0YSxcbiAgU2VsZk1ldGFkYXRhLFxuICBIb3N0TWV0YWRhdGEsXG4gIFNraXBTZWxmTWV0YWRhdGFcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGkvbWV0YWRhdGEnO1xuaW1wb3J0IHtBdHRyaWJ1dGVNZXRhZGF0YX0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbWV0YWRhdGEvZGknO1xuaW1wb3J0IHtSZWZsZWN0b3JSZWFkZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlZmxlY3Rpb24vcmVmbGVjdG9yX3JlYWRlcic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBSdW50aW1lTWV0YWRhdGFSZXNvbHZlciB7XG4gIHByaXZhdGUgX2RpcmVjdGl2ZUNhY2hlID0gbmV3IE1hcDxUeXBlLCBjcGwuQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhPigpO1xuICBwcml2YXRlIF9waXBlQ2FjaGUgPSBuZXcgTWFwPFR5cGUsIGNwbC5Db21waWxlUGlwZU1ldGFkYXRhPigpO1xuICBwcml2YXRlIF9hbm9ueW1vdXNUeXBlcyA9IG5ldyBNYXA8T2JqZWN0LCBudW1iZXI+KCk7XG4gIHByaXZhdGUgX2Fub255bW91c1R5cGVJbmRleCA9IDA7XG4gIHByaXZhdGUgX3JlZmxlY3RvcjogUmVmbGVjdG9yUmVhZGVyO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RpcmVjdGl2ZVJlc29sdmVyOiBEaXJlY3RpdmVSZXNvbHZlciwgcHJpdmF0ZSBfcGlwZVJlc29sdmVyOiBQaXBlUmVzb2x2ZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3ZpZXdSZXNvbHZlcjogVmlld1Jlc29sdmVyLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KFBMQVRGT1JNX0RJUkVDVElWRVMpIHByaXZhdGUgX3BsYXRmb3JtRGlyZWN0aXZlczogVHlwZVtdLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KFBMQVRGT1JNX1BJUEVTKSBwcml2YXRlIF9wbGF0Zm9ybVBpcGVzOiBUeXBlW10sXG4gICAgICAgICAgICAgIF9yZWZsZWN0b3I/OiBSZWZsZWN0b3JSZWFkZXIpIHtcbiAgICBpZiAoaXNQcmVzZW50KF9yZWZsZWN0b3IpKSB7XG4gICAgICB0aGlzLl9yZWZsZWN0b3IgPSBfcmVmbGVjdG9yO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZWZsZWN0b3IgPSByZWZsZWN0b3I7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzYW5pdGl6ZVRva2VuTmFtZSh0b2tlbjogYW55KTogc3RyaW5nIHtcbiAgICBsZXQgaWRlbnRpZmllciA9IHN0cmluZ2lmeSh0b2tlbik7XG4gICAgaWYgKGlkZW50aWZpZXIuaW5kZXhPZignKCcpID49IDApIHtcbiAgICAgIC8vIGNhc2U6IGFub255bW91cyBmdW5jdGlvbnMhXG4gICAgICBsZXQgZm91bmQgPSB0aGlzLl9hbm9ueW1vdXNUeXBlcy5nZXQodG9rZW4pO1xuICAgICAgaWYgKGlzQmxhbmsoZm91bmQpKSB7XG4gICAgICAgIHRoaXMuX2Fub255bW91c1R5cGVzLnNldCh0b2tlbiwgdGhpcy5fYW5vbnltb3VzVHlwZUluZGV4KyspO1xuICAgICAgICBmb3VuZCA9IHRoaXMuX2Fub255bW91c1R5cGVzLmdldCh0b2tlbik7XG4gICAgICB9XG4gICAgICBpZGVudGlmaWVyID0gYGFub255bW91c190b2tlbl8ke2ZvdW5kfV9gO1xuICAgIH1cbiAgICByZXR1cm4gc2FuaXRpemVJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICB9XG5cbiAgZ2V0RGlyZWN0aXZlTWV0YWRhdGEoZGlyZWN0aXZlVHlwZTogVHlwZSk6IGNwbC5Db21waWxlRGlyZWN0aXZlTWV0YWRhdGEge1xuICAgIHZhciBtZXRhID0gdGhpcy5fZGlyZWN0aXZlQ2FjaGUuZ2V0KGRpcmVjdGl2ZVR5cGUpO1xuICAgIGlmIChpc0JsYW5rKG1ldGEpKSB7XG4gICAgICB2YXIgZGlyTWV0YSA9IHRoaXMuX2RpcmVjdGl2ZVJlc29sdmVyLnJlc29sdmUoZGlyZWN0aXZlVHlwZSk7XG4gICAgICB2YXIgbW9kdWxlVXJsID0gbnVsbDtcbiAgICAgIHZhciB0ZW1wbGF0ZU1ldGEgPSBudWxsO1xuICAgICAgdmFyIGNoYW5nZURldGVjdGlvblN0cmF0ZWd5ID0gbnVsbDtcbiAgICAgIHZhciB2aWV3UHJvdmlkZXJzID0gW107XG5cbiAgICAgIGlmIChkaXJNZXRhIGluc3RhbmNlb2YgbWQuQ29tcG9uZW50TWV0YWRhdGEpIHtcbiAgICAgICAgYXNzZXJ0QXJyYXlPZlN0cmluZ3MoJ3N0eWxlcycsIGRpck1ldGEuc3R5bGVzKTtcbiAgICAgICAgdmFyIGNtcE1ldGEgPSA8bWQuQ29tcG9uZW50TWV0YWRhdGE+ZGlyTWV0YTtcbiAgICAgICAgbW9kdWxlVXJsID0gY2FsY01vZHVsZVVybCh0aGlzLl9yZWZsZWN0b3IsIGRpcmVjdGl2ZVR5cGUsIGNtcE1ldGEpO1xuICAgICAgICB2YXIgdmlld01ldGEgPSB0aGlzLl92aWV3UmVzb2x2ZXIucmVzb2x2ZShkaXJlY3RpdmVUeXBlKTtcbiAgICAgICAgYXNzZXJ0QXJyYXlPZlN0cmluZ3MoJ3N0eWxlcycsIHZpZXdNZXRhLnN0eWxlcyk7XG4gICAgICAgIHRlbXBsYXRlTWV0YSA9IG5ldyBjcGwuQ29tcGlsZVRlbXBsYXRlTWV0YWRhdGEoe1xuICAgICAgICAgIGVuY2Fwc3VsYXRpb246IHZpZXdNZXRhLmVuY2Fwc3VsYXRpb24sXG4gICAgICAgICAgdGVtcGxhdGU6IHZpZXdNZXRhLnRlbXBsYXRlLFxuICAgICAgICAgIHRlbXBsYXRlVXJsOiB2aWV3TWV0YS50ZW1wbGF0ZVVybCxcbiAgICAgICAgICBzdHlsZXM6IHZpZXdNZXRhLnN0eWxlcyxcbiAgICAgICAgICBzdHlsZVVybHM6IHZpZXdNZXRhLnN0eWxlVXJsc1xuICAgICAgICB9KTtcbiAgICAgICAgY2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgPSBjbXBNZXRhLmNoYW5nZURldGVjdGlvbjtcbiAgICAgICAgaWYgKGlzUHJlc2VudChkaXJNZXRhLnZpZXdQcm92aWRlcnMpKSB7XG4gICAgICAgICAgdmlld1Byb3ZpZGVycyA9IHRoaXMuZ2V0UHJvdmlkZXJzTWV0YWRhdGEoZGlyTWV0YS52aWV3UHJvdmlkZXJzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgcHJvdmlkZXJzID0gW107XG4gICAgICBpZiAoaXNQcmVzZW50KGRpck1ldGEucHJvdmlkZXJzKSkge1xuICAgICAgICBwcm92aWRlcnMgPSB0aGlzLmdldFByb3ZpZGVyc01ldGFkYXRhKGRpck1ldGEucHJvdmlkZXJzKTtcbiAgICAgIH1cbiAgICAgIHZhciBxdWVyaWVzID0gW107XG4gICAgICB2YXIgdmlld1F1ZXJpZXMgPSBbXTtcbiAgICAgIGlmIChpc1ByZXNlbnQoZGlyTWV0YS5xdWVyaWVzKSkge1xuICAgICAgICBxdWVyaWVzID0gdGhpcy5nZXRRdWVyaWVzTWV0YWRhdGEoZGlyTWV0YS5xdWVyaWVzLCBmYWxzZSk7XG4gICAgICAgIHZpZXdRdWVyaWVzID0gdGhpcy5nZXRRdWVyaWVzTWV0YWRhdGEoZGlyTWV0YS5xdWVyaWVzLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIG1ldGEgPSBjcGwuQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLmNyZWF0ZSh7XG4gICAgICAgIHNlbGVjdG9yOiBkaXJNZXRhLnNlbGVjdG9yLFxuICAgICAgICBleHBvcnRBczogZGlyTWV0YS5leHBvcnRBcyxcbiAgICAgICAgaXNDb21wb25lbnQ6IGlzUHJlc2VudCh0ZW1wbGF0ZU1ldGEpLFxuICAgICAgICB0eXBlOiB0aGlzLmdldFR5cGVNZXRhZGF0YShkaXJlY3RpdmVUeXBlLCBtb2R1bGVVcmwpLFxuICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVNZXRhLFxuICAgICAgICBjaGFuZ2VEZXRlY3Rpb246IGNoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgICAgICBpbnB1dHM6IGRpck1ldGEuaW5wdXRzLFxuICAgICAgICBvdXRwdXRzOiBkaXJNZXRhLm91dHB1dHMsXG4gICAgICAgIGhvc3Q6IGRpck1ldGEuaG9zdCxcbiAgICAgICAgbGlmZWN5Y2xlSG9va3M6XG4gICAgICAgICAgICBMSUZFQ1lDTEVfSE9PS1NfVkFMVUVTLmZpbHRlcihob29rID0+IGhhc0xpZmVjeWNsZUhvb2soaG9vaywgZGlyZWN0aXZlVHlwZSkpLFxuICAgICAgICBwcm92aWRlcnM6IHByb3ZpZGVycyxcbiAgICAgICAgdmlld1Byb3ZpZGVyczogdmlld1Byb3ZpZGVycyxcbiAgICAgICAgcXVlcmllczogcXVlcmllcyxcbiAgICAgICAgdmlld1F1ZXJpZXM6IHZpZXdRdWVyaWVzXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2RpcmVjdGl2ZUNhY2hlLnNldChkaXJlY3RpdmVUeXBlLCBtZXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGE7XG4gIH1cblxuICBnZXRUeXBlTWV0YWRhdGEodHlwZTogVHlwZSwgbW9kdWxlVXJsOiBzdHJpbmcpOiBjcGwuQ29tcGlsZVR5cGVNZXRhZGF0YSB7XG4gICAgcmV0dXJuIG5ldyBjcGwuQ29tcGlsZVR5cGVNZXRhZGF0YSh7XG4gICAgICBuYW1lOiB0aGlzLnNhbml0aXplVG9rZW5OYW1lKHR5cGUpLFxuICAgICAgbW9kdWxlVXJsOiBtb2R1bGVVcmwsXG4gICAgICBydW50aW1lOiB0eXBlLFxuICAgICAgZGlEZXBzOiB0aGlzLmdldERlcGVuZGVuY2llc01ldGFkYXRhKHR5cGUsIG51bGwpXG4gICAgfSk7XG4gIH1cblxuICBnZXRGYWN0b3J5TWV0YWRhdGEoZmFjdG9yeTogRnVuY3Rpb24sIG1vZHVsZVVybDogc3RyaW5nKTogY3BsLkNvbXBpbGVGYWN0b3J5TWV0YWRhdGEge1xuICAgIHJldHVybiBuZXcgY3BsLkNvbXBpbGVGYWN0b3J5TWV0YWRhdGEoe1xuICAgICAgbmFtZTogdGhpcy5zYW5pdGl6ZVRva2VuTmFtZShmYWN0b3J5KSxcbiAgICAgIG1vZHVsZVVybDogbW9kdWxlVXJsLFxuICAgICAgcnVudGltZTogZmFjdG9yeSxcbiAgICAgIGRpRGVwczogdGhpcy5nZXREZXBlbmRlbmNpZXNNZXRhZGF0YShmYWN0b3J5LCBudWxsKVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0UGlwZU1ldGFkYXRhKHBpcGVUeXBlOiBUeXBlKTogY3BsLkNvbXBpbGVQaXBlTWV0YWRhdGEge1xuICAgIHZhciBtZXRhID0gdGhpcy5fcGlwZUNhY2hlLmdldChwaXBlVHlwZSk7XG4gICAgaWYgKGlzQmxhbmsobWV0YSkpIHtcbiAgICAgIHZhciBwaXBlTWV0YSA9IHRoaXMuX3BpcGVSZXNvbHZlci5yZXNvbHZlKHBpcGVUeXBlKTtcbiAgICAgIHZhciBtb2R1bGVVcmwgPSB0aGlzLl9yZWZsZWN0b3IuaW1wb3J0VXJpKHBpcGVUeXBlKTtcbiAgICAgIG1ldGEgPSBuZXcgY3BsLkNvbXBpbGVQaXBlTWV0YWRhdGEoe1xuICAgICAgICB0eXBlOiB0aGlzLmdldFR5cGVNZXRhZGF0YShwaXBlVHlwZSwgbW9kdWxlVXJsKSxcbiAgICAgICAgbmFtZTogcGlwZU1ldGEubmFtZSxcbiAgICAgICAgcHVyZTogcGlwZU1ldGEucHVyZSxcbiAgICAgICAgbGlmZWN5Y2xlSG9va3M6IExJRkVDWUNMRV9IT09LU19WQUxVRVMuZmlsdGVyKGhvb2sgPT4gaGFzTGlmZWN5Y2xlSG9vayhob29rLCBwaXBlVHlwZSkpLFxuICAgICAgfSk7XG4gICAgICB0aGlzLl9waXBlQ2FjaGUuc2V0KHBpcGVUeXBlLCBtZXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGE7XG4gIH1cblxuICBnZXRWaWV3RGlyZWN0aXZlc01ldGFkYXRhKGNvbXBvbmVudDogVHlwZSk6IGNwbC5Db21waWxlRGlyZWN0aXZlTWV0YWRhdGFbXSB7XG4gICAgdmFyIHZpZXcgPSB0aGlzLl92aWV3UmVzb2x2ZXIucmVzb2x2ZShjb21wb25lbnQpO1xuICAgIHZhciBkaXJlY3RpdmVzID0gZmxhdHRlbkRpcmVjdGl2ZXModmlldywgdGhpcy5fcGxhdGZvcm1EaXJlY3RpdmVzKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpcmVjdGl2ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghaXNWYWxpZFR5cGUoZGlyZWN0aXZlc1tpXSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXG4gICAgICAgICAgICBgVW5leHBlY3RlZCBkaXJlY3RpdmUgdmFsdWUgJyR7c3RyaW5naWZ5KGRpcmVjdGl2ZXNbaV0pfScgb24gdGhlIFZpZXcgb2YgY29tcG9uZW50ICcke3N0cmluZ2lmeShjb21wb25lbnQpfSdgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGlyZWN0aXZlcy5tYXAodHlwZSA9PiB0aGlzLmdldERpcmVjdGl2ZU1ldGFkYXRhKHR5cGUpKTtcbiAgfVxuXG4gIGdldFZpZXdQaXBlc01ldGFkYXRhKGNvbXBvbmVudDogVHlwZSk6IGNwbC5Db21waWxlUGlwZU1ldGFkYXRhW10ge1xuICAgIHZhciB2aWV3ID0gdGhpcy5fdmlld1Jlc29sdmVyLnJlc29sdmUoY29tcG9uZW50KTtcbiAgICB2YXIgcGlwZXMgPSBmbGF0dGVuUGlwZXModmlldywgdGhpcy5fcGxhdGZvcm1QaXBlcyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwaXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFpc1ZhbGlkVHlwZShwaXBlc1tpXSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXG4gICAgICAgICAgICBgVW5leHBlY3RlZCBwaXBlZCB2YWx1ZSAnJHtzdHJpbmdpZnkocGlwZXNbaV0pfScgb24gdGhlIFZpZXcgb2YgY29tcG9uZW50ICcke3N0cmluZ2lmeShjb21wb25lbnQpfSdgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBpcGVzLm1hcCh0eXBlID0+IHRoaXMuZ2V0UGlwZU1ldGFkYXRhKHR5cGUpKTtcbiAgfVxuXG4gIGdldERlcGVuZGVuY2llc01ldGFkYXRhKHR5cGVPckZ1bmM6IFR5cGUgfCBGdW5jdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzOiBhbnlbXSk6IGNwbC5Db21waWxlRGlEZXBlbmRlbmN5TWV0YWRhdGFbXSB7XG4gICAgdmFyIGRlcHM6IFJlZmxlY3RpdmVEZXBlbmRlbmN5W107XG4gICAgdHJ5IHtcbiAgICAgIGRlcHMgPSBjb25zdHJ1Y3REZXBlbmRlbmNpZXModHlwZU9yRnVuYywgZGVwZW5kZW5jaWVzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIE5vQW5ub3RhdGlvbkVycm9yKSB7XG4gICAgICAgIGRlcHMgPSBbXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZXBzLm1hcCgoZGVwKSA9PiB7XG4gICAgICB2YXIgY29tcGlsZVRva2VuO1xuICAgICAgdmFyIHAgPSA8QXR0cmlidXRlTWV0YWRhdGE+ZGVwLnByb3BlcnRpZXMuZmluZChwID0+IHAgaW5zdGFuY2VvZiBBdHRyaWJ1dGVNZXRhZGF0YSk7XG4gICAgICB2YXIgaXNBdHRyaWJ1dGUgPSBmYWxzZTtcbiAgICAgIGlmIChpc1ByZXNlbnQocCkpIHtcbiAgICAgICAgY29tcGlsZVRva2VuID0gdGhpcy5nZXRUb2tlbk1ldGFkYXRhKHAuYXR0cmlidXRlTmFtZSk7XG4gICAgICAgIGlzQXR0cmlidXRlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBpbGVUb2tlbiA9IHRoaXMuZ2V0VG9rZW5NZXRhZGF0YShkZXAua2V5LnRva2VuKTtcbiAgICAgIH1cbiAgICAgIHZhciBjb21waWxlUXVlcnkgPSBudWxsO1xuICAgICAgdmFyIHEgPSA8ZGltZC5RdWVyeU1ldGFkYXRhPmRlcC5wcm9wZXJ0aWVzLmZpbmQocCA9PiBwIGluc3RhbmNlb2YgZGltZC5RdWVyeU1ldGFkYXRhKTtcbiAgICAgIGlmIChpc1ByZXNlbnQocSkpIHtcbiAgICAgICAgY29tcGlsZVF1ZXJ5ID0gdGhpcy5nZXRRdWVyeU1ldGFkYXRhKHEsIG51bGwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBjcGwuQ29tcGlsZURpRGVwZW5kZW5jeU1ldGFkYXRhKHtcbiAgICAgICAgaXNBdHRyaWJ1dGU6IGlzQXR0cmlidXRlLFxuICAgICAgICBpc0hvc3Q6IGRlcC51cHBlckJvdW5kVmlzaWJpbGl0eSBpbnN0YW5jZW9mIEhvc3RNZXRhZGF0YSxcbiAgICAgICAgaXNTZWxmOiBkZXAudXBwZXJCb3VuZFZpc2liaWxpdHkgaW5zdGFuY2VvZiBTZWxmTWV0YWRhdGEsXG4gICAgICAgIGlzU2tpcFNlbGY6IGRlcC5sb3dlckJvdW5kVmlzaWJpbGl0eSBpbnN0YW5jZW9mIFNraXBTZWxmTWV0YWRhdGEsXG4gICAgICAgIGlzT3B0aW9uYWw6IGRlcC5vcHRpb25hbCxcbiAgICAgICAgcXVlcnk6IGlzUHJlc2VudChxKSAmJiAhcS5pc1ZpZXdRdWVyeSA/IGNvbXBpbGVRdWVyeSA6IG51bGwsXG4gICAgICAgIHZpZXdRdWVyeTogaXNQcmVzZW50KHEpICYmIHEuaXNWaWV3UXVlcnkgPyBjb21waWxlUXVlcnkgOiBudWxsLFxuICAgICAgICB0b2tlbjogY29tcGlsZVRva2VuXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFRva2VuTWV0YWRhdGEodG9rZW46IGFueSk6IGNwbC5Db21waWxlVG9rZW5NZXRhZGF0YSB7XG4gICAgdG9rZW4gPSByZXNvbHZlRm9yd2FyZFJlZih0b2tlbik7XG4gICAgdmFyIGNvbXBpbGVUb2tlbjtcbiAgICBpZiAoaXNTdHJpbmcodG9rZW4pKSB7XG4gICAgICBjb21waWxlVG9rZW4gPSBuZXcgY3BsLkNvbXBpbGVUb2tlbk1ldGFkYXRhKHt2YWx1ZTogdG9rZW59KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29tcGlsZVRva2VuID0gbmV3IGNwbC5Db21waWxlVG9rZW5NZXRhZGF0YSh7XG4gICAgICAgIGlkZW50aWZpZXI6IG5ldyBjcGwuQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YShcbiAgICAgICAgICAgIHtydW50aW1lOiB0b2tlbiwgbmFtZTogdGhpcy5zYW5pdGl6ZVRva2VuTmFtZSh0b2tlbil9KVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBjb21waWxlVG9rZW47XG4gIH1cblxuICBnZXRQcm92aWRlcnNNZXRhZGF0YShwcm92aWRlcnM6IGFueVtdKTpcbiAgICAgIEFycmF5PGNwbC5Db21waWxlUHJvdmlkZXJNZXRhZGF0YSB8IGNwbC5Db21waWxlVHlwZU1ldGFkYXRhIHwgYW55W10+IHtcbiAgICByZXR1cm4gcHJvdmlkZXJzLm1hcCgocHJvdmlkZXIpID0+IHtcbiAgICAgIHByb3ZpZGVyID0gcmVzb2x2ZUZvcndhcmRSZWYocHJvdmlkZXIpO1xuICAgICAgaWYgKGlzQXJyYXkocHJvdmlkZXIpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFByb3ZpZGVyc01ldGFkYXRhKHByb3ZpZGVyKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvdmlkZXIgaW5zdGFuY2VvZiBQcm92aWRlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRQcm92aWRlck1ldGFkYXRhKHByb3ZpZGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFR5cGVNZXRhZGF0YShwcm92aWRlciwgbnVsbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRQcm92aWRlck1ldGFkYXRhKHByb3ZpZGVyOiBQcm92aWRlcik6IGNwbC5Db21waWxlUHJvdmlkZXJNZXRhZGF0YSB7XG4gICAgdmFyIGNvbXBpbGVEZXBzO1xuICAgIGlmIChpc1ByZXNlbnQocHJvdmlkZXIudXNlQ2xhc3MpKSB7XG4gICAgICBjb21waWxlRGVwcyA9IHRoaXMuZ2V0RGVwZW5kZW5jaWVzTWV0YWRhdGEocHJvdmlkZXIudXNlQ2xhc3MsIHByb3ZpZGVyLmRlcGVuZGVuY2llcyk7XG4gICAgfSBlbHNlIGlmIChpc1ByZXNlbnQocHJvdmlkZXIudXNlRmFjdG9yeSkpIHtcbiAgICAgIGNvbXBpbGVEZXBzID0gdGhpcy5nZXREZXBlbmRlbmNpZXNNZXRhZGF0YShwcm92aWRlci51c2VGYWN0b3J5LCBwcm92aWRlci5kZXBlbmRlbmNpZXMpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IGNwbC5Db21waWxlUHJvdmlkZXJNZXRhZGF0YSh7XG4gICAgICB0b2tlbjogdGhpcy5nZXRUb2tlbk1ldGFkYXRhKHByb3ZpZGVyLnRva2VuKSxcbiAgICAgIHVzZUNsYXNzOiBpc1ByZXNlbnQocHJvdmlkZXIudXNlQ2xhc3MpID8gdGhpcy5nZXRUeXBlTWV0YWRhdGEocHJvdmlkZXIudXNlQ2xhc3MsIG51bGwpIDogbnVsbCxcbiAgICAgIHVzZVZhbHVlOiBpc1ByZXNlbnQocHJvdmlkZXIudXNlVmFsdWUpID9cbiAgICAgICAgICAgICAgICAgICAgbmV3IGNwbC5Db21waWxlSWRlbnRpZmllck1ldGFkYXRhKHtydW50aW1lOiBwcm92aWRlci51c2VWYWx1ZX0pIDpcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgIHVzZUZhY3Rvcnk6IGlzUHJlc2VudChwcm92aWRlci51c2VGYWN0b3J5KSA/XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRGYWN0b3J5TWV0YWRhdGEocHJvdmlkZXIudXNlRmFjdG9yeSwgbnVsbCkgOlxuICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICB1c2VFeGlzdGluZzogaXNQcmVzZW50KHByb3ZpZGVyLnVzZUV4aXN0aW5nKSA/IHRoaXMuZ2V0VG9rZW5NZXRhZGF0YShwcm92aWRlci51c2VFeGlzdGluZykgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgZGVwczogY29tcGlsZURlcHMsXG4gICAgICBtdWx0aTogcHJvdmlkZXIubXVsdGlcbiAgICB9KTtcbiAgfVxuXG4gIGdldFF1ZXJpZXNNZXRhZGF0YShxdWVyaWVzOiB7W2tleTogc3RyaW5nXTogZGltZC5RdWVyeU1ldGFkYXRhfSxcbiAgICAgICAgICAgICAgICAgICAgIGlzVmlld1F1ZXJ5OiBib29sZWFuKTogY3BsLkNvbXBpbGVRdWVyeU1ldGFkYXRhW10ge1xuICAgIHZhciBjb21waWxlUXVlcmllcyA9IFtdO1xuICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChxdWVyaWVzLCAocXVlcnksIHByb3BlcnR5TmFtZSkgPT4ge1xuICAgICAgaWYgKHF1ZXJ5LmlzVmlld1F1ZXJ5ID09PSBpc1ZpZXdRdWVyeSkge1xuICAgICAgICBjb21waWxlUXVlcmllcy5wdXNoKHRoaXMuZ2V0UXVlcnlNZXRhZGF0YShxdWVyeSwgcHJvcGVydHlOYW1lKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbXBpbGVRdWVyaWVzO1xuICB9XG5cbiAgZ2V0UXVlcnlNZXRhZGF0YShxOiBkaW1kLlF1ZXJ5TWV0YWRhdGEsIHByb3BlcnR5TmFtZTogc3RyaW5nKTogY3BsLkNvbXBpbGVRdWVyeU1ldGFkYXRhIHtcbiAgICB2YXIgc2VsZWN0b3JzO1xuICAgIGlmIChxLmlzVmFyQmluZGluZ1F1ZXJ5KSB7XG4gICAgICBzZWxlY3RvcnMgPSBxLnZhckJpbmRpbmdzLm1hcCh2YXJOYW1lID0+IHRoaXMuZ2V0VG9rZW5NZXRhZGF0YSh2YXJOYW1lKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdG9ycyA9IFt0aGlzLmdldFRva2VuTWV0YWRhdGEocS5zZWxlY3RvcildO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IGNwbC5Db21waWxlUXVlcnlNZXRhZGF0YSh7XG4gICAgICBzZWxlY3RvcnM6IHNlbGVjdG9ycyxcbiAgICAgIGZpcnN0OiBxLmZpcnN0LFxuICAgICAgZGVzY2VuZGFudHM6IHEuZGVzY2VuZGFudHMsXG4gICAgICBwcm9wZXJ0eU5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgIHJlYWQ6IGlzUHJlc2VudChxLnJlYWQpID8gdGhpcy5nZXRUb2tlbk1ldGFkYXRhKHEucmVhZCkgOiBudWxsXG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmxhdHRlbkRpcmVjdGl2ZXModmlldzogVmlld01ldGFkYXRhLCBwbGF0Zm9ybURpcmVjdGl2ZXM6IGFueVtdKTogVHlwZVtdIHtcbiAgbGV0IGRpcmVjdGl2ZXMgPSBbXTtcbiAgaWYgKGlzUHJlc2VudChwbGF0Zm9ybURpcmVjdGl2ZXMpKSB7XG4gICAgZmxhdHRlbkFycmF5KHBsYXRmb3JtRGlyZWN0aXZlcywgZGlyZWN0aXZlcyk7XG4gIH1cbiAgaWYgKGlzUHJlc2VudCh2aWV3LmRpcmVjdGl2ZXMpKSB7XG4gICAgZmxhdHRlbkFycmF5KHZpZXcuZGlyZWN0aXZlcywgZGlyZWN0aXZlcyk7XG4gIH1cbiAgcmV0dXJuIGRpcmVjdGl2ZXM7XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW5QaXBlcyh2aWV3OiBWaWV3TWV0YWRhdGEsIHBsYXRmb3JtUGlwZXM6IGFueVtdKTogVHlwZVtdIHtcbiAgbGV0IHBpcGVzID0gW107XG4gIGlmIChpc1ByZXNlbnQocGxhdGZvcm1QaXBlcykpIHtcbiAgICBmbGF0dGVuQXJyYXkocGxhdGZvcm1QaXBlcywgcGlwZXMpO1xuICB9XG4gIGlmIChpc1ByZXNlbnQodmlldy5waXBlcykpIHtcbiAgICBmbGF0dGVuQXJyYXkodmlldy5waXBlcywgcGlwZXMpO1xuICB9XG4gIHJldHVybiBwaXBlcztcbn1cblxuZnVuY3Rpb24gZmxhdHRlbkFycmF5KHRyZWU6IGFueVtdLCBvdXQ6IEFycmF5PFR5cGUgfCBhbnlbXT4pOiB2b2lkIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cmVlLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSByZXNvbHZlRm9yd2FyZFJlZih0cmVlW2ldKTtcbiAgICBpZiAoaXNBcnJheShpdGVtKSkge1xuICAgICAgZmxhdHRlbkFycmF5KGl0ZW0sIG91dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBpc1ZhbGlkVHlwZSh2YWx1ZTogVHlwZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNQcmVzZW50KHZhbHVlKSAmJiAodmFsdWUgaW5zdGFuY2VvZiBUeXBlKTtcbn1cblxuZnVuY3Rpb24gY2FsY01vZHVsZVVybChyZWZsZWN0b3I6IFJlZmxlY3RvclJlYWRlciwgdHlwZTogVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgY21wTWV0YWRhdGE6IG1kLkNvbXBvbmVudE1ldGFkYXRhKTogc3RyaW5nIHtcbiAgdmFyIG1vZHVsZUlkID0gY21wTWV0YWRhdGEubW9kdWxlSWQ7XG4gIGlmIChpc1ByZXNlbnQobW9kdWxlSWQpKSB7XG4gICAgdmFyIHNjaGVtZSA9IGdldFVybFNjaGVtZShtb2R1bGVJZCk7XG4gICAgcmV0dXJuIGlzUHJlc2VudChzY2hlbWUpICYmIHNjaGVtZS5sZW5ndGggPiAwID8gbW9kdWxlSWQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBwYWNrYWdlOiR7bW9kdWxlSWR9JHtNT0RVTEVfU1VGRklYfWA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHJlZmxlY3Rvci5pbXBvcnRVcmkodHlwZSk7XG4gIH1cbn1cbiJdfQ==