#! /usr/bin/env node

import fs from "fs/promises"
import process from "process"
import compile from "./compiler.js"

const help = `bJin compiler

Now it only supports a syntax check.

Syntax: src/bjin.js <filename> check
`

async function compileFromFile(filename, outputType) {
  try {
    const buffer = await fs.readFile(filename)
    if (compile(buffer.toString(), outputType))
    {
      console.log("Syntax has no problem.")
    }
  } catch (e) {
    console.error(`${e}`)
    process.exitCode = 1
  }
}

if (process.argv.length !== 4) {
  console.log(help)
} else {
  compileFromFile(process.argv[2], process.argv[3])
}
