// Parser
//
// Exports a single function called parse which accepts the source code
// as a string and returns the AST.

import ohm from "ohm-js"

const aelGrammar = ohm.grammar(String.raw`Ael {
  Program   = FuncDec+ Expression ";"?
 	
  FuncDec   = def id "(" (id ("," id)*)? ")" (Expression (";" Expression)* ";"?)? fed
  
  Expression = FuncCall
             | IfStatement
             | Expression
             | SupSupExp
             | Give
             
  Give		= give id SupSupExp
  
  IfStatement = if Expression ":" (Expression (";" Expression)* ";"?)? (ei Expression ":"  (Expression (";" Expression)* ";"?)? ie)* (el (Expression (";" Expression )* ";"? )?  le)? fi
  
  FuncCall	= id "(" (SupSupExp ("," SupSupExp)*)?  ")"
  
	
  SupSupExp	= SupExp "!"?
  
 
  
  SupExp 	= "^"? Exp							--unary
  
  Exp       = Exp ("+" | "-") Term            --binary
            | Term
  Term      = Term ("*"| "/") Factor          --binary
            | Factor
  Factor    = id
            | num
            | string
            | FuncCall
            | "(" SupSupExp ")"                     --parens
            
  num       = digit+ ("." digit+)? (("e" | "E") digit+)?
  
  hexdigit  = digit | "a" .. "f" | "A" .. "F"
  hexstring = "\\u{" hexdigit hexdigit? hexdigit? hexdigit? hexdigit? hexdigit?  "}"
  string    = "\"" (alnum | "\\'" | "\\\"" | "\\\\" | hexstring)+ "\""
  
  if = "if" ~alnum
  fi = "fi" ~alnum
  el = "el" ~alnum
  le = "le" ~alnum
  ei = "ei" ~alnum
  ie = "ie" ~alnum
  
  def		= "def" ~alnum
  fed		= "fed" ~alnum
  
  give		= "give" ~alnum
  
  keyword   = if | fi | el | le | ei | ie | fed | def | give

  id        = ~keyword (letter|"@") (alnum|"_"|"@"|"$")*
  space    += "--" (~"\n" any)* ("\n" | end)  --comment
}`)

export default function parse(sourceCode) {
  const match = aelGrammar.match(sourceCode)
  if (!match.succeeded()) {
    throw new Error(match.message)
  }
  return true 
}
