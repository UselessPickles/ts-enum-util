import { $enum } from "ts-enum-util";

// Enum-like object with number values
const TestEnum = {
    A: 1,
    B: 2,
    C: 3,
};

declare const str: string;
declare const strOrNull: string | null;
declare const strOrUndefined: string | undefined;

declare const num: number;
declare const numOrNull: number | null;
declare const numOrUndefined: number | undefined;

declare const key: keyof typeof TestEnum;
declare const keyOrNull: keyof typeof TestEnum | null;
declare const keyOrUndefined: keyof typeof TestEnum | undefined;

const enumWrapper = $enum(TestEnum);

// $ExpectType EnumWrapper<number, { A: number; B: number; C: number; }>
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
const testEntry: Readonly<["A" | "B" | "C", number]> = enumWrapper[0];
// $ExpectError
enumWrapper[0] = ["A", TestEnum.A]; // immutable

// $ExpectType IterableIterator<"A" | "B" | "C">
enumWrapper.keys();

// $ExpectType IterableIterator<number>
enumWrapper.values();

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the iterated entry tuples
// because of this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntryIterator: IterableIterator<Readonly<["A" | "B" | "C", number]>> =
    enumWrapper.entries();
for (const entry of enumWrapper.entries()) {
    const testIteratedEntry: Readonly<["A" | "B" | "C", number]> = entry;
}

// $ExpectType void
enumWrapper.forEach((value, key, collection, index) => {
    // $ExpectType number
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<number, { A: number; B: number; C: number; }>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType number[]
enumWrapper.map((value, key, collection, index) => {
    // $ExpectType number
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<number, { A: number; B: number; C: number; }>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType ("A" | "B" | "C")[]
enumWrapper.getKeys();

// $ExpectType number[]
enumWrapper.getValues();

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the entry tuple because of
// this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntries: Readonly<["A" | "B" | "C", number]>[] =
    enumWrapper.getEntries();

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
    // $ExpectType number
    num;
}

if (enumWrapper.isValue(numOrNull)) {
    // $ExpectType number
    numOrNull;
}

if (enumWrapper.isValue(numOrUndefined)) {
    // $ExpectType number
    numOrUndefined;
}

// $ExpectType number
enumWrapper.asValueOrThrow(num);
// $ExpectType number
enumWrapper.asValueOrThrow(numOrNull);
// $ExpectType number
enumWrapper.asValueOrThrow(numOrUndefined);
// $ExpectError
enumWrapper.asValueOrThrow(str);

// $ExpectType number | undefined
enumWrapper.asValueOrDefault(num);
// $ExpectType number | undefined
enumWrapper.asValueOrDefault(numOrNull);
// $ExpectType number | undefined
enumWrapper.asValueOrDefault(numOrUndefined);
// $ExpectError
enumWrapper.asValueOrDefault(str);

// $ExpectType number | undefined
enumWrapper.asValueOrDefault(num, undefined);
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

// $ExpectType number
enumWrapper.getValueOrThrow(key);
// $ExpectType number
enumWrapper.getValueOrThrow(keyOrNull);
// $ExpectType number
enumWrapper.getValueOrThrow(keyOrUndefined);
// $ExpectType number
enumWrapper.getValueOrThrow(str);
// $ExpectType number
enumWrapper.getValueOrThrow(strOrNull);
// $ExpectType number
enumWrapper.getValueOrThrow(strOrUndefined);

// $ExpectType number | undefined
enumWrapper.getValueOrDefault(str);
// $ExpectType number | undefined
enumWrapper.getValueOrDefault(strOrNull);
// $ExpectType number | undefined
enumWrapper.getValueOrDefault(strOrUndefined);

// $ExpectType number | undefined
enumWrapper.getValueOrDefault(str, undefined);
// $ExpectType number
enumWrapper.getValueOrDefault(str, num);
// $ExpectType number | undefined
enumWrapper.getValueOrDefault(str, numOrUndefined);
// $ExpectError
enumWrapper.getValueOrDefault(str, str);
