import fs from "fs"
import ohm from "ohm-js"
import * as ast from "./ast.js"

const bJinGrammar = ohm.grammar(fs.readFileSync("src/bJin.ohm"))

const astBuilder = bJinGrammar.createSemantics().addOperation("ast", {
  Program(body) {
    return new ast.Program(body.ast())
  },
  Statement_vardecl(kind, id, _eq, initializer, _semi) {
    const [name, readOnly] = [id.sourceString, kind.sourceString == "const"]
    return new ast.VariableDeclaration(name, readOnly, initializer.ast())
  },
  FunDecl(_fun, id, parameters, _colons, returnType, body) {
    const returnTypeTree = returnType.ast()
    return new ast.FunctionDeclaration(
      id.sourceString,
      parameters.ast(),
      returnTypeTree.length === 0 ? null : returnTypeTree[0],
      body.ast()
    )
  },
  Params(_left, bindings, _right) {
    return bindings.asIteration().ast()
  },
  Param(id, _colon, type) {
    return new ast.Parameter(id.sourceString, type.ast())
  },
  TypeExp_list(_left, baseType, _right) {
    return new ast.ListType(baseType.ast())
  },
  TypeExp_func(_left, inTypes, _right, _arrow, outType) {
    return new ast.FunctionType(inTypes.asIteration().ast(), outType.ast())
  },
  TypeExp_id(id) {
    return new ast.TypeId(id.sourceString)
  },
  Statement_bump(variable, operator, _semi) {
    return operator.sourceString === "++"
      ? new ast.Increment(variable.ast())
      : new ast.Decrement(variable.ast())
  },
  Statement_assign(variable, _eq, expression, _semi) {
    return new ast.Assignment(variable.ast(), expression.ast())
  },
  Statement_call(call, _semi) {
    return call.ast()
  },
  Statement_break(_break, _semi) {
    return new ast.BreakStatement()
  },
  Statement_return(_return, expression, _semi) {
    const returnValueTree = expression.ast()
    if (returnValueTree.length === 0) {
      return new ast.ShortReturnStatement()
    }
    return new ast.ReturnStatement(returnValueTree[0])
  },
  IfStmt_long(_if, test, consequent, _else, alternate) {
    return new ast.IfStatement(test.ast(), consequent.ast(), alternate.ast())
  },
  IfStmt_short(_if, test, consequent) {
    return new ast.ShortIfStatement(test.ast(), consequent.ast())
  },
  LoopStmt_while(_while, test, body) {
    return new ast.WhileStatement(test.ast(), body.ast())
  },
  LoopStmt_collection(_for, id, _in, collection, body) {
    return new ast.ForStatement(id.sourceString, collection.ast(), body.ast())
  },
  Block(_open, body, _close) {
    // No need for a block node, just return the list of statements
    return body.ast()
  },
  Exp_conditional(test, _questionMark, consequent, _colon, alternate) {
    return new ast.Conditional(test.ast(), consequent.ast(), alternate.ast())
  },
  Exp1_or(first, _ors, rest) {
    return new ast.OrExpression([first.ast(), ...rest.ast()])
  },
  Exp1_and(first, _ors, rest) {
    return new ast.AndExpression([first.ast(), ...rest.ast()])
  },
  Exp2_compare(left, op, right) {
    return new ast.BinaryExpression(op.sourceString, left.ast(), right.ast())
  },
  Exp3_add(left, op, right) {
    return new ast.BinaryExpression(op.sourceString, left.ast(), right.ast())
  },
  Exp4_multiply(left, op, right) {
    return new ast.BinaryExpression(op.sourceString, left.ast(), right.ast())
  },
  Exp5_unary(op, operand) {
    return new ast.UnaryExpression(op.sourceString, operand.ast())
  },
  Exp6_emptylist(_keyword, _left, _of, type, _right) {
    return new ast.EmptyList(type.ast())
  },
  Exp6_listexp(_left, args, _right) {
    return new ast.ListExpression(args.asIteration().ast())
  },
  Exp6_parens(_open, expression, _close) {
    return expression.ast()
  },
  Var_subscript(list, _left, subscript, _right) {
    return new ast.SubscriptExpression(list.ast(), subscript.ast())
  },
  Var_member(object, _dot, field) {
    return new ast.MemberExpression(object.ast(), field.sourceString)
  },
  Var_id(id) {
    return new ast.IdentifierExpression(id.sourceString)
  },
  Var_call(callee, _left, args, _right) {
    return new ast.Call(callee.ast(), args.asIteration().ast())
  },
  true(_) {
    return true
  },
  false(_) {
    return false
  },
  intlit(_digits) {
    return BigInt(this.sourceString)
  },
  floatlit(_whole, _point, _fraction, _e, _sign, _exponent) {
    return Number(this.sourceString)
  },
  stringlit(_open, chars, _close) {
    return chars.sourceString
  },
})

export default function parse(sourceCode) {
  const match = bJinGrammar.match(sourceCode)
  if (!match.succeeded()) {
    throw new Error(match.message)
  }
  return astBuilder(match).ast()
}
