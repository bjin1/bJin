const grammars = {
  canadianPostalCode: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
  visa: /^(?:4[0-9]{12}(?:[0-9]{3})?)$/,
  masterCard: /^(?:5[1-5]\d{2}|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)\d{12}$/,
  adaFloat: /^\d(_?\d)*(((\.\d(_?\d)*)?)|(#[\dA-Za-z](_?[\dA-Za-z])*((\.[\dA-Za-z](_?[\dA-Za-z])*)?#)))([Ee](-|\+)?\d(_?\d)*)?$/,
  notThreeEndingInOO: /^(?![A-Za-z]oo\b)[A-Za-z]*$/i,
  divisibleBy64: /^(0+|(0|1)*000000)*$/,
  eightThroughTwentyNine: /^([8-9]|[1-2]\d)$/,
  mLComment: /^\(\*((?!\*\)).)*\*\)$/,
  notDogDoorDenNoLookAround: /^(([a-ce-zA-Z][A-Za-z]*)|(d([oe]\b|[oe][^ngo]|[^eo]|\b|(og|oor|en)[A-Za-z]+|oo[^r]|oo\b)|[^d])*)\b$|^$/,
  notDogDoorDenWithLookAround: /^(?!dog\b|den\b|door\b)[A-Za-z]*$/,
}

export function matches(name, string) {
  return grammars[name].test(string)
}
