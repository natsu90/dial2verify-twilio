import { CONST_EXPR, isString, isPresent, isBlank } from 'angular2/src/facade/lang';
//// Types
export var TypeModifier;
(function (TypeModifier) {
    TypeModifier[TypeModifier["Const"] = 0] = "Const";
})(TypeModifier || (TypeModifier = {}));
export class Type {
    constructor(modifiers = null) {
        this.modifiers = modifiers;
        if (isBlank(modifiers)) {
            this.modifiers = [];
        }
    }
    hasModifier(modifier) { return this.modifiers.indexOf(modifier) !== -1; }
}
export var BuiltinTypeName;
(function (BuiltinTypeName) {
    BuiltinTypeName[BuiltinTypeName["Dynamic"] = 0] = "Dynamic";
    BuiltinTypeName[BuiltinTypeName["Bool"] = 1] = "Bool";
    BuiltinTypeName[BuiltinTypeName["String"] = 2] = "String";
    BuiltinTypeName[BuiltinTypeName["Int"] = 3] = "Int";
    BuiltinTypeName[BuiltinTypeName["Number"] = 4] = "Number";
    BuiltinTypeName[BuiltinTypeName["Function"] = 5] = "Function";
})(BuiltinTypeName || (BuiltinTypeName = {}));
export class BuiltinType extends Type {
    constructor(name, modifiers = null) {
        super(modifiers);
        this.name = name;
    }
    visitType(visitor, context) {
        return visitor.visitBuiltintType(this, context);
    }
}
export class ExternalType extends Type {
    constructor(value, typeParams = null, modifiers = null) {
        super(modifiers);
        this.value = value;
        this.typeParams = typeParams;
    }
    visitType(visitor, context) {
        return visitor.visitExternalType(this, context);
    }
}
export class ArrayType extends Type {
    constructor(of, modifiers = null) {
        super(modifiers);
        this.of = of;
    }
    visitType(visitor, context) {
        return visitor.visitArrayType(this, context);
    }
}
export class MapType extends Type {
    constructor(valueType, modifiers = null) {
        super(modifiers);
        this.valueType = valueType;
    }
    visitType(visitor, context) { return visitor.visitMapType(this, context); }
}
export var DYNAMIC_TYPE = new BuiltinType(BuiltinTypeName.Dynamic);
export var BOOL_TYPE = new BuiltinType(BuiltinTypeName.Bool);
export var INT_TYPE = new BuiltinType(BuiltinTypeName.Int);
export var NUMBER_TYPE = new BuiltinType(BuiltinTypeName.Number);
export var STRING_TYPE = new BuiltinType(BuiltinTypeName.String);
export var FUNCTION_TYPE = new BuiltinType(BuiltinTypeName.Function);
///// Expressions
export var BinaryOperator;
(function (BinaryOperator) {
    BinaryOperator[BinaryOperator["Equals"] = 0] = "Equals";
    BinaryOperator[BinaryOperator["NotEquals"] = 1] = "NotEquals";
    BinaryOperator[BinaryOperator["Identical"] = 2] = "Identical";
    BinaryOperator[BinaryOperator["NotIdentical"] = 3] = "NotIdentical";
    BinaryOperator[BinaryOperator["Minus"] = 4] = "Minus";
    BinaryOperator[BinaryOperator["Plus"] = 5] = "Plus";
    BinaryOperator[BinaryOperator["Divide"] = 6] = "Divide";
    BinaryOperator[BinaryOperator["Multiply"] = 7] = "Multiply";
    BinaryOperator[BinaryOperator["Modulo"] = 8] = "Modulo";
    BinaryOperator[BinaryOperator["And"] = 9] = "And";
    BinaryOperator[BinaryOperator["Or"] = 10] = "Or";
    BinaryOperator[BinaryOperator["Lower"] = 11] = "Lower";
    BinaryOperator[BinaryOperator["LowerEquals"] = 12] = "LowerEquals";
    BinaryOperator[BinaryOperator["Bigger"] = 13] = "Bigger";
    BinaryOperator[BinaryOperator["BiggerEquals"] = 14] = "BiggerEquals";
})(BinaryOperator || (BinaryOperator = {}));
export class Expression {
    constructor(type) {
        this.type = type;
    }
    prop(name) { return new ReadPropExpr(this, name); }
    key(index, type = null) {
        return new ReadKeyExpr(this, index, type);
    }
    callMethod(name, params) {
        return new InvokeMethodExpr(this, name, params);
    }
    callFn(params) { return new InvokeFunctionExpr(this, params); }
    instantiate(params, type = null) {
        return new InstantiateExpr(this, params, type);
    }
    conditional(trueCase, falseCase = null) {
        return new ConditionalExpr(this, trueCase, falseCase);
    }
    equals(rhs) {
        return new BinaryOperatorExpr(BinaryOperator.Equals, this, rhs);
    }
    notEquals(rhs) {
        return new BinaryOperatorExpr(BinaryOperator.NotEquals, this, rhs);
    }
    identical(rhs) {
        return new BinaryOperatorExpr(BinaryOperator.Identical, this, rhs);
    }
    notIdentical(rhs) {
        return new BinaryOperatorExpr(BinaryOperator.NotIdentical, this, rhs);
    }
    minus(rhs) {
        return new BinaryOperatorExpr(BinaryOperator.Minus, this, rhs);
    }
    plus(rhs) {
        return new BinaryOperatorExpr(BinaryOperator.Plus, this, rhs);
    }
    divide(rhs) {
        return new BinaryOperatorExpr(BinaryOperator.Divide, this, rhs);
    }
    multiply(rhs) {
        return new BinaryOperatorExpr(BinaryOperator.Multiply, this, rhs);
    }
    modulo(rhs) {
        return new BinaryOperatorExpr(BinaryOperator.Modulo, this, rhs);
    }
    and(rhs) {
        return new BinaryOperatorExpr(BinaryOperator.And, this, rhs);
    }
    or(rhs) {
        return new BinaryOperatorExpr(BinaryOperator.Or, this, rhs);
    }
    lower(rhs) {
        return new BinaryOperatorExpr(BinaryOperator.Lower, this, rhs);
    }
    lowerEquals(rhs) {
        return new BinaryOperatorExpr(BinaryOperator.LowerEquals, this, rhs);
    }
    bigger(rhs) {
        return new BinaryOperatorExpr(BinaryOperator.Bigger, this, rhs);
    }
    biggerEquals(rhs) {
        return new BinaryOperatorExpr(BinaryOperator.BiggerEquals, this, rhs);
    }
    isBlank() {
        // Note: We use equals by purpose here to compare to null and undefined in JS.
        return this.equals(NULL_EXPR);
    }
    cast(type) { return new CastExpr(this, type); }
    toStmt() { return new ExpressionStatement(this); }
}
export var BuiltinVar;
(function (BuiltinVar) {
    BuiltinVar[BuiltinVar["This"] = 0] = "This";
    BuiltinVar[BuiltinVar["Super"] = 1] = "Super";
    BuiltinVar[BuiltinVar["CatchError"] = 2] = "CatchError";
    BuiltinVar[BuiltinVar["CatchStack"] = 3] = "CatchStack";
})(BuiltinVar || (BuiltinVar = {}));
export class ReadVarExpr extends Expression {
    constructor(name, type = null) {
        super(type);
        if (isString(name)) {
            this.name = name;
            this.builtin = null;
        }
        else {
            this.name = null;
            this.builtin = name;
        }
    }
    visitExpression(visitor, context) {
        return visitor.visitReadVarExpr(this, context);
    }
    set(value) { return new WriteVarExpr(this.name, value); }
}
export class WriteVarExpr extends Expression {
    constructor(name, value, type = null) {
        super(isPresent(type) ? type : value.type);
        this.name = name;
        this.value = value;
    }
    visitExpression(visitor, context) {
        return visitor.visitWriteVarExpr(this, context);
    }
    toDeclStmt(type = null, modifiers = null) {
        return new DeclareVarStmt(this.name, this.value, type, modifiers);
    }
}
export class WriteKeyExpr extends Expression {
    constructor(receiver, index, value, type = null) {
        super(isPresent(type) ? type : value.type);
        this.receiver = receiver;
        this.index = index;
        this.value = value;
    }
    visitExpression(visitor, context) {
        return visitor.visitWriteKeyExpr(this, context);
    }
}
export class WritePropExpr extends Expression {
    constructor(receiver, name, value, type = null) {
        super(isPresent(type) ? type : value.type);
        this.receiver = receiver;
        this.name = name;
        this.value = value;
    }
    visitExpression(visitor, context) {
        return visitor.visitWritePropExpr(this, context);
    }
}
export var BuiltinMethod;
(function (BuiltinMethod) {
    BuiltinMethod[BuiltinMethod["ConcatArray"] = 0] = "ConcatArray";
    BuiltinMethod[BuiltinMethod["SubscribeObservable"] = 1] = "SubscribeObservable";
    BuiltinMethod[BuiltinMethod["bind"] = 2] = "bind";
})(BuiltinMethod || (BuiltinMethod = {}));
export class InvokeMethodExpr extends Expression {
    constructor(receiver, method, args, type = null) {
        super(type);
        this.receiver = receiver;
        this.args = args;
        if (isString(method)) {
            this.name = method;
            this.builtin = null;
        }
        else {
            this.name = null;
            this.builtin = method;
        }
    }
    visitExpression(visitor, context) {
        return visitor.visitInvokeMethodExpr(this, context);
    }
}
export class InvokeFunctionExpr extends Expression {
    constructor(fn, args, type = null) {
        super(type);
        this.fn = fn;
        this.args = args;
    }
    visitExpression(visitor, context) {
        return visitor.visitInvokeFunctionExpr(this, context);
    }
}
export class InstantiateExpr extends Expression {
    constructor(classExpr, args, type) {
        super(type);
        this.classExpr = classExpr;
        this.args = args;
    }
    visitExpression(visitor, context) {
        return visitor.visitInstantiateExpr(this, context);
    }
}
export class LiteralExpr extends Expression {
    constructor(value, type = null) {
        super(type);
        this.value = value;
    }
    visitExpression(visitor, context) {
        return visitor.visitLiteralExpr(this, context);
    }
}
export class ExternalExpr extends Expression {
    constructor(value, type = null, typeParams = null) {
        super(type);
        this.value = value;
        this.typeParams = typeParams;
    }
    visitExpression(visitor, context) {
        return visitor.visitExternalExpr(this, context);
    }
}
export class ConditionalExpr extends Expression {
    constructor(condition, trueCase, falseCase = null, type = null) {
        super(isPresent(type) ? type : trueCase.type);
        this.condition = condition;
        this.falseCase = falseCase;
        this.trueCase = trueCase;
    }
    visitExpression(visitor, context) {
        return visitor.visitConditionalExpr(this, context);
    }
}
export class NotExpr extends Expression {
    constructor(condition) {
        super(BOOL_TYPE);
        this.condition = condition;
    }
    visitExpression(visitor, context) {
        return visitor.visitNotExpr(this, context);
    }
}
export class CastExpr extends Expression {
    constructor(value, type) {
        super(type);
        this.value = value;
    }
    visitExpression(visitor, context) {
        return visitor.visitCastExpr(this, context);
    }
}
export class FnParam {
    constructor(name, type = null) {
        this.name = name;
        this.type = type;
    }
}
export class FunctionExpr extends Expression {
    constructor(params, statements, type = null) {
        super(type);
        this.params = params;
        this.statements = statements;
    }
    visitExpression(visitor, context) {
        return visitor.visitFunctionExpr(this, context);
    }
    toDeclStmt(name, modifiers = null) {
        return new DeclareFunctionStmt(name, this.params, this.statements, this.type, modifiers);
    }
}
export class BinaryOperatorExpr extends Expression {
    constructor(operator, lhs, rhs, type = null) {
        super(isPresent(type) ? type : lhs.type);
        this.operator = operator;
        this.rhs = rhs;
        this.lhs = lhs;
    }
    visitExpression(visitor, context) {
        return visitor.visitBinaryOperatorExpr(this, context);
    }
}
export class ReadPropExpr extends Expression {
    constructor(receiver, name, type = null) {
        super(type);
        this.receiver = receiver;
        this.name = name;
    }
    visitExpression(visitor, context) {
        return visitor.visitReadPropExpr(this, context);
    }
    set(value) {
        return new WritePropExpr(this.receiver, this.name, value);
    }
}
export class ReadKeyExpr extends Expression {
    constructor(receiver, index, type = null) {
        super(type);
        this.receiver = receiver;
        this.index = index;
    }
    visitExpression(visitor, context) {
        return visitor.visitReadKeyExpr(this, context);
    }
    set(value) {
        return new WriteKeyExpr(this.receiver, this.index, value);
    }
}
export class LiteralArrayExpr extends Expression {
    constructor(entries, type = null) {
        super(type);
        this.entries = entries;
    }
    visitExpression(visitor, context) {
        return visitor.visitLiteralArrayExpr(this, context);
    }
}
export class LiteralMapExpr extends Expression {
    constructor(entries, type = null) {
        super(type);
        this.entries = entries;
        this.valueType = null;
        if (isPresent(type)) {
            this.valueType = type.valueType;
        }
    }
    ;
    visitExpression(visitor, context) {
        return visitor.visitLiteralMapExpr(this, context);
    }
}
export var THIS_EXPR = new ReadVarExpr(BuiltinVar.This);
export var SUPER_EXPR = new ReadVarExpr(BuiltinVar.Super);
export var CATCH_ERROR_VAR = new ReadVarExpr(BuiltinVar.CatchError);
export var CATCH_STACK_VAR = new ReadVarExpr(BuiltinVar.CatchStack);
export var NULL_EXPR = new LiteralExpr(null, null);
//// Statements
export var StmtModifier;
(function (StmtModifier) {
    StmtModifier[StmtModifier["Final"] = 0] = "Final";
    StmtModifier[StmtModifier["Private"] = 1] = "Private";
})(StmtModifier || (StmtModifier = {}));
export class Statement {
    constructor(modifiers = null) {
        this.modifiers = modifiers;
        if (isBlank(modifiers)) {
            this.modifiers = [];
        }
    }
    hasModifier(modifier) { return this.modifiers.indexOf(modifier) !== -1; }
}
export class DeclareVarStmt extends Statement {
    constructor(name, value, type = null, modifiers = null) {
        super(modifiers);
        this.name = name;
        this.value = value;
        this.type = isPresent(type) ? type : value.type;
    }
    visitStatement(visitor, context) {
        return visitor.visitDeclareVarStmt(this, context);
    }
}
export class DeclareFunctionStmt extends Statement {
    constructor(name, params, statements, type = null, modifiers = null) {
        super(modifiers);
        this.name = name;
        this.params = params;
        this.statements = statements;
        this.type = type;
    }
    visitStatement(visitor, context) {
        return visitor.visitDeclareFunctionStmt(this, context);
    }
}
export class ExpressionStatement extends Statement {
    constructor(expr) {
        super();
        this.expr = expr;
    }
    visitStatement(visitor, context) {
        return visitor.visitExpressionStmt(this, context);
    }
}
export class ReturnStatement extends Statement {
    constructor(value) {
        super();
        this.value = value;
    }
    visitStatement(visitor, context) {
        return visitor.visitReturnStmt(this, context);
    }
}
export class AbstractClassPart {
    constructor(type = null, modifiers) {
        this.type = type;
        this.modifiers = modifiers;
        if (isBlank(modifiers)) {
            this.modifiers = [];
        }
    }
    hasModifier(modifier) { return this.modifiers.indexOf(modifier) !== -1; }
}
export class ClassField extends AbstractClassPart {
    constructor(name, type = null, modifiers = null) {
        super(type, modifiers);
        this.name = name;
    }
}
export class ClassMethod extends AbstractClassPart {
    constructor(name, params, body, type = null, modifiers = null) {
        super(type, modifiers);
        this.name = name;
        this.params = params;
        this.body = body;
    }
}
export class ClassGetter extends AbstractClassPart {
    constructor(name, body, type = null, modifiers = null) {
        super(type, modifiers);
        this.name = name;
        this.body = body;
    }
}
export class ClassStmt extends Statement {
    constructor(name, parent, fields, getters, constructorMethod, methods, modifiers = null) {
        super(modifiers);
        this.name = name;
        this.parent = parent;
        this.fields = fields;
        this.getters = getters;
        this.constructorMethod = constructorMethod;
        this.methods = methods;
    }
    visitStatement(visitor, context) {
        return visitor.visitDeclareClassStmt(this, context);
    }
}
export class IfStmt extends Statement {
    constructor(condition, trueCase, falseCase = CONST_EXPR([])) {
        super();
        this.condition = condition;
        this.trueCase = trueCase;
        this.falseCase = falseCase;
    }
    visitStatement(visitor, context) {
        return visitor.visitIfStmt(this, context);
    }
}
export class CommentStmt extends Statement {
    constructor(comment) {
        super();
        this.comment = comment;
    }
    visitStatement(visitor, context) {
        return visitor.visitCommentStmt(this, context);
    }
}
export class TryCatchStmt extends Statement {
    constructor(bodyStmts, catchStmts) {
        super();
        this.bodyStmts = bodyStmts;
        this.catchStmts = catchStmts;
    }
    visitStatement(visitor, context) {
        return visitor.visitTryCatchStmt(this, context);
    }
}
export class ThrowStmt extends Statement {
    constructor(error) {
        super();
        this.error = error;
    }
    visitStatement(visitor, context) {
        return visitor.visitThrowStmt(this, context);
    }
}
export class ExpressionTransformer {
    visitReadVarExpr(ast, context) { return ast; }
    visitWriteVarExpr(expr, context) {
        return new WriteVarExpr(expr.name, expr.value.visitExpression(this, context));
    }
    visitWriteKeyExpr(expr, context) {
        return new WriteKeyExpr(expr.receiver.visitExpression(this, context), expr.index.visitExpression(this, context), expr.value.visitExpression(this, context));
    }
    visitWritePropExpr(expr, context) {
        return new WritePropExpr(expr.receiver.visitExpression(this, context), expr.name, expr.value.visitExpression(this, context));
    }
    visitInvokeMethodExpr(ast, context) {
        var method = isPresent(ast.builtin) ? ast.builtin : ast.name;
        return new InvokeMethodExpr(ast.receiver.visitExpression(this, context), method, this.visitAllExpressions(ast.args, context), ast.type);
    }
    visitInvokeFunctionExpr(ast, context) {
        return new InvokeFunctionExpr(ast.fn.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type);
    }
    visitInstantiateExpr(ast, context) {
        return new InstantiateExpr(ast.classExpr.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type);
    }
    visitLiteralExpr(ast, context) { return ast; }
    visitExternalExpr(ast, context) { return ast; }
    visitConditionalExpr(ast, context) {
        return new ConditionalExpr(ast.condition.visitExpression(this, context), ast.trueCase.visitExpression(this, context), ast.falseCase.visitExpression(this, context));
    }
    visitNotExpr(ast, context) {
        return new NotExpr(ast.condition.visitExpression(this, context));
    }
    visitCastExpr(ast, context) {
        return new CastExpr(ast.value.visitExpression(this, context), context);
    }
    visitFunctionExpr(ast, context) {
        // Don't descend into nested functions
        return ast;
    }
    visitBinaryOperatorExpr(ast, context) {
        return new BinaryOperatorExpr(ast.operator, ast.lhs.visitExpression(this, context), ast.rhs.visitExpression(this, context), ast.type);
    }
    visitReadPropExpr(ast, context) {
        return new ReadPropExpr(ast.receiver.visitExpression(this, context), ast.name, ast.type);
    }
    visitReadKeyExpr(ast, context) {
        return new ReadKeyExpr(ast.receiver.visitExpression(this, context), ast.index.visitExpression(this, context), ast.type);
    }
    visitLiteralArrayExpr(ast, context) {
        return new LiteralArrayExpr(this.visitAllExpressions(ast.entries, context));
    }
    visitLiteralMapExpr(ast, context) {
        return new LiteralMapExpr(ast.entries.map((entry) => [entry[0], entry[1].visitExpression(this, context)]));
    }
    visitAllExpressions(exprs, context) {
        return exprs.map(expr => expr.visitExpression(this, context));
    }
    visitDeclareVarStmt(stmt, context) {
        return new DeclareVarStmt(stmt.name, stmt.value.visitExpression(this, context), stmt.type, stmt.modifiers);
    }
    visitDeclareFunctionStmt(stmt, context) {
        // Don't descend into nested functions
        return stmt;
    }
    visitExpressionStmt(stmt, context) {
        return new ExpressionStatement(stmt.expr.visitExpression(this, context));
    }
    visitReturnStmt(stmt, context) {
        return new ReturnStatement(stmt.value.visitExpression(this, context));
    }
    visitDeclareClassStmt(stmt, context) {
        // Don't descend into nested functions
        return stmt;
    }
    visitIfStmt(stmt, context) {
        return new IfStmt(stmt.condition.visitExpression(this, context), this.visitAllStatements(stmt.trueCase, context), this.visitAllStatements(stmt.falseCase, context));
    }
    visitTryCatchStmt(stmt, context) {
        return new TryCatchStmt(this.visitAllStatements(stmt.bodyStmts, context), this.visitAllStatements(stmt.catchStmts, context));
    }
    visitThrowStmt(stmt, context) {
        return new ThrowStmt(stmt.error.visitExpression(this, context));
    }
    visitCommentStmt(stmt, context) { return stmt; }
    visitAllStatements(stmts, context) {
        return stmts.map(stmt => stmt.visitStatement(this, context));
    }
}
export class RecursiveExpressionVisitor {
    visitReadVarExpr(ast, context) { return ast; }
    visitWriteVarExpr(expr, context) {
        expr.value.visitExpression(this, context);
        return expr;
    }
    visitWriteKeyExpr(expr, context) {
        expr.receiver.visitExpression(this, context);
        expr.index.visitExpression(this, context);
        expr.value.visitExpression(this, context);
        return expr;
    }
    visitWritePropExpr(expr, context) {
        expr.receiver.visitExpression(this, context);
        expr.value.visitExpression(this, context);
        return expr;
    }
    visitInvokeMethodExpr(ast, context) {
        ast.receiver.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return ast;
    }
    visitInvokeFunctionExpr(ast, context) {
        ast.fn.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return ast;
    }
    visitInstantiateExpr(ast, context) {
        ast.classExpr.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return ast;
    }
    visitLiteralExpr(ast, context) { return ast; }
    visitExternalExpr(ast, context) { return ast; }
    visitConditionalExpr(ast, context) {
        ast.condition.visitExpression(this, context);
        ast.trueCase.visitExpression(this, context);
        ast.falseCase.visitExpression(this, context);
        return ast;
    }
    visitNotExpr(ast, context) {
        ast.condition.visitExpression(this, context);
        return ast;
    }
    visitCastExpr(ast, context) {
        ast.value.visitExpression(this, context);
        return ast;
    }
    visitFunctionExpr(ast, context) { return ast; }
    visitBinaryOperatorExpr(ast, context) {
        ast.lhs.visitExpression(this, context);
        ast.rhs.visitExpression(this, context);
        return ast;
    }
    visitReadPropExpr(ast, context) {
        ast.receiver.visitExpression(this, context);
        return ast;
    }
    visitReadKeyExpr(ast, context) {
        ast.receiver.visitExpression(this, context);
        ast.index.visitExpression(this, context);
        return ast;
    }
    visitLiteralArrayExpr(ast, context) {
        this.visitAllExpressions(ast.entries, context);
        return ast;
    }
    visitLiteralMapExpr(ast, context) {
        ast.entries.forEach((entry) => entry[1].visitExpression(this, context));
        return ast;
    }
    visitAllExpressions(exprs, context) {
        exprs.forEach(expr => expr.visitExpression(this, context));
    }
    visitDeclareVarStmt(stmt, context) {
        stmt.value.visitExpression(this, context);
        return stmt;
    }
    visitDeclareFunctionStmt(stmt, context) {
        // Don't descend into nested functions
        return stmt;
    }
    visitExpressionStmt(stmt, context) {
        stmt.expr.visitExpression(this, context);
        return stmt;
    }
    visitReturnStmt(stmt, context) {
        stmt.value.visitExpression(this, context);
        return stmt;
    }
    visitDeclareClassStmt(stmt, context) {
        // Don't descend into nested functions
        return stmt;
    }
    visitIfStmt(stmt, context) {
        stmt.condition.visitExpression(this, context);
        this.visitAllStatements(stmt.trueCase, context);
        this.visitAllStatements(stmt.falseCase, context);
        return stmt;
    }
    visitTryCatchStmt(stmt, context) {
        this.visitAllStatements(stmt.bodyStmts, context);
        this.visitAllStatements(stmt.catchStmts, context);
        return stmt;
    }
    visitThrowStmt(stmt, context) {
        stmt.error.visitExpression(this, context);
        return stmt;
    }
    visitCommentStmt(stmt, context) { return stmt; }
    visitAllStatements(stmts, context) {
        stmts.forEach(stmt => stmt.visitStatement(this, context));
    }
}
export function replaceVarInExpression(varName, newValue, expression) {
    var transformer = new _ReplaceVariableTransformer(varName, newValue);
    return expression.visitExpression(transformer, null);
}
class _ReplaceVariableTransformer extends ExpressionTransformer {
    constructor(_varName, _newValue) {
        super();
        this._varName = _varName;
        this._newValue = _newValue;
    }
    visitReadVarExpr(ast, context) {
        return ast.name == this._varName ? this._newValue : ast;
    }
}
export function findReadVarNames(stmts) {
    var finder = new _VariableFinder();
    finder.visitAllStatements(stmts, null);
    return finder.varNames;
}
class _VariableFinder extends RecursiveExpressionVisitor {
    constructor(...args) {
        super(...args);
        this.varNames = new Set();
    }
    visitReadVarExpr(ast, context) {
        this.varNames.add(ast.name);
        return null;
    }
}
export function variable(name, type = null) {
    return new ReadVarExpr(name, type);
}
export function importExpr(id, typeParams = null) {
    return new ExternalExpr(id, null, typeParams);
}
export function importType(id, typeParams = null, typeModifiers = null) {
    return isPresent(id) ? new ExternalType(id, typeParams, typeModifiers) : null;
}
export function literal(value, type = null) {
    return new LiteralExpr(value, type);
}
export function literalArr(values, type = null) {
    return new LiteralArrayExpr(values, type);
}
export function literalMap(values, type = null) {
    return new LiteralMapExpr(values, type);
}
export function not(expr) {
    return new NotExpr(expr);
}
export function fn(params, body, type = null) {
    return new FunctionExpr(params, body, type);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0X2FzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUQxaUdRVkcudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9vdXRwdXQvb3V0cHV0X2FzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBQyxNQUFNLDBCQUEwQjtBQUdqRixVQUFVO0FBQ1YsV0FBWSxZQUVYO0FBRkQsV0FBWSxZQUFZO0lBQ3RCLGlEQUFLLENBQUE7QUFDUCxDQUFDLEVBRlcsWUFBWSxLQUFaLFlBQVksUUFFdkI7QUFFRDtJQUNFLFlBQW1CLFNBQVMsR0FBbUIsSUFBSTtRQUFoQyxjQUFTLEdBQVQsU0FBUyxDQUF1QjtRQUNqRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLENBQUM7SUFDSCxDQUFDO0lBR0QsV0FBVyxDQUFDLFFBQXNCLElBQWEsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRyxDQUFDO0FBRUQsV0FBWSxlQU9YO0FBUEQsV0FBWSxlQUFlO0lBQ3pCLDJEQUFPLENBQUE7SUFDUCxxREFBSSxDQUFBO0lBQ0oseURBQU0sQ0FBQTtJQUNOLG1EQUFHLENBQUE7SUFDSCx5REFBTSxDQUFBO0lBQ04sNkRBQVEsQ0FBQTtBQUNWLENBQUMsRUFQVyxlQUFlLEtBQWYsZUFBZSxRQU8xQjtBQUVELGlDQUFpQyxJQUFJO0lBQ25DLFlBQW1CLElBQXFCLEVBQUUsU0FBUyxHQUFtQixJQUFJO1FBQUksTUFBTSxTQUFTLENBQUMsQ0FBQztRQUE1RSxTQUFJLEdBQUosSUFBSSxDQUFpQjtJQUF3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RSxJQUFJLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBRUQsMkJBQTJCLE1BQW9CLEVBQUUsSUFBSSxHQUFTLElBQUk7SUFDaEUsTUFBTSxDQUFDLElBQUksZ0JBQWdCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFFRCwyQkFBMkIsTUFBeUMsRUFDekMsSUFBSSxHQUFZLElBQUk7SUFDN0MsTUFBTSxDQUFDLElBQUksY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBRUQsb0JBQW9CLElBQWdCO0lBQ2xDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQixDQUFDO0FBRUQsbUJBQW1CLE1BQWlCLEVBQUUsSUFBaUIsRUFBRSxJQUFJLEdBQVMsSUFBSTtJQUN4RSxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM5QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDT05TVF9FWFBSLCBpc1N0cmluZywgaXNQcmVzZW50LCBpc0JsYW5rfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtDb21waWxlSWRlbnRpZmllck1ldGFkYXRhfSBmcm9tICcuLi9jb21waWxlX21ldGFkYXRhJztcblxuLy8vLyBUeXBlc1xuZXhwb3J0IGVudW0gVHlwZU1vZGlmaWVyIHtcbiAgQ29uc3Rcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFR5cGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbW9kaWZpZXJzOiBUeXBlTW9kaWZpZXJbXSA9IG51bGwpIHtcbiAgICBpZiAoaXNCbGFuayhtb2RpZmllcnMpKSB7XG4gICAgICB0aGlzLm1vZGlmaWVycyA9IFtdO1xuICAgIH1cbiAgfVxuICBhYnN0cmFjdCB2aXNpdFR5cGUodmlzaXRvcjogVHlwZVZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueTtcblxuICBoYXNNb2RpZmllcihtb2RpZmllcjogVHlwZU1vZGlmaWVyKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLm1vZGlmaWVycy5pbmRleE9mKG1vZGlmaWVyKSAhPT0gLTE7IH1cbn1cblxuZXhwb3J0IGVudW0gQnVpbHRpblR5cGVOYW1lIHtcbiAgRHluYW1pYyxcbiAgQm9vbCxcbiAgU3RyaW5nLFxuICBJbnQsXG4gIE51bWJlcixcbiAgRnVuY3Rpb25cbn1cblxuZXhwb3J0IGNsYXNzIEJ1aWx0aW5UeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBCdWlsdGluVHlwZU5hbWUsIG1vZGlmaWVyczogVHlwZU1vZGlmaWVyW10gPSBudWxsKSB7IHN1cGVyKG1vZGlmaWVycyk7IH1cbiAgdmlzaXRUeXBlKHZpc2l0b3I6IFR5cGVWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QnVpbHRpbnRUeXBlKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFeHRlcm5hbFR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgY29uc3RydWN0b3IocHVibGljIHZhbHVlOiBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhLCBwdWJsaWMgdHlwZVBhcmFtczogVHlwZVtdID0gbnVsbCxcbiAgICAgICAgICAgICAgbW9kaWZpZXJzOiBUeXBlTW9kaWZpZXJbXSA9IG51bGwpIHtcbiAgICBzdXBlcihtb2RpZmllcnMpO1xuICB9XG4gIHZpc2l0VHlwZSh2aXNpdG9yOiBUeXBlVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEV4dGVybmFsVHlwZSh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBBcnJheVR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgY29uc3RydWN0b3IocHVibGljIG9mOiBUeXBlLCBtb2RpZmllcnM6IFR5cGVNb2RpZmllcltdID0gbnVsbCkgeyBzdXBlcihtb2RpZmllcnMpOyB9XG4gIHZpc2l0VHlwZSh2aXNpdG9yOiBUeXBlVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEFycmF5VHlwZSh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBNYXBUeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZVR5cGU6IFR5cGUsIG1vZGlmaWVyczogVHlwZU1vZGlmaWVyW10gPSBudWxsKSB7IHN1cGVyKG1vZGlmaWVycyk7IH1cbiAgdmlzaXRUeXBlKHZpc2l0b3I6IFR5cGVWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gdmlzaXRvci52aXNpdE1hcFR5cGUodGhpcywgY29udGV4dCk7IH1cbn1cblxuZXhwb3J0IHZhciBEWU5BTUlDX1RZUEUgPSBuZXcgQnVpbHRpblR5cGUoQnVpbHRpblR5cGVOYW1lLkR5bmFtaWMpO1xuZXhwb3J0IHZhciBCT09MX1RZUEUgPSBuZXcgQnVpbHRpblR5cGUoQnVpbHRpblR5cGVOYW1lLkJvb2wpO1xuZXhwb3J0IHZhciBJTlRfVFlQRSA9IG5ldyBCdWlsdGluVHlwZShCdWlsdGluVHlwZU5hbWUuSW50KTtcbmV4cG9ydCB2YXIgTlVNQkVSX1RZUEUgPSBuZXcgQnVpbHRpblR5cGUoQnVpbHRpblR5cGVOYW1lLk51bWJlcik7XG5leHBvcnQgdmFyIFNUUklOR19UWVBFID0gbmV3IEJ1aWx0aW5UeXBlKEJ1aWx0aW5UeXBlTmFtZS5TdHJpbmcpO1xuZXhwb3J0IHZhciBGVU5DVElPTl9UWVBFID0gbmV3IEJ1aWx0aW5UeXBlKEJ1aWx0aW5UeXBlTmFtZS5GdW5jdGlvbik7XG5cblxuZXhwb3J0IGludGVyZmFjZSBUeXBlVmlzaXRvciB7XG4gIHZpc2l0QnVpbHRpbnRUeXBlKHR5cGU6IEJ1aWx0aW5UeXBlLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0RXh0ZXJuYWxUeXBlKHR5cGU6IEV4dGVybmFsVHlwZSwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEFycmF5VHlwZSh0eXBlOiBBcnJheVR5cGUsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRNYXBUeXBlKHR5cGU6IE1hcFR5cGUsIGNvbnRleHQ6IGFueSk6IGFueTtcbn1cblxuLy8vLy8gRXhwcmVzc2lvbnNcblxuZXhwb3J0IGVudW0gQmluYXJ5T3BlcmF0b3Ige1xuICBFcXVhbHMsXG4gIE5vdEVxdWFscyxcbiAgSWRlbnRpY2FsLFxuICBOb3RJZGVudGljYWwsXG4gIE1pbnVzLFxuICBQbHVzLFxuICBEaXZpZGUsXG4gIE11bHRpcGx5LFxuICBNb2R1bG8sXG4gIEFuZCxcbiAgT3IsXG4gIExvd2VyLFxuICBMb3dlckVxdWFscyxcbiAgQmlnZ2VyLFxuICBCaWdnZXJFcXVhbHNcbn1cblxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRXhwcmVzc2lvbiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0eXBlOiBUeXBlKSB7fVxuXG4gIGFic3RyYWN0IHZpc2l0RXhwcmVzc2lvbih2aXNpdG9yOiBFeHByZXNzaW9uVmlzaXRvciwgY29udGV4dDogYW55KTogYW55O1xuXG4gIHByb3AobmFtZTogc3RyaW5nKTogUmVhZFByb3BFeHByIHsgcmV0dXJuIG5ldyBSZWFkUHJvcEV4cHIodGhpcywgbmFtZSk7IH1cblxuICBrZXkoaW5kZXg6IEV4cHJlc3Npb24sIHR5cGU6IFR5cGUgPSBudWxsKTogUmVhZEtleUV4cHIge1xuICAgIHJldHVybiBuZXcgUmVhZEtleUV4cHIodGhpcywgaW5kZXgsIHR5cGUpO1xuICB9XG5cbiAgY2FsbE1ldGhvZChuYW1lOiBzdHJpbmcgfCBCdWlsdGluTWV0aG9kLCBwYXJhbXM6IEV4cHJlc3Npb25bXSk6IEludm9rZU1ldGhvZEV4cHIge1xuICAgIHJldHVybiBuZXcgSW52b2tlTWV0aG9kRXhwcih0aGlzLCBuYW1lLCBwYXJhbXMpO1xuICB9XG5cbiAgY2FsbEZuKHBhcmFtczogRXhwcmVzc2lvbltdKTogSW52b2tlRnVuY3Rpb25FeHByIHsgcmV0dXJuIG5ldyBJbnZva2VGdW5jdGlvbkV4cHIodGhpcywgcGFyYW1zKTsgfVxuXG4gIGluc3RhbnRpYXRlKHBhcmFtczogRXhwcmVzc2lvbltdLCB0eXBlOiBUeXBlID0gbnVsbCk6IEluc3RhbnRpYXRlRXhwciB7XG4gICAgcmV0dXJuIG5ldyBJbnN0YW50aWF0ZUV4cHIodGhpcywgcGFyYW1zLCB0eXBlKTtcbiAgfVxuXG4gIGNvbmRpdGlvbmFsKHRydWVDYXNlOiBFeHByZXNzaW9uLCBmYWxzZUNhc2U6IEV4cHJlc3Npb24gPSBudWxsKTogQ29uZGl0aW9uYWxFeHByIHtcbiAgICByZXR1cm4gbmV3IENvbmRpdGlvbmFsRXhwcih0aGlzLCB0cnVlQ2FzZSwgZmFsc2VDYXNlKTtcbiAgfVxuXG4gIGVxdWFscyhyaHM6IEV4cHJlc3Npb24pOiBCaW5hcnlPcGVyYXRvckV4cHIge1xuICAgIHJldHVybiBuZXcgQmluYXJ5T3BlcmF0b3JFeHByKEJpbmFyeU9wZXJhdG9yLkVxdWFscywgdGhpcywgcmhzKTtcbiAgfVxuICBub3RFcXVhbHMocmhzOiBFeHByZXNzaW9uKTogQmluYXJ5T3BlcmF0b3JFeHByIHtcbiAgICByZXR1cm4gbmV3IEJpbmFyeU9wZXJhdG9yRXhwcihCaW5hcnlPcGVyYXRvci5Ob3RFcXVhbHMsIHRoaXMsIHJocyk7XG4gIH1cbiAgaWRlbnRpY2FsKHJoczogRXhwcmVzc2lvbik6IEJpbmFyeU9wZXJhdG9yRXhwciB7XG4gICAgcmV0dXJuIG5ldyBCaW5hcnlPcGVyYXRvckV4cHIoQmluYXJ5T3BlcmF0b3IuSWRlbnRpY2FsLCB0aGlzLCByaHMpO1xuICB9XG4gIG5vdElkZW50aWNhbChyaHM6IEV4cHJlc3Npb24pOiBCaW5hcnlPcGVyYXRvckV4cHIge1xuICAgIHJldHVybiBuZXcgQmluYXJ5T3BlcmF0b3JFeHByKEJpbmFyeU9wZXJhdG9yLk5vdElkZW50aWNhbCwgdGhpcywgcmhzKTtcbiAgfVxuICBtaW51cyhyaHM6IEV4cHJlc3Npb24pOiBCaW5hcnlPcGVyYXRvckV4cHIge1xuICAgIHJldHVybiBuZXcgQmluYXJ5T3BlcmF0b3JFeHByKEJpbmFyeU9wZXJhdG9yLk1pbnVzLCB0aGlzLCByaHMpO1xuICB9XG4gIHBsdXMocmhzOiBFeHByZXNzaW9uKTogQmluYXJ5T3BlcmF0b3JFeHByIHtcbiAgICByZXR1cm4gbmV3IEJpbmFyeU9wZXJhdG9yRXhwcihCaW5hcnlPcGVyYXRvci5QbHVzLCB0aGlzLCByaHMpO1xuICB9XG4gIGRpdmlkZShyaHM6IEV4cHJlc3Npb24pOiBCaW5hcnlPcGVyYXRvckV4cHIge1xuICAgIHJldHVybiBuZXcgQmluYXJ5T3BlcmF0b3JFeHByKEJpbmFyeU9wZXJhdG9yLkRpdmlkZSwgdGhpcywgcmhzKTtcbiAgfVxuICBtdWx0aXBseShyaHM6IEV4cHJlc3Npb24pOiBCaW5hcnlPcGVyYXRvckV4cHIge1xuICAgIHJldHVybiBuZXcgQmluYXJ5T3BlcmF0b3JFeHByKEJpbmFyeU9wZXJhdG9yLk11bHRpcGx5LCB0aGlzLCByaHMpO1xuICB9XG4gIG1vZHVsbyhyaHM6IEV4cHJlc3Npb24pOiBCaW5hcnlPcGVyYXRvckV4cHIge1xuICAgIHJldHVybiBuZXcgQmluYXJ5T3BlcmF0b3JFeHByKEJpbmFyeU9wZXJhdG9yLk1vZHVsbywgdGhpcywgcmhzKTtcbiAgfVxuICBhbmQocmhzOiBFeHByZXNzaW9uKTogQmluYXJ5T3BlcmF0b3JFeHByIHtcbiAgICByZXR1cm4gbmV3IEJpbmFyeU9wZXJhdG9yRXhwcihCaW5hcnlPcGVyYXRvci5BbmQsIHRoaXMsIHJocyk7XG4gIH1cbiAgb3IocmhzOiBFeHByZXNzaW9uKTogQmluYXJ5T3BlcmF0b3JFeHByIHtcbiAgICByZXR1cm4gbmV3IEJpbmFyeU9wZXJhdG9yRXhwcihCaW5hcnlPcGVyYXRvci5PciwgdGhpcywgcmhzKTtcbiAgfVxuICBsb3dlcihyaHM6IEV4cHJlc3Npb24pOiBCaW5hcnlPcGVyYXRvckV4cHIge1xuICAgIHJldHVybiBuZXcgQmluYXJ5T3BlcmF0b3JFeHByKEJpbmFyeU9wZXJhdG9yLkxvd2VyLCB0aGlzLCByaHMpO1xuICB9XG4gIGxvd2VyRXF1YWxzKHJoczogRXhwcmVzc2lvbik6IEJpbmFyeU9wZXJhdG9yRXhwciB7XG4gICAgcmV0dXJuIG5ldyBCaW5hcnlPcGVyYXRvckV4cHIoQmluYXJ5T3BlcmF0b3IuTG93ZXJFcXVhbHMsIHRoaXMsIHJocyk7XG4gIH1cbiAgYmlnZ2VyKHJoczogRXhwcmVzc2lvbik6IEJpbmFyeU9wZXJhdG9yRXhwciB7XG4gICAgcmV0dXJuIG5ldyBCaW5hcnlPcGVyYXRvckV4cHIoQmluYXJ5T3BlcmF0b3IuQmlnZ2VyLCB0aGlzLCByaHMpO1xuICB9XG4gIGJpZ2dlckVxdWFscyhyaHM6IEV4cHJlc3Npb24pOiBCaW5hcnlPcGVyYXRvckV4cHIge1xuICAgIHJldHVybiBuZXcgQmluYXJ5T3BlcmF0b3JFeHByKEJpbmFyeU9wZXJhdG9yLkJpZ2dlckVxdWFscywgdGhpcywgcmhzKTtcbiAgfVxuICBpc0JsYW5rKCk6IEV4cHJlc3Npb24ge1xuICAgIC8vIE5vdGU6IFdlIHVzZSBlcXVhbHMgYnkgcHVycG9zZSBoZXJlIHRvIGNvbXBhcmUgdG8gbnVsbCBhbmQgdW5kZWZpbmVkIGluIEpTLlxuICAgIHJldHVybiB0aGlzLmVxdWFscyhOVUxMX0VYUFIpO1xuICB9XG4gIGNhc3QodHlwZTogVHlwZSk6IEV4cHJlc3Npb24geyByZXR1cm4gbmV3IENhc3RFeHByKHRoaXMsIHR5cGUpOyB9XG4gIHRvU3RtdCgpOiBTdGF0ZW1lbnQgeyByZXR1cm4gbmV3IEV4cHJlc3Npb25TdGF0ZW1lbnQodGhpcyk7IH1cbn1cblxuZXhwb3J0IGVudW0gQnVpbHRpblZhciB7XG4gIFRoaXMsXG4gIFN1cGVyLFxuICBDYXRjaEVycm9yLFxuICBDYXRjaFN0YWNrXG59XG5cbmV4cG9ydCBjbGFzcyBSZWFkVmFyRXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBwdWJsaWMgbmFtZTtcbiAgcHVibGljIGJ1aWx0aW46IEJ1aWx0aW5WYXI7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nIHwgQnVpbHRpblZhciwgdHlwZTogVHlwZSA9IG51bGwpIHtcbiAgICBzdXBlcih0eXBlKTtcbiAgICBpZiAoaXNTdHJpbmcobmFtZSkpIHtcbiAgICAgIHRoaXMubmFtZSA9IDxzdHJpbmc+bmFtZTtcbiAgICAgIHRoaXMuYnVpbHRpbiA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubmFtZSA9IG51bGw7XG4gICAgICB0aGlzLmJ1aWx0aW4gPSA8QnVpbHRpblZhcj5uYW1lO1xuICAgIH1cbiAgfVxuICB2aXNpdEV4cHJlc3Npb24odmlzaXRvcjogRXhwcmVzc2lvblZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRSZWFkVmFyRXhwcih0aGlzLCBjb250ZXh0KTtcbiAgfVxuXG4gIHNldCh2YWx1ZTogRXhwcmVzc2lvbik6IFdyaXRlVmFyRXhwciB7IHJldHVybiBuZXcgV3JpdGVWYXJFeHByKHRoaXMubmFtZSwgdmFsdWUpOyB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFdyaXRlVmFyRXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBwdWJsaWMgdmFsdWU6IEV4cHJlc3Npb247XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHZhbHVlOiBFeHByZXNzaW9uLCB0eXBlOiBUeXBlID0gbnVsbCkge1xuICAgIHN1cGVyKGlzUHJlc2VudCh0eXBlKSA/IHR5cGUgOiB2YWx1ZS50eXBlKTtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICB2aXNpdEV4cHJlc3Npb24odmlzaXRvcjogRXhwcmVzc2lvblZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRXcml0ZVZhckV4cHIodGhpcywgY29udGV4dCk7XG4gIH1cblxuICB0b0RlY2xTdG10KHR5cGU6IFR5cGUgPSBudWxsLCBtb2RpZmllcnM6IFN0bXRNb2RpZmllcltdID0gbnVsbCk6IERlY2xhcmVWYXJTdG10IHtcbiAgICByZXR1cm4gbmV3IERlY2xhcmVWYXJTdG10KHRoaXMubmFtZSwgdGhpcy52YWx1ZSwgdHlwZSwgbW9kaWZpZXJzKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBXcml0ZUtleUV4cHIgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgcHVibGljIHZhbHVlOiBFeHByZXNzaW9uO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVjZWl2ZXI6IEV4cHJlc3Npb24sIHB1YmxpYyBpbmRleDogRXhwcmVzc2lvbiwgdmFsdWU6IEV4cHJlc3Npb24sXG4gICAgICAgICAgICAgIHR5cGU6IFR5cGUgPSBudWxsKSB7XG4gICAgc3VwZXIoaXNQcmVzZW50KHR5cGUpID8gdHlwZSA6IHZhbHVlLnR5cGUpO1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuICB2aXNpdEV4cHJlc3Npb24odmlzaXRvcjogRXhwcmVzc2lvblZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRXcml0ZUtleUV4cHIodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgV3JpdGVQcm9wRXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBwdWJsaWMgdmFsdWU6IEV4cHJlc3Npb247XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWNlaXZlcjogRXhwcmVzc2lvbiwgcHVibGljIG5hbWU6IHN0cmluZywgdmFsdWU6IEV4cHJlc3Npb24sXG4gICAgICAgICAgICAgIHR5cGU6IFR5cGUgPSBudWxsKSB7XG4gICAgc3VwZXIoaXNQcmVzZW50KHR5cGUpID8gdHlwZSA6IHZhbHVlLnR5cGUpO1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuICB2aXNpdEV4cHJlc3Npb24odmlzaXRvcjogRXhwcmVzc2lvblZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRXcml0ZVByb3BFeHByKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBlbnVtIEJ1aWx0aW5NZXRob2Qge1xuICBDb25jYXRBcnJheSxcbiAgU3Vic2NyaWJlT2JzZXJ2YWJsZSxcbiAgYmluZFxufVxuXG5leHBvcnQgY2xhc3MgSW52b2tlTWV0aG9kRXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICBwdWJsaWMgYnVpbHRpbjogQnVpbHRpbk1ldGhvZDtcbiAgY29uc3RydWN0b3IocHVibGljIHJlY2VpdmVyOiBFeHByZXNzaW9uLCBtZXRob2Q6IHN0cmluZyB8IEJ1aWx0aW5NZXRob2QsXG4gICAgICAgICAgICAgIHB1YmxpYyBhcmdzOiBFeHByZXNzaW9uW10sIHR5cGU6IFR5cGUgPSBudWxsKSB7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgaWYgKGlzU3RyaW5nKG1ldGhvZCkpIHtcbiAgICAgIHRoaXMubmFtZSA9IDxzdHJpbmc+bWV0aG9kO1xuICAgICAgdGhpcy5idWlsdGluID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5uYW1lID0gbnVsbDtcbiAgICAgIHRoaXMuYnVpbHRpbiA9IDxCdWlsdGluTWV0aG9kPm1ldGhvZDtcbiAgICB9XG4gIH1cbiAgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IEV4cHJlc3Npb25WaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0SW52b2tlTWV0aG9kRXhwcih0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBJbnZva2VGdW5jdGlvbkV4cHIgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIGZuOiBFeHByZXNzaW9uLCBwdWJsaWMgYXJnczogRXhwcmVzc2lvbltdLCB0eXBlOiBUeXBlID0gbnVsbCkgeyBzdXBlcih0eXBlKTsgfVxuICB2aXNpdEV4cHJlc3Npb24odmlzaXRvcjogRXhwcmVzc2lvblZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRJbnZva2VGdW5jdGlvbkV4cHIodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgSW5zdGFudGlhdGVFeHByIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjbGFzc0V4cHI6IEV4cHJlc3Npb24sIHB1YmxpYyBhcmdzOiBFeHByZXNzaW9uW10sIHR5cGU/OiBUeXBlKSB7IHN1cGVyKHR5cGUpOyB9XG4gIHZpc2l0RXhwcmVzc2lvbih2aXNpdG9yOiBFeHByZXNzaW9uVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEluc3RhbnRpYXRlRXhwcih0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBMaXRlcmFsRXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6IGFueSwgdHlwZTogVHlwZSA9IG51bGwpIHsgc3VwZXIodHlwZSk7IH1cbiAgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IEV4cHJlc3Npb25WaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TGl0ZXJhbEV4cHIodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgRXh0ZXJuYWxFeHByIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YSwgdHlwZTogVHlwZSA9IG51bGwsXG4gICAgICAgICAgICAgIHB1YmxpYyB0eXBlUGFyYW1zOiBUeXBlW10gPSBudWxsKSB7XG4gICAgc3VwZXIodHlwZSk7XG4gIH1cbiAgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IEV4cHJlc3Npb25WaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RXh0ZXJuYWxFeHByKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIENvbmRpdGlvbmFsRXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBwdWJsaWMgdHJ1ZUNhc2U6IEV4cHJlc3Npb247XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb25kaXRpb246IEV4cHJlc3Npb24sIHRydWVDYXNlOiBFeHByZXNzaW9uLFxuICAgICAgICAgICAgICBwdWJsaWMgZmFsc2VDYXNlOiBFeHByZXNzaW9uID0gbnVsbCwgdHlwZTogVHlwZSA9IG51bGwpIHtcbiAgICBzdXBlcihpc1ByZXNlbnQodHlwZSkgPyB0eXBlIDogdHJ1ZUNhc2UudHlwZSk7XG4gICAgdGhpcy50cnVlQ2FzZSA9IHRydWVDYXNlO1xuICB9XG4gIHZpc2l0RXhwcmVzc2lvbih2aXNpdG9yOiBFeHByZXNzaW9uVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdENvbmRpdGlvbmFsRXhwcih0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBOb3RFeHByIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb25kaXRpb246IEV4cHJlc3Npb24pIHsgc3VwZXIoQk9PTF9UWVBFKTsgfVxuICB2aXNpdEV4cHJlc3Npb24odmlzaXRvcjogRXhwcmVzc2lvblZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXROb3RFeHByKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDYXN0RXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6IEV4cHJlc3Npb24sIHR5cGU6IFR5cGUpIHsgc3VwZXIodHlwZSk7IH1cbiAgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IEV4cHJlc3Npb25WaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q2FzdEV4cHIodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgRm5QYXJhbSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyB0eXBlOiBUeXBlID0gbnVsbCkge31cbn1cblxuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25FeHByIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXJhbXM6IEZuUGFyYW1bXSwgcHVibGljIHN0YXRlbWVudHM6IFN0YXRlbWVudFtdLCB0eXBlOiBUeXBlID0gbnVsbCkge1xuICAgIHN1cGVyKHR5cGUpO1xuICB9XG4gIHZpc2l0RXhwcmVzc2lvbih2aXNpdG9yOiBFeHByZXNzaW9uVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEZ1bmN0aW9uRXhwcih0aGlzLCBjb250ZXh0KTtcbiAgfVxuXG4gIHRvRGVjbFN0bXQobmFtZTogc3RyaW5nLCBtb2RpZmllcnM6IFN0bXRNb2RpZmllcltdID0gbnVsbCk6IERlY2xhcmVGdW5jdGlvblN0bXQge1xuICAgIHJldHVybiBuZXcgRGVjbGFyZUZ1bmN0aW9uU3RtdChuYW1lLCB0aGlzLnBhcmFtcywgdGhpcy5zdGF0ZW1lbnRzLCB0aGlzLnR5cGUsIG1vZGlmaWVycyk7XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgQmluYXJ5T3BlcmF0b3JFeHByIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gIHB1YmxpYyBsaHM6IEV4cHJlc3Npb247XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBvcGVyYXRvcjogQmluYXJ5T3BlcmF0b3IsIGxoczogRXhwcmVzc2lvbiwgcHVibGljIHJoczogRXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgdHlwZTogVHlwZSA9IG51bGwpIHtcbiAgICBzdXBlcihpc1ByZXNlbnQodHlwZSkgPyB0eXBlIDogbGhzLnR5cGUpO1xuICAgIHRoaXMubGhzID0gbGhzO1xuICB9XG4gIHZpc2l0RXhwcmVzc2lvbih2aXNpdG9yOiBFeHByZXNzaW9uVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEJpbmFyeU9wZXJhdG9yRXhwcih0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBSZWFkUHJvcEV4cHIgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlY2VpdmVyOiBFeHByZXNzaW9uLCBwdWJsaWMgbmFtZTogc3RyaW5nLCB0eXBlOiBUeXBlID0gbnVsbCkgeyBzdXBlcih0eXBlKTsgfVxuICB2aXNpdEV4cHJlc3Npb24odmlzaXRvcjogRXhwcmVzc2lvblZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRSZWFkUHJvcEV4cHIodGhpcywgY29udGV4dCk7XG4gIH1cbiAgc2V0KHZhbHVlOiBFeHByZXNzaW9uKTogV3JpdGVQcm9wRXhwciB7XG4gICAgcmV0dXJuIG5ldyBXcml0ZVByb3BFeHByKHRoaXMucmVjZWl2ZXIsIHRoaXMubmFtZSwgdmFsdWUpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFJlYWRLZXlFeHByIGV4dGVuZHMgRXhwcmVzc2lvbiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWNlaXZlcjogRXhwcmVzc2lvbiwgcHVibGljIGluZGV4OiBFeHByZXNzaW9uLCB0eXBlOiBUeXBlID0gbnVsbCkge1xuICAgIHN1cGVyKHR5cGUpO1xuICB9XG4gIHZpc2l0RXhwcmVzc2lvbih2aXNpdG9yOiBFeHByZXNzaW9uVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdFJlYWRLZXlFeHByKHRoaXMsIGNvbnRleHQpO1xuICB9XG4gIHNldCh2YWx1ZTogRXhwcmVzc2lvbik6IFdyaXRlS2V5RXhwciB7XG4gICAgcmV0dXJuIG5ldyBXcml0ZUtleUV4cHIodGhpcy5yZWNlaXZlciwgdGhpcy5pbmRleCwgdmFsdWUpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIExpdGVyYWxBcnJheUV4cHIgZXh0ZW5kcyBFeHByZXNzaW9uIHtcbiAgcHVibGljIGVudHJpZXM6IEV4cHJlc3Npb25bXTtcbiAgY29uc3RydWN0b3IoZW50cmllczogRXhwcmVzc2lvbltdLCB0eXBlOiBUeXBlID0gbnVsbCkge1xuICAgIHN1cGVyKHR5cGUpO1xuICAgIHRoaXMuZW50cmllcyA9IGVudHJpZXM7XG4gIH1cbiAgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IEV4cHJlc3Npb25WaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0TGl0ZXJhbEFycmF5RXhwcih0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBMaXRlcmFsTWFwRXhwciBleHRlbmRzIEV4cHJlc3Npb24ge1xuICBwdWJsaWMgdmFsdWVUeXBlOiBUeXBlID0gbnVsbDtcbiAgO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZW50cmllczogQXJyYXk8QXJyYXk8c3RyaW5nIHwgRXhwcmVzc2lvbj4+LCB0eXBlOiBNYXBUeXBlID0gbnVsbCkge1xuICAgIHN1cGVyKHR5cGUpO1xuICAgIGlmIChpc1ByZXNlbnQodHlwZSkpIHtcbiAgICAgIHRoaXMudmFsdWVUeXBlID0gdHlwZS52YWx1ZVR5cGU7XG4gICAgfVxuICB9XG4gIHZpc2l0RXhwcmVzc2lvbih2aXNpdG9yOiBFeHByZXNzaW9uVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdExpdGVyYWxNYXBFeHByKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXhwcmVzc2lvblZpc2l0b3Ige1xuICB2aXNpdFJlYWRWYXJFeHByKGFzdDogUmVhZFZhckV4cHIsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRXcml0ZVZhckV4cHIoZXhwcjogV3JpdGVWYXJFeHByLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0V3JpdGVLZXlFeHByKGV4cHI6IFdyaXRlS2V5RXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdFdyaXRlUHJvcEV4cHIoZXhwcjogV3JpdGVQcm9wRXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEludm9rZU1ldGhvZEV4cHIoYXN0OiBJbnZva2VNZXRob2RFeHByLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0SW52b2tlRnVuY3Rpb25FeHByKGFzdDogSW52b2tlRnVuY3Rpb25FeHByLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0SW5zdGFudGlhdGVFeHByKGFzdDogSW5zdGFudGlhdGVFeHByLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0TGl0ZXJhbEV4cHIoYXN0OiBMaXRlcmFsRXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEV4dGVybmFsRXhwcihhc3Q6IEV4dGVybmFsRXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdENvbmRpdGlvbmFsRXhwcihhc3Q6IENvbmRpdGlvbmFsRXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdE5vdEV4cHIoYXN0OiBOb3RFeHByLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0Q2FzdEV4cHIoYXN0OiBDYXN0RXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEZ1bmN0aW9uRXhwcihhc3Q6IEZ1bmN0aW9uRXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEJpbmFyeU9wZXJhdG9yRXhwcihhc3Q6IEJpbmFyeU9wZXJhdG9yRXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdFJlYWRQcm9wRXhwcihhc3Q6IFJlYWRQcm9wRXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdFJlYWRLZXlFeHByKGFzdDogUmVhZEtleUV4cHIsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRMaXRlcmFsQXJyYXlFeHByKGFzdDogTGl0ZXJhbEFycmF5RXhwciwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdExpdGVyYWxNYXBFeHByKGFzdDogTGl0ZXJhbE1hcEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueTtcbn1cblxuZXhwb3J0IHZhciBUSElTX0VYUFIgPSBuZXcgUmVhZFZhckV4cHIoQnVpbHRpblZhci5UaGlzKTtcbmV4cG9ydCB2YXIgU1VQRVJfRVhQUiA9IG5ldyBSZWFkVmFyRXhwcihCdWlsdGluVmFyLlN1cGVyKTtcbmV4cG9ydCB2YXIgQ0FUQ0hfRVJST1JfVkFSID0gbmV3IFJlYWRWYXJFeHByKEJ1aWx0aW5WYXIuQ2F0Y2hFcnJvcik7XG5leHBvcnQgdmFyIENBVENIX1NUQUNLX1ZBUiA9IG5ldyBSZWFkVmFyRXhwcihCdWlsdGluVmFyLkNhdGNoU3RhY2spO1xuZXhwb3J0IHZhciBOVUxMX0VYUFIgPSBuZXcgTGl0ZXJhbEV4cHIobnVsbCwgbnVsbCk7XG5cbi8vLy8gU3RhdGVtZW50c1xuZXhwb3J0IGVudW0gU3RtdE1vZGlmaWVyIHtcbiAgRmluYWwsXG4gIFByaXZhdGVcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFN0YXRlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtb2RpZmllcnM6IFN0bXRNb2RpZmllcltdID0gbnVsbCkge1xuICAgIGlmIChpc0JsYW5rKG1vZGlmaWVycykpIHtcbiAgICAgIHRoaXMubW9kaWZpZXJzID0gW107XG4gICAgfVxuICB9XG5cbiAgYWJzdHJhY3QgdmlzaXRTdGF0ZW1lbnQodmlzaXRvcjogU3RhdGVtZW50VmlzaXRvciwgY29udGV4dDogYW55KTogYW55O1xuXG4gIGhhc01vZGlmaWVyKG1vZGlmaWVyOiBTdG10TW9kaWZpZXIpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubW9kaWZpZXJzLmluZGV4T2YobW9kaWZpZXIpICE9PSAtMTsgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBEZWNsYXJlVmFyU3RtdCBleHRlbmRzIFN0YXRlbWVudCB7XG4gIHB1YmxpYyB0eXBlOiBUeXBlO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgdmFsdWU6IEV4cHJlc3Npb24sIHR5cGU6IFR5cGUgPSBudWxsLFxuICAgICAgICAgICAgICBtb2RpZmllcnM6IFN0bXRNb2RpZmllcltdID0gbnVsbCkge1xuICAgIHN1cGVyKG1vZGlmaWVycyk7XG4gICAgdGhpcy50eXBlID0gaXNQcmVzZW50KHR5cGUpID8gdHlwZSA6IHZhbHVlLnR5cGU7XG4gIH1cblxuICB2aXNpdFN0YXRlbWVudCh2aXNpdG9yOiBTdGF0ZW1lbnRWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RGVjbGFyZVZhclN0bXQodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERlY2xhcmVGdW5jdGlvblN0bXQgZXh0ZW5kcyBTdGF0ZW1lbnQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgcGFyYW1zOiBGblBhcmFtW10sIHB1YmxpYyBzdGF0ZW1lbnRzOiBTdGF0ZW1lbnRbXSxcbiAgICAgICAgICAgICAgcHVibGljIHR5cGU6IFR5cGUgPSBudWxsLCBtb2RpZmllcnM6IFN0bXRNb2RpZmllcltdID0gbnVsbCkge1xuICAgIHN1cGVyKG1vZGlmaWVycyk7XG4gIH1cblxuICB2aXNpdFN0YXRlbWVudCh2aXNpdG9yOiBTdGF0ZW1lbnRWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RGVjbGFyZUZ1bmN0aW9uU3RtdCh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXhwcmVzc2lvblN0YXRlbWVudCBleHRlbmRzIFN0YXRlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBleHByOiBFeHByZXNzaW9uKSB7IHN1cGVyKCk7IH1cblxuICB2aXNpdFN0YXRlbWVudCh2aXNpdG9yOiBTdGF0ZW1lbnRWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RXhwcmVzc2lvblN0bXQodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgUmV0dXJuU3RhdGVtZW50IGV4dGVuZHMgU3RhdGVtZW50IHtcbiAgY29uc3RydWN0b3IocHVibGljIHZhbHVlOiBFeHByZXNzaW9uKSB7IHN1cGVyKCk7IH1cbiAgdmlzaXRTdGF0ZW1lbnQodmlzaXRvcjogU3RhdGVtZW50VmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdFJldHVyblN0bXQodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFic3RyYWN0Q2xhc3NQYXJ0IHtcbiAgY29uc3RydWN0b3IocHVibGljIHR5cGU6IFR5cGUgPSBudWxsLCBwdWJsaWMgbW9kaWZpZXJzOiBTdG10TW9kaWZpZXJbXSkge1xuICAgIGlmIChpc0JsYW5rKG1vZGlmaWVycykpIHtcbiAgICAgIHRoaXMubW9kaWZpZXJzID0gW107XG4gICAgfVxuICB9XG4gIGhhc01vZGlmaWVyKG1vZGlmaWVyOiBTdG10TW9kaWZpZXIpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubW9kaWZpZXJzLmluZGV4T2YobW9kaWZpZXIpICE9PSAtMTsgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2xhc3NGaWVsZCBleHRlbmRzIEFic3RyYWN0Q2xhc3NQYXJ0IHtcbiAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgdHlwZTogVHlwZSA9IG51bGwsIG1vZGlmaWVyczogU3RtdE1vZGlmaWVyW10gPSBudWxsKSB7XG4gICAgc3VwZXIodHlwZSwgbW9kaWZpZXJzKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBDbGFzc01ldGhvZCBleHRlbmRzIEFic3RyYWN0Q2xhc3NQYXJ0IHtcbiAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIHBhcmFtczogRm5QYXJhbVtdLCBwdWJsaWMgYm9keTogU3RhdGVtZW50W10sXG4gICAgICAgICAgICAgIHR5cGU6IFR5cGUgPSBudWxsLCBtb2RpZmllcnM6IFN0bXRNb2RpZmllcltdID0gbnVsbCkge1xuICAgIHN1cGVyKHR5cGUsIG1vZGlmaWVycyk7XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgQ2xhc3NHZXR0ZXIgZXh0ZW5kcyBBYnN0cmFjdENsYXNzUGFydCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBib2R5OiBTdGF0ZW1lbnRbXSwgdHlwZTogVHlwZSA9IG51bGwsXG4gICAgICAgICAgICAgIG1vZGlmaWVyczogU3RtdE1vZGlmaWVyW10gPSBudWxsKSB7XG4gICAgc3VwZXIodHlwZSwgbW9kaWZpZXJzKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBDbGFzc1N0bXQgZXh0ZW5kcyBTdGF0ZW1lbnQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgcGFyZW50OiBFeHByZXNzaW9uLCBwdWJsaWMgZmllbGRzOiBDbGFzc0ZpZWxkW10sXG4gICAgICAgICAgICAgIHB1YmxpYyBnZXR0ZXJzOiBDbGFzc0dldHRlcltdLCBwdWJsaWMgY29uc3RydWN0b3JNZXRob2Q6IENsYXNzTWV0aG9kLFxuICAgICAgICAgICAgICBwdWJsaWMgbWV0aG9kczogQ2xhc3NNZXRob2RbXSwgbW9kaWZpZXJzOiBTdG10TW9kaWZpZXJbXSA9IG51bGwpIHtcbiAgICBzdXBlcihtb2RpZmllcnMpO1xuICB9XG4gIHZpc2l0U3RhdGVtZW50KHZpc2l0b3I6IFN0YXRlbWVudFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXREZWNsYXJlQ2xhc3NTdG10KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIElmU3RtdCBleHRlbmRzIFN0YXRlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb25kaXRpb246IEV4cHJlc3Npb24sIHB1YmxpYyB0cnVlQ2FzZTogU3RhdGVtZW50W10sXG4gICAgICAgICAgICAgIHB1YmxpYyBmYWxzZUNhc2U6IFN0YXRlbWVudFtdID0gQ09OU1RfRVhQUihbXSkpIHtcbiAgICBzdXBlcigpO1xuICB9XG4gIHZpc2l0U3RhdGVtZW50KHZpc2l0b3I6IFN0YXRlbWVudFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRJZlN0bXQodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgQ29tbWVudFN0bXQgZXh0ZW5kcyBTdGF0ZW1lbnQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29tbWVudDogc3RyaW5nKSB7IHN1cGVyKCk7IH1cbiAgdmlzaXRTdGF0ZW1lbnQodmlzaXRvcjogU3RhdGVtZW50VmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdENvbW1lbnRTdG10KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFRyeUNhdGNoU3RtdCBleHRlbmRzIFN0YXRlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBib2R5U3RtdHM6IFN0YXRlbWVudFtdLCBwdWJsaWMgY2F0Y2hTdG10czogU3RhdGVtZW50W10pIHsgc3VwZXIoKTsgfVxuICB2aXNpdFN0YXRlbWVudCh2aXNpdG9yOiBTdGF0ZW1lbnRWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VHJ5Q2F0Y2hTdG10KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFRocm93U3RtdCBleHRlbmRzIFN0YXRlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlcnJvcjogRXhwcmVzc2lvbikgeyBzdXBlcigpOyB9XG4gIHZpc2l0U3RhdGVtZW50KHZpc2l0b3I6IFN0YXRlbWVudFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUaHJvd1N0bXQodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdGF0ZW1lbnRWaXNpdG9yIHtcbiAgdmlzaXREZWNsYXJlVmFyU3RtdChzdG10OiBEZWNsYXJlVmFyU3RtdCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdERlY2xhcmVGdW5jdGlvblN0bXQoc3RtdDogRGVjbGFyZUZ1bmN0aW9uU3RtdCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEV4cHJlc3Npb25TdG10KHN0bXQ6IEV4cHJlc3Npb25TdGF0ZW1lbnQsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRSZXR1cm5TdG10KHN0bXQ6IFJldHVyblN0YXRlbWVudCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdERlY2xhcmVDbGFzc1N0bXQoc3RtdDogQ2xhc3NTdG10LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0SWZTdG10KHN0bXQ6IElmU3RtdCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdFRyeUNhdGNoU3RtdChzdG10OiBUcnlDYXRjaFN0bXQsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRUaHJvd1N0bXQoc3RtdDogVGhyb3dTdG10LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0Q29tbWVudFN0bXQoc3RtdDogQ29tbWVudFN0bXQsIGNvbnRleHQ6IGFueSk6IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIEV4cHJlc3Npb25UcmFuc2Zvcm1lciBpbXBsZW1lbnRzIFN0YXRlbWVudFZpc2l0b3IsIEV4cHJlc3Npb25WaXNpdG9yIHtcbiAgdmlzaXRSZWFkVmFyRXhwcihhc3Q6IFJlYWRWYXJFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gYXN0OyB9XG4gIHZpc2l0V3JpdGVWYXJFeHByKGV4cHI6IFdyaXRlVmFyRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gbmV3IFdyaXRlVmFyRXhwcihleHByLm5hbWUsIGV4cHIudmFsdWUudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpKTtcbiAgfVxuICB2aXNpdFdyaXRlS2V5RXhwcihleHByOiBXcml0ZUtleUV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIG5ldyBXcml0ZUtleUV4cHIoZXhwci5yZWNlaXZlci52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwci5pbmRleC52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwci52YWx1ZS52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCkpO1xuICB9XG4gIHZpc2l0V3JpdGVQcm9wRXhwcihleHByOiBXcml0ZVByb3BFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBuZXcgV3JpdGVQcm9wRXhwcihleHByLnJlY2VpdmVyLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSwgZXhwci5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHByLnZhbHVlLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSk7XG4gIH1cbiAgdmlzaXRJbnZva2VNZXRob2RFeHByKGFzdDogSW52b2tlTWV0aG9kRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB2YXIgbWV0aG9kID0gaXNQcmVzZW50KGFzdC5idWlsdGluKSA/IGFzdC5idWlsdGluIDogYXN0Lm5hbWU7XG4gICAgcmV0dXJuIG5ldyBJbnZva2VNZXRob2RFeHByKGFzdC5yZWNlaXZlci52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksIG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aXNpdEFsbEV4cHJlc3Npb25zKGFzdC5hcmdzLCBjb250ZXh0KSwgYXN0LnR5cGUpO1xuICB9XG4gIHZpc2l0SW52b2tlRnVuY3Rpb25FeHByKGFzdDogSW52b2tlRnVuY3Rpb25FeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBuZXcgSW52b2tlRnVuY3Rpb25FeHByKGFzdC5mbi52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aXNpdEFsbEV4cHJlc3Npb25zKGFzdC5hcmdzLCBjb250ZXh0KSwgYXN0LnR5cGUpO1xuICB9XG4gIHZpc2l0SW5zdGFudGlhdGVFeHByKGFzdDogSW5zdGFudGlhdGVFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBuZXcgSW5zdGFudGlhdGVFeHByKGFzdC5jbGFzc0V4cHIudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlzaXRBbGxFeHByZXNzaW9ucyhhc3QuYXJncywgY29udGV4dCksIGFzdC50eXBlKTtcbiAgfVxuICB2aXNpdExpdGVyYWxFeHByKGFzdDogTGl0ZXJhbEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBhc3Q7IH1cbiAgdmlzaXRFeHRlcm5hbEV4cHIoYXN0OiBFeHRlcm5hbEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBhc3Q7IH1cbiAgdmlzaXRDb25kaXRpb25hbEV4cHIoYXN0OiBDb25kaXRpb25hbEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIG5ldyBDb25kaXRpb25hbEV4cHIoYXN0LmNvbmRpdGlvbi52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN0LnRydWVDYXNlLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3QuZmFsc2VDYXNlLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSk7XG4gIH1cbiAgdmlzaXROb3RFeHByKGFzdDogTm90RXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gbmV3IE5vdEV4cHIoYXN0LmNvbmRpdGlvbi52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCkpO1xuICB9XG4gIHZpc2l0Q2FzdEV4cHIoYXN0OiBDYXN0RXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gbmV3IENhc3RFeHByKGFzdC52YWx1ZS52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksIGNvbnRleHQpO1xuICB9XG4gIHZpc2l0RnVuY3Rpb25FeHByKGFzdDogRnVuY3Rpb25FeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIC8vIERvbid0IGRlc2NlbmQgaW50byBuZXN0ZWQgZnVuY3Rpb25zXG4gICAgcmV0dXJuIGFzdDtcbiAgfVxuICB2aXNpdEJpbmFyeU9wZXJhdG9yRXhwcihhc3Q6IEJpbmFyeU9wZXJhdG9yRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gbmV3IEJpbmFyeU9wZXJhdG9yRXhwcihhc3Qub3BlcmF0b3IsIGFzdC5saHMudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzdC5yaHMudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpLCBhc3QudHlwZSk7XG4gIH1cbiAgdmlzaXRSZWFkUHJvcEV4cHIoYXN0OiBSZWFkUHJvcEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIG5ldyBSZWFkUHJvcEV4cHIoYXN0LnJlY2VpdmVyLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSwgYXN0Lm5hbWUsIGFzdC50eXBlKTtcbiAgfVxuICB2aXNpdFJlYWRLZXlFeHByKGFzdDogUmVhZEtleUV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIG5ldyBSZWFkS2V5RXhwcihhc3QucmVjZWl2ZXIudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN0LmluZGV4LnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSwgYXN0LnR5cGUpO1xuICB9XG4gIHZpc2l0TGl0ZXJhbEFycmF5RXhwcihhc3Q6IExpdGVyYWxBcnJheUV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIG5ldyBMaXRlcmFsQXJyYXlFeHByKHRoaXMudmlzaXRBbGxFeHByZXNzaW9ucyhhc3QuZW50cmllcywgY29udGV4dCkpO1xuICB9XG4gIHZpc2l0TGl0ZXJhbE1hcEV4cHIoYXN0OiBMaXRlcmFsTWFwRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gbmV3IExpdGVyYWxNYXBFeHByKGFzdC5lbnRyaWVzLm1hcChcbiAgICAgICAgKGVudHJ5KSA9PiBbZW50cnlbMF0sICg8RXhwcmVzc2lvbj5lbnRyeVsxXSkudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpXSkpO1xuICB9XG4gIHZpc2l0QWxsRXhwcmVzc2lvbnMoZXhwcnM6IEV4cHJlc3Npb25bXSwgY29udGV4dDogYW55KTogRXhwcmVzc2lvbltdIHtcbiAgICByZXR1cm4gZXhwcnMubWFwKGV4cHIgPT4gZXhwci52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCkpO1xuICB9XG5cbiAgdmlzaXREZWNsYXJlVmFyU3RtdChzdG10OiBEZWNsYXJlVmFyU3RtdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gbmV3IERlY2xhcmVWYXJTdG10KHN0bXQubmFtZSwgc3RtdC52YWx1ZS52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksIHN0bXQudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0bXQubW9kaWZpZXJzKTtcbiAgfVxuICB2aXNpdERlY2xhcmVGdW5jdGlvblN0bXQoc3RtdDogRGVjbGFyZUZ1bmN0aW9uU3RtdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICAvLyBEb24ndCBkZXNjZW5kIGludG8gbmVzdGVkIGZ1bmN0aW9uc1xuICAgIHJldHVybiBzdG10O1xuICB9XG4gIHZpc2l0RXhwcmVzc2lvblN0bXQoc3RtdDogRXhwcmVzc2lvblN0YXRlbWVudCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gbmV3IEV4cHJlc3Npb25TdGF0ZW1lbnQoc3RtdC5leHByLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSk7XG4gIH1cbiAgdmlzaXRSZXR1cm5TdG10KHN0bXQ6IFJldHVyblN0YXRlbWVudCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gbmV3IFJldHVyblN0YXRlbWVudChzdG10LnZhbHVlLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSk7XG4gIH1cbiAgdmlzaXREZWNsYXJlQ2xhc3NTdG10KHN0bXQ6IENsYXNzU3RtdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICAvLyBEb24ndCBkZXNjZW5kIGludG8gbmVzdGVkIGZ1bmN0aW9uc1xuICAgIHJldHVybiBzdG10O1xuICB9XG4gIHZpc2l0SWZTdG10KHN0bXQ6IElmU3RtdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gbmV3IElmU3RtdChzdG10LmNvbmRpdGlvbi52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCksXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy52aXNpdEFsbFN0YXRlbWVudHMoc3RtdC50cnVlQ2FzZSwgY29udGV4dCksXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy52aXNpdEFsbFN0YXRlbWVudHMoc3RtdC5mYWxzZUNhc2UsIGNvbnRleHQpKTtcbiAgfVxuICB2aXNpdFRyeUNhdGNoU3RtdChzdG10OiBUcnlDYXRjaFN0bXQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIG5ldyBUcnlDYXRjaFN0bXQodGhpcy52aXNpdEFsbFN0YXRlbWVudHMoc3RtdC5ib2R5U3RtdHMsIGNvbnRleHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlzaXRBbGxTdGF0ZW1lbnRzKHN0bXQuY2F0Y2hTdG10cywgY29udGV4dCkpO1xuICB9XG4gIHZpc2l0VGhyb3dTdG10KHN0bXQ6IFRocm93U3RtdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gbmV3IFRocm93U3RtdChzdG10LmVycm9yLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSk7XG4gIH1cbiAgdmlzaXRDb21tZW50U3RtdChzdG10OiBDb21tZW50U3RtdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIHN0bXQ7IH1cbiAgdmlzaXRBbGxTdGF0ZW1lbnRzKHN0bXRzOiBTdGF0ZW1lbnRbXSwgY29udGV4dDogYW55KTogU3RhdGVtZW50W10ge1xuICAgIHJldHVybiBzdG10cy5tYXAoc3RtdCA9PiBzdG10LnZpc2l0U3RhdGVtZW50KHRoaXMsIGNvbnRleHQpKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBSZWN1cnNpdmVFeHByZXNzaW9uVmlzaXRvciBpbXBsZW1lbnRzIFN0YXRlbWVudFZpc2l0b3IsIEV4cHJlc3Npb25WaXNpdG9yIHtcbiAgdmlzaXRSZWFkVmFyRXhwcihhc3Q6IFJlYWRWYXJFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gYXN0OyB9XG4gIHZpc2l0V3JpdGVWYXJFeHByKGV4cHI6IFdyaXRlVmFyRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBleHByLnZhbHVlLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuICB2aXNpdFdyaXRlS2V5RXhwcihleHByOiBXcml0ZUtleUV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgZXhwci5yZWNlaXZlci52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgZXhwci5pbmRleC52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgZXhwci52YWx1ZS52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cbiAgdmlzaXRXcml0ZVByb3BFeHByKGV4cHI6IFdyaXRlUHJvcEV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgZXhwci5yZWNlaXZlci52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgZXhwci52YWx1ZS52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cbiAgdmlzaXRJbnZva2VNZXRob2RFeHByKGFzdDogSW52b2tlTWV0aG9kRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBhc3QucmVjZWl2ZXIudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpO1xuICAgIHRoaXMudmlzaXRBbGxFeHByZXNzaW9ucyhhc3QuYXJncywgY29udGV4dCk7XG4gICAgcmV0dXJuIGFzdDtcbiAgfVxuICB2aXNpdEludm9rZUZ1bmN0aW9uRXhwcihhc3Q6IEludm9rZUZ1bmN0aW9uRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBhc3QuZm4udmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpO1xuICAgIHRoaXMudmlzaXRBbGxFeHByZXNzaW9ucyhhc3QuYXJncywgY29udGV4dCk7XG4gICAgcmV0dXJuIGFzdDtcbiAgfVxuICB2aXNpdEluc3RhbnRpYXRlRXhwcihhc3Q6IEluc3RhbnRpYXRlRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBhc3QuY2xhc3NFeHByLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICB0aGlzLnZpc2l0QWxsRXhwcmVzc2lvbnMoYXN0LmFyZ3MsIGNvbnRleHQpO1xuICAgIHJldHVybiBhc3Q7XG4gIH1cbiAgdmlzaXRMaXRlcmFsRXhwcihhc3Q6IExpdGVyYWxFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gYXN0OyB9XG4gIHZpc2l0RXh0ZXJuYWxFeHByKGFzdDogRXh0ZXJuYWxFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gYXN0OyB9XG4gIHZpc2l0Q29uZGl0aW9uYWxFeHByKGFzdDogQ29uZGl0aW9uYWxFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGFzdC5jb25kaXRpb24udmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpO1xuICAgIGFzdC50cnVlQ2FzZS52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgYXN0LmZhbHNlQ2FzZS52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgcmV0dXJuIGFzdDtcbiAgfVxuICB2aXNpdE5vdEV4cHIoYXN0OiBOb3RFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGFzdC5jb25kaXRpb24udmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpO1xuICAgIHJldHVybiBhc3Q7XG4gIH1cbiAgdmlzaXRDYXN0RXhwcihhc3Q6IENhc3RFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGFzdC52YWx1ZS52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgcmV0dXJuIGFzdDtcbiAgfVxuICB2aXNpdEZ1bmN0aW9uRXhwcihhc3Q6IEZ1bmN0aW9uRXhwciwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIGFzdDsgfVxuICB2aXNpdEJpbmFyeU9wZXJhdG9yRXhwcihhc3Q6IEJpbmFyeU9wZXJhdG9yRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBhc3QubGhzLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICBhc3QucmhzLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICByZXR1cm4gYXN0O1xuICB9XG4gIHZpc2l0UmVhZFByb3BFeHByKGFzdDogUmVhZFByb3BFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGFzdC5yZWNlaXZlci52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgcmV0dXJuIGFzdDtcbiAgfVxuICB2aXNpdFJlYWRLZXlFeHByKGFzdDogUmVhZEtleUV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgYXN0LnJlY2VpdmVyLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICBhc3QuaW5kZXgudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpO1xuICAgIHJldHVybiBhc3Q7XG4gIH1cbiAgdmlzaXRMaXRlcmFsQXJyYXlFeHByKGFzdDogTGl0ZXJhbEFycmF5RXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB0aGlzLnZpc2l0QWxsRXhwcmVzc2lvbnMoYXN0LmVudHJpZXMsIGNvbnRleHQpO1xuICAgIHJldHVybiBhc3Q7XG4gIH1cbiAgdmlzaXRMaXRlcmFsTWFwRXhwcihhc3Q6IExpdGVyYWxNYXBFeHByLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGFzdC5lbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiAoPEV4cHJlc3Npb24+ZW50cnlbMV0pLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSk7XG4gICAgcmV0dXJuIGFzdDtcbiAgfVxuICB2aXNpdEFsbEV4cHJlc3Npb25zKGV4cHJzOiBFeHByZXNzaW9uW10sIGNvbnRleHQ6IGFueSk6IHZvaWQge1xuICAgIGV4cHJzLmZvckVhY2goZXhwciA9PiBleHByLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KSk7XG4gIH1cblxuICB2aXNpdERlY2xhcmVWYXJTdG10KHN0bXQ6IERlY2xhcmVWYXJTdG10LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHN0bXQudmFsdWUudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpO1xuICAgIHJldHVybiBzdG10O1xuICB9XG4gIHZpc2l0RGVjbGFyZUZ1bmN0aW9uU3RtdChzdG10OiBEZWNsYXJlRnVuY3Rpb25TdG10LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIC8vIERvbid0IGRlc2NlbmQgaW50byBuZXN0ZWQgZnVuY3Rpb25zXG4gICAgcmV0dXJuIHN0bXQ7XG4gIH1cbiAgdmlzaXRFeHByZXNzaW9uU3RtdChzdG10OiBFeHByZXNzaW9uU3RhdGVtZW50LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHN0bXQuZXhwci52aXNpdEV4cHJlc3Npb24odGhpcywgY29udGV4dCk7XG4gICAgcmV0dXJuIHN0bXQ7XG4gIH1cbiAgdmlzaXRSZXR1cm5TdG10KHN0bXQ6IFJldHVyblN0YXRlbWVudCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBzdG10LnZhbHVlLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICByZXR1cm4gc3RtdDtcbiAgfVxuICB2aXNpdERlY2xhcmVDbGFzc1N0bXQoc3RtdDogQ2xhc3NTdG10LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIC8vIERvbid0IGRlc2NlbmQgaW50byBuZXN0ZWQgZnVuY3Rpb25zXG4gICAgcmV0dXJuIHN0bXQ7XG4gIH1cbiAgdmlzaXRJZlN0bXQoc3RtdDogSWZTdG10LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHN0bXQuY29uZGl0aW9uLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICB0aGlzLnZpc2l0QWxsU3RhdGVtZW50cyhzdG10LnRydWVDYXNlLCBjb250ZXh0KTtcbiAgICB0aGlzLnZpc2l0QWxsU3RhdGVtZW50cyhzdG10LmZhbHNlQ2FzZSwgY29udGV4dCk7XG4gICAgcmV0dXJuIHN0bXQ7XG4gIH1cbiAgdmlzaXRUcnlDYXRjaFN0bXQoc3RtdDogVHJ5Q2F0Y2hTdG10LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHRoaXMudmlzaXRBbGxTdGF0ZW1lbnRzKHN0bXQuYm9keVN0bXRzLCBjb250ZXh0KTtcbiAgICB0aGlzLnZpc2l0QWxsU3RhdGVtZW50cyhzdG10LmNhdGNoU3RtdHMsIGNvbnRleHQpO1xuICAgIHJldHVybiBzdG10O1xuICB9XG4gIHZpc2l0VGhyb3dTdG10KHN0bXQ6IFRocm93U3RtdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBzdG10LmVycm9yLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgICByZXR1cm4gc3RtdDtcbiAgfVxuICB2aXNpdENvbW1lbnRTdG10KHN0bXQ6IENvbW1lbnRTdG10LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gc3RtdDsgfVxuICB2aXNpdEFsbFN0YXRlbWVudHMoc3RtdHM6IFN0YXRlbWVudFtdLCBjb250ZXh0OiBhbnkpOiB2b2lkIHtcbiAgICBzdG10cy5mb3JFYWNoKHN0bXQgPT4gc3RtdC52aXNpdFN0YXRlbWVudCh0aGlzLCBjb250ZXh0KSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VWYXJJbkV4cHJlc3Npb24odmFyTmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogRXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb246IEV4cHJlc3Npb24pOiBFeHByZXNzaW9uIHtcbiAgdmFyIHRyYW5zZm9ybWVyID0gbmV3IF9SZXBsYWNlVmFyaWFibGVUcmFuc2Zvcm1lcih2YXJOYW1lLCBuZXdWYWx1ZSk7XG4gIHJldHVybiBleHByZXNzaW9uLnZpc2l0RXhwcmVzc2lvbih0cmFuc2Zvcm1lciwgbnVsbCk7XG59XG5cbmNsYXNzIF9SZXBsYWNlVmFyaWFibGVUcmFuc2Zvcm1lciBleHRlbmRzIEV4cHJlc3Npb25UcmFuc2Zvcm1lciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3Zhck5hbWU6IHN0cmluZywgcHJpdmF0ZSBfbmV3VmFsdWU6IEV4cHJlc3Npb24pIHsgc3VwZXIoKTsgfVxuICB2aXNpdFJlYWRWYXJFeHByKGFzdDogUmVhZFZhckV4cHIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIGFzdC5uYW1lID09IHRoaXMuX3Zhck5hbWUgPyB0aGlzLl9uZXdWYWx1ZSA6IGFzdDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFJlYWRWYXJOYW1lcyhzdG10czogU3RhdGVtZW50W10pOiBTZXQ8c3RyaW5nPiB7XG4gIHZhciBmaW5kZXIgPSBuZXcgX1ZhcmlhYmxlRmluZGVyKCk7XG4gIGZpbmRlci52aXNpdEFsbFN0YXRlbWVudHMoc3RtdHMsIG51bGwpO1xuICByZXR1cm4gZmluZGVyLnZhck5hbWVzO1xufVxuXG5jbGFzcyBfVmFyaWFibGVGaW5kZXIgZXh0ZW5kcyBSZWN1cnNpdmVFeHByZXNzaW9uVmlzaXRvciB7XG4gIHZhck5hbWVzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIHZpc2l0UmVhZFZhckV4cHIoYXN0OiBSZWFkVmFyRXhwciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB0aGlzLnZhck5hbWVzLmFkZChhc3QubmFtZSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhcmlhYmxlKG5hbWU6IHN0cmluZywgdHlwZTogVHlwZSA9IG51bGwpOiBSZWFkVmFyRXhwciB7XG4gIHJldHVybiBuZXcgUmVhZFZhckV4cHIobmFtZSwgdHlwZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbXBvcnRFeHByKGlkOiBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhLCB0eXBlUGFyYW1zOiBUeXBlW10gPSBudWxsKTogRXh0ZXJuYWxFeHByIHtcbiAgcmV0dXJuIG5ldyBFeHRlcm5hbEV4cHIoaWQsIG51bGwsIHR5cGVQYXJhbXMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW1wb3J0VHlwZShpZDogQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YSwgdHlwZVBhcmFtczogVHlwZVtdID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVNb2RpZmllcnM6IFR5cGVNb2RpZmllcltdID0gbnVsbCk6IEV4dGVybmFsVHlwZSB7XG4gIHJldHVybiBpc1ByZXNlbnQoaWQpID8gbmV3IEV4dGVybmFsVHlwZShpZCwgdHlwZVBhcmFtcywgdHlwZU1vZGlmaWVycykgOiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGl0ZXJhbCh2YWx1ZTogYW55LCB0eXBlOiBUeXBlID0gbnVsbCk6IExpdGVyYWxFeHByIHtcbiAgcmV0dXJuIG5ldyBMaXRlcmFsRXhwcih2YWx1ZSwgdHlwZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXRlcmFsQXJyKHZhbHVlczogRXhwcmVzc2lvbltdLCB0eXBlOiBUeXBlID0gbnVsbCk6IExpdGVyYWxBcnJheUV4cHIge1xuICByZXR1cm4gbmV3IExpdGVyYWxBcnJheUV4cHIodmFsdWVzLCB0eXBlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpdGVyYWxNYXAodmFsdWVzOiBBcnJheTxBcnJheTxzdHJpbmcgfCBFeHByZXNzaW9uPj4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBNYXBUeXBlID0gbnVsbCk6IExpdGVyYWxNYXBFeHByIHtcbiAgcmV0dXJuIG5ldyBMaXRlcmFsTWFwRXhwcih2YWx1ZXMsIHR5cGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm90KGV4cHI6IEV4cHJlc3Npb24pOiBOb3RFeHByIHtcbiAgcmV0dXJuIG5ldyBOb3RFeHByKGV4cHIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm4ocGFyYW1zOiBGblBhcmFtW10sIGJvZHk6IFN0YXRlbWVudFtdLCB0eXBlOiBUeXBlID0gbnVsbCk6IEZ1bmN0aW9uRXhwciB7XG4gIHJldHVybiBuZXcgRnVuY3Rpb25FeHByKHBhcmFtcywgYm9keSwgdHlwZSk7XG59XG4iXX0=