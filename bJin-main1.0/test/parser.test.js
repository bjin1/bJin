import assert from "assert"
import parse from "../src/parser.js"
import * as ast from "../src/ast.js"

// TODO: This test case needs a lot more work
const source = `
  let x = 1;
  const y = "hello";
  return [1.0, 2.0];
  return x.y;
  func f(x: int): [bool] {
    if (false) {break;}
  }
`

const expectedAST = new ast.Program([
  new ast.VariableDeclaration("x", false, 1n),
  new ast.VariableDeclaration("y", true, "hello"),
  new ast.ReturnStatement(new ast.ListExpression([1, 2])),
  new ast.ReturnStatement(
    new ast.MemberExpression(new ast.IdentifierExpression("x"), "y")
  ),
  new ast.FunctionDeclaration(
    "f",
    [new ast.Parameter("x", new ast.TypeId("int"))],
    new ast.ListType(new ast.TypeId("bool")),
    [new ast.ShortIfStatement(false, [new ast.BreakStatement()])]
  ),
])

describe("The parser", () => {
  it("produces a correct AST", () => {
    assert.deepStrictEqual(parse(source), expectedAST)
  })
})
