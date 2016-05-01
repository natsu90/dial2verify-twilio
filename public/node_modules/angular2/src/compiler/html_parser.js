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
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var html_ast_1 = require('./html_ast');
var di_1 = require('angular2/src/core/di');
var html_lexer_1 = require('./html_lexer');
var parse_util_1 = require('./parse_util');
var html_tags_1 = require('./html_tags');
var HtmlTreeError = (function (_super) {
    __extends(HtmlTreeError, _super);
    function HtmlTreeError(elementName, span, msg) {
        _super.call(this, span, msg);
        this.elementName = elementName;
    }
    HtmlTreeError.create = function (elementName, span, msg) {
        return new HtmlTreeError(elementName, span, msg);
    };
    return HtmlTreeError;
}(parse_util_1.ParseError));
exports.HtmlTreeError = HtmlTreeError;
var HtmlParseTreeResult = (function () {
    function HtmlParseTreeResult(rootNodes, errors) {
        this.rootNodes = rootNodes;
        this.errors = errors;
    }
    return HtmlParseTreeResult;
}());
exports.HtmlParseTreeResult = HtmlParseTreeResult;
var HtmlParser = (function () {
    function HtmlParser() {
    }
    HtmlParser.prototype.parse = function (sourceContent, sourceUrl, parseExpansionForms) {
        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
        var tokensAndErrors = html_lexer_1.tokenizeHtml(sourceContent, sourceUrl, parseExpansionForms);
        var treeAndErrors = new TreeBuilder(tokensAndErrors.tokens).build();
        return new HtmlParseTreeResult(treeAndErrors.rootNodes, tokensAndErrors.errors
            .concat(treeAndErrors.errors));
    };
    HtmlParser = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], HtmlParser);
    return HtmlParser;
}());
exports.HtmlParser = HtmlParser;
var TreeBuilder = (function () {
    function TreeBuilder(tokens) {
        this.tokens = tokens;
        this.index = -1;
        this.rootNodes = [];
        this.errors = [];
        this.elementStack = [];
        this._advance();
    }
    TreeBuilder.prototype.build = function () {
        while (this.peek.type !== html_lexer_1.HtmlTokenType.EOF) {
            if (this.peek.type === html_lexer_1.HtmlTokenType.TAG_OPEN_START) {
                this._consumeStartTag(this._advance());
            }
            else if (this.peek.type === html_lexer_1.HtmlTokenType.TAG_CLOSE) {
                this._consumeEndTag(this._advance());
            }
            else if (this.peek.type === html_lexer_1.HtmlTokenType.CDATA_START) {
                this._closeVoidElement();
                this._consumeCdata(this._advance());
            }
            else if (this.peek.type === html_lexer_1.HtmlTokenType.COMMENT_START) {
                this._closeVoidElement();
                this._consumeComment(this._advance());
            }
            else if (this.peek.type === html_lexer_1.HtmlTokenType.TEXT ||
                this.peek.type === html_lexer_1.HtmlTokenType.RAW_TEXT ||
                this.peek.type === html_lexer_1.HtmlTokenType.ESCAPABLE_RAW_TEXT) {
                this._closeVoidElement();
                this._consumeText(this._advance());
            }
            else if (this.peek.type === html_lexer_1.HtmlTokenType.EXPANSION_FORM_START) {
                this._consumeExpansion(this._advance());
            }
            else {
                // Skip all other tokens...
                this._advance();
            }
        }
        return new HtmlParseTreeResult(this.rootNodes, this.errors);
    };
    TreeBuilder.prototype._advance = function () {
        var prev = this.peek;
        if (this.index < this.tokens.length - 1) {
            // Note: there is always an EOF token at the end
            this.index++;
        }
        this.peek = this.tokens[this.index];
        return prev;
    };
    TreeBuilder.prototype._advanceIf = function (type) {
        if (this.peek.type === type) {
            return this._advance();
        }
        return null;
    };
    TreeBuilder.prototype._consumeCdata = function (startToken) {
        this._consumeText(this._advance());
        this._advanceIf(html_lexer_1.HtmlTokenType.CDATA_END);
    };
    TreeBuilder.prototype._consumeComment = function (token) {
        var text = this._advanceIf(html_lexer_1.HtmlTokenType.RAW_TEXT);
        this._advanceIf(html_lexer_1.HtmlTokenType.COMMENT_END);
        var value = lang_1.isPresent(text) ? text.parts[0].trim() : null;
        this._addToParent(new html_ast_1.HtmlCommentAst(value, token.sourceSpan));
    };
    TreeBuilder.prototype._consumeExpansion = function (token) {
        var switchValue = this._advance();
        var type = this._advance();
        var cases = [];
        // read =
        while (this.peek.type === html_lexer_1.HtmlTokenType.EXPANSION_CASE_VALUE) {
            var expCase = this._parseExpansionCase();
            if (lang_1.isBlank(expCase))
                return; // error
            cases.push(expCase);
        }
        // read the final }
        if (this.peek.type !== html_lexer_1.HtmlTokenType.EXPANSION_FORM_END) {
            this.errors.push(HtmlTreeError.create(null, this.peek.sourceSpan, "Invalid expansion form. Missing '}'."));
            return;
        }
        this._advance();
        var mainSourceSpan = new parse_util_1.ParseSourceSpan(token.sourceSpan.start, this.peek.sourceSpan.end);
        this._addToParent(new html_ast_1.HtmlExpansionAst(switchValue.parts[0], type.parts[0], cases, mainSourceSpan, switchValue.sourceSpan));
    };
    TreeBuilder.prototype._parseExpansionCase = function () {
        var value = this._advance();
        // read {
        if (this.peek.type !== html_lexer_1.HtmlTokenType.EXPANSION_CASE_EXP_START) {
            this.errors.push(HtmlTreeError.create(null, this.peek.sourceSpan, "Invalid expansion form. Missing '{'.,"));
            return null;
        }
        // read until }
        var start = this._advance();
        var exp = this._collectExpansionExpTokens(start);
        if (lang_1.isBlank(exp))
            return null;
        var end = this._advance();
        exp.push(new html_lexer_1.HtmlToken(html_lexer_1.HtmlTokenType.EOF, [], end.sourceSpan));
        // parse everything in between { and }
        var parsedExp = new TreeBuilder(exp).build();
        if (parsedExp.errors.length > 0) {
            this.errors = this.errors.concat(parsedExp.errors);
            return null;
        }
        var sourceSpan = new parse_util_1.ParseSourceSpan(value.sourceSpan.start, end.sourceSpan.end);
        var expSourceSpan = new parse_util_1.ParseSourceSpan(start.sourceSpan.start, end.sourceSpan.end);
        return new html_ast_1.HtmlExpansionCaseAst(value.parts[0], parsedExp.rootNodes, sourceSpan, value.sourceSpan, expSourceSpan);
    };
    TreeBuilder.prototype._collectExpansionExpTokens = function (start) {
        var exp = [];
        var expansionFormStack = [html_lexer_1.HtmlTokenType.EXPANSION_CASE_EXP_START];
        while (true) {
            if (this.peek.type === html_lexer_1.HtmlTokenType.EXPANSION_FORM_START ||
                this.peek.type === html_lexer_1.HtmlTokenType.EXPANSION_CASE_EXP_START) {
                expansionFormStack.push(this.peek.type);
            }
            if (this.peek.type === html_lexer_1.HtmlTokenType.EXPANSION_CASE_EXP_END) {
                if (lastOnStack(expansionFormStack, html_lexer_1.HtmlTokenType.EXPANSION_CASE_EXP_START)) {
                    expansionFormStack.pop();
                    if (expansionFormStack.length == 0)
                        return exp;
                }
                else {
                    this.errors.push(HtmlTreeError.create(null, start.sourceSpan, "Invalid expansion form. Missing '}'."));
                    return null;
                }
            }
            if (this.peek.type === html_lexer_1.HtmlTokenType.EXPANSION_FORM_END) {
                if (lastOnStack(expansionFormStack, html_lexer_1.HtmlTokenType.EXPANSION_FORM_START)) {
                    expansionFormStack.pop();
                }
                else {
                    this.errors.push(HtmlTreeError.create(null, start.sourceSpan, "Invalid expansion form. Missing '}'."));
                    return null;
                }
            }
            if (this.peek.type === html_lexer_1.HtmlTokenType.EOF) {
                this.errors.push(HtmlTreeError.create(null, start.sourceSpan, "Invalid expansion form. Missing '}'."));
                return null;
            }
            exp.push(this._advance());
        }
    };
    TreeBuilder.prototype._consumeText = function (token) {
        var text = token.parts[0];
        if (text.length > 0 && text[0] == '\n') {
            var parent_1 = this._getParentElement();
            if (lang_1.isPresent(parent_1) && parent_1.children.length == 0 &&
                html_tags_1.getHtmlTagDefinition(parent_1.name).ignoreFirstLf) {
                text = text.substring(1);
            }
        }
        if (text.length > 0) {
            this._addToParent(new html_ast_1.HtmlTextAst(text, token.sourceSpan));
        }
    };
    TreeBuilder.prototype._closeVoidElement = function () {
        if (this.elementStack.length > 0) {
            var el = collection_1.ListWrapper.last(this.elementStack);
            if (html_tags_1.getHtmlTagDefinition(el.name).isVoid) {
                this.elementStack.pop();
            }
        }
    };
    TreeBuilder.prototype._consumeStartTag = function (startTagToken) {
        var prefix = startTagToken.parts[0];
        var name = startTagToken.parts[1];
        var attrs = [];
        while (this.peek.type === html_lexer_1.HtmlTokenType.ATTR_NAME) {
            attrs.push(this._consumeAttr(this._advance()));
        }
        var fullName = getElementFullName(prefix, name, this._getParentElement());
        var selfClosing = false;
        // Note: There could have been a tokenizer error
        // so that we don't get a token for the end tag...
        if (this.peek.type === html_lexer_1.HtmlTokenType.TAG_OPEN_END_VOID) {
            this._advance();
            selfClosing = true;
            if (html_tags_1.getNsPrefix(fullName) == null && !html_tags_1.getHtmlTagDefinition(fullName).isVoid) {
                this.errors.push(HtmlTreeError.create(fullName, startTagToken.sourceSpan, "Only void and foreign elements can be self closed \"" + startTagToken.parts[1] + "\""));
            }
        }
        else if (this.peek.type === html_lexer_1.HtmlTokenType.TAG_OPEN_END) {
            this._advance();
            selfClosing = false;
        }
        var end = this.peek.sourceSpan.start;
        var span = new parse_util_1.ParseSourceSpan(startTagToken.sourceSpan.start, end);
        var el = new html_ast_1.HtmlElementAst(fullName, attrs, [], span, span, null);
        this._pushElement(el);
        if (selfClosing) {
            this._popElement(fullName);
            el.endSourceSpan = span;
        }
    };
    TreeBuilder.prototype._pushElement = function (el) {
        if (this.elementStack.length > 0) {
            var parentEl = collection_1.ListWrapper.last(this.elementStack);
            if (html_tags_1.getHtmlTagDefinition(parentEl.name).isClosedByChild(el.name)) {
                this.elementStack.pop();
            }
        }
        var tagDef = html_tags_1.getHtmlTagDefinition(el.name);
        var parentEl = this._getParentElement();
        if (tagDef.requireExtraParent(lang_1.isPresent(parentEl) ? parentEl.name : null)) {
            var newParent = new html_ast_1.HtmlElementAst(tagDef.parentToAdd, [], [el], el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
            this._addToParent(newParent);
            this.elementStack.push(newParent);
            this.elementStack.push(el);
        }
        else {
            this._addToParent(el);
            this.elementStack.push(el);
        }
    };
    TreeBuilder.prototype._consumeEndTag = function (endTagToken) {
        var fullName = getElementFullName(endTagToken.parts[0], endTagToken.parts[1], this._getParentElement());
        this._getParentElement().endSourceSpan = endTagToken.sourceSpan;
        if (html_tags_1.getHtmlTagDefinition(fullName).isVoid) {
            this.errors.push(HtmlTreeError.create(fullName, endTagToken.sourceSpan, "Void elements do not have end tags \"" + endTagToken.parts[1] + "\""));
        }
        else if (!this._popElement(fullName)) {
            this.errors.push(HtmlTreeError.create(fullName, endTagToken.sourceSpan, "Unexpected closing tag \"" + endTagToken.parts[1] + "\""));
        }
    };
    TreeBuilder.prototype._popElement = function (fullName) {
        for (var stackIndex = this.elementStack.length - 1; stackIndex >= 0; stackIndex--) {
            var el = this.elementStack[stackIndex];
            if (el.name == fullName) {
                collection_1.ListWrapper.splice(this.elementStack, stackIndex, this.elementStack.length - stackIndex);
                return true;
            }
            if (!html_tags_1.getHtmlTagDefinition(el.name).closedByParent) {
                return false;
            }
        }
        return false;
    };
    TreeBuilder.prototype._consumeAttr = function (attrName) {
        var fullName = html_tags_1.mergeNsAndName(attrName.parts[0], attrName.parts[1]);
        var end = attrName.sourceSpan.end;
        var value = '';
        if (this.peek.type === html_lexer_1.HtmlTokenType.ATTR_VALUE) {
            var valueToken = this._advance();
            value = valueToken.parts[0];
            end = valueToken.sourceSpan.end;
        }
        return new html_ast_1.HtmlAttrAst(fullName, value, new parse_util_1.ParseSourceSpan(attrName.sourceSpan.start, end));
    };
    TreeBuilder.prototype._getParentElement = function () {
        return this.elementStack.length > 0 ? collection_1.ListWrapper.last(this.elementStack) : null;
    };
    TreeBuilder.prototype._addToParent = function (node) {
        var parent = this._getParentElement();
        if (lang_1.isPresent(parent)) {
            parent.children.push(node);
        }
        else {
            this.rootNodes.push(node);
        }
    };
    return TreeBuilder;
}());
function getElementFullName(prefix, localName, parentElement) {
    if (lang_1.isBlank(prefix)) {
        prefix = html_tags_1.getHtmlTagDefinition(localName).implicitNamespacePrefix;
        if (lang_1.isBlank(prefix) && lang_1.isPresent(parentElement)) {
            prefix = html_tags_1.getNsPrefix(parentElement.name);
        }
    }
    return html_tags_1.mergeNsAndName(prefix, localName);
}
function lastOnStack(stack, element) {
    return stack.length > 0 && stack[stack.length - 1] === element;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF9wYXJzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTRubzNaUXZPLnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvaHRtbF9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUJBU08sMEJBQTBCLENBQUMsQ0FBQTtBQUVsQywyQkFBMEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUUzRCx5QkFRTyxZQUFZLENBQUMsQ0FBQTtBQUVwQixtQkFBeUIsc0JBQXNCLENBQUMsQ0FBQTtBQUNoRCwyQkFBcUQsY0FBYyxDQUFDLENBQUE7QUFDcEUsMkJBQXlELGNBQWMsQ0FBQyxDQUFBO0FBQ3hFLDBCQUFtRixhQUFhLENBQUMsQ0FBQTtBQUVqRztJQUFtQyxpQ0FBVTtJQUszQyx1QkFBbUIsV0FBbUIsRUFBRSxJQUFxQixFQUFFLEdBQVc7UUFBSSxrQkFBTSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFBNUUsZ0JBQVcsR0FBWCxXQUFXLENBQVE7SUFBMEQsQ0FBQztJQUoxRixvQkFBTSxHQUFiLFVBQWMsV0FBbUIsRUFBRSxJQUFxQixFQUFFLEdBQVc7UUFDbkUsTUFBTSxDQUFDLElBQUksYUFBYSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUdILG9CQUFDO0FBQUQsQ0FBQyxBQU5ELENBQW1DLHVCQUFVLEdBTTVDO0FBTlkscUJBQWEsZ0JBTXpCLENBQUE7QUFFRDtJQUNFLDZCQUFtQixTQUFvQixFQUFTLE1BQW9CO1FBQWpELGNBQVMsR0FBVCxTQUFTLENBQVc7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFjO0lBQUcsQ0FBQztJQUMxRSwwQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRlksMkJBQW1CLHNCQUUvQixDQUFBO0FBR0Q7SUFBQTtJQVFBLENBQUM7SUFQQywwQkFBSyxHQUFM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LENBQUMsQ0FBQyxjQUFPLENBQUMsTUFBTSxDQUFDLElBQUksZ0JBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsTUFBTSxHQUFHLHVCQUFXLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLDBCQUFjLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzNDLENBQUM7QUFFRCxxQkFBcUIsS0FBWSxFQUFFLE9BQVk7SUFDN0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQztBQUNqRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgaXNQcmVzZW50LFxuICBpc0JsYW5rLFxuICBTdHJpbmdXcmFwcGVyLFxuICBzdHJpbmdpZnksXG4gIGFzc2VydGlvbnNFbmFibGVkLFxuICBTdHJpbmdKb2luZXIsXG4gIHNlcmlhbGl6ZUVudW0sXG4gIENPTlNUX0VYUFJcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcblxuaW1wb3J0IHtMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcblxuaW1wb3J0IHtcbiAgSHRtbEFzdCxcbiAgSHRtbEF0dHJBc3QsXG4gIEh0bWxUZXh0QXN0LFxuICBIdG1sQ29tbWVudEFzdCxcbiAgSHRtbEVsZW1lbnRBc3QsXG4gIEh0bWxFeHBhbnNpb25Bc3QsXG4gIEh0bWxFeHBhbnNpb25DYXNlQXN0XG59IGZyb20gJy4vaHRtbF9hc3QnO1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7SHRtbFRva2VuLCBIdG1sVG9rZW5UeXBlLCB0b2tlbml6ZUh0bWx9IGZyb20gJy4vaHRtbF9sZXhlcic7XG5pbXBvcnQge1BhcnNlRXJyb3IsIFBhcnNlTG9jYXRpb24sIFBhcnNlU291cmNlU3Bhbn0gZnJvbSAnLi9wYXJzZV91dGlsJztcbmltcG9ydCB7SHRtbFRhZ0RlZmluaXRpb24sIGdldEh0bWxUYWdEZWZpbml0aW9uLCBnZXROc1ByZWZpeCwgbWVyZ2VOc0FuZE5hbWV9IGZyb20gJy4vaHRtbF90YWdzJztcblxuZXhwb3J0IGNsYXNzIEh0bWxUcmVlRXJyb3IgZXh0ZW5kcyBQYXJzZUVycm9yIHtcbiAgc3RhdGljIGNyZWF0ZShlbGVtZW50TmFtZTogc3RyaW5nLCBzcGFuOiBQYXJzZVNvdXJjZVNwYW4sIG1zZzogc3RyaW5nKTogSHRtbFRyZWVFcnJvciB7XG4gICAgcmV0dXJuIG5ldyBIdG1sVHJlZUVycm9yKGVsZW1lbnROYW1lLCBzcGFuLCBtc2cpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsZW1lbnROYW1lOiBzdHJpbmcsIHNwYW46IFBhcnNlU291cmNlU3BhbiwgbXNnOiBzdHJpbmcpIHsgc3VwZXIoc3BhbiwgbXNnKTsgfVxufVxuXG5leHBvcnQgY2xhc3MgSHRtbFBhcnNlVHJlZVJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByb290Tm9kZXM6IEh0bWxBc3RbXSwgcHVibGljIGVycm9yczogUGFyc2VFcnJvcltdKSB7fVxufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSHRtbFBhcnNlciB7XG4gIHBhcnNlKHNvdXJjZUNvbnRlbnQ6IHN0cmluZywgc291cmNlVXJsOiBzdHJpbmcsXG4gICAgICAgIHBhcnNlRXhwYW5zaW9uRm9ybXM6IGJvb2xlYW4gPSBmYWxzZSk6IEh0bWxQYXJzZVRyZWVSZXN1bHQge1xuICAgIHZhciB0b2tlbnNBbmRFcnJvcnMgPSB0b2tlbml6ZUh0bWwoc291cmNlQ29udGVudCwgc291cmNlVXJsLCBwYXJzZUV4cGFuc2lvbkZvcm1zKTtcbiAgICB2YXIgdHJlZUFuZEVycm9ycyA9IG5ldyBUcmVlQnVpbGRlcih0b2tlbnNBbmRFcnJvcnMudG9rZW5zKS5idWlsZCgpO1xuICAgIHJldHVybiBuZXcgSHRtbFBhcnNlVHJlZVJlc3VsdCh0cmVlQW5kRXJyb3JzLnJvb3ROb2RlcywgKDxQYXJzZUVycm9yW10+dG9rZW5zQW5kRXJyb3JzLmVycm9ycylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KHRyZWVBbmRFcnJvcnMuZXJyb3JzKSk7XG4gIH1cbn1cblxuY2xhc3MgVHJlZUJ1aWxkZXIge1xuICBwcml2YXRlIGluZGV4OiBudW1iZXIgPSAtMTtcbiAgcHJpdmF0ZSBwZWVrOiBIdG1sVG9rZW47XG5cbiAgcHJpdmF0ZSByb290Tm9kZXM6IEh0bWxBc3RbXSA9IFtdO1xuICBwcml2YXRlIGVycm9yczogSHRtbFRyZWVFcnJvcltdID0gW107XG5cbiAgcHJpdmF0ZSBlbGVtZW50U3RhY2s6IEh0bWxFbGVtZW50QXN0W10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRva2VuczogSHRtbFRva2VuW10pIHsgdGhpcy5fYWR2YW5jZSgpOyB9XG5cbiAgYnVpbGQoKTogSHRtbFBhcnNlVHJlZVJlc3VsdCB7XG4gICAgd2hpbGUgKHRoaXMucGVlay50eXBlICE9PSBIdG1sVG9rZW5UeXBlLkVPRikge1xuICAgICAgaWYgKHRoaXMucGVlay50eXBlID09PSBIdG1sVG9rZW5UeXBlLlRBR19PUEVOX1NUQVJUKSB7XG4gICAgICAgIHRoaXMuX2NvbnN1bWVTdGFydFRhZyh0aGlzLl9hZHZhbmNlKCkpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBlZWsudHlwZSA9PT0gSHRtbFRva2VuVHlwZS5UQUdfQ0xPU0UpIHtcbiAgICAgICAgdGhpcy5fY29uc3VtZUVuZFRhZyh0aGlzLl9hZHZhbmNlKCkpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBlZWsudHlwZSA9PT0gSHRtbFRva2VuVHlwZS5DREFUQV9TVEFSVCkge1xuICAgICAgICB0aGlzLl9jbG9zZVZvaWRFbGVtZW50KCk7XG4gICAgICAgIHRoaXMuX2NvbnN1bWVDZGF0YSh0aGlzLl9hZHZhbmNlKCkpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBlZWsudHlwZSA9PT0gSHRtbFRva2VuVHlwZS5DT01NRU5UX1NUQVJUKSB7XG4gICAgICAgIHRoaXMuX2Nsb3NlVm9pZEVsZW1lbnQoKTtcbiAgICAgICAgdGhpcy5fY29uc3VtZUNvbW1lbnQodGhpcy5fYWR2YW5jZSgpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wZWVrLnR5cGUgPT09IEh0bWxUb2tlblR5cGUuVEVYVCB8fFxuICAgICAgICAgICAgICAgICB0aGlzLnBlZWsudHlwZSA9PT0gSHRtbFRva2VuVHlwZS5SQVdfVEVYVCB8fFxuICAgICAgICAgICAgICAgICB0aGlzLnBlZWsudHlwZSA9PT0gSHRtbFRva2VuVHlwZS5FU0NBUEFCTEVfUkFXX1RFWFQpIHtcbiAgICAgICAgdGhpcy5fY2xvc2VWb2lkRWxlbWVudCgpO1xuICAgICAgICB0aGlzLl9jb25zdW1lVGV4dCh0aGlzLl9hZHZhbmNlKCkpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBlZWsudHlwZSA9PT0gSHRtbFRva2VuVHlwZS5FWFBBTlNJT05fRk9STV9TVEFSVCkge1xuICAgICAgICB0aGlzLl9jb25zdW1lRXhwYW5zaW9uKHRoaXMuX2FkdmFuY2UoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTa2lwIGFsbCBvdGhlciB0b2tlbnMuLi5cbiAgICAgICAgdGhpcy5fYWR2YW5jZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEh0bWxQYXJzZVRyZWVSZXN1bHQodGhpcy5yb290Tm9kZXMsIHRoaXMuZXJyb3JzKTtcbiAgfVxuXG4gIHByaXZhdGUgX2FkdmFuY2UoKTogSHRtbFRva2VuIHtcbiAgICB2YXIgcHJldiA9IHRoaXMucGVlaztcbiAgICBpZiAodGhpcy5pbmRleCA8IHRoaXMudG9rZW5zLmxlbmd0aCAtIDEpIHtcbiAgICAgIC8vIE5vdGU6IHRoZXJlIGlzIGFsd2F5cyBhbiBFT0YgdG9rZW4gYXQgdGhlIGVuZFxuICAgICAgdGhpcy5pbmRleCsrO1xuICAgIH1cbiAgICB0aGlzLnBlZWsgPSB0aGlzLnRva2Vuc1t0aGlzLmluZGV4XTtcbiAgICByZXR1cm4gcHJldjtcbiAgfVxuXG4gIHByaXZhdGUgX2FkdmFuY2VJZih0eXBlOiBIdG1sVG9rZW5UeXBlKTogSHRtbFRva2VuIHtcbiAgICBpZiAodGhpcy5wZWVrLnR5cGUgPT09IHR5cGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hZHZhbmNlKCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZUNkYXRhKHN0YXJ0VG9rZW46IEh0bWxUb2tlbikge1xuICAgIHRoaXMuX2NvbnN1bWVUZXh0KHRoaXMuX2FkdmFuY2UoKSk7XG4gICAgdGhpcy5fYWR2YW5jZUlmKEh0bWxUb2tlblR5cGUuQ0RBVEFfRU5EKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbnN1bWVDb21tZW50KHRva2VuOiBIdG1sVG9rZW4pIHtcbiAgICB2YXIgdGV4dCA9IHRoaXMuX2FkdmFuY2VJZihIdG1sVG9rZW5UeXBlLlJBV19URVhUKTtcbiAgICB0aGlzLl9hZHZhbmNlSWYoSHRtbFRva2VuVHlwZS5DT01NRU5UX0VORCk7XG4gICAgdmFyIHZhbHVlID0gaXNQcmVzZW50KHRleHQpID8gdGV4dC5wYXJ0c1swXS50cmltKCkgOiBudWxsO1xuICAgIHRoaXMuX2FkZFRvUGFyZW50KG5ldyBIdG1sQ29tbWVudEFzdCh2YWx1ZSwgdG9rZW4uc291cmNlU3BhbikpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZUV4cGFuc2lvbih0b2tlbjogSHRtbFRva2VuKSB7XG4gICAgbGV0IHN3aXRjaFZhbHVlID0gdGhpcy5fYWR2YW5jZSgpO1xuXG4gICAgbGV0IHR5cGUgPSB0aGlzLl9hZHZhbmNlKCk7XG4gICAgbGV0IGNhc2VzID0gW107XG5cbiAgICAvLyByZWFkID1cbiAgICB3aGlsZSAodGhpcy5wZWVrLnR5cGUgPT09IEh0bWxUb2tlblR5cGUuRVhQQU5TSU9OX0NBU0VfVkFMVUUpIHtcbiAgICAgIGxldCBleHBDYXNlID0gdGhpcy5fcGFyc2VFeHBhbnNpb25DYXNlKCk7XG4gICAgICBpZiAoaXNCbGFuayhleHBDYXNlKSkgcmV0dXJuOyAgLy8gZXJyb3JcbiAgICAgIGNhc2VzLnB1c2goZXhwQ2FzZSk7XG4gICAgfVxuXG4gICAgLy8gcmVhZCB0aGUgZmluYWwgfVxuICAgIGlmICh0aGlzLnBlZWsudHlwZSAhPT0gSHRtbFRva2VuVHlwZS5FWFBBTlNJT05fRk9STV9FTkQpIHtcbiAgICAgIHRoaXMuZXJyb3JzLnB1c2goXG4gICAgICAgICAgSHRtbFRyZWVFcnJvci5jcmVhdGUobnVsbCwgdGhpcy5wZWVrLnNvdXJjZVNwYW4sIGBJbnZhbGlkIGV4cGFuc2lvbiBmb3JtLiBNaXNzaW5nICd9Jy5gKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2FkdmFuY2UoKTtcblxuICAgIGxldCBtYWluU291cmNlU3BhbiA9IG5ldyBQYXJzZVNvdXJjZVNwYW4odG9rZW4uc291cmNlU3Bhbi5zdGFydCwgdGhpcy5wZWVrLnNvdXJjZVNwYW4uZW5kKTtcbiAgICB0aGlzLl9hZGRUb1BhcmVudChuZXcgSHRtbEV4cGFuc2lvbkFzdChzd2l0Y2hWYWx1ZS5wYXJ0c1swXSwgdHlwZS5wYXJ0c1swXSwgY2FzZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpblNvdXJjZVNwYW4sIHN3aXRjaFZhbHVlLnNvdXJjZVNwYW4pKTtcbiAgfVxuXG4gIHByaXZhdGUgX3BhcnNlRXhwYW5zaW9uQ2FzZSgpOiBIdG1sRXhwYW5zaW9uQ2FzZUFzdCB7XG4gICAgbGV0IHZhbHVlID0gdGhpcy5fYWR2YW5jZSgpO1xuXG4gICAgLy8gcmVhZCB7XG4gICAgaWYgKHRoaXMucGVlay50eXBlICE9PSBIdG1sVG9rZW5UeXBlLkVYUEFOU0lPTl9DQVNFX0VYUF9TVEFSVCkge1xuICAgICAgdGhpcy5lcnJvcnMucHVzaChIdG1sVHJlZUVycm9yLmNyZWF0ZShudWxsLCB0aGlzLnBlZWsuc291cmNlU3BhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYEludmFsaWQgZXhwYW5zaW9uIGZvcm0uIE1pc3NpbmcgJ3snLixgKSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyByZWFkIHVudGlsIH1cbiAgICBsZXQgc3RhcnQgPSB0aGlzLl9hZHZhbmNlKCk7XG5cbiAgICBsZXQgZXhwID0gdGhpcy5fY29sbGVjdEV4cGFuc2lvbkV4cFRva2VucyhzdGFydCk7XG4gICAgaWYgKGlzQmxhbmsoZXhwKSkgcmV0dXJuIG51bGw7XG5cbiAgICBsZXQgZW5kID0gdGhpcy5fYWR2YW5jZSgpO1xuICAgIGV4cC5wdXNoKG5ldyBIdG1sVG9rZW4oSHRtbFRva2VuVHlwZS5FT0YsIFtdLCBlbmQuc291cmNlU3BhbikpO1xuXG4gICAgLy8gcGFyc2UgZXZlcnl0aGluZyBpbiBiZXR3ZWVuIHsgYW5kIH1cbiAgICBsZXQgcGFyc2VkRXhwID0gbmV3IFRyZWVCdWlsZGVyKGV4cCkuYnVpbGQoKTtcbiAgICBpZiAocGFyc2VkRXhwLmVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmVycm9ycyA9IHRoaXMuZXJyb3JzLmNvbmNhdCg8SHRtbFRyZWVFcnJvcltdPnBhcnNlZEV4cC5lcnJvcnMpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IHNvdXJjZVNwYW4gPSBuZXcgUGFyc2VTb3VyY2VTcGFuKHZhbHVlLnNvdXJjZVNwYW4uc3RhcnQsIGVuZC5zb3VyY2VTcGFuLmVuZCk7XG4gICAgbGV0IGV4cFNvdXJjZVNwYW4gPSBuZXcgUGFyc2VTb3VyY2VTcGFuKHN0YXJ0LnNvdXJjZVNwYW4uc3RhcnQsIGVuZC5zb3VyY2VTcGFuLmVuZCk7XG4gICAgcmV0dXJuIG5ldyBIdG1sRXhwYW5zaW9uQ2FzZUFzdCh2YWx1ZS5wYXJ0c1swXSwgcGFyc2VkRXhwLnJvb3ROb2Rlcywgc291cmNlU3BhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnNvdXJjZVNwYW4sIGV4cFNvdXJjZVNwYW4pO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29sbGVjdEV4cGFuc2lvbkV4cFRva2VucyhzdGFydDogSHRtbFRva2VuKTogSHRtbFRva2VuW10ge1xuICAgIGxldCBleHAgPSBbXTtcbiAgICBsZXQgZXhwYW5zaW9uRm9ybVN0YWNrID0gW0h0bWxUb2tlblR5cGUuRVhQQU5TSU9OX0NBU0VfRVhQX1NUQVJUXTtcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBpZiAodGhpcy5wZWVrLnR5cGUgPT09IEh0bWxUb2tlblR5cGUuRVhQQU5TSU9OX0ZPUk1fU1RBUlQgfHxcbiAgICAgICAgICB0aGlzLnBlZWsudHlwZSA9PT0gSHRtbFRva2VuVHlwZS5FWFBBTlNJT05fQ0FTRV9FWFBfU1RBUlQpIHtcbiAgICAgICAgZXhwYW5zaW9uRm9ybVN0YWNrLnB1c2godGhpcy5wZWVrLnR5cGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5wZWVrLnR5cGUgPT09IEh0bWxUb2tlblR5cGUuRVhQQU5TSU9OX0NBU0VfRVhQX0VORCkge1xuICAgICAgICBpZiAobGFzdE9uU3RhY2soZXhwYW5zaW9uRm9ybVN0YWNrLCBIdG1sVG9rZW5UeXBlLkVYUEFOU0lPTl9DQVNFX0VYUF9TVEFSVCkpIHtcbiAgICAgICAgICBleHBhbnNpb25Gb3JtU3RhY2sucG9wKCk7XG4gICAgICAgICAgaWYgKGV4cGFuc2lvbkZvcm1TdGFjay5sZW5ndGggPT0gMCkgcmV0dXJuIGV4cDtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goXG4gICAgICAgICAgICAgIEh0bWxUcmVlRXJyb3IuY3JlYXRlKG51bGwsIHN0YXJ0LnNvdXJjZVNwYW4sIGBJbnZhbGlkIGV4cGFuc2lvbiBmb3JtLiBNaXNzaW5nICd9Jy5gKSk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucGVlay50eXBlID09PSBIdG1sVG9rZW5UeXBlLkVYUEFOU0lPTl9GT1JNX0VORCkge1xuICAgICAgICBpZiAobGFzdE9uU3RhY2soZXhwYW5zaW9uRm9ybVN0YWNrLCBIdG1sVG9rZW5UeXBlLkVYUEFOU0lPTl9GT1JNX1NUQVJUKSkge1xuICAgICAgICAgIGV4cGFuc2lvbkZvcm1TdGFjay5wb3AoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKFxuICAgICAgICAgICAgICBIdG1sVHJlZUVycm9yLmNyZWF0ZShudWxsLCBzdGFydC5zb3VyY2VTcGFuLCBgSW52YWxpZCBleHBhbnNpb24gZm9ybS4gTWlzc2luZyAnfScuYCkpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnBlZWsudHlwZSA9PT0gSHRtbFRva2VuVHlwZS5FT0YpIHtcbiAgICAgICAgdGhpcy5lcnJvcnMucHVzaChcbiAgICAgICAgICAgIEh0bWxUcmVlRXJyb3IuY3JlYXRlKG51bGwsIHN0YXJ0LnNvdXJjZVNwYW4sIGBJbnZhbGlkIGV4cGFuc2lvbiBmb3JtLiBNaXNzaW5nICd9Jy5gKSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBleHAucHVzaCh0aGlzLl9hZHZhbmNlKCkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NvbnN1bWVUZXh0KHRva2VuOiBIdG1sVG9rZW4pIHtcbiAgICBsZXQgdGV4dCA9IHRva2VuLnBhcnRzWzBdO1xuICAgIGlmICh0ZXh0Lmxlbmd0aCA+IDAgJiYgdGV4dFswXSA9PSAnXFxuJykge1xuICAgICAgbGV0IHBhcmVudCA9IHRoaXMuX2dldFBhcmVudEVsZW1lbnQoKTtcbiAgICAgIGlmIChpc1ByZXNlbnQocGFyZW50KSAmJiBwYXJlbnQuY2hpbGRyZW4ubGVuZ3RoID09IDAgJiZcbiAgICAgICAgICBnZXRIdG1sVGFnRGVmaW5pdGlvbihwYXJlbnQubmFtZSkuaWdub3JlRmlyc3RMZikge1xuICAgICAgICB0ZXh0ID0gdGV4dC5zdWJzdHJpbmcoMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRleHQubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fYWRkVG9QYXJlbnQobmV3IEh0bWxUZXh0QXN0KHRleHQsIHRva2VuLnNvdXJjZVNwYW4pKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jbG9zZVZvaWRFbGVtZW50KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmVsZW1lbnRTdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgZWwgPSBMaXN0V3JhcHBlci5sYXN0KHRoaXMuZWxlbWVudFN0YWNrKTtcblxuICAgICAgaWYgKGdldEh0bWxUYWdEZWZpbml0aW9uKGVsLm5hbWUpLmlzVm9pZCkge1xuICAgICAgICB0aGlzLmVsZW1lbnRTdGFjay5wb3AoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jb25zdW1lU3RhcnRUYWcoc3RhcnRUYWdUb2tlbjogSHRtbFRva2VuKSB7XG4gICAgdmFyIHByZWZpeCA9IHN0YXJ0VGFnVG9rZW4ucGFydHNbMF07XG4gICAgdmFyIG5hbWUgPSBzdGFydFRhZ1Rva2VuLnBhcnRzWzFdO1xuICAgIHZhciBhdHRycyA9IFtdO1xuICAgIHdoaWxlICh0aGlzLnBlZWsudHlwZSA9PT0gSHRtbFRva2VuVHlwZS5BVFRSX05BTUUpIHtcbiAgICAgIGF0dHJzLnB1c2godGhpcy5fY29uc3VtZUF0dHIodGhpcy5fYWR2YW5jZSgpKSk7XG4gICAgfVxuICAgIHZhciBmdWxsTmFtZSA9IGdldEVsZW1lbnRGdWxsTmFtZShwcmVmaXgsIG5hbWUsIHRoaXMuX2dldFBhcmVudEVsZW1lbnQoKSk7XG4gICAgdmFyIHNlbGZDbG9zaW5nID0gZmFsc2U7XG4gICAgLy8gTm90ZTogVGhlcmUgY291bGQgaGF2ZSBiZWVuIGEgdG9rZW5pemVyIGVycm9yXG4gICAgLy8gc28gdGhhdCB3ZSBkb24ndCBnZXQgYSB0b2tlbiBmb3IgdGhlIGVuZCB0YWcuLi5cbiAgICBpZiAodGhpcy5wZWVrLnR5cGUgPT09IEh0bWxUb2tlblR5cGUuVEFHX09QRU5fRU5EX1ZPSUQpIHtcbiAgICAgIHRoaXMuX2FkdmFuY2UoKTtcbiAgICAgIHNlbGZDbG9zaW5nID0gdHJ1ZTtcbiAgICAgIGlmIChnZXROc1ByZWZpeChmdWxsTmFtZSkgPT0gbnVsbCAmJiAhZ2V0SHRtbFRhZ0RlZmluaXRpb24oZnVsbE5hbWUpLmlzVm9pZCkge1xuICAgICAgICB0aGlzLmVycm9ycy5wdXNoKEh0bWxUcmVlRXJyb3IuY3JlYXRlKFxuICAgICAgICAgICAgZnVsbE5hbWUsIHN0YXJ0VGFnVG9rZW4uc291cmNlU3BhbixcbiAgICAgICAgICAgIGBPbmx5IHZvaWQgYW5kIGZvcmVpZ24gZWxlbWVudHMgY2FuIGJlIHNlbGYgY2xvc2VkIFwiJHtzdGFydFRhZ1Rva2VuLnBhcnRzWzFdfVwiYCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5wZWVrLnR5cGUgPT09IEh0bWxUb2tlblR5cGUuVEFHX09QRU5fRU5EKSB7XG4gICAgICB0aGlzLl9hZHZhbmNlKCk7XG4gICAgICBzZWxmQ2xvc2luZyA9IGZhbHNlO1xuICAgIH1cbiAgICB2YXIgZW5kID0gdGhpcy5wZWVrLnNvdXJjZVNwYW4uc3RhcnQ7XG4gICAgbGV0IHNwYW4gPSBuZXcgUGFyc2VTb3VyY2VTcGFuKHN0YXJ0VGFnVG9rZW4uc291cmNlU3Bhbi5zdGFydCwgZW5kKTtcbiAgICB2YXIgZWwgPSBuZXcgSHRtbEVsZW1lbnRBc3QoZnVsbE5hbWUsIGF0dHJzLCBbXSwgc3Bhbiwgc3BhbiwgbnVsbCk7XG4gICAgdGhpcy5fcHVzaEVsZW1lbnQoZWwpO1xuICAgIGlmIChzZWxmQ2xvc2luZykge1xuICAgICAgdGhpcy5fcG9wRWxlbWVudChmdWxsTmFtZSk7XG4gICAgICBlbC5lbmRTb3VyY2VTcGFuID0gc3BhbjtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9wdXNoRWxlbWVudChlbDogSHRtbEVsZW1lbnRBc3QpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50U3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgdmFyIHBhcmVudEVsID0gTGlzdFdyYXBwZXIubGFzdCh0aGlzLmVsZW1lbnRTdGFjayk7XG4gICAgICBpZiAoZ2V0SHRtbFRhZ0RlZmluaXRpb24ocGFyZW50RWwubmFtZSkuaXNDbG9zZWRCeUNoaWxkKGVsLm5hbWUpKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudFN0YWNrLnBvcCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciB0YWdEZWYgPSBnZXRIdG1sVGFnRGVmaW5pdGlvbihlbC5uYW1lKTtcbiAgICB2YXIgcGFyZW50RWwgPSB0aGlzLl9nZXRQYXJlbnRFbGVtZW50KCk7XG4gICAgaWYgKHRhZ0RlZi5yZXF1aXJlRXh0cmFQYXJlbnQoaXNQcmVzZW50KHBhcmVudEVsKSA/IHBhcmVudEVsLm5hbWUgOiBudWxsKSkge1xuICAgICAgdmFyIG5ld1BhcmVudCA9IG5ldyBIdG1sRWxlbWVudEFzdCh0YWdEZWYucGFyZW50VG9BZGQsIFtdLCBbZWxdLCBlbC5zb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbC5zdGFydFNvdXJjZVNwYW4sIGVsLmVuZFNvdXJjZVNwYW4pO1xuICAgICAgdGhpcy5fYWRkVG9QYXJlbnQobmV3UGFyZW50KTtcbiAgICAgIHRoaXMuZWxlbWVudFN0YWNrLnB1c2gobmV3UGFyZW50KTtcbiAgICAgIHRoaXMuZWxlbWVudFN0YWNrLnB1c2goZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9hZGRUb1BhcmVudChlbCk7XG4gICAgICB0aGlzLmVsZW1lbnRTdGFjay5wdXNoKGVsKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jb25zdW1lRW5kVGFnKGVuZFRhZ1Rva2VuOiBIdG1sVG9rZW4pIHtcbiAgICB2YXIgZnVsbE5hbWUgPVxuICAgICAgICBnZXRFbGVtZW50RnVsbE5hbWUoZW5kVGFnVG9rZW4ucGFydHNbMF0sIGVuZFRhZ1Rva2VuLnBhcnRzWzFdLCB0aGlzLl9nZXRQYXJlbnRFbGVtZW50KCkpO1xuXG4gICAgdGhpcy5fZ2V0UGFyZW50RWxlbWVudCgpLmVuZFNvdXJjZVNwYW4gPSBlbmRUYWdUb2tlbi5zb3VyY2VTcGFuO1xuXG4gICAgaWYgKGdldEh0bWxUYWdEZWZpbml0aW9uKGZ1bGxOYW1lKS5pc1ZvaWQpIHtcbiAgICAgIHRoaXMuZXJyb3JzLnB1c2goXG4gICAgICAgICAgSHRtbFRyZWVFcnJvci5jcmVhdGUoZnVsbE5hbWUsIGVuZFRhZ1Rva2VuLnNvdXJjZVNwYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFZvaWQgZWxlbWVudHMgZG8gbm90IGhhdmUgZW5kIHRhZ3MgXCIke2VuZFRhZ1Rva2VuLnBhcnRzWzFdfVwiYCkpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuX3BvcEVsZW1lbnQoZnVsbE5hbWUpKSB7XG4gICAgICB0aGlzLmVycm9ycy5wdXNoKEh0bWxUcmVlRXJyb3IuY3JlYXRlKGZ1bGxOYW1lLCBlbmRUYWdUb2tlbi5zb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgVW5leHBlY3RlZCBjbG9zaW5nIHRhZyBcIiR7ZW5kVGFnVG9rZW4ucGFydHNbMV19XCJgKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfcG9wRWxlbWVudChmdWxsTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgZm9yIChsZXQgc3RhY2tJbmRleCA9IHRoaXMuZWxlbWVudFN0YWNrLmxlbmd0aCAtIDE7IHN0YWNrSW5kZXggPj0gMDsgc3RhY2tJbmRleC0tKSB7XG4gICAgICBsZXQgZWwgPSB0aGlzLmVsZW1lbnRTdGFja1tzdGFja0luZGV4XTtcbiAgICAgIGlmIChlbC5uYW1lID09IGZ1bGxOYW1lKSB7XG4gICAgICAgIExpc3RXcmFwcGVyLnNwbGljZSh0aGlzLmVsZW1lbnRTdGFjaywgc3RhY2tJbmRleCwgdGhpcy5lbGVtZW50U3RhY2subGVuZ3RoIC0gc3RhY2tJbmRleCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWdldEh0bWxUYWdEZWZpbml0aW9uKGVsLm5hbWUpLmNsb3NlZEJ5UGFyZW50KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZUF0dHIoYXR0ck5hbWU6IEh0bWxUb2tlbik6IEh0bWxBdHRyQXN0IHtcbiAgICB2YXIgZnVsbE5hbWUgPSBtZXJnZU5zQW5kTmFtZShhdHRyTmFtZS5wYXJ0c1swXSwgYXR0ck5hbWUucGFydHNbMV0pO1xuICAgIHZhciBlbmQgPSBhdHRyTmFtZS5zb3VyY2VTcGFuLmVuZDtcbiAgICB2YXIgdmFsdWUgPSAnJztcbiAgICBpZiAodGhpcy5wZWVrLnR5cGUgPT09IEh0bWxUb2tlblR5cGUuQVRUUl9WQUxVRSkge1xuICAgICAgdmFyIHZhbHVlVG9rZW4gPSB0aGlzLl9hZHZhbmNlKCk7XG4gICAgICB2YWx1ZSA9IHZhbHVlVG9rZW4ucGFydHNbMF07XG4gICAgICBlbmQgPSB2YWx1ZVRva2VuLnNvdXJjZVNwYW4uZW5kO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEh0bWxBdHRyQXN0KGZ1bGxOYW1lLCB2YWx1ZSwgbmV3IFBhcnNlU291cmNlU3BhbihhdHRyTmFtZS5zb3VyY2VTcGFuLnN0YXJ0LCBlbmQpKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFBhcmVudEVsZW1lbnQoKTogSHRtbEVsZW1lbnRBc3Qge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnRTdGFjay5sZW5ndGggPiAwID8gTGlzdFdyYXBwZXIubGFzdCh0aGlzLmVsZW1lbnRTdGFjaykgOiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBfYWRkVG9QYXJlbnQobm9kZTogSHRtbEFzdCkge1xuICAgIHZhciBwYXJlbnQgPSB0aGlzLl9nZXRQYXJlbnRFbGVtZW50KCk7XG4gICAgaWYgKGlzUHJlc2VudChwYXJlbnQpKSB7XG4gICAgICBwYXJlbnQuY2hpbGRyZW4ucHVzaChub2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yb290Tm9kZXMucHVzaChub2RlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RWxlbWVudEZ1bGxOYW1lKHByZWZpeDogc3RyaW5nLCBsb2NhbE5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRFbGVtZW50OiBIdG1sRWxlbWVudEFzdCk6IHN0cmluZyB7XG4gIGlmIChpc0JsYW5rKHByZWZpeCkpIHtcbiAgICBwcmVmaXggPSBnZXRIdG1sVGFnRGVmaW5pdGlvbihsb2NhbE5hbWUpLmltcGxpY2l0TmFtZXNwYWNlUHJlZml4O1xuICAgIGlmIChpc0JsYW5rKHByZWZpeCkgJiYgaXNQcmVzZW50KHBhcmVudEVsZW1lbnQpKSB7XG4gICAgICBwcmVmaXggPSBnZXROc1ByZWZpeChwYXJlbnRFbGVtZW50Lm5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtZXJnZU5zQW5kTmFtZShwcmVmaXgsIGxvY2FsTmFtZSk7XG59XG5cbmZ1bmN0aW9uIGxhc3RPblN0YWNrKHN0YWNrOiBhbnlbXSwgZWxlbWVudDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiBzdGFjay5sZW5ndGggPiAwICYmIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdID09PSBlbGVtZW50O1xufSJdfQ==