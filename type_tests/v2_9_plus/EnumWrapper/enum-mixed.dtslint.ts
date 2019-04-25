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

// $ExpectType EnumWrapper<string | number, typeof TestEnum>
enumWrapper;

// $ExpectType number
enumWrapper.length;
// $ExpectError
enumWrapper.length = 0; // immutable

// $ExpectType number
enumWrapper.size;
// $ExpectError
enumWrapper.size = 0; // immutable

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the entry tuple because of
// this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntry: Readonly<["A" | "B" | "C", TestEnum]> = enumWrapper[0];
// $ExpectError
enumWrapper[0] = ["A", TestEnum.A]; // immutable

// $ExpectType IterableIterator<"A" | "B" | "C">
enumWrapper.keys();

// $ExpectType IterableIterator<TestEnum>
enumWrapper.values();

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the iterated entry tuples
// because of this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntryIterator: IterableIterator<
    Readonly<["A" | "B" | "C", TestEnum]>
> = enumWrapper.entries();
for (const entry of enumWrapper.entries()) {
    const testIteratedEntry: Readonly<["A" | "B" | "C", TestEnum]> = entry;
}

// $ExpectType void
enumWrapper.forEach((value, key, collection, index) => {
    // $ExpectType TestEnum
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<string | number, typeof TestEnum>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType number[]
enumWrapper.map((value, key, collection, index) => {
    // $ExpectType TestEnum
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<string | number, typeof TestEnum>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType ("A" | "B" | "C")[]
enumWrapper.getKeys();

// TODO: Regardless of whether I expect TestEnum[] or (TestEnum)[], this
//       always fails saying that it got the other.
// ExpectType TestEnum[]
enumWrapper.getValues();

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the entry tuple because of
// this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntries: Readonly<
    ["A" | "B" | "C", TestEnum]
>[] = enumWrapper.getEntries();

// $ExpectType number
enumWrapper.indexOfKey("A");
// $ExpectError
enumWrapper.indexOfKey("foo!");
// $ExpectError
enumWrapper.indexOfKey(str);

// $ExpectType number
enumWrapper.indexOfValue(TestEnum.A);
// $ExpectType number
enumWrapper.indexOfValue(TestEnum.C);
// $ExpectType number
enumWrapper.indexOfValue(value);
// $ExpectError
enumWrapper.indexOfValue("c");
// $ExpectError
enumWrapper.indexOfValue(str);

// $ExpectType boolean
enumWrapper.isKey(str);
// $ExpectType boolean
enumWrapper.isKey(strOrNull);
// $ExpectType boolean
enumWrapper.isKey(strOrUndefined);

if (enumWrapper.isKey(str)) {
    // $ExpectType "A" | "B" | "C"
    str;
}

if (enumWrapper.isKey(strOrNull)) {
    // $ExpectType "A" | "B" | "C"
    strOrNull;
}

if (enumWrapper.isKey(strOrUndefined)) {
    // $ExpectType "A" | "B" | "C"
    strOrUndefined;
}

// $ExpectType "A" | "B" | "C"
enumWrapper.asKeyOrThrow(str);
// $ExpectType "A" | "B" | "C"
enumWrapper.asKeyOrThrow(strOrNull);
// $ExpectType "A" | "B" | "C"
enumWrapper.asKeyOrThrow(strOrUndefined);

// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(str);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(strOrNull);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(strOrUndefined);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(str, undefined);
// $ExpectType "A" | "B" | "C"
enumWrapper.asKeyOrDefault(str, key);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(str, keyOrUndefined);
// $ExpectError
enumWrapper.asKeyOrDefault(str, str);
// $ExpectError
enumWrapper.asKeyOrDefault(str, strOrUndefined);

// $ExpectType boolean
enumWrapper.isValue(numstr);
// $ExpectType boolean
enumWrapper.isValue(numstrOrNull);
// $ExpectType boolean
enumWrapper.isValue(numstrOrUndefined);

if (enumWrapper.isValue(numstr)) {
    // $ExpectType TestEnum
    numstr;
}

if (enumWrapper.isValue(numstrOrNull)) {
    // $ExpectType TestEnum
    numstrOrNull;
}

if (enumWrapper.isValue(numstrOrUndefined)) {
    // $ExpectType TestEnum
    numstrOrUndefined;
}

// $ExpectType TestEnum
enumWrapper.asValueOrThrow(numstr);
// $ExpectType TestEnum
enumWrapper.asValueOrThrow(numstrOrNull);
// $ExpectType TestEnum
enumWrapper.asValueOrThrow(numstrOrUndefined);

// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(numstr);
// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(numstrOrNull);
// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(numstrOrUndefined);

// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(numstr, undefined);
// $ExpectType TestEnum
enumWrapper.asValueOrDefault(numstr, TestEnum.A);
// $ExpectType TestEnum
enumWrapper.asValueOrDefault(numstr, TestEnum.C);
// $ExpectType TestEnum
enumWrapper.asValueOrDefault(numstr, value);
// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(numstr, valueOrUndefined);
// $ExpectError
enumWrapper.asValueOrDefault(numstr, str);
// $ExpectError
enumWrapper.asValueOrDefault(numstr, numstr);
// $ExpectError
enumWrapper.asValueOrDefault(num, numstrOrUndefined);

// $ExpectType "A" | "B" | "C"
enumWrapper.getKey(value);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKey(valueOrNull);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKey(valueOrUndefined);
// $ExpectError
enumWrapper.getKey(str);
// $ExpectError
enumWrapper.getKey(numstr);

// $ExpectType "A" | "B" | "C"
enumWrapper.getKey(valueOrNull, key);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKey(valueOrNull, keyOrUndefined);
// $ExpectError
enumWrapper.getKey(valueOrNull, str);
// $ExpectError
enumWrapper.getKey(valueOrNull, strOrUndefined);

// $ExpectType TestEnum
enumWrapper.getValue(key);
// $ExpectType TestEnum | undefined
enumWrapper.getValue(keyOrNull);
// $ExpectType TestEnum | undefined
enumWrapper.getValue(keyOrUndefined);
// $ExpectError
enumWrapper.getValue(str);

// $ExpectType TestEnum | undefined
enumWrapper.getValue(keyOrNull, undefined);
// $ExpectType TestEnum
enumWrapper.getValue(keyOrNull, TestEnum.A);
// $ExpectType TestEnum
enumWrapper.getValue(keyOrNull, TestEnum.C);
// $ExpectType TestEnum
enumWrapper.getValue(keyOrNull, value);
// $ExpectType TestEnum | undefined
enumWrapper.getValue(keyOrNull, valueOrUndefined);
// $ExpectError
enumWrapper.getValue(keyOrNull, str);
// $ExpectError
enumWrapper.getValue(keyOrNull, numstr);
// $ExpectError
enumWrapper.getValue(keyOrNull, numstrOrUndefined);
