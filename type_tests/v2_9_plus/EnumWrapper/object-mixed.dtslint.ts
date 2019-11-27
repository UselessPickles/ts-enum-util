import { $enum } from "ts-enum-util";

// Enum-like object with mix of number and string values
const TestEnum = {
    A: 1,
    B: 2,
    C: "c"
};

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

const enumWrapper = $enum(TestEnum);

// $ExpectType EnumWrapper<{ A: number; B: number; C: string; }, string | number>
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
const testEntry: Readonly<["A" | "B" | "C", string | number]> = enumWrapper[0];
// $ExpectError
enumWrapper[0] = ["A", TestEnum.A]; // immutable

// $ExpectType IterableIterator<"A" | "B" | "C">
enumWrapper.keys();

// $ExpectType IterableIterator<string | number>
enumWrapper.values();

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the iterated entry tuples
// because of this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntryIterator: IterableIterator<Readonly<
    ["A" | "B" | "C", string | number]
>> = enumWrapper.entries();
for (const entry of enumWrapper.entries()) {
    const testIteratedEntry: Readonly<[
        "A" | "B" | "C",
        string | number
    ]> = entry;
}

// $ExpectType void
enumWrapper.forEach((value, key, wrapper, index) => {
    // $ExpectType string | number
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<{ A: number; B: number; C: string; }, string | number>
    wrapper;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType number[]
enumWrapper.map((value, key, wrapper, index) => {
    // $ExpectType string | number
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<{ A: number; B: number; C: string; }, string | number>
    wrapper;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType ("A" | "B" | "C")[]
enumWrapper.getKeys();

// $ExpectType (string | number)[]
enumWrapper.getValues();

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the entry tuple because of
// this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntries: Readonly<
    ["A" | "B" | "C", string | number]
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
enumWrapper.indexOfValue(10);
// $ExpectType number
enumWrapper.indexOfValue(num);
// $ExpectType number
enumWrapper.indexOfValue("c");
// $ExpectType number
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
    // $ExpectType string | number
    numstr;
}

if (enumWrapper.isValue(numstrOrNull)) {
    // $ExpectType string | number
    numstrOrNull;
}

if (enumWrapper.isValue(numstrOrUndefined)) {
    // $ExpectType string | number
    numstrOrUndefined;
}

// $ExpectType string | number
enumWrapper.asValueOrThrow(numstr);
// $ExpectType string | number
enumWrapper.asValueOrThrow(numstrOrNull);
// $ExpectType string | number
enumWrapper.asValueOrThrow(numstrOrUndefined);

// $ExpectType string | number | undefined
enumWrapper.asValueOrDefault(numstr);
// $ExpectType string | number | undefined
enumWrapper.asValueOrDefault(numstrOrNull);
// $ExpectType string | number | undefined
enumWrapper.asValueOrDefault(numstrOrUndefined);

// $ExpectType string | number | undefined
enumWrapper.asValueOrDefault(numstr, undefined);
// $ExpectType string | number
enumWrapper.asValueOrDefault(numstr, num);
// $ExpectType string | number
enumWrapper.asValueOrDefault(numstr, str);
// $ExpectType string | number
enumWrapper.asValueOrDefault(numstr, numstr);
// $ExpectType string | number | undefined
enumWrapper.asValueOrDefault(num, numstrOrUndefined);

// $ExpectType "A" | "B" | "C"
enumWrapper.getKey(numstr);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKey(numstrOrNull);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKey(numstrOrUndefined);

// $ExpectType "A" | "B" | "C"
enumWrapper.getKey(numstr, key);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKey(numstr, keyOrUndefined);
// $ExpectError
enumWrapper.getKey(numstr, str);
// $ExpectError
enumWrapper.getKey(numstr, strOrUndefined);

// $ExpectType string | number
enumWrapper.getValue(key);
// $ExpectType string | number | undefined
enumWrapper.getValue(keyOrNull);
// $ExpectType string | number | undefined
enumWrapper.getValue(keyOrUndefined);
// $ExpectError
enumWrapper.getValue(str);

// $ExpectType string | number | undefined
enumWrapper.getValue(keyOrNull, undefined);
// $ExpectType string | number
enumWrapper.getValue(keyOrNull, num);
// $ExpectType string | number
enumWrapper.getValue(keyOrNull, str);
// $ExpectType string | number
enumWrapper.getValue(keyOrNull, numstr);
// $ExpectType string | number | undefined
enumWrapper.getValue(keyOrNull, numstrOrUndefined);
