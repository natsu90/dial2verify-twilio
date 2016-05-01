'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var o = require('../output/output_ast');
var identifiers_1 = require('../identifiers');
var constants_1 = require('./constants');
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var template_ast_1 = require('../template_ast');
var compile_metadata_1 = require('../compile_metadata');
var util_1 = require('./util');
var compile_query_1 = require('./compile_query');
var compile_method_1 = require('./compile_method');
var CompileNode = (function () {
    function CompileNode(parent, view, nodeIndex, renderNode, sourceAst) {
        this.parent = parent;
        this.view = view;
        this.nodeIndex = nodeIndex;
        this.renderNode = renderNode;
        this.sourceAst = sourceAst;
    }
    CompileNode.prototype.isNull = function () { return lang_1.isBlank(this.renderNode); };
    CompileNode.prototype.isRootElement = function () { return this.view != this.parent.view; };
    return CompileNode;
}());
exports.CompileNode = CompileNode;
var CompileElement = (function (_super) {
    __extends(CompileElement, _super);
    function CompileElement(parent, view, nodeIndex, renderNode, sourceAst, component, _directives, _resolvedProvidersArray, hasViewContainer, hasEmbeddedView, variableTokens) {
        _super.call(this, parent, view, nodeIndex, renderNode, sourceAst);
        this.component = component;
        this._directives = _directives;
        this._resolvedProvidersArray = _resolvedProvidersArray;
        this.hasViewContainer = hasViewContainer;
        this.hasEmbeddedView = hasEmbeddedView;
        this.variableTokens = variableTokens;
        this._compViewExpr = null;
        this._instances = new compile_metadata_1.CompileTokenMap();
        this._queryCount = 0;
        this._queries = new compile_metadata_1.CompileTokenMap();
        this._componentConstructorViewQueryLists = [];
        this.contentNodesByNgContentIndex = null;
        this.elementRef = o.importExpr(identifiers_1.Identifiers.ElementRef).instantiate([this.renderNode]);
        this._instances.add(identifiers_1.identifierToken(identifiers_1.Identifiers.ElementRef), this.elementRef);
        this.injector = o.THIS_EXPR.callMethod('injector', [o.literal(this.nodeIndex)]);
        this._instances.add(identifiers_1.identifierToken(identifiers_1.Identifiers.Injector), this.injector);
        this._instances.add(identifiers_1.identifierToken(identifiers_1.Identifiers.Renderer), o.THIS_EXPR.prop('renderer'));
        if (this.hasViewContainer || this.hasEmbeddedView || lang_1.isPresent(this.component)) {
            this._createAppElement();
        }
    }
    CompileElement.createNull = function () {
        return new CompileElement(null, null, null, null, null, null, [], [], false, false, {});
    };
    CompileElement.prototype._createAppElement = function () {
        var fieldName = "_appEl_" + this.nodeIndex;
        var parentNodeIndex = this.isRootElement() ? null : this.parent.nodeIndex;
        this.view.fields.push(new o.ClassField(fieldName, o.importType(identifiers_1.Identifiers.AppElement), [o.StmtModifier.Private]));
        var statement = o.THIS_EXPR.prop(fieldName)
            .set(o.importExpr(identifiers_1.Identifiers.AppElement)
            .instantiate([
            o.literal(this.nodeIndex),
            o.literal(parentNodeIndex),
            o.THIS_EXPR,
            this.renderNode
        ]))
            .toStmt();
        this.view.createMethod.addStmt(statement);
        this.appElement = o.THIS_EXPR.prop(fieldName);
        this._instances.add(identifiers_1.identifierToken(identifiers_1.Identifiers.AppElement), this.appElement);
    };
    CompileElement.prototype.setComponentView = function (compViewExpr) {
        this._compViewExpr = compViewExpr;
        this.contentNodesByNgContentIndex =
            collection_1.ListWrapper.createFixedSize(this.component.template.ngContentSelectors.length);
        for (var i = 0; i < this.contentNodesByNgContentIndex.length; i++) {
            this.contentNodesByNgContentIndex[i] = [];
        }
    };
    CompileElement.prototype.setEmbeddedView = function (embeddedView) {
        this.embeddedView = embeddedView;
        if (lang_1.isPresent(embeddedView)) {
            var createTemplateRefExpr = o.importExpr(identifiers_1.Identifiers.TemplateRef_)
                .instantiate([this.appElement, this.embeddedView.viewFactory]);
            var provider = new compile_metadata_1.CompileProviderMetadata({ token: identifiers_1.identifierToken(identifiers_1.Identifiers.TemplateRef), useValue: createTemplateRefExpr });
            // Add TemplateRef as first provider as it does not have deps on other providers
            this._resolvedProvidersArray.unshift(new template_ast_1.ProviderAst(provider.token, false, true, [provider], template_ast_1.ProviderAstType.Builtin, this.sourceAst.sourceSpan));
        }
    };
    CompileElement.prototype.beforeChildren = function () {
        var _this = this;
        if (this.hasViewContainer) {
            this._instances.add(identifiers_1.identifierToken(identifiers_1.Identifiers.ViewContainerRef), this.appElement.prop('vcRef'));
        }
        this._resolvedProviders = new compile_metadata_1.CompileTokenMap();
        this._resolvedProvidersArray.forEach(function (provider) {
            return _this._resolvedProviders.add(provider.token, provider);
        });
        // create all the provider instances, some in the view constructor,
        // some as getters. We rely on the fact that they are already sorted topologically.
        this._resolvedProviders.values().forEach(function (resolvedProvider) {
            var providerValueExpressions = resolvedProvider.providers.map(function (provider) {
                if (lang_1.isPresent(provider.useExisting)) {
                    return _this._getDependency(resolvedProvider.providerType, new compile_metadata_1.CompileDiDependencyMetadata({ token: provider.useExisting }));
                }
                else if (lang_1.isPresent(provider.useFactory)) {
                    var deps = lang_1.isPresent(provider.deps) ? provider.deps : provider.useFactory.diDeps;
                    var depsExpr = deps.map(function (dep) { return _this._getDependency(resolvedProvider.providerType, dep); });
                    return o.importExpr(provider.useFactory).callFn(depsExpr);
                }
                else if (lang_1.isPresent(provider.useClass)) {
                    var deps = lang_1.isPresent(provider.deps) ? provider.deps : provider.useClass.diDeps;
                    var depsExpr = deps.map(function (dep) { return _this._getDependency(resolvedProvider.providerType, dep); });
                    return o.importExpr(provider.useClass)
                        .instantiate(depsExpr, o.importType(provider.useClass));
                }
                else {
                    if (provider.useValue instanceof compile_metadata_1.CompileIdentifierMetadata) {
                        return o.importExpr(provider.useValue);
                    }
                    else if (provider.useValue instanceof o.Expression) {
                        return provider.useValue;
                    }
                    else {
                        return o.literal(provider.useValue);
                    }
                }
            });
            var propName = "_" + resolvedProvider.token.name + "_" + _this.nodeIndex + "_" + _this._instances.size;
            var instance = createProviderProperty(propName, resolvedProvider, providerValueExpressions, resolvedProvider.multiProvider, resolvedProvider.eager, _this);
            _this._instances.add(resolvedProvider.token, instance);
        });
        this.directiveInstances =
            this._directives.map(function (directive) { return _this._instances.get(identifiers_1.identifierToken(directive.type)); });
        for (var i = 0; i < this.directiveInstances.length; i++) {
            var directiveInstance = this.directiveInstances[i];
            var directive = this._directives[i];
            directive.queries.forEach(function (queryMeta) { _this._addQuery(queryMeta, directiveInstance); });
        }
        var queriesWithReads = [];
        this._resolvedProviders.values().forEach(function (resolvedProvider) {
            var queriesForProvider = _this._getQueriesFor(resolvedProvider.token);
            collection_1.ListWrapper.addAll(queriesWithReads, queriesForProvider.map(function (query) { return new _QueryWithRead(query, resolvedProvider.token); }));
        });
        collection_1.StringMapWrapper.forEach(this.variableTokens, function (_, varName) {
            var token = _this.variableTokens[varName];
            var varValue;
            if (lang_1.isPresent(token)) {
                varValue = _this._instances.get(token);
            }
            else {
                varValue = _this.renderNode;
            }
            _this.view.variables.set(varName, varValue);
            var varToken = new compile_metadata_1.CompileTokenMetadata({ value: varName });
            collection_1.ListWrapper.addAll(queriesWithReads, _this._getQueriesFor(varToken)
                .map(function (query) { return new _QueryWithRead(query, varToken); }));
        });
        queriesWithReads.forEach(function (queryWithRead) {
            var value;
            if (lang_1.isPresent(queryWithRead.read.identifier)) {
                // query for an identifier
                value = _this._instances.get(queryWithRead.read);
            }
            else {
                // query for a variable
                var token = _this.variableTokens[queryWithRead.read.value];
                if (lang_1.isPresent(token)) {
                    value = _this._instances.get(token);
                }
                else {
                    value = _this.elementRef;
                }
            }
            if (lang_1.isPresent(value)) {
                queryWithRead.query.addValue(value, _this.view);
            }
        });
        if (lang_1.isPresent(this.component)) {
            var componentConstructorViewQueryList = lang_1.isPresent(this.component) ? o.literalArr(this._componentConstructorViewQueryLists) :
                o.NULL_EXPR;
            var compExpr = lang_1.isPresent(this.getComponent()) ? this.getComponent() : o.NULL_EXPR;
            this.view.createMethod.addStmt(this.appElement.callMethod('initComponent', [compExpr, componentConstructorViewQueryList, this._compViewExpr])
                .toStmt());
        }
    };
    CompileElement.prototype.afterChildren = function (childNodeCount) {
        var _this = this;
        this._resolvedProviders.values().forEach(function (resolvedProvider) {
            // Note: afterChildren is called after recursing into children.
            // This is good so that an injector match in an element that is closer to a requesting element
            // matches first.
            var providerExpr = _this._instances.get(resolvedProvider.token);
            // Note: view providers are only visible on the injector of that element.
            // This is not fully correct as the rules during codegen don't allow a directive
            // to get hold of a view provdier on the same element. We still do this semantic
            // as it simplifies our model to having only one runtime injector per element.
            var providerChildNodeCount = resolvedProvider.providerType === template_ast_1.ProviderAstType.PrivateService ? 0 : childNodeCount;
            _this.view.injectorGetMethod.addStmt(createInjectInternalCondition(_this.nodeIndex, providerChildNodeCount, resolvedProvider, providerExpr));
        });
        this._queries.values().forEach(function (queries) {
            return queries.forEach(function (query) { return query.afterChildren(_this.view.updateContentQueriesMethod); });
        });
    };
    CompileElement.prototype.addContentNode = function (ngContentIndex, nodeExpr) {
        this.contentNodesByNgContentIndex[ngContentIndex].push(nodeExpr);
    };
    CompileElement.prototype.getComponent = function () {
        return lang_1.isPresent(this.component) ? this._instances.get(identifiers_1.identifierToken(this.component.type)) :
            null;
    };
    CompileElement.prototype.getProviderTokens = function () {
        return this._resolvedProviders.values().map(function (resolvedProvider) { return util_1.createDiTokenExpression(resolvedProvider.token); });
    };
    CompileElement.prototype.getDeclaredVariablesNames = function () {
        var res = [];
        collection_1.StringMapWrapper.forEach(this.variableTokens, function (_, key) { res.push(key); });
        return res;
    };
    CompileElement.prototype._getQueriesFor = function (token) {
        var result = [];
        var currentEl = this;
        var distance = 0;
        var queries;
        while (!currentEl.isNull()) {
            queries = currentEl._queries.get(token);
            if (lang_1.isPresent(queries)) {
                collection_1.ListWrapper.addAll(result, queries.filter(function (query) { return query.meta.descendants || distance <= 1; }));
            }
            if (currentEl._directives.length > 0) {
                distance++;
            }
            currentEl = currentEl.parent;
        }
        queries = this.view.componentView.viewQueries.get(token);
        if (lang_1.isPresent(queries)) {
            collection_1.ListWrapper.addAll(result, queries);
        }
        return result;
    };
    CompileElement.prototype._addQuery = function (queryMeta, directiveInstance) {
        var propName = "_query_" + queryMeta.selectors[0].name + "_" + this.nodeIndex + "_" + this._queryCount++;
        var queryList = compile_query_1.createQueryList(queryMeta, directiveInstance, propName, this.view);
        var query = new compile_query_1.CompileQuery(queryMeta, queryList, directiveInstance, this.view);
        compile_query_1.addQueryToTokenMap(this._queries, query);
        return query;
    };
    CompileElement.prototype._getLocalDependency = function (requestingProviderType, dep) {
        var result = null;
        // constructor content query
        if (lang_1.isBlank(result) && lang_1.isPresent(dep.query)) {
            result = this._addQuery(dep.query, null).queryList;
        }
        // constructor view query
        if (lang_1.isBlank(result) && lang_1.isPresent(dep.viewQuery)) {
            result = compile_query_1.createQueryList(dep.viewQuery, null, "_viewQuery_" + dep.viewQuery.selectors[0].name + "_" + this.nodeIndex + "_" + this._componentConstructorViewQueryLists.length, this.view);
            this._componentConstructorViewQueryLists.push(result);
        }
        if (lang_1.isPresent(dep.token)) {
            // access builtins with special visibility
            if (lang_1.isBlank(result)) {
                if (dep.token.equalsTo(identifiers_1.identifierToken(identifiers_1.Identifiers.ChangeDetectorRef))) {
                    if (requestingProviderType === template_ast_1.ProviderAstType.Component) {
                        return this._compViewExpr.prop('ref');
                    }
                    else {
                        return o.THIS_EXPR.prop('ref');
                    }
                }
            }
            // access regular providers on the element
            if (lang_1.isBlank(result)) {
                result = this._instances.get(dep.token);
            }
        }
        return result;
    };
    CompileElement.prototype._getDependency = function (requestingProviderType, dep) {
        var currElement = this;
        var result = null;
        if (dep.isValue) {
            result = o.literal(dep.value);
        }
        if (lang_1.isBlank(result) && !dep.isSkipSelf) {
            result = this._getLocalDependency(requestingProviderType, dep);
        }
        // check parent elements
        while (lang_1.isBlank(result) && !currElement.parent.isNull()) {
            currElement = currElement.parent;
            result = currElement._getLocalDependency(template_ast_1.ProviderAstType.PublicService, new compile_metadata_1.CompileDiDependencyMetadata({ token: dep.token }));
        }
        if (lang_1.isBlank(result)) {
            result = util_1.injectFromViewParentInjector(dep.token, dep.isOptional);
        }
        if (lang_1.isBlank(result)) {
            result = o.NULL_EXPR;
        }
        return util_1.getPropertyInView(result, this.view, currElement.view);
    };
    return CompileElement;
}(CompileNode));
exports.CompileElement = CompileElement;
function createInjectInternalCondition(nodeIndex, childNodeCount, provider, providerExpr) {
    var indexCondition;
    if (childNodeCount > 0) {
        indexCondition = o.literal(nodeIndex)
            .lowerEquals(constants_1.InjectMethodVars.requestNodeIndex)
            .and(constants_1.InjectMethodVars.requestNodeIndex.lowerEquals(o.literal(nodeIndex + childNodeCount)));
    }
    else {
        indexCondition = o.literal(nodeIndex).identical(constants_1.InjectMethodVars.requestNodeIndex);
    }
    return new o.IfStmt(constants_1.InjectMethodVars.token.identical(util_1.createDiTokenExpression(provider.token)).and(indexCondition), [new o.ReturnStatement(providerExpr)]);
}
function createProviderProperty(propName, provider, providerValueExpressions, isMulti, isEager, compileElement) {
    var view = compileElement.view;
    var resolvedProviderValueExpr;
    var type;
    if (isMulti) {
        resolvedProviderValueExpr = o.literalArr(providerValueExpressions);
        type = new o.ArrayType(o.DYNAMIC_TYPE);
    }
    else {
        resolvedProviderValueExpr = providerValueExpressions[0];
        type = providerValueExpressions[0].type;
    }
    if (lang_1.isBlank(type)) {
        type = o.DYNAMIC_TYPE;
    }
    if (isEager) {
        view.fields.push(new o.ClassField(propName, type, [o.StmtModifier.Private]));
        view.createMethod.addStmt(o.THIS_EXPR.prop(propName).set(resolvedProviderValueExpr).toStmt());
    }
    else {
        var internalField = "_" + propName;
        view.fields.push(new o.ClassField(internalField, type, [o.StmtModifier.Private]));
        var getter = new compile_method_1.CompileMethod(view);
        getter.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
        // Note: Equals is important for JS so that it also checks the undefined case!
        getter.addStmt(new o.IfStmt(o.THIS_EXPR.prop(internalField).isBlank(), [o.THIS_EXPR.prop(internalField).set(resolvedProviderValueExpr).toStmt()]));
        getter.addStmt(new o.ReturnStatement(o.THIS_EXPR.prop(internalField)));
        view.getters.push(new o.ClassGetter(propName, getter.finish(), type));
    }
    return o.THIS_EXPR.prop(propName);
}
var _QueryWithRead = (function () {
    function _QueryWithRead(query, match) {
        this.query = query;
        this.read = lang_1.isPresent(query.meta.read) ? query.meta.read : match;
    }
    return _QueryWithRead;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZV9lbGVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC00bm8zWlF2Ty50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3ZpZXdfY29tcGlsZXIvY29tcGlsZV9lbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQVksQ0FBQyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFDMUMsNEJBQTJDLGdCQUFnQixDQUFDLENBQUE7QUFDNUQsMEJBQStCLGFBQWEsQ0FBQyxDQUFBO0FBRTdDLHFCQUFpQywwQkFBMEIsQ0FBQyxDQUFBO0FBQzVELDJCQUE0QyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQzdFLDZCQUF3RCxpQkFBaUIsQ0FBQyxDQUFBO0FBQzFFLGlDQVNPLHFCQUFxQixDQUFDLENBQUE7QUFDN0IscUJBQXVGLFFBQVEsQ0FBQyxDQUFBO0FBQ2hHLDhCQUFnRSxpQkFBaUIsQ0FBQyxDQUFBO0FBQ2xGLCtCQUE0QixrQkFBa0IsQ0FBQyxDQUFBO0FBRS9DO0lBQ0UscUJBQW1CLE1BQXNCLEVBQVMsSUFBaUIsRUFBUyxTQUFpQixFQUMxRSxVQUF3QixFQUFTLFNBQXNCO1FBRHZELFdBQU0sR0FBTixNQUFNLENBQWdCO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUFTLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDMUUsZUFBVSxHQUFWLFVBQVUsQ0FBYztRQUFTLGNBQVMsR0FBVCxTQUFTLENBQWE7SUFBRyxDQUFDO0lBRTlFLDRCQUFNLEdBQU4sY0FBb0IsTUFBTSxDQUFDLGNBQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXRELG1DQUFhLEdBQWIsY0FBMkIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLGtCQUFDO0FBQUQs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QU0sQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUUsOEVBQThFO1FBQzlFLE1BQU0sQ0FBQyxPQUFPLENBQ1YsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUN6QyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdGLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUVEO0lBRUUsd0JBQW1CLEtBQW1CLEVBQUUsS0FBMkI7UUFBaEQsVUFBSyxHQUFMLEtBQUssQ0FBYztRQUNwQyxJQUFJLENBQUMsSUFBSSxHQUFHLGdCQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFDbkUsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQUxELElBS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBvIGZyb20gJy4uL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7SWRlbnRpZmllcnMsIGlkZW50aWZpZXJUb2tlbn0gZnJvbSAnLi4vaWRlbnRpZmllcnMnO1xuaW1wb3J0IHtJbmplY3RNZXRob2RWYXJzfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQge0NvbXBpbGVWaWV3fSBmcm9tICcuL2NvbXBpbGVfdmlldyc7XG5pbXBvcnQge2lzUHJlc2VudCwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TGlzdFdyYXBwZXIsIFN0cmluZ01hcFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1RlbXBsYXRlQXN0LCBQcm92aWRlckFzdCwgUHJvdmlkZXJBc3RUeXBlfSBmcm9tICcuLi90ZW1wbGF0ZV9hc3QnO1xuaW1wb3J0IHtcbiAgQ29tcGlsZVRva2VuTWFwLFxuICBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsXG4gIENvbXBpbGVUb2tlbk1ldGFkYXRhLFxuICBDb21waWxlUXVlcnlNZXRhZGF0YSxcbiAgQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGEsXG4gIENvbXBpbGVEaURlcGVuZGVuY3lNZXRhZGF0YSxcbiAgQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YSxcbiAgQ29tcGlsZVR5cGVNZXRhZGF0YVxufSBmcm9tICcuLi9jb21waWxlX21ldGFkYXRhJztcbmltcG9ydCB7Z2V0UHJvcGVydHlJblZpZXcsIGNyZWF0ZURpVG9rZW5FeHByZXNzaW9uLCBpbmplY3RGcm9tVmlld1BhcmVudEluamVjdG9yfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHtDb21waWxlUXVlcnksIGNyZWF0ZVF1ZXJ5TGlzdCwgYWRkUXVlcnlUb1Rva2VuTWFwfSBmcm9tICcuL2NvbXBpbGVfcXVlcnknO1xuaW1wb3J0IHtDb21waWxlTWV0aG9kfSBmcm9tICcuL2NvbXBpbGVfbWV0aG9kJztcblxuZXhwb3J0IGNsYXNzIENvbXBpbGVOb2RlIHtcbiAgY29uc3RydWN0b3IocHVibGljIHBhcmVudDogQ29tcGlsZUVsZW1lbnQsIHB1YmxpYyB2aWV3OiBDb21waWxlVmlldywgcHVibGljIG5vZGVJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgICBwdWJsaWMgcmVuZGVyTm9kZTogby5FeHByZXNzaW9uLCBwdWJsaWMgc291cmNlQXN0OiBUZW1wbGF0ZUFzdCkge31cblxuICBpc051bGwoKTogYm9vbGVhbiB7IHJldHVybiBpc0JsYW5rKHRoaXMucmVuZGVyTm9kZSk7IH1cblxuICBpc1Jvb3RFbGVtZW50KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52aWV3ICE9IHRoaXMucGFyZW50LnZpZXc7IH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbXBpbGVFbGVtZW50IGV4dGVuZHMgQ29tcGlsZU5vZGUge1xuICBzdGF0aWMgY3JlYXRlTnVsbCgpOiBDb21waWxlRWxlbWVudCB7XG4gICAgcmV0dXJuIG5ldyBDb21waWxlRWxlbWVudChudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBbXSwgW10sIGZhbHNlLCBmYWxzZSwge30pO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tcFZpZXdFeHByOiBvLkV4cHJlc3Npb24gPSBudWxsO1xuICBwdWJsaWMgYXBwRWxlbWVudDogby5SZWFkUHJvcEV4cHI7XG4gIHB1YmxpYyBlbGVtZW50UmVmOiBvLkV4cHJlc3Npb247XG4gIHB1YmxpYyBpbmplY3Rvcjogby5FeHByZXNzaW9uO1xuICBwcml2YXRlIF9pbnN0YW5jZXMgPSBuZXcgQ29tcGlsZVRva2VuTWFwPG8uRXhwcmVzc2lvbj4oKTtcbiAgcHJpdmF0ZSBfcmVzb2x2ZWRQcm92aWRlcnM6IENvbXBpbGVUb2tlbk1hcDxQcm92aWRlckFzdD47XG5cbiAgcHJpdmF0ZSBfcXVlcnlDb3VudCA9IDA7XG4gIHByaXZhdGUgX3F1ZXJpZXMgPSBuZXcgQ29tcGlsZVRva2VuTWFwPENvbXBpbGVRdWVyeVtdPigpO1xuICBwcml2YXRlIF9jb21wb25lbnRDb25zdHJ1Y3RvclZpZXdRdWVyeUxpc3RzOiBvLkV4cHJlc3Npb25bXSA9IFtdO1xuXG4gIHB1YmxpYyBjb250ZW50Tm9kZXNCeU5nQ29udGVudEluZGV4OiBBcnJheTxvLkV4cHJlc3Npb24+W10gPSBudWxsO1xuICBwdWJsaWMgZW1iZWRkZWRWaWV3OiBDb21waWxlVmlldztcbiAgcHVibGljIGRpcmVjdGl2ZUluc3RhbmNlczogby5FeHByZXNzaW9uW107XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBDb21waWxlRWxlbWVudCwgdmlldzogQ29tcGlsZVZpZXcsIG5vZGVJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgICByZW5kZXJOb2RlOiBvLkV4cHJlc3Npb24sIHNvdXJjZUFzdDogVGVtcGxhdGVBc3QsXG4gICAgICAgICAgICAgIHB1YmxpYyBjb21wb25lbnQ6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZGlyZWN0aXZlczogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhW10sXG4gICAgICAgICAgICAgIHByaXZhdGUgX3Jlc29sdmVkUHJvdmlkZXJzQXJyYXk6IFByb3ZpZGVyQXN0W10sIHB1YmxpYyBoYXNWaWV3Q29udGFpbmVyOiBib29sZWFuLFxuICAgICAgICAgICAgICBwdWJsaWMgaGFzRW1iZWRkZWRWaWV3OiBib29sZWFuLFxuICAgICAgICAgICAgICBwdWJsaWMgdmFyaWFibGVUb2tlbnM6IHtba2V5OiBzdHJpbmddOiBDb21waWxlVG9rZW5NZXRhZGF0YX0pIHtcbiAgICBzdXBlcihwYXJlbnQsIHZpZXcsIG5vZGVJbmRleCwgcmVuZGVyTm9kZSwgc291cmNlQXN0KTtcbiAgICB0aGlzLmVsZW1lbnRSZWYgPSBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuRWxlbWVudFJlZikuaW5zdGFudGlhdGUoW3RoaXMucmVuZGVyTm9kZV0pO1xuICAgIHRoaXMuX2luc3RhbmNlcy5hZGQoaWRlbnRpZmllclRva2VuKElkZW50aWZpZXJzLkVsZW1lbnRSZWYpLCB0aGlzLmVsZW1lbnRSZWYpO1xuICAgIHRoaXMuaW5qZWN0b3IgPSBvLlRISVNfRVhQUi5jYWxsTWV0aG9kKCdpbmplY3RvcicsIFtvLmxpdGVyYWwodGhpcy5ub2RlSW5kZXgpXSk7XG4gICAgdGhpcy5faW5zdGFuY2VzLmFkZChpZGVudGlmaWVyVG9rZW4oSWRlbnRpZmllcnMuSW5qZWN0b3IpLCB0aGlzLmluamVjdG9yKTtcbiAgICB0aGlzLl9pbnN0YW5jZXMuYWRkKGlkZW50aWZpZXJUb2tlbihJZGVudGlmaWVycy5SZW5kZXJlciksIG8uVEhJU19FWFBSLnByb3AoJ3JlbmRlcmVyJykpO1xuICAgIGlmICh0aGlzLmhhc1ZpZXdDb250YWluZXIgfHwgdGhpcy5oYXNFbWJlZGRlZFZpZXcgfHwgaXNQcmVzZW50KHRoaXMuY29tcG9uZW50KSkge1xuICAgICAgdGhpcy5fY3JlYXRlQXBwRWxlbWVudCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUFwcEVsZW1lbnQoKSB7XG4gICAgdmFyIGZpZWxkTmFtZSA9IGBfYXBwRWxfJHt0aGlzLm5vZGVJbmRleH1gO1xuICAgIHZhciBwYXJlbnROb2RlSW5kZXggPSB0aGlzLmlzUm9vdEVsZW1lbnQoKSA/IG51bGwgOiB0aGlzLnBhcmVudC5ub2RlSW5kZXg7XG4gICAgdGhpcy52aWV3LmZpZWxkcy5wdXNoKG5ldyBvLkNsYXNzRmllbGQoZmllbGROYW1lLCBvLmltcG9ydFR5cGUoSWRlbnRpZmllcnMuQXBwRWxlbWVudCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW28uU3RtdE1vZGlmaWVyLlByaXZhdGVdKSk7XG4gICAgdmFyIHN0YXRlbWVudCA9IG8uVEhJU19FWFBSLnByb3AoZmllbGROYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldChvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuQXBwRWxlbWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5pbnN0YW50aWF0ZShbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8ubGl0ZXJhbCh0aGlzLm5vZGVJbmRleCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8ubGl0ZXJhbChwYXJlbnROb2RlSW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLlRISVNfRVhQUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJOb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50b1N0bXQoKTtcbiAgICB0aGlzLnZpZXcuY3JlYXRlTWV0aG9kLmFkZFN0bXQoc3RhdGVtZW50KTtcbiAgICB0aGlzLmFwcEVsZW1lbnQgPSBvLlRISVNfRVhQUi5wcm9wKGZpZWxkTmFtZSk7XG4gICAgdGhpcy5faW5zdGFuY2VzLmFkZChpZGVudGlmaWVyVG9rZW4oSWRlbnRpZmllcnMuQXBwRWxlbWVudCksIHRoaXMuYXBwRWxlbWVudCk7XG4gIH1cblxuICBzZXRDb21wb25lbnRWaWV3KGNvbXBWaWV3RXhwcjogby5FeHByZXNzaW9uKSB7XG4gICAgdGhpcy5fY29tcFZpZXdFeHByID0gY29tcFZpZXdFeHByO1xuICAgIHRoaXMuY29udGVudE5vZGVzQnlOZ0NvbnRlbnRJbmRleCA9XG4gICAgICAgIExpc3RXcmFwcGVyLmNyZWF0ZUZpeGVkU2l6ZSh0aGlzLmNvbXBvbmVudC50ZW1wbGF0ZS5uZ0NvbnRlbnRTZWxlY3RvcnMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY29udGVudE5vZGVzQnlOZ0NvbnRlbnRJbmRleC5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5jb250ZW50Tm9kZXNCeU5nQ29udGVudEluZGV4W2ldID0gW107XG4gICAgfVxuICB9XG5cbiAgc2V0RW1iZWRkZWRWaWV3KGVtYmVkZGVkVmlldzogQ29tcGlsZVZpZXcpIHtcbiAgICB0aGlzLmVtYmVkZGVkVmlldyA9IGVtYmVkZGVkVmlldztcbiAgICBpZiAoaXNQcmVzZW50KGVtYmVkZGVkVmlldykpIHtcbiAgICAgIHZhciBjcmVhdGVUZW1wbGF0ZVJlZkV4cHIgPVxuICAgICAgICAgIG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5UZW1wbGF0ZVJlZl8pXG4gICAgICAgICAgICAgIC5pbnN0YW50aWF0ZShbdGhpcy5hcHBFbGVtZW50LCB0aGlzLmVtYmVkZGVkVmlldy52aWV3RmFjdG9yeV0pO1xuICAgICAgdmFyIHByb3ZpZGVyID0gbmV3IENvbXBpbGVQcm92aWRlck1ldGFkYXRhKFxuICAgICAgICAgIHt0b2tlbjogaWRlbnRpZmllclRva2VuKElkZW50aWZpZXJzLlRlbXBsYXRlUmVmKSwgdXNlVmFsdWU6IGNyZWF0ZVRlbXBsYXRlUmVmRXhwcn0pO1xuICAgICAgLy8gQWRkIFRlbXBsYXRlUmVmIGFzIGZpcnN0IHByb3ZpZGVyIGFzIGl0IGRvZXMgbm90IGhhdmUgZGVwcyBvbiBvdGhlciBwcm92aWRlcnNcbiAgICAgIHRoaXMuX3Jlc29sdmVkUHJvdmlkZXJzQXJyYXkudW5zaGlmdChuZXcgUHJvdmlkZXJBc3QocHJvdmlkZXIudG9rZW4sIGZhbHNlLCB0cnVlLCBbcHJvdmlkZXJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQcm92aWRlckFzdFR5cGUuQnVpbHRpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VBc3Quc291cmNlU3BhbikpO1xuICAgIH1cbiAgfVxuXG4gIGJlZm9yZUNoaWxkcmVuKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmhhc1ZpZXdDb250YWluZXIpIHtcbiAgICAgIHRoaXMuX2luc3RhbmNlcy5hZGQoaWRlbnRpZmllclRva2VuKElkZW50aWZpZXJzLlZpZXdDb250YWluZXJSZWYpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcEVsZW1lbnQucHJvcCgndmNSZWYnKSk7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVzb2x2ZWRQcm92aWRlcnMgPSBuZXcgQ29tcGlsZVRva2VuTWFwPFByb3ZpZGVyQXN0PigpO1xuICAgIHRoaXMuX3Jlc29sdmVkUHJvdmlkZXJzQXJyYXkuZm9yRWFjaChwcm92aWRlciA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZWRQcm92aWRlcnMuYWRkKHByb3ZpZGVyLnRva2VuLCBwcm92aWRlcikpO1xuXG4gICAgLy8gY3JlYXRlIGFsbCB0aGUgcHJvdmlkZXIgaW5zdGFuY2VzLCBzb21lIGluIHRoZSB2aWV3IGNvbnN0cnVjdG9yLFxuICAgIC8vIHNvbWUgYXMgZ2V0dGVycy4gV2UgcmVseSBvbiB0aGUgZmFjdCB0aGF0IHRoZXkgYXJlIGFscmVhZHkgc29ydGVkIHRvcG9sb2dpY2FsbHkuXG4gICAgdGhpcy5fcmVzb2x2ZWRQcm92aWRlcnMudmFsdWVzKCkuZm9yRWFjaCgocmVzb2x2ZWRQcm92aWRlcikgPT4ge1xuICAgICAgdmFyIHByb3ZpZGVyVmFsdWVFeHByZXNzaW9ucyA9IHJlc29sdmVkUHJvdmlkZXIucHJvdmlkZXJzLm1hcCgocHJvdmlkZXIpID0+IHtcbiAgICAgICAgaWYgKGlzUHJlc2VudChwcm92aWRlci51c2VFeGlzdGluZykpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0RGVwZW5kZW5jeShcbiAgICAgICAgICAgICAgcmVzb2x2ZWRQcm92aWRlci5wcm92aWRlclR5cGUsXG4gICAgICAgICAgICAgIG5ldyBDb21waWxlRGlEZXBlbmRlbmN5TWV0YWRhdGEoe3Rva2VuOiBwcm92aWRlci51c2VFeGlzdGluZ30pKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc1ByZXNlbnQocHJvdmlkZXIudXNlRmFjdG9yeSkpIHtcbiAgICAgICAgICB2YXIgZGVwcyA9IGlzUHJlc2VudChwcm92aWRlci5kZXBzKSA/IHByb3ZpZGVyLmRlcHMgOiBwcm92aWRlci51c2VGYWN0b3J5LmRpRGVwcztcbiAgICAgICAgICB2YXIgZGVwc0V4cHIgPSBkZXBzLm1hcCgoZGVwKSA9PiB0aGlzLl9nZXREZXBlbmRlbmN5KHJlc29sdmVkUHJvdmlkZXIucHJvdmlkZXJUeXBlLCBkZXApKTtcbiAgICAgICAgICByZXR1cm4gby5pbXBvcnRFeHByKHByb3ZpZGVyLnVzZUZhY3RvcnkpLmNhbGxGbihkZXBzRXhwcik7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNQcmVzZW50KHByb3ZpZGVyLnVzZUNsYXNzKSkge1xuICAgICAgICAgIHZhciBkZXBzID0gaXNQcmVzZW50KHByb3ZpZGVyLmRlcHMpID8gcHJvdmlkZXIuZGVwcyA6IHByb3ZpZGVyLnVzZUNsYXNzLmRpRGVwcztcbiAgICAgICAgICB2YXIgZGVwc0V4cHIgPSBkZXBzLm1hcCgoZGVwKSA9PiB0aGlzLl9nZXREZXBlbmRlbmN5KHJlc29sdmVkUHJvdmlkZXIucHJvdmlkZXJUeXBlLCBkZXApKTtcbiAgICAgICAgICByZXR1cm4gby5pbXBvcnRFeHByKHByb3ZpZGVyLnVzZUNsYXNzKVxuICAgICAgICAgICAgICAuaW5zdGFudGlhdGUoZGVwc0V4cHIsIG8uaW1wb3J0VHlwZShwcm92aWRlci51c2VDbGFzcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChwcm92aWRlci51c2VWYWx1ZSBpbnN0YW5jZW9mIENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBvLmltcG9ydEV4cHIocHJvdmlkZXIudXNlVmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAocHJvdmlkZXIudXNlVmFsdWUgaW5zdGFuY2VvZiBvLkV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIHJldHVybiBwcm92aWRlci51c2VWYWx1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG8ubGl0ZXJhbChwcm92aWRlci51c2VWYWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHZhciBwcm9wTmFtZSA9IGBfJHtyZXNvbHZlZFByb3ZpZGVyLnRva2VuLm5hbWV9XyR7dGhpcy5ub2RlSW5kZXh9XyR7dGhpcy5faW5zdGFuY2VzLnNpemV9YDtcbiAgICAgIHZhciBpbnN0YW5jZSA9XG4gICAgICAgICAgY3JlYXRlUHJvdmlkZXJQcm9wZXJ0eShwcm9wTmFtZSwgcmVzb2x2ZWRQcm92aWRlciwgcHJvdmlkZXJWYWx1ZUV4cHJlc3Npb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZWRQcm92aWRlci5tdWx0aVByb3ZpZGVyLCByZXNvbHZlZFByb3ZpZGVyLmVhZ2VyLCB0aGlzKTtcbiAgICAgIHRoaXMuX2luc3RhbmNlcy5hZGQocmVzb2x2ZWRQcm92aWRlci50b2tlbiwgaW5zdGFuY2UpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kaXJlY3RpdmVJbnN0YW5jZXMgPVxuICAgICAgICB0aGlzLl9kaXJlY3RpdmVzLm1hcCgoZGlyZWN0aXZlKSA9PiB0aGlzLl9pbnN0YW5jZXMuZ2V0KGlkZW50aWZpZXJUb2tlbihkaXJlY3RpdmUudHlwZSkpKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGlyZWN0aXZlSW5zdGFuY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGlyZWN0aXZlSW5zdGFuY2UgPSB0aGlzLmRpcmVjdGl2ZUluc3RhbmNlc1tpXTtcbiAgICAgIHZhciBkaXJlY3RpdmUgPSB0aGlzLl9kaXJlY3RpdmVzW2ldO1xuICAgICAgZGlyZWN0aXZlLnF1ZXJpZXMuZm9yRWFjaCgocXVlcnlNZXRhKSA9PiB7IHRoaXMuX2FkZFF1ZXJ5KHF1ZXJ5TWV0YSwgZGlyZWN0aXZlSW5zdGFuY2UpOyB9KTtcbiAgICB9XG4gICAgdmFyIHF1ZXJpZXNXaXRoUmVhZHM6IF9RdWVyeVdpdGhSZWFkW10gPSBbXTtcbiAgICB0aGlzLl9yZXNvbHZlZFByb3ZpZGVycy52YWx1ZXMoKS5mb3JFYWNoKChyZXNvbHZlZFByb3ZpZGVyKSA9PiB7XG4gICAgICB2YXIgcXVlcmllc0ZvclByb3ZpZGVyID0gdGhpcy5fZ2V0UXVlcmllc0ZvcihyZXNvbHZlZFByb3ZpZGVyLnRva2VuKTtcbiAgICAgIExpc3RXcmFwcGVyLmFkZEFsbChcbiAgICAgICAgICBxdWVyaWVzV2l0aFJlYWRzLFxuICAgICAgICAgIHF1ZXJpZXNGb3JQcm92aWRlci5tYXAocXVlcnkgPT4gbmV3IF9RdWVyeVdpdGhSZWFkKHF1ZXJ5LCByZXNvbHZlZFByb3ZpZGVyLnRva2VuKSkpO1xuICAgIH0pO1xuICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaCh0aGlzLnZhcmlhYmxlVG9rZW5zLCAoXywgdmFyTmFtZSkgPT4ge1xuICAgICAgdmFyIHRva2VuID0gdGhpcy52YXJpYWJsZVRva2Vuc1t2YXJOYW1lXTtcbiAgICAgIHZhciB2YXJWYWx1ZTtcbiAgICAgIGlmIChpc1ByZXNlbnQodG9rZW4pKSB7XG4gICAgICAgIHZhclZhbHVlID0gdGhpcy5faW5zdGFuY2VzLmdldCh0b2tlbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXJWYWx1ZSA9IHRoaXMucmVuZGVyTm9kZTtcbiAgICAgIH1cbiAgICAgIHRoaXMudmlldy52YXJpYWJsZXMuc2V0KHZhck5hbWUsIHZhclZhbHVlKTtcbiAgICAgIHZhciB2YXJUb2tlbiA9IG5ldyBDb21waWxlVG9rZW5NZXRhZGF0YSh7dmFsdWU6IHZhck5hbWV9KTtcbiAgICAgIExpc3RXcmFwcGVyLmFkZEFsbChxdWVyaWVzV2l0aFJlYWRzLCB0aGlzLl9nZXRRdWVyaWVzRm9yKHZhclRva2VuKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKHF1ZXJ5ID0+IG5ldyBfUXVlcnlXaXRoUmVhZChxdWVyeSwgdmFyVG9rZW4pKSk7XG4gICAgfSk7XG4gICAgcXVlcmllc1dpdGhSZWFkcy5mb3JFYWNoKChxdWVyeVdpdGhSZWFkKSA9PiB7XG4gICAgICB2YXIgdmFsdWU6IG8uRXhwcmVzc2lvbjtcbiAgICAgIGlmIChpc1ByZXNlbnQocXVlcnlXaXRoUmVhZC5yZWFkLmlkZW50aWZpZXIpKSB7XG4gICAgICAgIC8vIHF1ZXJ5IGZvciBhbiBpZGVudGlmaWVyXG4gICAgICAgIHZhbHVlID0gdGhpcy5faW5zdGFuY2VzLmdldChxdWVyeVdpdGhSZWFkLnJlYWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcXVlcnkgZm9yIGEgdmFyaWFibGVcbiAgICAgICAgdmFyIHRva2VuID0gdGhpcy52YXJpYWJsZVRva2Vuc1txdWVyeVdpdGhSZWFkLnJlYWQudmFsdWVdO1xuICAgICAgICBpZiAoaXNQcmVzZW50KHRva2VuKSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5faW5zdGFuY2VzLmdldCh0b2tlbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmVsZW1lbnRSZWY7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc1ByZXNlbnQodmFsdWUpKSB7XG4gICAgICAgIHF1ZXJ5V2l0aFJlYWQucXVlcnkuYWRkVmFsdWUodmFsdWUsIHRoaXMudmlldyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuY29tcG9uZW50KSkge1xuICAgICAgdmFyIGNvbXBvbmVudENvbnN0cnVjdG9yVmlld1F1ZXJ5TGlzdCA9XG4gICAgICAgICAgaXNQcmVzZW50KHRoaXMuY29tcG9uZW50KSA/IG8ubGl0ZXJhbEFycih0aGlzLl9jb21wb25lbnRDb25zdHJ1Y3RvclZpZXdRdWVyeUxpc3RzKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uTlVMTF9FWFBSO1xuICAgICAgdmFyIGNvbXBFeHByID0gaXNQcmVzZW50KHRoaXMuZ2V0Q29tcG9uZW50KCkpID8gdGhpcy5nZXRDb21wb25lbnQoKSA6IG8uTlVMTF9FWFBSO1xuICAgICAgdGhpcy52aWV3LmNyZWF0ZU1ldGhvZC5hZGRTdG10KFxuICAgICAgICAgIHRoaXMuYXBwRWxlbWVudC5jYWxsTWV0aG9kKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaW5pdENvbXBvbmVudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtjb21wRXhwciwgY29tcG9uZW50Q29uc3RydWN0b3JWaWV3UXVlcnlMaXN0LCB0aGlzLl9jb21wVmlld0V4cHJdKVxuICAgICAgICAgICAgICAudG9TdG10KCkpO1xuICAgIH1cbiAgfVxuXG4gIGFmdGVyQ2hpbGRyZW4oY2hpbGROb2RlQ291bnQ6IG51bWJlcikge1xuICAgIHRoaXMuX3Jlc29sdmVkUHJvdmlkZXJzLnZhbHVlcygpLmZvckVhY2goKHJlc29sdmVkUHJvdmlkZXIpID0+IHtcbiAgICAgIC8vIE5vdGU6IGFmdGVyQ2hpbGRyZW4gaXMgY2FsbGVkIGFmdGVyIHJlY3Vyc2luZyBpbnRvIGNoaWxkcmVuLlxuICAgICAgLy8gVGhpcyBpcyBnb29kIHNvIHRoYXQgYW4gaW5qZWN0b3IgbWF0Y2ggaW4gYW4gZWxlbWVudCB0aGF0IGlzIGNsb3NlciB0byBhIHJlcXVlc3RpbmcgZWxlbWVudFxuICAgICAgLy8gbWF0Y2hlcyBmaXJzdC5cbiAgICAgIHZhciBwcm92aWRlckV4cHIgPSB0aGlzLl9pbnN0YW5jZXMuZ2V0KHJlc29sdmVkUHJvdmlkZXIudG9rZW4pO1xuICAgICAgLy8gTm90ZTogdmlldyBwcm92aWRlcnMgYXJlIG9ubHkgdmlzaWJsZSBvbiB0aGUgaW5qZWN0b3Igb2YgdGhhdCBlbGVtZW50LlxuICAgICAgLy8gVGhpcyBpcyBub3QgZnVsbHkgY29ycmVjdCBhcyB0aGUgcnVsZXMgZHVyaW5nIGNvZGVnZW4gZG9uJ3QgYWxsb3cgYSBkaXJlY3RpdmVcbiAgICAgIC8vIHRvIGdldCBob2xkIG9mIGEgdmlldyBwcm92ZGllciBvbiB0aGUgc2FtZSBlbGVtZW50LiBXZSBzdGlsbCBkbyB0aGlzIHNlbWFudGljXG4gICAgICAvLyBhcyBpdCBzaW1wbGlmaWVzIG91ciBtb2RlbCB0byBoYXZpbmcgb25seSBvbmUgcnVudGltZSBpbmplY3RvciBwZXIgZWxlbWVudC5cbiAgICAgIHZhciBwcm92aWRlckNoaWxkTm9kZUNvdW50ID1cbiAgICAgICAgICByZXNvbHZlZFByb3ZpZGVyLnByb3ZpZGVyVHlwZSA9PT0gUHJvdmlkZXJBc3RUeXBlLlByaXZhdGVTZXJ2aWNlID8gMCA6IGNoaWxkTm9kZUNvdW50O1xuICAgICAgdGhpcy52aWV3LmluamVjdG9yR2V0TWV0aG9kLmFkZFN0bXQoY3JlYXRlSW5qZWN0SW50ZXJuYWxDb25kaXRpb24oXG4gICAgICAgICAgdGhpcy5ub2RlSW5kZXgsIHByb3ZpZGVyQ2hpbGROb2RlQ291bnQsIHJlc29sdmVkUHJvdmlkZXIsIHByb3ZpZGVyRXhwcikpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fcXVlcmllcy52YWx1ZXMoKS5mb3JFYWNoKFxuICAgICAgICAocXVlcmllcykgPT5cbiAgICAgICAgICAgIHF1ZXJpZXMuZm9yRWFjaCgocXVlcnkpID0+IHF1ZXJ5LmFmdGVyQ2hpbGRyZW4odGhpcy52aWV3LnVwZGF0ZUNvbnRlbnRRdWVyaWVzTWV0aG9kKSkpO1xuICB9XG5cbiAgYWRkQ29udGVudE5vZGUobmdDb250ZW50SW5kZXg6IG51bWJlciwgbm9kZUV4cHI6IG8uRXhwcmVzc2lvbikge1xuICAgIHRoaXMuY29udGVudE5vZGVzQnlOZ0NvbnRlbnRJbmRleFtuZ0NvbnRlbnRJbmRleF0ucHVzaChub2RlRXhwcik7XG4gIH1cblxuICBnZXRDb21wb25lbnQoKTogby5FeHByZXNzaW9uIHtcbiAgICByZXR1cm4gaXNQcmVzZW50KHRoaXMuY29tcG9uZW50KSA/IHRoaXMuX2luc3RhbmNlcy5nZXQoaWRlbnRpZmllclRva2VuKHRoaXMuY29tcG9uZW50LnR5cGUpKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsO1xuICB9XG5cbiAgZ2V0UHJvdmlkZXJUb2tlbnMoKTogby5FeHByZXNzaW9uW10ge1xuICAgIHJldHVybiB0aGlzLl9yZXNvbHZlZFByb3ZpZGVycy52YWx1ZXMoKS5tYXAoXG4gICAgICAgIChyZXNvbHZlZFByb3ZpZGVyKSA9PiBjcmVhdGVEaVRva2VuRXhwcmVzc2lvbihyZXNvbHZlZFByb3ZpZGVyLnRva2VuKSk7XG4gIH1cblxuICBnZXREZWNsYXJlZFZhcmlhYmxlc05hbWVzKCk6IHN0cmluZ1tdIHtcbiAgICB2YXIgcmVzID0gW107XG4gICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKHRoaXMudmFyaWFibGVUb2tlbnMsIChfLCBrZXkpID0+IHsgcmVzLnB1c2goa2V5KTsgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHByaXZhdGUgX2dldFF1ZXJpZXNGb3IodG9rZW46IENvbXBpbGVUb2tlbk1ldGFkYXRhKTogQ29tcGlsZVF1ZXJ5W10ge1xuICAgIHZhciByZXN1bHQ6IENvbXBpbGVRdWVyeVtdID0gW107XG4gICAgdmFyIGN1cnJlbnRFbDogQ29tcGlsZUVsZW1lbnQgPSB0aGlzO1xuICAgIHZhciBkaXN0YW5jZSA9IDA7XG4gICAgdmFyIHF1ZXJpZXM6IENvbXBpbGVRdWVyeVtdO1xuICAgIHdoaWxlICghY3VycmVudEVsLmlzTnVsbCgpKSB7XG4gICAgICBxdWVyaWVzID0gY3VycmVudEVsLl9xdWVyaWVzLmdldCh0b2tlbik7XG4gICAgICBpZiAoaXNQcmVzZW50KHF1ZXJpZXMpKSB7XG4gICAgICAgIExpc3RXcmFwcGVyLmFkZEFsbChyZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyaWVzLmZpbHRlcigocXVlcnkpID0+IHF1ZXJ5Lm1ldGEuZGVzY2VuZGFudHMgfHwgZGlzdGFuY2UgPD0gMSkpO1xuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnRFbC5fZGlyZWN0aXZlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRpc3RhbmNlKys7XG4gICAgICB9XG4gICAgICBjdXJyZW50RWwgPSBjdXJyZW50RWwucGFyZW50O1xuICAgIH1cbiAgICBxdWVyaWVzID0gdGhpcy52aWV3LmNvbXBvbmVudFZpZXcudmlld1F1ZXJpZXMuZ2V0KHRva2VuKTtcbiAgICBpZiAoaXNQcmVzZW50KHF1ZXJpZXMpKSB7XG4gICAgICBMaXN0V3JhcHBlci5hZGRBbGwocmVzdWx0LCBxdWVyaWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgX2FkZFF1ZXJ5KHF1ZXJ5TWV0YTogQ29tcGlsZVF1ZXJ5TWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZUluc3RhbmNlOiBvLkV4cHJlc3Npb24pOiBDb21waWxlUXVlcnkge1xuICAgIHZhciBwcm9wTmFtZSA9IGBfcXVlcnlfJHtxdWVyeU1ldGEuc2VsZWN0b3JzWzBdLm5hbWV9XyR7dGhpcy5ub2RlSW5kZXh9XyR7dGhpcy5fcXVlcnlDb3VudCsrfWA7XG4gICAgdmFyIHF1ZXJ5TGlzdCA9IGNyZWF0ZVF1ZXJ5TGlzdChxdWVyeU1ldGEsIGRpcmVjdGl2ZUluc3RhbmNlLCBwcm9wTmFtZSwgdGhpcy52aWV3KTtcbiAgICB2YXIgcXVlcnkgPSBuZXcgQ29tcGlsZVF1ZXJ5KHF1ZXJ5TWV0YSwgcXVlcnlMaXN0LCBkaXJlY3RpdmVJbnN0YW5jZSwgdGhpcy52aWV3KTtcbiAgICBhZGRRdWVyeVRvVG9rZW5NYXAodGhpcy5fcXVlcmllcywgcXVlcnkpO1xuICAgIHJldHVybiBxdWVyeTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldExvY2FsRGVwZW5kZW5jeShyZXF1ZXN0aW5nUHJvdmlkZXJUeXBlOiBQcm92aWRlckFzdFR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXA6IENvbXBpbGVEaURlcGVuZGVuY3lNZXRhZGF0YSk6IG8uRXhwcmVzc2lvbiB7XG4gICAgdmFyIHJlc3VsdCA9IG51bGw7XG4gICAgLy8gY29uc3RydWN0b3IgY29udGVudCBxdWVyeVxuICAgIGlmIChpc0JsYW5rKHJlc3VsdCkgJiYgaXNQcmVzZW50KGRlcC5xdWVyeSkpIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMuX2FkZFF1ZXJ5KGRlcC5xdWVyeSwgbnVsbCkucXVlcnlMaXN0O1xuICAgIH1cblxuICAgIC8vIGNvbnN0cnVjdG9yIHZpZXcgcXVlcnlcbiAgICBpZiAoaXNCbGFuayhyZXN1bHQpICYmIGlzUHJlc2VudChkZXAudmlld1F1ZXJ5KSkge1xuICAgICAgcmVzdWx0ID0gY3JlYXRlUXVlcnlMaXN0KFxuICAgICAgICAgIGRlcC52aWV3UXVlcnksIG51bGwsXG4gICAgICAgICAgYF92aWV3UXVlcnlfJHtkZXAudmlld1F1ZXJ5LnNlbGVjdG9yc1swXS5uYW1lfV8ke3RoaXMubm9kZUluZGV4fV8ke3RoaXMuX2NvbXBvbmVudENvbnN0cnVjdG9yVmlld1F1ZXJ5TGlzdHMubGVuZ3RofWAsXG4gICAgICAgICAgdGhpcy52aWV3KTtcbiAgICAgIHRoaXMuX2NvbXBvbmVudENvbnN0cnVjdG9yVmlld1F1ZXJ5TGlzdHMucHVzaChyZXN1bHQpO1xuICAgIH1cblxuICAgIGlmIChpc1ByZXNlbnQoZGVwLnRva2VuKSkge1xuICAgICAgLy8gYWNjZXNzIGJ1aWx0aW5zIHdpdGggc3BlY2lhbCB2aXNpYmlsaXR5XG4gICAgICBpZiAoaXNCbGFuayhyZXN1bHQpKSB7XG4gICAgICAgIGlmIChkZXAudG9rZW4uZXF1YWxzVG8oaWRlbnRpZmllclRva2VuKElkZW50aWZpZXJzLkNoYW5nZURldGVjdG9yUmVmKSkpIHtcbiAgICAgICAgICBpZiAocmVxdWVzdGluZ1Byb3ZpZGVyVHlwZSA9PT0gUHJvdmlkZXJBc3RUeXBlLkNvbXBvbmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBWaWV3RXhwci5wcm9wKCdyZWYnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG8uVEhJU19FWFBSLnByb3AoJ3JlZicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gYWNjZXNzIHJlZ3VsYXIgcHJvdmlkZXJzIG9uIHRoZSBlbGVtZW50XG4gICAgICBpZiAoaXNCbGFuayhyZXN1bHQpKSB7XG4gICAgICAgIHJlc3VsdCA9IHRoaXMuX2luc3RhbmNlcy5nZXQoZGVwLnRva2VuKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgX2dldERlcGVuZGVuY3kocmVxdWVzdGluZ1Byb3ZpZGVyVHlwZTogUHJvdmlkZXJBc3RUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgIGRlcDogQ29tcGlsZURpRGVwZW5kZW5jeU1ldGFkYXRhKTogby5FeHByZXNzaW9uIHtcbiAgICB2YXIgY3VyckVsZW1lbnQ6IENvbXBpbGVFbGVtZW50ID0gdGhpcztcbiAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICBpZiAoZGVwLmlzVmFsdWUpIHtcbiAgICAgIHJlc3VsdCA9IG8ubGl0ZXJhbChkZXAudmFsdWUpO1xuICAgIH1cbiAgICBpZiAoaXNCbGFuayhyZXN1bHQpICYmICFkZXAuaXNTa2lwU2VsZikge1xuICAgICAgcmVzdWx0ID0gdGhpcy5fZ2V0TG9jYWxEZXBlbmRlbmN5KHJlcXVlc3RpbmdQcm92aWRlclR5cGUsIGRlcCk7XG4gICAgfVxuICAgIC8vIGNoZWNrIHBhcmVudCBlbGVtZW50c1xuICAgIHdoaWxlIChpc0JsYW5rKHJlc3VsdCkgJiYgIWN1cnJFbGVtZW50LnBhcmVudC5pc051bGwoKSkge1xuICAgICAgY3VyckVsZW1lbnQgPSBjdXJyRWxlbWVudC5wYXJlbnQ7XG4gICAgICByZXN1bHQgPSBjdXJyRWxlbWVudC5fZ2V0TG9jYWxEZXBlbmRlbmN5KFByb3ZpZGVyQXN0VHlwZS5QdWJsaWNTZXJ2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgQ29tcGlsZURpRGVwZW5kZW5jeU1ldGFkYXRhKHt0b2tlbjogZGVwLnRva2VufSkpO1xuICAgIH1cblxuICAgIGlmIChpc0JsYW5rKHJlc3VsdCkpIHtcbiAgICAgIHJlc3VsdCA9IGluamVjdEZyb21WaWV3UGFyZW50SW5qZWN0b3IoZGVwLnRva2VuLCBkZXAuaXNPcHRpb25hbCk7XG4gICAgfVxuICAgIGlmIChpc0JsYW5rKHJlc3VsdCkpIHtcbiAgICAgIHJlc3VsdCA9IG8uTlVMTF9FWFBSO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0UHJvcGVydHlJblZpZXcocmVzdWx0LCB0aGlzLnZpZXcsIGN1cnJFbGVtZW50LnZpZXcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUluamVjdEludGVybmFsQ29uZGl0aW9uKG5vZGVJbmRleDogbnVtYmVyLCBjaGlsZE5vZGVDb3VudDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXI6IFByb3ZpZGVyQXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJFeHByOiBvLkV4cHJlc3Npb24pOiBvLlN0YXRlbWVudCB7XG4gIHZhciBpbmRleENvbmRpdGlvbjtcbiAgaWYgKGNoaWxkTm9kZUNvdW50ID4gMCkge1xuICAgIGluZGV4Q29uZGl0aW9uID0gby5saXRlcmFsKG5vZGVJbmRleClcbiAgICAgICAgICAgICAgICAgICAgICAgICAubG93ZXJFcXVhbHMoSW5qZWN0TWV0aG9kVmFycy5yZXF1ZXN0Tm9kZUluZGV4KVxuICAgICAgICAgICAgICAgICAgICAgICAgIC5hbmQoSW5qZWN0TWV0aG9kVmFycy5yZXF1ZXN0Tm9kZUluZGV4Lmxvd2VyRXF1YWxzKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmxpdGVyYWwobm9kZUluZGV4ICsgY2hpbGROb2RlQ291bnQpKSk7XG4gIH0gZWxzZSB7XG4gICAgaW5kZXhDb25kaXRpb24gPSBvLmxpdGVyYWwobm9kZUluZGV4KS5pZGVudGljYWwoSW5qZWN0TWV0aG9kVmFycy5yZXF1ZXN0Tm9kZUluZGV4KTtcbiAgfVxuICByZXR1cm4gbmV3IG8uSWZTdG10KFxuICAgICAgSW5qZWN0TWV0aG9kVmFycy50b2tlbi5pZGVudGljYWwoY3JlYXRlRGlUb2tlbkV4cHJlc3Npb24ocHJvdmlkZXIudG9rZW4pKS5hbmQoaW5kZXhDb25kaXRpb24pLFxuICAgICAgW25ldyBvLlJldHVyblN0YXRlbWVudChwcm92aWRlckV4cHIpXSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVByb3ZpZGVyUHJvcGVydHkocHJvcE5hbWU6IHN0cmluZywgcHJvdmlkZXI6IFByb3ZpZGVyQXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlclZhbHVlRXhwcmVzc2lvbnM6IG8uRXhwcmVzc2lvbltdLCBpc011bHRpOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0VhZ2VyOiBib29sZWFuLCBjb21waWxlRWxlbWVudDogQ29tcGlsZUVsZW1lbnQpOiBvLkV4cHJlc3Npb24ge1xuICB2YXIgdmlldyA9IGNvbXBpbGVFbGVtZW50LnZpZXc7XG4gIHZhciByZXNvbHZlZFByb3ZpZGVyVmFsdWVFeHByO1xuICB2YXIgdHlwZTtcbiAgaWYgKGlzTXVsdGkpIHtcbiAgICByZXNvbHZlZFByb3ZpZGVyVmFsdWVFeHByID0gby5saXRlcmFsQXJyKHByb3ZpZGVyVmFsdWVFeHByZXNzaW9ucyk7XG4gICAgdHlwZSA9IG5ldyBvLkFycmF5VHlwZShvLkRZTkFNSUNfVFlQRSk7XG4gIH0gZWxzZSB7XG4gICAgcmVzb2x2ZWRQcm92aWRlclZhbHVlRXhwciA9IHByb3ZpZGVyVmFsdWVFeHByZXNzaW9uc1swXTtcbiAgICB0eXBlID0gcHJvdmlkZXJWYWx1ZUV4cHJlc3Npb25zWzBdLnR5cGU7XG4gIH1cbiAgaWYgKGlzQmxhbmsodHlwZSkpIHtcbiAgICB0eXBlID0gby5EWU5BTUlDX1RZUEU7XG4gIH1cbiAgaWYgKGlzRWFnZXIpIHtcbiAgICB2aWV3LmZpZWxkcy5wdXNoKG5ldyBvLkNsYXNzRmllbGQocHJvcE5hbWUsIHR5cGUsIFtvLlN0bXRNb2RpZmllci5Qcml2YXRlXSkpO1xuICAgIHZpZXcuY3JlYXRlTWV0aG9kLmFkZFN0bXQoby5USElTX0VYUFIucHJvcChwcm9wTmFtZSkuc2V0KHJlc29sdmVkUHJvdmlkZXJWYWx1ZUV4cHIpLnRvU3RtdCgpKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgaW50ZXJuYWxGaWVsZCA9IGBfJHtwcm9wTmFtZX1gO1xuICAgIHZpZXcuZmllbGRzLnB1c2gobmV3IG8uQ2xhc3NGaWVsZChpbnRlcm5hbEZpZWxkLCB0eXBlLCBbby5TdG10TW9kaWZpZXIuUHJpdmF0ZV0pKTtcbiAgICB2YXIgZ2V0dGVyID0gbmV3IENvbXBpbGVNZXRob2Qodmlldyk7XG4gICAgZ2V0dGVyLnJlc2V0RGVidWdJbmZvKGNvbXBpbGVFbGVtZW50Lm5vZGVJbmRleCwgY29tcGlsZUVsZW1lbnQuc291cmNlQXN0KTtcbiAgICAvLyBOb3RlOiBFcXVhbHMgaXMgaW1wb3J0YW50IGZvciBKUyBzbyB0aGF0IGl0IGFsc28gY2hlY2tzIHRoZSB1bmRlZmluZWQgY2FzZSFcbiAgICBnZXR0ZXIuYWRkU3RtdChcbiAgICAgICAgbmV3IG8uSWZTdG10KG8uVEhJU19FWFBSLnByb3AoaW50ZXJuYWxGaWVsZCkuaXNCbGFuaygpLFxuICAgICAgICAgICAgICAgICAgICAgW28uVEhJU19FWFBSLnByb3AoaW50ZXJuYWxGaWVsZCkuc2V0KHJlc29sdmVkUHJvdmlkZXJWYWx1ZUV4cHIpLnRvU3RtdCgpXSkpO1xuICAgIGdldHRlci5hZGRTdG10KG5ldyBvLlJldHVyblN0YXRlbWVudChvLlRISVNfRVhQUi5wcm9wKGludGVybmFsRmllbGQpKSk7XG4gICAgdmlldy5nZXR0ZXJzLnB1c2gobmV3IG8uQ2xhc3NHZXR0ZXIocHJvcE5hbWUsIGdldHRlci5maW5pc2goKSwgdHlwZSkpO1xuICB9XG4gIHJldHVybiBvLlRISVNfRVhQUi5wcm9wKHByb3BOYW1lKTtcbn1cblxuY2xhc3MgX1F1ZXJ5V2l0aFJlYWQge1xuICBwdWJsaWMgcmVhZDogQ29tcGlsZVRva2VuTWV0YWRhdGE7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBxdWVyeTogQ29tcGlsZVF1ZXJ5LCBtYXRjaDogQ29tcGlsZVRva2VuTWV0YWRhdGEpIHtcbiAgICB0aGlzLnJlYWQgPSBpc1ByZXNlbnQocXVlcnkubWV0YS5yZWFkKSA/IHF1ZXJ5Lm1ldGEucmVhZCA6IG1hdGNoO1xuICB9XG59XG4iXX0=