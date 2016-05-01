'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lang_1 = require('angular2/src/facade/lang');
var abstract_emitter_1 = require('./abstract_emitter');
var abstract_js_emitter_1 = require('./abstract_js_emitter');
var path_util_1 = require('./path_util');
var JavaScriptEmitter = (function () {
    function JavaScriptEmitter() {
    }
    JavaScriptEmitter.prototype.emitStatements = function (moduleUrl, stmts, exportedVars) {
        var converter = new JsEmitterVisitor(moduleUrl);
        var ctx = abstract_emitter_1.EmitterVisitorContext.createRoot(exportedVars);
        converter.visitAllStatements(stmts, ctx);
        var srcParts = [];
        converter.importsWithPrefixes.forEach(function (prefix, importedModuleUrl) {
            // Note: can't write the real word for import as it screws up system.js auto detection...
            srcParts.push(("var " + prefix + " = req") +
                ("uire('" + path_util_1.getImportModulePath(moduleUrl, importedModuleUrl, path_util_1.ImportEnv.JS) + "');"));
        });
        srcParts.push(ctx.toSource());
        return srcParts.join('\n');
    };
    return JavaScriptEmitter;
}());
exports.JavaScriptEmitter = JavaScriptEmitter;
var JsEmitterVisitor = (function (_super) {
    __extends(JsEmitterVisitor, _super);
    function JsEmitterVisitor(_moduleUrl) {
        _super.call(this);
        this._moduleUrl = _moduleUrl;
        this.importsWithPrefixes = new Map();
    }
    JsEmitterVisitor.prototype.visitExternalExpr = function (ast, ctx) {
        if (lang_1.isPresent(ast.value.moduleUrl) && ast.value.moduleUrl != this._moduleUrl) {
            var prefix = this.importsWithPrefixes.get(ast.value.moduleUrl);
            if (lang_1.isBlank(prefix)) {
                prefix = "import" + this.importsWithPrefixes.size;
                this.importsWithPrefixes.set(ast.value.moduleUrl, prefix);
            }
            ctx.print(prefix + ".");
        }
        ctx.print(ast.value.name);
        return null;
    };
    JsEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt, ctx) {
        _super.prototype.visitDeclareVarStmt.call(this, stmt, ctx);
        if (ctx.isExportedVar(stmt.name)) {
            ctx.println(exportVar(stmt.name));
        }
        return null;
    };
    JsEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt, ctx) {
        _super.prototype.visitDeclareFunctionStmt.call(this, stmt, ctx);
        if (ctx.isExportedVar(stmt.name)) {
            ctx.println(exportVar(stmt.name));
        }
        return null;
    };
    JsEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt, ctx) {
        _super.prototype.visitDeclareClassStmt.call(this, stmt, ctx);
        if (ctx.isExportedVar(stmt.name)) {
            ctx.println(exportVar(stmt.name));
        }
        return null;
    };
    return JsEmitterVisitor;
}(abstract_js_emitter_1.AbstractJsEmitterVisitor));
function exportVar(varName) {
    return "Object.defineProperty(exports, '" + varName + "', { get: function() { return " + varName + "; }});";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNfZW1pdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtNG5vM1pRdk8udG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9vdXRwdXQvanNfZW1pdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxxQkFPTywwQkFBMEIsQ0FBQyxDQUFBO0FBQ2xDLGlDQUFtRCxvQkFBb0IsQ0FBQyxDQUFBO0FBQ3hFLG9DQUF1Qyx1QkFBdUIsQ0FBQyxDQUFBO0FBQy9ELDBCQUE2QyxhQUFhLENBQUMsQ0FBQTtBQUUzRDtJQUNFO0lBQWUsQ0FBQztJQUNoQiwwQ0FBYyxHQUFkLFVBQWUsU0FBaUIsRUFBRSxLQUFvQixFQUFFLFlBQXNCO1FBQzVFLElBQUksU0FBUyxHQUFHLElBQUksZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEQsSUFBSSxHQUFHLEdBQUcsd0NBQXFCLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3pELFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDekMsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUUsaUJBQWlCO1lBQzlELHlGQUF5RjtZQUN6RixRQUFRLENBQUMsSUFBSSxDQUFDLFVBQU8sTUFBTSxZQUFRO2dCQUNyQixZQUFTLCtCQUFtQixDQUFDLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxxQkFBUyxDQUFDLEVBQUUsQ0FBQyxTQUFLLENBQUMsQ0FBQztRQUMvRixDQUFDLENBQUMsQ0FBQztRQUNILFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsQ0FB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KiBhcyBvIGZyb20gJy4vb3V0cHV0X2FzdCc7XG5pbXBvcnQge1xuICBpc1ByZXNlbnQsXG4gIGlzQmxhbmssXG4gIGlzU3RyaW5nLFxuICBldmFsRXhwcmVzc2lvbixcbiAgUmVnRXhwV3JhcHBlcixcbiAgU3RyaW5nV3JhcHBlclxufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtPdXRwdXRFbWl0dGVyLCBFbWl0dGVyVmlzaXRvckNvbnRleHR9IGZyb20gJy4vYWJzdHJhY3RfZW1pdHRlcic7XG5pbXBvcnQge0Fic3RyYWN0SnNFbWl0dGVyVmlzaXRvcn0gZnJvbSAnLi9hYnN0cmFjdF9qc19lbWl0dGVyJztcbmltcG9ydCB7Z2V0SW1wb3J0TW9kdWxlUGF0aCwgSW1wb3J0RW52fSBmcm9tICcuL3BhdGhfdXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBKYXZhU2NyaXB0RW1pdHRlciBpbXBsZW1lbnRzIE91dHB1dEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcigpIHt9XG4gIGVtaXRTdGF0ZW1lbnRzKG1vZHVsZVVybDogc3RyaW5nLCBzdG10czogby5TdGF0ZW1lbnRbXSwgZXhwb3J0ZWRWYXJzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgdmFyIGNvbnZlcnRlciA9IG5ldyBKc0VtaXR0ZXJWaXNpdG9yKG1vZHVsZVVybCk7XG4gICAgdmFyIGN0eCA9IEVtaXR0ZXJWaXNpdG9yQ29udGV4dC5jcmVhdGVSb290KGV4cG9ydGVkVmFycyk7XG4gICAgY29udmVydGVyLnZpc2l0QWxsU3RhdGVtZW50cyhzdG10cywgY3R4KTtcbiAgICB2YXIgc3JjUGFydHMgPSBbXTtcbiAgICBjb252ZXJ0ZXIuaW1wb3J0c1dpdGhQcmVmaXhlcy5mb3JFYWNoKChwcmVmaXgsIGltcG9ydGVkTW9kdWxlVXJsKSA9PiB7XG4gICAgICAvLyBOb3RlOiBjYW4ndCB3cml0ZSB0aGUgcmVhbCB3b3JkIGZvciBpbXBvcnQgYXMgaXQgc2NyZXdzIHVwIHN5c3RlbS5qcyBhdXRvIGRldGVjdGlvbi4uLlxuICAgICAgc3JjUGFydHMucHVzaChgdmFyICR7cHJlZml4fSA9IHJlcWAgK1xuICAgICAgICAgICAgICAgICAgICBgdWlyZSgnJHtnZXRJbXBvcnRNb2R1bGVQYXRoKG1vZHVsZVVybCwgaW1wb3J0ZWRNb2R1bGVVcmwsIEltcG9ydEVudi5KUyl9Jyk7YCk7XG4gICAgfSk7XG4gICAgc3JjUGFydHMucHVzaChjdHgudG9Tb3VyY2UoKSk7XG4gICAgcmV0dXJuIHNyY1BhcnRzLmpvaW4oJ1xcbicpO1xuICB9XG59XG5cbmNsYXNzIEpzRW1pdHRlclZpc2l0b3IgZXh0ZW5kcyBBYnN0cmFjdEpzRW1pdHRlclZpc2l0b3Ige1xuICBpbXBvcnRzV2l0aFByZWZpeGVzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9tb2R1bGVVcmw6IHN0cmluZykgeyBzdXBlcigpOyB9XG5cbiAgdmlzaXRFeHRlcm5hbEV4cHIoYXN0OiBvLkV4dGVybmFsRXhwciwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiBhbnkge1xuICAgIGlmIChpc1ByZXNlbnQoYXN0LnZhbHVlLm1vZHVsZVVybCkgJiYgYXN0LnZhbHVlLm1vZHVsZVVybCAhPSB0aGlzLl9tb2R1bGVVcmwpIHtcbiAgICAgIHZhciBwcmVmaXggPSB0aGlzLmltcG9ydHNXaXRoUHJlZml4ZXMuZ2V0KGFzdC52YWx1ZS5tb2R1bGVVcmwpO1xuICAgICAgaWYgKGlzQmxhbmsocHJlZml4KSkge1xuICAgICAgICBwcmVmaXggPSBgaW1wb3J0JHt0aGlzLmltcG9ydHNXaXRoUHJlZml4ZXMuc2l6ZX1gO1xuICAgICAgICB0aGlzLmltcG9ydHNXaXRoUHJlZml4ZXMuc2V0KGFzdC52YWx1ZS5tb2R1bGVVcmwsIHByZWZpeCk7XG4gICAgICB9XG4gICAgICBjdHgucHJpbnQoYCR7cHJlZml4fS5gKTtcbiAgICB9XG4gICAgY3R4LnByaW50KGFzdC52YWx1ZS5uYW1lKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdERlY2xhcmVWYXJTdG10KHN0bXQ6IG8uRGVjbGFyZVZhclN0bXQsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICBzdXBlci52aXNpdERlY2xhcmVWYXJTdG10KHN0bXQsIGN0eCk7XG4gICAgaWYgKGN0eC5pc0V4cG9ydGVkVmFyKHN0bXQubmFtZSkpIHtcbiAgICAgIGN0eC5wcmludGxuKGV4cG9ydFZhcihzdG10Lm5hbWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXREZWNsYXJlRnVuY3Rpb25TdG10KHN0bXQ6IG8uRGVjbGFyZUZ1bmN0aW9uU3RtdCwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiBhbnkge1xuICAgIHN1cGVyLnZpc2l0RGVjbGFyZUZ1bmN0aW9uU3RtdChzdG10LCBjdHgpO1xuICAgIGlmIChjdHguaXNFeHBvcnRlZFZhcihzdG10Lm5hbWUpKSB7XG4gICAgICBjdHgucHJpbnRsbihleHBvcnRWYXIoc3RtdC5uYW1lKSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0RGVjbGFyZUNsYXNzU3RtdChzdG10OiBvLkNsYXNzU3RtdCwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiBhbnkge1xuICAgIHN1cGVyLnZpc2l0RGVjbGFyZUNsYXNzU3RtdChzdG10LCBjdHgpO1xuICAgIGlmIChjdHguaXNFeHBvcnRlZFZhcihzdG10Lm5hbWUpKSB7XG4gICAgICBjdHgucHJpbnRsbihleHBvcnRWYXIoc3RtdC5uYW1lKSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmZ1bmN0aW9uIGV4cG9ydFZhcih2YXJOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnJHt2YXJOYW1lfScsIHsgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuICR7dmFyTmFtZX07IH19KTtgO1xufVxuIl19