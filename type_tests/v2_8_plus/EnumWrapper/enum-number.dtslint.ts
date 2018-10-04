import { $enum } from "../../../dist/types";

// Enum with number values
enum TestEnum {
    A,
    B,
    C
}

declare const str: string;
declare const strOrNull: string | null;
declare const strOrUndefined: string | undefined;

declare const num: number;
declare const numOrNull: number | null;
declare const numOrUndefined: number | undefined;

declare const key: keyof typeof TestEnum;
declare const keyOrNull: keyof typeof TestEnum | null;
declare const keyOrUndefined: keyof typeof TestEnum | undefined;

declare const value: TestEnum;
declare const valueOrNull: TestEnum | null;
declare const valueOrUndefined: TestEnum | undefined;

const enumWrapper = $enum(TestEnum);

// $ExpectType EnumWrapper<number, typeof TestEnum>
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
    // $ExpectType EnumWrapper<number, typeof TestEnum>
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
    // $ExpectType EnumWrapper<number, typeof TestEnum>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType ("A" | "B" | "C")[]
enumWrapper.getKeys();

// $ExpectType TestEnum[]
enumWrapper.getValues();

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the entry tuple because of
// this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntries: Readonly<
    ["A" | "B" | "C", TestEnum]
>[] = enumWrapper.getEntries();

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
// $ExpectType string
enumWrapper.asKeyOrDefault(str, str);
// $ExpectType string | undefined
enumWrapper.asKeyOrDefault(str, strOrUndefined);

// $ExpectType boolean
enumWrapper.isValue(num);
// $ExpectType boolean
enumWrapper.isValue(numOrNull);
// $ExpectType boolean
enumWrapper.isValue(numOrUndefined);
// $ExpectError
enumWrapper.isValue(str);

if (enumWrapper.isValue(num)) {
    // $ExpectType TestEnum
    num;
}

if (enumWrapper.isValue(numOrNull)) {
    // $ExpectType TestEnum
    numOrNull;
}

if (enumWrapper.isValue(numOrUndefined)) {
    // $ExpectType TestEnum
    numOrUndefined;
}

// $ExpectType TestEnum
enumWrapper.asValueOrThrow(num);
// $ExpectType TestEnum
enumWrapper.asValueOrThrow(numOrNull);
// $ExpectType TestEnum
enumWrapper.asValueOrThrow(numOrUndefined);
// $ExpectError
enumWrapper.asValueOrThrow(str);

// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(num);
// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(numOrNull);
// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(numOrUndefined);
// $ExpectError
enumWrapper.asValueOrDefault(str);

// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(num, undefined);
// $ExpectType TestEnum
enumWrapper.asValueOrDefault(num, value);
// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(num, valueOrUndefined);
// $ExpectType number
enumWrapper.asValueOrDefault(num, num);
// $ExpectType number | undefined
enumWrapper.asValueOrDefault(num, numOrUndefined);
// $ExpectError
enumWrapper.asValueOrDefault(num, str);

// $ExpectType "A" | "B" | "C"
enumWrapper.getKeyOrThrow(num);
// $ExpectType "A" | "B" | "C"
enumWrapper.getKeyOrThrow(numOrNull);
// $ExpectType "A" | "B" | "C"
enumWrapper.getKeyOrThrow(numOrUndefined);
// $ExpectError
enumWrapper.getKeyOrThrow(str);

// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKeyOrDefault(num);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKeyOrDefault(numOrNull);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKeyOrDefault(numOrUndefined);
// $ExpectError
enumWrapper.getKeyOrDefault(str);

// $ExpectType "A" | "B" | "C"
enumWrapper.getKeyOrDefault(num, key);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKeyOrDefault(num, keyOrUndefined);
// $ExpectType string
enumWrapper.getKeyOrDefault(num, str);
// $ExpectType string | undefined
enumWrapper.getKeyOrDefault(num, strOrUndefined);

// $ExpectType TestEnum
enumWrapper.getValueOrThrow(key);
// $ExpectType TestEnum
enumWrapper.getValueOrThrow(keyOrNull);
// $ExpectType TestEnum
enumWrapper.getValueOrThrow(keyOrUndefined);
// $ExpectType TestEnum
enumWrapper.getValueOrThrow(str);
// $ExpectType TestEnum
enumWrapper.getValueOrThrow(strOrNull);
// $ExpectType TestEnum
enumWrapper.getValueOrThrow(strOrUndefined);

// $ExpectType TestEnum | undefined
enumWrapper.getValueOrDefault(str);
// $ExpectType TestEnum | undefined
enumWrapper.getValueOrDefault(strOrNull);
// $ExpectType TestEnum | undefined
enumWrapper.getValueOrDefault(strOrUndefined);

// $ExpectType TestEnum | undefined
enumWrapper.getValueOrDefault(str, undefined);
// $ExpectType TestEnum
enumWrapper.getValueOrDefault(str, value);
// $ExpectType TestEnum | undefined
enumWrapper.getValueOrDefault(str, valueOrUndefined);
// $ExpectType number
enumWrapper.getValueOrDefault(str, num);
// $ExpectType number | undefined
enumWrapper.getValueOrDefault(str, numOrUndefined);
// $ExpectError
enumWrapper.getValueOrDefault(str, str);
