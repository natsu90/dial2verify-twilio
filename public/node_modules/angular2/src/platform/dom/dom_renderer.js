'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var di_1 = require('angular2/src/core/di');
var animation_builder_1 = require('angular2/src/animate/animation_builder');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var shared_styles_host_1 = require('./shared_styles_host');
var event_manager_1 = require('./events/event_manager');
var dom_tokens_1 = require('./dom_tokens');
var metadata_1 = require('angular2/src/core/metadata');
var dom_adapter_1 = require('angular2/src/platform/dom/dom_adapter');
var util_1 = require('./util');
var NAMESPACE_URIS = lang_1.CONST_EXPR({ 'xlink': 'http://www.w3.org/1999/xlink', 'svg': 'http://www.w3.org/2000/svg' });
var TEMPLATE_COMMENT_TEXT = 'template bindings={}';
var TEMPLATE_BINDINGS_EXP = /^template bindings=(.*)$/g;
var DomRootRenderer = (function () {
    function DomRootRenderer(document, eventManager, sharedStylesHost, animate) {
        this.document = document;
        this.eventManager = eventManager;
        this.sharedStylesHost = sharedStylesHost;
        this.animate = animate;
        this._registeredComponents = new Map();
    }
    DomRootRenderer.prototype.renderComponent = function (componentProto) {
        var renderer = this._registeredComponents.get(componentProto.id);
        if (lang_1.isBlank(renderer)) {
            renderer = new DomRenderer(this, componentProto);
            this._registeredComponents.set(componentProto.id, renderer);
        }
        return renderer;
    };
    return DomRootRenderer;
}());
exports.DomRootRenderer = DomRootRenderer;
var DomRootRenderer_ = (function (_super) {
    __extends(DomRootRenderer_, _super);
    function DomRootRenderer_(_document, _eventManager, sharedStylesHost, animate) {
        _super.call(this, _document, _eventManager, sharedStylesHost, animate);
    }
    DomRootRenderer_ = __decorate([
        di_1.Injectable(),
        __param(0, di_1.Inject(dom_tokens_1.DOCUMENT)), 
        __metadata('design:paramtypes', [Object, event_manager_1.EventManager, shared_styles_host_1.DomSharedStylesHost, animation_builder_1.AnimationBuilder])
    ], DomRootRenderer_);
    return DomRootRenderer_;
}(DomRootRenderer));
exports.DomRootRenderer_ = DomRootRenderer_;
var DomRenderer = (function () {
    function DomRenderer(_rootRenderer, componentProto) {
        this._rootRenderer = _rootRenderer;
        this.componentProto = componentProto;
        this._styles = _flattenStyles(componentProto.id, componentProto.styles, []);
        if (componentProto.encapsulation !== metadata_1.ViewEncapsulation.Native) {
            this._rootRenderer.sharedStylesHost.addStyles(this._styles);
        }
        if (this.componentProto.encapsulation === metadata_1.ViewEncapsulation.Emulated) {
            this._contentAttr = _shimContentAttribute(componentProto.id);
            this._hostAttr = _shimHostAttribute(componentProto.id);
        }
        else {
            this._contentAttr = null;
            this._hostAttr = null;
        }
    }
    DomRenderer.prototype.selectRootElement = function (selectorOrNode, debugInfo) {
        var el;
        if (lang_1.isString(selectorOrNode)) {
            el = dom_adapter_1.DOM.querySelector(this._rootRenderer.document, selectorOrNode);
            if (lang_1.isBlank(el)) {
                throw new exceptions_1.BaseException("The selector \"" + selectorOrNode + "\" did not match any elements");
            }
        }
        else {
            el = selectorOrNode;
        }
        dom_adapter_1.DOM.clearNodes(el);
        return el;
    };
    DomRenderer.prototype.createElement = function (parent, name, debugInfo) {
        var nsAndName = splitNamespace(name);
        var el = lang_1.isPresent(nsAndName[0]) ?
            dom_adapter_1.DOM.createElementNS(NAMESPACE_URIS[nsAndName[0]], nsAndName[1]) :
            dom_adapter_1.DOM.createElement(nsAndName[1]);
        if (lang_1.isPresent(this._contentAttr)) {
            dom_adapter_1.DOM.setAttribute(el, this._contentAttr, '');
        }
        if (lang_1.isPresent(parent)) {
            dom_adapter_1.DOM.appendChild(parent, el);
        }
        return el;
    };
    DomRenderer.prototype.createViewRoot = function (hostElement) {
        var nodesParent;
        if (this.componentProto.encapsulation === metadata_1.ViewEncapsulation.Native) {
            nodesParent = dom_adapter_1.DOM.createShadowRoot(hostElement);
            this._rootRenderer.sharedStylesHost.addHost(nodesParent);
            for (var i = 0; i < this._styles.length; i++) {
                dom_adapter_1.DOM.appendChild(nodesParent, dom_adapter_1.DOM.createStyleElement(this._styles[i]));
            }
        }
        else {
            if (lang_1.isPresent(this._hostAttr)) {
                dom_adapter_1.DOM.setAttribute(hostElement, this._hostAttr, '');
            }
            nodesParent = hostElement;
        }
        return nodesParent;
    };
    DomRenderer.prototype.createTemplateAnchor = function (parentElement, debugInfo) {
        var comment = dom_adapter_1.DOM.createComment(TEMPLATE_COMMENT_TEXT);
        if (lang_1.isPresent(parentElement)) {
            dom_adapter_1.DOM.appendChild(parentElement, comment);
        }
        return comment;
    };
    DomRenderer.prototype.createText = function (parentElement, value, debugInfo) {
        var node = dom_adapter_1.DOM.createTextNode(value);
        if (lang_1.isPresent(parentElement)) {
            dom_adapter_1.DOM.appendChild(parentElement, node);
        }
        return node;
    };
    DomRenderer.prototype.projectNodes = function (parentElement, nodes) {
        if (lang_1.isBlank(parentElement))
            return;
        appendNodes(parentElement, nodes);
    };
    DomRenderer.prototype.attachViewAfter = function (node, viewRootNodes) {
        moveNodesAfterSibling(node, viewRootNodes);
        for (var i = 0; i < viewRootNodes.length; i++)
            this.animateNodeEnter(viewRootNodes[i]);
    };
    DomRenderer.prototype.detachView = function (viewRootNodes) {
        for (var i = 0; i < viewRootNodes.length; i++) {
            var node = viewRootNodes[i];
            dom_adapter_1.DOM.remove(node);
            this.animateNodeLeave(node);
        }
    };
    DomRenderer.prototype.destroyView = function (hostElement, viewAllNodes) {
        if (this.componentProto.encapsulation === metadata_1.ViewEncapsulation.Native && lang_1.isPresent(hostElement)) {
            this._rootRenderer.sharedStylesHost.removeHost(dom_adapter_1.DOM.getShadowRoot(hostElement));
        }
    };
    DomRenderer.prototype.listen = function (renderElement, name, callback) {
        return this._rootRenderer.eventManager.addEventListener(renderElement, name, decoratePreventDefault(callback));
    };
    DomRenderer.prototype.listenGlobal = function (target, name, callback) {
        return this._rootRenderer.eventManager.addGlobalEventListener(target, name, decoratePreventDefault(callback));
    };
    DomRenderer.prototype.setElementProperty = function (renderElement, propertyName, propertyValue) {
        dom_adapter_1.DOM.setProperty(renderElement, propertyName, propertyValue);
    };
    DomRenderer.prototype.setElementAttribute = function (renderElement, attributeName, attributeValue) {
        var attrNs;
        var nsAndName = splitNamespace(attributeName);
        if (lang_1.isPresent(nsAndName[0])) {
            attributeName = nsAndName[0] + ':' + nsAndName[1];
            attrNs = NAMESPACE_URIS[nsAndName[0]];
        }
        if (lang_1.isPresent(attributeValue)) {
            if (lang_1.isPresent(attrNs)) {
                dom_adapter_1.DOM.setAttributeNS(renderElement, attrNs, attributeName, attributeValue);
            }
            else {
                dom_adapter_1.DOM.setAttribute(renderElement, attributeName, attributeValue);
            }
        }
        else {
            if (lang_1.isPresent(attrNs)) {
                dom_adapter_1.DOM.removeAttributeNS(renderElement, attrNs, nsAndName[1]);
            }
            else {
                dom_adapter_1.DOM.removeAttribute(renderElement, attributeName);
            }
        }
    };
    DomRenderer.prototype.setBindingDebugInfo = function (renderElement, propertyName, propertyValue) {
        var dashCasedPropertyName = util_1.camelCaseToDashCase(propertyName);
        if (dom_adapter_1.DOM.isCommentNode(renderElement)) {
            var existingBindings = lang_1.RegExpWrapper.firstMatch(TEMPLATE_BINDINGS_EXP, lang_1.StringWrapper.replaceAll(dom_adapter_1.DOM.getText(renderElement), /\n/g, ''));
            var parsedBindings = lang_1.Json.parse(existingBindings[1]);
            parsedBindings[dashCasedPropertyName] = propertyValue;
            dom_adapter_1.DOM.setText(renderElement, lang_1.StringWrapper.replace(TEMPLATE_COMMENT_TEXT, '{}', lang_1.Json.stringify(parsedBindings)));
        }
        else {
            this.setElementAttribute(renderElement, propertyName, propertyValue);
        }
    };
    DomRenderer.prototype.setElementClass = function (renderElement, className, isAdd) {
        if (isAdd) {
            dom_adapter_1.DOM.addClass(renderElement, className);
        }
        else {
            dom_adapter_1.DOM.removeClass(renderElement, className);
        }
    };
    DomRenderer.prototype.setElementStyle = function (renderElement, styleName, styleValue) {
        if (lang_1.isPresent(styleValue)) {
            dom_adapter_1.DOM.setStyle(renderElement, styleName, lang_1.stringify(styleValue));
        }
        else {
            dom_adapter_1.DOM.removeStyle(renderElement, styleName);
        }
    };
    DomRenderer.prototype.invokeElementMethod = function (renderElement, methodName, args) {
        dom_adapter_1.DOM.invoke(renderElement, methodName, args);
    };
    DomRenderer.prototype.setText = function (renderNode, text) { dom_adapter_1.DOM.setText(renderNode, text); };
    /**
     * Performs animations if necessary
     * @param node
     */
    DomRenderer.prototype.animateNodeEnter = function (node) {
        if (dom_adapter_1.DOM.isElementNode(node) && dom_adapter_1.DOM.hasClass(node, 'ng-animate')) {
            dom_adapter_1.DOM.addClass(node, 'ng-enter');
            this._rootRenderer.animate.css()
                .addAnimationClass('ng-enter-active')
                .start(node)
                .onComplete(function () { dom_adapter_1.DOM.removeClass(node, 'ng-enter'); });
        }
    };
    /**
     * If animations are necessary, performs animations then removes the element; otherwise, it just
     * removes the element.
     * @param node
     */
    DomRenderer.prototype.animateNodeLeave = function (node) {
        if (dom_adapter_1.DOM.isElementNode(node) && dom_adapter_1.DOM.hasClass(node, 'ng-animate')) {
            dom_adapter_1.DOM.addClass(node, 'ng-leave');
            this._rootRenderer.animate.css()
                .addAnimationClass('ng-leave-active')
                .start(node)
                .onComplete(function () {
                dom_adapter_1.DOM.removeClass(node, 'ng-leave');
                dom_adapter_1.DOM.remove(node);
            });
        }
        else {
            dom_adapter_1.DOM.remove(node);
        }
    };
    return DomRenderer;
}());
exports.DomRenderer = DomRenderer;
function moveNodesAfterSibling(sibling, nodes) {
    var parent = dom_adapter_1.DOM.parentElement(sibling);
    if (nodes.length > 0 && lang_1.isPresent(parent)) {
        var nextSibling = dom_adapter_1.DOM.nextSibling(sibling);
        if (lang_1.isPresent(nextSibling)) {
            for (var i = 0; i < nodes.length; i++) {
                dom_adapter_1.DOM.insertBefore(nextSibling, nodes[i]);
            }
        }
        else {
            for (var i = 0; i < nodes.length; i++) {
                dom_adapter_1.DOM.appendChild(parent, nodes[i]);
            }
        }
    }
}
function appendNodes(parent, nodes) {
    for (var i = 0; i < nodes.length; i++) {
        dom_adapter_1.DOM.appendChild(parent, nodes[i]);
    }
}
function decoratePreventDefault(eventHandler) {
    return function (event) {
        var allowDefaultBehavior = eventHandler(event);
        if (allowDefaultBehavior === false) {
            // TODO(tbosch): move preventDefault into event plugins...
            dom_adapter_1.DOM.preventDefault(event);
        }
    };
}
var COMPONENT_REGEX = /%COMP%/g;
exports.COMPONENT_VARIABLE = '%COMP%';
exports.HOST_ATTR = "_nghost-" + exports.COMPONENT_VARIABLE;
exports.CONTENT_ATTR = "_ngcontent-" + exports.COMPONENT_VARIABLE;
function _shimContentAttribute(componentShortId) {
    return lang_1.StringWrapper.replaceAll(exports.CONTENT_ATTR, COMPONENT_REGEX, componentShortId);
}
function _shimHostAttribute(componentShortId) {
    return lang_1.StringWrapper.replaceAll(exports.HOST_ATTR, COMPONENT_REGEX, componentShortId);
}
function _flattenStyles(compId, styles, target) {
    for (var i = 0; i < styles.length; i++) {
        var style = styles[i];
        if (lang_1.isArray(style)) {
            _flattenStyles(compId, style, target);
        }
        else {
            style = lang_1.StringWrapper.replaceAll(style, COMPONENT_REGEX, compId);
            target.push(style);
        }
    }
    return target;
}
var NS_PREFIX_RE = /^@([^:]+):(.+)/g;
function splitNamespace(name) {
    if (name[0] != '@') {
        return [null, name];
    }
    var match = lang_1.RegExpWrapper.firstMatch(NS_PREFIX_RE, name);
    return [match[1], match[2]];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX3JlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC00bm8zWlF2Ty50bXAvYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kb21fcmVuZGVyZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUJBQThDLHNCQUFzQixDQUFDLENBQUE7QUFDckUsa0NBQStCLHdDQUF3QyxDQUFDLENBQUE7QUFDeEUscUJBVU8sMEJBQTBCLENBQUMsQ0FBQTtBQUVsQywyQkFBOEMsZ0NBQWdDLENBQUMsQ0FBQTtBQUMvRSxtQ0FBa0Msc0JBQXNCLENBQUMsQ0FBQTtBQVN6RCw4QkFBMkIsd0JBQXdCLENBQUMsQ0FBQTtBQUVwRCwyQkFBdUIsY0FBYyxDQUFDLENBQUE7QUFDdEMseUJBQWdDLDRCQUE0QixDQUFDLENBQUE7QUFDN0QsNEJBQWtCLHVDQUF1QyxDQUFDLENBQUE7QUFDMUQscUJBQWtDLFFBQVEsQ0FBQyxDQUFBO0FBRTNDLElBQU0sY0FBYyxHQUNoQixpQkFBVSxDQUFDLEVBQUMsT0FBTyxFQUFFLDhCQUE4QixFQUFFLEtBQUssRUFBRSw0QkFBNEIsRUFBQyxDQUFDLENBQUM7QUFDL0YsSUFBTSxxQkFBcUIsR0FBRyxzQkFBc0IsQ0FBQztBQUNyRCxJQUFJLHFCQUFxQixHQUFHLDJCQUEyQixDQUFDO0FBRXhEO0lBR0UseUJBQW1CLFFBQWEsRUFBUyxZQUEwQixFQUNoRCxnQkFBcUMsRUFBUyxPQUF5QjtRQUR2RSxhQUFRLEdBQVIsUUFBUSxDQUFLO1FBQVMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDaEQscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFxQjtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBSGxGLDBCQUFxQixHQUE2QixJQUFJLEdBQUcsRUFBdUIsQ0FBQztJQUdJLENBQUM7SUFFOUYseUNBQWUsR0FBZixVQUFnQixjQUFt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LENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDdkMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsY0FBYyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sS0FBSyxHQUFHLG9CQUFhLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDakUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQixDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELElBQUksWUFBWSxHQUFHLGlCQUFpQixDQUFDO0FBRXJDLHdCQUF3QixJQUFZO0lBQ2xDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBQ0QsSUFBSSxLQUFLLEdBQUcsb0JBQWEsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pELE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGUsIE9wYXF1ZVRva2VufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge0FuaW1hdGlvbkJ1aWxkZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9hbmltYXRlL2FuaW1hdGlvbl9idWlsZGVyJztcbmltcG9ydCB7XG4gIGlzUHJlc2VudCxcbiAgaXNCbGFuayxcbiAgSnNvbixcbiAgUmVnRXhwV3JhcHBlcixcbiAgQ09OU1RfRVhQUixcbiAgc3RyaW5naWZ5LFxuICBTdHJpbmdXcmFwcGVyLFxuICBpc0FycmF5LFxuICBpc1N0cmluZ1xufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG5pbXBvcnQge0Jhc2VFeGNlcHRpb24sIFdyYXBwZWRFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge0RvbVNoYXJlZFN0eWxlc0hvc3R9IGZyb20gJy4vc2hhcmVkX3N0eWxlc19ob3N0JztcblxuaW1wb3J0IHtcbiAgUmVuZGVyZXIsXG4gIFJvb3RSZW5kZXJlcixcbiAgUmVuZGVyQ29tcG9uZW50VHlwZSxcbiAgUmVuZGVyRGVidWdJbmZvXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlbmRlci9hcGknO1xuXG5pbXBvcnQge0V2ZW50TWFuYWdlcn0gZnJvbSAnLi9ldmVudHMvZXZlbnRfbWFuYWdlcic7XG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJy4vZG9tX3Rva2Vucyc7XG5pbXBvcnQge1ZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9tZXRhZGF0YSc7XG5pbXBvcnQge0RPTX0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kb21fYWRhcHRlcic7XG5pbXBvcnQge2NhbWVsQ2FzZVRvRGFzaENhc2V9IGZyb20gJy4vdXRpbCc7XG5cbmNvbnN0IE5BTUVTUEFDRV9VUklTID1cbiAgICBDT05TVF9FWFBSKHsneGxpbmsnOiAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsICdzdmcnOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnfSk7XG5jb25zdCBURU1QTEFURV9DT01NRU5UX1RFWFQgPSAndGVtcGxhdGUgYmluZGluZ3M9e30nO1xudmFyIFRFTVBMQVRFX0JJTkRJTkdTX0VYUCA9IC9edGVtcGxhdGUgYmluZGluZ3M9KC4qKSQvZztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIERvbVJvb3RSZW5kZXJlciBpbXBsZW1lbnRzIFJvb3RSZW5kZXJlciB7XG4gIHByaXZhdGUgX3JlZ2lzdGVyZWRDb21wb25lbnRzOiBNYXA8c3RyaW5nLCBEb21SZW5kZXJlcj4gPSBuZXcgTWFwPHN0cmluZywgRG9tUmVuZGVyZXI+KCk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGRvY3VtZW50OiBhbnksIHB1YmxpYyBldmVudE1hbmFnZXI6IEV2ZW50TWFuYWdlcixcbiAgICAgICAgICAgICAgcHVibGljIHNoYXJlZFN0eWxlc0hvc3Q6IERvbVNoYXJlZFN0eWxlc0hvc3QsIHB1YmxpYyBhbmltYXRlOiBBbmltYXRpb25CdWlsZGVyKSB7fVxuXG4gIHJlbmRlckNvbXBvbmVudChjb21wb25lbnRQcm90bzogUmVuZGVyQ29tcG9uZW50VHlwZSk6IFJlbmRlcmVyIHtcbiAgICB2YXIgcmVuZGVyZXIgPSB0aGlzLl9yZWdpc3RlcmVkQ29tcG9uZW50cy5nZXQoY29tcG9uZW50UHJvdG8uaWQpO1xuICAgIGlmIChpc0JsYW5rKHJlbmRlcmVyKSkge1xuICAgICAgcmVuZGVyZXIgPSBuZXcgRG9tUmVuZGVyZXIodGhpcywgY29tcG9uZW50UHJvdG8pO1xuICAgICAgdGhpcy5fcmVnaXN0ZXJlZENvbXBvbmVudHMuc2V0KGNvbXBvbmVudFByb3RvLmlkLCByZW5kZXJlcik7XG4gICAgfVxuICAgIHJldHVybiByZW5kZXJlcjtcbiAgfVxufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRG9tUm9vdFJlbmRlcmVyXyBleHRlbmRzIERvbVJvb3RSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudDogYW55LCBfZXZlbnRNYW5hZ2VyOiBFdmVudE1hbmFnZXIsXG4gICAgICAgICAgICAgIHNoYXJlZFN0eWxlc0hvc3Q6IERvbVNoYXJlZFN0eWxlc0hvc3QsIGFuaW1hdGU6IEFuaW1hdGlvbkJ1aWxkZXIpIHtcbiAgICBzdXBlcihfZG9jdW1lbnQsIF9ldmVudE1hbmFnZXIsIHNoYXJlZFN0eWxlc0hvc3QsIGFuaW1hdGUpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEb21SZW5kZXJlciBpbXBsZW1lbnRzIFJlbmRlcmVyIHtcbiAgcHJpdmF0ZSBfY29udGVudEF0dHI6IHN0cmluZztcbiAgcHJpdmF0ZSBfaG9zdEF0dHI6IHN0cmluZztcbiAgcHJpdmF0ZSBfc3R5bGVzOiBzdHJpbmdbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb290UmVuZGVyZXI6IERvbVJvb3RSZW5kZXJlciwgcHJpdmF0ZSBjb21wb25lbnRQcm90bzogUmVuZGVyQ29tcG9uZW50VHlwZSkge1xuICAgIHRoaXMuX3N0eWxlcyA9IF9mbGF0dGVuU3R5bGVzKGNvbXBvbmVudFByb3RvLmlkLCBjb21wb25lbnRQcm90by5zdHlsZXMsIFtdKTtcbiAgICBpZiAoY29tcG9uZW50UHJvdG8uZW5jYXBzdWxhdGlvbiAhPT0gVmlld0VuY2Fwc3VsYXRpb24uTmF0aXZlKSB7XG4gICAgICB0aGlzLl9yb290UmVuZGVyZXIuc2hhcmVkU3R5bGVzSG9zdC5hZGRTdHlsZXModGhpcy5fc3R5bGVzKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29tcG9uZW50UHJvdG8uZW5jYXBzdWxhdGlvbiA9PT0gVmlld0VuY2Fwc3VsYXRpb24uRW11bGF0ZWQpIHtcbiAgICAgIHRoaXMuX2NvbnRlbnRBdHRyID0gX3NoaW1Db250ZW50QXR0cmlidXRlKGNvbXBvbmVudFByb3RvLmlkKTtcbiAgICAgIHRoaXMuX2hvc3RBdHRyID0gX3NoaW1Ib3N0QXR0cmlidXRlKGNvbXBvbmVudFByb3RvLmlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY29udGVudEF0dHIgPSBudWxsO1xuICAgICAgdGhpcy5faG9zdEF0dHIgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHNlbGVjdFJvb3RFbGVtZW50KHNlbGVjdG9yT3JOb2RlOiBzdHJpbmcgfCBhbnksIGRlYnVnSW5mbzogUmVuZGVyRGVidWdJbmZvKTogRWxlbWVudCB7XG4gICAgdmFyIGVsO1xuICAgIGlmIChpc1N0cmluZyhzZWxlY3Rvck9yTm9kZSkpIHtcbiAgICAgIGVsID0gRE9NLnF1ZXJ5U2VsZWN0b3IodGhpcy5fcm9vdFJlbmRlcmVyLmRvY3VtZW50LCBzZWxlY3Rvck9yTm9kZSk7XG4gICAgICBpZiAoaXNCbGFuayhlbCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYFRoZSBzZWxlY3RvciBcIiR7c2VsZWN0b3JPck5vZGV9XCIgZGlkIG5vdCBtYXRjaCBhbnkgZWxlbWVudHNgKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWwgPSBzZWxlY3Rvck9yTm9kZTtcbiAgICB9XG4gICAgRE9NLmNsZWFyTm9kZXMoZWwpO1xuICAgIHJldHVybiBlbDtcbiAgfVxuXG4gIGNyZWF0ZUVsZW1lbnQocGFyZW50OiBFbGVtZW50LCBuYW1lOiBzdHJpbmcsIGRlYnVnSW5mbzogUmVuZGVyRGVidWdJbmZvKTogTm9kZSB7XG4gICAgdmFyIG5zQW5kTmFtZSA9IHNwbGl0TmFtZXNwYWNlKG5hbWUpO1xuICAgIHZhciBlbCA9IGlzUHJlc2VudChuc0FuZE5hbWVbMF0pID9cbiAgICAgICAgICAgICAgICAgRE9NLmNyZWF0ZUVsZW1lbnROUyhOQU1FU1BBQ0VfVVJJU1tuc0FuZE5hbWVbMF1dLCBuc0FuZE5hbWVbMV0pIDpcbiAgICAgICAgICAgICAgICAgRE9NLmNyZWF0ZUVsZW1lbnQobnNBbmROYW1lWzFdKTtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMuX2NvbnRlbnRBdHRyKSkge1xuICAgICAgRE9NLnNldEF0dHJpYnV0ZShlbCwgdGhpcy5fY29udGVudEF0dHIsICcnKTtcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudChwYXJlbnQpKSB7XG4gICAgICBET00uYXBwZW5kQ2hpbGQocGFyZW50LCBlbCk7XG4gICAgfVxuICAgIHJldHVybiBlbDtcbiAgfVxuXG4gIGNyZWF0ZVZpZXdSb290KGhvc3RFbGVtZW50OiBhbnkpOiBhbnkge1xuICAgIHZhciBub2Rlc1BhcmVudDtcbiAgICBpZiAodGhpcy5jb21wb25lbnRQcm90by5lbmNhcHN1bGF0aW9uID09PSBWaWV3RW5jYXBzdWxhdGlvbi5OYXRpdmUpIHtcbiAgICAgIG5vZGVzUGFyZW50ID0gRE9NLmNyZWF0ZVNoYWRvd1Jvb3QoaG9zdEVsZW1lbnQpO1xuICAgICAgdGhpcy5fcm9vdFJlbmRlcmVyLnNoYXJlZFN0eWxlc0hvc3QuYWRkSG9zdChub2Rlc1BhcmVudCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3N0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBET00uYXBwZW5kQ2hpbGQobm9kZXNQYXJlbnQsIERPTS5jcmVhdGVTdHlsZUVsZW1lbnQodGhpcy5fc3R5bGVzW2ldKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1ByZXNlbnQodGhpcy5faG9zdEF0dHIpKSB7XG4gICAgICAgIERPTS5zZXRBdHRyaWJ1dGUoaG9zdEVsZW1lbnQsIHRoaXMuX2hvc3RBdHRyLCAnJyk7XG4gICAgICB9XG4gICAgICBub2Rlc1BhcmVudCA9IGhvc3RFbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gbm9kZXNQYXJlbnQ7XG4gIH1cblxuICBjcmVhdGVUZW1wbGF0ZUFuY2hvcihwYXJlbnRFbGVtZW50OiBhbnksIGRlYnVnSW5mbzogUmVuZGVyRGVidWdJbmZvKTogYW55IHtcbiAgICB2YXIgY29tbWVudCA9IERPTS5jcmVhdGVDb21tZW50KFRFTVBMQVRFX0NPTU1FTlRfVEVYVCk7XG4gICAgaWYgKGlzUHJlc2VudChwYXJlbnRFbGVtZW50KSkge1xuICAgICAgRE9NLmFwcGVuZENoaWxkKHBhcmVudEVsZW1lbnQsIGNvbW1lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gY29tbWVudDtcbiAgfVxuXG4gIGNyZWF0ZVRleHQocGFyZW50RWxlbWVudDogYW55LCB2YWx1ZTogc3RyaW5nLCBkZWJ1Z0luZm86IFJlbmRlckRlYnVnSW5mbyk6IGFueSB7XG4gICAgdmFyIG5vZGUgPSBET00uY3JlYXRlVGV4dE5vZGUodmFsdWUpO1xuICAgIGlmIChpc1ByZXNlbnQocGFyZW50RWxlbWVudCkpIHtcbiAgICAgIERPTS5hcHBlbmRDaGlsZChwYXJlbnRFbGVtZW50LCBub2RlKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBwcm9qZWN0Tm9kZXMocGFyZW50RWxlbWVudDogYW55LCBub2RlczogYW55W10pIHtcbiAgICBpZiAoaXNCbGFuayhwYXJlbnRFbGVtZW50KSkgcmV0dXJuO1xuICAgIGFwcGVuZE5vZGVzKHBhcmVudEVsZW1lbnQsIG5vZGVzKTtcbiAgfVxuXG4gIGF0dGFjaFZpZXdBZnRlcihub2RlOiBhbnksIHZpZXdSb290Tm9kZXM6IGFueVtdKSB7XG4gICAgbW92ZU5vZGVzQWZ0ZXJTaWJsaW5nKG5vZGUsIHZpZXdSb290Tm9kZXMpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlld1Jvb3ROb2Rlcy5sZW5ndGg7IGkrKykgdGhpcy5hbmltYXRlTm9kZUVudGVyKHZpZXdSb290Tm9kZXNbaV0pO1xuICB9XG5cbiAgZGV0YWNoVmlldyh2aWV3Um9vdE5vZGVzOiBhbnlbXSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlld1Jvb3ROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5vZGUgPSB2aWV3Um9vdE5vZGVzW2ldO1xuICAgICAgRE9NLnJlbW92ZShub2RlKTtcbiAgICAgIHRoaXMuYW5pbWF0ZU5vZGVMZWF2ZShub2RlKTtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95Vmlldyhob3N0RWxlbWVudDogYW55LCB2aWV3QWxsTm9kZXM6IGFueVtdKSB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50UHJvdG8uZW5jYXBzdWxhdGlvbiA9PT0gVmlld0VuY2Fwc3VsYXRpb24uTmF0aXZlICYmIGlzUHJlc2VudChob3N0RWxlbWVudCkpIHtcbiAgICAgIHRoaXMuX3Jvb3RSZW5kZXJlci5zaGFyZWRTdHlsZXNIb3N0LnJlbW92ZUhvc3QoRE9NLmdldFNoYWRvd1Jvb3QoaG9zdEVsZW1lbnQpKTtcbiAgICB9XG4gIH1cblxuICBsaXN0ZW4ocmVuZGVyRWxlbWVudDogYW55LCBuYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbik6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fcm9vdFJlbmRlcmVyLmV2ZW50TWFuYWdlci5hZGRFdmVudExpc3RlbmVyKHJlbmRlckVsZW1lbnQsIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWNvcmF0ZVByZXZlbnREZWZhdWx0KGNhbGxiYWNrKSk7XG4gIH1cblxuICBsaXN0ZW5HbG9iYWwodGFyZ2V0OiBzdHJpbmcsIG5hbWU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLl9yb290UmVuZGVyZXIuZXZlbnRNYW5hZ2VyLmFkZEdsb2JhbEV2ZW50TGlzdGVuZXIodGFyZ2V0LCBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjb3JhdGVQcmV2ZW50RGVmYXVsdChjYWxsYmFjaykpO1xuICB9XG5cbiAgc2V0RWxlbWVudFByb3BlcnR5KHJlbmRlckVsZW1lbnQ6IGFueSwgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHByb3BlcnR5VmFsdWU6IGFueSk6IHZvaWQge1xuICAgIERPTS5zZXRQcm9wZXJ0eShyZW5kZXJFbGVtZW50LCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWUpO1xuICB9XG5cbiAgc2V0RWxlbWVudEF0dHJpYnV0ZShyZW5kZXJFbGVtZW50OiBhbnksIGF0dHJpYnV0ZU5hbWU6IHN0cmluZywgYXR0cmlidXRlVmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHZhciBhdHRyTnM7XG4gICAgdmFyIG5zQW5kTmFtZSA9IHNwbGl0TmFtZXNwYWNlKGF0dHJpYnV0ZU5hbWUpO1xuICAgIGlmIChpc1ByZXNlbnQobnNBbmROYW1lWzBdKSkge1xuICAgICAgYXR0cmlidXRlTmFtZSA9IG5zQW5kTmFtZVswXSArICc6JyArIG5zQW5kTmFtZVsxXTtcbiAgICAgIGF0dHJOcyA9IE5BTUVTUEFDRV9VUklTW25zQW5kTmFtZVswXV07XG4gICAgfVxuICAgIGlmIChpc1ByZXNlbnQoYXR0cmlidXRlVmFsdWUpKSB7XG4gICAgICBpZiAoaXNQcmVzZW50KGF0dHJOcykpIHtcbiAgICAgICAgRE9NLnNldEF0dHJpYnV0ZU5TKHJlbmRlckVsZW1lbnQsIGF0dHJOcywgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRE9NLnNldEF0dHJpYnV0ZShyZW5kZXJFbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1ByZXNlbnQoYXR0ck5zKSkge1xuICAgICAgICBET00ucmVtb3ZlQXR0cmlidXRlTlMocmVuZGVyRWxlbWVudCwgYXR0ck5zLCBuc0FuZE5hbWVbMV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRE9NLnJlbW92ZUF0dHJpYnV0ZShyZW5kZXJFbGVtZW50LCBhdHRyaWJ1dGVOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRCaW5kaW5nRGVidWdJbmZvKHJlbmRlckVsZW1lbnQ6IGFueSwgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHByb3BlcnR5VmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHZhciBkYXNoQ2FzZWRQcm9wZXJ0eU5hbWUgPSBjYW1lbENhc2VUb0Rhc2hDYXNlKHByb3BlcnR5TmFtZSk7XG4gICAgaWYgKERPTS5pc0NvbW1lbnROb2RlKHJlbmRlckVsZW1lbnQpKSB7XG4gICAgICB2YXIgZXhpc3RpbmdCaW5kaW5ncyA9IFJlZ0V4cFdyYXBwZXIuZmlyc3RNYXRjaChcbiAgICAgICAgICBURU1QTEFURV9CSU5ESU5HU19FWFAsIFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbChET00uZ2V0VGV4dChyZW5kZXJFbGVtZW50KSwgL1xcbi9nLCAnJykpO1xuICAgICAgdmFyIHBhcnNlZEJpbmRpbmdzID0gSnNvbi5wYXJzZShleGlzdGluZ0JpbmRpbmdzWzFdKTtcbiAgICAgIHBhcnNlZEJpbmRpbmdzW2Rhc2hDYXNlZFByb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlO1xuICAgICAgRE9NLnNldFRleHQocmVuZGVyRWxlbWVudCwgU3RyaW5nV3JhcHBlci5yZXBsYWNlKFRFTVBMQVRFX0NPTU1FTlRfVEVYVCwgJ3t9JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKc29uLnN0cmluZ2lmeShwYXJzZWRCaW5kaW5ncykpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRFbGVtZW50QXR0cmlidXRlKHJlbmRlckVsZW1lbnQsIHByb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgc2V0RWxlbWVudENsYXNzKHJlbmRlckVsZW1lbnQ6IGFueSwgY2xhc3NOYW1lOiBzdHJpbmcsIGlzQWRkOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKGlzQWRkKSB7XG4gICAgICBET00uYWRkQ2xhc3MocmVuZGVyRWxlbWVudCwgY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgRE9NLnJlbW92ZUNsYXNzKHJlbmRlckVsZW1lbnQsIGNsYXNzTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgc2V0RWxlbWVudFN0eWxlKHJlbmRlckVsZW1lbnQ6IGFueSwgc3R5bGVOYW1lOiBzdHJpbmcsIHN0eWxlVmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmIChpc1ByZXNlbnQoc3R5bGVWYWx1ZSkpIHtcbiAgICAgIERPTS5zZXRTdHlsZShyZW5kZXJFbGVtZW50LCBzdHlsZU5hbWUsIHN0cmluZ2lmeShzdHlsZVZhbHVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIERPTS5yZW1vdmVTdHlsZShyZW5kZXJFbGVtZW50LCBzdHlsZU5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIGludm9rZUVsZW1lbnRNZXRob2QocmVuZGVyRWxlbWVudDogYW55LCBtZXRob2ROYW1lOiBzdHJpbmcsIGFyZ3M6IGFueVtdKTogdm9pZCB7XG4gICAgRE9NLmludm9rZShyZW5kZXJFbGVtZW50LCBtZXRob2ROYW1lLCBhcmdzKTtcbiAgfVxuXG4gIHNldFRleHQocmVuZGVyTm9kZTogYW55LCB0ZXh0OiBzdHJpbmcpOiB2b2lkIHsgRE9NLnNldFRleHQocmVuZGVyTm9kZSwgdGV4dCk7IH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgYW5pbWF0aW9ucyBpZiBuZWNlc3NhcnlcbiAgICogQHBhcmFtIG5vZGVcbiAgICovXG4gIGFuaW1hdGVOb2RlRW50ZXIobm9kZTogTm9kZSkge1xuICAgIGlmIChET00uaXNFbGVtZW50Tm9kZShub2RlKSAmJiBET00uaGFzQ2xhc3Mobm9kZSwgJ25nLWFuaW1hdGUnKSkge1xuICAgICAgRE9NLmFkZENsYXNzKG5vZGUsICduZy1lbnRlcicpO1xuICAgICAgdGhpcy5fcm9vdFJlbmRlcmVyLmFuaW1hdGUuY3NzKClcbiAgICAgICAgICAuYWRkQW5pbWF0aW9uQ2xhc3MoJ25nLWVudGVyLWFjdGl2ZScpXG4gICAgICAgICAgLnN0YXJ0KDxIVE1MRWxlbWVudD5ub2RlKVxuICAgICAgICAgIC5vbkNvbXBsZXRlKCgpID0+IHsgRE9NLnJlbW92ZUNsYXNzKG5vZGUsICduZy1lbnRlcicpOyB9KTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiBJZiBhbmltYXRpb25zIGFyZSBuZWNlc3NhcnksIHBlcmZvcm1zIGFuaW1hdGlvbnMgdGhlbiByZW1vdmVzIHRoZSBlbGVtZW50OyBvdGhlcndpc2UsIGl0IGp1c3RcbiAgICogcmVtb3ZlcyB0aGUgZWxlbWVudC5cbiAgICogQHBhcmFtIG5vZGVcbiAgICovXG4gIGFuaW1hdGVOb2RlTGVhdmUobm9kZTogTm9kZSkge1xuICAgIGlmIChET00uaXNFbGVtZW50Tm9kZShub2RlKSAmJiBET00uaGFzQ2xhc3Mobm9kZSwgJ25nLWFuaW1hdGUnKSkge1xuICAgICAgRE9NLmFkZENsYXNzKG5vZGUsICduZy1sZWF2ZScpO1xuICAgICAgdGhpcy5fcm9vdFJlbmRlcmVyLmFuaW1hdGUuY3NzKClcbiAgICAgICAgICAuYWRkQW5pbWF0aW9uQ2xhc3MoJ25nLWxlYXZlLWFjdGl2ZScpXG4gICAgICAgICAgLnN0YXJ0KDxIVE1MRWxlbWVudD5ub2RlKVxuICAgICAgICAgIC5vbkNvbXBsZXRlKCgpID0+IHtcbiAgICAgICAgICAgIERPTS5yZW1vdmVDbGFzcyhub2RlLCAnbmctbGVhdmUnKTtcbiAgICAgICAgICAgIERPTS5yZW1vdmUobm9kZSk7XG4gICAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIERPTS5yZW1vdmUobm9kZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG1vdmVOb2Rlc0FmdGVyU2libGluZyhzaWJsaW5nLCBub2Rlcykge1xuICB2YXIgcGFyZW50ID0gRE9NLnBhcmVudEVsZW1lbnQoc2libGluZyk7XG4gIGlmIChub2Rlcy5sZW5ndGggPiAwICYmIGlzUHJlc2VudChwYXJlbnQpKSB7XG4gICAgdmFyIG5leHRTaWJsaW5nID0gRE9NLm5leHRTaWJsaW5nKHNpYmxpbmcpO1xuICAgIGlmIChpc1ByZXNlbnQobmV4dFNpYmxpbmcpKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIERPTS5pbnNlcnRCZWZvcmUobmV4dFNpYmxpbmcsIG5vZGVzW2ldKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBET00uYXBwZW5kQ2hpbGQocGFyZW50LCBub2Rlc1tpXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGFwcGVuZE5vZGVzKHBhcmVudCwgbm9kZXMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIERPTS5hcHBlbmRDaGlsZChwYXJlbnQsIG5vZGVzW2ldKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkZWNvcmF0ZVByZXZlbnREZWZhdWx0KGV2ZW50SGFuZGxlcjogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XG4gIHJldHVybiAoZXZlbnQpID0+IHtcbiAgICB2YXIgYWxsb3dEZWZhdWx0QmVoYXZpb3IgPSBldmVudEhhbmRsZXIoZXZlbnQpO1xuICAgIGlmIChhbGxvd0RlZmF1bHRCZWhhdmlvciA9PT0gZmFsc2UpIHtcbiAgICAgIC8vIFRPRE8odGJvc2NoKTogbW92ZSBwcmV2ZW50RGVmYXVsdCBpbnRvIGV2ZW50IHBsdWdpbnMuLi5cbiAgICAgIERPTS5wcmV2ZW50RGVmYXVsdChldmVudCk7XG4gICAgfVxuICB9O1xufVxuXG52YXIgQ09NUE9ORU5UX1JFR0VYID0gLyVDT01QJS9nO1xuZXhwb3J0IGNvbnN0IENPTVBPTkVOVF9WQVJJQUJMRSA9ICclQ09NUCUnO1xuZXhwb3J0IGNvbnN0IEhPU1RfQVRUUiA9IGBfbmdob3N0LSR7Q09NUE9ORU5UX1ZBUklBQkxFfWA7XG5leHBvcnQgY29uc3QgQ09OVEVOVF9BVFRSID0gYF9uZ2NvbnRlbnQtJHtDT01QT05FTlRfVkFSSUFCTEV9YDtcblxuZnVuY3Rpb24gX3NoaW1Db250ZW50QXR0cmlidXRlKGNvbXBvbmVudFNob3J0SWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGwoQ09OVEVOVF9BVFRSLCBDT01QT05FTlRfUkVHRVgsIGNvbXBvbmVudFNob3J0SWQpO1xufVxuXG5mdW5jdGlvbiBfc2hpbUhvc3RBdHRyaWJ1dGUoY29tcG9uZW50U2hvcnRJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbChIT1NUX0FUVFIsIENPTVBPTkVOVF9SRUdFWCwgY29tcG9uZW50U2hvcnRJZCk7XG59XG5cbmZ1bmN0aW9uIF9mbGF0dGVuU3R5bGVzKGNvbXBJZDogc3RyaW5nLCBzdHlsZXM6IEFycmF5PGFueSB8IGFueVtdPiwgdGFyZ2V0OiBzdHJpbmdbXSk6IHN0cmluZ1tdIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc3R5bGUgPSBzdHlsZXNbaV07XG4gICAgaWYgKGlzQXJyYXkoc3R5bGUpKSB7XG4gICAgICBfZmxhdHRlblN0eWxlcyhjb21wSWQsIHN0eWxlLCB0YXJnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZSA9IFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbChzdHlsZSwgQ09NUE9ORU5UX1JFR0VYLCBjb21wSWQpO1xuICAgICAgdGFyZ2V0LnB1c2goc3R5bGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG52YXIgTlNfUFJFRklYX1JFID0gL15AKFteOl0rKTooLispL2c7XG5cbmZ1bmN0aW9uIHNwbGl0TmFtZXNwYWNlKG5hbWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgaWYgKG5hbWVbMF0gIT0gJ0AnKSB7XG4gICAgcmV0dXJuIFtudWxsLCBuYW1lXTtcbiAgfVxuICBsZXQgbWF0Y2ggPSBSZWdFeHBXcmFwcGVyLmZpcnN0TWF0Y2goTlNfUFJFRklYX1JFLCBuYW1lKTtcbiAgcmV0dXJuIFttYXRjaFsxXSwgbWF0Y2hbMl1dO1xufVxuIl19