import { isPresent } from 'angular2/src/facade/lang';
/**
 * A segment of text within the template.
 */
export class TextAst {
    constructor(value, ngContentIndex, sourceSpan) {
        this.value = value;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) { return visitor.visitText(this, context); }
}
/**
 * A bound expression within the text of a template.
 */
export class BoundTextAst {
    constructor(value, ngContentIndex, sourceSpan) {
        this.value = value;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitBoundText(this, context);
    }
}
/**
 * A plain attribute on an element.
 */
export class AttrAst {
    constructor(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) { return visitor.visitAttr(this, context); }
}
/**
 * A binding for an element property (e.g. `[property]="expression"`).
 */
export class BoundElementPropertyAst {
    constructor(name, type, value, unit, sourceSpan) {
        this.name = name;
        this.type = type;
        this.value = value;
        this.unit = unit;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitElementProperty(this, context);
    }
}
/**
 * A binding for an element event (e.g. `(event)="handler()"`).
 */
export class BoundEventAst {
    constructor(name, target, handler, sourceSpan) {
        this.name = name;
        this.target = target;
        this.handler = handler;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitEvent(this, context);
    }
    get fullName() {
        if (isPresent(this.target)) {
            return `${this.target}:${this.name}`;
        }
        else {
            return this.name;
        }
    }
}
/**
 * A variable declaration on an element (e.g. `#var="expression"`).
 */
export class VariableAst {
    constructor(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitVariable(this, context);
    }
}
/**
 * An element declaration in a template.
 */
export class ElementAst {
    constructor(name, attrs, inputs, outputs, exportAsVars, directives, providers, hasViewContainer, children, ngContentIndex, sourceSpan) {
        this.name = name;
        this.attrs = attrs;
        this.inputs = inputs;
        this.outputs = outputs;
        this.exportAsVars = exportAsVars;
        this.directives = directives;
        this.providers = providers;
        this.hasViewContainer = hasViewContainer;
        this.children = children;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitElement(this, context);
    }
    /**
     * Whether the element has any active bindings (inputs, outputs, vars, or directives).
     */
    isBound() {
        return (this.inputs.length > 0 || this.outputs.length > 0 || this.exportAsVars.length > 0 ||
            this.directives.length > 0);
    }
    /**
     * Get the component associated with this element, if any.
     */
    getComponent() {
        for (var i = 0; i < this.directives.length; i++) {
            var dirAst = this.directives[i];
            if (dirAst.directive.isComponent) {
                return dirAst.directive;
            }
        }
        return null;
    }
}
/**
 * A `<template>` element included in an Angular template.
 */
export class EmbeddedTemplateAst {
    constructor(attrs, outputs, vars, directives, providers, hasViewContainer, children, ngContentIndex, sourceSpan) {
        this.attrs = attrs;
        this.outputs = outputs;
        this.vars = vars;
        this.directives = directives;
        this.providers = providers;
        this.hasViewContainer = hasViewContainer;
        this.children = children;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitEmbeddedTemplate(this, context);
    }
}
/**
 * A directive property with a bound value (e.g. `*ngIf="condition").
 */
export class BoundDirectivePropertyAst {
    constructor(directiveName, templateName, value, sourceSpan) {
        this.directiveName = directiveName;
        this.templateName = templateName;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitDirectiveProperty(this, context);
    }
}
/**
 * A directive declared on an element.
 */
export class DirectiveAst {
    constructor(directive, inputs, hostProperties, hostEvents, exportAsVars, sourceSpan) {
        this.directive = directive;
        this.inputs = inputs;
        this.hostProperties = hostProperties;
        this.hostEvents = hostEvents;
        this.exportAsVars = exportAsVars;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitDirective(this, context);
    }
}
/**
 * A provider declared on an element
 */
export class ProviderAst {
    constructor(token, multiProvider, eager, providers, providerType, sourceSpan) {
        this.token = token;
        this.multiProvider = multiProvider;
        this.eager = eager;
        this.providers = providers;
        this.providerType = providerType;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        // No visit method in the visitor for now...
        return null;
    }
}
export var ProviderAstType;
(function (ProviderAstType) {
    ProviderAstType[ProviderAstType["PublicService"] = 0] = "PublicService";
    ProviderAstType[ProviderAstType["PrivateService"] = 1] = "PrivateService";
    ProviderAstType[ProviderAstType["Component"] = 2] = "Component";
    ProviderAstType[ProviderAstType["Directive"] = 3] = "Directive";
    ProviderAstType[ProviderAstType["Builtin"] = 4] = "Builtin";
})(ProviderAstType || (ProviderAstType = {}));
/**
 * Position where content is to be projected (instance of `<ng-content>` in a template).
 */
export class NgContentAst {
    constructor(index, ngContentIndex, sourceSpan) {
        this.index = index;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    visit(visitor, context) {
        return visitor.visitNgContent(this, context);
    }
}
/**
 * Enumeration of types of property bindings.
 */
export var PropertyBindingType;
(function (PropertyBindingType) {
    /**
     * A normal binding to a property (e.g. `[property]="expression"`).
     */
    PropertyBindingType[PropertyBindingType["Property"] = 0] = "Property";
    /**
     * A binding to an element attribute (e.g. `[attr.name]="expression"`).
     */
    PropertyBindingType[PropertyBindingType["Attribute"] = 1] = "Attribute";
    /**
     * A binding to a CSS class (e.g. `[class.name]="condition"`).
     */
    PropertyBindingType[PropertyBindingType["Class"] = 2] = "Class";
    /**
     * A binding to a style rule (e.g. `[style.rule]="expression"`).
     */
    PropertyBindingType[PropertyBindingType["Style"] = 3] = "Style";
})(PropertyBindingType || (PropertyBindingType = {}));
/**
 * Visit every node in a list of {@link TemplateAst}s with the given {@link TemplateAstVisitor}.
 */
export function templateVisitAll(visitor, asts, context = null) {
    var result = [];
    asts.forEach(ast => {
        var astResult = ast.visit(visitor, context);
        if (isPresent(astResult)) {
            result.push(astResult);
        }
    });
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfYXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC05RDFpR1FWRy50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3RlbXBsYXRlX2FzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FDTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQjtBQXlCbEQ7O0dBRUc7QUFDSDtJQUNFLFlBQW1CLEtBQWEsRUFBUyxjQUFzQixFQUM1QyxVQUEyQjtRQUQzQixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsbUJBQWMsR0FBZCxjQUFjLENBQVE7UUFDNUMsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7SUFBRyxDQUFDO0lBQ2xELEtBQUssQ0FBQyxPQUEyQixFQUFFLE9BQVksSUFBUyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BHLENBQUM7QUFFRDs7R0FFRztBQUNIO0lBQ0UsWUFBbUIsS0FBVSxFQUFTLGNBQXNCLEVBQ3pDLFVBQTJCO1FBRDNCLFVBQUssR0FBTCxLQUFLLENBQUs7UUFBUyxtQkFBYyxHQUFkLGNBQWMsQ0FBUTtRQUN6QyxlQUFVLEdBQVYsVUFBVSxDQUFpQjtJQUFHLENBQUM7SUFDbEQsS0FBSyxDQUFDLE9BQTJCLEVBQUUsT0FBWTtRQUM3QyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0MsQ0FBQztBQUNILENBQUM7QUFFRDs7R0FFRztBQUNIO0lBQ0UsWUFBbUIsSUFBWSxFQUFTLEtBQWEsRUFBUyxVQUEyQjtRQUF0RSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFTLGVBQVUsR0FBVixVQUFVLENBQWlCO0lBQUcsQ0FBQztJQUM3RixLQUFLLENBQUMsT0FBMkIsRUFBRSxPQUFZLElB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RyxFQUFFLENBQUM7SUFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO1FBQ2QsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pCLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QVNUfSBmcm9tICcuL2V4cHJlc3Npb25fcGFyc2VyL2FzdCc7XG5pbXBvcnQge2lzUHJlc2VudH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7XG4gIENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgQ29tcGlsZVRva2VuTWV0YWRhdGEsXG4gIENvbXBpbGVQcm92aWRlck1ldGFkYXRhLFxuICBDb21waWxlVG9rZW5NYXAsXG4gIENvbXBpbGVRdWVyeU1ldGFkYXRhXG59IGZyb20gJy4vY29tcGlsZV9tZXRhZGF0YSc7XG5pbXBvcnQge1BhcnNlU291cmNlU3Bhbn0gZnJvbSAnLi9wYXJzZV91dGlsJztcblxuLyoqXG4gKiBBbiBBYnN0cmFjdCBTeW50YXggVHJlZSBub2RlIHJlcHJlc2VudGluZyBwYXJ0IG9mIGEgcGFyc2VkIEFuZ3VsYXIgdGVtcGxhdGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGVBc3Qge1xuICAvKipcbiAgICogVGhlIHNvdXJjZSBzcGFuIGZyb20gd2hpY2ggdGhpcyBub2RlIHdhcyBwYXJzZWQuXG4gICAqL1xuICBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW47XG5cbiAgLyoqXG4gICAqIFZpc2l0IHRoaXMgbm9kZSBhbmQgcG9zc2libHkgdHJhbnNmb3JtIGl0LlxuICAgKi9cbiAgdmlzaXQodmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnk7XG59XG5cbi8qKlxuICogQSBzZWdtZW50IG9mIHRleHQgd2l0aGluIHRoZSB0ZW1wbGF0ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFRleHRBc3QgaW1wbGVtZW50cyBUZW1wbGF0ZUFzdCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogc3RyaW5nLCBwdWJsaWMgbmdDb250ZW50SW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICAgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge31cbiAgdmlzaXQodmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gdmlzaXRvci52aXNpdFRleHQodGhpcywgY29udGV4dCk7IH1cbn1cblxuLyoqXG4gKiBBIGJvdW5kIGV4cHJlc3Npb24gd2l0aGluIHRoZSB0ZXh0IG9mIGEgdGVtcGxhdGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBCb3VuZFRleHRBc3QgaW1wbGVtZW50cyBUZW1wbGF0ZUFzdCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogQVNULCBwdWJsaWMgbmdDb250ZW50SW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICAgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge31cbiAgdmlzaXQodmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Qm91bmRUZXh0KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbi8qKlxuICogQSBwbGFpbiBhdHRyaWJ1dGUgb24gYW4gZWxlbWVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIEF0dHJBc3QgaW1wbGVtZW50cyBUZW1wbGF0ZUFzdCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyB2YWx1ZTogc3RyaW5nLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuICB2aXNpdCh2aXNpdG9yOiBUZW1wbGF0ZUFzdFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0QXR0cih0aGlzLCBjb250ZXh0KTsgfVxufVxuXG4vKipcbiAqIEEgYmluZGluZyBmb3IgYW4gZWxlbWVudCBwcm9wZXJ0eSAoZS5nLiBgW3Byb3BlcnR5XT1cImV4cHJlc3Npb25cImApLlxuICovXG5leHBvcnQgY2xhc3MgQm91bmRFbGVtZW50UHJvcGVydHlBc3QgaW1wbGVtZW50cyBUZW1wbGF0ZUFzdCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyB0eXBlOiBQcm9wZXJ0eUJpbmRpbmdUeXBlLCBwdWJsaWMgdmFsdWU6IEFTVCxcbiAgICAgICAgICAgICAgcHVibGljIHVuaXQ6IHN0cmluZywgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge31cbiAgdmlzaXQodmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RWxlbWVudFByb3BlcnR5KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbi8qKlxuICogQSBiaW5kaW5nIGZvciBhbiBlbGVtZW50IGV2ZW50IChlLmcuIGAoZXZlbnQpPVwiaGFuZGxlcigpXCJgKS5cbiAqL1xuZXhwb3J0IGNsYXNzIEJvdW5kRXZlbnRBc3QgaW1wbGVtZW50cyBUZW1wbGF0ZUFzdCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyB0YXJnZXQ6IHN0cmluZywgcHVibGljIGhhbmRsZXI6IEFTVCxcbiAgICAgICAgICAgICAgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge31cbiAgdmlzaXQodmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RXZlbnQodGhpcywgY29udGV4dCk7XG4gIH1cbiAgZ2V0IGZ1bGxOYW1lKCkge1xuICAgIGlmIChpc1ByZXNlbnQodGhpcy50YXJnZXQpKSB7XG4gICAgICByZXR1cm4gYCR7dGhpcy50YXJnZXR9OiR7dGhpcy5uYW1lfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm5hbWU7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQSB2YXJpYWJsZSBkZWNsYXJhdGlvbiBvbiBhbiBlbGVtZW50IChlLmcuIGAjdmFyPVwiZXhwcmVzc2lvblwiYCkuXG4gKi9cbmV4cG9ydCBjbGFzcyBWYXJpYWJsZUFzdCBpbXBsZW1lbnRzIFRlbXBsYXRlQXN0IHtcbiAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIHZhbHVlOiBzdHJpbmcsIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4pIHt9XG4gIHZpc2l0KHZpc2l0b3I6IFRlbXBsYXRlQXN0VmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdFZhcmlhYmxlKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbi8qKlxuICogQW4gZWxlbWVudCBkZWNsYXJhdGlvbiBpbiBhIHRlbXBsYXRlLlxuICovXG5leHBvcnQgY2xhc3MgRWxlbWVudEFzdCBpbXBsZW1lbnRzIFRlbXBsYXRlQXN0IHtcbiAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGF0dHJzOiBBdHRyQXN0W10sXG4gICAgICAgICAgICAgIHB1YmxpYyBpbnB1dHM6IEJvdW5kRWxlbWVudFByb3BlcnR5QXN0W10sIHB1YmxpYyBvdXRwdXRzOiBCb3VuZEV2ZW50QXN0W10sXG4gICAgICAgICAgICAgIHB1YmxpYyBleHBvcnRBc1ZhcnM6IFZhcmlhYmxlQXN0W10sIHB1YmxpYyBkaXJlY3RpdmVzOiBEaXJlY3RpdmVBc3RbXSxcbiAgICAgICAgICAgICAgcHVibGljIHByb3ZpZGVyczogUHJvdmlkZXJBc3RbXSwgcHVibGljIGhhc1ZpZXdDb250YWluZXI6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHB1YmxpYyBjaGlsZHJlbjogVGVtcGxhdGVBc3RbXSwgcHVibGljIG5nQ29udGVudEluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4pIHt9XG5cbiAgdmlzaXQodmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RWxlbWVudCh0aGlzLCBjb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBlbGVtZW50IGhhcyBhbnkgYWN0aXZlIGJpbmRpbmdzIChpbnB1dHMsIG91dHB1dHMsIHZhcnMsIG9yIGRpcmVjdGl2ZXMpLlxuICAgKi9cbiAgaXNCb3VuZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMuaW5wdXRzLmxlbmd0aCA+IDAgfHwgdGhpcy5vdXRwdXRzLmxlbmd0aCA+IDAgfHwgdGhpcy5leHBvcnRBc1ZhcnMubGVuZ3RoID4gMCB8fFxuICAgICAgICAgICAgdGhpcy5kaXJlY3RpdmVzLmxlbmd0aCA+IDApO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY29tcG9uZW50IGFzc29jaWF0ZWQgd2l0aCB0aGlzIGVsZW1lbnQsIGlmIGFueS5cbiAgICovXG4gIGdldENvbXBvbmVudCgpOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kaXJlY3RpdmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGlyQXN0ID0gdGhpcy5kaXJlY3RpdmVzW2ldO1xuICAgICAgaWYgKGRpckFzdC5kaXJlY3RpdmUuaXNDb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuIGRpckFzdC5kaXJlY3RpdmU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogQSBgPHRlbXBsYXRlPmAgZWxlbWVudCBpbmNsdWRlZCBpbiBhbiBBbmd1bGFyIHRlbXBsYXRlLlxuICovXG5leHBvcnQgY2xhc3MgRW1iZWRkZWRUZW1wbGF0ZUFzdCBpbXBsZW1lbnRzIFRlbXBsYXRlQXN0IHtcbiAgY29uc3RydWN0b3IocHVibGljIGF0dHJzOiBBdHRyQXN0W10sIHB1YmxpYyBvdXRwdXRzOiBCb3VuZEV2ZW50QXN0W10sIHB1YmxpYyB2YXJzOiBWYXJpYWJsZUFzdFtdLFxuICAgICAgICAgICAgICBwdWJsaWMgZGlyZWN0aXZlczogRGlyZWN0aXZlQXN0W10sIHB1YmxpYyBwcm92aWRlcnM6IFByb3ZpZGVyQXN0W10sXG4gICAgICAgICAgICAgIHB1YmxpYyBoYXNWaWV3Q29udGFpbmVyOiBib29sZWFuLCBwdWJsaWMgY2hpbGRyZW46IFRlbXBsYXRlQXN0W10sXG4gICAgICAgICAgICAgIHB1YmxpYyBuZ0NvbnRlbnRJbmRleDogbnVtYmVyLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuXG4gIHZpc2l0KHZpc2l0b3I6IFRlbXBsYXRlQXN0VmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEVtYmVkZGVkVGVtcGxhdGUodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSBwcm9wZXJ0eSB3aXRoIGEgYm91bmQgdmFsdWUgKGUuZy4gYCpuZ0lmPVwiY29uZGl0aW9uXCIpLlxuICovXG5leHBvcnQgY2xhc3MgQm91bmREaXJlY3RpdmVQcm9wZXJ0eUFzdCBpbXBsZW1lbnRzIFRlbXBsYXRlQXN0IHtcbiAgY29uc3RydWN0b3IocHVibGljIGRpcmVjdGl2ZU5hbWU6IHN0cmluZywgcHVibGljIHRlbXBsYXRlTmFtZTogc3RyaW5nLCBwdWJsaWMgdmFsdWU6IEFTVCxcbiAgICAgICAgICAgICAgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge31cbiAgdmlzaXQodmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RGlyZWN0aXZlUHJvcGVydHkodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSBkZWNsYXJlZCBvbiBhbiBlbGVtZW50LlxuICovXG5leHBvcnQgY2xhc3MgRGlyZWN0aXZlQXN0IGltcGxlbWVudHMgVGVtcGxhdGVBc3Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGlyZWN0aXZlOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsXG4gICAgICAgICAgICAgIHB1YmxpYyBpbnB1dHM6IEJvdW5kRGlyZWN0aXZlUHJvcGVydHlBc3RbXSxcbiAgICAgICAgICAgICAgcHVibGljIGhvc3RQcm9wZXJ0aWVzOiBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdFtdLCBwdWJsaWMgaG9zdEV2ZW50czogQm91bmRFdmVudEFzdFtdLFxuICAgICAgICAgICAgICBwdWJsaWMgZXhwb3J0QXNWYXJzOiBWYXJpYWJsZUFzdFtdLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuICB2aXNpdCh2aXNpdG9yOiBUZW1wbGF0ZUFzdFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXREaXJlY3RpdmUodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHByb3ZpZGVyIGRlY2xhcmVkIG9uIGFuIGVsZW1lbnRcbiAqL1xuZXhwb3J0IGNsYXNzIFByb3ZpZGVyQXN0IGltcGxlbWVudHMgVGVtcGxhdGVBc3Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdG9rZW46IENvbXBpbGVUb2tlbk1ldGFkYXRhLCBwdWJsaWMgbXVsdGlQcm92aWRlcjogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHVibGljIGVhZ2VyOiBib29sZWFuLCBwdWJsaWMgcHJvdmlkZXJzOiBDb21waWxlUHJvdmlkZXJNZXRhZGF0YVtdLFxuICAgICAgICAgICAgICBwdWJsaWMgcHJvdmlkZXJUeXBlOiBQcm92aWRlckFzdFR5cGUsIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4pIHt9XG5cbiAgdmlzaXQodmlzaXRvcjogVGVtcGxhdGVBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIC8vIE5vIHZpc2l0IG1ldGhvZCBpbiB0aGUgdmlzaXRvciBmb3Igbm93Li4uXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGVudW0gUHJvdmlkZXJBc3RUeXBlIHtcbiAgUHVibGljU2VydmljZSxcbiAgUHJpdmF0ZVNlcnZpY2UsXG4gIENvbXBvbmVudCxcbiAgRGlyZWN0aXZlLFxuICBCdWlsdGluXG59XG5cbi8qKlxuICogUG9zaXRpb24gd2hlcmUgY29udGVudCBpcyB0byBiZSBwcm9qZWN0ZWQgKGluc3RhbmNlIG9mIGA8bmctY29udGVudD5gIGluIGEgdGVtcGxhdGUpLlxuICovXG5leHBvcnQgY2xhc3MgTmdDb250ZW50QXN0IGltcGxlbWVudHMgVGVtcGxhdGVBc3Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgaW5kZXg6IG51bWJlciwgcHVibGljIG5nQ29udGVudEluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4pIHt9XG4gIHZpc2l0KHZpc2l0b3I6IFRlbXBsYXRlQXN0VmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdE5nQ29udGVudCh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG4vKipcbiAqIEVudW1lcmF0aW9uIG9mIHR5cGVzIG9mIHByb3BlcnR5IGJpbmRpbmdzLlxuICovXG5leHBvcnQgZW51bSBQcm9wZXJ0eUJpbmRpbmdUeXBlIHtcblxuICAvKipcbiAgICogQSBub3JtYWwgYmluZGluZyB0byBhIHByb3BlcnR5IChlLmcuIGBbcHJvcGVydHldPVwiZXhwcmVzc2lvblwiYCkuXG4gICAqL1xuICBQcm9wZXJ0eSxcblxuICAvKipcbiAgICogQSBiaW5kaW5nIHRvIGFuIGVsZW1lbnQgYXR0cmlidXRlIChlLmcuIGBbYXR0ci5uYW1lXT1cImV4cHJlc3Npb25cImApLlxuICAgKi9cbiAgQXR0cmlidXRlLFxuXG4gIC8qKlxuICAgKiBBIGJpbmRpbmcgdG8gYSBDU1MgY2xhc3MgKGUuZy4gYFtjbGFzcy5uYW1lXT1cImNvbmRpdGlvblwiYCkuXG4gICAqL1xuICBDbGFzcyxcblxuICAvKipcbiAgICogQSBiaW5kaW5nIHRvIGEgc3R5bGUgcnVsZSAoZS5nLiBgW3N0eWxlLnJ1bGVdPVwiZXhwcmVzc2lvblwiYCkuXG4gICAqL1xuICBTdHlsZVxufVxuXG4vKipcbiAqIEEgdmlzaXRvciBmb3Ige0BsaW5rIFRlbXBsYXRlQXN0fSB0cmVlcyB0aGF0IHdpbGwgcHJvY2VzcyBlYWNoIG5vZGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGVtcGxhdGVBc3RWaXNpdG9yIHtcbiAgdmlzaXROZ0NvbnRlbnQoYXN0OiBOZ0NvbnRlbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRFbWJlZGRlZFRlbXBsYXRlKGFzdDogRW1iZWRkZWRUZW1wbGF0ZUFzdCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEVsZW1lbnQoYXN0OiBFbGVtZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0VmFyaWFibGUoYXN0OiBWYXJpYWJsZUFzdCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEV2ZW50KGFzdDogQm91bmRFdmVudEFzdCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEVsZW1lbnRQcm9wZXJ0eShhc3Q6IEJvdW5kRWxlbWVudFByb3BlcnR5QXN0LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0QXR0cihhc3Q6IEF0dHJBc3QsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRCb3VuZFRleHQoYXN0OiBCb3VuZFRleHRBc3QsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRUZXh0KGFzdDogVGV4dEFzdCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdERpcmVjdGl2ZShhc3Q6IERpcmVjdGl2ZUFzdCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdERpcmVjdGl2ZVByb3BlcnR5KGFzdDogQm91bmREaXJlY3RpdmVQcm9wZXJ0eUFzdCwgY29udGV4dDogYW55KTogYW55O1xufVxuXG4vKipcbiAqIFZpc2l0IGV2ZXJ5IG5vZGUgaW4gYSBsaXN0IG9mIHtAbGluayBUZW1wbGF0ZUFzdH1zIHdpdGggdGhlIGdpdmVuIHtAbGluayBUZW1wbGF0ZUFzdFZpc2l0b3J9LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdGVtcGxhdGVWaXNpdEFsbCh2aXNpdG9yOiBUZW1wbGF0ZUFzdFZpc2l0b3IsIGFzdHM6IFRlbXBsYXRlQXN0W10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBhbnkgPSBudWxsKTogYW55W10ge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGFzdHMuZm9yRWFjaChhc3QgPT4ge1xuICAgIHZhciBhc3RSZXN1bHQgPSBhc3QudmlzaXQodmlzaXRvciwgY29udGV4dCk7XG4gICAgaWYgKGlzUHJlc2VudChhc3RSZXN1bHQpKSB7XG4gICAgICByZXN1bHQucHVzaChhc3RSZXN1bHQpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG4iXX0=