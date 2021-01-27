// Compiler
//
// This module exports a single function
//
//   compile(sourceCodeString, outputType)
//
// The second argument tells the compiler what to return. It must be one of:
//
//   ast        the abstract syntax tree
//   analyzed   the semantically analyzed representation
//   optimized  the optimized semantically analyzed representation
//   js         the translation to JavaScript
//   c          the translation to C
//   llvm       the translation to LLVM

import parse from "./parser.js"

export default function compile(source, outputType) {
  outputType = outputType.toLowerCase()
  if (outputType == "check") {
    return parse(source)
  }
}
