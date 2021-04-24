import assert from "assert"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import * as ast from "../src/ast.js"

// Programs that are semantically correct
const semanticChecks = [
  ["variable declarations", 'const x = 1; let y = "false";'],
  ["complex list types", "func f(x: [[[int]]]) {}"],
  ["increment and decrement", "let x = 10; x--; x++;"],
  ["initialize with empty list", "let a = [](of int);"],
  ["assign lists", "let a = [](of int);let b=[1];a=b;b=a;"],
  ["short return", "func f() { return; }"],
  ["long return", "func f(): bool { return true; }"],
  ["return in nested if", "func f() {if true {return;}}"],
  ["break in nested if", "while false {if true {break;}}"],
  ["long if", "if true {print(1);} else {print(3);}"],
  ["else if", "if true {print(1);} else if true {print(0);} else {print(3);}"],
  ["for over collection", "for i in [2,3,5] {print(1);}"],
  ["conditionals with ints", "print(true ? 8 : 5);"],
  ["conditionals with floats", "print(1<2 ? 8.0 : -5.22);"],
  ["conditionals with strings", 'print(1<2 ? "x" : "y");'],
  ["||", "print(true||1<2||false||!true);"],
  ["&&", "print(true&&1<2&&false&&!true);"],
  ["relations", 'print(1<=2 && "x">"y" && 3.5<1.2);'],
  ["ok to == lists", "print([1]==[5,8]);"],
  ["ok to != lists", "print([1]!=[5,8]);"],
  ["variables", "let x=[[[[1]]]]; print(x[0][0][0][0]+2);"],
  ["subscript exp", "let a=[1,2];print(a[0]);"],
  ["assigned functions", "func f() {}\nlet g = f;g = f;"],
  ["call of assigned functions", "func f(x: int) {}\nlet g=f;g(1);"],
  [
    "call of assigned function in expression",
    `func f(x: int, y: bool): int {}
    let g = f;
    print(g(1, true));
    f = g; // Type check here`,
  ],
  [
    "pass a function to a function",
    `func f(x: int, y: (bool)->void): int { return 1; }
     func g(z: bool) {}
     f(2, g);`,
  ],
  [
    "function return types",
    `func square(x: int): int { return x * x; }
     func compose(): (int)->int { return square; }`,
  ],
  ["list parameters", "func f(x: [int]) {}"],
  ["optional parameters", "func f(x: [int], y: str) {}"],
  ["built-in constants", "print(25.0 * π);"],
  ["built-in sin", "print(sin(π));"],
  ["built-in cos", "print(cos(93.999));"],
]

// Programs that are syntactically correct but have semantic errors
const semanticErrors = [
  ["non-int increment", "let x=false;x++;", /an integer, found bool/],
  ["non-int decrement", 'let x="";x++;', /an integer, found [string]?/],
  ["undeclared id", "print(x);", /Identifier x not declared/],
  ["redeclared id", "let x = 1;let x = 1;", /Identifier x already declared/],
  ["assign to const", "const x = 1;x = 2;", /Cannot assign to constant x/],
  ["assign bad type", "let x=1;x=true;", /Cannot assign a bool to a int/],
  ["assign bad list type", "let x=1;x=[true];", /Cannot assign a \[bool\] to a int/],
  ["break outside loop", "break;", /Break can only appear in a loop/],
  [
    "break inside function",
    "while true {func f() {break;}}",
    /Break can only appear in a loop/,
  ],
  ["return outside function", "return;", /Return can only appear in a function/],
  [
    "return value from void function",
    "func f() {return 1;}",
    /Cannot return a value here/,
  ],
  [
    "return nothing from non-void",
    "func f(): int {return;}",
    /should be returned here/,
  ],
  ["return type mismatch", "func f(): int {return false;}", /bool to a int/],
  ["non-bool short if test", "if 1 {}", /a bool, found int/],
  ["non-bool if test", "if 1 {} else {}", /a bool, found int/],
  ["non-list in for", "for i in 100 {}", /List expected/],
  ["non-bool conditional test", "print(1?2:3);", /a bool, found int/],
  ["diff types in conditional arms", "print(true?1:true);", /not have the same type/],
  ["bad types for ||", "print(false||1);", /a bool, found int/],
  ["bad types for &&", "print(false&&1);", /a bool, found int/],
  ["bad types for ==", "print(false==1);", /Operands do not have the same type/],
  ["bad types for !=", "print(false==1);", /Operands do not have the same type/],
  ["bad types for +", "print(false+1);", /number or string, found bool/],
  ["bad types for -", "print(false-1);", /a number, found bool/],
  ["bad types for *", "print(false*1);", /a number, found bool/],
  ["bad types for /", "print(false/1);", /a number, found bool/],
  ["bad types for <", "print(false<1);", /number or string, found bool/],
  ["bad types for <=", "print(false<=1);", /number or string, found bool/],
  ["bad types for >", "print(false>1);", /number or string, found bool/],
  ["bad types for >=", "print(false>=1);", /number or string, found bool/],
  ["bad types for ==", "print(2==2.0);", /not have the same type/],
  ["bad types for !=", "print(false!=1);", /not have the same type/],
  ["bad types for negation", "print(-true);", /a number, found bool/],
  ["bad types for not", 'print(!"hello");', /a bool, found str/],
  ["non-integer index", "let a=[1];print(a[false]);", /integer, found bool/],
  ["diff type list elements", "print([3,3.0]);", /Not all elements have the same type/],
  ["shadowing", "let x = 1;\nwhile true {let x = 1;}", /Identifier x already declared/],
  ["call of uncallable", "let x = 1;\nprint(x());", /Call of non-function/],
  [
    "Too many args",
    "func f(x: int) {}\nf(1,2);",
    /1 argument\(s\) required but 2 passed/,
  ],
  [
    "Too few args",
    "func f(x: int) {}\nf();",
    /1 argument\(s\) required but 0 passed/,
  ],
  [
    "Parameter type mismatch",
    "func f(x: int) {}\nf(false);",
    /Cannot assign a bool to a int/,
  ],
  [
    "function type mismatch",
    `func f(x: int, y: (bool)->void): int { return 1; }
     func g(z: bool): int { return 5; }
     f(2, g);`,
    /Cannot assign a \(bool\)->int to a \(bool\)->void/,
  ],
  ["bad call to stdlib sin()", "print(sin(true));", /Cannot assign a bool to a float/],
  ["Non-type in param", "let x=1;func f(y:x){}", /Type expected/],
  ["Non-type in return type", "let x=1;func f():x{return 1;}", /Type expected/],
]

// Test cases for expected semantic graphs after processing the AST. In general
// this suite of cases should have a test for each kind of node, including
// nodes that get rewritten as well as those that are just "passed through"
// by the analyzer. For now, we're just testing the various rewrites only.

const Int = ast.Type.INT
const Void = ast.Type.VOID
const intToVoidType = new ast.FunctionType([Int], Void)

const varX = Object.assign(new ast.Variable("x", false), { type: Int })

const letX1 = Object.assign(new ast.VariableDeclaration("x", false, 1n), {
  variable: varX,
})
const assignX2 = new ast.Assignment(varX, 2n)

const funDeclF = Object.assign(
  new ast.FunctionDeclaration("f", [new ast.Parameter("x", Int)], Void, []),
  {
    function: Object.assign(new ast.Function("f"), {
      type: intToVoidType,
    }),
  }
)


const graphChecks = [
  ["Variable created & resolved", "let x=1; x=2;", [letX1, assignX2]],
  ["functions created & resolved", "func f(x: int) {}", [funDeclF]],
]

describe("The analyzer", () => {
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(parse(source)))
    })
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(parse(source)), errorMessagePattern)
    })
  }
  for (const [scenario, source, graph] of graphChecks) {
    it(`properly rewrites the AST for ${scenario}`, () => {
      assert.deepStrictEqual(analyze(parse(source)), new ast.Program(graph))
    })
  }
})
