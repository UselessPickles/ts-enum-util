import { EnumWrapper } from "ts-enum-util";

declare let mixedValues: EnumWrapper.OfType<number | string>;
declare let mixedValuesAndDefinedKeys: EnumWrapper<Record<
    "A" | "B" | "C",
    number | string
>>;
declare let numberValues: EnumWrapper.OfType<number>;
declare let stringValues: EnumWrapper.OfType<string>;
declare let numberLiteralValues: EnumWrapper.OfType<1 | 2 | 3>;
declare let stringLiteralValues: EnumWrapper.OfType<"a" | "b" | "c">;
declare let numberLiteralValuesAndDefinedKeys: EnumWrapper<Record<
    "A" | "B" | "C",
    1 | 2 | 3
>>;
declare let stringLiteralValuesAndDefinedKeys: EnumWrapper<Record<
    "A" | "B" | "C",
    "a" | "b" | "c"
>>;

mixedValues = mixedValuesAndDefinedKeys;
mixedValues = numberValues;
mixedValues = stringValues;
mixedValues = numberLiteralValues;
mixedValues = stringLiteralValues;
mixedValues = numberLiteralValuesAndDefinedKeys;
mixedValues = stringLiteralValuesAndDefinedKeys;

numberValues = numberLiteralValues;
numberValues = numberLiteralValuesAndDefinedKeys;
// $ExpectError
numberValues = stringValues;

numberLiteralValues = numberLiteralValuesAndDefinedKeys;
// $ExpectError
numberLiteralValues = numberValues;

stringValues = stringLiteralValues;
stringValues = stringLiteralValuesAndDefinedKeys;
// $ExpectError
stringValues = numberValues;

stringLiteralValues = stringLiteralValuesAndDefinedKeys;
// $ExpectError
stringLiteralValues = stringValues;
