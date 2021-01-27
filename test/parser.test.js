import assert from "assert"
import util from "util"
import parse from "../src/parser.js"

const source = `def a(a,y,x) 
give a 1;
  if a : 
  give b 12;
  ei a + b:
    get(b);
  ie
  el
      write(123);
  le
  fi
fed
write("hello")`

const expectedAst = `true`

const errorFixture = [
  ["a non-operator", "print 7 * ((2 _ 3)", /Line 1, col 15:/],
  ["an expression starting with a )", "print )", /Line 1, col 7:/],
  ["a statement starting with a )", "print 5\n) * 5", /Line 2, col 1:/],
]

describe("The parser", () => {
  it("can parse all the nodes", done => {
    assert.deepStrictEqual(util.format(parse(source)), expectedAst)
    done()
  })
  for (const [scenario, source, errorMessagePattern] of errorFixture) {
    it(`throws on ${scenario}`, done => {
      assert.throws(() => parse(source), errorMessagePattern)
      done()
    })
  }
})
