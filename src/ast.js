export class Program {
  // Eg: let x = 2; print(x * 2); x = x + 1;
  constructor(statements) {
    this.statements = statements
  }
}

export class Type {
  constructor(name) {
    this.name = name
  }

  static BOOLEAN = new Type("bool")
  static INT = new Type("int")
  static FLOAT = new Type("float")
  static STRING = new Type("str")
  static VOID = new Type("void")
  static TYPE = new Type("type")
  static ANY = new Type("any")

  // Equivalence: when are two types the same
  isSameType(target) {
    return this == target
  }

  // T1 assignable to T2 is when x:T1 can be assigned to y:T2. By default
  // this is only when two types are equivalent; however, for other kinds
  // of types there may be special rules.
  canAssignableTo(target) {
    return this.isSameType(target)
  }
}

export class ListType extends Type {
  // Example: [int],[str]
  constructor(baseType) {
    super(`[${baseType.name}]`)
    this.baseType = baseType
  }

  isSameType(target) {
    return target.constructor === ListType && this.baseType === target.baseType
  }
}

export class FunctionType extends Type {
  // Example: (bool,[string]?)->float
  constructor(parameterTypes, returnType) {
    super(`(${parameterTypes.map(t => t.name).join(",")})->${returnType.name}`)
    Object.assign(this, { parameterTypes, returnType })
  }

  canAssignableTo(target) {
    return (
      target.constructor === FunctionType &&
      this.returnType.canAssignableTo(target.returnType) &&
      this.parameterTypes.length === target.parameterTypes.length &&
      this.parameterTypes.every((t, i) => target.parameterTypes[i].canAssignableTo(t))
    )
  }
}

export class VariableDeclaration {
  // Example: const dozen = 12
  constructor(name, readOnly, initializer) {
    Object.assign(this, { name, readOnly, initializer })
  }
}

// Created during semantic analysis only!
export class Variable {
  constructor(name, readOnly) {
    Object.assign(this, { name, readOnly })
  }
}

export class FunctionDeclaration {
  // Example: func f(x: [int?], y: string): Vector {}
  constructor(name, parameters, returnType, body) {
    Object.assign(this, { name, parameters, returnType, body })
  }
}

// Created during semantic analysis only!
export class Function {
  constructor(name) {
    this.name = name
    // Other properties set after construction
  }
}

export class Parameter {
  // Example: x: bool
  constructor(name, type) {
    Object.assign(this, { name, type })
  }
}

export class Increment {
  // Example: count++
  constructor(variable) {
    this.variable = variable
  }
}

export class Decrement {
  // Example: count--
  constructor(variable) {
    this.variable = variable
  }
}

export class Assignment {
  // Example: a[z].p = 50 * 22 ** 3 - x
  constructor(target, source) {
    Object.assign(this, { target, source })
  }
}

export class BreakStatement {
  // Intentionally empty
}

export class ReturnStatement {
  // Example: return c[5]
  constructor(expression) {
    this.expression = expression
  }
}

export class ShortReturnStatement {
  // Intentionally empty
}

export class IfStatement {
  // Example: if x < 3 { print(100); } else { break; }
  constructor(test, consequent, alternate) {
    Object.assign(this, { test, consequent, alternate })
  }
}

export class ShortIfStatement {
  // Example: if x < 3 { print(100); }
  constructor(test, consequent) {
    Object.assign(this, { test, consequent })
  }
}

export class WhileStatement {
  // Example: while level != 90 { level += random(-3, 8); }
  constructor(test, body) {
    Object.assign(this, { test, body })
  }
}

export class ForStatement {
  // Example: for ball in balls { ball.bounce();  }
  constructor(iterator, collection, body) {
    Object.assign(this, { iterator, collection, body })
  }
}

export class Conditional {
  // Example: latitude >= 0 ? "North" : "South"
  constructor(test, consequent, alternate) {
    Object.assign(this, { test, consequent, alternate })
  }
}

export class OrExpression {
  // Example: openDoor() || tryTheWindow() || breakTheDoorDown()
  constructor(disjuncts) {
    this.disjuncts = disjuncts
  }
}

export class AndExpression {
  // Example: swim && bike && run
  constructor(conjuncts) {
    this.conjuncts = conjuncts
  }
}

export class BinaryExpression {
  // Example: 3 & 22
  constructor(op, left, right) {
    Object.assign(this, { op, left, right })
  }
}

export class UnaryExpression {
  // Example: -55
  constructor(op, operand) {
    Object.assign(this, { op, operand })
  }
}

export class SubscriptExpression {
  // Example: a[20]
  constructor(list, index) {
    Object.assign(this, { list, index })
  }
}

export class ListExpression {
  // Example: ["Emma", "Norman", "Ray"]
  constructor(elements) {
    this.elements = elements
  }
}

export class EmptyList {
  // Example: [](of float)
  constructor(baseType) {
    this.baseType = baseType
  }
}

export class MemberExpression {
  // Example: state.population
  constructor(object, field) {
    Object.assign(this, { object, field })
  }
}

export class Call {
  // Example: move(player, 90, "west")
  constructor(callee, args) {
    Object.assign(this, { callee, args })
  }
}

// Appears in the syntax tree only and disappears after semantic analysis
// since references to the Id node will be replaced with references to the
// actual variable or function node the the id refers to.
export class IdentifierExpression {
  constructor(name) {
    this.name = name
  }
}

// Appears in the syntax tree only and disappears after semantic analysis
// since references to the Id node will be replaced with references to the
// actual type node the the id refers to.
export class TypeId {
  constructor(name) {
    this.name = name
  }
}
