import * as o from '../output/output_ast';
import { Identifiers, identifierToken } from '../identifiers';
import { InjectMethodVars } from './constants';
import { isPresent, isBlank } from 'angular2/src/facade/lang';
import { ListWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { ProviderAst, ProviderAstType } from '../template_ast';
import { CompileTokenMap, CompileTokenMetadata, CompileProviderMetadata, CompileDiDependencyMetadata, CompileIdentifierMetadata } from '../compile_metadata';
import { getPropertyInView, createDiTokenExpression, injectFromViewParentInjector } from './util';
import { CompileQuery, createQueryList, addQueryToTokenMap } from './compile_query';
import { CompileMethod } from './compile_method';
export class CompileNode {
    constructor(parent, view, nodeIndex, renderNode, sourceAst) {
        this.parent = parent;
        this.view = view;
        this.nodeIndex = nodeIndex;
        this.renderNode = renderNode;
        this.sourceAst = sourceAst;
    }
    isNull() { return isBlank(this.renderNode); }
    isRootElement() { return this.view != this.parent.view; }
}
export class CompileElement extends CompileNode {
    constructor(parent, view, nodeIndex, renderNode, sourceAst, component, _directives, _resolvedProvidersArray, hasViewContainer, hasEmbeddedView, variableTokens) {
        super(parent, view, nodeIndex, renderNode, sourceAst);
        this.component = component;
        this._directives = _directives;
        this._resolvedProvidersArray = _resolvedProvidersArray;
        this.hasViewContainer = hasViewContainer;
        this.hasEmbeddedView = hasEmbeddedView;
        this.variableTokens = variableTokens;
        this._compViewExpr = null;
        this._instances = new CompileTokenMap();
        this._queryCount = 0;
        this._queries = new CompileTokenMap();
        this._componentConstructorViewQueryLists = [];
        this.contentNodesByNgContentIndex = null;
        this.elementRef = o.importExpr(Identifiers.ElementRef).instantiate([this.renderNode]);
        this._instances.add(identifierToken(Identifiers.ElementRef), this.elementRef);
        this.injector = o.THIS_EXPR.callMethod('injector', [o.literal(this.nodeIndex)]);
        this._instances.add(identifierToken(Identifiers.Injector), this.injector);
        this._instances.add(identifierToken(Identifiers.Renderer), o.THIS_EXPR.prop('renderer'));
        if (this.hasViewContainer || this.hasEmbeddedView || isPresent(this.component)) {
            this._createAppElement();
        }
    }
    static createNull() {
        return new CompileElement(null, null, null, null, null, null, [], [], false, false, {});
    }
    _createAppElement() {
        var fieldName = `_appEl_${this.nodeIndex}`;
        var parentNodeIndex = this.isRootElement() ? null : this.parent.nodeIndex;
        this.view.fields.push(new o.ClassField(fieldName, o.importType(Identifiers.AppElement), [o.StmtModifier.Private]));
        var statement = o.THIS_EXPR.prop(fieldName)
            .set(o.importExpr(Identifiers.AppElement)
            .instantiate([
            o.literal(this.nodeIndex),
            o.literal(parentNodeIndex),
            o.THIS_EXPR,
            this.renderNode
        ]))
            .toStmt();
        this.view.createMethod.addStmt(statement);
        this.appElement = o.THIS_EXPR.prop(fieldName);
        this._instances.add(identifierToken(Identifiers.AppElement), this.appElement);
    }
    setComponentView(compViewExpr) {
        this._compViewExpr = compViewExpr;
        this.contentNodesByNgContentIndex =
            ListWrapper.createFixedSize(this.component.template.ngContentSelectors.length);
        for (var i = 0; i < this.contentNodesByNgContentIndex.length; i++) {
            this.contentNodesByNgContentIndex[i] = [];
        }
    }
    setEmbeddedView(embeddedView) {
        this.embeddedView = embeddedView;
        if (isPresent(embeddedView)) {
            var createTemplateRefExpr = o.importExpr(Identifiers.TemplateRef_)
                .instantiate([this.appElement, this.embeddedView.viewFactory]);
            var provider = new CompileProviderMetadata({ token: identifierToken(Identifiers.TemplateRef), useValue: createTemplateRefExpr });
            // Add TemplateRef as first provider as it does not have deps on other providers
            this._resolvedProvidersArray.unshift(new ProviderAst(provider.token, false, true, [provider], ProviderAstType.Builtin, this.sourceAst.sourceSpan));
        }
    }
    beforeChildren() {
        if (this.hasViewContainer) {
            this._instances.add(identifierToken(Identifiers.ViewContainerRef), this.appElement.prop('vcRef'));
        }
        this._resolvedProviders = new CompileTokenMap();
        this._resolvedProvidersArray.forEach(provider => this._resolvedProviders.add(provider.token, provider));
        // create all the provider instances, some in the view constructor,
        // some as getters. We rely on the fact that they are already sorted topologically.
        this._resolvedProviders.values().forEach((resolvedProvider) => {
            var providerValueExpressions = resolvedProvider.providers.map((provider) => {
                if (isPresent(provider.useExisting)) {
                    return this._getDependency(resolvedProvider.providerType, new CompileDiDependencyMetadata({ token: provider.useExisting }));
                }
                else if (isPresent(provider.useFactory)) {
                    var deps = isPresent(provider.deps) ? provider.deps : provider.useFactory.diDeps;
                    var depsExpr = deps.map((dep) => this._getDependency(resolvedProvider.providerType, dep));
                    return o.importExpr(provider.useFactory).callFn(depsExpr);
                }
                else if (isPresent(provider.useClass)) {
                    var deps = isPresent(provider.deps) ? provider.deps : provider.useClass.diDeps;
                    var depsExpr = deps.map((dep) => this._getDependency(resolvedProvider.providerType, dep));
                    return o.importExpr(provider.useClass)
                        .instantiate(depsExpr, o.importType(provider.useClass));
                }
                else {
                    if (provider.useValue instanceof CompileIdentifierMetadata) {
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
            var propName = `_${resolvedProvider.token.name}_${this.nodeIndex}_${this._instances.size}`;
            var instance = createProviderProperty(propName, resolvedProvider, providerValueExpressions, resolvedProvider.multiProvider, resolvedProvider.eager, this);
            this._instances.add(resolvedProvider.token, instance);
        });
        this.directiveInstances =
            this._directives.map((directive) => this._instances.get(identifierToken(directive.type)));
        for (var i = 0; i < this.directiveInstances.length; i++) {
            var directiveInstance = this.directiveInstances[i];
            var directive = this._directives[i];
            directive.queries.forEach((queryMeta) => { this._addQuery(queryMeta, directiveInstance); });
        }
        var queriesWithReads = [];
        this._resolvedProviders.values().forEach((resolvedProvider) => {
            var queriesForProvider = this._getQueriesFor(resolvedProvider.token);
            ListWrapper.addAll(queriesWithReads, queriesForProvider.map(query => new _QueryWithRead(query, resolvedProvider.token)));
        });
        StringMapWrapper.forEach(this.variableTokens, (_, varName) => {
            var token = this.variableTokens[varName];
            var varValue;
            if (isPresent(token)) {
                varValue = this._instances.get(token);
            }
            else {
                varValue = this.renderNode;
            }
            this.view.variables.set(varName, varValue);
            var varToken = new CompileTokenMetadata({ value: varName });
            ListWrapper.addAll(queriesWithReads, this._getQueriesFor(varToken)
                .map(query => new _QueryWithRead(query, varToken)));
        });
        queriesWithReads.forEach((queryWithRead) => {
            var value;
            if (isPresent(queryWithRead.read.identifier)) {
                // query for an identifier
                value = this._instances.get(queryWithRead.read);
            }
            else {
                // query for a variable
                var token = this.variableTokens[queryWithRead.read.value];
                if (isPresent(token)) {
                    value = this._instances.get(token);
                }
                else {
                    value = this.elementRef;
                }
            }
            if (isPresent(value)) {
                queryWithRead.query.addValue(value, this.view);
            }
        });
        if (isPresent(this.component)) {
            var componentConstructorViewQueryList = isPresent(this.component) ? o.literalArr(this._componentConstructorViewQueryLists) :
                o.NULL_EXPR;
            var compExpr = isPresent(this.getComponent()) ? this.getComponent() : o.NULL_EXPR;
            this.view.createMethod.addStmt(this.appElement.callMethod('initComponent', [compExpr, componentConstructorViewQueryList, this._compViewExpr])
                .toStmt());
        }
    }
    afterChildren(childNodeCount) {
        this._resolvedProviders.values().forEach((resolvedProvider) => {
            // Note: afterChildren is called after recursing into children.
            // This is good so that an injector match in an element that is closer to a requesting element
            // matches first.
            var providerExpr = this._instances.get(resolvedProvider.token);
            // Note: view providers are only visible on the injector of that element.
            // This is not fully correct as the rules during codegen don't allow a directive
            // to get hold of a view provdier on the same element. We still do this semantic
            // as it simplifies our model to having only one runtime injector per element.
            var providerChildNodeCount = resolvedProvider.providerType === ProviderAstType.PrivateService ? 0 : childNodeCount;
            this.view.injectorGetMethod.addStmt(createInjectInternalCondition(this.nodeIndex, providerChildNodeCount, resolvedProvider, providerExpr));
        });
        this._queries.values().forEach((queries) => queries.forEach((query) => query.afterChildren(this.view.updateContentQueriesMethod)));
    }
    addContentNode(ngContentIndex, nodeExpr) {
        this.contentNodesByNgContentIndex[ngContentIndex].push(nodeExpr);
    }
    getComponent() {
        return isPresent(this.component) ? this._instances.get(identifierToken(this.component.type)) :
            null;
    }
    getProviderTokens() {
        return this._resolvedProviders.values().map((resolvedProvider) => createDiTokenExpression(resolvedProvider.token));
    }
    getDeclaredVariablesNames() {
        var res = [];
        StringMapWrapper.forEach(this.variableTokens, (_, key) => { res.push(key); });
        return res;
    }
    _getQueriesFor(token) {
        var result = [];
        var currentEl = this;
        var distance = 0;
        var queries;
        while (!currentEl.isNull()) {
            queries = currentEl._queries.get(token);
            if (isPresent(queries)) {
                ListWrapper.addAll(result, queries.filter((query) => query.meta.descendants || distance <= 1));
            }
            if (currentEl._directives.length > 0) {
                distance++;
            }
            currentEl = currentEl.parent;
        }
        queries = this.view.componentView.viewQueries.get(token);
        if (isPresent(queries)) {
            ListWrapper.addAll(result, queries);
        }
        return result;
    }
    _addQuery(queryMeta, directiveInstance) {
        var propName = `_query_${queryMeta.selectors[0].name}_${this.nodeIndex}_${this._queryCount++}`;
        var queryList = createQueryList(queryMeta, directiveInstance, propName, this.view);
        var query = new CompileQuery(queryMeta, queryList, directiveInstance, this.view);
        addQueryToTokenMap(this._queries, query);
        return query;
    }
    _getLocalDependency(requestingProviderType, dep) {
        var result = null;
        // constructor content query
        if (isBlank(result) && isPresent(dep.query)) {
            result = this._addQuery(dep.query, null).queryList;
        }
        // constructor view query
        if (isBlank(result) && isPresent(dep.viewQuery)) {
            result = createQueryList(dep.viewQuery, null, `_viewQuery_${dep.viewQuery.selectors[0].name}_${this.nodeIndex}_${this._componentConstructorViewQueryLists.length}`, this.view);
            this._componentConstructorViewQueryLists.push(result);
        }
        if (isPresent(dep.token)) {
            // access builtins with special visibility
            if (isBlank(result)) {
                if (dep.token.equalsTo(identifierToken(Identifiers.ChangeDetectorRef))) {
                    if (requestingProviderType === ProviderAstType.Component) {
                        return this._compViewExpr.prop('ref');
                    }
                    else {
                        return o.THIS_EXPR.prop('ref');
                    }
                }
            }
            // access regular providers on the element
            if (isBlank(result)) {
                result = this._instances.get(dep.token);
            }
        }
        return result;
    }
    _getDependency(requestingProviderType, dep) {
        var currElement = this;
        var result = null;
        if (dep.isValue) {
            result = o.literal(dep.value);
        }
        if (isBlank(result) && !dep.isSkipSelf) {
            result = this._getLocalDependency(requestingProviderType, dep);
        }
        // check parent elements
        while (isBlank(result) && !currElement.parent.isNull()) {
            currElement = currElement.parent;
            result = currElement._getLocalDependency(ProviderAstType.PublicService, new CompileDiDependencyMetadata({ token: dep.token }));
        }
        if (isBlank(result)) {
            result = injectFromViewParentInjector(dep.token, dep.isOptional);
        }
        if (isBlank(result)) {
            result = o.NULL_EXPR;
        }
        return getPropertyInView(result, this.view, currElement.view);
    }
}
function createInjectInternalCondition(nodeIndex, childNodeCount, provider, providerExpr) {
    var indexCondition;
    if (childNodeCount > 0) {
        indexCondition = o.literal(nodeIndex)
            .lowerEquals(InjectMethodVars.requestNodeIndex)
            .and(InjectMethodVars.requestNodeIndex.lowerEquals(o.literal(nodeIndex + childNodeCount)));
    }
    else {
        indexCondition = o.literal(nodeIndex).identical(InjectMethodVars.requestNodeIndex);
    }
    return new o.IfStmt(InjectMethodVars.token.identical(createDiTokenExpression(provider.token)).and(indexCondition), [new o.ReturnStatement(providerExpr)]);
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
    if (isBlank(type)) {
        type = o.DYNAMIC_TYPE;
    }
    if (isEager) {
        view.fields.push(new o.ClassField(propName, type, [o.StmtModifier.Private]));
        view.createMethod.addStmt(o.THIS_EXPR.prop(propName).set(resolvedProviderValueExpr).toStmt());
    }
    else {
        var internalField = `_${propName}`;
        view.fields.push(new o.ClassField(internalField, type, [o.StmtModifier.Private]));
        var getter = new CompileMethod(view);
        getter.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
        // Note: Equals is important for JS so that it also checks the undefined case!
        getter.addStmt(new o.IfStmt(o.THIS_EXPR.prop(internalField).isBlank(), [o.THIS_EXPR.prop(internalField).set(resolvedProviderValueExpr).toStmt()]));
        getter.addStmt(new o.ReturnStatement(o.THIS_EXPR.prop(internalField)));
        view.getters.push(new o.ClassGetter(propName, getter.finish(), type));
    }
    return o.THIS_EXPR.prop(propName);
}
class _QueryWithRead {
    constructor(query, match) {
        this.query = query;
        this.read = isPresent(query.meta.read) ? query.meta.read : match;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZV9lbGVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC05RDFpR1FWRy50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3ZpZXdfY29tcGlsZXIvY29tcGlsZV9lbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEtBQUssQ0FBQyxNQUFNLHNCQUFzQjtPQUNsQyxFQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUMsTUFBTSxnQkFBZ0I7T0FDcEQsRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGFBQWE7T0FFckMsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFDLE1BQU0sMEJBQTBCO09BQ3BELEVBQUMsV0FBVyxFQUFFLGdCQUFnQixFQUFDLE1BQU0sZ0NBQWdDO09BQ3JFLEVBQWMsV0FBVyxFQUFFLGVBQWUsRUFBQyxNQUFNLGlCQUFpQjtPQUNsRSxFQUNMLGVBQWUsRUFFZixvQkFBb0IsRUFFcEIsdUJBQXVCLEVBQ3ZCLDJCQUEyQixFQUMzQix5QkFBeUIsRUFFMUIsTUFBTSxxQkFBcUI7T0FDckIsRUFBQyxpQkFBaUIsRUFBRSx1QkFBdUIsRUFBRSw0QkFBNEIsRUFBQyxNQUFNLFFBQVE7T0FDeEYsRUFBQyxZQUFZLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFDLE1BQU0saUJBQWlCO09BQzFFLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0JBQWtCO0FBRTlDO0lBQ0UsWUFBbUIsTUFBc0IsRUFBUyxJQUFpQixFQUFTLFNBQWlCLEVBQzFFLFVBQXdCLEVBQVMsU0FBc0I7UUFEdkQsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFhO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUMxRSxlQUFVLEdBQVYsVUFBVSxDQUFjO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBYTtJQUFHLENBQUM7SUFFOUUsTUFBTSxLQUFjLE1BQU0sQ0FBQyxPQUFPLENB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UUFDN0YsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUNELE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBRUQ7SUFFRSxZQUFtQixLQUFtQixFQUFFLEtBQTJCO1FBQWhELFVBQUssR0FBTCxLQUFLLENBQWM7UUFDcEMsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFDbkUsQ0FBQztBQUNILENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIG8gZnJvbSAnLi4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtJZGVudGlmaWVycywgaWRlbnRpZmllclRva2VufSBmcm9tICcuLi9pZGVudGlmaWVycyc7XG5pbXBvcnQge0luamVjdE1ldGhvZFZhcnN9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7Q29tcGlsZVZpZXd9IGZyb20gJy4vY29tcGlsZV92aWV3JztcbmltcG9ydCB7aXNQcmVzZW50LCBpc0JsYW5rfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtMaXN0V3JhcHBlciwgU3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7VGVtcGxhdGVBc3QsIFByb3ZpZGVyQXN0LCBQcm92aWRlckFzdFR5cGV9IGZyb20gJy4uL3RlbXBsYXRlX2FzdCc7XG5pbXBvcnQge1xuICBDb21waWxlVG9rZW5NYXAsXG4gIENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgQ29tcGlsZVRva2VuTWV0YWRhdGEsXG4gIENvbXBpbGVRdWVyeU1ldGFkYXRhLFxuICBDb21waWxlUHJvdmlkZXJNZXRhZGF0YSxcbiAgQ29tcGlsZURpRGVwZW5kZW5jeU1ldGFkYXRhLFxuICBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhLFxuICBDb21waWxlVHlwZU1ldGFkYXRhXG59IGZyb20gJy4uL2NvbXBpbGVfbWV0YWRhdGEnO1xuaW1wb3J0IHtnZXRQcm9wZXJ0eUluVmlldywgY3JlYXRlRGlUb2tlbkV4cHJlc3Npb24sIGluamVjdEZyb21WaWV3UGFyZW50SW5qZWN0b3J9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQge0NvbXBpbGVRdWVyeSwgY3JlYXRlUXVlcnlMaXN0LCBhZGRRdWVyeVRvVG9rZW5NYXB9IGZyb20gJy4vY29tcGlsZV9xdWVyeSc7XG5pbXBvcnQge0NvbXBpbGVNZXRob2R9IGZyb20gJy4vY29tcGlsZV9tZXRob2QnO1xuXG5leHBvcnQgY2xhc3MgQ29tcGlsZU5vZGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGFyZW50OiBDb21waWxlRWxlbWVudCwgcHVibGljIHZpZXc6IENvbXBpbGVWaWV3LCBwdWJsaWMgbm9kZUluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgIHB1YmxpYyByZW5kZXJOb2RlOiBvLkV4cHJlc3Npb24sIHB1YmxpYyBzb3VyY2VBc3Q6IFRlbXBsYXRlQXN0KSB7fVxuXG4gIGlzTnVsbCgpOiBib29sZWFuIHsgcmV0dXJuIGlzQmxhbmsodGhpcy5yZW5kZXJOb2RlKTsgfVxuXG4gIGlzUm9vdEVsZW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnZpZXcgIT0gdGhpcy5wYXJlbnQudmlldzsgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29tcGlsZUVsZW1lbnQgZXh0ZW5kcyBDb21waWxlTm9kZSB7XG4gIHN0YXRpYyBjcmVhdGVOdWxsKCk6IENvbXBpbGVFbGVtZW50IHtcbiAgICByZXR1cm4gbmV3IENvbXBpbGVFbGVtZW50KG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIFtdLCBbXSwgZmFsc2UsIGZhbHNlLCB7fSk7XG4gIH1cblxuICBwcml2YXRlIF9jb21wVmlld0V4cHI6IG8uRXhwcmVzc2lvbiA9IG51bGw7XG4gIHB1YmxpYyBhcHBFbGVtZW50OiBvLlJlYWRQcm9wRXhwcjtcbiAgcHVibGljIGVsZW1lbnRSZWY6IG8uRXhwcmVzc2lvbjtcbiAgcHVibGljIGluamVjdG9yOiBvLkV4cHJlc3Npb247XG4gIHByaXZhdGUgX2luc3RhbmNlcyA9IG5ldyBDb21waWxlVG9rZW5NYXA8by5FeHByZXNzaW9uPigpO1xuICBwcml2YXRlIF9yZXNvbHZlZFByb3ZpZGVyczogQ29tcGlsZVRva2VuTWFwPFByb3ZpZGVyQXN0PjtcblxuICBwcml2YXRlIF9xdWVyeUNvdW50ID0gMDtcbiAgcHJpdmF0ZSBfcXVlcmllcyA9IG5ldyBDb21waWxlVG9rZW5NYXA8Q29tcGlsZVF1ZXJ5W10+KCk7XG4gIHByaXZhdGUgX2NvbXBvbmVudENvbnN0cnVjdG9yVmlld1F1ZXJ5TGlzdHM6IG8uRXhwcmVzc2lvbltdID0gW107XG5cbiAgcHVibGljIGNvbnRlbnROb2Rlc0J5TmdDb250ZW50SW5kZXg6IEFycmF5PG8uRXhwcmVzc2lvbj5bXSA9IG51bGw7XG4gIHB1YmxpYyBlbWJlZGRlZFZpZXc6IENvbXBpbGVWaWV3O1xuICBwdWJsaWMgZGlyZWN0aXZlSW5zdGFuY2VzOiBvLkV4cHJlc3Npb25bXTtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IENvbXBpbGVFbGVtZW50LCB2aWV3OiBDb21waWxlVmlldywgbm9kZUluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgIHJlbmRlck5vZGU6IG8uRXhwcmVzc2lvbiwgc291cmNlQXN0OiBUZW1wbGF0ZUFzdCxcbiAgICAgICAgICAgICAgcHVibGljIGNvbXBvbmVudDogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICAgICAgICAgICAgICBwcml2YXRlIF9kaXJlY3RpdmVzOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGFbXSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfcmVzb2x2ZWRQcm92aWRlcnNBcnJheTogUHJvdmlkZXJBc3RbXSwgcHVibGljIGhhc1ZpZXdDb250YWluZXI6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHB1YmxpYyBoYXNFbWJlZGRlZFZpZXc6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHB1YmxpYyB2YXJpYWJsZVRva2Vuczoge1trZXk6IHN0cmluZ106IENvbXBpbGVUb2tlbk1ldGFkYXRhfSkge1xuICAgIHN1cGVyKHBhcmVudCwgdmlldywgbm9kZUluZGV4LCByZW5kZXJOb2RlLCBzb3VyY2VBc3QpO1xuICAgIHRoaXMuZWxlbWVudFJlZiA9IG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5FbGVtZW50UmVmKS5pbnN0YW50aWF0ZShbdGhpcy5yZW5kZXJOb2RlXSk7XG4gICAgdGhpcy5faW5zdGFuY2VzLmFkZChpZGVudGlmaWVyVG9rZW4oSWRlbnRpZmllcnMuRWxlbWVudFJlZiksIHRoaXMuZWxlbWVudFJlZik7XG4gICAgdGhpcy5pbmplY3RvciA9IG8uVEhJU19FWFBSLmNhbGxNZXRob2QoJ2luamVjdG9yJywgW28ubGl0ZXJhbCh0aGlzLm5vZGVJbmRleCldKTtcbiAgICB0aGlzLl9pbnN0YW5jZXMuYWRkKGlkZW50aWZpZXJUb2tlbihJZGVudGlmaWVycy5JbmplY3RvciksIHRoaXMuaW5qZWN0b3IpO1xuICAgIHRoaXMuX2luc3RhbmNlcy5hZGQoaWRlbnRpZmllclRva2VuKElkZW50aWZpZXJzLlJlbmRlcmVyKSwgby5USElTX0VYUFIucHJvcCgncmVuZGVyZXInKSk7XG4gICAgaWYgKHRoaXMuaGFzVmlld0NvbnRhaW5lciB8fCB0aGlzLmhhc0VtYmVkZGVkVmlldyB8fCBpc1ByZXNlbnQodGhpcy5jb21wb25lbnQpKSB7XG4gICAgICB0aGlzLl9jcmVhdGVBcHBFbGVtZW50KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlQXBwRWxlbWVudCgpIHtcbiAgICB2YXIgZmllbGROYW1lID0gYF9hcHBFbF8ke3RoaXMubm9kZUluZGV4fWA7XG4gICAgdmFyIHBhcmVudE5vZGVJbmRleCA9IHRoaXMuaXNSb290RWxlbWVudCgpID8gbnVsbCA6IHRoaXMucGFyZW50Lm5vZGVJbmRleDtcbiAgICB0aGlzLnZpZXcuZmllbGRzLnB1c2gobmV3IG8uQ2xhc3NGaWVsZChmaWVsZE5hbWUsIG8uaW1wb3J0VHlwZShJZGVudGlmaWVycy5BcHBFbGVtZW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbby5TdG10TW9kaWZpZXIuUHJpdmF0ZV0pKTtcbiAgICB2YXIgc3RhdGVtZW50ID0gby5USElTX0VYUFIucHJvcChmaWVsZE5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0KG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5BcHBFbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmluc3RhbnRpYXRlKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby5saXRlcmFsKHRoaXMubm9kZUluZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby5saXRlcmFsKHBhcmVudE5vZGVJbmRleCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uVEhJU19FWFBSLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlck5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRvU3RtdCgpO1xuICAgIHRoaXMudmlldy5jcmVhdGVNZXRob2QuYWRkU3RtdChzdGF0ZW1lbnQpO1xuICAgIHRoaXMuYXBwRWxlbWVudCA9IG8uVEhJU19FWFBSLnByb3AoZmllbGROYW1lKTtcbiAgICB0aGlzLl9pbnN0YW5jZXMuYWRkKGlkZW50aWZpZXJUb2tlbihJZGVudGlmaWVycy5BcHBFbGVtZW50KSwgdGhpcy5hcHBFbGVtZW50KTtcbiAgfVxuXG4gIHNldENvbXBvbmVudFZpZXcoY29tcFZpZXdFeHByOiBvLkV4cHJlc3Npb24pIHtcbiAgICB0aGlzLl9jb21wVmlld0V4cHIgPSBjb21wVmlld0V4cHI7XG4gICAgdGhpcy5jb250ZW50Tm9kZXNCeU5nQ29udGVudEluZGV4ID1cbiAgICAgICAgTGlzdFdyYXBwZXIuY3JlYXRlRml4ZWRTaXplKHRoaXMuY29tcG9uZW50LnRlbXBsYXRlLm5nQ29udGVudFNlbGVjdG9ycy5sZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jb250ZW50Tm9kZXNCeU5nQ29udGVudEluZGV4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmNvbnRlbnROb2Rlc0J5TmdDb250ZW50SW5kZXhbaV0gPSBbXTtcbiAgICB9XG4gIH1cblxuICBzZXRFbWJlZGRlZFZpZXcoZW1iZWRkZWRWaWV3OiBDb21waWxlVmlldykge1xuICAgIHRoaXMuZW1iZWRkZWRWaWV3ID0gZW1iZWRkZWRWaWV3O1xuICAgIGlmIChpc1ByZXNlbnQoZW1iZWRkZWRWaWV3KSkge1xuICAgICAgdmFyIGNyZWF0ZVRlbXBsYXRlUmVmRXhwciA9XG4gICAgICAgICAgby5pbXBvcnRFeHByKElkZW50aWZpZXJzLlRlbXBsYXRlUmVmXylcbiAgICAgICAgICAgICAgLmluc3RhbnRpYXRlKFt0aGlzLmFwcEVsZW1lbnQsIHRoaXMuZW1iZWRkZWRWaWV3LnZpZXdGYWN0b3J5XSk7XG4gICAgICB2YXIgcHJvdmlkZXIgPSBuZXcgQ29tcGlsZVByb3ZpZGVyTWV0YWRhdGEoXG4gICAgICAgICAge3Rva2VuOiBpZGVudGlmaWVyVG9rZW4oSWRlbnRpZmllcnMuVGVtcGxhdGVSZWYpLCB1c2VWYWx1ZTogY3JlYXRlVGVtcGxhdGVSZWZFeHByfSk7XG4gICAgICAvLyBBZGQgVGVtcGxhdGVSZWYgYXMgZmlyc3QgcHJvdmlkZXIgYXMgaXQgZG9lcyBub3QgaGF2ZSBkZXBzIG9uIG90aGVyIHByb3ZpZGVyc1xuICAgICAgdGhpcy5fcmVzb2x2ZWRQcm92aWRlcnNBcnJheS51bnNoaWZ0KG5ldyBQcm92aWRlckFzdChwcm92aWRlci50b2tlbiwgZmFsc2UsIHRydWUsIFtwcm92aWRlcl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb3ZpZGVyQXN0VHlwZS5CdWlsdGluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUFzdC5zb3VyY2VTcGFuKSk7XG4gICAgfVxuICB9XG5cbiAgYmVmb3JlQ2hpbGRyZW4oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaGFzVmlld0NvbnRhaW5lcikge1xuICAgICAgdGhpcy5faW5zdGFuY2VzLmFkZChpZGVudGlmaWVyVG9rZW4oSWRlbnRpZmllcnMuVmlld0NvbnRhaW5lclJlZiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwRWxlbWVudC5wcm9wKCd2Y1JlZicpKTtcbiAgICB9XG5cbiAgICB0aGlzLl9yZXNvbHZlZFByb3ZpZGVycyA9IG5ldyBDb21waWxlVG9rZW5NYXA8UHJvdmlkZXJBc3Q+KCk7XG4gICAgdGhpcy5fcmVzb2x2ZWRQcm92aWRlcnNBcnJheS5mb3JFYWNoKHByb3ZpZGVyID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNvbHZlZFByb3ZpZGVycy5hZGQocHJvdmlkZXIudG9rZW4sIHByb3ZpZGVyKSk7XG5cbiAgICAvLyBjcmVhdGUgYWxsIHRoZSBwcm92aWRlciBpbnN0YW5jZXMsIHNvbWUgaW4gdGhlIHZpZXcgY29uc3RydWN0b3IsXG4gICAgLy8gc29tZSBhcyBnZXR0ZXJzLiBXZSByZWx5IG9uIHRoZSBmYWN0IHRoYXQgdGhleSBhcmUgYWxyZWFkeSBzb3J0ZWQgdG9wb2xvZ2ljYWxseS5cbiAgICB0aGlzLl9yZXNvbHZlZFByb3ZpZGVycy52YWx1ZXMoKS5mb3JFYWNoKChyZXNvbHZlZFByb3ZpZGVyKSA9PiB7XG4gICAgICB2YXIgcHJvdmlkZXJWYWx1ZUV4cHJlc3Npb25zID0gcmVzb2x2ZWRQcm92aWRlci5wcm92aWRlcnMubWFwKChwcm92aWRlcikgPT4ge1xuICAgICAgICBpZiAoaXNQcmVzZW50KHByb3ZpZGVyLnVzZUV4aXN0aW5nKSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9nZXREZXBlbmRlbmN5KFxuICAgICAgICAgICAgICByZXNvbHZlZFByb3ZpZGVyLnByb3ZpZGVyVHlwZSxcbiAgICAgICAgICAgICAgbmV3IENvbXBpbGVEaURlcGVuZGVuY3lNZXRhZGF0YSh7dG9rZW46IHByb3ZpZGVyLnVzZUV4aXN0aW5nfSkpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzUHJlc2VudChwcm92aWRlci51c2VGYWN0b3J5KSkge1xuICAgICAgICAgIHZhciBkZXBzID0gaXNQcmVzZW50KHByb3ZpZGVyLmRlcHMpID8gcHJvdmlkZXIuZGVwcyA6IHByb3ZpZGVyLnVzZUZhY3RvcnkuZGlEZXBzO1xuICAgICAgICAgIHZhciBkZXBzRXhwciA9IGRlcHMubWFwKChkZXApID0+IHRoaXMuX2dldERlcGVuZGVuY3kocmVzb2x2ZWRQcm92aWRlci5wcm92aWRlclR5cGUsIGRlcCkpO1xuICAgICAgICAgIHJldHVybiBvLmltcG9ydEV4cHIocHJvdmlkZXIudXNlRmFjdG9yeSkuY2FsbEZuKGRlcHNFeHByKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc1ByZXNlbnQocHJvdmlkZXIudXNlQ2xhc3MpKSB7XG4gICAgICAgICAgdmFyIGRlcHMgPSBpc1ByZXNlbnQocHJvdmlkZXIuZGVwcykgPyBwcm92aWRlci5kZXBzIDogcHJvdmlkZXIudXNlQ2xhc3MuZGlEZXBzO1xuICAgICAgICAgIHZhciBkZXBzRXhwciA9IGRlcHMubWFwKChkZXApID0+IHRoaXMuX2dldERlcGVuZGVuY3kocmVzb2x2ZWRQcm92aWRlci5wcm92aWRlclR5cGUsIGRlcCkpO1xuICAgICAgICAgIHJldHVybiBvLmltcG9ydEV4cHIocHJvdmlkZXIudXNlQ2xhc3MpXG4gICAgICAgICAgICAgIC5pbnN0YW50aWF0ZShkZXBzRXhwciwgby5pbXBvcnRUeXBlKHByb3ZpZGVyLnVzZUNsYXNzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHByb3ZpZGVyLnVzZVZhbHVlIGluc3RhbmNlb2YgQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIG8uaW1wb3J0RXhwcihwcm92aWRlci51c2VWYWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChwcm92aWRlci51c2VWYWx1ZSBpbnN0YW5jZW9mIG8uRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgcmV0dXJuIHByb3ZpZGVyLnVzZVZhbHVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gby5saXRlcmFsKHByb3ZpZGVyLnVzZVZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdmFyIHByb3BOYW1lID0gYF8ke3Jlc29sdmVkUHJvdmlkZXIudG9rZW4ubmFtZX1fJHt0aGlzLm5vZGVJbmRleH1fJHt0aGlzLl9pbnN0YW5jZXMuc2l6ZX1gO1xuICAgICAgdmFyIGluc3RhbmNlID1cbiAgICAgICAgICBjcmVhdGVQcm92aWRlclByb3BlcnR5KHByb3BOYW1lLCByZXNvbHZlZFByb3ZpZGVyLCBwcm92aWRlclZhbHVlRXhwcmVzc2lvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlZFByb3ZpZGVyLm11bHRpUHJvdmlkZXIsIHJlc29sdmVkUHJvdmlkZXIuZWFnZXIsIHRoaXMpO1xuICAgICAgdGhpcy5faW5zdGFuY2VzLmFkZChyZXNvbHZlZFByb3ZpZGVyLnRva2VuLCBpbnN0YW5jZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmRpcmVjdGl2ZUluc3RhbmNlcyA9XG4gICAgICAgIHRoaXMuX2RpcmVjdGl2ZXMubWFwKChkaXJlY3RpdmUpID0+IHRoaXMuX2luc3RhbmNlcy5nZXQoaWRlbnRpZmllclRva2VuKGRpcmVjdGl2ZS50eXBlKSkpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kaXJlY3RpdmVJbnN0YW5jZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkaXJlY3RpdmVJbnN0YW5jZSA9IHRoaXMuZGlyZWN0aXZlSW5zdGFuY2VzW2ldO1xuICAgICAgdmFyIGRpcmVjdGl2ZSA9IHRoaXMuX2RpcmVjdGl2ZXNbaV07XG4gICAgICBkaXJlY3RpdmUucXVlcmllcy5mb3JFYWNoKChxdWVyeU1ldGEpID0+IHsgdGhpcy5fYWRkUXVlcnkocXVlcnlNZXRhLCBkaXJlY3RpdmVJbnN0YW5jZSk7IH0pO1xuICAgIH1cbiAgICB2YXIgcXVlcmllc1dpdGhSZWFkczogX1F1ZXJ5V2l0aFJlYWRbXSA9IFtdO1xuICAgIHRoaXMuX3Jlc29sdmVkUHJvdmlkZXJzLnZhbHVlcygpLmZvckVhY2goKHJlc29sdmVkUHJvdmlkZXIpID0+IHtcbiAgICAgIHZhciBxdWVyaWVzRm9yUHJvdmlkZXIgPSB0aGlzLl9nZXRRdWVyaWVzRm9yKHJlc29sdmVkUHJvdmlkZXIudG9rZW4pO1xuICAgICAgTGlzdFdyYXBwZXIuYWRkQWxsKFxuICAgICAgICAgIHF1ZXJpZXNXaXRoUmVhZHMsXG4gICAgICAgICAgcXVlcmllc0ZvclByb3ZpZGVyLm1hcChxdWVyeSA9PiBuZXcgX1F1ZXJ5V2l0aFJlYWQocXVlcnksIHJlc29sdmVkUHJvdmlkZXIudG9rZW4pKSk7XG4gICAgfSk7XG4gICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKHRoaXMudmFyaWFibGVUb2tlbnMsIChfLCB2YXJOYW1lKSA9PiB7XG4gICAgICB2YXIgdG9rZW4gPSB0aGlzLnZhcmlhYmxlVG9rZW5zW3Zhck5hbWVdO1xuICAgICAgdmFyIHZhclZhbHVlO1xuICAgICAgaWYgKGlzUHJlc2VudCh0b2tlbikpIHtcbiAgICAgICAgdmFyVmFsdWUgPSB0aGlzLl9pbnN0YW5jZXMuZ2V0KHRva2VuKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhclZhbHVlID0gdGhpcy5yZW5kZXJOb2RlO1xuICAgICAgfVxuICAgICAgdGhpcy52aWV3LnZhcmlhYmxlcy5zZXQodmFyTmFtZSwgdmFyVmFsdWUpO1xuICAgICAgdmFyIHZhclRva2VuID0gbmV3IENvbXBpbGVUb2tlbk1ldGFkYXRhKHt2YWx1ZTogdmFyTmFtZX0pO1xuICAgICAgTGlzdFdyYXBwZXIuYWRkQWxsKHF1ZXJpZXNXaXRoUmVhZHMsIHRoaXMuX2dldFF1ZXJpZXNGb3IodmFyVG9rZW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAocXVlcnkgPT4gbmV3IF9RdWVyeVdpdGhSZWFkKHF1ZXJ5LCB2YXJUb2tlbikpKTtcbiAgICB9KTtcbiAgICBxdWVyaWVzV2l0aFJlYWRzLmZvckVhY2goKHF1ZXJ5V2l0aFJlYWQpID0+IHtcbiAgICAgIHZhciB2YWx1ZTogby5FeHByZXNzaW9uO1xuICAgICAgaWYgKGlzUHJlc2VudChxdWVyeVdpdGhSZWFkLnJlYWQuaWRlbnRpZmllcikpIHtcbiAgICAgICAgLy8gcXVlcnkgZm9yIGFuIGlkZW50aWZpZXJcbiAgICAgICAgdmFsdWUgPSB0aGlzLl9pbnN0YW5jZXMuZ2V0KHF1ZXJ5V2l0aFJlYWQucmVhZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBxdWVyeSBmb3IgYSB2YXJpYWJsZVxuICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLnZhcmlhYmxlVG9rZW5zW3F1ZXJ5V2l0aFJlYWQucmVhZC52YWx1ZV07XG4gICAgICAgIGlmIChpc1ByZXNlbnQodG9rZW4pKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLl9pbnN0YW5jZXMuZ2V0KHRva2VuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuZWxlbWVudFJlZjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGlzUHJlc2VudCh2YWx1ZSkpIHtcbiAgICAgICAgcXVlcnlXaXRoUmVhZC5xdWVyeS5hZGRWYWx1ZSh2YWx1ZSwgdGhpcy52aWV3KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChpc1ByZXNlbnQodGhpcy5jb21wb25lbnQpKSB7XG4gICAgICB2YXIgY29tcG9uZW50Q29uc3RydWN0b3JWaWV3UXVlcnlMaXN0ID1cbiAgICAgICAgICBpc1ByZXNlbnQodGhpcy5jb21wb25lbnQpID8gby5saXRlcmFsQXJyKHRoaXMuX2NvbXBvbmVudENvbnN0cnVjdG9yVmlld1F1ZXJ5TGlzdHMpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby5OVUxMX0VYUFI7XG4gICAgICB2YXIgY29tcEV4cHIgPSBpc1ByZXNlbnQodGhpcy5nZXRDb21wb25lbnQoKSkgPyB0aGlzLmdldENvbXBvbmVudCgpIDogby5OVUxMX0VYUFI7XG4gICAgICB0aGlzLnZpZXcuY3JlYXRlTWV0aG9kLmFkZFN0bXQoXG4gICAgICAgICAgdGhpcy5hcHBFbGVtZW50LmNhbGxNZXRob2QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpbml0Q29tcG9uZW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2NvbXBFeHByLCBjb21wb25lbnRDb25zdHJ1Y3RvclZpZXdRdWVyeUxpc3QsIHRoaXMuX2NvbXBWaWV3RXhwcl0pXG4gICAgICAgICAgICAgIC50b1N0bXQoKSk7XG4gICAgfVxuICB9XG5cbiAgYWZ0ZXJDaGlsZHJlbihjaGlsZE5vZGVDb3VudDogbnVtYmVyKSB7XG4gICAgdGhpcy5fcmVzb2x2ZWRQcm92aWRlcnMudmFsdWVzKCkuZm9yRWFjaCgocmVzb2x2ZWRQcm92aWRlcikgPT4ge1xuICAgICAgLy8gTm90ZTogYWZ0ZXJDaGlsZHJlbiBpcyBjYWxsZWQgYWZ0ZXIgcmVjdXJzaW5nIGludG8gY2hpbGRyZW4uXG4gICAgICAvLyBUaGlzIGlzIGdvb2Qgc28gdGhhdCBhbiBpbmplY3RvciBtYXRjaCBpbiBhbiBlbGVtZW50IHRoYXQgaXMgY2xvc2VyIHRvIGEgcmVxdWVzdGluZyBlbGVtZW50XG4gICAgICAvLyBtYXRjaGVzIGZpcnN0LlxuICAgICAgdmFyIHByb3ZpZGVyRXhwciA9IHRoaXMuX2luc3RhbmNlcy5nZXQocmVzb2x2ZWRQcm92aWRlci50b2tlbik7XG4gICAgICAvLyBOb3RlOiB2aWV3IHByb3ZpZGVycyBhcmUgb25seSB2aXNpYmxlIG9uIHRoZSBpbmplY3RvciBvZiB0aGF0IGVsZW1lbnQuXG4gICAgICAvLyBUaGlzIGlzIG5vdCBmdWxseSBjb3JyZWN0IGFzIHRoZSBydWxlcyBkdXJpbmcgY29kZWdlbiBkb24ndCBhbGxvdyBhIGRpcmVjdGl2ZVxuICAgICAgLy8gdG8gZ2V0IGhvbGQgb2YgYSB2aWV3IHByb3ZkaWVyIG9uIHRoZSBzYW1lIGVsZW1lbnQuIFdlIHN0aWxsIGRvIHRoaXMgc2VtYW50aWNcbiAgICAgIC8vIGFzIGl0IHNpbXBsaWZpZXMgb3VyIG1vZGVsIHRvIGhhdmluZyBvbmx5IG9uZSBydW50aW1lIGluamVjdG9yIHBlciBlbGVtZW50LlxuICAgICAgdmFyIHByb3ZpZGVyQ2hpbGROb2RlQ291bnQgPVxuICAgICAgICAgIHJlc29sdmVkUHJvdmlkZXIucHJvdmlkZXJUeXBlID09PSBQcm92aWRlckFzdFR5cGUuUHJpdmF0ZVNlcnZpY2UgPyAwIDogY2hpbGROb2RlQ291bnQ7XG4gICAgICB0aGlzLnZpZXcuaW5qZWN0b3JHZXRNZXRob2QuYWRkU3RtdChjcmVhdGVJbmplY3RJbnRlcm5hbENvbmRpdGlvbihcbiAgICAgICAgICB0aGlzLm5vZGVJbmRleCwgcHJvdmlkZXJDaGlsZE5vZGVDb3VudCwgcmVzb2x2ZWRQcm92aWRlciwgcHJvdmlkZXJFeHByKSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9xdWVyaWVzLnZhbHVlcygpLmZvckVhY2goXG4gICAgICAgIChxdWVyaWVzKSA9PlxuICAgICAgICAgICAgcXVlcmllcy5mb3JFYWNoKChxdWVyeSkgPT4gcXVlcnkuYWZ0ZXJDaGlsZHJlbih0aGlzLnZpZXcudXBkYXRlQ29udGVudFF1ZXJpZXNNZXRob2QpKSk7XG4gIH1cblxuICBhZGRDb250ZW50Tm9kZShuZ0NvbnRlbnRJbmRleDogbnVtYmVyLCBub2RlRXhwcjogby5FeHByZXNzaW9uKSB7XG4gICAgdGhpcy5jb250ZW50Tm9kZXNCeU5nQ29udGVudEluZGV4W25nQ29udGVudEluZGV4XS5wdXNoKG5vZGVFeHByKTtcbiAgfVxuXG4gIGdldENvbXBvbmVudCgpOiBvLkV4cHJlc3Npb24ge1xuICAgIHJldHVybiBpc1ByZXNlbnQodGhpcy5jb21wb25lbnQpID8gdGhpcy5faW5zdGFuY2VzLmdldChpZGVudGlmaWVyVG9rZW4odGhpcy5jb21wb25lbnQudHlwZSkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGw7XG4gIH1cblxuICBnZXRQcm92aWRlclRva2VucygpOiBvLkV4cHJlc3Npb25bXSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jlc29sdmVkUHJvdmlkZXJzLnZhbHVlcygpLm1hcChcbiAgICAgICAgKHJlc29sdmVkUHJvdmlkZXIpID0+IGNyZWF0ZURpVG9rZW5FeHByZXNzaW9uKHJlc29sdmVkUHJvdmlkZXIudG9rZW4pKTtcbiAgfVxuXG4gIGdldERlY2xhcmVkVmFyaWFibGVzTmFtZXMoKTogc3RyaW5nW10ge1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBTdHJpbmdNYXBXcmFwcGVyLmZvckVhY2godGhpcy52YXJpYWJsZVRva2VucywgKF8sIGtleSkgPT4geyByZXMucHVzaChrZXkpOyB9KTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UXVlcmllc0Zvcih0b2tlbjogQ29tcGlsZVRva2VuTWV0YWRhdGEpOiBDb21waWxlUXVlcnlbXSB7XG4gICAgdmFyIHJlc3VsdDogQ29tcGlsZVF1ZXJ5W10gPSBbXTtcbiAgICB2YXIgY3VycmVudEVsOiBDb21waWxlRWxlbWVudCA9IHRoaXM7XG4gICAgdmFyIGRpc3RhbmNlID0gMDtcbiAgICB2YXIgcXVlcmllczogQ29tcGlsZVF1ZXJ5W107XG4gICAgd2hpbGUgKCFjdXJyZW50RWwuaXNOdWxsKCkpIHtcbiAgICAgIHF1ZXJpZXMgPSBjdXJyZW50RWwuX3F1ZXJpZXMuZ2V0KHRva2VuKTtcbiAgICAgIGlmIChpc1ByZXNlbnQocXVlcmllcykpIHtcbiAgICAgICAgTGlzdFdyYXBwZXIuYWRkQWxsKHJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJpZXMuZmlsdGVyKChxdWVyeSkgPT4gcXVlcnkubWV0YS5kZXNjZW5kYW50cyB8fCBkaXN0YW5jZSA8PSAxKSk7XG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudEVsLl9kaXJlY3RpdmVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGlzdGFuY2UrKztcbiAgICAgIH1cbiAgICAgIGN1cnJlbnRFbCA9IGN1cnJlbnRFbC5wYXJlbnQ7XG4gICAgfVxuICAgIHF1ZXJpZXMgPSB0aGlzLnZpZXcuY29tcG9uZW50Vmlldy52aWV3UXVlcmllcy5nZXQodG9rZW4pO1xuICAgIGlmIChpc1ByZXNlbnQocXVlcmllcykpIHtcbiAgICAgIExpc3RXcmFwcGVyLmFkZEFsbChyZXN1bHQsIHF1ZXJpZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBfYWRkUXVlcnkocXVlcnlNZXRhOiBDb21waWxlUXVlcnlNZXRhZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlSW5zdGFuY2U6IG8uRXhwcmVzc2lvbik6IENvbXBpbGVRdWVyeSB7XG4gICAgdmFyIHByb3BOYW1lID0gYF9xdWVyeV8ke3F1ZXJ5TWV0YS5zZWxlY3RvcnNbMF0ubmFtZX1fJHt0aGlzLm5vZGVJbmRleH1fJHt0aGlzLl9xdWVyeUNvdW50Kyt9YDtcbiAgICB2YXIgcXVlcnlMaXN0ID0gY3JlYXRlUXVlcnlMaXN0KHF1ZXJ5TWV0YSwgZGlyZWN0aXZlSW5zdGFuY2UsIHByb3BOYW1lLCB0aGlzLnZpZXcpO1xuICAgIHZhciBxdWVyeSA9IG5ldyBDb21waWxlUXVlcnkocXVlcnlNZXRhLCBxdWVyeUxpc3QsIGRpcmVjdGl2ZUluc3RhbmNlLCB0aGlzLnZpZXcpO1xuICAgIGFkZFF1ZXJ5VG9Ub2tlbk1hcCh0aGlzLl9xdWVyaWVzLCBxdWVyeSk7XG4gICAgcmV0dXJuIHF1ZXJ5O1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0TG9jYWxEZXBlbmRlbmN5KHJlcXVlc3RpbmdQcm92aWRlclR5cGU6IFByb3ZpZGVyQXN0VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcDogQ29tcGlsZURpRGVwZW5kZW5jeU1ldGFkYXRhKTogby5FeHByZXNzaW9uIHtcbiAgICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgICAvLyBjb25zdHJ1Y3RvciBjb250ZW50IHF1ZXJ5XG4gICAgaWYgKGlzQmxhbmsocmVzdWx0KSAmJiBpc1ByZXNlbnQoZGVwLnF1ZXJ5KSkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5fYWRkUXVlcnkoZGVwLnF1ZXJ5LCBudWxsKS5xdWVyeUxpc3Q7XG4gICAgfVxuXG4gICAgLy8gY29uc3RydWN0b3IgdmlldyBxdWVyeVxuICAgIGlmIChpc0JsYW5rKHJlc3VsdCkgJiYgaXNQcmVzZW50KGRlcC52aWV3UXVlcnkpKSB7XG4gICAgICByZXN1bHQgPSBjcmVhdGVRdWVyeUxpc3QoXG4gICAgICAgICAgZGVwLnZpZXdRdWVyeSwgbnVsbCxcbiAgICAgICAgICBgX3ZpZXdRdWVyeV8ke2RlcC52aWV3UXVlcnkuc2VsZWN0b3JzWzBdLm5hbWV9XyR7dGhpcy5ub2RlSW5kZXh9XyR7dGhpcy5fY29tcG9uZW50Q29uc3RydWN0b3JWaWV3UXVlcnlMaXN0cy5sZW5ndGh9YCxcbiAgICAgICAgICB0aGlzLnZpZXcpO1xuICAgICAgdGhpcy5fY29tcG9uZW50Q29uc3RydWN0b3JWaWV3UXVlcnlMaXN0cy5wdXNoKHJlc3VsdCk7XG4gICAgfVxuXG4gICAgaWYgKGlzUHJlc2VudChkZXAudG9rZW4pKSB7XG4gICAgICAvLyBhY2Nlc3MgYnVpbHRpbnMgd2l0aCBzcGVjaWFsIHZpc2liaWxpdHlcbiAgICAgIGlmIChpc0JsYW5rKHJlc3VsdCkpIHtcbiAgICAgICAgaWYgKGRlcC50b2tlbi5lcXVhbHNUbyhpZGVudGlmaWVyVG9rZW4oSWRlbnRpZmllcnMuQ2hhbmdlRGV0ZWN0b3JSZWYpKSkge1xuICAgICAgICAgIGlmIChyZXF1ZXN0aW5nUHJvdmlkZXJUeXBlID09PSBQcm92aWRlckFzdFR5cGUuQ29tcG9uZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY29tcFZpZXdFeHByLnByb3AoJ3JlZicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gby5USElTX0VYUFIucHJvcCgncmVmJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBhY2Nlc3MgcmVndWxhciBwcm92aWRlcnMgb24gdGhlIGVsZW1lbnRcbiAgICAgIGlmIChpc0JsYW5rKHJlc3VsdCkpIHtcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5faW5zdGFuY2VzLmdldChkZXAudG9rZW4pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0RGVwZW5kZW5jeShyZXF1ZXN0aW5nUHJvdmlkZXJUeXBlOiBQcm92aWRlckFzdFR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgZGVwOiBDb21waWxlRGlEZXBlbmRlbmN5TWV0YWRhdGEpOiBvLkV4cHJlc3Npb24ge1xuICAgIHZhciBjdXJyRWxlbWVudDogQ29tcGlsZUVsZW1lbnQgPSB0aGlzO1xuICAgIHZhciByZXN1bHQgPSBudWxsO1xuICAgIGlmIChkZXAuaXNWYWx1ZSkge1xuICAgICAgcmVzdWx0ID0gby5saXRlcmFsKGRlcC52YWx1ZSk7XG4gICAgfVxuICAgIGlmIChpc0JsYW5rKHJlc3VsdCkgJiYgIWRlcC5pc1NraXBTZWxmKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLl9nZXRMb2NhbERlcGVuZGVuY3kocmVxdWVzdGluZ1Byb3ZpZGVyVHlwZSwgZGVwKTtcbiAgICB9XG4gICAgLy8gY2hlY2sgcGFyZW50IGVsZW1lbnRzXG4gICAgd2hpbGUgKGlzQmxhbmsocmVzdWx0KSAmJiAhY3VyckVsZW1lbnQucGFyZW50LmlzTnVsbCgpKSB7XG4gICAgICBjdXJyRWxlbWVudCA9IGN1cnJFbGVtZW50LnBhcmVudDtcbiAgICAgIHJlc3VsdCA9IGN1cnJFbGVtZW50Ll9nZXRMb2NhbERlcGVuZGVuY3koUHJvdmlkZXJBc3RUeXBlLlB1YmxpY1NlcnZpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBDb21waWxlRGlEZXBlbmRlbmN5TWV0YWRhdGEoe3Rva2VuOiBkZXAudG9rZW59KSk7XG4gICAgfVxuXG4gICAgaWYgKGlzQmxhbmsocmVzdWx0KSkge1xuICAgICAgcmVzdWx0ID0gaW5qZWN0RnJvbVZpZXdQYXJlbnRJbmplY3RvcihkZXAudG9rZW4sIGRlcC5pc09wdGlvbmFsKTtcbiAgICB9XG4gICAgaWYgKGlzQmxhbmsocmVzdWx0KSkge1xuICAgICAgcmVzdWx0ID0gby5OVUxMX0VYUFI7XG4gICAgfVxuICAgIHJldHVybiBnZXRQcm9wZXJ0eUluVmlldyhyZXN1bHQsIHRoaXMudmlldywgY3VyckVsZW1lbnQudmlldyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlSW5qZWN0SW50ZXJuYWxDb25kaXRpb24obm9kZUluZGV4OiBudW1iZXIsIGNoaWxkTm9kZUNvdW50OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlcjogUHJvdmlkZXJBc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlckV4cHI6IG8uRXhwcmVzc2lvbik6IG8uU3RhdGVtZW50IHtcbiAgdmFyIGluZGV4Q29uZGl0aW9uO1xuICBpZiAoY2hpbGROb2RlQ291bnQgPiAwKSB7XG4gICAgaW5kZXhDb25kaXRpb24gPSBvLmxpdGVyYWwobm9kZUluZGV4KVxuICAgICAgICAgICAgICAgICAgICAgICAgIC5sb3dlckVxdWFscyhJbmplY3RNZXRob2RWYXJzLnJlcXVlc3ROb2RlSW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgLmFuZChJbmplY3RNZXRob2RWYXJzLnJlcXVlc3ROb2RlSW5kZXgubG93ZXJFcXVhbHMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8ubGl0ZXJhbChub2RlSW5kZXggKyBjaGlsZE5vZGVDb3VudCkpKTtcbiAgfSBlbHNlIHtcbiAgICBpbmRleENvbmRpdGlvbiA9IG8ubGl0ZXJhbChub2RlSW5kZXgpLmlkZW50aWNhbChJbmplY3RNZXRob2RWYXJzLnJlcXVlc3ROb2RlSW5kZXgpO1xuICB9XG4gIHJldHVybiBuZXcgby5JZlN0bXQoXG4gICAgICBJbmplY3RNZXRob2RWYXJzLnRva2VuLmlkZW50aWNhbChjcmVhdGVEaVRva2VuRXhwcmVzc2lvbihwcm92aWRlci50b2tlbikpLmFuZChpbmRleENvbmRpdGlvbiksXG4gICAgICBbbmV3IG8uUmV0dXJuU3RhdGVtZW50KHByb3ZpZGVyRXhwcildKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUHJvdmlkZXJQcm9wZXJ0eShwcm9wTmFtZTogc3RyaW5nLCBwcm92aWRlcjogUHJvdmlkZXJBc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyVmFsdWVFeHByZXNzaW9uczogby5FeHByZXNzaW9uW10sIGlzTXVsdGk6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRWFnZXI6IGJvb2xlYW4sIGNvbXBpbGVFbGVtZW50OiBDb21waWxlRWxlbWVudCk6IG8uRXhwcmVzc2lvbiB7XG4gIHZhciB2aWV3ID0gY29tcGlsZUVsZW1lbnQudmlldztcbiAgdmFyIHJlc29sdmVkUHJvdmlkZXJWYWx1ZUV4cHI7XG4gIHZhciB0eXBlO1xuICBpZiAoaXNNdWx0aSkge1xuICAgIHJlc29sdmVkUHJvdmlkZXJWYWx1ZUV4cHIgPSBvLmxpdGVyYWxBcnIocHJvdmlkZXJWYWx1ZUV4cHJlc3Npb25zKTtcbiAgICB0eXBlID0gbmV3IG8uQXJyYXlUeXBlKG8uRFlOQU1JQ19UWVBFKTtcbiAgfSBlbHNlIHtcbiAgICByZXNvbHZlZFByb3ZpZGVyVmFsdWVFeHByID0gcHJvdmlkZXJWYWx1ZUV4cHJlc3Npb25zWzBdO1xuICAgIHR5cGUgPSBwcm92aWRlclZhbHVlRXhwcmVzc2lvbnNbMF0udHlwZTtcbiAgfVxuICBpZiAoaXNCbGFuayh0eXBlKSkge1xuICAgIHR5cGUgPSBvLkRZTkFNSUNfVFlQRTtcbiAgfVxuICBpZiAoaXNFYWdlcikge1xuICAgIHZpZXcuZmllbGRzLnB1c2gobmV3IG8uQ2xhc3NGaWVsZChwcm9wTmFtZSwgdHlwZSwgW28uU3RtdE1vZGlmaWVyLlByaXZhdGVdKSk7XG4gICAgdmlldy5jcmVhdGVNZXRob2QuYWRkU3RtdChvLlRISVNfRVhQUi5wcm9wKHByb3BOYW1lKS5zZXQocmVzb2x2ZWRQcm92aWRlclZhbHVlRXhwcikudG9TdG10KCkpO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbnRlcm5hbEZpZWxkID0gYF8ke3Byb3BOYW1lfWA7XG4gICAgdmlldy5maWVsZHMucHVzaChuZXcgby5DbGFzc0ZpZWxkKGludGVybmFsRmllbGQsIHR5cGUsIFtvLlN0bXRNb2RpZmllci5Qcml2YXRlXSkpO1xuICAgIHZhciBnZXR0ZXIgPSBuZXcgQ29tcGlsZU1ldGhvZCh2aWV3KTtcbiAgICBnZXR0ZXIucmVzZXREZWJ1Z0luZm8oY29tcGlsZUVsZW1lbnQubm9kZUluZGV4LCBjb21waWxlRWxlbWVudC5zb3VyY2VBc3QpO1xuICAgIC8vIE5vdGU6IEVxdWFscyBpcyBpbXBvcnRhbnQgZm9yIEpTIHNvIHRoYXQgaXQgYWxzbyBjaGVja3MgdGhlIHVuZGVmaW5lZCBjYXNlIVxuICAgIGdldHRlci5hZGRTdG10KFxuICAgICAgICBuZXcgby5JZlN0bXQoby5USElTX0VYUFIucHJvcChpbnRlcm5hbEZpZWxkKS5pc0JsYW5rKCksXG4gICAgICAgICAgICAgICAgICAgICBbby5USElTX0VYUFIucHJvcChpbnRlcm5hbEZpZWxkKS5zZXQocmVzb2x2ZWRQcm92aWRlclZhbHVlRXhwcikudG9TdG10KCldKSk7XG4gICAgZ2V0dGVyLmFkZFN0bXQobmV3IG8uUmV0dXJuU3RhdGVtZW50KG8uVEhJU19FWFBSLnByb3AoaW50ZXJuYWxGaWVsZCkpKTtcbiAgICB2aWV3LmdldHRlcnMucHVzaChuZXcgby5DbGFzc0dldHRlcihwcm9wTmFtZSwgZ2V0dGVyLmZpbmlzaCgpLCB0eXBlKSk7XG4gIH1cbiAgcmV0dXJuIG8uVEhJU19FWFBSLnByb3AocHJvcE5hbWUpO1xufVxuXG5jbGFzcyBfUXVlcnlXaXRoUmVhZCB7XG4gIHB1YmxpYyByZWFkOiBDb21waWxlVG9rZW5NZXRhZGF0YTtcbiAgY29uc3RydWN0b3IocHVibGljIHF1ZXJ5OiBDb21waWxlUXVlcnksIG1hdGNoOiBDb21waWxlVG9rZW5NZXRhZGF0YSkge1xuICAgIHRoaXMucmVhZCA9IGlzUHJlc2VudChxdWVyeS5tZXRhLnJlYWQpID8gcXVlcnkubWV0YS5yZWFkIDogbWF0Y2g7XG4gIH1cbn1cbiJdfQ==