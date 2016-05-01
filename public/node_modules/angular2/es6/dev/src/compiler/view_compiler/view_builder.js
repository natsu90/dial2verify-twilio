import { isPresent, StringWrapper } from 'angular2/src/facade/lang';
import { ListWrapper, StringMapWrapper, SetWrapper } from 'angular2/src/facade/collection';
import * as o from '../output/output_ast';
import { Identifiers, identifierToken } from '../identifiers';
import { ViewConstructorVars, InjectMethodVars, DetectChangesVars, ViewTypeEnum, ViewEncapsulationEnum, ChangeDetectionStrategyEnum, ViewProperties } from './constants';
import { ChangeDetectionStrategy, isDefaultChangeDetectionStrategy } from 'angular2/src/core/change_detection/change_detection';
import { CompileView } from './compile_view';
import { CompileElement, CompileNode } from './compile_element';
import { templateVisitAll } from '../template_ast';
import { getViewFactoryName, createFlatArray, createDiTokenExpression } from './util';
import { ViewType } from 'angular2/src/core/linker/view_type';
import { ViewEncapsulation } from 'angular2/src/core/metadata/view';
import { CompileIdentifierMetadata } from '../compile_metadata';
import { bindView } from './view_binder';
const IMPLICIT_TEMPLATE_VAR = '\$implicit';
const CLASS_ATTR = 'class';
const STYLE_ATTR = 'style';
var parentRenderNodeVar = o.variable('parentRenderNode');
var rootSelectorVar = o.variable('rootSelector');
export class ViewCompileDependency {
    constructor(comp, factoryPlaceholder) {
        this.comp = comp;
        this.factoryPlaceholder = factoryPlaceholder;
    }
}
export function buildView(view, template, targetDependencies, targetStatements) {
    var builderVisitor = new ViewBuilderVisitor(view, targetDependencies, targetStatements);
    templateVisitAll(builderVisitor, template, view.declarationElement.isNull() ?
        view.declarationElement :
        view.declarationElement.parent);
    // Need to separate binding from creation to be able to refer to
    // variables that have been declared after usage.
    bindView(view, template);
    view.afterNodes();
    createViewTopLevelStmts(view, targetStatements);
    return builderVisitor.nestedViewCount;
}
class ViewBuilderVisitor {
    constructor(view, targetDependencies, targetStatements) {
        this.view = view;
        this.targetDependencies = targetDependencies;
        this.targetStatements = targetStatements;
        this.nestedViewCount = 0;
    }
    _isRootNode(parent) { return parent.view !== this.view; }
    _addRootNodeAndProject(node, ngContentIndex, parent) {
        var vcAppEl = (node instanceof CompileElement && node.hasViewContainer) ? node.appElement : null;
        if (this._isRootNode(parent)) {
            // store appElement as root node only for ViewContainers
            if (this.view.viewType !== ViewType.COMPONENT) {
                this.view.rootNodesOrAppElements.push(isPresent(vcAppEl) ? vcAppEl : node.renderNode);
            }
        }
        else if (isPresent(parent.component) && isPresent(ngContentIndex)) {
            parent.addContentNode(ngContentIndex, isPresent(vcAppEl) ? vcAppEl : node.renderNode);
        }
    }
    _getParentRenderNode(parent) {
        if (this._isRootNode(parent)) {
            if (this.view.viewType === ViewType.COMPONENT) {
                return parentRenderNodeVar;
            }
            else {
                // root node of an embedded/host view
                return o.NULL_EXPR;
            }
        }
        else {
            return isPresent(parent.component) &&
                parent.component.template.encapsulation !== ViewEncapsulation.Native ?
                o.NULL_EXPR :
                parent.renderNode;
        }
    }
    visitBoundText(ast, parent) {
        return this._visitText(ast, '', ast.ngContentIndex, parent);
    }
    visitText(ast, parent) {
        return this._visitText(ast, ast.value, ast.ngContentIndex, parent);
    }
    _visitText(ast, value, ngContentIndex, parent) {
        var fieldName = `_text_${this.view.nodes.length}`;
        this.view.fields.push(new o.ClassField(fieldName, o.importType(this.view.genConfig.renderTypes.renderText), [o.StmtModifier.Private]));
        var renderNode = o.THIS_EXPR.prop(fieldName);
        var compileNode = new CompileNode(parent, this.view, this.view.nodes.length, renderNode, ast);
        var createRenderNode = o.THIS_EXPR.prop(fieldName)
            .set(ViewProperties.renderer.callMethod('createText', [
            this._getParentRenderNode(parent),
            o.literal(value),
            this.view.createMethod.resetDebugInfoExpr(this.view.nodes.length, ast)
        ]))
            .toStmt();
        this.view.nodes.push(compileNode);
        this.view.createMethod.addStmt(createRenderNode);
        this._addRootNodeAndProject(compileNode, ngContentIndex, parent);
        return renderNode;
    }
    visitNgContent(ast, parent) {
        // the projected nodes originate from a different view, so we don't
        // have debug information for them...
        this.view.createMethod.resetDebugInfo(null, ast);
        var parentRenderNode = this._getParentRenderNode(parent);
        var nodesExpression = ViewProperties.projectableNodes.key(o.literal(ast.index), new o.ArrayType(o.importType(this.view.genConfig.renderTypes.renderNode)));
        if (parentRenderNode !== o.NULL_EXPR) {
            this.view.createMethod.addStmt(ViewProperties.renderer.callMethod('projectNodes', [
                parentRenderNode,
                o.importExpr(Identifiers.flattenNestedViewRenderNodes)
                    .callFn([nodesExpression])
            ])
                .toStmt());
        }
        else if (this._isRootNode(parent)) {
            if (this.view.viewType !== ViewType.COMPONENT) {
                // store root nodes only for embedded/host views
                this.view.rootNodesOrAppElements.push(nodesExpression);
            }
        }
        else {
            if (isPresent(parent.component) && isPresent(ast.ngContentIndex)) {
                parent.addContentNode(ast.ngContentIndex, nodesExpression);
            }
        }
        return null;
    }
    visitElement(ast, parent) {
        var nodeIndex = this.view.nodes.length;
        var createRenderNodeExpr;
        var debugContextExpr = this.view.createMethod.resetDebugInfoExpr(nodeIndex, ast);
        if (nodeIndex === 0 && this.view.viewType === ViewType.HOST) {
            createRenderNodeExpr = o.THIS_EXPR.callMethod('selectOrCreateHostElement', [o.literal(ast.name), rootSelectorVar, debugContextExpr]);
        }
        else {
            createRenderNodeExpr = ViewProperties.renderer.callMethod('createElement', [this._getParentRenderNode(parent), o.literal(ast.name), debugContextExpr]);
        }
        var fieldName = `_el_${nodeIndex}`;
        this.view.fields.push(new o.ClassField(fieldName, o.importType(this.view.genConfig.renderTypes.renderElement), [o.StmtModifier.Private]));
        this.view.createMethod.addStmt(o.THIS_EXPR.prop(fieldName).set(createRenderNodeExpr).toStmt());
        var renderNode = o.THIS_EXPR.prop(fieldName);
        var component = ast.getComponent();
        var directives = ast.directives.map(directiveAst => directiveAst.directive);
        var variables = _readHtmlAndDirectiveVariables(ast.exportAsVars, ast.directives, this.view.viewType);
        var htmlAttrs = _readHtmlAttrs(ast.attrs);
        var attrNameAndValues = _mergeHtmlAndDirectiveAttrs(htmlAttrs, directives);
        for (var i = 0; i < attrNameAndValues.length; i++) {
            var attrName = attrNameAndValues[i][0];
            var attrValue = attrNameAndValues[i][1];
            this.view.createMethod.addStmt(ViewProperties.renderer.callMethod('setElementAttribute', [renderNode, o.literal(attrName), o.literal(attrValue)])
                .toStmt());
        }
        var compileElement = new CompileElement(parent, this.view, nodeIndex, renderNode, ast, component, directives, ast.providers, ast.hasViewContainer, false, variables);
        this.view.nodes.push(compileElement);
        var compViewExpr = null;
        if (isPresent(component)) {
            var nestedComponentIdentifier = new CompileIdentifierMetadata({ name: getViewFactoryName(component, 0) });
            this.targetDependencies.push(new ViewCompileDependency(component, nestedComponentIdentifier));
            compViewExpr = o.variable(`compView_${nodeIndex}`);
            compileElement.setComponentView(compViewExpr);
            this.view.createMethod.addStmt(compViewExpr.set(o.importExpr(nestedComponentIdentifier)
                .callFn([
                ViewProperties.viewUtils,
                compileElement.injector,
                compileElement.appElement
            ]))
                .toDeclStmt());
        }
        compileElement.beforeChildren();
        this._addRootNodeAndProject(compileElement, ast.ngContentIndex, parent);
        templateVisitAll(this, ast.children, compileElement);
        compileElement.afterChildren(this.view.nodes.length - nodeIndex - 1);
        if (isPresent(compViewExpr)) {
            var codeGenContentNodes;
            if (this.view.component.type.isHost) {
                codeGenContentNodes = ViewProperties.projectableNodes;
            }
            else {
                codeGenContentNodes = o.literalArr(compileElement.contentNodesByNgContentIndex.map(nodes => createFlatArray(nodes)));
            }
            this.view.createMethod.addStmt(compViewExpr.callMethod('create', [codeGenContentNodes, o.NULL_EXPR]).toStmt());
        }
        return null;
    }
    visitEmbeddedTemplate(ast, parent) {
        var nodeIndex = this.view.nodes.length;
        var fieldName = `_anchor_${nodeIndex}`;
        this.view.fields.push(new o.ClassField(fieldName, o.importType(this.view.genConfig.renderTypes.renderComment), [o.StmtModifier.Private]));
        this.view.createMethod.addStmt(o.THIS_EXPR.prop(fieldName)
            .set(ViewProperties.renderer.callMethod('createTemplateAnchor', [
            this._getParentRenderNode(parent),
            this.view.createMethod.resetDebugInfoExpr(nodeIndex, ast)
        ]))
            .toStmt());
        var renderNode = o.THIS_EXPR.prop(fieldName);
        var templateVariableBindings = ast.vars.map(varAst => [varAst.value.length > 0 ? varAst.value : IMPLICIT_TEMPLATE_VAR, varAst.name]);
        var directives = ast.directives.map(directiveAst => directiveAst.directive);
        var compileElement = new CompileElement(parent, this.view, nodeIndex, renderNode, ast, null, directives, ast.providers, ast.hasViewContainer, true, {});
        this.view.nodes.push(compileElement);
        this.nestedViewCount++;
        var embeddedView = new CompileView(this.view.component, this.view.genConfig, this.view.pipeMetas, o.NULL_EXPR, this.view.viewIndex + this.nestedViewCount, compileElement, templateVariableBindings);
        this.nestedViewCount +=
            buildView(embeddedView, ast.children, this.targetDependencies, this.targetStatements);
        compileElement.beforeChildren();
        this._addRootNodeAndProject(compileElement, ast.ngContentIndex, parent);
        compileElement.afterChildren(0);
        return null;
    }
    visitAttr(ast, ctx) { return null; }
    visitDirective(ast, ctx) { return null; }
    visitEvent(ast, eventTargetAndNames) {
        return null;
    }
    visitVariable(ast, ctx) { return null; }
    visitDirectiveProperty(ast, context) { return null; }
    visitElementProperty(ast, context) { return null; }
}
function _mergeHtmlAndDirectiveAttrs(declaredHtmlAttrs, directives) {
    var result = {};
    StringMapWrapper.forEach(declaredHtmlAttrs, (value, key) => { result[key] = value; });
    directives.forEach(directiveMeta => {
        StringMapWrapper.forEach(directiveMeta.hostAttributes, (value, name) => {
            var prevValue = result[name];
            result[name] = isPresent(prevValue) ? mergeAttributeValue(name, prevValue, value) : value;
        });
    });
    return mapToKeyValueArray(result);
}
function _readHtmlAttrs(attrs) {
    var htmlAttrs = {};
    attrs.forEach((ast) => { htmlAttrs[ast.name] = ast.value; });
    return htmlAttrs;
}
function _readHtmlAndDirectiveVariables(elementExportAsVars, directives, viewType) {
    var variables = {};
    var component = null;
    directives.forEach((directive) => {
        if (directive.directive.isComponent) {
            component = directive.directive;
        }
        directive.exportAsVars.forEach(varAst => { variables[varAst.name] = identifierToken(directive.directive.type); });
    });
    elementExportAsVars.forEach((varAst) => {
        variables[varAst.name] = isPresent(component) ? identifierToken(component.type) : null;
    });
    return variables;
}
function mergeAttributeValue(attrName, attrValue1, attrValue2) {
    if (attrName == CLASS_ATTR || attrName == STYLE_ATTR) {
        return `${attrValue1} ${attrValue2}`;
    }
    else {
        return attrValue2;
    }
}
function mapToKeyValueArray(data) {
    var entryArray = [];
    StringMapWrapper.forEach(data, (value, name) => { entryArray.push([name, value]); });
    // We need to sort to get a defined output order
    // for tests and for caching generated artifacts...
    ListWrapper.sort(entryArray, (entry1, entry2) => StringWrapper.compare(entry1[0], entry2[0]));
    var keyValueArray = [];
    entryArray.forEach((entry) => { keyValueArray.push([entry[0], entry[1]]); });
    return keyValueArray;
}
function createViewTopLevelStmts(view, targetStatements) {
    var nodeDebugInfosVar = o.NULL_EXPR;
    if (view.genConfig.genDebugInfo) {
        nodeDebugInfosVar = o.variable(`nodeDebugInfos_${view.component.type.name}${view.viewIndex}`);
        targetStatements.push(nodeDebugInfosVar
            .set(o.literalArr(view.nodes.map(createStaticNodeDebugInfo), new o.ArrayType(new o.ExternalType(Identifiers.StaticNodeDebugInfo), [o.TypeModifier.Const])))
            .toDeclStmt(null, [o.StmtModifier.Final]));
    }
    var renderCompTypeVar = o.variable(`renderType_${view.component.type.name}`);
    if (view.viewIndex === 0) {
        targetStatements.push(renderCompTypeVar.set(o.NULL_EXPR)
            .toDeclStmt(o.importType(Identifiers.RenderComponentType)));
    }
    var viewClass = createViewClass(view, renderCompTypeVar, nodeDebugInfosVar);
    targetStatements.push(viewClass);
    targetStatements.push(createViewFactory(view, viewClass, renderCompTypeVar));
}
function createStaticNodeDebugInfo(node) {
    var compileElement = node instanceof CompileElement ? node : null;
    var providerTokens = [];
    var componentToken = o.NULL_EXPR;
    var varTokenEntries = [];
    if (isPresent(compileElement)) {
        providerTokens = compileElement.getProviderTokens();
        if (isPresent(compileElement.component)) {
            componentToken = createDiTokenExpression(identifierToken(compileElement.component.type));
        }
        StringMapWrapper.forEach(compileElement.variableTokens, (token, varName) => {
            varTokenEntries.push([varName, isPresent(token) ? createDiTokenExpression(token) : o.NULL_EXPR]);
        });
    }
    return o.importExpr(Identifiers.StaticNodeDebugInfo)
        .instantiate([
        o.literalArr(providerTokens, new o.ArrayType(o.DYNAMIC_TYPE, [o.TypeModifier.Const])),
        componentToken,
        o.literalMap(varTokenEntries, new o.MapType(o.DYNAMIC_TYPE, [o.TypeModifier.Const]))
    ], o.importType(Identifiers.StaticNodeDebugInfo, null, [o.TypeModifier.Const]));
}
function createViewClass(view, renderCompTypeVar, nodeDebugInfosVar) {
    var emptyTemplateVariableBindings = view.templateVariableBindings.map((entry) => [entry[0], o.NULL_EXPR]);
    var viewConstructorArgs = [
        new o.FnParam(ViewConstructorVars.viewUtils.name, o.importType(Identifiers.ViewUtils)),
        new o.FnParam(ViewConstructorVars.parentInjector.name, o.importType(Identifiers.Injector)),
        new o.FnParam(ViewConstructorVars.declarationEl.name, o.importType(Identifiers.AppElement))
    ];
    var viewConstructor = new o.ClassMethod(null, viewConstructorArgs, [
        o.SUPER_EXPR.callFn([
            o.variable(view.className),
            renderCompTypeVar,
            ViewTypeEnum.fromValue(view.viewType),
            o.literalMap(emptyTemplateVariableBindings),
            ViewConstructorVars.viewUtils,
            ViewConstructorVars.parentInjector,
            ViewConstructorVars.declarationEl,
            ChangeDetectionStrategyEnum.fromValue(getChangeDetectionMode(view)),
            nodeDebugInfosVar
        ])
            .toStmt()
    ]);
    var viewMethods = [
        new o.ClassMethod('createInternal', [new o.FnParam(rootSelectorVar.name, o.STRING_TYPE)], generateCreateMethod(view), o.importType(Identifiers.AppElement)),
        new o.ClassMethod('injectorGetInternal', [
            new o.FnParam(InjectMethodVars.token.name, o.DYNAMIC_TYPE),
            // Note: Can't use o.INT_TYPE here as the method in AppView uses number
            new o.FnParam(InjectMethodVars.requestNodeIndex.name, o.NUMBER_TYPE),
            new o.FnParam(InjectMethodVars.notFoundResult.name, o.DYNAMIC_TYPE)
        ], addReturnValuefNotEmpty(view.injectorGetMethod.finish(), InjectMethodVars.notFoundResult), o.DYNAMIC_TYPE),
        new o.ClassMethod('detectChangesInternal', [new o.FnParam(DetectChangesVars.throwOnChange.name, o.BOOL_TYPE)], generateDetectChangesMethod(view)),
        new o.ClassMethod('dirtyParentQueriesInternal', [], view.dirtyParentQueriesMethod.finish()),
        new o.ClassMethod('destroyInternal', [], view.destroyMethod.finish())
    ].concat(view.eventHandlerMethods);
    var viewClass = new o.ClassStmt(view.className, o.importExpr(Identifiers.AppView, [getContextType(view)]), view.fields, view.getters, viewConstructor, viewMethods.filter((method) => method.body.length > 0));
    return viewClass;
}
function createViewFactory(view, viewClass, renderCompTypeVar) {
    var viewFactoryArgs = [
        new o.FnParam(ViewConstructorVars.viewUtils.name, o.importType(Identifiers.ViewUtils)),
        new o.FnParam(ViewConstructorVars.parentInjector.name, o.importType(Identifiers.Injector)),
        new o.FnParam(ViewConstructorVars.declarationEl.name, o.importType(Identifiers.AppElement))
    ];
    var initRenderCompTypeStmts = [];
    var templateUrlInfo;
    if (view.component.template.templateUrl == view.component.type.moduleUrl) {
        templateUrlInfo =
            `${view.component.type.moduleUrl} class ${view.component.type.name} - inline template`;
    }
    else {
        templateUrlInfo = view.component.template.templateUrl;
    }
    if (view.viewIndex === 0) {
        initRenderCompTypeStmts = [
            new o.IfStmt(renderCompTypeVar.identical(o.NULL_EXPR), [
                renderCompTypeVar.set(ViewConstructorVars
                    .viewUtils.callMethod('createRenderComponentType', [
                    o.literal(templateUrlInfo),
                    o.literal(view.component
                        .template.ngContentSelectors.length),
                    ViewEncapsulationEnum
                        .fromValue(view.component.template.encapsulation),
                    view.styles
                ]))
                    .toStmt()
            ])
        ];
    }
    return o.fn(viewFactoryArgs, initRenderCompTypeStmts.concat([
        new o.ReturnStatement(o.variable(viewClass.name)
            .instantiate(viewClass.constructorMethod.params.map((param) => o.variable(param.name))))
    ]), o.importType(Identifiers.AppView, [getContextType(view)]))
        .toDeclStmt(view.viewFactory.name, [o.StmtModifier.Final]);
}
function generateCreateMethod(view) {
    var parentRenderNodeExpr = o.NULL_EXPR;
    var parentRenderNodeStmts = [];
    if (view.viewType === ViewType.COMPONENT) {
        parentRenderNodeExpr = ViewProperties.renderer.callMethod('createViewRoot', [o.THIS_EXPR.prop('declarationAppElement').prop('nativeElement')]);
        parentRenderNodeStmts = [
            parentRenderNodeVar.set(parentRenderNodeExpr)
                .toDeclStmt(o.importType(view.genConfig.renderTypes.renderNode), [o.StmtModifier.Final])
        ];
    }
    var resultExpr;
    if (view.viewType === ViewType.HOST) {
        resultExpr = view.nodes[0].appElement;
    }
    else {
        resultExpr = o.NULL_EXPR;
    }
    return parentRenderNodeStmts.concat(view.createMethod.finish())
        .concat([
        o.THIS_EXPR.callMethod('init', [
            createFlatArray(view.rootNodesOrAppElements),
            o.literalArr(view.nodes.map(node => node.renderNode)),
            o.literalArr(view.disposables),
            o.literalArr(view.subscriptions)
        ])
            .toStmt(),
        new o.ReturnStatement(resultExpr)
    ]);
}
function generateDetectChangesMethod(view) {
    var stmts = [];
    if (view.detectChangesInInputsMethod.isEmpty() && view.updateContentQueriesMethod.isEmpty() &&
        view.afterContentLifecycleCallbacksMethod.isEmpty() &&
        view.detectChangesRenderPropertiesMethod.isEmpty() &&
        view.updateViewQueriesMethod.isEmpty() && view.afterViewLifecycleCallbacksMethod.isEmpty()) {
        return stmts;
    }
    ListWrapper.addAll(stmts, view.detectChangesInInputsMethod.finish());
    stmts.push(o.THIS_EXPR.callMethod('detectContentChildrenChanges', [DetectChangesVars.throwOnChange])
        .toStmt());
    var afterContentStmts = view.updateContentQueriesMethod.finish().concat(view.afterContentLifecycleCallbacksMethod.finish());
    if (afterContentStmts.length > 0) {
        stmts.push(new o.IfStmt(o.not(DetectChangesVars.throwOnChange), afterContentStmts));
    }
    ListWrapper.addAll(stmts, view.detectChangesRenderPropertiesMethod.finish());
    stmts.push(o.THIS_EXPR.callMethod('detectViewChildrenChanges', [DetectChangesVars.throwOnChange])
        .toStmt());
    var afterViewStmts = view.updateViewQueriesMethod.finish().concat(view.afterViewLifecycleCallbacksMethod.finish());
    if (afterViewStmts.length > 0) {
        stmts.push(new o.IfStmt(o.not(DetectChangesVars.throwOnChange), afterViewStmts));
    }
    var varStmts = [];
    var readVars = o.findReadVarNames(stmts);
    if (SetWrapper.has(readVars, DetectChangesVars.changed.name)) {
        varStmts.push(DetectChangesVars.changed.set(o.literal(true)).toDeclStmt(o.BOOL_TYPE));
    }
    if (SetWrapper.has(readVars, DetectChangesVars.changes.name)) {
        varStmts.push(DetectChangesVars.changes.set(o.NULL_EXPR)
            .toDeclStmt(new o.MapType(o.importType(Identifiers.SimpleChange))));
    }
    if (SetWrapper.has(readVars, DetectChangesVars.valUnwrapper.name)) {
        varStmts.push(DetectChangesVars.valUnwrapper.set(o.importExpr(Identifiers.ValueUnwrapper).instantiate([]))
            .toDeclStmt(null, [o.StmtModifier.Final]));
    }
    return varStmts.concat(stmts);
}
function addReturnValuefNotEmpty(statements, value) {
    if (statements.length > 0) {
        return statements.concat([new o.ReturnStatement(value)]);
    }
    else {
        return statements;
    }
}
function getContextType(view) {
    var typeMeta = view.component.type;
    return typeMeta.isHost ? o.DYNAMIC_TYPE : o.importType(typeMeta);
}
function getChangeDetectionMode(view) {
    var mode;
    if (view.viewType === ViewType.COMPONENT) {
        mode = isDefaultChangeDetectionStrategy(view.component.changeDetection) ?
            ChangeDetectionStrategy.CheckAlways :
            ChangeDetectionStrategy.CheckOnce;
    }
    else {
        mode = ChangeDetectionStrategy.CheckAlways;
    }
    return mode;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19idWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC05RDFpR1FWRy50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3ZpZXdfY29tcGlsZXIvdmlld19idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsU0FBUyxFQUFXLGFBQWEsRUFBQyxNQUFNLDBCQUEwQjtPQUNuRSxFQUFDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUMsTUFBTSxnQ0FBZ0M7T0FFakYsS0FBSyxDQUFDLE1BQU0sc0JBQXNCO09BQ2xDLEVBQUMsV0FBVyxFQUFFLGVBQWUsRUFBQyxNQUFNLGdCQUFnQjtPQUNwRCxFQUNMLG1CQUFtQixFQUNuQixnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2pCLFlBQVksRUFDWixxQkFBcUIsRUFDckIsMkJBQTJCLEVBQzNCLGNBQWMsRUFDZixNQUFNLGFBQWE7T0FDYixFQUNMLHVCQUF1QixFQUN2QixnQ0FBZ0MsRUFDakMsTUFBTSxxREFBcUQ7T0FFckQsRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0I7T0FDbkMsRUFBQyxjQUFjLEVBQUUsV0FBVyxFQUFDLE1BQU0sbUJBQW1CO09BRXRELEVBY0wsZ0JBQWdCLEVBR2pCLE1BQU0saUJBQWlCO09BRWpCLEVBQUMsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLHVCQUF1QixFQUFDLE1BQU0sUUFBUTtPQUU1RSxFQUFDLFFBQVEsRUFBQyxNQUFNLG9DQUFvQztPQUNwRCxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUNBQWlDO09BRTFELEVBQ0wseUJBQXlCLEVBRzFCLE1BQU0scUJBQXFCO09BRXJCLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZTtBQUV0QyxNQUFNLHFCQUFxQixHQUFHLFlBQVksQ0FBQztBQUMzQyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUM7QUFDM0IsTUFBTSxVQUFVLEdBQUcs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QUksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUNwQixDQUFDO0FBQ0gsQ0FBQztBQUVELHdCQUF3QixJQUFpQjtJQUN2QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztJQUNuQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbkUsQ0FBQztBQUVELGdDQUFnQyxJQUFpQjtJQUMvQyxJQUFJLElBQTZCLENBQUM7SUFDbEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN6QyxJQUFJLEdBQUcsZ0NBQWdDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUM7WUFDNUQsdUJBQXVCLENBQUMsV0FBVztZQUNuQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUM7SUFDL0MsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sSUFBSSxHQUFHLHVCQUF1QixDQUFDLFdBQVcsQ0FBQztJQUM3QyxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzUHJlc2VudCwgaXNCbGFuaywgU3RyaW5nV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TGlzdFdyYXBwZXIsIFN0cmluZ01hcFdyYXBwZXIsIFNldFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5cbmltcG9ydCAqIGFzIG8gZnJvbSAnLi4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtJZGVudGlmaWVycywgaWRlbnRpZmllclRva2VufSBmcm9tICcuLi9pZGVudGlmaWVycyc7XG5pbXBvcnQge1xuICBWaWV3Q29uc3RydWN0b3JWYXJzLFxuICBJbmplY3RNZXRob2RWYXJzLFxuICBEZXRlY3RDaGFuZ2VzVmFycyxcbiAgVmlld1R5cGVFbnVtLFxuICBWaWV3RW5jYXBzdWxhdGlvbkVudW0sXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5RW51bSxcbiAgVmlld1Byb3BlcnRpZXNcbn0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIGlzRGVmYXVsdENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2NoYW5nZV9kZXRlY3Rpb24vY2hhbmdlX2RldGVjdGlvbic7XG5cbmltcG9ydCB7Q29tcGlsZVZpZXd9IGZyb20gJy4vY29tcGlsZV92aWV3JztcbmltcG9ydCB7Q29tcGlsZUVsZW1lbnQsIENvbXBpbGVOb2RlfSBmcm9tICcuL2NvbXBpbGVfZWxlbWVudCc7XG5cbmltcG9ydCB7XG4gIFRlbXBsYXRlQXN0LFxuICBUZW1wbGF0ZUFzdFZpc2l0b3IsXG4gIE5nQ29udGVudEFzdCxcbiAgRW1iZWRkZWRUZW1wbGF0ZUFzdCxcbiAgRWxlbWVudEFzdCxcbiAgVmFyaWFibGVBc3QsXG4gIEJvdW5kRXZlbnRBc3QsXG4gIEJvdW5kRWxlbWVudFByb3BlcnR5QXN0LFxuICBBdHRyQXN0LFxuICBCb3VuZFRleHRBc3QsXG4gIFRleHRBc3QsXG4gIERpcmVjdGl2ZUFzdCxcbiAgQm91bmREaXJlY3RpdmVQcm9wZXJ0eUFzdCxcbiAgdGVtcGxhdGVWaXNpdEFsbCxcbiAgUHJvcGVydHlCaW5kaW5nVHlwZSxcbiAgUHJvdmlkZXJBc3Rcbn0gZnJvbSAnLi4vdGVtcGxhdGVfYXN0JztcblxuaW1wb3J0IHtnZXRWaWV3RmFjdG9yeU5hbWUsIGNyZWF0ZUZsYXRBcnJheSwgY3JlYXRlRGlUb2tlbkV4cHJlc3Npb259IGZyb20gJy4vdXRpbCc7XG5cbmltcG9ydCB7Vmlld1R5cGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci92aWV3X3R5cGUnO1xuaW1wb3J0IHtWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbWV0YWRhdGEvdmlldyc7XG5cbmltcG9ydCB7XG4gIENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGEsXG4gIENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgQ29tcGlsZVRva2VuTWV0YWRhdGFcbn0gZnJvbSAnLi4vY29tcGlsZV9tZXRhZGF0YSc7XG5cbmltcG9ydCB7YmluZFZpZXd9IGZyb20gJy4vdmlld19iaW5kZXInO1xuXG5jb25zdCBJTVBMSUNJVF9URU1QTEFURV9WQVIgPSAnXFwkaW1wbGljaXQnO1xuY29uc3QgQ0xBU1NfQVRUUiA9ICdjbGFzcyc7XG5jb25zdCBTVFlMRV9BVFRSID0gJ3N0eWxlJztcblxudmFyIHBhcmVudFJlbmRlck5vZGVWYXIgPSBvLnZhcmlhYmxlKCdwYXJlbnRSZW5kZXJOb2RlJyk7XG52YXIgcm9vdFNlbGVjdG9yVmFyID0gby52YXJpYWJsZSgncm9vdFNlbGVjdG9yJyk7XG5cbmV4cG9ydCBjbGFzcyBWaWV3Q29tcGlsZURlcGVuZGVuY3kge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29tcDogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICAgICAgICAgICAgICBwdWJsaWMgZmFjdG9yeVBsYWNlaG9sZGVyOiBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhKSB7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRWaWV3KHZpZXc6IENvbXBpbGVWaWV3LCB0ZW1wbGF0ZTogVGVtcGxhdGVBc3RbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RGVwZW5kZW5jaWVzOiBWaWV3Q29tcGlsZURlcGVuZGVuY3lbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0U3RhdGVtZW50czogby5TdGF0ZW1lbnRbXSk6IG51bWJlciB7XG4gIHZhciBidWlsZGVyVmlzaXRvciA9IG5ldyBWaWV3QnVpbGRlclZpc2l0b3IodmlldywgdGFyZ2V0RGVwZW5kZW5jaWVzLCB0YXJnZXRTdGF0ZW1lbnRzKTtcbiAgdGVtcGxhdGVWaXNpdEFsbChidWlsZGVyVmlzaXRvciwgdGVtcGxhdGUsIHZpZXcuZGVjbGFyYXRpb25FbGVtZW50LmlzTnVsbCgpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3LmRlY2xhcmF0aW9uRWxlbWVudCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5kZWNsYXJhdGlvbkVsZW1lbnQucGFyZW50KTtcbiAgLy8gTmVlZCB0byBzZXBhcmF0ZSBiaW5kaW5nIGZyb20gY3JlYXRpb24gdG8gYmUgYWJsZSB0byByZWZlciB0b1xuICAvLyB2YXJpYWJsZXMgdGhhdCBoYXZlIGJlZW4gZGVjbGFyZWQgYWZ0ZXIgdXNhZ2UuXG4gIGJpbmRWaWV3KHZpZXcsIHRlbXBsYXRlKTtcbiAgdmlldy5hZnRlck5vZGVzKCk7XG5cbiAgY3JlYXRlVmlld1RvcExldmVsU3RtdHModmlldywgdGFyZ2V0U3RhdGVtZW50cyk7XG5cbiAgcmV0dXJuIGJ1aWxkZXJWaXNpdG9yLm5lc3RlZFZpZXdDb3VudDtcbn1cblxuXG5jbGFzcyBWaWV3QnVpbGRlclZpc2l0b3IgaW1wbGVtZW50cyBUZW1wbGF0ZUFzdFZpc2l0b3Ige1xuICBuZXN0ZWRWaWV3Q291bnQ6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHZpZXc6IENvbXBpbGVWaWV3LCBwdWJsaWMgdGFyZ2V0RGVwZW5kZW5jaWVzOiBWaWV3Q29tcGlsZURlcGVuZGVuY3lbXSxcbiAgICAgICAgICAgICAgcHVibGljIHRhcmdldFN0YXRlbWVudHM6IG8uU3RhdGVtZW50W10pIHt9XG5cbiAgcHJpdmF0ZSBfaXNSb290Tm9kZShwYXJlbnQ6IENvbXBpbGVFbGVtZW50KTogYm9vbGVhbiB7IHJldHVybiBwYXJlbnQudmlldyAhPT0gdGhpcy52aWV3OyB9XG5cbiAgcHJpdmF0ZSBfYWRkUm9vdE5vZGVBbmRQcm9qZWN0KG5vZGU6IENvbXBpbGVOb2RlLCBuZ0NvbnRlbnRJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBDb21waWxlRWxlbWVudCkge1xuICAgIHZhciB2Y0FwcEVsID1cbiAgICAgICAgKG5vZGUgaW5zdGFuY2VvZiBDb21waWxlRWxlbWVudCAmJiBub2RlLmhhc1ZpZXdDb250YWluZXIpID8gbm9kZS5hcHBFbGVtZW50IDogbnVsbDtcbiAgICBpZiAodGhpcy5faXNSb290Tm9kZShwYXJlbnQpKSB7XG4gICAgICAvLyBzdG9yZSBhcHBFbGVtZW50IGFzIHJvb3Qgbm9kZSBvbmx5IGZvciBWaWV3Q29udGFpbmVyc1xuICAgICAgaWYgKHRoaXMudmlldy52aWV3VHlwZSAhPT0gVmlld1R5cGUuQ09NUE9ORU5UKSB7XG4gICAgICAgIHRoaXMudmlldy5yb290Tm9kZXNPckFwcEVsZW1lbnRzLnB1c2goaXNQcmVzZW50KHZjQXBwRWwpID8gdmNBcHBFbCA6IG5vZGUucmVuZGVyTm9kZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc1ByZXNlbnQocGFyZW50LmNvbXBvbmVudCkgJiYgaXNQcmVzZW50KG5nQ29udGVudEluZGV4KSkge1xuICAgICAgcGFyZW50LmFkZENvbnRlbnROb2RlKG5nQ29udGVudEluZGV4LCBpc1ByZXNlbnQodmNBcHBFbCkgPyB2Y0FwcEVsIDogbm9kZS5yZW5kZXJOb2RlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRQYXJlbnRSZW5kZXJOb2RlKHBhcmVudDogQ29tcGlsZUVsZW1lbnQpOiBvLkV4cHJlc3Npb24ge1xuICAgIGlmICh0aGlzLl9pc1Jvb3ROb2RlKHBhcmVudCkpIHtcbiAgICAgIGlmICh0aGlzLnZpZXcudmlld1R5cGUgPT09IFZpZXdUeXBlLkNPTVBPTkVOVCkge1xuICAgICAgICByZXR1cm4gcGFyZW50UmVuZGVyTm9kZVZhcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJvb3Qgbm9kZSBvZiBhbiBlbWJlZGRlZC9ob3N0IHZpZXdcbiAgICAgICAgcmV0dXJuIG8uTlVMTF9FWFBSO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXNQcmVzZW50KHBhcmVudC5jb21wb25lbnQpICYmXG4gICAgICAgICAgICAgICAgICAgICBwYXJlbnQuY29tcG9uZW50LnRlbXBsYXRlLmVuY2Fwc3VsYXRpb24gIT09IFZpZXdFbmNhcHN1bGF0aW9uLk5hdGl2ZSA/XG4gICAgICAgICAgICAgICAgIG8uTlVMTF9FWFBSIDpcbiAgICAgICAgICAgICAgICAgcGFyZW50LnJlbmRlck5vZGU7XG4gICAgfVxuICB9XG5cbiAgdmlzaXRCb3VuZFRleHQoYXN0OiBCb3VuZFRleHRBc3QsIHBhcmVudDogQ29tcGlsZUVsZW1lbnQpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl92aXNpdFRleHQoYXN0LCAnJywgYXN0Lm5nQ29udGVudEluZGV4LCBwYXJlbnQpO1xuICB9XG4gIHZpc2l0VGV4dChhc3Q6IFRleHRBc3QsIHBhcmVudDogQ29tcGlsZUVsZW1lbnQpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl92aXNpdFRleHQoYXN0LCBhc3QudmFsdWUsIGFzdC5uZ0NvbnRlbnRJbmRleCwgcGFyZW50KTtcbiAgfVxuICBwcml2YXRlIF92aXNpdFRleHQoYXN0OiBUZW1wbGF0ZUFzdCwgdmFsdWU6IHN0cmluZywgbmdDb250ZW50SW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogQ29tcGlsZUVsZW1lbnQpOiBvLkV4cHJlc3Npb24ge1xuICAgIHZhciBmaWVsZE5hbWUgPSBgX3RleHRfJHt0aGlzLnZpZXcubm9kZXMubGVuZ3RofWA7XG4gICAgdGhpcy52aWV3LmZpZWxkcy5wdXNoKG5ldyBvLkNsYXNzRmllbGQoZmllbGROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uaW1wb3J0VHlwZSh0aGlzLnZpZXcuZ2VuQ29uZmlnLnJlbmRlclR5cGVzLnJlbmRlclRleHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtvLlN0bXRNb2RpZmllci5Qcml2YXRlXSkpO1xuICAgIHZhciByZW5kZXJOb2RlID0gby5USElTX0VYUFIucHJvcChmaWVsZE5hbWUpO1xuICAgIHZhciBjb21waWxlTm9kZSA9IG5ldyBDb21waWxlTm9kZShwYXJlbnQsIHRoaXMudmlldywgdGhpcy52aWV3Lm5vZGVzLmxlbmd0aCwgcmVuZGVyTm9kZSwgYXN0KTtcbiAgICB2YXIgY3JlYXRlUmVuZGVyTm9kZSA9XG4gICAgICAgIG8uVEhJU19FWFBSLnByb3AoZmllbGROYW1lKVxuICAgICAgICAgICAgLnNldChWaWV3UHJvcGVydGllcy5yZW5kZXJlci5jYWxsTWV0aG9kKFxuICAgICAgICAgICAgICAgICdjcmVhdGVUZXh0JyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICB0aGlzLl9nZXRQYXJlbnRSZW5kZXJOb2RlKHBhcmVudCksXG4gICAgICAgICAgICAgICAgICBvLmxpdGVyYWwodmFsdWUpLFxuICAgICAgICAgICAgICAgICAgdGhpcy52aWV3LmNyZWF0ZU1ldGhvZC5yZXNldERlYnVnSW5mb0V4cHIodGhpcy52aWV3Lm5vZGVzLmxlbmd0aCwgYXN0KVxuICAgICAgICAgICAgICAgIF0pKVxuICAgICAgICAgICAgLnRvU3RtdCgpO1xuICAgIHRoaXMudmlldy5ub2Rlcy5wdXNoKGNvbXBpbGVOb2RlKTtcbiAgICB0aGlzLnZpZXcuY3JlYXRlTWV0aG9kLmFkZFN0bXQoY3JlYXRlUmVuZGVyTm9kZSk7XG4gICAgdGhpcy5fYWRkUm9vdE5vZGVBbmRQcm9qZWN0KGNvbXBpbGVOb2RlLCBuZ0NvbnRlbnRJbmRleCwgcGFyZW50KTtcbiAgICByZXR1cm4gcmVuZGVyTm9kZTtcbiAgfVxuXG4gIHZpc2l0TmdDb250ZW50KGFzdDogTmdDb250ZW50QXN0LCBwYXJlbnQ6IENvbXBpbGVFbGVtZW50KTogYW55IHtcbiAgICAvLyB0aGUgcHJvamVjdGVkIG5vZGVzIG9yaWdpbmF0ZSBmcm9tIGEgZGlmZmVyZW50IHZpZXcsIHNvIHdlIGRvbid0XG4gICAgLy8gaGF2ZSBkZWJ1ZyBpbmZvcm1hdGlvbiBmb3IgdGhlbS4uLlxuICAgIHRoaXMudmlldy5jcmVhdGVNZXRob2QucmVzZXREZWJ1Z0luZm8obnVsbCwgYXN0KTtcbiAgICB2YXIgcGFyZW50UmVuZGVyTm9kZSA9IHRoaXMuX2dldFBhcmVudFJlbmRlck5vZGUocGFyZW50KTtcbiAgICB2YXIgbm9kZXNFeHByZXNzaW9uID0gVmlld1Byb3BlcnRpZXMucHJvamVjdGFibGVOb2Rlcy5rZXkoXG4gICAgICAgIG8ubGl0ZXJhbChhc3QuaW5kZXgpLFxuICAgICAgICBuZXcgby5BcnJheVR5cGUoby5pbXBvcnRUeXBlKHRoaXMudmlldy5nZW5Db25maWcucmVuZGVyVHlwZXMucmVuZGVyTm9kZSkpKTtcbiAgICBpZiAocGFyZW50UmVuZGVyTm9kZSAhPT0gby5OVUxMX0VYUFIpIHtcbiAgICAgIHRoaXMudmlldy5jcmVhdGVNZXRob2QuYWRkU3RtdChcbiAgICAgICAgICBWaWV3UHJvcGVydGllcy5yZW5kZXJlci5jYWxsTWV0aG9kKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwcm9qZWN0Tm9kZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFJlbmRlck5vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuZmxhdHRlbk5lc3RlZFZpZXdSZW5kZXJOb2RlcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2FsbEZuKFtub2Rlc0V4cHJlc3Npb25dKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgIC50b1N0bXQoKSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9pc1Jvb3ROb2RlKHBhcmVudCkpIHtcbiAgICAgIGlmICh0aGlzLnZpZXcudmlld1R5cGUgIT09IFZpZXdUeXBlLkNPTVBPTkVOVCkge1xuICAgICAgICAvLyBzdG9yZSByb290IG5vZGVzIG9ubHkgZm9yIGVtYmVkZGVkL2hvc3Qgdmlld3NcbiAgICAgICAgdGhpcy52aWV3LnJvb3ROb2Rlc09yQXBwRWxlbWVudHMucHVzaChub2Rlc0V4cHJlc3Npb24pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNQcmVzZW50KHBhcmVudC5jb21wb25lbnQpICYmIGlzUHJlc2VudChhc3QubmdDb250ZW50SW5kZXgpKSB7XG4gICAgICAgIHBhcmVudC5hZGRDb250ZW50Tm9kZShhc3QubmdDb250ZW50SW5kZXgsIG5vZGVzRXhwcmVzc2lvbik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGFzdDogRWxlbWVudEFzdCwgcGFyZW50OiBDb21waWxlRWxlbWVudCk6IGFueSB7XG4gICAgdmFyIG5vZGVJbmRleCA9IHRoaXMudmlldy5ub2Rlcy5sZW5ndGg7XG4gICAgdmFyIGNyZWF0ZVJlbmRlck5vZGVFeHByO1xuICAgIHZhciBkZWJ1Z0NvbnRleHRFeHByID0gdGhpcy52aWV3LmNyZWF0ZU1ldGhvZC5yZXNldERlYnVnSW5mb0V4cHIobm9kZUluZGV4LCBhc3QpO1xuICAgIGlmIChub2RlSW5kZXggPT09IDAgJiYgdGhpcy52aWV3LnZpZXdUeXBlID09PSBWaWV3VHlwZS5IT1NUKSB7XG4gICAgICBjcmVhdGVSZW5kZXJOb2RlRXhwciA9IG8uVEhJU19FWFBSLmNhbGxNZXRob2QoXG4gICAgICAgICAgJ3NlbGVjdE9yQ3JlYXRlSG9zdEVsZW1lbnQnLCBbby5saXRlcmFsKGFzdC5uYW1lKSwgcm9vdFNlbGVjdG9yVmFyLCBkZWJ1Z0NvbnRleHRFeHByXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNyZWF0ZVJlbmRlck5vZGVFeHByID0gVmlld1Byb3BlcnRpZXMucmVuZGVyZXIuY2FsbE1ldGhvZChcbiAgICAgICAgICAnY3JlYXRlRWxlbWVudCcsXG4gICAgICAgICAgW3RoaXMuX2dldFBhcmVudFJlbmRlck5vZGUocGFyZW50KSwgby5saXRlcmFsKGFzdC5uYW1lKSwgZGVidWdDb250ZXh0RXhwcl0pO1xuICAgIH1cbiAgICB2YXIgZmllbGROYW1lID0gYF9lbF8ke25vZGVJbmRleH1gO1xuICAgIHRoaXMudmlldy5maWVsZHMucHVzaChcbiAgICAgICAgbmV3IG8uQ2xhc3NGaWVsZChmaWVsZE5hbWUsIG8uaW1wb3J0VHlwZSh0aGlzLnZpZXcuZ2VuQ29uZmlnLnJlbmRlclR5cGVzLnJlbmRlckVsZW1lbnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtvLlN0bXRNb2RpZmllci5Qcml2YXRlXSkpO1xuICAgIHRoaXMudmlldy5jcmVhdGVNZXRob2QuYWRkU3RtdChvLlRISVNfRVhQUi5wcm9wKGZpZWxkTmFtZSkuc2V0KGNyZWF0ZVJlbmRlck5vZGVFeHByKS50b1N0bXQoKSk7XG5cbiAgICB2YXIgcmVuZGVyTm9kZSA9IG8uVEhJU19FWFBSLnByb3AoZmllbGROYW1lKTtcblxuICAgIHZhciBjb21wb25lbnQgPSBhc3QuZ2V0Q29tcG9uZW50KCk7XG4gICAgdmFyIGRpcmVjdGl2ZXMgPSBhc3QuZGlyZWN0aXZlcy5tYXAoZGlyZWN0aXZlQXN0ID0+IGRpcmVjdGl2ZUFzdC5kaXJlY3RpdmUpO1xuICAgIHZhciB2YXJpYWJsZXMgPVxuICAgICAgICBfcmVhZEh0bWxBbmREaXJlY3RpdmVWYXJpYWJsZXMoYXN0LmV4cG9ydEFzVmFycywgYXN0LmRpcmVjdGl2ZXMsIHRoaXMudmlldy52aWV3VHlwZSk7XG4gICAgdmFyIGh0bWxBdHRycyA9IF9yZWFkSHRtbEF0dHJzKGFzdC5hdHRycyk7XG4gICAgdmFyIGF0dHJOYW1lQW5kVmFsdWVzID0gX21lcmdlSHRtbEFuZERpcmVjdGl2ZUF0dHJzKGh0bWxBdHRycywgZGlyZWN0aXZlcyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRyTmFtZUFuZFZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGF0dHJOYW1lID0gYXR0ck5hbWVBbmRWYWx1ZXNbaV1bMF07XG4gICAgICB2YXIgYXR0clZhbHVlID0gYXR0ck5hbWVBbmRWYWx1ZXNbaV1bMV07XG4gICAgICB0aGlzLnZpZXcuY3JlYXRlTWV0aG9kLmFkZFN0bXQoXG4gICAgICAgICAgVmlld1Byb3BlcnRpZXMucmVuZGVyZXIuY2FsbE1ldGhvZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2V0RWxlbWVudEF0dHJpYnV0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3JlbmRlck5vZGUsIG8ubGl0ZXJhbChhdHRyTmFtZSksIG8ubGl0ZXJhbChhdHRyVmFsdWUpXSlcbiAgICAgICAgICAgICAgLnRvU3RtdCgpKTtcbiAgICB9XG4gICAgdmFyIGNvbXBpbGVFbGVtZW50ID1cbiAgICAgICAgbmV3IENvbXBpbGVFbGVtZW50KHBhcmVudCwgdGhpcy52aWV3LCBub2RlSW5kZXgsIHJlbmRlck5vZGUsIGFzdCwgY29tcG9uZW50LCBkaXJlY3RpdmVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN0LnByb3ZpZGVycywgYXN0Lmhhc1ZpZXdDb250YWluZXIsIGZhbHNlLCB2YXJpYWJsZXMpO1xuICAgIHRoaXMudmlldy5ub2Rlcy5wdXNoKGNvbXBpbGVFbGVtZW50KTtcbiAgICB2YXIgY29tcFZpZXdFeHByOiBvLlJlYWRWYXJFeHByID0gbnVsbDtcbiAgICBpZiAoaXNQcmVzZW50KGNvbXBvbmVudCkpIHtcbiAgICAgIHZhciBuZXN0ZWRDb21wb25lbnRJZGVudGlmaWVyID1cbiAgICAgICAgICBuZXcgQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YSh7bmFtZTogZ2V0Vmlld0ZhY3RvcnlOYW1lKGNvbXBvbmVudCwgMCl9KTtcbiAgICAgIHRoaXMudGFyZ2V0RGVwZW5kZW5jaWVzLnB1c2gobmV3IFZpZXdDb21waWxlRGVwZW5kZW5jeShjb21wb25lbnQsIG5lc3RlZENvbXBvbmVudElkZW50aWZpZXIpKTtcbiAgICAgIGNvbXBWaWV3RXhwciA9IG8udmFyaWFibGUoYGNvbXBWaWV3XyR7bm9kZUluZGV4fWApO1xuICAgICAgY29tcGlsZUVsZW1lbnQuc2V0Q29tcG9uZW50Vmlldyhjb21wVmlld0V4cHIpO1xuICAgICAgdGhpcy52aWV3LmNyZWF0ZU1ldGhvZC5hZGRTdG10KGNvbXBWaWV3RXhwci5zZXQoby5pbXBvcnRFeHByKG5lc3RlZENvbXBvbmVudElkZW50aWZpZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhbGxGbihbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWaWV3UHJvcGVydGllcy52aWV3VXRpbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlRWxlbWVudC5pbmplY3RvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGVFbGVtZW50LmFwcEVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvRGVjbFN0bXQoKSk7XG4gICAgfVxuICAgIGNvbXBpbGVFbGVtZW50LmJlZm9yZUNoaWxkcmVuKCk7XG4gICAgdGhpcy5fYWRkUm9vdE5vZGVBbmRQcm9qZWN0KGNvbXBpbGVFbGVtZW50LCBhc3QubmdDb250ZW50SW5kZXgsIHBhcmVudCk7XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuY2hpbGRyZW4sIGNvbXBpbGVFbGVtZW50KTtcbiAgICBjb21waWxlRWxlbWVudC5hZnRlckNoaWxkcmVuKHRoaXMudmlldy5ub2Rlcy5sZW5ndGggLSBub2RlSW5kZXggLSAxKTtcblxuICAgIGlmIChpc1ByZXNlbnQoY29tcFZpZXdFeHByKSkge1xuICAgICAgdmFyIGNvZGVHZW5Db250ZW50Tm9kZXM7XG4gICAgICBpZiAodGhpcy52aWV3LmNvbXBvbmVudC50eXBlLmlzSG9zdCkge1xuICAgICAgICBjb2RlR2VuQ29udGVudE5vZGVzID0gVmlld1Byb3BlcnRpZXMucHJvamVjdGFibGVOb2RlcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvZGVHZW5Db250ZW50Tm9kZXMgPSBvLmxpdGVyYWxBcnIoXG4gICAgICAgICAgICBjb21waWxlRWxlbWVudC5jb250ZW50Tm9kZXNCeU5nQ29udGVudEluZGV4Lm1hcChub2RlcyA9PiBjcmVhdGVGbGF0QXJyYXkobm9kZXMpKSk7XG4gICAgICB9XG4gICAgICB0aGlzLnZpZXcuY3JlYXRlTWV0aG9kLmFkZFN0bXQoXG4gICAgICAgICAgY29tcFZpZXdFeHByLmNhbGxNZXRob2QoJ2NyZWF0ZScsIFtjb2RlR2VuQ29udGVudE5vZGVzLCBvLk5VTExfRVhQUl0pLnRvU3RtdCgpKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2aXNpdEVtYmVkZGVkVGVtcGxhdGUoYXN0OiBFbWJlZGRlZFRlbXBsYXRlQXN0LCBwYXJlbnQ6IENvbXBpbGVFbGVtZW50KTogYW55IHtcbiAgICB2YXIgbm9kZUluZGV4ID0gdGhpcy52aWV3Lm5vZGVzLmxlbmd0aDtcbiAgICB2YXIgZmllbGROYW1lID0gYF9hbmNob3JfJHtub2RlSW5kZXh9YDtcbiAgICB0aGlzLnZpZXcuZmllbGRzLnB1c2goXG4gICAgICAgIG5ldyBvLkNsYXNzRmllbGQoZmllbGROYW1lLCBvLmltcG9ydFR5cGUodGhpcy52aWV3LmdlbkNvbmZpZy5yZW5kZXJUeXBlcy5yZW5kZXJDb21tZW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBbby5TdG10TW9kaWZpZXIuUHJpdmF0ZV0pKTtcbiAgICB0aGlzLnZpZXcuY3JlYXRlTWV0aG9kLmFkZFN0bXQoXG4gICAgICAgIG8uVEhJU19FWFBSLnByb3AoZmllbGROYW1lKVxuICAgICAgICAgICAgLnNldChWaWV3UHJvcGVydGllcy5yZW5kZXJlci5jYWxsTWV0aG9kKFxuICAgICAgICAgICAgICAgICdjcmVhdGVUZW1wbGF0ZUFuY2hvcicsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0UGFyZW50UmVuZGVyTm9kZShwYXJlbnQpLFxuICAgICAgICAgICAgICAgICAgdGhpcy52aWV3LmNyZWF0ZU1ldGhvZC5yZXNldERlYnVnSW5mb0V4cHIobm9kZUluZGV4LCBhc3QpXG4gICAgICAgICAgICAgICAgXSkpXG4gICAgICAgICAgICAudG9TdG10KCkpO1xuICAgIHZhciByZW5kZXJOb2RlID0gby5USElTX0VYUFIucHJvcChmaWVsZE5hbWUpO1xuXG4gICAgdmFyIHRlbXBsYXRlVmFyaWFibGVCaW5kaW5ncyA9IGFzdC52YXJzLm1hcChcbiAgICAgICAgdmFyQXN0ID0+IFt2YXJBc3QudmFsdWUubGVuZ3RoID4gMCA/IHZhckFzdC52YWx1ZSA6IElNUExJQ0lUX1RFTVBMQVRFX1ZBUiwgdmFyQXN0Lm5hbWVdKTtcblxuICAgIHZhciBkaXJlY3RpdmVzID0gYXN0LmRpcmVjdGl2ZXMubWFwKGRpcmVjdGl2ZUFzdCA9PiBkaXJlY3RpdmVBc3QuZGlyZWN0aXZlKTtcbiAgICB2YXIgY29tcGlsZUVsZW1lbnQgPVxuICAgICAgICBuZXcgQ29tcGlsZUVsZW1lbnQocGFyZW50LCB0aGlzLnZpZXcsIG5vZGVJbmRleCwgcmVuZGVyTm9kZSwgYXN0LCBudWxsLCBkaXJlY3RpdmVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN0LnByb3ZpZGVycywgYXN0Lmhhc1ZpZXdDb250YWluZXIsIHRydWUsIHt9KTtcbiAgICB0aGlzLnZpZXcubm9kZXMucHVzaChjb21waWxlRWxlbWVudCk7XG5cbiAgICB0aGlzLm5lc3RlZFZpZXdDb3VudCsrO1xuICAgIHZhciBlbWJlZGRlZFZpZXcgPSBuZXcgQ29tcGlsZVZpZXcoXG4gICAgICAgIHRoaXMudmlldy5jb21wb25lbnQsIHRoaXMudmlldy5nZW5Db25maWcsIHRoaXMudmlldy5waXBlTWV0YXMsIG8uTlVMTF9FWFBSLFxuICAgICAgICB0aGlzLnZpZXcudmlld0luZGV4ICsgdGhpcy5uZXN0ZWRWaWV3Q291bnQsIGNvbXBpbGVFbGVtZW50LCB0ZW1wbGF0ZVZhcmlhYmxlQmluZGluZ3MpO1xuICAgIHRoaXMubmVzdGVkVmlld0NvdW50ICs9XG4gICAgICAgIGJ1aWxkVmlldyhlbWJlZGRlZFZpZXcsIGFzdC5jaGlsZHJlbiwgdGhpcy50YXJnZXREZXBlbmRlbmNpZXMsIHRoaXMudGFyZ2V0U3RhdGVtZW50cyk7XG5cbiAgICBjb21waWxlRWxlbWVudC5iZWZvcmVDaGlsZHJlbigpO1xuICAgIHRoaXMuX2FkZFJvb3ROb2RlQW5kUHJvamVjdChjb21waWxlRWxlbWVudCwgYXN0Lm5nQ29udGVudEluZGV4LCBwYXJlbnQpO1xuICAgIGNvbXBpbGVFbGVtZW50LmFmdGVyQ2hpbGRyZW4oMCk7XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZpc2l0QXR0cihhc3Q6IEF0dHJBc3QsIGN0eDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbiAgdmlzaXREaXJlY3RpdmUoYXN0OiBEaXJlY3RpdmVBc3QsIGN0eDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbiAgdmlzaXRFdmVudChhc3Q6IEJvdW5kRXZlbnRBc3QsIGV2ZW50VGFyZ2V0QW5kTmFtZXM6IE1hcDxzdHJpbmcsIEJvdW5kRXZlbnRBc3Q+KTogYW55IHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZpc2l0VmFyaWFibGUoYXN0OiBWYXJpYWJsZUFzdCwgY3R4OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuICB2aXNpdERpcmVjdGl2ZVByb3BlcnR5KGFzdDogQm91bmREaXJlY3RpdmVQcm9wZXJ0eUFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbiAgdmlzaXRFbGVtZW50UHJvcGVydHkoYXN0OiBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cbn1cblxuZnVuY3Rpb24gX21lcmdlSHRtbEFuZERpcmVjdGl2ZUF0dHJzKGRlY2xhcmVkSHRtbEF0dHJzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGFbXSk6IHN0cmluZ1tdW10ge1xuICB2YXIgcmVzdWx0OiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuICBTdHJpbmdNYXBXcmFwcGVyLmZvckVhY2goZGVjbGFyZWRIdG1sQXR0cnMsICh2YWx1ZSwga2V5KSA9PiB7IHJlc3VsdFtrZXldID0gdmFsdWU7IH0pO1xuICBkaXJlY3RpdmVzLmZvckVhY2goZGlyZWN0aXZlTWV0YSA9PiB7XG4gICAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKGRpcmVjdGl2ZU1ldGEuaG9zdEF0dHJpYnV0ZXMsICh2YWx1ZSwgbmFtZSkgPT4ge1xuICAgICAgdmFyIHByZXZWYWx1ZSA9IHJlc3VsdFtuYW1lXTtcbiAgICAgIHJlc3VsdFtuYW1lXSA9IGlzUHJlc2VudChwcmV2VmFsdWUpID8gbWVyZ2VBdHRyaWJ1dGVWYWx1ZShuYW1lLCBwcmV2VmFsdWUsIHZhbHVlKSA6IHZhbHVlO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIG1hcFRvS2V5VmFsdWVBcnJheShyZXN1bHQpO1xufVxuXG5mdW5jdGlvbiBfcmVhZEh0bWxBdHRycyhhdHRyczogQXR0ckFzdFtdKToge1trZXk6IHN0cmluZ106IHN0cmluZ30ge1xuICB2YXIgaHRtbEF0dHJzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuICBhdHRycy5mb3JFYWNoKChhc3QpID0+IHsgaHRtbEF0dHJzW2FzdC5uYW1lXSA9IGFzdC52YWx1ZTsgfSk7XG4gIHJldHVybiBodG1sQXR0cnM7XG59XG5cbmZ1bmN0aW9uIF9yZWFkSHRtbEFuZERpcmVjdGl2ZVZhcmlhYmxlcyhlbGVtZW50RXhwb3J0QXNWYXJzOiBWYXJpYWJsZUFzdFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IERpcmVjdGl2ZUFzdFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdUeXBlOiBWaWV3VHlwZSk6IHtba2V5OiBzdHJpbmddOiBDb21waWxlVG9rZW5NZXRhZGF0YX0ge1xuICB2YXIgdmFyaWFibGVzOiB7W2tleTogc3RyaW5nXTogQ29tcGlsZVRva2VuTWV0YWRhdGF9ID0ge307XG4gIHZhciBjb21wb25lbnQ6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSA9IG51bGw7XG4gIGRpcmVjdGl2ZXMuZm9yRWFjaCgoZGlyZWN0aXZlKSA9PiB7XG4gICAgaWYgKGRpcmVjdGl2ZS5kaXJlY3RpdmUuaXNDb21wb25lbnQpIHtcbiAgICAgIGNvbXBvbmVudCA9IGRpcmVjdGl2ZS5kaXJlY3RpdmU7XG4gICAgfVxuICAgIGRpcmVjdGl2ZS5leHBvcnRBc1ZhcnMuZm9yRWFjaChcbiAgICAgICAgdmFyQXN0ID0+IHsgdmFyaWFibGVzW3ZhckFzdC5uYW1lXSA9IGlkZW50aWZpZXJUb2tlbihkaXJlY3RpdmUuZGlyZWN0aXZlLnR5cGUpOyB9KTtcbiAgfSk7XG4gIGVsZW1lbnRFeHBvcnRBc1ZhcnMuZm9yRWFjaCgodmFyQXN0KSA9PiB7XG4gICAgdmFyaWFibGVzW3ZhckFzdC5uYW1lXSA9IGlzUHJlc2VudChjb21wb25lbnQpID8gaWRlbnRpZmllclRva2VuKGNvbXBvbmVudC50eXBlKSA6IG51bGw7XG4gIH0pO1xuICByZXR1cm4gdmFyaWFibGVzO1xufVxuXG5mdW5jdGlvbiBtZXJnZUF0dHJpYnV0ZVZhbHVlKGF0dHJOYW1lOiBzdHJpbmcsIGF0dHJWYWx1ZTE6IHN0cmluZywgYXR0clZhbHVlMjogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGF0dHJOYW1lID09IENMQVNTX0FUVFIgfHwgYXR0ck5hbWUgPT0gU1RZTEVfQVRUUikge1xuICAgIHJldHVybiBgJHthdHRyVmFsdWUxfSAke2F0dHJWYWx1ZTJ9YDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYXR0clZhbHVlMjtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXBUb0tleVZhbHVlQXJyYXkoZGF0YToge1trZXk6IHN0cmluZ106IHN0cmluZ30pOiBzdHJpbmdbXVtdIHtcbiAgdmFyIGVudHJ5QXJyYXkgPSBbXTtcbiAgU3RyaW5nTWFwV3JhcHBlci5mb3JFYWNoKGRhdGEsICh2YWx1ZSwgbmFtZSkgPT4geyBlbnRyeUFycmF5LnB1c2goW25hbWUsIHZhbHVlXSk7IH0pO1xuICAvLyBXZSBuZWVkIHRvIHNvcnQgdG8gZ2V0IGEgZGVmaW5lZCBvdXRwdXQgb3JkZXJcbiAgLy8gZm9yIHRlc3RzIGFuZCBmb3IgY2FjaGluZyBnZW5lcmF0ZWQgYXJ0aWZhY3RzLi4uXG4gIExpc3RXcmFwcGVyLnNvcnQoZW50cnlBcnJheSwgKGVudHJ5MSwgZW50cnkyKSA9PiBTdHJpbmdXcmFwcGVyLmNvbXBhcmUoZW50cnkxWzBdLCBlbnRyeTJbMF0pKTtcbiAgdmFyIGtleVZhbHVlQXJyYXkgPSBbXTtcbiAgZW50cnlBcnJheS5mb3JFYWNoKChlbnRyeSkgPT4geyBrZXlWYWx1ZUFycmF5LnB1c2goW2VudHJ5WzBdLCBlbnRyeVsxXV0pOyB9KTtcbiAgcmV0dXJuIGtleVZhbHVlQXJyYXk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVZpZXdUb3BMZXZlbFN0bXRzKHZpZXc6IENvbXBpbGVWaWV3LCB0YXJnZXRTdGF0ZW1lbnRzOiBvLlN0YXRlbWVudFtdKSB7XG4gIHZhciBub2RlRGVidWdJbmZvc1Zhcjogby5FeHByZXNzaW9uID0gby5OVUxMX0VYUFI7XG4gIGlmICh2aWV3LmdlbkNvbmZpZy5nZW5EZWJ1Z0luZm8pIHtcbiAgICBub2RlRGVidWdJbmZvc1ZhciA9IG8udmFyaWFibGUoYG5vZGVEZWJ1Z0luZm9zXyR7dmlldy5jb21wb25lbnQudHlwZS5uYW1lfSR7dmlldy52aWV3SW5kZXh9YCk7XG4gICAgdGFyZ2V0U3RhdGVtZW50cy5wdXNoKFxuICAgICAgICAoPG8uUmVhZFZhckV4cHI+bm9kZURlYnVnSW5mb3NWYXIpXG4gICAgICAgICAgICAuc2V0KG8ubGl0ZXJhbEFycih2aWV3Lm5vZGVzLm1hcChjcmVhdGVTdGF0aWNOb2RlRGVidWdJbmZvKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBvLkFycmF5VHlwZShuZXcgby5FeHRlcm5hbFR5cGUoSWRlbnRpZmllcnMuU3RhdGljTm9kZURlYnVnSW5mbyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW28uVHlwZU1vZGlmaWVyLkNvbnN0XSkpKVxuICAgICAgICAgICAgLnRvRGVjbFN0bXQobnVsbCwgW28uU3RtdE1vZGlmaWVyLkZpbmFsXSkpO1xuICB9XG5cblxuICB2YXIgcmVuZGVyQ29tcFR5cGVWYXI6IG8uUmVhZFZhckV4cHIgPSBvLnZhcmlhYmxlKGByZW5kZXJUeXBlXyR7dmlldy5jb21wb25lbnQudHlwZS5uYW1lfWApO1xuICBpZiAodmlldy52aWV3SW5kZXggPT09IDApIHtcbiAgICB0YXJnZXRTdGF0ZW1lbnRzLnB1c2gocmVuZGVyQ29tcFR5cGVWYXIuc2V0KG8uTlVMTF9FWFBSKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvRGVjbFN0bXQoby5pbXBvcnRUeXBlKElkZW50aWZpZXJzLlJlbmRlckNvbXBvbmVudFR5cGUpKSk7XG4gIH1cblxuICB2YXIgdmlld0NsYXNzID0gY3JlYXRlVmlld0NsYXNzKHZpZXcsIHJlbmRlckNvbXBUeXBlVmFyLCBub2RlRGVidWdJbmZvc1Zhcik7XG4gIHRhcmdldFN0YXRlbWVudHMucHVzaCh2aWV3Q2xhc3MpO1xuICB0YXJnZXRTdGF0ZW1lbnRzLnB1c2goY3JlYXRlVmlld0ZhY3Rvcnkodmlldywgdmlld0NsYXNzLCByZW5kZXJDb21wVHlwZVZhcikpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTdGF0aWNOb2RlRGVidWdJbmZvKG5vZGU6IENvbXBpbGVOb2RlKTogby5FeHByZXNzaW9uIHtcbiAgdmFyIGNvbXBpbGVFbGVtZW50ID0gbm9kZSBpbnN0YW5jZW9mIENvbXBpbGVFbGVtZW50ID8gbm9kZSA6IG51bGw7XG4gIHZhciBwcm92aWRlclRva2Vuczogby5FeHByZXNzaW9uW10gPSBbXTtcbiAgdmFyIGNvbXBvbmVudFRva2VuOiBvLkV4cHJlc3Npb24gPSBvLk5VTExfRVhQUjtcbiAgdmFyIHZhclRva2VuRW50cmllcyA9IFtdO1xuICBpZiAoaXNQcmVzZW50KGNvbXBpbGVFbGVtZW50KSkge1xuICAgIHByb3ZpZGVyVG9rZW5zID0gY29tcGlsZUVsZW1lbnQuZ2V0UHJvdmlkZXJUb2tlbnMoKTtcbiAgICBpZiAoaXNQcmVzZW50KGNvbXBpbGVFbGVtZW50LmNvbXBvbmVudCkpIHtcbiAgICAgIGNvbXBvbmVudFRva2VuID0gY3JlYXRlRGlUb2tlbkV4cHJlc3Npb24oaWRlbnRpZmllclRva2VuKGNvbXBpbGVFbGVtZW50LmNvbXBvbmVudC50eXBlKSk7XG4gICAgfVxuICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChjb21waWxlRWxlbWVudC52YXJpYWJsZVRva2VucywgKHRva2VuLCB2YXJOYW1lKSA9PiB7XG4gICAgICB2YXJUb2tlbkVudHJpZXMucHVzaChcbiAgICAgICAgICBbdmFyTmFtZSwgaXNQcmVzZW50KHRva2VuKSA/IGNyZWF0ZURpVG9rZW5FeHByZXNzaW9uKHRva2VuKSA6IG8uTlVMTF9FWFBSXSk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5TdGF0aWNOb2RlRGVidWdJbmZvKVxuICAgICAgLmluc3RhbnRpYXRlKFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIG8ubGl0ZXJhbEFycihwcm92aWRlclRva2VucywgbmV3IG8uQXJyYXlUeXBlKG8uRFlOQU1JQ19UWVBFLCBbby5UeXBlTW9kaWZpZXIuQ29uc3RdKSksXG4gICAgICAgICAgICBjb21wb25lbnRUb2tlbixcbiAgICAgICAgICAgIG8ubGl0ZXJhbE1hcCh2YXJUb2tlbkVudHJpZXMsIG5ldyBvLk1hcFR5cGUoby5EWU5BTUlDX1RZUEUsIFtvLlR5cGVNb2RpZmllci5Db25zdF0pKVxuICAgICAgICAgIF0sXG4gICAgICAgICAgby5pbXBvcnRUeXBlKElkZW50aWZpZXJzLlN0YXRpY05vZGVEZWJ1Z0luZm8sIG51bGwsIFtvLlR5cGVNb2RpZmllci5Db25zdF0pKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVmlld0NsYXNzKHZpZXc6IENvbXBpbGVWaWV3LCByZW5kZXJDb21wVHlwZVZhcjogby5SZWFkVmFyRXhwcixcbiAgICAgICAgICAgICAgICAgICAgICAgICBub2RlRGVidWdJbmZvc1Zhcjogby5FeHByZXNzaW9uKTogby5DbGFzc1N0bXQge1xuICB2YXIgZW1wdHlUZW1wbGF0ZVZhcmlhYmxlQmluZGluZ3MgPVxuICAgICAgdmlldy50ZW1wbGF0ZVZhcmlhYmxlQmluZGluZ3MubWFwKChlbnRyeSkgPT4gW2VudHJ5WzBdLCBvLk5VTExfRVhQUl0pO1xuICB2YXIgdmlld0NvbnN0cnVjdG9yQXJncyA9IFtcbiAgICBuZXcgby5GblBhcmFtKFZpZXdDb25zdHJ1Y3RvclZhcnMudmlld1V0aWxzLm5hbWUsIG8uaW1wb3J0VHlwZShJZGVudGlmaWVycy5WaWV3VXRpbHMpKSxcbiAgICBuZXcgby5GblBhcmFtKFZpZXdDb25zdHJ1Y3RvclZhcnMucGFyZW50SW5qZWN0b3IubmFtZSwgby5pbXBvcnRUeXBlKElkZW50aWZpZXJzLkluamVjdG9yKSksXG4gICAgbmV3IG8uRm5QYXJhbShWaWV3Q29uc3RydWN0b3JWYXJzLmRlY2xhcmF0aW9uRWwubmFtZSwgby5pbXBvcnRUeXBlKElkZW50aWZpZXJzLkFwcEVsZW1lbnQpKVxuICBdO1xuICB2YXIgdmlld0NvbnN0cnVjdG9yID0gbmV3IG8uQ2xhc3NNZXRob2QobnVsbCwgdmlld0NvbnN0cnVjdG9yQXJncywgW1xuICAgIG8uU1VQRVJfRVhQUi5jYWxsRm4oW1xuICAgICAgICAgICAgICAgICAgby52YXJpYWJsZSh2aWV3LmNsYXNzTmFtZSksXG4gICAgICAgICAgICAgICAgICByZW5kZXJDb21wVHlwZVZhcixcbiAgICAgICAgICAgICAgICAgIFZpZXdUeXBlRW51bS5mcm9tVmFsdWUodmlldy52aWV3VHlwZSksXG4gICAgICAgICAgICAgICAgICBvLmxpdGVyYWxNYXAoZW1wdHlUZW1wbGF0ZVZhcmlhYmxlQmluZGluZ3MpLFxuICAgICAgICAgICAgICAgICAgVmlld0NvbnN0cnVjdG9yVmFycy52aWV3VXRpbHMsXG4gICAgICAgICAgICAgICAgICBWaWV3Q29uc3RydWN0b3JWYXJzLnBhcmVudEluamVjdG9yLFxuICAgICAgICAgICAgICAgICAgVmlld0NvbnN0cnVjdG9yVmFycy5kZWNsYXJhdGlvbkVsLFxuICAgICAgICAgICAgICAgICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3lFbnVtLmZyb21WYWx1ZShnZXRDaGFuZ2VEZXRlY3Rpb25Nb2RlKHZpZXcpKSxcbiAgICAgICAgICAgICAgICAgIG5vZGVEZWJ1Z0luZm9zVmFyXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgLnRvU3RtdCgpXG4gIF0pO1xuXG4gIHZhciB2aWV3TWV0aG9kcyA9IFtcbiAgICBuZXcgby5DbGFzc01ldGhvZCgnY3JlYXRlSW50ZXJuYWwnLCBbbmV3IG8uRm5QYXJhbShyb290U2VsZWN0b3JWYXIubmFtZSwgby5TVFJJTkdfVFlQRSldLFxuICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlQ3JlYXRlTWV0aG9kKHZpZXcpLCBvLmltcG9ydFR5cGUoSWRlbnRpZmllcnMuQXBwRWxlbWVudCkpLFxuICAgIG5ldyBvLkNsYXNzTWV0aG9kKFxuICAgICAgICAnaW5qZWN0b3JHZXRJbnRlcm5hbCcsXG4gICAgICAgIFtcbiAgICAgICAgICBuZXcgby5GblBhcmFtKEluamVjdE1ldGhvZFZhcnMudG9rZW4ubmFtZSwgby5EWU5BTUlDX1RZUEUpLFxuICAgICAgICAgIC8vIE5vdGU6IENhbid0IHVzZSBvLklOVF9UWVBFIGhlcmUgYXMgdGhlIG1ldGhvZCBpbiBBcHBWaWV3IHVzZXMgbnVtYmVyXG4gICAgICAgICAgbmV3IG8uRm5QYXJhbShJbmplY3RNZXRob2RWYXJzLnJlcXVlc3ROb2RlSW5kZXgubmFtZSwgby5OVU1CRVJfVFlQRSksXG4gICAgICAgICAgbmV3IG8uRm5QYXJhbShJbmplY3RNZXRob2RWYXJzLm5vdEZvdW5kUmVzdWx0Lm5hbWUsIG8uRFlOQU1JQ19UWVBFKVxuICAgICAgICBdLFxuICAgICAgICBhZGRSZXR1cm5WYWx1ZWZOb3RFbXB0eSh2aWV3LmluamVjdG9yR2V0TWV0aG9kLmZpbmlzaCgpLCBJbmplY3RNZXRob2RWYXJzLm5vdEZvdW5kUmVzdWx0KSxcbiAgICAgICAgby5EWU5BTUlDX1RZUEUpLFxuICAgIG5ldyBvLkNsYXNzTWV0aG9kKCdkZXRlY3RDaGFuZ2VzSW50ZXJuYWwnLFxuICAgICAgICAgICAgICAgICAgICAgIFtuZXcgby5GblBhcmFtKERldGVjdENoYW5nZXNWYXJzLnRocm93T25DaGFuZ2UubmFtZSwgby5CT09MX1RZUEUpXSxcbiAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZURldGVjdENoYW5nZXNNZXRob2QodmlldykpLFxuICAgIG5ldyBvLkNsYXNzTWV0aG9kKCdkaXJ0eVBhcmVudFF1ZXJpZXNJbnRlcm5hbCcsIFtdLCB2aWV3LmRpcnR5UGFyZW50UXVlcmllc01ldGhvZC5maW5pc2goKSksXG4gICAgbmV3IG8uQ2xhc3NNZXRob2QoJ2Rlc3Ryb3lJbnRlcm5hbCcsIFtdLCB2aWV3LmRlc3Ryb3lNZXRob2QuZmluaXNoKCkpXG4gIF0uY29uY2F0KHZpZXcuZXZlbnRIYW5kbGVyTWV0aG9kcyk7XG4gIHZhciB2aWV3Q2xhc3MgPSBuZXcgby5DbGFzc1N0bXQoXG4gICAgICB2aWV3LmNsYXNzTmFtZSwgby5pbXBvcnRFeHByKElkZW50aWZpZXJzLkFwcFZpZXcsIFtnZXRDb250ZXh0VHlwZSh2aWV3KV0pLCB2aWV3LmZpZWxkcyxcbiAgICAgIHZpZXcuZ2V0dGVycywgdmlld0NvbnN0cnVjdG9yLCB2aWV3TWV0aG9kcy5maWx0ZXIoKG1ldGhvZCkgPT4gbWV0aG9kLmJvZHkubGVuZ3RoID4gMCkpO1xuICByZXR1cm4gdmlld0NsYXNzO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVWaWV3RmFjdG9yeSh2aWV3OiBDb21waWxlVmlldywgdmlld0NsYXNzOiBvLkNsYXNzU3RtdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlckNvbXBUeXBlVmFyOiBvLlJlYWRWYXJFeHByKTogby5TdGF0ZW1lbnQge1xuICB2YXIgdmlld0ZhY3RvcnlBcmdzID0gW1xuICAgIG5ldyBvLkZuUGFyYW0oVmlld0NvbnN0cnVjdG9yVmFycy52aWV3VXRpbHMubmFtZSwgby5pbXBvcnRUeXBlKElkZW50aWZpZXJzLlZpZXdVdGlscykpLFxuICAgIG5ldyBvLkZuUGFyYW0oVmlld0NvbnN0cnVjdG9yVmFycy5wYXJlbnRJbmplY3Rvci5uYW1lLCBvLmltcG9ydFR5cGUoSWRlbnRpZmllcnMuSW5qZWN0b3IpKSxcbiAgICBuZXcgby5GblBhcmFtKFZpZXdDb25zdHJ1Y3RvclZhcnMuZGVjbGFyYXRpb25FbC5uYW1lLCBvLmltcG9ydFR5cGUoSWRlbnRpZmllcnMuQXBwRWxlbWVudCkpXG4gIF07XG4gIHZhciBpbml0UmVuZGVyQ29tcFR5cGVTdG10cyA9IFtdO1xuICB2YXIgdGVtcGxhdGVVcmxJbmZvO1xuICBpZiAodmlldy5jb21wb25lbnQudGVtcGxhdGUudGVtcGxhdGVVcmwgPT0gdmlldy5jb21wb25lbnQudHlwZS5tb2R1bGVVcmwpIHtcbiAgICB0ZW1wbGF0ZVVybEluZm8gPVxuICAgICAgICBgJHt2aWV3LmNvbXBvbmVudC50eXBlLm1vZHVsZVVybH0gY2xhc3MgJHt2aWV3LmNvbXBvbmVudC50eXBlLm5hbWV9IC0gaW5saW5lIHRlbXBsYXRlYDtcbiAgfSBlbHNlIHtcbiAgICB0ZW1wbGF0ZVVybEluZm8gPSB2aWV3LmNvbXBvbmVudC50ZW1wbGF0ZS50ZW1wbGF0ZVVybDtcbiAgfVxuICBpZiAodmlldy52aWV3SW5kZXggPT09IDApIHtcbiAgICBpbml0UmVuZGVyQ29tcFR5cGVTdG10cyA9IFtcbiAgICAgIG5ldyBvLklmU3RtdChyZW5kZXJDb21wVHlwZVZhci5pZGVudGljYWwoby5OVUxMX0VYUFIpLFxuICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgIHJlbmRlckNvbXBUeXBlVmFyLnNldChWaWV3Q29uc3RydWN0b3JWYXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC52aWV3VXRpbHMuY2FsbE1ldGhvZCgnY3JlYXRlUmVuZGVyQ29tcG9uZW50VHlwZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8ubGl0ZXJhbCh0ZW1wbGF0ZVVybEluZm8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmxpdGVyYWwodmlldy5jb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGVtcGxhdGUubmdDb250ZW50U2VsZWN0b3JzLmxlbmd0aCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZpZXdFbmNhcHN1bGF0aW9uRW51bVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZyb21WYWx1ZSh2aWV3LmNvbXBvbmVudC50ZW1wbGF0ZS5lbmNhcHN1bGF0aW9uKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zdHlsZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgIC50b1N0bXQoKVxuICAgICAgICAgICAgICAgICAgIF0pXG4gICAgXTtcbiAgfVxuICByZXR1cm4gby5mbih2aWV3RmFjdG9yeUFyZ3MsIGluaXRSZW5kZXJDb21wVHlwZVN0bXRzLmNvbmNhdChbXG4gICAgICAgICAgICBuZXcgby5SZXR1cm5TdGF0ZW1lbnQoby52YXJpYWJsZSh2aWV3Q2xhc3MubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmluc3RhbnRpYXRlKHZpZXdDbGFzcy5jb25zdHJ1Y3Rvck1ldGhvZC5wYXJhbXMubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHBhcmFtKSA9PiBvLnZhcmlhYmxlKHBhcmFtLm5hbWUpKSkpXG4gICAgICAgICAgXSksXG4gICAgICAgICAgICAgIG8uaW1wb3J0VHlwZShJZGVudGlmaWVycy5BcHBWaWV3LCBbZ2V0Q29udGV4dFR5cGUodmlldyldKSlcbiAgICAgIC50b0RlY2xTdG10KHZpZXcudmlld0ZhY3RvcnkubmFtZSwgW28uU3RtdE1vZGlmaWVyLkZpbmFsXSk7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQ3JlYXRlTWV0aG9kKHZpZXc6IENvbXBpbGVWaWV3KTogby5TdGF0ZW1lbnRbXSB7XG4gIHZhciBwYXJlbnRSZW5kZXJOb2RlRXhwcjogby5FeHByZXNzaW9uID0gby5OVUxMX0VYUFI7XG4gIHZhciBwYXJlbnRSZW5kZXJOb2RlU3RtdHMgPSBbXTtcbiAgaWYgKHZpZXcudmlld1R5cGUgPT09IFZpZXdUeXBlLkNPTVBPTkVOVCkge1xuICAgIHBhcmVudFJlbmRlck5vZGVFeHByID0gVmlld1Byb3BlcnRpZXMucmVuZGVyZXIuY2FsbE1ldGhvZChcbiAgICAgICAgJ2NyZWF0ZVZpZXdSb290JywgW28uVEhJU19FWFBSLnByb3AoJ2RlY2xhcmF0aW9uQXBwRWxlbWVudCcpLnByb3AoJ25hdGl2ZUVsZW1lbnQnKV0pO1xuICAgIHBhcmVudFJlbmRlck5vZGVTdG10cyA9IFtcbiAgICAgIHBhcmVudFJlbmRlck5vZGVWYXIuc2V0KHBhcmVudFJlbmRlck5vZGVFeHByKVxuICAgICAgICAgIC50b0RlY2xTdG10KG8uaW1wb3J0VHlwZSh2aWV3LmdlbkNvbmZpZy5yZW5kZXJUeXBlcy5yZW5kZXJOb2RlKSwgW28uU3RtdE1vZGlmaWVyLkZpbmFsXSlcbiAgICBdO1xuICB9XG4gIHZhciByZXN1bHRFeHByOiBvLkV4cHJlc3Npb247XG4gIGlmICh2aWV3LnZpZXdUeXBlID09PSBWaWV3VHlwZS5IT1NUKSB7XG4gICAgcmVzdWx0RXhwciA9ICg8Q29tcGlsZUVsZW1lbnQ+dmlldy5ub2Rlc1swXSkuYXBwRWxlbWVudDtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHRFeHByID0gby5OVUxMX0VYUFI7XG4gIH1cbiAgcmV0dXJuIHBhcmVudFJlbmRlck5vZGVTdG10cy5jb25jYXQodmlldy5jcmVhdGVNZXRob2QuZmluaXNoKCkpXG4gICAgICAuY29uY2F0KFtcbiAgICAgICAgby5USElTX0VYUFIuY2FsbE1ldGhvZCgnaW5pdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlRmxhdEFycmF5KHZpZXcucm9vdE5vZGVzT3JBcHBFbGVtZW50cyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmxpdGVyYWxBcnIodmlldy5ub2Rlcy5tYXAobm9kZSA9PiBub2RlLnJlbmRlck5vZGUpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8ubGl0ZXJhbEFycih2aWV3LmRpc3Bvc2FibGVzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8ubGl0ZXJhbEFycih2aWV3LnN1YnNjcmlwdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIC50b1N0bXQoKSxcbiAgICAgICAgbmV3IG8uUmV0dXJuU3RhdGVtZW50KHJlc3VsdEV4cHIpXG4gICAgICBdKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVEZXRlY3RDaGFuZ2VzTWV0aG9kKHZpZXc6IENvbXBpbGVWaWV3KTogby5TdGF0ZW1lbnRbXSB7XG4gIHZhciBzdG10cyA9IFtdO1xuICBpZiAodmlldy5kZXRlY3RDaGFuZ2VzSW5JbnB1dHNNZXRob2QuaXNFbXB0eSgpICYmIHZpZXcudXBkYXRlQ29udGVudFF1ZXJpZXNNZXRob2QuaXNFbXB0eSgpICYmXG4gICAgICB2aWV3LmFmdGVyQ29udGVudExpZmVjeWNsZUNhbGxiYWNrc01ldGhvZC5pc0VtcHR5KCkgJiZcbiAgICAgIHZpZXcuZGV0ZWN0Q2hhbmdlc1JlbmRlclByb3BlcnRpZXNNZXRob2QuaXNFbXB0eSgpICYmXG4gICAgICB2aWV3LnVwZGF0ZVZpZXdRdWVyaWVzTWV0aG9kLmlzRW1wdHkoKSAmJiB2aWV3LmFmdGVyVmlld0xpZmVjeWNsZUNhbGxiYWNrc01ldGhvZC5pc0VtcHR5KCkpIHtcbiAgICByZXR1cm4gc3RtdHM7XG4gIH1cbiAgTGlzdFdyYXBwZXIuYWRkQWxsKHN0bXRzLCB2aWV3LmRldGVjdENoYW5nZXNJbklucHV0c01ldGhvZC5maW5pc2goKSk7XG4gIHN0bXRzLnB1c2goXG4gICAgICBvLlRISVNfRVhQUi5jYWxsTWV0aG9kKCdkZXRlY3RDb250ZW50Q2hpbGRyZW5DaGFuZ2VzJywgW0RldGVjdENoYW5nZXNWYXJzLnRocm93T25DaGFuZ2VdKVxuICAgICAgICAgIC50b1N0bXQoKSk7XG4gIHZhciBhZnRlckNvbnRlbnRTdG10cyA9IHZpZXcudXBkYXRlQ29udGVudFF1ZXJpZXNNZXRob2QuZmluaXNoKCkuY29uY2F0KFxuICAgICAgdmlldy5hZnRlckNvbnRlbnRMaWZlY3ljbGVDYWxsYmFja3NNZXRob2QuZmluaXNoKCkpO1xuICBpZiAoYWZ0ZXJDb250ZW50U3RtdHMubGVuZ3RoID4gMCkge1xuICAgIHN0bXRzLnB1c2gobmV3IG8uSWZTdG10KG8ubm90KERldGVjdENoYW5nZXNWYXJzLnRocm93T25DaGFuZ2UpLCBhZnRlckNvbnRlbnRTdG10cykpO1xuICB9XG4gIExpc3RXcmFwcGVyLmFkZEFsbChzdG10cywgdmlldy5kZXRlY3RDaGFuZ2VzUmVuZGVyUHJvcGVydGllc01ldGhvZC5maW5pc2goKSk7XG4gIHN0bXRzLnB1c2goby5USElTX0VYUFIuY2FsbE1ldGhvZCgnZGV0ZWN0Vmlld0NoaWxkcmVuQ2hhbmdlcycsIFtEZXRlY3RDaGFuZ2VzVmFycy50aHJvd09uQ2hhbmdlXSlcbiAgICAgICAgICAgICAgICAgLnRvU3RtdCgpKTtcbiAgdmFyIGFmdGVyVmlld1N0bXRzID1cbiAgICAgIHZpZXcudXBkYXRlVmlld1F1ZXJpZXNNZXRob2QuZmluaXNoKCkuY29uY2F0KHZpZXcuYWZ0ZXJWaWV3TGlmZWN5Y2xlQ2FsbGJhY2tzTWV0aG9kLmZpbmlzaCgpKTtcbiAgaWYgKGFmdGVyVmlld1N0bXRzLmxlbmd0aCA+IDApIHtcbiAgICBzdG10cy5wdXNoKG5ldyBvLklmU3RtdChvLm5vdChEZXRlY3RDaGFuZ2VzVmFycy50aHJvd09uQ2hhbmdlKSwgYWZ0ZXJWaWV3U3RtdHMpKTtcbiAgfVxuXG4gIHZhciB2YXJTdG10cyA9IFtdO1xuICB2YXIgcmVhZFZhcnMgPSBvLmZpbmRSZWFkVmFyTmFtZXMoc3RtdHMpO1xuICBpZiAoU2V0V3JhcHBlci5oYXMocmVhZFZhcnMsIERldGVjdENoYW5nZXNWYXJzLmNoYW5nZWQubmFtZSkpIHtcbiAgICB2YXJTdG10cy5wdXNoKERldGVjdENoYW5nZXNWYXJzLmNoYW5nZWQuc2V0KG8ubGl0ZXJhbCh0cnVlKSkudG9EZWNsU3RtdChvLkJPT0xfVFlQRSkpO1xuICB9XG4gIGlmIChTZXRXcmFwcGVyLmhhcyhyZWFkVmFycywgRGV0ZWN0Q2hhbmdlc1ZhcnMuY2hhbmdlcy5uYW1lKSkge1xuICAgIHZhclN0bXRzLnB1c2goRGV0ZWN0Q2hhbmdlc1ZhcnMuY2hhbmdlcy5zZXQoby5OVUxMX0VYUFIpXG4gICAgICAgICAgICAgICAgICAgICAgLnRvRGVjbFN0bXQobmV3IG8uTWFwVHlwZShvLmltcG9ydFR5cGUoSWRlbnRpZmllcnMuU2ltcGxlQ2hhbmdlKSkpKTtcbiAgfVxuICBpZiAoU2V0V3JhcHBlci5oYXMocmVhZFZhcnMsIERldGVjdENoYW5nZXNWYXJzLnZhbFVud3JhcHBlci5uYW1lKSkge1xuICAgIHZhclN0bXRzLnB1c2goXG4gICAgICAgIERldGVjdENoYW5nZXNWYXJzLnZhbFVud3JhcHBlci5zZXQoby5pbXBvcnRFeHByKElkZW50aWZpZXJzLlZhbHVlVW53cmFwcGVyKS5pbnN0YW50aWF0ZShbXSkpXG4gICAgICAgICAgICAudG9EZWNsU3RtdChudWxsLCBbby5TdG10TW9kaWZpZXIuRmluYWxdKSk7XG4gIH1cbiAgcmV0dXJuIHZhclN0bXRzLmNvbmNhdChzdG10cyk7XG59XG5cbmZ1bmN0aW9uIGFkZFJldHVyblZhbHVlZk5vdEVtcHR5KHN0YXRlbWVudHM6IG8uU3RhdGVtZW50W10sIHZhbHVlOiBvLkV4cHJlc3Npb24pOiBvLlN0YXRlbWVudFtdIHtcbiAgaWYgKHN0YXRlbWVudHMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBzdGF0ZW1lbnRzLmNvbmNhdChbbmV3IG8uUmV0dXJuU3RhdGVtZW50KHZhbHVlKV0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldENvbnRleHRUeXBlKHZpZXc6IENvbXBpbGVWaWV3KTogby5UeXBlIHtcbiAgdmFyIHR5cGVNZXRhID0gdmlldy5jb21wb25lbnQudHlwZTtcbiAgcmV0dXJuIHR5cGVNZXRhLmlzSG9zdCA/IG8uRFlOQU1JQ19UWVBFIDogby5pbXBvcnRUeXBlKHR5cGVNZXRhKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2hhbmdlRGV0ZWN0aW9uTW9kZSh2aWV3OiBDb21waWxlVmlldyk6IENoYW5nZURldGVjdGlvblN0cmF0ZWd5IHtcbiAgdmFyIG1vZGU6IENoYW5nZURldGVjdGlvblN0cmF0ZWd5O1xuICBpZiAodmlldy52aWV3VHlwZSA9PT0gVmlld1R5cGUuQ09NUE9ORU5UKSB7XG4gICAgbW9kZSA9IGlzRGVmYXVsdENoYW5nZURldGVjdGlvblN0cmF0ZWd5KHZpZXcuY29tcG9uZW50LmNoYW5nZURldGVjdGlvbikgP1xuICAgICAgICAgICAgICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuQ2hlY2tBbHdheXMgOlxuICAgICAgICAgICAgICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuQ2hlY2tPbmNlO1xuICB9IGVsc2Uge1xuICAgIG1vZGUgPSBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5DaGVja0Fsd2F5cztcbiAgfVxuICByZXR1cm4gbW9kZTtcbn1cbiJdfQ==