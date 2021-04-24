![Logo](https://raw.githubusercontent.com/bjin1/bJin/main/docs/bjin.png)

# bJin-lang
[`bJin`](https://bjin1.github.io/bJin/) is a fast, powerful, flexible and easy to use open source programming language based MIT LISCENCE


It has efficient high-level data structures and a simple but effective approach to function-oriented programming. bJin’s elegant syntax is interpreted nature, make it an ideal language for scripting and rapid application development in many areas on most platforms.

`bJin` is the name of the language, just for my ID in CS class

# Run

## Dependencies
* Node.js version > 13.2
* js-ohm == 15.4.1 

## Check syntax
```
npm run bjin examples/hello.bjin ast
```

## Check semantics
```
npm run bjin examples/hello.bjin analyzed
```

## unit test
```
npm run test
```

## Code lint
```
npm run lint
```

# Examples

# Hello World
```
print("Hello World!");
```

## Declerations
```
let
const
```

## Assignment and Comment
```
// ci can not assign again
const ci = "12"
let a = "1";
let b = 1;
let c = false;
let li = [1,2,3]
a = "2";
b = b + 1;
```

## List subscript
```
let li = [1,2,3]
print(li[0])
```

## If Statement
```
if a == true {
    print(true);
}
else {
    print(false);
}
```

## Loop Statement
### for
```
let a = [1,2,3,5];
for i in a {
    print(i);
}

for i in a {
    if i == 1 {
        print(i);
        break;
    }
    print(i);
}

```

### while
```
let a = true;
while a {
    print(a);
    a = false;
}
```

## Math
```
let a = sin(π);
print(a);

let b = 1;
let c = 2;
let d = -5
print(b+c);
print(b-c);
print(b*c);
print(c/b);
print(d);
```

## Function
```

let d = 5;

func sum(a: int, b:int): int {
    return a + b
}

func total() {
    let a = 1;
    let b = 2 + d;
    let c = sum(a,b);
}

func main() {
    print(total());
}

```

## Compare
```
let a = 1;
let b = "1";
let c = 2;
print(a==b);
print(a>=c);
print(a<=c);

```

## Logic Operator
```
let a = false;
let b = true;

if (a && b){
    print(true);
}

if (a || b){
    print(true);
}

if (!a){
    print(true);
}

```

### Type check and Type inference
```
// a is int
let a = 1;

// b is str
let b = "1";

// it will run type check and assigned fail
a=b;

```

# Syntax

## Type
`bJin` support full primitive types listed below: 
1. int
```
let i = 1;
```
2. float
```
let f = 3.01;
```
3. string, use `""` as the start and end flag.
```
let a = "";
```
4. boolean, user `true` and `false`
```
let t = true;
let f = false;
```
## Data Struct
1. list, use `[]`
```
let liInt = [](of int);
let li_i = [1,2];
let li_str = ["state","city","town"];
```

## Keywords
`bJin`'s keywords is `let | const | func | if | else | while | for | in | of | break | return | true | false`

## Statment
Every statement must end with `;`

## Identifier
As a identifier, it must start with alpha and only form by Alphas(a-zA-Z), Digit(0-9),Underline(_), also not use `bJin`'s keywords and case sensitive

### Valid identifier
```
let a = "1";
let a_b = 2;
let c1 = false;
```

### Invalid identifier
```
let 1a = 11
let str = "1231";

```

# Semantics

## Rules
There are the rule of `bJin`: 

* `bJin` is `free-format` languages, use the block structure derived from ALGOL, blocks of code are set off with braces { } or keywords.

* Identifiers must be declare in the scope before they are used(except for build-in such as π).

* Identifiers must not be declared more than once in the scope.

* In an assignment, the type of source muse be compatible with the type of the target.

* Read-only variable must be not assigned to again.

* In a call or operator, the number and type of aguments must match the parameters in the callee.

* The type of element in a list must be same.

* In a list expression li[i], `li` must have an list type and `i` must have interger type.

* Break statements can only appear in the loops.

* Return statements can only appear in the functions.

* The type of a return expression must match the return type of the function.

* A `break` expression may only appear within `for` or `while` expression.

## Rule Error List

* Expected a number, found ${type.name}

* Expected a number or string, found ${type.name}

* Expected a bool, found ${type.name}

* List expected

* Type expected

* Not all elements have the same type

* Cannot assign a ${a.type.name} to a ${b.type.name}

* Cannot assign to constant

* Break can only appear in a loop

* Return can only appear in a function

* Call of non-function or non-constructor

* Something should be returned here

* Cannot return a value here

* ${targetTypes.length} argument(s) required but ${actual.length} passed

* Identifier ${name} already declared

* Identifier ${name} not declared