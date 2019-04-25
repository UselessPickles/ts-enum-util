import { $enum } from "ts-enum-util";

// Enum with mix of number and string values
enum TestEnum {
    A,
    B,
    C = "c"
}

declare const str: string;
declare const strOrNull: string | null;
declare const strOrUndefined: string | undefined;

declare const num: number;
declare const numOrNull: number | null;
declare const numOrUndefined: number | undefined;

declare const numstr: number | string;
declare const numstrOrNull: number | string | null;
declare const numstrOrUndefined: number | string | undefined;

declare const key: keyof typeof TestEnum;
declare const keyOrNull: keyof typeof TestEnum | null;
declare const keyOrUndefined: keyof typeof TestEnum | undefined;

declare const value: TestEnum;
declare const valueOrNull: TestEnum | null;
declare const valueOrUndefined: TestEnum | undefined;

const enumWrapper = $enum(TestEnum);

// $ExpectError
enumWrapper.indexOfValue(10);
// $ExpectError
enumWrapper.indexOfValue(num);

// $ExpectError
enumWrapper.asValueOrDefault(numstr, 10);
// $ExpectError
enumWrapper.asValueOrDefault(numstr, num);

// $ExpectError
enumWrapper.getKey(10);
// $ExpectError
enumWrapper.getKey(num);

// $ExpectError
enumWrapper.getValue(keyOrNull, 10);
// $ExpectError
enumWrapper.getValue(keyOrNull, num);
