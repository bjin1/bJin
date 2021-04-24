import ohm from "ohm-js"

const grammars = {
  canadianPostalCode: `
      canadianPostalCode {
      canadianPostalCode = prefix d suffix " " d suffix d
      prefix = "A".."C"|"E"|"G".."H"|"J".."N"|"P"|"R".."T"|"V"|"X"|"Y"
      suffix = "A".."C"|"E"|"G".."H"|"J".."N"|"P"|"R".."T"|"V".."Z"
      d = digit
    }`,
  visa: `isVisa {
    isVisa = "4" d d d d d d d d d d d d (d d d)?
    d = digit
  }`,
  masterCard: `masterCard {
    masterCard = "5" "1".."5" d d d d d d d d d d d d d d  		        --five      
                 | "2" "2".."7" d d d d d d d d d d d d d d     		  --two
    d = digit
  }`,
  adaFloat: `adaFloat {
    adaFloat = basedLit | decimalLit
    basedLit = d ("_"? d)* "#" hexDigit ("_"? hexDigit)* ("." hexDigit ("_"? hexDigit)*)? "#" (("E"|"e")("+"|"-")? d ("_"? d)*)?
    decimalLit = d ("_"? d)* ("." d ("_"? d)*)? (("E"|"e")("+"|"-")? d ("_"? d)*)?
    d = digit
  }`,
  notThreeEndingInOO: `notThreeEndingInOO {
    notThreeEndingInOO =  ~(letter ("oo"|"oO"|"Oo"|"OO") end) letter*
  }`,
  divisibleBy64: `divisibleBy64 {
    divisibleBy64 = ("0")+                                      --zero
                    | (~("000000" end) "0".."1")* "000000"        --notzero  
  }`,
  eightThroughTwentyNine: `eightThroughTwentyNine {
    eightThroughTwentyNine = ("8"|"9")                          --eightNine
                             |(("1"|"2") digit)                 --oneTwo
  }`,
  mLComment: `mLComment {
    mLComment = "(*"(~"*)"any)*"*)" 
  }`,
  notDogDoorDenNoLookAround: `notDogDoorDenNoLookAround {
    notDogDoorDenNoLookAround = keyword letter+    	 								--keywords
    							| "doo" ~("r") letter* 						                --nor
                  | "do" ~("o" | "g") letter*   		                --noog
                  | "de" ~("n") letter*   		   				            --non
                  | "d" ~("e" | "o") letter* 				                --noeo
                  | ~("d") letter*				                          --nod
                  | ""                                   
    keyword = "dog" | "door" | "den"
  }`,
  notDogDoorDenWithLookAround: `notDogDoorDenWithLookAround {
    notDogDoorDenWithLookAround = ~(keyword end) ("A".."Z" | "a".."z")* end
    keyword = "dog" | "door" | "den"
  }`,
}

export function matches(name, string) {
  return ohm.grammar(grammars[name]).match(string).succeeded()
}
