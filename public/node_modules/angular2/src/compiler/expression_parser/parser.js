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
var decorators_1 = require('angular2/src/core/di/decorators');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var collection_1 = require('angular2/src/facade/collection');
var lexer_1 = require('./lexer');
var ast_1 = require('./ast');
var _implicitReceiver = new ast_1.ImplicitReceiver();
// TODO(tbosch): Cannot make this const/final right now because of the transpiler...
var INTERPOLATION_REGEXP = /\{\{([\s\S]*?)\}\}/g;
var ParseException = (function (_super) {
    __extends(ParseException, _super);
    function ParseException(message, input, errLocation, ctxLocation) {
        _super.call(this, "Parser Error: " + message + " " + errLocation + " [" + input + "] in " + ctxLocation);
    }
    return ParseException;
}(exceptions_1.BaseException));
var SplitInterpolation = (function () {
    function SplitInterpolation(strings, expressions) {
        this.strings = strings;
        this.expressions = expressions;
    }
    return SplitInterpolation;
}());
exports.SplitInterpolation = SplitInterpolation;
var Parser = (function () {
    function Parser(/** @internal */ _lexer) {
        this._lexer = _lexer;
    }
    Parser.prototype.parseAction = function (input, location) {
        this._checkNoInterpolation(input, location);
        var tokens = this._lexer.tokenize(this._stripComments(input));
        var ast = new _ParseAST(input, location, tokens, true).parseChain();
        return new ast_1.ASTWithSource(ast, input, location);
    };
    Parser.prototype.parseBinding = function (input, location) {
        var ast = this._parseBindingAst(input, location);
        return new ast_1.ASTWithSource(ast, input, location);
    };
    Parser.prototype.parseSimpleBinding = function (input, location) {
        var ast = this._parseBindingAst(input, location);
        if (!SimpleExpressionChecker.check(ast)) {
            throw new ParseException('Host binding expression can only contain field access and constants', input, location);
        }
        return new ast_1.ASTWithSource(ast, input, location);
    };
    Parser.prototype._parseBindingAst = function (input, location) {
        // Quotes expressions use 3rd-party expression language. We don't want to use
        // our lexer or parser for that, so we check for that ahead of time.
        var quote = this._parseQuote(input, location);
        if (lang_1.isPresent(quote)) {
            return quote;
        }
        this._checkNoInterpolation(input, location);
        var tokens = this._lexer.tokenize(this._stripComments(input));
        return new _ParseAST(input, location, tokens, false).parseChain();
    };
    Parser.prototype._parseQuote = function (input, location) {
        if (lang_1.isBlank(input))
            return null;
        var prefixSeparatorIndex = input.indexOf(':');
        if (prefixSeparatorIndex == -1)
            return null;
        var prefix = input.substring(0, prefixSeparatorIndex).trim();
        if (!lexer_1.isIdentifier(prefix))
            return null;
        var uninterpretedExpression = input.substring(prefixSeparatorIndex + 1);
        return new ast_1.Quote(prefix, uninterpretedExpression, location);
    };
    Parser.prototype.parseTemplateBindings = function (input, location) {
        var tokens = this._lexer.tokenize(input);
        return new _ParseAST(input, location, tokens, false).parseTemplateBindings();
    };
    Parser.prototype.parseInterpolation = function (input, location) {
        var split = this.splitInterpolation(input, location);
        if (split == null)
            return null;
        var expressions = [];
        for (var i = 0; i < split.expressions.length; ++i) {
            var tokens = this._lexer.tokenize(this._stripComments(split.expressions[i]));
            var ast = new _ParseAST(input, location, tokens, false).parseChain();
            expressions.push(ast);
        }
        return new ast_1.ASTWithSource(new ast_1.Interpolation(split.strings, expressions), input, location);
    };
    Parser.prototype.splitInterpolation = function (input, location) {
        var parts = lang_1.StringWrapper.split(input, INTERPOLATION_REGEXP);
        if (parts.length <= 1) {
            return null;
        }
        var strings = [];
        var expressions = [];
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            if (i % 2 === 0) {
                // fixed string
                strings.push(part);
            }
            else if (part.trim().length > 0) {
                expressions.push(part);
            }
            else {
                throw new ParseException('Blank expressions are not allowed in interpolated strings', input, "at column " + this._findInterpolationErrorColumn(parts, i) + " in", location);
            }
        }
        return new SplitInterpolation(strings, expressions);
    };
    Parser.prototype.wrapLiteralPrimitive = function (input, location) {
        return new ast_1.ASTWithSource(new ast_1.LiteralPrimitive(input), input, location);
    };
    Parser.prototype._stripComments = function (input) {
        var i = this._commentStart(input);
        return lang_1.isPresent(i) ? input.substring(0, i).trim() : input;
    };
    Parser.prototype._commentStart = function (input) {
        var outerQuote = null;
        for (var i = 0; i < input.length - 1; i++) {
            var char = lang_1.StringWrapper.charCodeAt(input, i);
            var nextChar = lang_1.StringWrapper.charCodeAt(input, i + 1);
            if (char === lexer_1.$SLASH && nextChar == lexer_1.$SLASH && lang_1.isBlank(outerQuote))
                return i;
            if (outerQuote === char) {
                outerQuote = null;
            }
            else if (lang_1.isBlank(outerQuote) && lexer_1.isQuote(char)) {
                outerQuote = char;
            }
        }
        return null;
    };
    Parser.prototype._checkNoInterpolation = function (input, location) {
        var parts = lang_1.StringWrapper.split(input, INTERPOLATION_REGEXP);
        if (parts.length > 1) {
            throw new ParseException('Got interpolation ({{}}) where expression was expected', input, "at column " + this._findInterpolationErrorColumn(parts, 1) + " in", location);
        }
    };
    Parser.prototype._findInterpolationErrorColumn = function (parts, partInErrIdx) {
        var errLocation = '';
        for (var j = 0; j < partInErrIdx; j++) {
            errLocation += j % 2 === 0 ? parts[j] : "{{" + parts[j] + "}}";
        }
        return errLocation.length;
    };
    Parser = __decorate([
        decorators_1.Injectable(), 
        __metadata('design:paramtypes', [lexer_1.Lexer])
    ], Parser);
    return Parser;
}());
exports.Parser = Parser;
var _ParseAST = (function () {
    function _ParseAST(input, location, tokens, parseAction) {
        this.input = input;
        this.location = location;
        this.tokens = tokens;
        this.parseAction = parseAction;
        this.index = 0;
    }
    _ParseAST.prototype.peek = function (offset) {
        var i = this.index + offset;
        return i < this.tokens.length ? this.tokens[i] : lexer_1.EOF;
    };
    Object.defineProperty(_ParseAST.prototype, "next", {
        get: function () { return this.peek(0); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_ParseAST.prototype, "inputIndex", {
        get: function () {
            return (this.index < this.tokens.length) ? this.next.index : this.input.length;
        },
        enumerable: true,
        configurable: true
    });
    _ParseAST.prototype.advance = function () { this.index++; };
    _ParseAST.prototype.optionalCharacter = function (code) {
        if (this.next.isCharacter(code)) {
            this.advance();
            return true;
        }
        else {
            return false;
        }
    };
    _ParseAST.prototype.optionalKeywordVar = function () {
        if (this.peekKeywordVar()) {
            this.advance();
            return true;
        }
        else {
            return false;
        }
    };
    _ParseAST.prototype.peekKeywordVar = function () { return this.next.isKeywordVar() || this.next.isOperator('#'); };
    _ParseAST.prototype.expectCharacter = function (code) {
        if (this.optionalCharacter(code))
            return;
        this.error("Missing expected " + lang_1.StringWrapper.fromCharCode(code));
    };
    _ParseAST.prototype.optionalOperator = function (op) {
        if (this.next.isOperator(op)) {
            this.advance();
            return true;
        }
        else {
            return false;
        }
    };
    _ParseAST.prototype.expectOperator = function (operator) {
        if (this.optionalOperator(operator))
            return;
        this.error("Missing expected operator " + operator);
    };
    _ParseAST.prototype.expectIdentifierOrKeyword = function () {
        var n = this.next;
        if (!n.isIdentifier() && !n.isKeyword()) {
            this.error("Unexpected token " + n + ", expected identifier or keyword");
        }
        this.advance();
        return n.toString();
    };
    _ParseAST.prototype.expectIdentifierOrKeywordOrString = function () {
        var n = this.next;
        if (!n.isIdentifier() && !n.isKeyword() && !n.isString()) {
            this.error("Unexpected token " + n + ", expected identifier, keyword, or string");
        }
        this.advance();
        return n.toString();
    };
    _ParseAST.prototype.parseChain = function () {
        var exprs = [];
        while (this.index < this.tokens.length) {
            var expr = this.parsePipe();
            exprs.push(expr);
            if (this.optionalCharacter(lexer_1.$SEMICOLON)) {
                if (!this.parseAction) {
                    this.error("Binding expression cannot contain chained expression");
                }
                while (this.optionalCharacter(lexer_1.$SEMICOLON)) {
                } // read all semicolons
            }
            else if (this.index < this.tokens.length) {
                this.error("Unexpected token '" + this.next + "'");
            }
        }
        if (exprs.length == 0)
            return new ast_1.EmptyExpr();
        if (exprs.length == 1)
            return exprs[0];
        return new ast_1.Chain(exprs);
    };
    _ParseAST.prototype.parsePipe = function () {
        var result = this.parseExpression();
        if (this.optionalOperator("|")) {
            if (this.parseAction) {
                this.error("Cannot have a pipe in an action expression");
            }
            do {
                var name = this.expectIdentifierOrKeyword();
                var args = [];
                while (this.optionalCharacter(lexer_1.$COLON)) {
                    args.push(this.parseExpression());
                }
                result = new ast_1.BindingPipe(result, name, args);
            } while (this.optionalOperator("|"));
        }
        return result;
    };
    _ParseAST.prototype.parseExpression = function () { return this.parseConditional(); };
    _ParseAST.prototype.parseConditional = function () {
        var start = this.inputIndex;
        var result = this.parseLogicalOr();
        if (this.optionalOperator('?')) {
            var yes = this.parsePipe();
            if (!this.optionalCharacter(lexer_1.$COLON)) {
                var end = this.inputIndex;
                var expression = this.input.substring(start, end);
                this.error("Conditional expression " + expression + " requires all 3 expressions");
            }
            var no = this.parsePipe();
            return new ast_1.Conditional(result, yes, no);
        }
        else {
            return result;
        }
    };
    _ParseAST.prototype.parseLogicalOr = function () {
        // '||'
        var result = this.parseLogicalAnd();
        while (this.optionalOperator('||')) {
            result = new ast_1.Binary('||', result, this.parseLogicalAnd());
        }
        return result;
    };
    _ParseAST.prototype.parseLogicalAnd = function () {
        // '&&'
        var result = this.parseEquality();
        while (this.optionalOperator('&&')) {
            result = new ast_1.Binary('&&', result, this.parseEquality());
        }
        return result;
    };
    _ParseAST.prototype.parseEquality = function () {
        // '==','!=','===','!=='
        var result = this.parseRelational();
        while (true) {
            if (this.optionalOperator('==')) {
                result = new ast_1.Binary('==', result, this.parseRelational());
            }
            else if (this.optionalOperator('===')) {
                result = new ast_1.Binary('===', result, this.parseRelational());
            }
            else if (this.optionalOperator('!=')) {
                result = new ast_1.Binary('!=', result, this.parseRelational());
            }
            else if (this.optionalOperator('!==')) {
                result = new ast_1.Binary('!==', result, this.parseRelational());
            }
            else {
                return result;
            }
        }
    };
    _ParseAST.prototype.parseRelational = function () {
        // '<', '>', '<=', '>='
        var result = this.parseAdditive();
        while (true) {
            if (this.optionalOperator('<')) {
                result = new ast_1.Binary('<', result, this.parseAdditive());
            }
            else if (this.optionalOperator('>')) {
                result = new ast_1.Binary('>', result, this.parseAdditive());
            }
            else if (this.optionalOperator('<=')) {
                result = new ast_1.Binary('<=', result, this.parseAdditive());
            }
            else if (this.optionalOperator('>=')) {
                result = new ast_1.Binary('>=', result, this.parseAdditive());
            }
            else {
                return result;
            }
        }
    };
    _ParseAST.prototype.parseAdditive = function () {
        // '+', '-'
        var result = this.parseMultiplicative();
        while (true) {
            if (this.optionalOperator('+')) {
                result = new ast_1.Binary('+', result, this.parseMultiplicative());
            }
            else if (this.optionalOperator('-')) {
                result = new ast_1.Binary('-', result, this.parseMultiplicative());
            }
            else {
                return result;
            }
        }
    };
    _ParseAST.prototype.parseMultiplicative = function () {
        // '*', '%', '/'
        var result = this.parsePrefix();
        while (true) {
            if (this.optionalOperator('*')) {
                result = new ast_1.Binary('*', result, this.parsePrefix());
            }
            else if (this.optionalOperator('%')) {
                result = new ast_1.Binary('%', result, this.parsePrefix());
            }
            else if (this.optionalOperator('/')) {
                result = new ast_1.Binary('/', result, this.parsePrefix());
            }
            else {
                return result;
            }
        }
    };
    _ParseAST.prototype.parsePrefix = function () {
        if (this.optionalOperator('+')) {
            return this.parsePrefix();
        }
        else if (this.optionalOperator('-')) {
            return new ast_1.Binary('-', new ast_1.LiteralPrimitive(0), this.parsePrefix());
        }
        else if (this.optionalOperator('!')) {
            return new ast_1.PrefixNot(this.parsePrefix());
        }
        else {
            return this.parseCallChain();
        }
    };
    _ParseAST.prototype.parseCallChain = function () {
        var result = this.parsePrimary();
        while (true) {
            if (this.optionalCharacter(lexer_1.$PERIOD)) {
                result = this.parseAccessMemberOrMethodCall(result, false);
            }
            else if (this.optionalOperator('?.')) {
                result = this.parseAccessMemberOrMethodCall(result, true);
            }
            else if (this.optionalCharacter(lexer_1.$LBRACKET)) {
                var key = this.parsePipe();
                this.expectCharacter(lexer_1.$RBRACKET);
                if (this.optionalOperator("=")) {
                    var value = this.parseConditional();
                    result = new ast_1.KeyedWrite(result, key, value);
                }
                else {
                    result = new ast_1.KeyedRead(result, key);
                }
            }
            else if (this.optionalCharacter(lexer_1.$LPAREN)) {
                var args = this.parseCallArguments();
                this.expectCharacter(lexer_1.$RPAREN);
                result = new ast_1.FunctionCall(result, args);
            }
            else {
                return result;
            }
        }
    };
    _ParseAST.prototype.parsePrimary = function () {
        if (this.optionalCharacter(lexer_1.$LPAREN)) {
            var result = this.parsePipe();
            this.expectCharacter(lexer_1.$RPAREN);
            return result;
        }
        else if (this.next.isKeywordNull() || this.next.isKeywordUndefined()) {
            this.advance();
            return new ast_1.LiteralPrimitive(null);
        }
        else if (this.next.isKeywordTrue()) {
            this.advance();
            return new ast_1.LiteralPrimitive(true);
        }
        else if (this.next.isKeywordFalse()) {
            this.advance();
            return new ast_1.LiteralPrimitive(false);
        }
        else if (this.optionalCharacter(lexer_1.$LBRACKET)) {
            var elements = this.parseExpressionList(lexer_1.$RBRACKET);
            this.expectCharacter(lexer_1.$RBRACKET);
            return new ast_1.LiteralArray(elements);
        }
        else if (this.next.isCharacter(lexer_1.$LBRACE)) {
            return this.parseLiteralMap();
        }
        else if (this.next.isIdentifier()) {
            return this.parseAccessMemberOrMethodCall(_implicitReceiver, false);
        }
        else if (this.next.isNumber()) {
            var value = this.next.toNumber();
            this.advance();
            return new ast_1.LiteralPrimitive(value);
        }
        else if (this.next.isString()) {
            var literalValue = this.next.toString();
            this.advance();
            return new ast_1.LiteralPrimitive(literalValue);
        }
        else if (this.index >= this.tokens.length) {
            this.error("Unexpected end of expression: " + this.input);
        }
        else {
            this.error("Unexpected token " + this.next);
        }
        // error() throws, so we don't reach here.
        throw new exceptions_1.BaseException("Fell through all cases in parsePrimary");
    };
    _ParseAST.prototype.parseExpressionList = function (terminator) {
        var result = [];
        if (!this.next.isCharacter(terminator)) {
            do {
                result.push(this.parsePipe());
            } while (this.optionalCharacter(lexer_1.$COMMA));
        }
        return result;
    };
    _ParseAST.prototype.parseLiteralMap = function () {
        var keys = [];
        var values = [];
        this.expectCharacter(lexer_1.$LBRACE);
        if (!this.optionalCharacter(lexer_1.$RBRACE)) {
            do {
                var key = this.expectIdentifierOrKeywordOrString();
                keys.push(key);
                this.expectCharacter(lexer_1.$COLON);
                values.push(this.parsePipe());
            } while (this.optionalCharacter(lexer_1.$COMMA));
            this.expectCharacter(lexer_1.$RBRACE);
        }
        return new ast_1.LiteralMap(keys, values);
    };
    _ParseAST.prototype.parseAccessMemberOrMethodCall = function (receiver, isSafe) {
        if (isSafe === void 0) { isSafe = false; }
        var id = this.expectIdentifierOrKeyword();
        if (this.optionalCharacter(lexer_1.$LPAREN)) {
            var args = this.parseCallArguments();
            this.expectCharacter(lexer_1.$RPAREN);
            return isSafe ? new ast_1.SafeMethodCall(receiver, id, args) : new ast_1.MethodCall(receiver, id, args);
        }
        else {
            if (isSafe) {
                if (this.optionalOperator("=")) {
                    this.error("The '?.' operator cannot be used in the assignment");
                }
                else {
                    return new ast_1.SafePropertyRead(receiver, id);
                }
            }
            else {
                if (this.optionalOperator("=")) {
                    if (!this.parseAction) {
                        this.error("Bindings cannot contain assignments");
                    }
                    var value = this.parseConditional();
                    return new ast_1.PropertyWrite(receiver, id, value);
                }
                else {
                    return new ast_1.PropertyRead(receiver, id);
                }
            }
        }
        return null;
    };
    _ParseAST.prototype.parseCallArguments = function () {
        if (this.next.isCharacter(lexer_1.$RPAREN))
            return [];
        var positionals = [];
        do {
            positionals.push(this.parsePipe());
        } while (this.optionalCharacter(lexer_1.$COMMA));
        return positionals;
    };
    _ParseAST.prototype.parseBlockContent = function () {
        if (!this.parseAction) {
            this.error("Binding expression cannot contain chained expression");
        }
        var exprs = [];
        while (this.index < this.tokens.length && !this.next.isCharacter(lexer_1.$RBRACE)) {
            var expr = this.parseExpression();
            exprs.push(expr);
            if (this.optionalCharacter(lexer_1.$SEMICOLON)) {
                while (this.optionalCharacter(lexer_1.$SEMICOLON)) {
                } // read all semicolons
            }
        }
        if (exprs.length == 0)
            return new ast_1.EmptyExpr();
        if (exprs.length == 1)
            return exprs[0];
        return new ast_1.Chain(exprs);
    };
    /**
     * An identifier, a keyword, a string with an optional `-` inbetween.
     */
    _ParseAST.prototype.expectTemplateBindingKey = function () {
        var result = '';
        var operatorFound = false;
        do {
            result += this.expectIdentifierOrKeywordOrString();
            operatorFound = this.optionalOperator('-');
            if (operatorFound) {
                result += '-';
            }
        } while (operatorFound);
        return result.toString();
    };
    _ParseAST.prototype.parseTemplateBindings = function () {
        var bindings = [];
        var prefix = null;
        while (this.index < this.tokens.length) {
            var keyIsVar = this.optionalKeywordVar();
            var key = this.expectTemplateBindingKey();
            if (!keyIsVar) {
                if (prefix == null) {
                    prefix = key;
                }
                else {
                    key = prefix + key[0].toUpperCase() + key.substring(1);
                }
            }
            this.optionalCharacter(lexer_1.$COLON);
            var name = null;
            var expression = null;
            if (keyIsVar) {
                if (this.optionalOperator("=")) {
                    name = this.expectTemplateBindingKey();
                }
                else {
                    name = '\$implicit';
                }
            }
            else if (this.next !== lexer_1.EOF && !this.peekKeywordVar()) {
                var start = this.inputIndex;
                var ast = this.parsePipe();
                var source = this.input.substring(start, this.inputIndex);
                expression = new ast_1.ASTWithSource(ast, source, this.location);
            }
            bindings.push(new ast_1.TemplateBinding(key, keyIsVar, name, expression));
            if (!this.optionalCharacter(lexer_1.$SEMICOLON)) {
                this.optionalCharacter(lexer_1.$COMMA);
            }
        }
        return bindings;
    };
    _ParseAST.prototype.error = function (message, index) {
        if (index === void 0) { index = null; }
        if (lang_1.isBlank(index))
            index = this.index;
        var location = (index < this.tokens.length) ? "at column " + (this.tokens[index].index + 1) + " in" :
            "at the end of the expression";
        throw new ParseException(message, this.input, location, this.location);
    };
    return _ParseAST;
}());
exports._ParseAST = _ParseAST;
var SimpleExpressionChecker = (function () {
    function SimpleExpressionChecker() {
        this.simple = true;
    }
    SimpleExpressionChecker.check = function (ast) {
        var s = new SimpleExpressionChecker();
        ast.visit(s);
        return s.simple;
    };
    SimpleExpressionChecker.prototype.visitImplicitReceiver = function (ast, context) { };
    SimpleExpressionChecker.prototype.visitInterpolation = function (ast, context) { this.simple = false; };
    SimpleExpressionChecker.prototype.visitLiteralPrimitive = function (ast, context) { };
    SimpleExpressionChecker.prototype.visitPropertyRead = function (ast, context) { };
    SimpleExpressionChecker.prototype.visitPropertyWrite = function (ast, context) { this.simple = false; };
    SimpleExpressionChecker.prototype.visitSafePropertyRead = function (ast, context) { this.simple = false; };
    SimpleExpressionChecker.prototype.visitMethodCall = function (ast, context) { this.simple = false; };
    SimpleExpressionChecker.prototype.visitSafeMethodCall = function (ast, context) { this.simple = false; };
    SimpleExpressionChecker.prototype.visitFunctionCall = function (ast, context) { this.simple = false; };
    SimpleExpressionChecker.prototype.visitLiteralArray = function (ast, context) { this.visitAll(ast.expressions); };
    SimpleExpressionChecker.prototype.visitLiteralMap = function (ast, context) { this.visitAll(ast.values); };
    SimpleExpressionChecker.prototype.visitBinary = function (ast, context) { this.simple = false; };
    SimpleExpressionChecker.prototype.visitPrefixNot = function (ast, context) { this.simple = false; };
    SimpleExpressionChecker.prototype.visitConditional = function (ast, context) { this.simple = false; };
    SimpleExpressionChecker.prototype.visitPipe = function (ast, context) { this.simple = false; };
    SimpleExpressionChecker.prototype.visitKeyedRead = function (ast, context) { this.simple = false; };
    SimpleExpressionChecker.prototype.visitKeyedWrite = function (ast, context) { this.simple = false; };
    SimpleExpressionChecker.prototype.visitAll = function (asts) {
        var res = collection_1.ListWrapper.createFixedSize(asts.length);
        for (var i = 0; i < asts.length; ++i) {
            res[i] = asts[i].visit(this);
        }
        return res;
    };
    SimpleExpressionChecker.prototype.visitChain = function (ast, context) { this.simple = false; };
    SimpleExpressionChecker.prototype.visitQuote = function (ast, context) { this.simple = false; };
    return SimpleExpressionChecker;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC00bm8zWlF2Ty50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL2V4cHJlc3Npb25fcGFyc2VyL3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQkFBeUIsaUNBQWlDLENBQUMsQ0FBQTtBQUMzRCxxQkFBZ0QsMEJBQTBCLENBQUMsQ0FBQTtBQUMzRSwyQkFBOEMsZ0NBQWdDLENBQUMsQ0FBQTtBQUMvRSwyQkFBMEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUMzRCxzQkFpQk8sU0FBUyxDQUFDLENBQUE7QUFDakIsb0JBeUJPLE9BQU8sQ0FBQyxDQUFBO0FBR2YsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLHNCQUFnQixFQUFFLENBQUM7QUFDL0Msb0ZBQW9GO0FBQ3BGLElBQUksb0JBQW9CLEdBQUcscUJBQXFCLENBQUM7QUFFakQ7SUFBNkIsa0NBQWE7SUFDeEMsd0JBQVksT0FBZSxFQUFFLEtBQWEsRUFBRSxXQUFtQixFQUFFLFdBQWlCO1FBQ2hGLGtCQUFNLG1CQUFpQixPQUFPLFNBQUksV0FBVyxVQUFLLEtBQUssYUFBUSxXQUFhLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBSkQsQ0FBNkIsMEJBQWEsR0FJekM7QUFFRDtJQUNFLDRCQUFtQixPQUFpQixFQUFTLFdBQXFCO1FBQS9DLFlBQU8sR0FBUCxPQUFPLENBQVU7UUFBUyxnQkFBVyxHQUFYLFdBQVcsQ0FBVTtJQUFHLENBQUM7SUFDeEUseUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZZLDBCQUFrQixxQkFFOUIsQ0FBQTtBQUdEO0lBQ0UsZ0JBQVksZ0JBQWdCLENBQ1QsTUFBYTtRQUFiLFdBQU0sR0FBTixNQUFNLENBQU87SUFBRyxDQUFDO0lBRXBDLDRCQUFXLEdBQVgsVUFBWSxLQUFhLEVB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Q25ELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3JDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVELDRDQUFVLEdBQVYsVUFBVyxHQUFVLEVBQUUsT0FBWSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUU3RCw0Q0FBVSxHQUFWLFVBQVcsR0FBVSxFQUFFLE9BQVksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDL0QsOEJBQUM7QUFBRCxDQUFDLEFBdERELElBc0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaS9kZWNvcmF0b3JzJztcbmltcG9ydCB7aXNCbGFuaywgaXNQcmVzZW50LCBTdHJpbmdXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9uLCBXcmFwcGVkRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7XG4gIExleGVyLFxuICBFT0YsXG4gIGlzSWRlbnRpZmllcixcbiAgaXNRdW90ZSxcbiAgVG9rZW4sXG4gICRQRVJJT0QsXG4gICRDT0xPTixcbiAgJFNFTUlDT0xPTixcbiAgJExCUkFDS0VULFxuICAkUkJSQUNLRVQsXG4gICRDT01NQSxcbiAgJExCUkFDRSxcbiAgJFJCUkFDRSxcbiAgJExQQVJFTixcbiAgJFJQQVJFTixcbiAgJFNMQVNIXG59IGZyb20gJy4vbGV4ZXInO1xuaW1wb3J0IHtcbiAgQVNULFxuICBFbXB0eUV4cHIsXG4gIEltcGxpY2l0UmVjZWl2ZXIsXG4gIFByb3BlcnR5UmVhZCxcbiAgUHJvcGVydHlXcml0ZSxcbiAgU2FmZVByb3BlcnR5UmVhZCxcbiAgTGl0ZXJhbFByaW1pdGl2ZSxcbiAgQmluYXJ5LFxuICBQcmVmaXhOb3QsXG4gIENvbmRpdGlvbmFsLFxuICBCaW5kaW5nUGlwZSxcbiAgQ2hhaW4sXG4gIEtleWVkUmVhZCxcbiAgS2V5ZWRXcml0ZSxcbiAgTGl0ZXJhbEFycmF5LFxuICBMaXRlcmFsTWFwLFxuICBJbnRlcnBvbGF0aW9uLFxuICBNZXRob2RDYWxsLFxuICBTYWZlTWV0aG9kQ2FsbCxcbiAgRnVuY3Rpb25DYWxsLFxuICBUZW1wbGF0ZUJpbmRpbmcsXG4gIEFTVFdpdGhTb3VyY2UsXG4gIEFzdFZpc2l0b3IsXG4gIFF1b3RlXG59IGZyb20gJy4vYXN0JztcblxuXG52YXIgX2ltcGxpY2l0UmVjZWl2ZXIgPSBuZXcgSW1wbGljaXRSZWNlaXZlcigpO1xuLy8gVE9ETyh0Ym9zY2gpOiBDYW5ub3QgbWFrZSB0aGlzIGNvbnN0L2ZpbmFsIHJpZ2h0IG5vdyBiZWNhdXNlIG9mIHRoZSB0cmFuc3BpbGVyLi4uXG52YXIgSU5URVJQT0xBVElPTl9SRUdFWFAgPSAvXFx7XFx7KFtcXHNcXFNdKj8pXFx9XFx9L2c7XG5cbmNsYXNzIFBhcnNlRXhjZXB0aW9uIGV4dGVuZHMgQmFzZUV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZywgaW5wdXQ6IHN0cmluZywgZXJyTG9jYXRpb246IHN0cmluZywgY3R4TG9jYXRpb24/OiBhbnkpIHtcbiAgICBzdXBlcihgUGFyc2VyIEVycm9yOiAke21lc3NhZ2V9ICR7ZXJyTG9jYXRpb259IFske2lucHV0fV0gaW4gJHtjdHhMb2NhdGlvbn1gKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3BsaXRJbnRlcnBvbGF0aW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIHN0cmluZ3M6IHN0cmluZ1tdLCBwdWJsaWMgZXhwcmVzc2lvbnM6IHN0cmluZ1tdKSB7fVxufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUGFyc2VyIHtcbiAgY29uc3RydWN0b3IoLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICAgICAgICBwdWJsaWMgX2xleGVyOiBMZXhlcikge31cblxuICBwYXJzZUFjdGlvbihpbnB1dDogc3RyaW5nLCBsb2NhdGlvbjogYW55KTogQVNUV2l0aFNvdXJjZSB7XG4gICAgdGhpcy5fY2hlY2tOb0ludGVycG9sYXRpb24oaW5wdXQsIGxvY2F0aW9uKTtcbiAgICB2YXIgdG9rZW5zID0gdGhpcy5fbGV4ZXIudG9rZW5pemUodGhpcy5fc3RyaXBDb21tZW50cyhpbnB1dCkpO1xuICAgIHZhciBhc3QgPSBuZXcgX1BhcnNlQVNUKGlucHV0LCBsb2NhdGlvbiwgdG9rZW5zLCB0cnVlKS5wYXJzZUNoYWluKCk7XG4gICAgcmV0dXJuIG5ldyBBU1RXaXRoU291cmNlKGFzdCwgaW5wdXQsIGxvY2F0aW9uKTtcbiAgfVxuXG4gIHBhcnNlQmluZGluZyhpbnB1dDogc3RyaW5nLCBsb2NhdGlvbjogYW55KTogQVNUV2l0aFNvdXJjZSB7XG4gICAgdmFyIGFzdCA9IHRoaXMuX3BhcnNlQmluZGluZ0FzdChpbnB1dCwgbG9jYXRpb24pO1xuICAgIHJldHVybiBuZXcgQVNUV2l0aFNvdXJjZShhc3QsIGlucHV0LCBsb2NhdGlvbik7XG4gIH1cblxuICBwYXJzZVNpbXBsZUJpbmRpbmcoaW5wdXQ6IHN0cmluZywgbG9jYXRpb246IHN0cmluZyk6IEFTVFdpdGhTb3VyY2Uge1xuICAgIHZhciBhc3QgPSB0aGlzLl9wYXJzZUJpbmRpbmdBc3QoaW5wdXQsIGxvY2F0aW9uKTtcbiAgICBpZiAoIVNpbXBsZUV4cHJlc3Npb25DaGVja2VyLmNoZWNrKGFzdCkpIHtcbiAgICAgIHRocm93IG5ldyBQYXJzZUV4Y2VwdGlvbihcbiAgICAgICAgICAnSG9zdCBiaW5kaW5nIGV4cHJlc3Npb24gY2FuIG9ubHkgY29udGFpbiBmaWVsZCBhY2Nlc3MgYW5kIGNvbnN0YW50cycsIGlucHV0LCBsb2NhdGlvbik7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQVNUV2l0aFNvdXJjZShhc3QsIGlucHV0LCBsb2NhdGlvbik7XG4gIH1cblxuICBwcml2YXRlIF9wYXJzZUJpbmRpbmdBc3QoaW5wdXQ6IHN0cmluZywgbG9jYXRpb246IHN0cmluZyk6IEFTVCB7XG4gICAgLy8gUXVvdGVzIGV4cHJlc3Npb25zIHVzZSAzcmQtcGFydHkgZXhwcmVzc2lvbiBsYW5ndWFnZS4gV2UgZG9uJ3Qgd2FudCB0byB1c2VcbiAgICAvLyBvdXIgbGV4ZXIgb3IgcGFyc2VyIGZvciB0aGF0LCBzbyB3ZSBjaGVjayBmb3IgdGhhdCBhaGVhZCBvZiB0aW1lLlxuICAgIHZhciBxdW90ZSA9IHRoaXMuX3BhcnNlUXVvdGUoaW5wdXQsIGxvY2F0aW9uKTtcblxuICAgIGlmIChpc1ByZXNlbnQocXVvdGUpKSB7XG4gICAgICByZXR1cm4gcXVvdGU7XG4gICAgfVxuXG4gICAgdGhpcy5fY2hlY2tOb0ludGVycG9sYXRpb24oaW5wdXQsIGxvY2F0aW9uKTtcbiAgICB2YXIgdG9rZW5zID0gdGhpcy5fbGV4ZXIudG9rZW5pemUodGhpcy5fc3RyaXBDb21tZW50cyhpbnB1dCkpO1xuICAgIHJldHVybiBuZXcgX1BhcnNlQVNUKGlucHV0LCBsb2NhdGlvbiwgdG9rZW5zLCBmYWxzZSkucGFyc2VDaGFpbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBfcGFyc2VRdW90ZShpbnB1dDogc3RyaW5nLCBsb2NhdGlvbjogYW55KTogQVNUIHtcbiAgICBpZiAoaXNCbGFuayhpbnB1dCkpIHJldHVybiBudWxsO1xuICAgIHZhciBwcmVmaXhTZXBhcmF0b3JJbmRleCA9IGlucHV0LmluZGV4T2YoJzonKTtcbiAgICBpZiAocHJlZml4U2VwYXJhdG9ySW5kZXggPT0gLTEpIHJldHVybiBudWxsO1xuICAgIHZhciBwcmVmaXggPSBpbnB1dC5zdWJzdHJpbmcoMCwgcHJlZml4U2VwYXJhdG9ySW5kZXgpLnRyaW0oKTtcbiAgICBpZiAoIWlzSWRlbnRpZmllcihwcmVmaXgpKSByZXR1cm4gbnVsbDtcbiAgICB2YXIgdW5pbnRlcnByZXRlZEV4cHJlc3Npb24gPSBpbnB1dC5zdWJzdHJpbmcocHJlZml4U2VwYXJhdG9ySW5kZXggKyAxKTtcbiAgICByZXR1cm4gbmV3IFF1b3RlKHByZWZpeCwgdW5pbnRlcnByZXRlZEV4cHJlc3Npb24sIGxvY2F0aW9uKTtcbiAgfVxuXG4gIHBhcnNlVGVtcGxhdGVCaW5kaW5ncyhpbnB1dDogc3RyaW5nLCBsb2NhdGlvbjogYW55KTogVGVtcGxhdGVCaW5kaW5nW10ge1xuICAgIHZhciB0b2tlbnMgPSB0aGlzLl9sZXhlci50b2tlbml6ZShpbnB1dCk7XG4gICAgcmV0dXJuIG5ldyBfUGFyc2VBU1QoaW5wdXQsIGxvY2F0aW9uLCB0b2tlbnMsIGZhbHNlKS5wYXJzZVRlbXBsYXRlQmluZGluZ3MoKTtcbiAgfVxuXG4gIHBhcnNlSW50ZXJwb2xhdGlvbihpbnB1dDogc3RyaW5nLCBsb2NhdGlvbjogYW55KTogQVNUV2l0aFNvdXJjZSB7XG4gICAgbGV0IHNwbGl0ID0gdGhpcy5zcGxpdEludGVycG9sYXRpb24oaW5wdXQsIGxvY2F0aW9uKTtcbiAgICBpZiAoc3BsaXQgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgICBsZXQgZXhwcmVzc2lvbnMgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXQuZXhwcmVzc2lvbnMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciB0b2tlbnMgPSB0aGlzLl9sZXhlci50b2tlbml6ZSh0aGlzLl9zdHJpcENvbW1lbnRzKHNwbGl0LmV4cHJlc3Npb25zW2ldKSk7XG4gICAgICB2YXIgYXN0ID0gbmV3IF9QYXJzZUFTVChpbnB1dCwgbG9jYXRpb24sIHRva2VucywgZmFsc2UpLnBhcnNlQ2hhaW4oKTtcbiAgICAgIGV4cHJlc3Npb25zLnB1c2goYXN0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEFTVFdpdGhTb3VyY2UobmV3IEludGVycG9sYXRpb24oc3BsaXQuc3RyaW5ncywgZXhwcmVzc2lvbnMpLCBpbnB1dCwgbG9jYXRpb24pO1xuICB9XG5cbiAgc3BsaXRJbnRlcnBvbGF0aW9uKGlucHV0OiBzdHJpbmcsIGxvY2F0aW9uOiBzdHJpbmcpOiBTcGxpdEludGVycG9sYXRpb24ge1xuICAgIHZhciBwYXJ0cyA9IFN0cmluZ1dyYXBwZXIuc3BsaXQoaW5wdXQsIElOVEVSUE9MQVRJT05fUkVHRVhQKTtcbiAgICBpZiAocGFydHMubGVuZ3RoIDw9IDEpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB2YXIgc3RyaW5ncyA9IFtdO1xuICAgIHZhciBleHByZXNzaW9ucyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBhcnQ6IHN0cmluZyA9IHBhcnRzW2ldO1xuICAgICAgaWYgKGkgJSAyID09PSAwKSB7XG4gICAgICAgIC8vIGZpeGVkIHN0cmluZ1xuICAgICAgICBzdHJpbmdzLnB1c2gocGFydCk7XG4gICAgICB9IGVsc2UgaWYgKHBhcnQudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZXhwcmVzc2lvbnMucHVzaChwYXJ0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBQYXJzZUV4Y2VwdGlvbignQmxhbmsgZXhwcmVzc2lvbnMgYXJlIG5vdCBhbGxvd2VkIGluIGludGVycG9sYXRlZCBzdHJpbmdzJywgaW5wdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgYXQgY29sdW1uICR7dGhpcy5fZmluZEludGVycG9sYXRpb25FcnJvckNvbHVtbihwYXJ0cywgaSl9IGluYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBTcGxpdEludGVycG9sYXRpb24oc3RyaW5ncywgZXhwcmVzc2lvbnMpO1xuICB9XG5cbiAgd3JhcExpdGVyYWxQcmltaXRpdmUoaW5wdXQ6IHN0cmluZywgbG9jYXRpb246IGFueSk6IEFTVFdpdGhTb3VyY2Uge1xuICAgIHJldHVybiBuZXcgQVNUV2l0aFNvdXJjZShuZXcgTGl0ZXJhbFByaW1pdGl2ZShpbnB1dCksIGlucHV0LCBsb2NhdGlvbik7XG4gIH1cblxuICBwcml2YXRlIF9zdHJpcENvbW1lbnRzKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGxldCBpID0gdGhpcy5fY29tbWVudFN0YXJ0KGlucHV0KTtcbiAgICByZXR1cm4gaXNQcmVzZW50KGkpID8gaW5wdXQuc3Vic3RyaW5nKDAsIGkpLnRyaW0oKSA6IGlucHV0O1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tbWVudFN0YXJ0KGlucHV0OiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHZhciBvdXRlclF1b3RlID0gbnVsbDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgbGV0IGNoYXIgPSBTdHJpbmdXcmFwcGVyLmNoYXJDb2RlQXQoaW5wdXQsIGkpO1xuICAgICAgbGV0IG5leHRDaGFyID0gU3RyaW5nV3JhcHBlci5jaGFyQ29kZUF0KGlucHV0LCBpICsgMSk7XG5cbiAgICAgIGlmIChjaGFyID09PSAkU0xBU0ggJiYgbmV4dENoYXIgPT0gJFNMQVNIICYmIGlzQmxhbmsob3V0ZXJRdW90ZSkpIHJldHVybiBpO1xuXG4gICAgICBpZiAob3V0ZXJRdW90ZSA9PT0gY2hhcikge1xuICAgICAgICBvdXRlclF1b3RlID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAoaXNCbGFuayhvdXRlclF1b3RlKSAmJiBpc1F1b3RlKGNoYXIpKSB7XG4gICAgICAgIG91dGVyUXVvdGUgPSBjaGFyO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrTm9JbnRlcnBvbGF0aW9uKGlucHV0OiBzdHJpbmcsIGxvY2F0aW9uOiBhbnkpOiB2b2lkIHtcbiAgICB2YXIgcGFydHMgPSBTdHJpbmdXcmFwcGVyLnNwbGl0KGlucHV0LCBJTlRFUlBPTEFUSU9OX1JFR0VYUCk7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRocm93IG5ldyBQYXJzZUV4Y2VwdGlvbignR290IGludGVycG9sYXRpb24gKHt7fX0pIHdoZXJlIGV4cHJlc3Npb24gd2FzIGV4cGVjdGVkJywgaW5wdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGF0IGNvbHVtbiAke3RoaXMuX2ZpbmRJbnRlcnBvbGF0aW9uRXJyb3JDb2x1bW4ocGFydHMsIDEpfSBpbmAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2ZpbmRJbnRlcnBvbGF0aW9uRXJyb3JDb2x1bW4ocGFydHM6IHN0cmluZ1tdLCBwYXJ0SW5FcnJJZHg6IG51bWJlcik6IG51bWJlciB7XG4gICAgdmFyIGVyckxvY2F0aW9uID0gJyc7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYXJ0SW5FcnJJZHg7IGorKykge1xuICAgICAgZXJyTG9jYXRpb24gKz0gaiAlIDIgPT09IDAgPyBwYXJ0c1tqXSA6IGB7eyR7cGFydHNbal19fX1gO1xuICAgIH1cblxuICAgIHJldHVybiBlcnJMb2NhdGlvbi5sZW5ndGg7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIF9QYXJzZUFTVCB7XG4gIGluZGV4OiBudW1iZXIgPSAwO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgaW5wdXQ6IHN0cmluZywgcHVibGljIGxvY2F0aW9uOiBhbnksIHB1YmxpYyB0b2tlbnM6IGFueVtdLFxuICAgICAgICAgICAgICBwdWJsaWMgcGFyc2VBY3Rpb246IGJvb2xlYW4pIHt9XG5cbiAgcGVlayhvZmZzZXQ6IG51bWJlcik6IFRva2VuIHtcbiAgICB2YXIgaSA9IHRoaXMuaW5kZXggKyBvZmZzZXQ7XG4gICAgcmV0dXJuIGkgPCB0aGlzLnRva2Vucy5sZW5ndGggPyB0aGlzLnRva2Vuc1tpXSA6IEVPRjtcbiAgfVxuXG4gIGdldCBuZXh0KCk6IFRva2VuIHsgcmV0dXJuIHRoaXMucGVlaygwKTsgfVxuXG4gIGdldCBpbnB1dEluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuICh0aGlzLmluZGV4IDwgdGhpcy50b2tlbnMubGVuZ3RoKSA/IHRoaXMubmV4dC5pbmRleCA6IHRoaXMuaW5wdXQubGVuZ3RoO1xuICB9XG5cbiAgYWR2YW5jZSgpIHsgdGhpcy5pbmRleCsrOyB9XG5cbiAgb3B0aW9uYWxDaGFyYWN0ZXIoY29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMubmV4dC5pc0NoYXJhY3Rlcihjb2RlKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIG9wdGlvbmFsS2V5d29yZFZhcigpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5wZWVrS2V5d29yZFZhcigpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcGVla0tleXdvcmRWYXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLm5leHQuaXNLZXl3b3JkVmFyKCkgfHwgdGhpcy5uZXh0LmlzT3BlcmF0b3IoJyMnKTsgfVxuXG4gIGV4cGVjdENoYXJhY3Rlcihjb2RlOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5vcHRpb25hbENoYXJhY3Rlcihjb2RlKSkgcmV0dXJuO1xuICAgIHRoaXMuZXJyb3IoYE1pc3NpbmcgZXhwZWN0ZWQgJHtTdHJpbmdXcmFwcGVyLmZyb21DaGFyQ29kZShjb2RlKX1gKTtcbiAgfVxuXG5cbiAgb3B0aW9uYWxPcGVyYXRvcihvcDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMubmV4dC5pc09wZXJhdG9yKG9wKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGV4cGVjdE9wZXJhdG9yKG9wZXJhdG9yOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5vcHRpb25hbE9wZXJhdG9yKG9wZXJhdG9yKSkgcmV0dXJuO1xuICAgIHRoaXMuZXJyb3IoYE1pc3NpbmcgZXhwZWN0ZWQgb3BlcmF0b3IgJHtvcGVyYXRvcn1gKTtcbiAgfVxuXG4gIGV4cGVjdElkZW50aWZpZXJPcktleXdvcmQoKTogc3RyaW5nIHtcbiAgICB2YXIgbiA9IHRoaXMubmV4dDtcbiAgICBpZiAoIW4uaXNJZGVudGlmaWVyKCkgJiYgIW4uaXNLZXl3b3JkKCkpIHtcbiAgICAgIHRoaXMuZXJyb3IoYFVuZXhwZWN0ZWQgdG9rZW4gJHtufSwgZXhwZWN0ZWQgaWRlbnRpZmllciBvciBrZXl3b3JkYCk7XG4gICAgfVxuICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIHJldHVybiBuLnRvU3RyaW5nKCk7XG4gIH1cblxuICBleHBlY3RJZGVudGlmaWVyT3JLZXl3b3JkT3JTdHJpbmcoKTogc3RyaW5nIHtcbiAgICB2YXIgbiA9IHRoaXMubmV4dDtcbiAgICBpZiAoIW4uaXNJZGVudGlmaWVyKCkgJiYgIW4uaXNLZXl3b3JkKCkgJiYgIW4uaXNTdHJpbmcoKSkge1xuICAgICAgdGhpcy5lcnJvcihgVW5leHBlY3RlZCB0b2tlbiAke259LCBleHBlY3RlZCBpZGVudGlmaWVyLCBrZXl3b3JkLCBvciBzdHJpbmdgKTtcbiAgICB9XG4gICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgcmV0dXJuIG4udG9TdHJpbmcoKTtcbiAgfVxuXG4gIHBhcnNlQ2hhaW4oKTogQVNUIHtcbiAgICB2YXIgZXhwcnMgPSBbXTtcbiAgICB3aGlsZSAodGhpcy5pbmRleCA8IHRoaXMudG9rZW5zLmxlbmd0aCkge1xuICAgICAgdmFyIGV4cHIgPSB0aGlzLnBhcnNlUGlwZSgpO1xuICAgICAgZXhwcnMucHVzaChleHByKTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9uYWxDaGFyYWN0ZXIoJFNFTUlDT0xPTikpIHtcbiAgICAgICAgaWYgKCF0aGlzLnBhcnNlQWN0aW9uKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihcIkJpbmRpbmcgZXhwcmVzc2lvbiBjYW5ub3QgY29udGFpbiBjaGFpbmVkIGV4cHJlc3Npb25cIik7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHRoaXMub3B0aW9uYWxDaGFyYWN0ZXIoJFNFTUlDT0xPTikpIHtcbiAgICAgICAgfSAgLy8gcmVhZCBhbGwgc2VtaWNvbG9uc1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmluZGV4IDwgdGhpcy50b2tlbnMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoYFVuZXhwZWN0ZWQgdG9rZW4gJyR7dGhpcy5uZXh0fSdgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGV4cHJzLmxlbmd0aCA9PSAwKSByZXR1cm4gbmV3IEVtcHR5RXhwcigpO1xuICAgIGlmIChleHBycy5sZW5ndGggPT0gMSkgcmV0dXJuIGV4cHJzWzBdO1xuICAgIHJldHVybiBuZXcgQ2hhaW4oZXhwcnMpO1xuICB9XG5cbiAgcGFyc2VQaXBlKCk6IEFTVCB7XG4gICAgdmFyIHJlc3VsdCA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XG4gICAgaWYgKHRoaXMub3B0aW9uYWxPcGVyYXRvcihcInxcIikpIHtcbiAgICAgIGlmICh0aGlzLnBhcnNlQWN0aW9uKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoXCJDYW5ub3QgaGF2ZSBhIHBpcGUgaW4gYW4gYWN0aW9uIGV4cHJlc3Npb25cIik7XG4gICAgICB9XG5cbiAgICAgIGRvIHtcbiAgICAgICAgdmFyIG5hbWUgPSB0aGlzLmV4cGVjdElkZW50aWZpZXJPcktleXdvcmQoKTtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgd2hpbGUgKHRoaXMub3B0aW9uYWxDaGFyYWN0ZXIoJENPTE9OKSkge1xuICAgICAgICAgIGFyZ3MucHVzaCh0aGlzLnBhcnNlRXhwcmVzc2lvbigpKTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSBuZXcgQmluZGluZ1BpcGUocmVzdWx0LCBuYW1lLCBhcmdzKTtcbiAgICAgIH0gd2hpbGUgKHRoaXMub3B0aW9uYWxPcGVyYXRvcihcInxcIikpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwYXJzZUV4cHJlc3Npb24oKTogQVNUIHsgcmV0dXJuIHRoaXMucGFyc2VDb25kaXRpb25hbCgpOyB9XG5cbiAgcGFyc2VDb25kaXRpb25hbCgpOiBBU1Qge1xuICAgIHZhciBzdGFydCA9IHRoaXMuaW5wdXRJbmRleDtcbiAgICB2YXIgcmVzdWx0ID0gdGhpcy5wYXJzZUxvZ2ljYWxPcigpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9uYWxPcGVyYXRvcignPycpKSB7XG4gICAgICB2YXIgeWVzID0gdGhpcy5wYXJzZVBpcGUoKTtcbiAgICAgIGlmICghdGhpcy5vcHRpb25hbENoYXJhY3RlcigkQ09MT04pKSB7XG4gICAgICAgIHZhciBlbmQgPSB0aGlzLmlucHV0SW5kZXg7XG4gICAgICAgIHZhciBleHByZXNzaW9uID0gdGhpcy5pbnB1dC5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgICAgIHRoaXMuZXJyb3IoYENvbmRpdGlvbmFsIGV4cHJlc3Npb24gJHtleHByZXNzaW9ufSByZXF1aXJlcyBhbGwgMyBleHByZXNzaW9uc2ApO1xuICAgICAgfVxuICAgICAgdmFyIG5vID0gdGhpcy5wYXJzZVBpcGUoKTtcbiAgICAgIHJldHVybiBuZXcgQ29uZGl0aW9uYWwocmVzdWx0LCB5ZXMsIG5vKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH1cblxuICBwYXJzZUxvZ2ljYWxPcigpOiBBU1Qge1xuICAgIC8vICd8fCdcbiAgICB2YXIgcmVzdWx0ID0gdGhpcy5wYXJzZUxvZ2ljYWxBbmQoKTtcbiAgICB3aGlsZSAodGhpcy5vcHRpb25hbE9wZXJhdG9yKCd8fCcpKSB7XG4gICAgICByZXN1bHQgPSBuZXcgQmluYXJ5KCd8fCcsIHJlc3VsdCwgdGhpcy5wYXJzZUxvZ2ljYWxBbmQoKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwYXJzZUxvZ2ljYWxBbmQoKTogQVNUIHtcbiAgICAvLyAnJiYnXG4gICAgdmFyIHJlc3VsdCA9IHRoaXMucGFyc2VFcXVhbGl0eSgpO1xuICAgIHdoaWxlICh0aGlzLm9wdGlvbmFsT3BlcmF0b3IoJyYmJykpIHtcbiAgICAgIHJlc3VsdCA9IG5ldyBCaW5hcnkoJyYmJywgcmVzdWx0LCB0aGlzLnBhcnNlRXF1YWxpdHkoKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwYXJzZUVxdWFsaXR5KCk6IEFTVCB7XG4gICAgLy8gJz09JywnIT0nLCc9PT0nLCchPT0nXG4gICAgdmFyIHJlc3VsdCA9IHRoaXMucGFyc2VSZWxhdGlvbmFsKCk7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbmFsT3BlcmF0b3IoJz09JykpIHtcbiAgICAgICAgcmVzdWx0ID0gbmV3IEJpbmFyeSgnPT0nLCByZXN1bHQsIHRoaXMucGFyc2VSZWxhdGlvbmFsKCkpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbmFsT3BlcmF0b3IoJz09PScpKSB7XG4gICAgICAgIHJlc3VsdCA9IG5ldyBCaW5hcnkoJz09PScsIHJlc3VsdCwgdGhpcy5wYXJzZVJlbGF0aW9uYWwoKSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9uYWxPcGVyYXRvcignIT0nKSkge1xuICAgICAgICByZXN1bHQgPSBuZXcgQmluYXJ5KCchPScsIHJlc3VsdCwgdGhpcy5wYXJzZVJlbGF0aW9uYWwoKSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9uYWxPcGVyYXRvcignIT09JykpIHtcbiAgICAgICAgcmVzdWx0ID0gbmV3IEJpbmFyeSgnIT09JywgcmVzdWx0LCB0aGlzLnBhcnNlUmVsYXRpb25hbCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcGFyc2VSZWxhdGlvbmFsKCk6IEFTVCB7XG4gICAgLy8gJzwnLCAnPicsICc8PScsICc+PSdcbiAgICB2YXIgcmVzdWx0ID0gdGhpcy5wYXJzZUFkZGl0aXZlKCk7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbmFsT3BlcmF0b3IoJzwnKSkge1xuICAgICAgICByZXN1bHQgPSBuZXcgQmluYXJ5KCc8JywgcmVzdWx0LCB0aGlzLnBhcnNlQWRkaXRpdmUoKSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9uYWxPcGVyYXRvcignPicpKSB7XG4gICAgICAgIHJlc3VsdCA9IG5ldyBCaW5hcnkoJz4nLCByZXN1bHQsIHRoaXMucGFyc2VBZGRpdGl2ZSgpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25hbE9wZXJhdG9yKCc8PScpKSB7XG4gICAgICAgIHJlc3VsdCA9IG5ldyBCaW5hcnkoJzw9JywgcmVzdWx0LCB0aGlzLnBhcnNlQWRkaXRpdmUoKSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9uYWxPcGVyYXRvcignPj0nKSkge1xuICAgICAgICByZXN1bHQgPSBuZXcgQmluYXJ5KCc+PScsIHJlc3VsdCwgdGhpcy5wYXJzZUFkZGl0aXZlKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwYXJzZUFkZGl0aXZlKCk6IEFTVCB7XG4gICAgLy8gJysnLCAnLSdcbiAgICB2YXIgcmVzdWx0ID0gdGhpcy5wYXJzZU11bHRpcGxpY2F0aXZlKCk7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbmFsT3BlcmF0b3IoJysnKSkge1xuICAgICAgICByZXN1bHQgPSBuZXcgQmluYXJ5KCcrJywgcmVzdWx0LCB0aGlzLnBhcnNlTXVsdGlwbGljYXRpdmUoKSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9uYWxPcGVyYXRvcignLScpKSB7XG4gICAgICAgIHJlc3VsdCA9IG5ldyBCaW5hcnkoJy0nLCByZXN1bHQsIHRoaXMucGFyc2VNdWx0aXBsaWNhdGl2ZSgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcGFyc2VNdWx0aXBsaWNhdGl2ZSgpOiBBU1Qge1xuICAgIC8vICcqJywgJyUnLCAnLydcbiAgICB2YXIgcmVzdWx0ID0gdGhpcy5wYXJzZVByZWZpeCgpO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25hbE9wZXJhdG9yKCcqJykpIHtcbiAgICAgICAgcmVzdWx0ID0gbmV3IEJpbmFyeSgnKicsIHJlc3VsdCwgdGhpcy5wYXJzZVByZWZpeCgpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25hbE9wZXJhdG9yKCclJykpIHtcbiAgICAgICAgcmVzdWx0ID0gbmV3IEJpbmFyeSgnJScsIHJlc3VsdCwgdGhpcy5wYXJzZVByZWZpeCgpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25hbE9wZXJhdG9yKCcvJykpIHtcbiAgICAgICAgcmVzdWx0ID0gbmV3IEJpbmFyeSgnLycsIHJlc3VsdCwgdGhpcy5wYXJzZVByZWZpeCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcGFyc2VQcmVmaXgoKTogQVNUIHtcbiAgICBpZiAodGhpcy5vcHRpb25hbE9wZXJhdG9yKCcrJykpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlUHJlZml4KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbmFsT3BlcmF0b3IoJy0nKSkge1xuICAgICAgcmV0dXJuIG5ldyBCaW5hcnkoJy0nLCBuZXcgTGl0ZXJhbFByaW1pdGl2ZSgwKSwgdGhpcy5wYXJzZVByZWZpeCgpKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9uYWxPcGVyYXRvcignIScpKSB7XG4gICAgICByZXR1cm4gbmV3IFByZWZpeE5vdCh0aGlzLnBhcnNlUHJlZml4KCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZUNhbGxDaGFpbigpO1xuICAgIH1cbiAgfVxuXG4gIHBhcnNlQ2FsbENoYWluKCk6IEFTVCB7XG4gICAgdmFyIHJlc3VsdCA9IHRoaXMucGFyc2VQcmltYXJ5KCk7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbmFsQ2hhcmFjdGVyKCRQRVJJT0QpKSB7XG4gICAgICAgIHJlc3VsdCA9IHRoaXMucGFyc2VBY2Nlc3NNZW1iZXJPck1ldGhvZENhbGwocmVzdWx0LCBmYWxzZSk7XG5cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25hbE9wZXJhdG9yKCc/LicpKSB7XG4gICAgICAgIHJlc3VsdCA9IHRoaXMucGFyc2VBY2Nlc3NNZW1iZXJPck1ldGhvZENhbGwocmVzdWx0LCB0cnVlKTtcblxuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbmFsQ2hhcmFjdGVyKCRMQlJBQ0tFVCkpIHtcbiAgICAgICAgdmFyIGtleSA9IHRoaXMucGFyc2VQaXBlKCk7XG4gICAgICAgIHRoaXMuZXhwZWN0Q2hhcmFjdGVyKCRSQlJBQ0tFVCk7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbmFsT3BlcmF0b3IoXCI9XCIpKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5wYXJzZUNvbmRpdGlvbmFsKCk7XG4gICAgICAgICAgcmVzdWx0ID0gbmV3IEtleWVkV3JpdGUocmVzdWx0LCBrZXksIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQgPSBuZXcgS2V5ZWRSZWFkKHJlc3VsdCwga2V5KTtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9uYWxDaGFyYWN0ZXIoJExQQVJFTikpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSB0aGlzLnBhcnNlQ2FsbEFyZ3VtZW50cygpO1xuICAgICAgICB0aGlzLmV4cGVjdENoYXJhY3RlcigkUlBBUkVOKTtcbiAgICAgICAgcmVzdWx0ID0gbmV3IEZ1bmN0aW9uQ2FsbChyZXN1bHQsIGFyZ3MpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHBhcnNlUHJpbWFyeSgpOiBBU1Qge1xuICAgIGlmICh0aGlzLm9wdGlvbmFsQ2hhcmFjdGVyKCRMUEFSRU4pKSB7XG4gICAgICBsZXQgcmVzdWx0ID0gdGhpcy5wYXJzZVBpcGUoKTtcbiAgICAgIHRoaXMuZXhwZWN0Q2hhcmFjdGVyKCRSUEFSRU4pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2UgaWYgKHRoaXMubmV4dC5pc0tleXdvcmROdWxsKCkgfHwgdGhpcy5uZXh0LmlzS2V5d29yZFVuZGVmaW5lZCgpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIHJldHVybiBuZXcgTGl0ZXJhbFByaW1pdGl2ZShudWxsKTtcblxuICAgIH0gZWxzZSBpZiAodGhpcy5uZXh0LmlzS2V5d29yZFRydWUoKSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICByZXR1cm4gbmV3IExpdGVyYWxQcmltaXRpdmUodHJ1ZSk7XG5cbiAgICB9IGVsc2UgaWYgKHRoaXMubmV4dC5pc0tleXdvcmRGYWxzZSgpKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIHJldHVybiBuZXcgTGl0ZXJhbFByaW1pdGl2ZShmYWxzZSk7XG5cbiAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9uYWxDaGFyYWN0ZXIoJExCUkFDS0VUKSkge1xuICAgICAgdmFyIGVsZW1lbnRzID0gdGhpcy5wYXJzZUV4cHJlc3Npb25MaXN0KCRSQlJBQ0tFVCk7XG4gICAgICB0aGlzLmV4cGVjdENoYXJhY3RlcigkUkJSQUNLRVQpO1xuICAgICAgcmV0dXJuIG5ldyBMaXRlcmFsQXJyYXkoZWxlbWVudHMpO1xuXG4gICAgfSBlbHNlIGlmICh0aGlzLm5leHQuaXNDaGFyYWN0ZXIoJExCUkFDRSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlTGl0ZXJhbE1hcCgpO1xuXG4gICAgfSBlbHNlIGlmICh0aGlzLm5leHQuaXNJZGVudGlmaWVyKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlQWNjZXNzTWVtYmVyT3JNZXRob2RDYWxsKF9pbXBsaWNpdFJlY2VpdmVyLCBmYWxzZSk7XG5cbiAgICB9IGVsc2UgaWYgKHRoaXMubmV4dC5pc051bWJlcigpKSB7XG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLm5leHQudG9OdW1iZXIoKTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgcmV0dXJuIG5ldyBMaXRlcmFsUHJpbWl0aXZlKHZhbHVlKTtcblxuICAgIH0gZWxzZSBpZiAodGhpcy5uZXh0LmlzU3RyaW5nKCkpIHtcbiAgICAgIHZhciBsaXRlcmFsVmFsdWUgPSB0aGlzLm5leHQudG9TdHJpbmcoKTtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgcmV0dXJuIG5ldyBMaXRlcmFsUHJpbWl0aXZlKGxpdGVyYWxWYWx1ZSk7XG5cbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5kZXggPj0gdGhpcy50b2tlbnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmVycm9yKGBVbmV4cGVjdGVkIGVuZCBvZiBleHByZXNzaW9uOiAke3RoaXMuaW5wdXR9YCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lcnJvcihgVW5leHBlY3RlZCB0b2tlbiAke3RoaXMubmV4dH1gKTtcbiAgICB9XG4gICAgLy8gZXJyb3IoKSB0aHJvd3MsIHNvIHdlIGRvbid0IHJlYWNoIGhlcmUuXG4gICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXCJGZWxsIHRocm91Z2ggYWxsIGNhc2VzIGluIHBhcnNlUHJpbWFyeVwiKTtcbiAgfVxuXG4gIHBhcnNlRXhwcmVzc2lvbkxpc3QodGVybWluYXRvcjogbnVtYmVyKTogYW55W10ge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBpZiAoIXRoaXMubmV4dC5pc0NoYXJhY3Rlcih0ZXJtaW5hdG9yKSkge1xuICAgICAgZG8ge1xuICAgICAgICByZXN1bHQucHVzaCh0aGlzLnBhcnNlUGlwZSgpKTtcbiAgICAgIH0gd2hpbGUgKHRoaXMub3B0aW9uYWxDaGFyYWN0ZXIoJENPTU1BKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwYXJzZUxpdGVyYWxNYXAoKTogTGl0ZXJhbE1hcCB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICB2YXIgdmFsdWVzID0gW107XG4gICAgdGhpcy5leHBlY3RDaGFyYWN0ZXIoJExCUkFDRSk7XG4gICAgaWYgKCF0aGlzLm9wdGlvbmFsQ2hhcmFjdGVyKCRSQlJBQ0UpKSB7XG4gICAgICBkbyB7XG4gICAgICAgIHZhciBrZXkgPSB0aGlzLmV4cGVjdElkZW50aWZpZXJPcktleXdvcmRPclN0cmluZygpO1xuICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgdGhpcy5leHBlY3RDaGFyYWN0ZXIoJENPTE9OKTtcbiAgICAgICAgdmFsdWVzLnB1c2godGhpcy5wYXJzZVBpcGUoKSk7XG4gICAgICB9IHdoaWxlICh0aGlzLm9wdGlvbmFsQ2hhcmFjdGVyKCRDT01NQSkpO1xuICAgICAgdGhpcy5leHBlY3RDaGFyYWN0ZXIoJFJCUkFDRSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTGl0ZXJhbE1hcChrZXlzLCB2YWx1ZXMpO1xuICB9XG5cbiAgcGFyc2VBY2Nlc3NNZW1iZXJPck1ldGhvZENhbGwocmVjZWl2ZXI6IEFTVCwgaXNTYWZlOiBib29sZWFuID0gZmFsc2UpOiBBU1Qge1xuICAgIGxldCBpZCA9IHRoaXMuZXhwZWN0SWRlbnRpZmllck9yS2V5d29yZCgpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9uYWxDaGFyYWN0ZXIoJExQQVJFTikpIHtcbiAgICAgIGxldCBhcmdzID0gdGhpcy5wYXJzZUNhbGxBcmd1bWVudHMoKTtcbiAgICAgIHRoaXMuZXhwZWN0Q2hhcmFjdGVyKCRSUEFSRU4pO1xuICAgICAgcmV0dXJuIGlzU2FmZSA/IG5ldyBTYWZlTWV0aG9kQ2FsbChyZWNlaXZlciwgaWQsIGFyZ3MpIDogbmV3IE1ldGhvZENhbGwocmVjZWl2ZXIsIGlkLCBhcmdzKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNTYWZlKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbmFsT3BlcmF0b3IoXCI9XCIpKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcihcIlRoZSAnPy4nIG9wZXJhdG9yIGNhbm5vdCBiZSB1c2VkIGluIHRoZSBhc3NpZ25tZW50XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBuZXcgU2FmZVByb3BlcnR5UmVhZChyZWNlaXZlciwgaWQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25hbE9wZXJhdG9yKFwiPVwiKSkge1xuICAgICAgICAgIGlmICghdGhpcy5wYXJzZUFjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihcIkJpbmRpbmdzIGNhbm5vdCBjb250YWluIGFzc2lnbm1lbnRzXCIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCB2YWx1ZSA9IHRoaXMucGFyc2VDb25kaXRpb25hbCgpO1xuICAgICAgICAgIHJldHVybiBuZXcgUHJvcGVydHlXcml0ZShyZWNlaXZlciwgaWQsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFByb3BlcnR5UmVhZChyZWNlaXZlciwgaWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwYXJzZUNhbGxBcmd1bWVudHMoKTogQmluZGluZ1BpcGVbXSB7XG4gICAgaWYgKHRoaXMubmV4dC5pc0NoYXJhY3RlcigkUlBBUkVOKSkgcmV0dXJuIFtdO1xuICAgIHZhciBwb3NpdGlvbmFscyA9IFtdO1xuICAgIGRvIHtcbiAgICAgIHBvc2l0aW9uYWxzLnB1c2godGhpcy5wYXJzZVBpcGUoKSk7XG4gICAgfSB3aGlsZSAodGhpcy5vcHRpb25hbENoYXJhY3RlcigkQ09NTUEpKTtcbiAgICByZXR1cm4gcG9zaXRpb25hbHM7XG4gIH1cblxuICBwYXJzZUJsb2NrQ29udGVudCgpOiBBU1Qge1xuICAgIGlmICghdGhpcy5wYXJzZUFjdGlvbikge1xuICAgICAgdGhpcy5lcnJvcihcIkJpbmRpbmcgZXhwcmVzc2lvbiBjYW5ub3QgY29udGFpbiBjaGFpbmVkIGV4cHJlc3Npb25cIik7XG4gICAgfVxuICAgIHZhciBleHBycyA9IFtdO1xuICAgIHdoaWxlICh0aGlzLmluZGV4IDwgdGhpcy50b2tlbnMubGVuZ3RoICYmICF0aGlzLm5leHQuaXNDaGFyYWN0ZXIoJFJCUkFDRSkpIHtcbiAgICAgIHZhciBleHByID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcbiAgICAgIGV4cHJzLnB1c2goZXhwcik7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbmFsQ2hhcmFjdGVyKCRTRU1JQ09MT04pKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLm9wdGlvbmFsQ2hhcmFjdGVyKCRTRU1JQ09MT04pKSB7XG4gICAgICAgIH0gIC8vIHJlYWQgYWxsIHNlbWljb2xvbnNcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGV4cHJzLmxlbmd0aCA9PSAwKSByZXR1cm4gbmV3IEVtcHR5RXhwcigpO1xuICAgIGlmIChleHBycy5sZW5ndGggPT0gMSkgcmV0dXJuIGV4cHJzWzBdO1xuXG4gICAgcmV0dXJuIG5ldyBDaGFpbihleHBycyk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBBbiBpZGVudGlmaWVyLCBhIGtleXdvcmQsIGEgc3RyaW5nIHdpdGggYW4gb3B0aW9uYWwgYC1gIGluYmV0d2Vlbi5cbiAgICovXG4gIGV4cGVjdFRlbXBsYXRlQmluZGluZ0tleSgpOiBzdHJpbmcge1xuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB2YXIgb3BlcmF0b3JGb3VuZCA9IGZhbHNlO1xuICAgIGRvIHtcbiAgICAgIHJlc3VsdCArPSB0aGlzLmV4cGVjdElkZW50aWZpZXJPcktleXdvcmRPclN0cmluZygpO1xuICAgICAgb3BlcmF0b3JGb3VuZCA9IHRoaXMub3B0aW9uYWxPcGVyYXRvcignLScpO1xuICAgICAgaWYgKG9wZXJhdG9yRm91bmQpIHtcbiAgICAgICAgcmVzdWx0ICs9ICctJztcbiAgICAgIH1cbiAgICB9IHdoaWxlIChvcGVyYXRvckZvdW5kKTtcblxuICAgIHJldHVybiByZXN1bHQudG9TdHJpbmcoKTtcbiAgfVxuXG4gIHBhcnNlVGVtcGxhdGVCaW5kaW5ncygpOiBhbnlbXSB7XG4gICAgdmFyIGJpbmRpbmdzID0gW107XG4gICAgdmFyIHByZWZpeCA9IG51bGw7XG4gICAgd2hpbGUgKHRoaXMuaW5kZXggPCB0aGlzLnRva2Vucy5sZW5ndGgpIHtcbiAgICAgIHZhciBrZXlJc1ZhcjogYm9vbGVhbiA9IHRoaXMub3B0aW9uYWxLZXl3b3JkVmFyKCk7XG4gICAgICB2YXIga2V5ID0gdGhpcy5leHBlY3RUZW1wbGF0ZUJpbmRpbmdLZXkoKTtcbiAgICAgIGlmICgha2V5SXNWYXIpIHtcbiAgICAgICAgaWYgKHByZWZpeCA9PSBudWxsKSB7XG4gICAgICAgICAgcHJlZml4ID0ga2V5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGtleSA9IHByZWZpeCArIGtleVswXS50b1VwcGVyQ2FzZSgpICsga2V5LnN1YnN0cmluZygxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5vcHRpb25hbENoYXJhY3RlcigkQ09MT04pO1xuICAgICAgdmFyIG5hbWUgPSBudWxsO1xuICAgICAgdmFyIGV4cHJlc3Npb24gPSBudWxsO1xuICAgICAgaWYgKGtleUlzVmFyKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbmFsT3BlcmF0b3IoXCI9XCIpKSB7XG4gICAgICAgICAgbmFtZSA9IHRoaXMuZXhwZWN0VGVtcGxhdGVCaW5kaW5nS2V5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmFtZSA9ICdcXCRpbXBsaWNpdCc7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5uZXh0ICE9PSBFT0YgJiYgIXRoaXMucGVla0tleXdvcmRWYXIoKSkge1xuICAgICAgICB2YXIgc3RhcnQgPSB0aGlzLmlucHV0SW5kZXg7XG4gICAgICAgIHZhciBhc3QgPSB0aGlzLnBhcnNlUGlwZSgpO1xuICAgICAgICB2YXIgc291cmNlID0gdGhpcy5pbnB1dC5zdWJzdHJpbmcoc3RhcnQsIHRoaXMuaW5wdXRJbmRleCk7XG4gICAgICAgIGV4cHJlc3Npb24gPSBuZXcgQVNUV2l0aFNvdXJjZShhc3QsIHNvdXJjZSwgdGhpcy5sb2NhdGlvbik7XG4gICAgICB9XG4gICAgICBiaW5kaW5ncy5wdXNoKG5ldyBUZW1wbGF0ZUJpbmRpbmcoa2V5LCBrZXlJc1ZhciwgbmFtZSwgZXhwcmVzc2lvbikpO1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbmFsQ2hhcmFjdGVyKCRTRU1JQ09MT04pKSB7XG4gICAgICAgIHRoaXMub3B0aW9uYWxDaGFyYWN0ZXIoJENPTU1BKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJpbmRpbmdzO1xuICB9XG5cbiAgZXJyb3IobWVzc2FnZTogc3RyaW5nLCBpbmRleDogbnVtYmVyID0gbnVsbCkge1xuICAgIGlmIChpc0JsYW5rKGluZGV4KSkgaW5kZXggPSB0aGlzLmluZGV4O1xuXG4gICAgdmFyIGxvY2F0aW9uID0gKGluZGV4IDwgdGhpcy50b2tlbnMubGVuZ3RoKSA/IGBhdCBjb2x1bW4gJHt0aGlzLnRva2Vuc1tpbmRleF0uaW5kZXggKyAxfSBpbmAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgYXQgdGhlIGVuZCBvZiB0aGUgZXhwcmVzc2lvbmA7XG5cbiAgICB0aHJvdyBuZXcgUGFyc2VFeGNlcHRpb24obWVzc2FnZSwgdGhpcy5pbnB1dCwgbG9jYXRpb24sIHRoaXMubG9jYXRpb24pO1xuICB9XG59XG5cbmNsYXNzIFNpbXBsZUV4cHJlc3Npb25DaGVja2VyIGltcGxlbWVudHMgQXN0VmlzaXRvciB7XG4gIHN0YXRpYyBjaGVjayhhc3Q6IEFTVCk6IGJvb2xlYW4ge1xuICAgIHZhciBzID0gbmV3IFNpbXBsZUV4cHJlc3Npb25DaGVja2VyKCk7XG4gICAgYXN0LnZpc2l0KHMpO1xuICAgIHJldHVybiBzLnNpbXBsZTtcbiAgfVxuXG4gIHNpbXBsZSA9IHRydWU7XG5cbiAgdmlzaXRJbXBsaWNpdFJlY2VpdmVyKGFzdDogSW1wbGljaXRSZWNlaXZlciwgY29udGV4dDogYW55KSB7fVxuXG4gIHZpc2l0SW50ZXJwb2xhdGlvbihhc3Q6IEludGVycG9sYXRpb24sIGNvbnRleHQ6IGFueSkgeyB0aGlzLnNpbXBsZSA9IGZhbHNlOyB9XG5cbiAgdmlzaXRMaXRlcmFsUHJpbWl0aXZlKGFzdDogTGl0ZXJhbFByaW1pdGl2ZSwgY29udGV4dDogYW55KSB7fVxuXG4gIHZpc2l0UHJvcGVydHlSZWFkKGFzdDogUHJvcGVydHlSZWFkLCBjb250ZXh0OiBhbnkpIHt9XG5cbiAgdmlzaXRQcm9wZXJ0eVdyaXRlKGFzdDogUHJvcGVydHlXcml0ZSwgY29udGV4dDogYW55KSB7IHRoaXMuc2ltcGxlID0gZmFsc2U7IH1cblxuICB2aXNpdFNhZmVQcm9wZXJ0eVJlYWQoYXN0OiBTYWZlUHJvcGVydHlSZWFkLCBjb250ZXh0OiBhbnkpIHsgdGhpcy5zaW1wbGUgPSBmYWxzZTsgfVxuXG4gIHZpc2l0TWV0aG9kQ2FsbChhc3Q6IE1ldGhvZENhbGwsIGNvbnRleHQ6IGFueSkgeyB0aGlzLnNpbXBsZSA9IGZhbHNlOyB9XG5cbiAgdmlzaXRTYWZlTWV0aG9kQ2FsbChhc3Q6IFNhZmVNZXRob2RDYWxsLCBjb250ZXh0OiBhbnkpIHsgdGhpcy5zaW1wbGUgPSBmYWxzZTsgfVxuXG4gIHZpc2l0RnVuY3Rpb25DYWxsKGFzdDogRnVuY3Rpb25DYWxsLCBjb250ZXh0OiBhbnkpIHsgdGhpcy5zaW1wbGUgPSBmYWxzZTsgfVxuXG4gIHZpc2l0TGl0ZXJhbEFycmF5KGFzdDogTGl0ZXJhbEFycmF5LCBjb250ZXh0OiBhbnkpIHsgdGhpcy52aXNpdEFsbChhc3QuZXhwcmVzc2lvbnMpOyB9XG5cbiAgdmlzaXRMaXRlcmFsTWFwKGFzdDogTGl0ZXJhbE1hcCwgY29udGV4dDogYW55KSB7IHRoaXMudmlzaXRBbGwoYXN0LnZhbHVlcyk7IH1cblxuICB2aXNpdEJpbmFyeShhc3Q6IEJpbmFyeSwgY29udGV4dDogYW55KSB7IHRoaXMuc2ltcGxlID0gZmFsc2U7IH1cblxuICB2aXNpdFByZWZpeE5vdChhc3Q6IFByZWZpeE5vdCwgY29udGV4dDogYW55KSB7IHRoaXMuc2ltcGxlID0gZmFsc2U7IH1cblxuICB2aXNpdENvbmRpdGlvbmFsKGFzdDogQ29uZGl0aW9uYWwsIGNvbnRleHQ6IGFueSkgeyB0aGlzLnNpbXBsZSA9IGZhbHNlOyB9XG5cbiAgdmlzaXRQaXBlKGFzdDogQmluZGluZ1BpcGUsIGNvbnRleHQ6IGFueSkgeyB0aGlzLnNpbXBsZSA9IGZhbHNlOyB9XG5cbiAgdmlzaXRLZXllZFJlYWQoYXN0OiBLZXllZFJlYWQsIGNvbnRleHQ6IGFueSkgeyB0aGlzLnNpbXBsZSA9IGZhbHNlOyB9XG5cbiAgdmlzaXRLZXllZFdyaXRlKGFzdDogS2V5ZWRXcml0ZSwgY29udGV4dDogYW55KSB7IHRoaXMuc2ltcGxlID0gZmFsc2U7IH1cblxuICB2aXNpdEFsbChhc3RzOiBhbnlbXSk6IGFueVtdIHtcbiAgICB2YXIgcmVzID0gTGlzdFdyYXBwZXIuY3JlYXRlRml4ZWRTaXplKGFzdHMubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFzdHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHJlc1tpXSA9IGFzdHNbaV0udmlzaXQodGhpcyk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICB2aXNpdENoYWluKGFzdDogQ2hhaW4sIGNvbnRleHQ6IGFueSkgeyB0aGlzLnNpbXBsZSA9IGZhbHNlOyB9XG5cbiAgdmlzaXRRdW90ZShhc3Q6IFF1b3RlLCBjb250ZXh0OiBhbnkpIHsgdGhpcy5zaW1wbGUgPSBmYWxzZTsgfVxufVxuIl19