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
var collection_1 = require("angular2/src/facade/collection");
var lang_1 = require("angular2/src/facade/lang");
var exceptions_1 = require('angular2/src/facade/exceptions');
(function (TokenType) {
    TokenType[TokenType["Character"] = 0] = "Character";
    TokenType[TokenType["Identifier"] = 1] = "Identifier";
    TokenType[TokenType["Keyword"] = 2] = "Keyword";
    TokenType[TokenType["String"] = 3] = "String";
    TokenType[TokenType["Operator"] = 4] = "Operator";
    TokenType[TokenType["Number"] = 5] = "Number";
})(exports.TokenType || (exports.TokenType = {}));
var TokenType = exports.TokenType;
var Lexer = (function () {
    function Lexer() {
    }
    Lexer.prototype.tokenize = function (text) {
        var scanner = new _Scanner(text);
        var tokens = [];
        var token = scanner.scanToken();
        while (token != null) {
            tokens.push(token);
            token = scanner.scanToken();
        }
        return tokens;
    };
    Lexer = __decorate([
        decorators_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], Lexer);
    return Lexer;
}());
exports.Lexer = Lexer;
var Token = (function () {
    function Token(index, type, numValue, strValue) {
        this.index = index;
        this.type = type;
        this.numValue = numValue;
        this.strValue = strValue;
    }
    Token.prototype.isCharacter = function (code) {
        return (this.type == TokenType.Character && this.numValue == code);
    };
    Token.prototype.isNumber = function () { return (this.type == TokenType.Number); };
    Token.prototype.isString = function () { return (this.type == TokenType.String); };
    Token.prototype.isOperator = function (operater) {
        return (this.type == TokenType.Operator && this.strValue == operater);
    };
    Token.prototype.isIdentifier = function () { return (this.type == TokenType.Identifier); };
    Token.prototype.isKeyword = function () { return (this.type == TokenType.Keyword); };
    Token.prototype.isKeywordVar = function () { return (this.type == TokenType.Keyword && this.strValue == "var"); };
    Token.prototype.isKeywordNull = function () { return (this.type == TokenType.Keyword && this.strValue == "null"); };
    Token.prototype.isKeywordUndefined = function () {
        return (this.type == TokenType.Keyword && this.strValue == "undefined");
    };
    Token.prototype.isKeywordTrue = function () { return (this.type == TokenType.Keyword && this.strValue == "true"); };
    Token.prototype.isKeywordFalse = function () { return (this.type == TokenType.Keyword && this.strValue == "false"); };
    Token.prototype.toNumber = function () {
        // -1 instead of NULL ok?
        return (this.type == TokenType.Number) ? this.numValue : -1;
    };
    Token.prototype.toString = function () {
        switch (this.type) {
            case TokenType.Character:
            case TokenType.Identifier:
            case TokenType.Keyword:
            case TokenType.Operator:
            case TokenType.String:
                return this.strValue;
            case TokenType.Number:
                return this.numValue.toString();
            default:
                return null;
        }
    };
    return Token;
}());
exports.Token = Token;
function newCharacterToken(index, code) {
    return new Token(index, TokenType.Character, code, lang_1.StringWrapper.fromCharCode(code));
}
function newIdentifierToken(index, text) {
    return new Token(index, TokenType.Identifier, 0, text);
}
function newKeywordToken(index, text) {
    return new Token(index, TokenType.Keyword, 0, text);
}
function newOperatorToken(index, text) {
    return new Token(index, TokenType.Operator, 0, text);
}
function newStringToken(index, text) {
    return new Token(index, TokenType.String, 0, text);
}
function newNumberToken(index, n) {
    return new Token(index, TokenType.Number, n, "");
}
exports.EOF = new Token(-1, TokenType.Character, 0, "");
exports.$EOF = 0;
exports.$TAB = 9;
exports.$LF = 10;
exports.$VTAB = 11;
exports.$FF = 12;
exports.$CR = 13;
exports.$SPACE = 32;
exports.$BANG = 33;
exports.$DQ = 34;
exports.$HASH = 35;
exports.$$ = 36;
exports.$PERCENT = 37;
exports.$AMPERSAND = 38;
exports.$SQ = 39;
exports.$LPAREN = 40;
exports.$RPAREN = 41;
exports.$STAR = 42;
exports.$PLUS = 43;
exports.$COMMA = 44;
exports.$MINUS = 45;
exports.$PERIOD = 46;
exports.$SLASH = 47;
exports.$COLON = 58;
exports.$SEMICOLON = 59;
exports.$LT = 60;
exports.$EQ = 61;
exports.$GT = 62;
exports.$QUESTION = 63;
var $0 = 48;
var $9 = 57;
var $A = 65, $E = 69, $Z = 90;
exports.$LBRACKET = 91;
exports.$BACKSLASH = 92;
exports.$RBRACKET = 93;
var $CARET = 94;
var $_ = 95;
exports.$BT = 96;
var $a = 97, $e = 101, $f = 102, $n = 110, $r = 114, $t = 116, $u = 117, $v = 118, $z = 122;
exports.$LBRACE = 123;
exports.$BAR = 124;
exports.$RBRACE = 125;
var $NBSP = 160;
var ScannerError = (function (_super) {
    __extends(ScannerError, _super);
    function ScannerError(message) {
        _super.call(this);
        this.message = message;
    }
    ScannerError.prototype.toString = function () { return this.message; };
    return ScannerError;
}(exceptions_1.BaseException));
exports.ScannerError = ScannerError;
var _Scanner = (function () {
    function _Scanner(input) {
        this.input = input;
        this.peek = 0;
        this.index = -1;
        this.length = input.length;
        this.advance();
    }
    _Scanner.prototype.advance = function () {
        this.peek =
            ++this.index >= this.length ? exports.$EOF : lang_1.StringWrapper.charCodeAt(this.input, this.index);
    };
    _Scanner.prototype.scanToken = function () {
        var input = this.input, length = this.length, peek = this.peek, index = this.index;
        // Skip whitespace.
        while (peek <= exports.$SPACE) {
            if (++index >= length) {
                peek = exports.$EOF;
                break;
            }
            else {
                peek = lang_1.StringWrapper.charCodeAt(input, index);
            }
        }
        this.peek = peek;
        this.index = index;
        if (index >= length) {
            return null;
        }
        // Handle identifiers and numbers.
        if (isIdentifierStart(peek))
            return this.scanIdentifier();
        if (isDigit(peek))
            return this.scanNumber(index);
        var start = index;
        switch (peek) {
            case exports.$PERIOD:
                this.advance();
                return isDigit(this.peek) ? this.scanNumber(start) : newCharacterToken(start, exports.$PERIOD);
            case exports.$LPAREN:
            case exports.$RPAREN:
            case exports.$LBRACE:
            case exports.$RBRACE:
            case exports.$LBRACKET:
            case exports.$RBRACKET:
            case exports.$COMMA:
            case exports.$COLON:
            case exports.$SEMICOLON:
                return this.scanCharacter(start, peek);
            case exports.$SQ:
            case exports.$DQ:
                return this.scanString();
            case exports.$HASH:
            case exports.$PLUS:
            case exports.$MINUS:
            case exports.$STAR:
            case exports.$SLASH:
            case exports.$PERCENT:
            case $CARET:
                return this.scanOperator(start, lang_1.StringWrapper.fromCharCode(peek));
            case exports.$QUESTION:
                return this.scanComplexOperator(start, '?', exports.$PERIOD, '.');
            case exports.$LT:
            case exports.$GT:
                return this.scanComplexOperator(start, lang_1.StringWrapper.fromCharCode(peek), exports.$EQ, '=');
            case exports.$BANG:
            case exports.$EQ:
                return this.scanComplexOperator(start, lang_1.StringWrapper.fromCharCode(peek), exports.$EQ, '=', exports.$EQ, '=');
            case exports.$AMPERSAND:
                return this.scanComplexOperator(start, '&', exports.$AMPERSAND, '&');
            case exports.$BAR:
                return this.scanComplexOperator(start, '|', exports.$BAR, '|');
            case $NBSP:
                while (isWhitespace(this.peek))
                    this.advance();
                return this.scanToken();
        }
        this.error("Unexpected character [" + lang_1.StringWrapper.fromCharCode(peek) + "]", 0);
        return null;
    };
    _Scanner.prototype.scanCharacter = function (start, code) {
        this.advance();
        return newCharacterToken(start, code);
    };
    _Scanner.prototype.scanOperator = function (start, str) {
        this.advance();
        return newOperatorToken(start, str);
    };
    /**
     * Tokenize a 2/3 char long operator
     *
     * @param start start index in the expression
     * @param one first symbol (always part of the operator)
     * @param twoCode code point for the second symbol
     * @param two second symbol (part of the operator when the second code point matches)
     * @param threeCode code point for the third symbol
     * @param three third symbol (part of the operator when provided and matches source expression)
     * @returns {Token}
     */
    _Scanner.prototype.scanComplexOperator = function (start, one, twoCode, two, threeCode, three) {
        this.advance();
        var str = one;
        if (this.peek == twoCode) {
            this.advance();
            str += two;
        }
        if (lang_1.isPresent(threeCode) && this.peek == threeCode) {
            this.advance();
            str += three;
        }
        return newOperatorToken(start, str);
    };
    _Scanner.prototype.scanIdentifier = function () {
        var start = this.index;
        this.advance();
        while (isIdentifierPart(this.peek))
            this.advance();
        var str = this.input.substring(start, this.index);
        if (collection_1.SetWrapper.has(KEYWORDS, str)) {
            return newKeywordToken(start, str);
        }
        else {
            return newIdentifierToken(start, str);
        }
    };
    _Scanner.prototype.scanNumber = function (start) {
        var simple = (this.index === start);
        this.advance(); // Skip initial digit.
        while (true) {
            if (isDigit(this.peek)) {
            }
            else if (this.peek == exports.$PERIOD) {
                simple = false;
            }
            else if (isExponentStart(this.peek)) {
                this.advance();
                if (isExponentSign(this.peek))
                    this.advance();
                if (!isDigit(this.peek))
                    this.error('Invalid exponent', -1);
                simple = false;
            }
            else {
                break;
            }
            this.advance();
        }
        var str = this.input.substring(start, this.index);
        // TODO
        var value = simple ? lang_1.NumberWrapper.parseIntAutoRadix(str) : lang_1.NumberWrapper.parseFloat(str);
        return newNumberToken(start, value);
    };
    _Scanner.prototype.scanString = function () {
        var start = this.index;
        var quote = this.peek;
        this.advance(); // Skip initial quote.
        var buffer;
        var marker = this.index;
        var input = this.input;
        while (this.peek != quote) {
            if (this.peek == exports.$BACKSLASH) {
                if (buffer == null)
                    buffer = new lang_1.StringJoiner();
                buffer.add(input.substring(marker, this.index));
                this.advance();
                var unescapedCode;
                if (this.peek == $u) {
                    // 4 character hex code for unicode character.
                    var hex = input.substring(this.index + 1, this.index + 5);
                    try {
                        unescapedCode = lang_1.NumberWrapper.parseInt(hex, 16);
                    }
                    catch (e) {
                        this.error("Invalid unicode escape [\\u" + hex + "]", 0);
                    }
                    for (var i = 0; i < 5; i++) {
                        this.advance();
                    }
                }
                else {
                    unescapedCode = unescape(this.peek);
                    this.advance();
                }
                buffer.add(lang_1.StringWrapper.fromCharCode(unescapedCode));
                marker = this.index;
            }
            else if (this.peek == exports.$EOF) {
                this.error('Unterminated quote', 0);
            }
            else {
                this.advance();
            }
        }
        var last = input.substring(marker, this.index);
        this.advance(); // Skip terminating quote.
        // Compute the unescaped string value.
        var unescaped = last;
        if (buffer != null) {
            buffer.add(last);
            unescaped = buffer.toString();
        }
        return newStringToken(start, unescaped);
    };
    _Scanner.prototype.error = function (message, offset) {
        var position = this.index + offset;
        throw new ScannerError("Lexer Error: " + message + " at column " + position + " in expression [" + this.input + "]");
    };
    return _Scanner;
}());
function isWhitespace(code) {
    return (code >= exports.$TAB && code <= exports.$SPACE) || (code == $NBSP);
}
function isIdentifierStart(code) {
    return ($a <= code && code <= $z) || ($A <= code && code <= $Z) || (code == $_) || (code == exports.$$);
}
function isIdentifier(input) {
    if (input.length == 0)
        return false;
    var scanner = new _Scanner(input);
    if (!isIdentifierStart(scanner.peek))
        return false;
    scanner.advance();
    while (scanner.peek !== exports.$EOF) {
        if (!isIdentifierPart(scanner.peek))
            return false;
        scanner.advance();
    }
    return true;
}
exports.isIdentifier = isIdentifier;
function isIdentifierPart(code) {
    return ($a <= code && code <= $z) || ($A <= code && code <= $Z) || ($0 <= code && code <= $9) ||
        (code == $_) || (code == exports.$$);
}
function isDigit(code) {
    return $0 <= code && code <= $9;
}
function isExponentStart(code) {
    return code == $e || code == $E;
}
function isExponentSign(code) {
    return code == exports.$MINUS || code == exports.$PLUS;
}
function isQuote(code) {
    return code === exports.$SQ || code === exports.$DQ || code === exports.$BT;
}
exports.isQuote = isQuote;
function unescape(code) {
    switch (code) {
        case $n:
            return exports.$LF;
        case $f:
            return exports.$FF;
        case $r:
            return exports.$CR;
        case $t:
            return exports.$TAB;
        case $v:
            return exports.$VTAB;
        default:
            return code;
    }
}
var OPERATORS = collection_1.SetWrapper.createFromList([
    '+',
    '-',
    '*',
    '/',
    '%',
    '^',
    '=',
    '==',
    '!=',
    '===',
    '!==',
    '<',
    '>',
    '<=',
    '>=',
    '&&',
    '||',
    '&',
    '|',
    '!',
    '?',
    '#',
    '?.'
]);
var KEYWORDS = collection_1.SetWrapper.createFromList(['var', 'null', 'undefined', 'true', 'false', 'if', 'else']);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV4ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLTRubzNaUXZPLnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvZXhwcmVzc2lvbl9wYXJzZXIvbGV4ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkJBQXlCLGlDQUFpQyxDQUFDLENBQUE7QUFDM0QsMkJBQXNDLGdDQUFnQyxDQUFDLENBQUE7QUFDdkUscUJBQW9FLDBCQUEwQixDQUFDLENBQUE7QUFDL0YsMkJBQTRCLGdDQUFnQyxDQUFDLENBQUE7QUFFN0QsV0FBWSxTQUFTO0lBQ25CLG1EQUFTLENBQUE7SUFDVCxxREFBVSxDQUFBO0lBQ1YsK0NBQU8sQ0FBQTtJQUNQLDZDQUFNLENBQUE7SUFDTixpREFBUSxDQUFBO0lBQ1IsNkNBQU0sQ0FBQTtBQUNSLENBQUMsRUFQVyxpQkFBUyxLQUFULGlCQUFTLFFBT3BCO0FBUEQsSUFBWSxTQUFTLEdBQVQsaUJBT1gsQ0FBQTtBQUdEO0lBQUE7SUFXQSxDQUFDO0lBVkMsd0JBQVEsR0FBUixVQUFTLElBQVk7UUFDbkIsSUFBSSxPQUFPLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoQyxPQUFPLEtBQUssSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25CLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDOUIsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQVhIO1FBQUMsdUJBQVUsRUFBRTs7YUFBQTtJQVliLFlBQUM7QUFBRCxDQUFDLEFBWEQsSUFXQztBQVhZLGFB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QUs7SUFDTCxHQUFHO0lBQ0gsR0FBRztJQUNILElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixHQUFHO0lBQ0gsR0FBRztJQUNILEdBQUc7SUFDSCxHQUFHO0lBQ0gsR0FBRztJQUNILElBQUk7Q0FDTCxDQUFDLENBQUM7QUFHSCxJQUFJLFFBQVEsR0FDUix1QkFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpL2RlY29yYXRvcnMnO1xuaW1wb3J0IHtMaXN0V3JhcHBlciwgU2V0V3JhcHBlcn0gZnJvbSBcImFuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvblwiO1xuaW1wb3J0IHtOdW1iZXJXcmFwcGVyLCBTdHJpbmdKb2luZXIsIFN0cmluZ1dyYXBwZXIsIGlzUHJlc2VudH0gZnJvbSBcImFuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZ1wiO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuXG5leHBvcnQgZW51bSBUb2tlblR5cGUge1xuICBDaGFyYWN0ZXIsXG4gIElkZW50aWZpZXIsXG4gIEtleXdvcmQsXG4gIFN0cmluZyxcbiAgT3BlcmF0b3IsXG4gIE51bWJlclxufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTGV4ZXIge1xuICB0b2tlbml6ZSh0ZXh0OiBzdHJpbmcpOiBhbnlbXSB7XG4gICAgdmFyIHNjYW5uZXIgPSBuZXcgX1NjYW5uZXIodGV4dCk7XG4gICAgdmFyIHRva2VucyA9IFtdO1xuICAgIHZhciB0b2tlbiA9IHNjYW5uZXIuc2NhblRva2VuKCk7XG4gICAgd2hpbGUgKHRva2VuICE9IG51bGwpIHtcbiAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgIHRva2VuID0gc2Nhbm5lci5zY2FuVG9rZW4oKTtcbiAgICB9XG4gICAgcmV0dXJuIHRva2VucztcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVG9rZW4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgaW5kZXg6IG51bWJlciwgcHVibGljIHR5cGU6IFRva2VuVHlwZSwgcHVibGljIG51bVZhbHVlOiBudW1iZXIsXG4gICAgICAgICAgICAgIHB1YmxpYyBzdHJWYWx1ZTogc3RyaW5nKSB7fVxuXG4gIGlzQ2hhcmFjdGVyKGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy50eXBlID09IFRva2VuVHlwZS5DaGFyYWN0ZXIgJiYgdGhpcy5udW1WYWx1ZSA9PSBjb2RlKTtcbiAgfVxuXG4gIGlzTnVtYmVyKCk6IGJvb2xlYW4geyByZXR1cm4gKHRoaXMudHlwZSA9PSBUb2tlblR5cGUuTnVtYmVyKTsgfVxuXG4gIGlzU3RyaW5nKCk6IGJvb2xlYW4geyByZXR1cm4gKHRoaXMudHlwZSA9PSBUb2tlblR5cGUuU3RyaW5nKTsgfVxuXG4gIGlzT3BlcmF0b3Iob3BlcmF0ZXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy50eXBlID09IFRva2VuVHlwZS5PcGVyYXRvciAmJiB0aGlzLnN0clZhbHVlID09IG9wZXJhdGVyKTtcbiAgfVxuXG4gIGlzSWRlbnRpZmllcigpOiBib29sZWFuIHsgcmV0dXJuICh0aGlzLnR5cGUgPT0gVG9rZW5UeXBlLklkZW50aWZpZXIpOyB9XG5cbiAgaXNLZXl3b3JkKCk6IGJvb2xlYW4geyByZXR1cm4gKHRoaXMudHlwZSA9PSBUb2tlblR5cGUuS2V5d29yZCk7IH1cblxuICBpc0tleXdvcmRWYXIoKTogYm9vbGVhbiB7IHJldHVybiAodGhpcy50eXBlID09IFRva2VuVHlwZS5LZXl3b3JkICYmIHRoaXMuc3RyVmFsdWUgPT0gXCJ2YXJcIik7IH1cblxuICBpc0tleXdvcmROdWxsKCk6IGJvb2xlYW4geyByZXR1cm4gKHRoaXMudHlwZSA9PSBUb2tlblR5cGUuS2V5d29yZCAmJiB0aGlzLnN0clZhbHVlID09IFwibnVsbFwiKTsgfVxuXG4gIGlzS2V5d29yZFVuZGVmaW5lZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMudHlwZSA9PSBUb2tlblR5cGUuS2V5d29yZCAmJiB0aGlzLnN0clZhbHVlID09IFwidW5kZWZpbmVkXCIpO1xuICB9XG5cbiAgaXNLZXl3b3JkVHJ1ZSgpOiBib29sZWFuIHsgcmV0dXJuICh0aGlzLnR5cGUgPT0gVG9rZW5UeXBlLktleXdvcmQgJiYgdGhpcy5zdHJWYWx1ZSA9PSBcInRydWVcIik7IH1cblxuICBpc0tleXdvcmRGYWxzZSgpOiBib29sZWFuIHsgcmV0dXJuICh0aGlzLnR5cGUgPT0gVG9rZW5UeXBlLktleXdvcmQgJiYgdGhpcy5zdHJWYWx1ZSA9PSBcImZhbHNlXCIpOyB9XG5cbiAgdG9OdW1iZXIoKTogbnVtYmVyIHtcbiAgICAvLyAtMSBpbnN0ZWFkIG9mIE5VTEwgb2s/XG4gICAgcmV0dXJuICh0aGlzLnR5cGUgPT0gVG9rZW5UeXBlLk51bWJlcikgPyB0aGlzLm51bVZhbHVlIDogLTE7XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICBjYXNlIFRva2VuVHlwZS5DaGFyYWN0ZXI6XG4gICAgICBjYXNlIFRva2VuVHlwZS5JZGVudGlmaWVyOlxuICAgICAgY2FzZSBUb2tlblR5cGUuS2V5d29yZDpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk9wZXJhdG9yOlxuICAgICAgY2FzZSBUb2tlblR5cGUuU3RyaW5nOlxuICAgICAgICByZXR1cm4gdGhpcy5zdHJWYWx1ZTtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk51bWJlcjpcbiAgICAgICAgcmV0dXJuIHRoaXMubnVtVmFsdWUudG9TdHJpbmcoKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBuZXdDaGFyYWN0ZXJUb2tlbihpbmRleDogbnVtYmVyLCBjb2RlOiBudW1iZXIpOiBUb2tlbiB7XG4gIHJldHVybiBuZXcgVG9rZW4oaW5kZXgsIFRva2VuVHlwZS5DaGFyYWN0ZXIsIGNvZGUsIFN0cmluZ1dyYXBwZXIuZnJvbUNoYXJDb2RlKGNvZGUpKTtcbn1cblxuZnVuY3Rpb24gbmV3SWRlbnRpZmllclRva2VuKGluZGV4OiBudW1iZXIsIHRleHQ6IHN0cmluZyk6IFRva2VuIHtcbiAgcmV0dXJuIG5ldyBUb2tlbihpbmRleCwgVG9rZW5UeXBlLklkZW50aWZpZXIsIDAsIHRleHQpO1xufVxuXG5mdW5jdGlvbiBuZXdLZXl3b3JkVG9rZW4oaW5kZXg6IG51bWJlciwgdGV4dDogc3RyaW5nKTogVG9rZW4ge1xuICByZXR1cm4gbmV3IFRva2VuKGluZGV4LCBUb2tlblR5cGUuS2V5d29yZCwgMCwgdGV4dCk7XG59XG5cbmZ1bmN0aW9uIG5ld09wZXJhdG9yVG9rZW4oaW5kZXg6IG51bWJlciwgdGV4dDogc3RyaW5nKTogVG9rZW4ge1xuICByZXR1cm4gbmV3IFRva2VuKGluZGV4LCBUb2tlblR5cGUuT3BlcmF0b3IsIDAsIHRleHQpO1xufVxuXG5mdW5jdGlvbiBuZXdTdHJpbmdUb2tlbihpbmRleDogbnVtYmVyLCB0ZXh0OiBzdHJpbmcpOiBUb2tlbiB7XG4gIHJldHVybiBuZXcgVG9rZW4oaW5kZXgsIFRva2VuVHlwZS5TdHJpbmcsIDAsIHRleHQpO1xufVxuXG5mdW5jdGlvbiBuZXdOdW1iZXJUb2tlbihpbmRleDogbnVtYmVyLCBuOiBudW1iZXIpOiBUb2tlbiB7XG4gIHJldHVybiBuZXcgVG9rZW4oaW5kZXgsIFRva2VuVHlwZS5OdW1iZXIsIG4sIFwiXCIpO1xufVxuXG5cbmV4cG9ydCB2YXIgRU9GOiBUb2tlbiA9IG5ldyBUb2tlbigtMSwgVG9rZW5UeXBlLkNoYXJhY3RlciwgMCwgXCJcIik7XG5cbmV4cG9ydCBjb25zdCAkRU9GID0gMDtcbmV4cG9ydCBjb25zdCAkVEFCID0gOTtcbmV4cG9ydCBjb25zdCAkTEYgPSAxMDtcbmV4cG9ydCBjb25zdCAkVlRBQiA9IDExO1xuZXhwb3J0IGNvbnN0ICRGRiA9IDEyO1xuZXhwb3J0IGNvbnN0ICRDUiA9IDEzO1xuZXhwb3J0IGNvbnN0ICRTUEFDRSA9IDMyO1xuZXhwb3J0IGNvbnN0ICRCQU5HID0gMzM7XG5leHBvcnQgY29uc3QgJERRID0gMzQ7XG5leHBvcnQgY29uc3QgJEhBU0ggPSAzNTtcbmV4cG9ydCBjb25zdCAkJCA9IDM2O1xuZXhwb3J0IGNvbnN0ICRQRVJDRU5UID0gMzc7XG5leHBvcnQgY29uc3QgJEFNUEVSU0FORCA9IDM4O1xuZXhwb3J0IGNvbnN0ICRTUSA9IDM5O1xuZXhwb3J0IGNvbnN0ICRMUEFSRU4gPSA0MDtcbmV4cG9ydCBjb25zdCAkUlBBUkVOID0gNDE7XG5leHBvcnQgY29uc3QgJFNUQVIgPSA0MjtcbmV4cG9ydCBjb25zdCAkUExVUyA9IDQzO1xuZXhwb3J0IGNvbnN0ICRDT01NQSA9IDQ0O1xuZXhwb3J0IGNvbnN0ICRNSU5VUyA9IDQ1O1xuZXhwb3J0IGNvbnN0ICRQRVJJT0QgPSA0NjtcbmV4cG9ydCBjb25zdCAkU0xBU0ggPSA0NztcbmV4cG9ydCBjb25zdCAkQ09MT04gPSA1ODtcbmV4cG9ydCBjb25zdCAkU0VNSUNPTE9OID0gNTk7XG5leHBvcnQgY29uc3QgJExUID0gNjA7XG5leHBvcnQgY29uc3QgJEVRID0gNjE7XG5leHBvcnQgY29uc3QgJEdUID0gNjI7XG5leHBvcnQgY29uc3QgJFFVRVNUSU9OID0gNjM7XG5cbmNvbnN0ICQwID0gNDg7XG5jb25zdCAkOSA9IDU3O1xuXG5jb25zdCAkQSA9IDY1LCAkRSA9IDY5LCAkWiA9IDkwO1xuXG5leHBvcnQgY29uc3QgJExCUkFDS0VUID0gOTE7XG5leHBvcnQgY29uc3QgJEJBQ0tTTEFTSCA9IDkyO1xuZXhwb3J0IGNvbnN0ICRSQlJBQ0tFVCA9IDkzO1xuY29uc3QgJENBUkVUID0gOTQ7XG5jb25zdCAkXyA9IDk1O1xuZXhwb3J0IGNvbnN0ICRCVCA9IDk2O1xuY29uc3QgJGEgPSA5NywgJGUgPSAxMDEsICRmID0gMTAyLCAkbiA9IDExMCwgJHIgPSAxMTQsICR0ID0gMTE2LCAkdSA9IDExNywgJHYgPSAxMTgsICR6ID0gMTIyO1xuXG5leHBvcnQgY29uc3QgJExCUkFDRSA9IDEyMztcbmV4cG9ydCBjb25zdCAkQkFSID0gMTI0O1xuZXhwb3J0IGNvbnN0ICRSQlJBQ0UgPSAxMjU7XG5jb25zdCAkTkJTUCA9IDE2MDtcblxuZXhwb3J0IGNsYXNzIFNjYW5uZXJFcnJvciBleHRlbmRzIEJhc2VFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbWVzc2FnZSkgeyBzdXBlcigpOyB9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMubWVzc2FnZTsgfVxufVxuXG5jbGFzcyBfU2Nhbm5lciB7XG4gIGxlbmd0aDogbnVtYmVyO1xuICBwZWVrOiBudW1iZXIgPSAwO1xuICBpbmRleDogbnVtYmVyID0gLTE7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGlucHV0OiBzdHJpbmcpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICB0aGlzLmFkdmFuY2UoKTtcbiAgfVxuXG4gIGFkdmFuY2UoKSB7XG4gICAgdGhpcy5wZWVrID1cbiAgICAgICAgKyt0aGlzLmluZGV4ID49IHRoaXMubGVuZ3RoID8gJEVPRiA6IFN0cmluZ1dyYXBwZXIuY2hhckNvZGVBdCh0aGlzLmlucHV0LCB0aGlzLmluZGV4KTtcbiAgfVxuXG4gIHNjYW5Ub2tlbigpOiBUb2tlbiB7XG4gICAgdmFyIGlucHV0ID0gdGhpcy5pbnB1dCwgbGVuZ3RoID0gdGhpcy5sZW5ndGgsIHBlZWsgPSB0aGlzLnBlZWssIGluZGV4ID0gdGhpcy5pbmRleDtcblxuICAgIC8vIFNraXAgd2hpdGVzcGFjZS5cbiAgICB3aGlsZSAocGVlayA8PSAkU1BBQ0UpIHtcbiAgICAgIGlmICgrK2luZGV4ID49IGxlbmd0aCkge1xuICAgICAgICBwZWVrID0gJEVPRjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwZWVrID0gU3RyaW5nV3JhcHBlci5jaGFyQ29kZUF0KGlucHV0LCBpbmRleCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wZWVrID0gcGVlaztcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG5cbiAgICBpZiAoaW5kZXggPj0gbGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgaWRlbnRpZmllcnMgYW5kIG51bWJlcnMuXG4gICAgaWYgKGlzSWRlbnRpZmllclN0YXJ0KHBlZWspKSByZXR1cm4gdGhpcy5zY2FuSWRlbnRpZmllcigpO1xuICAgIGlmIChpc0RpZ2l0KHBlZWspKSByZXR1cm4gdGhpcy5zY2FuTnVtYmVyKGluZGV4KTtcblxuICAgIHZhciBzdGFydDogbnVtYmVyID0gaW5kZXg7XG4gICAgc3dpdGNoIChwZWVrKSB7XG4gICAgICBjYXNlICRQRVJJT0Q6XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICByZXR1cm4gaXNEaWdpdCh0aGlzLnBlZWspID8gdGhpcy5zY2FuTnVtYmVyKHN0YXJ0KSA6IG5ld0NoYXJhY3RlclRva2VuKHN0YXJ0LCAkUEVSSU9EKTtcbiAgICAgIGNhc2UgJExQQVJFTjpcbiAgICAgIGNhc2UgJFJQQVJFTjpcbiAgICAgIGNhc2UgJExCUkFDRTpcbiAgICAgIGNhc2UgJFJCUkFDRTpcbiAgICAgIGNhc2UgJExCUkFDS0VUOlxuICAgICAgY2FzZSAkUkJSQUNLRVQ6XG4gICAgICBjYXNlICRDT01NQTpcbiAgICAgIGNhc2UgJENPTE9OOlxuICAgICAgY2FzZSAkU0VNSUNPTE9OOlxuICAgICAgICByZXR1cm4gdGhpcy5zY2FuQ2hhcmFjdGVyKHN0YXJ0LCBwZWVrKTtcbiAgICAgIGNhc2UgJFNROlxuICAgICAgY2FzZSAkRFE6XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5TdHJpbmcoKTtcbiAgICAgIGNhc2UgJEhBU0g6XG4gICAgICBjYXNlICRQTFVTOlxuICAgICAgY2FzZSAkTUlOVVM6XG4gICAgICBjYXNlICRTVEFSOlxuICAgICAgY2FzZSAkU0xBU0g6XG4gICAgICBjYXNlICRQRVJDRU5UOlxuICAgICAgY2FzZSAkQ0FSRVQ6XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5PcGVyYXRvcihzdGFydCwgU3RyaW5nV3JhcHBlci5mcm9tQ2hhckNvZGUocGVlaykpO1xuICAgICAgY2FzZSAkUVVFU1RJT046XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5Db21wbGV4T3BlcmF0b3Ioc3RhcnQsICc/JywgJFBFUklPRCwgJy4nKTtcbiAgICAgIGNhc2UgJExUOlxuICAgICAgY2FzZSAkR1Q6XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5Db21wbGV4T3BlcmF0b3Ioc3RhcnQsIFN0cmluZ1dyYXBwZXIuZnJvbUNoYXJDb2RlKHBlZWspLCAkRVEsICc9Jyk7XG4gICAgICBjYXNlICRCQU5HOlxuICAgICAgY2FzZSAkRVE6XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5Db21wbGV4T3BlcmF0b3Ioc3RhcnQsIFN0cmluZ1dyYXBwZXIuZnJvbUNoYXJDb2RlKHBlZWspLCAkRVEsICc9JywgJEVRLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc9Jyk7XG4gICAgICBjYXNlICRBTVBFUlNBTkQ6XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5Db21wbGV4T3BlcmF0b3Ioc3RhcnQsICcmJywgJEFNUEVSU0FORCwgJyYnKTtcbiAgICAgIGNhc2UgJEJBUjpcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbkNvbXBsZXhPcGVyYXRvcihzdGFydCwgJ3wnLCAkQkFSLCAnfCcpO1xuICAgICAgY2FzZSAkTkJTUDpcbiAgICAgICAgd2hpbGUgKGlzV2hpdGVzcGFjZSh0aGlzLnBlZWspKSB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhblRva2VuKCk7XG4gICAgfVxuXG4gICAgdGhpcy5lcnJvcihgVW5leHBlY3RlZCBjaGFyYWN0ZXIgWyR7U3RyaW5nV3JhcHBlci5mcm9tQ2hhckNvZGUocGVlayl9XWAsIDApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgc2NhbkNoYXJhY3RlcihzdGFydDogbnVtYmVyLCBjb2RlOiBudW1iZXIpOiBUb2tlbiB7XG4gICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgcmV0dXJuIG5ld0NoYXJhY3RlclRva2VuKHN0YXJ0LCBjb2RlKTtcbiAgfVxuXG5cbiAgc2Nhbk9wZXJhdG9yKHN0YXJ0OiBudW1iZXIsIHN0cjogc3RyaW5nKTogVG9rZW4ge1xuICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIHJldHVybiBuZXdPcGVyYXRvclRva2VuKHN0YXJ0LCBzdHIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRva2VuaXplIGEgMi8zIGNoYXIgbG9uZyBvcGVyYXRvclxuICAgKlxuICAgKiBAcGFyYW0gc3RhcnQgc3RhcnQgaW5kZXggaW4gdGhlIGV4cHJlc3Npb25cbiAgICogQHBhcmFtIG9uZSBmaXJzdCBzeW1ib2wgKGFsd2F5cyBwYXJ0IG9mIHRoZSBvcGVyYXRvcilcbiAgICogQHBhcmFtIHR3b0NvZGUgY29kZSBwb2ludCBmb3IgdGhlIHNlY29uZCBzeW1ib2xcbiAgICogQHBhcmFtIHR3byBzZWNvbmQgc3ltYm9sIChwYXJ0IG9mIHRoZSBvcGVyYXRvciB3aGVuIHRoZSBzZWNvbmQgY29kZSBwb2ludCBtYXRjaGVzKVxuICAgKiBAcGFyYW0gdGhyZWVDb2RlIGNvZGUgcG9pbnQgZm9yIHRoZSB0aGlyZCBzeW1ib2xcbiAgICogQHBhcmFtIHRocmVlIHRoaXJkIHN5bWJvbCAocGFydCBvZiB0aGUgb3BlcmF0b3Igd2hlbiBwcm92aWRlZCBhbmQgbWF0Y2hlcyBzb3VyY2UgZXhwcmVzc2lvbilcbiAgICogQHJldHVybnMge1Rva2VufVxuICAgKi9cbiAgc2NhbkNvbXBsZXhPcGVyYXRvcihzdGFydDogbnVtYmVyLCBvbmU6IHN0cmluZywgdHdvQ29kZTogbnVtYmVyLCB0d286IHN0cmluZywgdGhyZWVDb2RlPzogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgIHRocmVlPzogc3RyaW5nKTogVG9rZW4ge1xuICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIHZhciBzdHI6IHN0cmluZyA9IG9uZTtcbiAgICBpZiAodGhpcy5wZWVrID09IHR3b0NvZGUpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgc3RyICs9IHR3bztcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudCh0aHJlZUNvZGUpICYmIHRoaXMucGVlayA9PSB0aHJlZUNvZGUpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgc3RyICs9IHRocmVlO1xuICAgIH1cbiAgICByZXR1cm4gbmV3T3BlcmF0b3JUb2tlbihzdGFydCwgc3RyKTtcbiAgfVxuXG4gIHNjYW5JZGVudGlmaWVyKCk6IFRva2VuIHtcbiAgICB2YXIgc3RhcnQ6IG51bWJlciA9IHRoaXMuaW5kZXg7XG4gICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgd2hpbGUgKGlzSWRlbnRpZmllclBhcnQodGhpcy5wZWVrKSkgdGhpcy5hZHZhbmNlKCk7XG4gICAgdmFyIHN0cjogc3RyaW5nID0gdGhpcy5pbnB1dC5zdWJzdHJpbmcoc3RhcnQsIHRoaXMuaW5kZXgpO1xuICAgIGlmIChTZXRXcmFwcGVyLmhhcyhLRVlXT1JEUywgc3RyKSkge1xuICAgICAgcmV0dXJuIG5ld0tleXdvcmRUb2tlbihzdGFydCwgc3RyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ld0lkZW50aWZpZXJUb2tlbihzdGFydCwgc3RyKTtcbiAgICB9XG4gIH1cblxuICBzY2FuTnVtYmVyKHN0YXJ0OiBudW1iZXIpOiBUb2tlbiB7XG4gICAgdmFyIHNpbXBsZTogYm9vbGVhbiA9ICh0aGlzLmluZGV4ID09PSBzdGFydCk7XG4gICAgdGhpcy5hZHZhbmNlKCk7ICAvLyBTa2lwIGluaXRpYWwgZGlnaXQuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmIChpc0RpZ2l0KHRoaXMucGVlaykpIHtcbiAgICAgICAgLy8gRG8gbm90aGluZy5cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wZWVrID09ICRQRVJJT0QpIHtcbiAgICAgICAgc2ltcGxlID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKGlzRXhwb25lbnRTdGFydCh0aGlzLnBlZWspKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICBpZiAoaXNFeHBvbmVudFNpZ24odGhpcy5wZWVrKSkgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIGlmICghaXNEaWdpdCh0aGlzLnBlZWspKSB0aGlzLmVycm9yKCdJbnZhbGlkIGV4cG9uZW50JywgLTEpO1xuICAgICAgICBzaW1wbGUgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgfVxuICAgIHZhciBzdHI6IHN0cmluZyA9IHRoaXMuaW5wdXQuc3Vic3RyaW5nKHN0YXJ0LCB0aGlzLmluZGV4KTtcbiAgICAvLyBUT0RPXG4gICAgdmFyIHZhbHVlOiBudW1iZXIgPVxuICAgICAgICBzaW1wbGUgPyBOdW1iZXJXcmFwcGVyLnBhcnNlSW50QXV0b1JhZGl4KHN0cikgOiBOdW1iZXJXcmFwcGVyLnBhcnNlRmxvYXQoc3RyKTtcbiAgICByZXR1cm4gbmV3TnVtYmVyVG9rZW4oc3RhcnQsIHZhbHVlKTtcbiAgfVxuXG4gIHNjYW5TdHJpbmcoKTogVG9rZW4ge1xuICAgIHZhciBzdGFydDogbnVtYmVyID0gdGhpcy5pbmRleDtcbiAgICB2YXIgcXVvdGU6IG51bWJlciA9IHRoaXMucGVlaztcbiAgICB0aGlzLmFkdmFuY2UoKTsgIC8vIFNraXAgaW5pdGlhbCBxdW90ZS5cblxuICAgIHZhciBidWZmZXI6IFN0cmluZ0pvaW5lcjtcbiAgICB2YXIgbWFya2VyOiBudW1iZXIgPSB0aGlzLmluZGV4O1xuICAgIHZhciBpbnB1dDogc3RyaW5nID0gdGhpcy5pbnB1dDtcblxuICAgIHdoaWxlICh0aGlzLnBlZWsgIT0gcXVvdGUpIHtcbiAgICAgIGlmICh0aGlzLnBlZWsgPT0gJEJBQ0tTTEFTSCkge1xuICAgICAgICBpZiAoYnVmZmVyID09IG51bGwpIGJ1ZmZlciA9IG5ldyBTdHJpbmdKb2luZXIoKTtcbiAgICAgICAgYnVmZmVyLmFkZChpbnB1dC5zdWJzdHJpbmcobWFya2VyLCB0aGlzLmluZGV4KSk7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICB2YXIgdW5lc2NhcGVkQ29kZTogbnVtYmVyO1xuICAgICAgICBpZiAodGhpcy5wZWVrID09ICR1KSB7XG4gICAgICAgICAgLy8gNCBjaGFyYWN0ZXIgaGV4IGNvZGUgZm9yIHVuaWNvZGUgY2hhcmFjdGVyLlxuICAgICAgICAgIHZhciBoZXg6IHN0cmluZyA9IGlucHV0LnN1YnN0cmluZyh0aGlzLmluZGV4ICsgMSwgdGhpcy5pbmRleCArIDUpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB1bmVzY2FwZWRDb2RlID0gTnVtYmVyV3JhcHBlci5wYXJzZUludChoZXgsIDE2KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKGBJbnZhbGlkIHVuaWNvZGUgZXNjYXBlIFtcXFxcdSR7aGV4fV1gLCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVuZXNjYXBlZENvZGUgPSB1bmVzY2FwZSh0aGlzLnBlZWspO1xuICAgICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICB9XG4gICAgICAgIGJ1ZmZlci5hZGQoU3RyaW5nV3JhcHBlci5mcm9tQ2hhckNvZGUodW5lc2NhcGVkQ29kZSkpO1xuICAgICAgICBtYXJrZXIgPSB0aGlzLmluZGV4O1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBlZWsgPT0gJEVPRikge1xuICAgICAgICB0aGlzLmVycm9yKCdVbnRlcm1pbmF0ZWQgcXVvdGUnLCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsYXN0OiBzdHJpbmcgPSBpbnB1dC5zdWJzdHJpbmcobWFya2VyLCB0aGlzLmluZGV4KTtcbiAgICB0aGlzLmFkdmFuY2UoKTsgIC8vIFNraXAgdGVybWluYXRpbmcgcXVvdGUuXG5cbiAgICAvLyBDb21wdXRlIHRoZSB1bmVzY2FwZWQgc3RyaW5nIHZhbHVlLlxuICAgIHZhciB1bmVzY2FwZWQ6IHN0cmluZyA9IGxhc3Q7XG4gICAgaWYgKGJ1ZmZlciAhPSBudWxsKSB7XG4gICAgICBidWZmZXIuYWRkKGxhc3QpO1xuICAgICAgdW5lc2NhcGVkID0gYnVmZmVyLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHJldHVybiBuZXdTdHJpbmdUb2tlbihzdGFydCwgdW5lc2NhcGVkKTtcbiAgfVxuXG4gIGVycm9yKG1lc3NhZ2U6IHN0cmluZywgb2Zmc2V0OiBudW1iZXIpIHtcbiAgICB2YXIgcG9zaXRpb246IG51bWJlciA9IHRoaXMuaW5kZXggKyBvZmZzZXQ7XG4gICAgdGhyb3cgbmV3IFNjYW5uZXJFcnJvcihcbiAgICAgICAgYExleGVyIEVycm9yOiAke21lc3NhZ2V9IGF0IGNvbHVtbiAke3Bvc2l0aW9ufSBpbiBleHByZXNzaW9uIFske3RoaXMuaW5wdXR9XWApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIChjb2RlID49ICRUQUIgJiYgY29kZSA8PSAkU1BBQ0UpIHx8IChjb2RlID09ICROQlNQKTtcbn1cblxuZnVuY3Rpb24gaXNJZGVudGlmaWVyU3RhcnQoY29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiAoJGEgPD0gY29kZSAmJiBjb2RlIDw9ICR6KSB8fCAoJEEgPD0gY29kZSAmJiBjb2RlIDw9ICRaKSB8fCAoY29kZSA9PSAkXykgfHwgKGNvZGUgPT0gJCQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJZGVudGlmaWVyKGlucHV0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKGlucHV0Lmxlbmd0aCA9PSAwKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzY2FubmVyID0gbmV3IF9TY2FubmVyKGlucHV0KTtcbiAgaWYgKCFpc0lkZW50aWZpZXJTdGFydChzY2FubmVyLnBlZWspKSByZXR1cm4gZmFsc2U7XG4gIHNjYW5uZXIuYWR2YW5jZSgpO1xuICB3aGlsZSAoc2Nhbm5lci5wZWVrICE9PSAkRU9GKSB7XG4gICAgaWYgKCFpc0lkZW50aWZpZXJQYXJ0KHNjYW5uZXIucGVlaykpIHJldHVybiBmYWxzZTtcbiAgICBzY2FubmVyLmFkdmFuY2UoKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNJZGVudGlmaWVyUGFydChjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuICgkYSA8PSBjb2RlICYmIGNvZGUgPD0gJHopIHx8ICgkQSA8PSBjb2RlICYmIGNvZGUgPD0gJFopIHx8ICgkMCA8PSBjb2RlICYmIGNvZGUgPD0gJDkpIHx8XG4gICAgICAgICAoY29kZSA9PSAkXykgfHwgKGNvZGUgPT0gJCQpO1xufVxuXG5mdW5jdGlvbiBpc0RpZ2l0KGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gJDAgPD0gY29kZSAmJiBjb2RlIDw9ICQ5O1xufVxuXG5mdW5jdGlvbiBpc0V4cG9uZW50U3RhcnQoY29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiBjb2RlID09ICRlIHx8IGNvZGUgPT0gJEU7XG59XG5cbmZ1bmN0aW9uIGlzRXhwb25lbnRTaWduKGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gY29kZSA9PSAkTUlOVVMgfHwgY29kZSA9PSAkUExVUztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUXVvdGUoY29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiBjb2RlID09PSAkU1EgfHwgY29kZSA9PT0gJERRIHx8IGNvZGUgPT09ICRCVDtcbn1cblxuZnVuY3Rpb24gdW5lc2NhcGUoY29kZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgc3dpdGNoIChjb2RlKSB7XG4gICAgY2FzZSAkbjpcbiAgICAgIHJldHVybiAkTEY7XG4gICAgY2FzZSAkZjpcbiAgICAgIHJldHVybiAkRkY7XG4gICAgY2FzZSAkcjpcbiAgICAgIHJldHVybiAkQ1I7XG4gICAgY2FzZSAkdDpcbiAgICAgIHJldHVybiAkVEFCO1xuICAgIGNhc2UgJHY6XG4gICAgICByZXR1cm4gJFZUQUI7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBjb2RlO1xuICB9XG59XG5cbnZhciBPUEVSQVRPUlMgPSBTZXRXcmFwcGVyLmNyZWF0ZUZyb21MaXN0KFtcbiAgJysnLFxuICAnLScsXG4gICcqJyxcbiAgJy8nLFxuICAnJScsXG4gICdeJyxcbiAgJz0nLFxuICAnPT0nLFxuICAnIT0nLFxuICAnPT09JyxcbiAgJyE9PScsXG4gICc8JyxcbiAgJz4nLFxuICAnPD0nLFxuICAnPj0nLFxuICAnJiYnLFxuICAnfHwnLFxuICAnJicsXG4gICd8JyxcbiAgJyEnLFxuICAnPycsXG4gICcjJyxcbiAgJz8uJ1xuXSk7XG5cblxudmFyIEtFWVdPUkRTID1cbiAgICBTZXRXcmFwcGVyLmNyZWF0ZUZyb21MaXN0KFsndmFyJywgJ251bGwnLCAndW5kZWZpbmVkJywgJ3RydWUnLCAnZmFsc2UnLCAnaWYnLCAnZWxzZSddKTtcbiJdfQ==