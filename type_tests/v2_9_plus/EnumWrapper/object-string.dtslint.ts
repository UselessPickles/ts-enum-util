import { $enum } from "ts-enum-util";

// Enum-like object with string values
const TestEnum = {
    A: "a",
    B: "b",
    C: "c"
};

declare const str: string;
declare const strOrNull: string | null;
declare const strOrUndefined: string | undefined;

declare const num: number;

declare const key: keyof typeof TestEnum;
declare const keyOrNull: keyof typeof TestEnum | null;
declare const keyOrUndefined: keyof typeof TestEnum | undefined;

const enumWrapper = $enum(TestEnum);

// $ExpectType EnumWrapper<{ A: string; B: string; C: string; }, string>
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
const testEntry: Readonly<["A" | "B" | "C", string]> = enumWrapper[0];
// $ExpectError
enumWrapper[0] = ["A", TestEnum.A]; // immutable

// $ExpectType IterableIterator<"A" | "B" | "C">
enumWrapper.keys();

// $ExpectType IterableIterator<string>
enumWrapper.values();

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the iterated entry tuples
// because of this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntryIterator: IterableIterator<Readonly<
    ["A" | "B" | "C", string]
>> = enumWrapper.entries();
for (const entry of enumWrapper.entries()) {
    const testIteratedEntry: Readonly<["A" | "B" | "C", string]> = entry;
}

// $ExpectType void
enumWrapper.forEach((value, key, wrapper, index) => {
    // $ExpectType string
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<{ A: string; B: string; C: string; }, string>
    wrapper;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType number[]
enumWrapper.map((value, key, wrapper, index) => {
    // $ExpectType string
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<{ A: string; B: string; C: string; }, string>
    wrapper;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType ("A" | "B" | "C")[]
enumWrapper.getKeys();

// $ExpectType string[]
enumWrapper.getValues();

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the entry tuple because of
// this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntries: Readonly<
    ["A" | "B" | "C", string]
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
enumWrapper.indexOfValue("c");
// $ExpectType number
enumWrapper.indexOfValue(str);
// $ExpectError
enumWrapper.indexOfValue(10);
// $ExpectError
enumWrapper.indexOfValue(num);

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
enumWrapper.isValue(str);
// $ExpectType boolean
enumWrapper.isValue(strOrNull);
// $ExpectType boolean
enumWrapper.isValue(strOrUndefined);
// $ExpectError
enumWrapper.isValue(num);

if (enumWrapper.isValue(str)) {
    // $ExpectType string
    str;
}

if (enumWrapper.isValue(strOrNull)) {
    // $ExpectType string
    strOrNull;
}

if (enumWrapper.isValue(strOrUndefined)) {
    // $ExpectType string
    strOrUndefined;
}

// $ExpectType string
enumWrapper.asValueOrThrow(str);
// $ExpectType string
enumWrapper.asValueOrThrow(strOrNull);
// $ExpectType string
enumWrapper.asValueOrThrow(strOrUndefined);
// $ExpectError
enumWrapper.asValueOrThrow(num);

// $ExpectType string | undefined
enumWrapper.asValueOrDefault(str);
// $ExpectType string | undefined
enumWrapper.asValueOrDefault(strOrNull);
// $ExpectType string | undefined
enumWrapper.asValueOrDefault(strOrUndefined);
// $ExpectError
enumWrapper.asValueOrDefault(num);

// $ExpectType string | undefined
enumWrapper.asValueOrDefault(str, undefined);
// $ExpectType string
enumWrapper.asValueOrDefault(str, str);
// $ExpectType string | undefined
enumWrapper.asValueOrDefault(str, strOrUndefined);
// $ExpectError
enumWrapper.asValueOrDefault(str, num);

// $ExpectType "A" | "B" | "C"
enumWrapper.getKey(str);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKey(strOrNull);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKey(strOrUndefined);
// $ExpectError
enumWrapper.getKey(num);

// $ExpectType "A" | "B" | "C"
enumWrapper.getKey(str, key);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKey(str, keyOrUndefined);
// $ExpectError
enumWrapper.getKey(str, str);
// $ExpectError
enumWrapper.getKey(str, strOrUndefined);

// $ExpectType string
enumWrapper.getValue(key);
// $ExpectType string | undefined
enumWrapper.getValue(keyOrNull);
// $ExpectType string | undefined
enumWrapper.getValue(keyOrUndefined);
// $ExpectError
enumWrapper.getValue(str);

// $ExpectType string | undefined
enumWrapper.getValue(keyOrNull, undefined);
// $ExpectType string
enumWrapper.getValue(keyOrNull, str);
// $ExpectType string | undefined
enumWrapper.getValue(keyOrNull, strOrUndefined);
// $ExpectError
enumWrapper.getValue(keyOrNull, num);
