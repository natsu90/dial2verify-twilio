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
var compiler_1 = require('angular2/compiler');
var ast_1 = require('angular2/src/compiler/expression_parser/ast');
var exceptions_1 = require('angular2/src/facade/exceptions');
var core_1 = require('angular2/core');
var parser_1 = require('angular2/src/compiler/expression_parser/parser');
/**
 * e.g., './User', 'Modal' in ./User[Modal(param: value)]
 */
var FixedPart = (function () {
    function FixedPart(value) {
        this.value = value;
    }
    return FixedPart;
}());
/**
 * The square bracket
 */
var AuxiliaryStart = (function () {
    function AuxiliaryStart() {
    }
    return AuxiliaryStart;
}());
/**
 * The square bracket
 */
var AuxiliaryEnd = (function () {
    function AuxiliaryEnd() {
    }
    return AuxiliaryEnd;
}());
/**
 * e.g., param:value in ./User[Modal(param: value)]
 */
var Params = (function () {
    function Params(ast) {
        this.ast = ast;
    }
    return Params;
}());
var RouterLinkLexer = (function () {
    function RouterLinkLexer(parser, exp) {
        this.parser = parser;
        this.exp = exp;
        this.index = 0;
    }
    RouterLinkLexer.prototype.tokenize = function () {
        var tokens = [];
        while (this.index < this.exp.length) {
            tokens.push(this._parseToken());
        }
        return tokens;
    };
    RouterLinkLexer.prototype._parseToken = function () {
        var c = this.exp[this.index];
        if (c == '[') {
            this.index++;
            return new AuxiliaryStart();
        }
        else if (c == ']') {
            this.index++;
            return new AuxiliaryEnd();
        }
        else if (c == '(') {
            return this._parseParams();
        }
        else if (c == '/' && this.index !== 0) {
            this.index++;
            return this._parseFixedPart();
        }
        else {
            return this._parseFixedPart();
        }
    };
    RouterLinkLexer.prototype._parseParams = function () {
        var start = this.index;
        for (; this.index < this.exp.length; ++this.index) {
            var c = this.exp[this.index];
            if (c == ')') {
                var paramsContent = this.exp.substring(start + 1, this.index);
                this.index++;
                return new Params(this.parser.parseBinding("{" + paramsContent + "}", null).ast);
            }
        }
        throw new exceptions_1.BaseException("Cannot find ')'");
    };
    RouterLinkLexer.prototype._parseFixedPart = function () {
        var start = this.index;
        var sawNonSlash = false;
        for (; this.index < this.exp.length; ++this.index) {
            var c = this.exp[this.index];
            if (c == '(' || c == '[' || c == ']' || (c == '/' && sawNonSlash)) {
                break;
            }
            if (c != '.' && c != '/') {
                sawNonSlash = true;
            }
        }
        var fixed = this.exp.substring(start, this.index);
        if (start === this.index || !sawNonSlash || fixed.startsWith('//')) {
            throw new exceptions_1.BaseException("Invalid router link");
        }
        return new FixedPart(fixed);
    };
    return RouterLinkLexer;
}());
var RouterLinkAstGenerator = (function () {
    function RouterLinkAstGenerator(tokens) {
        this.tokens = tokens;
        this.index = 0;
    }
    RouterLinkAstGenerator.prototype.generate = function () { return this._genAuxiliary(); };
    RouterLinkAstGenerator.prototype._genAuxiliary = function () {
        var arr = [];
        for (; this.index < this.tokens.length; this.index++) {
            var r = this.tokens[this.index];
            if (r instanceof FixedPart) {
                arr.push(new ast_1.LiteralPrimitive(r.value));
            }
            else if (r instanceof Params) {
                arr.push(r.ast);
            }
            else if (r instanceof AuxiliaryEnd) {
                break;
            }
            else if (r instanceof AuxiliaryStart) {
                this.index++;
                arr.push(this._genAuxiliary());
            }
        }
        return new ast_1.LiteralArray(arr);
    };
    return RouterLinkAstGenerator;
}());
var RouterLinkAstTransformer = (function (_super) {
    __extends(RouterLinkAstTransformer, _super);
    function RouterLinkAstTransformer(parser) {
        _super.call(this);
        this.parser = parser;
    }
    RouterLinkAstTransformer.prototype.visitQuote = function (ast, context) {
        if (ast.prefix == "route") {
            return parseRouterLinkExpression(this.parser, ast.uninterpretedExpression);
        }
        else {
            return _super.prototype.visitQuote.call(this, ast, context);
        }
    };
    return RouterLinkAstTransformer;
}(ast_1.AstTransformer));
function parseRouterLinkExpression(parser, exp) {
    var tokens = new RouterLinkLexer(parser, exp.trim()).tokenize();
    return new RouterLinkAstGenerator(tokens).generate();
}
exports.parseRouterLinkExpression = parseRouterLinkExpression;
/**
 * A compiler plugin that implements the router link DSL.
 */
var RouterLinkTransform = (function () {
    function RouterLinkTransform(parser) {
        this.astTransformer = new RouterLinkAstTransformer(parser);
    }
    RouterLinkTransform.prototype.visitNgContent = function (ast, context) { return ast; };
    RouterLinkTransform.prototype.visitEmbeddedTemplate = function (ast, context) { return ast; };
    RouterLinkTransform.prototype.visitElement = function (ast, context) {
        var _this = this;
        var updatedChildren = ast.children.map(function (c) { return c.visit(_this, context); });
        var updatedInputs = ast.inputs.map(function (c) { return c.visit(_this, context); });
        var updatedDirectives = ast.directives.map(function (c) { return c.visit(_this, context); });
        return new compiler_1.ElementAst(ast.name, ast.attrs, updatedInputs, ast.outputs, ast.exportAsVars, updatedDirectives, ast.providers, ast.hasViewContainer, updatedChildren, ast.ngContentIndex, ast.sourceSpan);
    };
    RouterLinkTransform.prototype.visitVariable = function (ast, context) { return ast; };
    RouterLinkTransform.prototype.visitEvent = function (ast, context) { return ast; };
    RouterLinkTransform.prototype.visitElementProperty = function (ast, context) { return ast; };
    RouterLinkTransform.prototype.visitAttr = function (ast, context) { return ast; };
    RouterLinkTransform.prototype.visitBoundText = function (ast, context) { return ast; };
    RouterLinkTransform.prototype.visitText = function (ast, context) { return ast; };
    RouterLinkTransform.prototype.visitDirective = function (ast, context) {
        var _this = this;
        var updatedInputs = ast.inputs.map(function (c) { return c.visit(_this, context); });
        return new compiler_1.DirectiveAst(ast.directive, updatedInputs, ast.hostProperties, ast.hostEvents, ast.exportAsVars, ast.sourceSpan);
    };
    RouterLinkTransform.prototype.visitDirectiveProperty = function (ast, context) {
        var transformedValue = ast.value.visit(this.astTransformer);
        return new compiler_1.BoundDirectivePropertyAst(ast.directiveName, ast.templateName, transformedValue, ast.sourceSpan);
    };
    RouterLinkTransform = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [parser_1.Parser])
    ], RouterLinkTransform);
    return RouterLinkTransform;
}());
exports.RouterLinkTransform = RouterLinkTransform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX2xpbmtfdHJhbnNmb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC00bm8zWlF2Ty50bXAvYW5ndWxhcjIvc3JjL3JvdXRlci9kaXJlY3RpdmVzL3JvdXRlcl9saW5rX3RyYW5zZm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5QkFNTyxtQkFBbUIsQ0FBQyxDQUFBO0FBQzNCLG9CQVFPLDZDQUE2QyxDQUFDLENBQUE7QUFDckQsMkJBQTRCLGdDQUFnQyxDQUFDLENBQUE7QUFDN0QscUJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBQ3pDLHVCQUFxQixnREFBZ0QsQ0FBQyxDQUFBO0FBRXRFOztHQUVHO0FBQ0g7SUFDRSxtQkFBbUIsS0FBYTtRQUFiLFVBQUssR0FBTCxLQUFLLENBQVE7SUFBRyxDQUFDO0lBQ3RDLGdCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFFRDs7R0FFRztBQUNIO0lBQ0U7SUFBZSxDQUFDO0lBQ2xCLHFCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFFRDs7R0FFRztBQUNIO0lBQ0U7SUFBZSxDQUFDO0lBQ2xCLG1CQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFFRDs7R0FFRztBQUNIO0lBQ0UsZ0JBQW1CLEdBQVE7UUFBUixRQUFHLEdBQUgsR0FBRyxDQUFLO0lBQUcsQ0FBQztJQUNqQyxhQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFFRDtJQUdFLHlCQUFvQixNQUFjLEVBQVUsR0FBVztRQUFuQyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUZ2RCxVQUFLLEdBQVcsQ0FBQyxDQUFDO0lBRXdDLENBQUM7SUFFM0Qsa0NBQVEsR0FBUjtRQUNFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdB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QUFJLE9BQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFJLEVBQUUsT0FBTyxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQztRQUNoRSxNQUFNLENBQUMsSUFBSSx1QkFBWSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLEdBQUcsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLFVBQVUsRUFDaEUsR0FBRyxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVELG9EQUFzQixHQUF0QixVQUF1QixHQUE4QixFQUFFLE9BQVk7UUFDakUsSUFBSSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUQsTUFBTSxDQUFDLElBQUksb0NBQXlCLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsWUFBWSxFQUFFLGdCQUFnQixFQUNyRCxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQXpDSDtRQUFDLGlCQUFVLEVBQUU7OzJCQUFBO0lBMENiLDBCQUFDO0FBQUQsQ0FBQyxBQXpDRCxJQXlDQztBQXpDWSwyQkFBbUIsc0JBeUMvQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgVGVtcGxhdGVBc3RWaXNpdG9yLFxuICBFbGVtZW50QXN0LFxuICBCb3VuZERpcmVjdGl2ZVByb3BlcnR5QXN0LFxuICBEaXJlY3RpdmVBc3QsXG4gIEJvdW5kRWxlbWVudFByb3BlcnR5QXN0XG59IGZyb20gJ2FuZ3VsYXIyL2NvbXBpbGVyJztcbmltcG9ydCB7XG4gIEFzdFRyYW5zZm9ybWVyLFxuICBRdW90ZSxcbiAgQVNULFxuICBFbXB0eUV4cHIsXG4gIExpdGVyYWxBcnJheSxcbiAgTGl0ZXJhbFByaW1pdGl2ZSxcbiAgQVNUV2l0aFNvdXJjZVxufSBmcm9tICdhbmd1bGFyMi9zcmMvY29tcGlsZXIvZXhwcmVzc2lvbl9wYXJzZXIvYXN0JztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5pbXBvcnQge1BhcnNlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL2V4cHJlc3Npb25fcGFyc2VyL3BhcnNlcic7XG5cbi8qKlxuICogZS5nLiwgJy4vVXNlcicsICdNb2RhbCcgaW4gLi9Vc2VyW01vZGFsKHBhcmFtOiB2YWx1ZSldXG4gKi9cbmNsYXNzIEZpeGVkUGFydCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogc3RyaW5nKSB7fVxufVxuXG4vKipcbiAqIFRoZSBzcXVhcmUgYnJhY2tldFxuICovXG5jbGFzcyBBdXhpbGlhcnlTdGFydCB7XG4gIGNvbnN0cnVjdG9yKCkge31cbn1cblxuLyoqXG4gKiBUaGUgc3F1YXJlIGJyYWNrZXRcbiAqL1xuY2xhc3MgQXV4aWxpYXJ5RW5kIHtcbiAgY29uc3RydWN0b3IoKSB7fVxufVxuXG4vKipcbiAqIGUuZy4sIHBhcmFtOnZhbHVlIGluIC4vVXNlcltNb2RhbChwYXJhbTogdmFsdWUpXVxuICovXG5jbGFzcyBQYXJhbXMge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgYXN0OiBBU1QpIHt9XG59XG5cbmNsYXNzIFJvdXRlckxpbmtMZXhlciB7XG4gIGluZGV4OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFyc2VyOiBQYXJzZXIsIHByaXZhdGUgZXhwOiBzdHJpbmcpIHt9XG5cbiAgdG9rZW5pemUoKTogQXJyYXk8Rml4ZWRQYXJ0IHwgQXV4aWxpYXJ5U3RhcnQgfCBBdXhpbGlhcnlFbmQgfCBQYXJhbXM+IHtcbiAgICBsZXQgdG9rZW5zID0gW107XG4gICAgd2hpbGUgKHRoaXMuaW5kZXggPCB0aGlzLmV4cC5sZW5ndGgpIHtcbiAgICAgIHRva2Vucy5wdXNoKHRoaXMuX3BhcnNlVG9rZW4oKSk7XG4gICAgfVxuICAgIHJldHVybiB0b2tlbnM7XG4gIH1cblxuICBwcml2YXRlIF9wYXJzZVRva2VuKCkge1xuICAgIGxldCBjID0gdGhpcy5leHBbdGhpcy5pbmRleF07XG4gICAgaWYgKGMgPT0gJ1snKSB7XG4gICAgICB0aGlzLmluZGV4Kys7XG4gICAgICByZXR1cm4gbmV3IEF1eGlsaWFyeVN0YXJ0KCk7XG5cbiAgICB9IGVsc2UgaWYgKGMgPT0gJ10nKSB7XG4gICAgICB0aGlzLmluZGV4Kys7XG4gICAgICByZXR1cm4gbmV3IEF1eGlsaWFyeUVuZCgpO1xuXG4gICAgfSBlbHNlIGlmIChjID09ICcoJykge1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcnNlUGFyYW1zKCk7XG5cbiAgICB9IGVsc2UgaWYgKGMgPT0gJy8nICYmIHRoaXMuaW5kZXggIT09IDApIHtcbiAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgIHJldHVybiB0aGlzLl9wYXJzZUZpeGVkUGFydCgpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJzZUZpeGVkUGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3BhcnNlUGFyYW1zKCkge1xuICAgIGxldCBzdGFydCA9IHRoaXMuaW5kZXg7XG4gICAgZm9yICg7IHRoaXMuaW5kZXggPCB0aGlzLmV4cC5sZW5ndGg7ICsrdGhpcy5pbmRleCkge1xuICAgICAgbGV0IGMgPSB0aGlzLmV4cFt0aGlzLmluZGV4XTtcbiAgICAgIGlmIChjID09ICcpJykge1xuICAgICAgICBsZXQgcGFyYW1zQ29udGVudCA9IHRoaXMuZXhwLnN1YnN0cmluZyhzdGFydCArIDEsIHRoaXMuaW5kZXgpO1xuICAgICAgICB0aGlzLmluZGV4Kys7XG4gICAgICAgIHJldHVybiBuZXcgUGFyYW1zKHRoaXMucGFyc2VyLnBhcnNlQmluZGluZyhgeyR7cGFyYW1zQ29udGVudH19YCwgbnVsbCkuYXN0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXCJDYW5ub3QgZmluZCAnKSdcIik7XG4gIH1cblxuICBwcml2YXRlIF9wYXJzZUZpeGVkUGFydCgpIHtcbiAgICBsZXQgc3RhcnQgPSB0aGlzLmluZGV4O1xuICAgIGxldCBzYXdOb25TbGFzaCA9IGZhbHNlO1xuXG5cbiAgICBmb3IgKDsgdGhpcy5pbmRleCA8IHRoaXMuZXhwLmxlbmd0aDsgKyt0aGlzLmluZGV4KSB7XG4gICAgICBsZXQgYyA9IHRoaXMuZXhwW3RoaXMuaW5kZXhdO1xuXG4gICAgICBpZiAoYyA9PSAnKCcgfHwgYyA9PSAnWycgfHwgYyA9PSAnXScgfHwgKGMgPT0gJy8nICYmIHNhd05vblNsYXNoKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgaWYgKGMgIT0gJy4nICYmIGMgIT0gJy8nKSB7XG4gICAgICAgIHNhd05vblNsYXNoID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgZml4ZWQgPSB0aGlzLmV4cC5zdWJzdHJpbmcoc3RhcnQsIHRoaXMuaW5kZXgpO1xuXG4gICAgaWYgKHN0YXJ0ID09PSB0aGlzLmluZGV4IHx8ICFzYXdOb25TbGFzaCB8fCBmaXhlZC5zdGFydHNXaXRoKCcvLycpKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihcIkludmFsaWQgcm91dGVyIGxpbmtcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBGaXhlZFBhcnQoZml4ZWQpO1xuICB9XG59XG5cbmNsYXNzIFJvdXRlckxpbmtBc3RHZW5lcmF0b3Ige1xuICBpbmRleDogbnVtYmVyID0gMDtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSB0b2tlbnM6IGFueVtdKSB7fVxuXG4gIGdlbmVyYXRlKCk6IEFTVCB7IHJldHVybiB0aGlzLl9nZW5BdXhpbGlhcnkoKTsgfVxuXG4gIHByaXZhdGUgX2dlbkF1eGlsaWFyeSgpOiBBU1Qge1xuICAgIGxldCBhcnIgPSBbXTtcbiAgICBmb3IgKDsgdGhpcy5pbmRleCA8IHRoaXMudG9rZW5zLmxlbmd0aDsgdGhpcy5pbmRleCsrKSB7XG4gICAgICBsZXQgciA9IHRoaXMudG9rZW5zW3RoaXMuaW5kZXhdO1xuXG4gICAgICBpZiAociBpbnN0YW5jZW9mIEZpeGVkUGFydCkge1xuICAgICAgICBhcnIucHVzaChuZXcgTGl0ZXJhbFByaW1pdGl2ZShyLnZhbHVlKSk7XG5cbiAgICAgIH0gZWxzZSBpZiAociBpbnN0YW5jZW9mIFBhcmFtcykge1xuICAgICAgICBhcnIucHVzaChyLmFzdCk7XG5cbiAgICAgIH0gZWxzZSBpZiAociBpbnN0YW5jZW9mIEF1eGlsaWFyeUVuZCkge1xuICAgICAgICBicmVhaztcblxuICAgICAgfSBlbHNlIGlmIChyIGluc3RhbmNlb2YgQXV4aWxpYXJ5U3RhcnQpIHtcbiAgICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgICBhcnIucHVzaCh0aGlzLl9nZW5BdXhpbGlhcnkoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBMaXRlcmFsQXJyYXkoYXJyKTtcbiAgfVxufVxuXG5jbGFzcyBSb3V0ZXJMaW5rQXN0VHJhbnNmb3JtZXIgZXh0ZW5kcyBBc3RUcmFuc2Zvcm1lciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFyc2VyOiBQYXJzZXIpIHsgc3VwZXIoKTsgfVxuXG4gIHZpc2l0UXVvdGUoYXN0OiBRdW90ZSwgY29udGV4dDogYW55KTogQVNUIHtcbiAgICBpZiAoYXN0LnByZWZpeCA9PSBcInJvdXRlXCIpIHtcbiAgICAgIHJldHVybiBwYXJzZVJvdXRlckxpbmtFeHByZXNzaW9uKHRoaXMucGFyc2VyLCBhc3QudW5pbnRlcnByZXRlZEV4cHJlc3Npb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3VwZXIudmlzaXRRdW90ZShhc3QsIGNvbnRleHQpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VSb3V0ZXJMaW5rRXhwcmVzc2lvbihwYXJzZXI6IFBhcnNlciwgZXhwOiBzdHJpbmcpOiBBU1Qge1xuICBsZXQgdG9rZW5zID0gbmV3IFJvdXRlckxpbmtMZXhlcihwYXJzZXIsIGV4cC50cmltKCkpLnRva2VuaXplKCk7XG4gIHJldHVybiBuZXcgUm91dGVyTGlua0FzdEdlbmVyYXRvcih0b2tlbnMpLmdlbmVyYXRlKCk7XG59XG5cbi8qKlxuICogQSBjb21waWxlciBwbHVnaW4gdGhhdCBpbXBsZW1lbnRzIHRoZSByb3V0ZXIgbGluayBEU0wuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBSb3V0ZXJMaW5rVHJhbnNmb3JtIGltcGxlbWVudHMgVGVtcGxhdGVBc3RWaXNpdG9yIHtcbiAgcHJpdmF0ZSBhc3RUcmFuc2Zvcm1lcjtcblxuICBjb25zdHJ1Y3RvcihwYXJzZXI6IFBhcnNlcikgeyB0aGlzLmFzdFRyYW5zZm9ybWVyID0gbmV3IFJvdXRlckxpbmtBc3RUcmFuc2Zvcm1lcihwYXJzZXIpOyB9XG5cbiAgdmlzaXROZ0NvbnRlbnQoYXN0OiBhbnksIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBhc3Q7IH1cblxuICB2aXNpdEVtYmVkZGVkVGVtcGxhdGUoYXN0OiBhbnksIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBhc3Q7IH1cblxuICB2aXNpdEVsZW1lbnQoYXN0OiBFbGVtZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGxldCB1cGRhdGVkQ2hpbGRyZW4gPSBhc3QuY2hpbGRyZW4ubWFwKGMgPT4gYy52aXNpdCh0aGlzLCBjb250ZXh0KSk7XG4gICAgbGV0IHVwZGF0ZWRJbnB1dHMgPSBhc3QuaW5wdXRzLm1hcChjID0+IGMudmlzaXQodGhpcywgY29udGV4dCkpO1xuICAgIGxldCB1cGRhdGVkRGlyZWN0aXZlcyA9IGFzdC5kaXJlY3RpdmVzLm1hcChjID0+IGMudmlzaXQodGhpcywgY29udGV4dCkpO1xuICAgIHJldHVybiBuZXcgRWxlbWVudEFzdChhc3QubmFtZSwgYXN0LmF0dHJzLCB1cGRhdGVkSW5wdXRzLCBhc3Qub3V0cHV0cywgYXN0LmV4cG9ydEFzVmFycyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlZERpcmVjdGl2ZXMsIGFzdC5wcm92aWRlcnMsIGFzdC5oYXNWaWV3Q29udGFpbmVyLCB1cGRhdGVkQ2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFzdC5uZ0NvbnRlbnRJbmRleCwgYXN0LnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgdmlzaXRWYXJpYWJsZShhc3Q6IGFueSwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIGFzdDsgfVxuXG4gIHZpc2l0RXZlbnQoYXN0OiBhbnksIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBhc3Q7IH1cblxuICB2aXNpdEVsZW1lbnRQcm9wZXJ0eShhc3Q6IGFueSwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIGFzdDsgfVxuXG4gIHZpc2l0QXR0cihhc3Q6IGFueSwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIGFzdDsgfVxuXG4gIHZpc2l0Qm91bmRUZXh0KGFzdDogYW55LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gYXN0OyB9XG5cbiAgdmlzaXRUZXh0KGFzdDogYW55LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gYXN0OyB9XG5cbiAgdmlzaXREaXJlY3RpdmUoYXN0OiBEaXJlY3RpdmVBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgbGV0IHVwZGF0ZWRJbnB1dHMgPSBhc3QuaW5wdXRzLm1hcChjID0+IGMudmlzaXQodGhpcywgY29udGV4dCkpO1xuICAgIHJldHVybiBuZXcgRGlyZWN0aXZlQXN0KGFzdC5kaXJlY3RpdmUsIHVwZGF0ZWRJbnB1dHMsIGFzdC5ob3N0UHJvcGVydGllcywgYXN0Lmhvc3RFdmVudHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN0LmV4cG9ydEFzVmFycywgYXN0LnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgdmlzaXREaXJlY3RpdmVQcm9wZXJ0eShhc3Q6IEJvdW5kRGlyZWN0aXZlUHJvcGVydHlBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgbGV0IHRyYW5zZm9ybWVkVmFsdWUgPSBhc3QudmFsdWUudmlzaXQodGhpcy5hc3RUcmFuc2Zvcm1lcik7XG4gICAgcmV0dXJuIG5ldyBCb3VuZERpcmVjdGl2ZVByb3BlcnR5QXN0KGFzdC5kaXJlY3RpdmVOYW1lLCBhc3QudGVtcGxhdGVOYW1lLCB0cmFuc2Zvcm1lZFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3Quc291cmNlU3Bhbik7XG4gIH1cbn0iXX0=